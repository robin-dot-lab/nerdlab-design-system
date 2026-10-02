// Shared by the Storybook test scripts: serves storybook-static/ and lists its stories.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.resolve('storybook-static');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };

/** Starts a static server on a free port; returns its base URL and a close function. */
export async function serveStorybook() {
  if (!fs.existsSync(path.join(ROOT, 'index.json'))) throw new Error('storybook-static/ missing: run `pnpm --filter @robin-dot-lab/docs build` first');
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, r));
  return { base: `http://localhost:${server.address().port}`, close: () => server.close() };
}

/** Story entries of the build, optionally filtered by STORY_FILTER (substring of the id). */
export function listStories() {
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'index.json'), 'utf8'));
  return Object.values(index.entries).filter((e) => e.type === 'story' && e.id.includes(process.env.STORY_FILTER ?? ''));
}

export const storyUrl = (base, id, theme) => `${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}`;

/** Waits until a story has rendered: React Aria collections put a hidden <template> first. */
export async function waitForStory(page) {
  await page.waitForSelector('#storybook-root > :not(template)', { timeout: 10_000 });
  await page.evaluate(() => document.fonts.ready);
}
