import fs from 'node:fs';
import path from 'node:path';

try {
  const clientPath = path.resolve('node_modules/vite/dist/client/client.mjs');
  if (fs.existsSync(clientPath)) {
    let content = fs.readFileSync(clientPath, 'utf-8');
    if (content.includes('reject(/* @__PURE__ */ new Error("WebSocket closed without opened."));')) {
      content = content.replace(
        'reject(/* @__PURE__ */ new Error("WebSocket closed without opened."));',
        'resolve();'
      );
      fs.writeFileSync(clientPath, content, 'utf-8');
      console.log('Patched vite client WebSocket rejection successfully.');
    }
  }
} catch (err) {
  // Silent catch
}
