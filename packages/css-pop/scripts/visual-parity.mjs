// Visual parity: the Pop showcase and dashboard must render pixel-identical with the
// original monolithic stylesheet and with the layered dist/pop.css (+ fonts.css).
// Uses the locally installed Chrome (Playwright channel "chrome"), no browser download.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const REF_DIR = path.resolve('../../design-system-nerdlab-pop');
const PAGES = ['design-system-preview.html', 'dashboard-preview.html'];
const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 375, height: 812 }];
const SCHEMES = ['light', 'dark'];
const FREEZE = '<style>*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}</style>';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nl-parity-'));
const refOut = path.join(tmp, 'ref'), newOut = path.join(tmp, 'new');
fs.mkdirSync(refOut); fs.mkdirSync(newOut);
fs.copyFileSync(path.join(REF_DIR, 'design-system.css'), path.join(refOut, 'design-system.css'));
fs.copyFileSync('dist/pop.css', path.join(newOut, 'pop.css'));
fs.copyFileSync('dist/fonts.css', path.join(newOut, 'fonts.css'));
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(REF_DIR, page), 'utf8').replace('</head>', `${FREEZE}</head>`);
  const link = '<link rel="stylesheet" href="design-system.css">';
  if (!html.includes(link)) throw new Error(`${page}: stylesheet link not found`);
  fs.writeFileSync(path.join(refOut, page), html);
  fs.writeFileSync(path.join(newOut, page), html.replace(link, '<link rel="stylesheet" href="fonts.css">\n<link rel="stylesheet" href="pop.css">'));
}

const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
let failures = 0;
async function shot(dir, page, viewport, colorScheme) {
  const ctx = await browser.newContext({ viewport, colorScheme, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('file://' + path.join(dir, page), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  const buf = await p.screenshot({ fullPage: true });
  await ctx.close();
  return PNG.sync.read(buf);
}
for (const page of PAGES) for (const viewport of VIEWPORTS) for (const scheme of SCHEMES) {
  const label = `${page} @${viewport.width} ${scheme}`;
  const a = await shot(refOut, page, viewport, scheme), b = await shot(newOut, page, viewport, scheme);
  if (a.width !== b.width || a.height !== b.height) { failures++; console.error(`✗ ${label}: size ${a.width}×${a.height} vs ${b.width}×${b.height}`); continue; }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0 });
  if (n > 0) { failures++; const f = path.join(tmp, `diff-${page}-${viewport.width}-${scheme}.png`); fs.writeFileSync(f, PNG.sync.write(diff)); console.error(`✗ ${label}: ${n} px differ → ${f}`); }
  else console.log(`✓ ${label}: identical (${a.width}×${a.height})`);
}
await browser.close();
if (failures) { console.error(`${failures} visual parity failure(s)`); process.exit(1); }
console.log('visual parity ok');
