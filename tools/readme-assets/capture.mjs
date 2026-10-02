// Regenerates the README images in docs/readme/ from the built packages, Storybook and dashboard.
//   pnpm build && node tools/readme-assets/capture.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import pw from 'playwright-core';
import { routeTestFonts } from '../test-fonts/route.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'docs/readme');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';

// One server for the whole repo: the banner page links to packages/*/dist by relative path.
const server = http.createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
fs.mkdirSync(OUT, { recursive: true });

async function shot(url, file, { width, height, theme = 'light', clip, scale = 1, before } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, colorScheme: theme });
  await context.addInitScript((t) => localStorage.setItem('nl-dashboard-theme', t), theme);
  await routeTestFonts(context);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.fonts.ready);
  if (before) await before(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, file), clip });
  await context.close();
  console.log(`  + docs/readme/${file}`);
}
const story = (id, theme = 'light') => `${base}/apps/docs/storybook-static/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=theme:${theme}`;

await shot(`${base}/tools/readme-assets/banner.html`, 'banner.png', { width: 1280, height: 600, scale: 2 });
await shot(`${base}/apps/dashboard/dist/`, 'dashboard-light.png', { width: 1440, height: 1000 });
await shot(`${base}/apps/dashboard/dist/`, 'dashboard-dark.png', { width: 1440, height: 1000, theme: 'dark' });
await shot(story('components-overlays--confirm'), 'dialog.png', { width: 720, height: 460 });
await shot(story('components-overlays--menu-open', 'dark'), 'menu.png', { width: 720, height: 460 });
await shot(story('components-display--callouts'), 'callouts.png', { width: 720, height: 460 });
await shot(story('components-decor--stickers-and-bursts'), 'decor.png', { width: 720, height: 200 });
await shot(story('charts-all--line'), 'chart.png', { width: 720, height: 460, theme: 'light' });
await shot(story('components-forms--full-form', 'dark'), 'form.png', { width: 720, height: 460 });

await browser.close();
server.close();
