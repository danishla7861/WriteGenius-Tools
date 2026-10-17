import { NextFunction, Request, Response } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 60; // 60 requests per 10 minutes window per IP
const ipRecords = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale IPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRecords.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < WINDOW_MS);
    if (record.timestamps.length === 0) {
      ipRecords.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  let record = ipRecords.get(ip);
  if (!record) {
    record = { timestamps: [] };
    ipRecords.set(ip, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter(ts => now - ts < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a few moments before submitting another AI request.',
      retryAfterSeconds: Math.ceil(
        (record.timestamps[0] + WINDOW_MS - now) / 1000
      ),
    });
    return;
  }

  record.timestamps.push(now);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader(
    'X-RateLimit-Remaining',
    (MAX_REQUESTS - record.timestamps.length).toString()
  );
  next();
}
