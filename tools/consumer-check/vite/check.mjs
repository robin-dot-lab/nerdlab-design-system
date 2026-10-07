// Checks the consumer app built from the registry: renders, skin and palette applied, icons and chart,
// axe clean in three palettes light and dark, the README's Dialog example, no console error.
import fs from 'node:fs'; import http from 'node:http'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const pw = req('playwright-core'); const AXE = fs.readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8');
const ROOT = path.resolve('dist'); const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let f = path.join(ROOT, new URL(q.url, 'http://x').pathname); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) return r.writeHead(404).end(); r.writeHead(200, { 'content-type': T[path.extname(f)] ?? 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((r) => srv.listen(0, r));
const b = await pw.chromium.launch({ channel: 'chrome' }); const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const errors = [];  page.on('console', (m) => m.type() === 'error' && errors.push(m.text())); page.on('requestfailed', (r) => errors.push('failed ' + r.url())); page.on('response', (r) => r.status() >= 400 && errors.push(r.status() + ' ' + r.url())); page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://localhost:${srv.address().port}/`, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
let failures = 0;
const ok = (c, l) => { if (!c) failures++; console.log(`${c ? '✓' : '✗'} ${l}`); };
const axe = async () => { if (!(await page.evaluate(() => 'axe' in window))) await page.addScriptTag({ content: AXE }); return page.evaluate(async () => (await axe.run(document)).violations.map((v) => `${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(', ')}`)); };
ok(await page.getByRole('heading', { name: 'Consumer test' }).isVisible(), 'page renders');
const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim().toLowerCase());
if (process.env.SKIN === 'bento') {
  // Bento (ADR-030): tiles without outline on a grey-green page; it has one palette, data-palette does nothing.
  ok(await page.evaluate(() => getComputedStyle(document.querySelector('.nl-window')).borderTopWidth) === '0px', 'Bento skin applied (window without border)');
  ok(await page.evaluate(() => getComputedStyle(document.body).backgroundColor) === 'rgb(236, 238, 234)', 'Bento page background');
  ok(await primary() === '#2e5641', 'data-palette has no effect under Bento (forest primary)');
} else {
  ok(await page.evaluate(() => getComputedStyle(document.querySelector('.nl-window')).borderTopWidth) === '2px', 'skin applied (window has its 2px ink border)');
  ok(await primary() === '#f5a3c7', 'Sorbet palette active from <html data-palette>');
}
ok(await page.locator('svg.nl-icon').count() >= 2, 'icons render');
ok(await page.getByRole('list', { name: 'Tickets per event' }).getByRole('listitem').count() === 4, 'chart renders its four bars');
ok(await page.getByRole('listbox', { name: 'Messages' }).getByRole('option', { selected: true }).count() === 1, 'mail: message list renders with its selection');
for (const p of ['sorbet', 'ink', 'mono-retro']) for (const dark of [false, true]) {
  await page.getByRole('combobox', { name: 'Palette' }).selectOption(p);
  const sw = page.getByRole('switch', { name: 'Dark theme' }); if ((await sw.isChecked()) !== dark) await sw.click();
  await page.waitForTimeout(300); const v = await axe();
  ok(v.length === 0, `axe clean in ${p} ${dark ? 'dark' : 'light'}${v.length ? ' → ' + v.join(' | ') : ''}`);
}
await page.getByRole('button', { name: 'Join the party' }).click();
const dlg = page.getByRole('dialog', { name: 'RSVP.EXE' }); ok(await dlg.isVisible(), 'dialog opens from the README example');
await page.keyboard.press('Escape'); await dlg.waitFor({ state: 'detached' }); ok(true, 'Escape closes it');
ok(errors.length === 0, `no console error${errors.length ? ' → ' + errors.join(' | ') : ''}`);
await b.close(); srv.close();
if (failures) { console.error(`${failures} consumer check(s) failed`); process.exit(1); }
console.log('consumer check ok');
