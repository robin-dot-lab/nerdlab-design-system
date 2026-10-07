// Checks the Next.js consumer after `next build`: the server's HTML already holds the kit's markup in
// French (locale from <I18nProvider> in a server layout), the page hydrates without a console error,
// client pieces work (dialog, tabs, chart tooltip data), axe is clean.
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const pw = req('playwright-core'); const AXE = fs.readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8');
const PORT = 4300 + Math.floor(Math.random() * 500); const URL_ = `http://localhost:${PORT}/`;
// Own process group: `npx` starts `next` as a child, and killing npx alone left the server (and this
// script) running until the CI job timed out.
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { stdio: ['ignore', 'ignore', 'inherit'], detached: true });
let failures = 0;
const ok = (c, l) => { if (!c) failures++; console.log(`${c ? '✓' : '✗'} ${l}`); };
try {
  let html = '';
  for (let i = 0; i < 60 && !html; i++) { try { const r = await fetch(URL_); if (r.ok) html = await r.text(); } catch { await new Promise((r) => setTimeout(r, 500)); } }
  ok(html.includes('Consumer test (Next.js)'), 'server renders the page');
  ok(html.includes('nl-window') && html.includes('nl-stat'), 'server HTML carries the kit’s classes');
  ok(html.includes('Fil d’Ariane') && html.includes('Hausse de 10') && html.includes('Attention'), 'server HTML is French (I18nProvider in a server layout)');

  const b = await pw.chromium.launch({ channel: 'chrome' }); const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errors = []; page.on('console', (m) => m.type() === 'error' && errors.push(m.text())); page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
  await page.goto(URL_, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
  ok(await page.evaluate(() => getComputedStyle(document.querySelector('.nl-window')).borderTopWidth) === (process.env.SKIN === 'bento' ? '0px' : '2px'), `${process.env.SKIN ?? 'candy'} skin applied`);
  ok(await page.getByRole('navigation', { name: 'Fil d’Ariane' }).isVisible(), 'breadcrumb named in French');
  ok(await page.getByRole('list', { name: 'Billets par événement' }).getByRole('listitem').count() === 4, 'chart renders its four bars');
  ok(await page.getByRole('link', { name: /^billet\.pdf, .+, télécharger$/ }).isVisible(), 'mail: attachment from a server component, named in French');
  await page.getByRole('tab', { name: 'Détail' }).click();
  ok(await page.getByRole('tabpanel', { name: 'Détail' }).isVisible(), 'tabs hydrate and switch');
  await page.getByRole('button', { name: 'Rejoindre la fête' }).click();
  const dlg = page.getByRole('dialog', { name: 'RSVP.EXE' }); ok(await dlg.isVisible(), 'dialog opens');
  await page.getByRole('button', { name: 'Fermer' }).click(); await dlg.waitFor({ state: 'detached' }); ok(true, 'its French close button closes it');
  await page.addScriptTag({ content: AXE });
  const v = await page.evaluate(async () => (await axe.run(document)).violations.map((x) => `${x.id}: ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(', ')}`));
  ok(v.length === 0, `axe clean${v.length ? ' → ' + v.join(' | ') : ''}`);
  ok(errors.length === 0, `no console error (hydration included)${errors.length ? ' → ' + errors.join(' | ') : ''}`);
  await b.close();
} finally { try { process.kill(-server.pid, 'SIGTERM'); } catch {} }
if (failures) { console.error(`${failures} Next.js consumer check(s) failed`); process.exit(1); }
console.log('next consumer check ok');
process.exit(0);
