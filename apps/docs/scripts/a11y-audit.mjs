// Accessibility audit of every story in the static Storybook build.
// Each story is rendered in the installed Chrome (Playwright channel "chrome"), in light and dark
// themes, at desktop and phone widths; axe-core runs on #storybook-root and on the overlays React Aria
// portals to <body>. Any violation or console error fails the run. Run after `storybook build`
// (turbo: test depends on build). STORY_FILTER=<substring> audits only the matching story ids;
// PALETTE=<id> renders every story in that palette (CI audits each palette in its own job);
// SKIN=bento audits the Bento skin instead of Candy.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import pw from 'playwright-core';
import { missingFonts, routeTestFonts } from '../../../tools/test-fonts/route.mjs';
import { listStories, SKIN, storyUrl } from './lib/storybook.mjs';

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const ROOT = path.resolve('storybook-static');
const THEMES = ['light', 'dark'];
// VIEWPORT=desktop|phone runs one width only (CI shards the audit across machines).
const VIEWPORTS = [{ name: 'desktop', width: 1280, height: 800 }, { name: 'phone', width: 390, height: 844 }]
  .filter((v) => !process.env.VIEWPORT || v.name === process.env.VIEWPORT);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };

if (!fs.existsSync(path.join(ROOT, 'index.json'))) throw new Error('storybook-static/ missing: run `pnpm --filter @robin-dot-lab/docs build` first');

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const stories = listStories();
const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
let failures = 0;

for (const vp of VIEWPORTS) for (const theme of THEMES) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  // iframe.html declares no favicon: the browser's automatic /favicon.ico request is not a story error.
  await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
  await routeTestFonts(context); // fonts from the local cache: no network dependency
  for (const story of stories) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(storyUrl(base, story.id, theme), { waitUntil: 'networkidle' });
    // React Aria collections render a hidden <template> first: wait for a real, visible child.
    await page.waitForSelector('#storybook-root > :not(template)', { timeout: 10_000 }).catch(() => errors.push('story did not render'));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250); // play functions and enter transitions
    await page.addScriptTag({ content: AXE });
    // The story root, plus overlays React Aria portals to <body> (dialogs, popovers, menus).
    // iframes: false — an email in the EmailViewer is third-party content in a sandbox with an opaque origin;
    // axe cannot audit it, and its attempt to message the frame is a console error in Firefox and WebKit.
    const violations = await page.evaluate(async () => (await window.axe.run({
      include: [...document.body.children].filter((el) => el.id === 'storybook-root' || el.matches('.nl-dialog-overlay, .nl-popover, :has(.nl-dialog-overlay, .nl-popover)')),
    }, { iframes: false })).violations
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`));
    const label = `${vp.name} ${theme}${SKIN === 'bento' ? ' bento' : ''}${process.env.PALETTE ? ` ${process.env.PALETTE}` : ''} ${story.id}`;
    if (violations.length || errors.length) {
      failures++;
      console.error(`✗ ${label}`);
      for (const v of violations) console.error(`    axe  ${v}`);
      for (const e of errors) console.error(`    console  ${e.slice(0, 200)}`);
    } else console.log(`✓ ${label}`);
    await page.close();
  }
  await context.close();
}
await browser.close();
server.close();
if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
console.log(`${stories.length} stories × ${THEMES.length} themes × ${VIEWPORTS.length} viewports`);
if (failures) { console.error(`${failures} failing render(s)`); process.exit(1); }
console.log('a11y audit ok');
