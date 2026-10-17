import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, r, g, b, a = 255) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);

    // CRC32
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      crc = updateCrc(crc, buf[i]);
    }
    buf.writeInt32BE(~crc, 8 + len);
    return buf;
  }

  // Precomputed CRC table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function updateCrc(crc, byte) {
    return crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with a gradient / brand pattern
  const rowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rowLen * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // filter type 0: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Gradient from #4776FF (71, 118, 255) to #8957FF (137, 87, 255)
      const t = (x + y) / (width + height);
      const pr = Math.round(71 + (137 - 71) * t);
      const pg = Math.round(118 + (87 - 118) * t);
      const pb = Math.round(255);
      
      // Rounded icon border & inner content
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxR = width * 0.45;

      if (dist < maxR) {
        rawData[pxOffset] = pr;
        rawData[pxOffset + 1] = pg;
        rawData[pxOffset + 2] = pb;
        rawData[pxOffset + 3] = a;
      } else {
        rawData[pxOffset] = 7;
        rawData[pxOffset + 1] = 11;
        rawData[pxOffset + 2] = 20;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 71, 118, 255));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 71, 118, 255));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 71, 118, 255));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 71, 118, 255));

console.log('PWA PNG icons generated successfully!');
