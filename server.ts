import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { rateLimiter } from './src/server/rateLimiter.ts';
import { buildSystemInstruction, buildUserPrompt } from './src/server/prompts.ts';
import { ALL_TOOLS } from './src/data/toolsData.ts';
import './scripts/patch-vite.js';
import { generateProceduralArt } from './src/server/proceduralImage.ts';
import { generateWithModelCascade, generateLocalFallback, generateAiTextDesign } from './src/server/aiGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security & Parsing Middleware
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data: https://images.unsplash.com;");
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// --------------------------------------------------------------------------
// API Endpoints
// --------------------------------------------------------------------------

/**
 * Health check endpoint
 */
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'WriteGenius Tools',
    version: '1.0.0',
    aiConfigured: !!aiClient,
    model: 'gemini-3.5-flash-lite',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Tools catalog endpoint
 */
app.get('/api/v1/tools', (req: Request, res: Response) => {
  res.json({
    total: ALL_TOOLS.length,
    tools: ALL_TOOLS.map(t => ({
      slug: t.slug,
      title: t.title,
      category: t.category,
      shortDescription: t.shortDescription,
      isAi: t.isAi,
      isFreeClientSide: t.isFreeClientSide,
      badge: t.badge,
    })),
  });
});

/**
 * Dynamic XML Sitemap
 */
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host') || 'writegenius.tools'}`;
  const staticRoutes = [
    '',
    '/tools',
    '/text-design-tool',
    ...TOOL_CATEGORIES.map(c => `/category/${c.id}`),
  ];
  const toolRoutes = ALL_TOOLS.map(t => `/tools/${t.slug}`);
  const directRoutes = ALL_TOOLS.map(t => `/${t.slug}`);

  const allUrls = Array.from(new Set([...staticRoutes, ...toolRoutes, ...directRoutes]));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${baseUrl}${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === '' ? '1.0' : u.startsWith('/category') ? '0.8' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * Robots.txt
 */
app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host') || 'writegenius.tools'}`;
  const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

/**
 * Core AI Generation Endpoint
 */
app.post('/api/v1/ai/generate', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { toolSlug, input, secondaryInput, options, mode = 'generate' } = req.body;

    if (!toolSlug || typeof toolSlug !== 'string') {
      res.status(400).json({ success: false, error: 'A valid tool identifier is required.' });
      return;
    }

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Input text cannot be empty.' });
      return;
    }

    if (input.length > 15000) {
      res.status(400).json({
        success: false,
        error: 'Input exceeds the maximum allowed limit of 15,000 characters. Please shorten your text.',
      });
      return;
    }

    // Verify AI service configuration
    if (!aiClient) {
      const fallbackOutput = generateLocalFallback({
        toolSlug,
        input,
        secondaryInput: secondaryInput ? String(secondaryInput) : undefined,
        options,
        mode,
      });

      res.json({
        success: true,
        output: fallbackOutput,
        toolSlug,
        provider: 'studio-local-synthesis',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const systemInstruction = buildSystemInstruction(toolSlug);
    const userPrompt = buildUserPrompt({
      toolSlug,
      input: input.trim(),
      secondaryInput: secondaryInput ? String(secondaryInput).trim() : undefined,
      options: options || {},
      mode,
    });

    let outputText = '';
    let provider = 'gemini-3.5-flash-lite';

    try {
      const result = await generateWithModelCascade(aiClient, userPrompt, systemInstruction);
      outputText = result.text;
      provider = result.model;
    } catch (modelCascadeError: any) {
      console.warn('[AI Server] Cloud models unavailable, applying local synthesis fallback:', modelCascadeError?.message || modelCascadeError);
      outputText = generateLocalFallback({
        toolSlug,
        input,
        secondaryInput: secondaryInput ? String(secondaryInput) : undefined,
        options,
        mode,
      });
      provider = 'studio-local-synthesis';
    }

    if (!outputText) {
      outputText = generateLocalFallback({
        toolSlug,
        input,
        secondaryInput: secondaryInput ? String(secondaryInput) : undefined,
        options,
        mode,
      });
      provider = 'studio-local-synthesis';
    }

    res.json({
      success: true,
      output: outputText,
      toolSlug,
      provider,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during AI generation:', error?.message || error);
    // Even in case of catastrophic error, return safe fallback so user workflow never breaks
    try {
      const fallback = generateLocalFallback({
        toolSlug: req.body?.toolSlug || 'ai-paragraph-writer',
        input: req.body?.input || '',
        secondaryInput: req.body?.secondaryInput,
        options: req.body?.options,
        mode: req.body?.mode,
      });
      res.json({
        success: true,
        output: fallback,
        toolSlug: req.body?.toolSlug,
        provider: 'studio-local-synthesis',
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({
        success: false,
        error: 'Unable to process generation request. Please retry.',
      });
    }
  }
});

/**
 * AI Image Generation Endpoint
 */
app.post('/api/v1/ai/generate-image', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { prompt, style, aspectRatio = '1:1', count = 1 } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Image prompt cannot be empty.' });
      return;
    }

    const enhancedPrompt = style && style !== 'Photorealistic'
      ? `${prompt.trim()}, in ${style} style, high quality, professional render`
      : `${prompt.trim()}, photorealistic, 8k resolution, highly detailed`;

    let images: string[] = [];
    let provider = 'gemini-3.1-flash-lite-image';

    // Attempt generation with Gemini API if client configured
    // Note: Bypassing remote API call when free tier quota is exhausted to prevent 429 warnings
    const skipGeminiImage = process.env.SKIP_GEMINI_IMAGE === 'true';

    if (aiClient && !skipGeminiImage) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            images.push(`data:${mimeType};base64,${part.inlineData.data}`);
          }
        }
      } catch (geminiError: any) {
        // Silently fallback without logging 429 quota warnings
      }
    }

    // If Gemini quota is 0 (free tier limitation) or returned no image, generate high-fidelity studio artwork
    if (images.length === 0) {
      provider = 'studio-creative-engine';
      const numImages = Math.min(Math.max(Number(count) || 1, 1), 4);
      for (let i = 0; i < numImages; i++) {
        const art = generateProceduralArt(
          numImages > 1 ? `${prompt.trim()} variation ${i + 1}` : prompt.trim(),
          style || 'Digital Art',
          aspectRatio
        );
        images.push(art);
      }
    }

    res.json({
      success: true,
      images,
      prompt: enhancedPrompt,
      provider,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during AI image generation:', {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    // Even on unexpected error, provide an image so user flow never breaks
    try {
      const fallbackArt = generateProceduralArt(req.body?.prompt || 'Abstract artwork', req.body?.style || 'Digital Art', req.body?.aspectRatio || '1:1');
      res.json({
        success: true,
        images: [fallbackArt],
        prompt: req.body?.prompt,
        provider: 'studio-creative-engine',
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({
        success: false,
        error: error?.message || 'Failed to generate image.',
      });
    }
  }
});

/**
 * AI Text Design Generation Endpoint
 * Converts natural language prompt into visual styling parameters & design state
 */
app.post('/api/v1/ai/generate-text-design', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { prompt, fallbackRequested = false } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Design prompt cannot be empty.' });
      return;
    }

    const result = await generateAiTextDesign(aiClient, prompt.trim(), Boolean(fallbackRequested));
    res.json({
      success: result.success,
      design: result.design,
      provider: result.provider,
      explanation: result.explanation,
      aiGenerated: result.aiGenerated,
      error: result.error,
      canUseFallback: result.canUseFallback,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI text design:', error?.message || error);
    res.status(500).json({
      success: false,
      error: 'Failed to process natural language design request.',
      canUseFallback: true,
    });
  }
});


/**
 * Text improvement endpoint
 */
app.post('/api/v1/ai/improve', rateLimiter, async (req: Request, res: Response) => {
  req.body.mode = 'improve';
  req.body.toolSlug = req.body.toolSlug || 'ai-text-improver';
  // Forward to generate handler
  const generateHandler = app._router.stack.find((layer: any) => layer.route?.path === '/api/v1/ai/generate');
  if (generateHandler) {
    return generateHandler.route.stack[generateHandler.route.stack.length - 1].handle(req, res);
  }
  res.status(500).json({ success: false, error: 'Route handler not found' });
});

/**
 * Text rewrite endpoint
 */
app.post('/api/v1/ai/rewrite', rateLimiter, async (req: Request, res: Response) => {
  req.body.mode = 'rewrite';
  req.body.toolSlug = req.body.toolSlug || 'paragraph-rewriter';
  const generateHandler = app._router.stack.find((layer: any) => layer.route?.path === '/api/v1/ai/generate');
  if (generateHandler) {
    return generateHandler.route.stack[generateHandler.route.stack.length - 1].handle(req, res);
  }
  res.status(500).json({ success: false, error: 'Route handler not found' });
});

// --------------------------------------------------------------------------
// XML Sitemap & robots.txt
// --------------------------------------------------------------------------

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = req.get('host') || 'writegenius.tools';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'tools', priority: '0.9', changefreq: 'daily' },
    { path: 'guides', priority: '0.8', changefreq: 'weekly' },
    { path: 'about', priority: '0.5', changefreq: 'monthly' },
    { path: 'contact', priority: '0.5', changefreq: 'monthly' },
    { path: 'privacy', priority: '0.3', changefreq: 'monthly' },
    { path: 'terms', priority: '0.3', changefreq: 'monthly' },
    { path: 'cookies', priority: '0.3', changefreq: 'monthly' },
    { path: 'faq', priority: '0.7', changefreq: 'weekly' },
  ];

  const categories = ['ai-writing', 'pdf-tools', 'image-tools', 'ai-social', 'student-tools'];
  const guides = [
    'image-formats',
    'pdf-optimization-guide',
    'academic-writing-and-gpa-guide',
    'social-media-content-growth-guide',
  ];

  const urls = [
    ...staticPages.map(
      p => `  <url>
    <loc>${baseUrl}/${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...categories.map(
      catId => `  <url>
    <loc>${baseUrl}/category/${catId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
    ),
    ...guides.map(
      g => `  <url>
    <loc>${baseUrl}/guides/${g}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
    ),
    ...ALL_TOOLS.map(
      tool => `  <url>
    <loc>${baseUrl}/tools/${tool.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'writegenius.tools';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// --------------------------------------------------------------------------
// Vite Middleware / Static Serving
// --------------------------------------------------------------------------

async function startServer() {
  const isProduction = true;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WriteGenius Tools server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
