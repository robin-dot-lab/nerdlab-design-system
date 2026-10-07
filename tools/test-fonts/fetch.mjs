// Downloads every Google Fonts stylesheet used by the skins and ALL the font files they reference
// (every unicode-range subset, not only those a given page happens to load), into ./cache.
// The stylesheet is requested by the same Chrome the tests use, because Google varies it by user agent.
// Fonts are under the SIL Open Font License, which permits redistribution.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import pw from 'playwright-core';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIR = path.join(import.meta.dirname, 'cache');
const SOURCES = ['packages/css-candy/src/fonts.css', 'packages/css-bento/src/fonts.css'];

const cssUrls = SOURCES.flatMap((f) => [...fs.readFileSync(path.join(ROOT, f), 'utf8').matchAll(/@import url\('([^']+)'\)/g)].map((m) => m[1]));
const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
const context = await browser.newContext();
const entries = {};
const save = async (url) => {
  const res = await context.request.get(url, { timeout: 120_000 });
  if (!res.ok()) throw new Error(`${res.status()} ${url}`);
  const body = await res.body();
  const ext = url.includes('fonts.gstatic.com') ? path.extname(new URL(url).pathname) : '.css';
  const file = crypto.createHash('sha256').update(url).digest('hex').slice(0, 16) + ext;
  fs.writeFileSync(path.join(DIR, file), body);
  entries[url] = { file, contentType: res.headers()['content-type'] ?? 'application/octet-stream', bytes: body.length };
  return body;
};

fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });
// The page-level request gives Google the real browser user agent.
const page = await context.newPage();
const ua = await page.evaluate(() => navigator.userAgent);
await context.setExtraHTTPHeaders({ 'user-agent': ua });
for (const cssUrl of cssUrls) {
  const css = (await save(cssUrl)).toString('utf8');
  const fontUrls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]))];
  for (const u of fontUrls) await save(u);
  console.log(`${cssUrl.slice(0, 70)}… → ${fontUrls.length} font files`);
}
await browser.close();
fs.writeFileSync(path.join(DIR, 'manifest.json'), JSON.stringify({ fetchedWith: ua, sources: SOURCES, entries }, null, 2) + '\n');
const total = Object.values(entries).reduce((a, e) => a + e.bytes, 0);
console.log(`${Object.keys(entries).length} files, ${(total / 1024).toFixed(0)} KB in tools/test-fonts/cache`);
