// Integration test of the dashboard built against the packages' dist/ files.
// Serves dist/, drives the installed Chrome, and checks: no console error, no axe violation
// (light/dark × 1280/390 px), real user journeys through the library components, and a clean
// render in Firefox and WebKit.
// SHOTS=<dir> also writes screenshots for manual review.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import pw from 'playwright-core';
import { missingFonts, routeTestFonts } from '../../../tools/test-fonts/route.mjs';

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const ROOT = path.resolve('dist');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
if (!fs.existsSync(path.join(ROOT, 'index.html'))) throw new Error('dist/ missing: run `pnpm --filter @robin-dot-lab/dashboard build` first');

const server = http.createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/`;
const shots = process.env.SHOTS;
if (shots) fs.mkdirSync(shots, { recursive: true });

const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
const failures = [];
const check = (ok, label) => { if (ok) console.log(`✓ ${label}`); else { failures.push(label); console.error(`✗ ${label}`); } };

async function open(viewport, theme, engine = browser) {
  const context = await engine.newContext({ viewport, colorScheme: theme, acceptDownloads: true });
  await context.addInitScript((t) => localStorage.setItem('nl-dashboard-theme', t), theme);
  await routeTestFonts(context); // fonts from the local cache: no network dependency
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.nl-stat__value');
  return { context, page, errors };
}
const chartCard = (page) => page.locator('.nl-card').filter({ has: page.locator('.nl-chart-card__head') }).first();
async function axe(page) {
  if (!(await page.evaluate(() => 'axe' in window))) await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => (await window.axe.run(document)).violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`));
}

// 1. Static audit: every theme × width
for (const [w, h] of [[1280, 900], [390, 844]]) for (const theme of ['light', 'dark']) {
  const { context, page, errors } = await open({ width: w, height: h }, theme);
  const v = await axe(page);
  check(v.length === 0, `${w}px ${theme}: axe clean${v.length ? ' → ' + v.join(' | ') : ''}`);
  check(errors.length === 0, `${w}px ${theme}: no console error${errors.length ? ' → ' + errors.join(' | ').slice(0, 300) : ''}`);
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}px ${theme}: no horizontal overflow`);
  if (shots) await page.screenshot({ path: `${shots}/dashboard-${w}-${theme}.png`, fullPage: true });
  await context.close();
}

// 2. Journeys on desktop
{
  const { context, page, errors } = await open({ width: 1280, height: 900 }, 'light');
  const rows = () => page.locator('table.nl-table tbody tr');
  await page.getByRole('button', { name: '90 j' }).click();
  await page.waitForFunction(() => document.body.textContent.includes('Par semaine'));
  check(await page.getByRole('button', { name: '90 j' }).getAttribute('aria-pressed') === 'true', 'range 90 j selected, line chart switches to weekly');

  await page.getByRole('button', { name: 'Food' }).click();
  await page.waitForTimeout(300);
  check(!(await page.locator('.nl-legend').first().textContent()).includes('Food'), 'category toggle removes the series from the legend');

  const amountHeader = page.getByRole('columnheader', { name: 'Montant' });
  await amountHeader.getByRole('button').click();
  check(await amountHeader.getAttribute('aria-sort') === 'ascending', 'orders sort by amount (controlled DataTable)');
  const amounts = await rows().evaluateAll((trs) => trs.map((tr) => Number(tr.children[5].textContent.replace(/\D/g, ''))));
  check(amounts.every((a, i) => i === 0 || amounts[i - 1] <= a), 'sorted across pages, not just within the page');

  await page.getByRole('button', { name: 'Page suivante' }).click();
  check((await page.locator('.orders').textContent()).includes('9–16 sur'), 'pagination moves to page 2');

  await page.getByLabel('Rechercher une commande').fill('Ada');
  await page.waitForTimeout(200);
  const clients = await rows().evaluateAll((trs) => trs.map((tr) => tr.textContent));
  check(clients.length > 0 && clients.every((t) => t.includes('Ada')), 'search filters orders and resets to page 1');

  await chartCard(page).getByRole('button', { name: 'Vue table' }).click();
  check(await chartCard(page).locator('table').count() === 1, 'chart has a table-view twin');
  await chartCard(page).getByRole('button', { name: 'Vue graphe' }).click();

  await page.locator('.nl-chart svg').first().focus();
  await page.keyboard.press('ArrowLeft');
  check(await page.locator('.nl-chart-tip').isVisible(), 'line chart: keyboard focus + ArrowLeft shows the crosshair tooltip');
  await page.keyboard.press('Escape');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter' }).click();
  check(await page.getByRole('menu', { name: 'Exporter' }).isVisible(), 'export menu opens, named by its button');
  await page.getByRole('menuitem', { name: 'Commandes filtrées (CSV)' }).click();
  check((await download).suggestedFilename() === 'nerdlab-orders-90j.csv', 'CSV export downloads the filtered orders');
  check(await page.getByRole('menu').waitFor({ state: 'detached', timeout: 2000 }).then(() => true, () => false), 'export menu closes after the action');
  check(await page.getByRole('status').textContent().then((t) => t.includes('commandes exportées')), 'export announces a status message');

  await page.getByRole('switch', { name: 'Thème sombre' }).click();
  check(await page.evaluate(() => document.documentElement.dataset.theme) === 'dark', 'theme switch sets data-theme=dark');
  await page.waitForTimeout(500); // let the skin's colour transitions finish before measuring contrast
  const v = await axe(page);
  check(v.length === 0, `after journeys (dark, filtered, page 1, search): axe clean${v.length ? ' → ' + v.join(' | ') : ''}`);
  check(errors.length === 0, `journeys: no console error${errors.length ? ' → ' + errors.join(' | ').slice(0, 300) : ''}`);
  await context.close();
}

// 3. ADR-011: share-bar labels must not depend on the token's colour format
{
  const { context, page, errors } = await open({ width: 1280, height: 900 }, 'light');
  const segment = () => page.getByRole('img', { name: /^Musique / });
  const before = (await segment().textContent()).trim();
  await page.addStyleTag({ content: ':root { --chart-2: oklch(0.68 0.24 355); }' });
  const sw = page.getByRole('switch', { name: 'Thème sombre' });
  await sw.click(); await sw.click(); // re-render the charts under the new token
  await page.waitForTimeout(500);
  const after = (await segment().textContent()).trim();
  check(before !== '' && after === before, `share bar: label kept when --chart-2 is oklch() (before "${before}", after "${after}")`);
  check(errors.length === 0, 'oklch token: no console error');
  await context.close();
}

// 4. Mobile menu
{
  const { context, page, errors } = await open({ width: 390, height: 844 }, 'light');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.click();
  check(await toggle.getAttribute('aria-expanded') === 'true', 'mobile: menu opens');
  const v = await axe(page);
  check(v.length === 0, `mobile menu open: axe clean${v.length ? ' → ' + v.join(' | ') : ''}`);
  if (shots) await page.screenshot({ path: `${shots}/dashboard-390-menu.png` });
  await page.keyboard.press('Escape');
  check(await toggle.getAttribute('aria-expanded') === 'false', 'mobile: Escape closes the menu');
  check(errors.length === 0, 'mobile: no console error');
  await context.close();
}

// 5. Step-9 components in context: order details, new-event form, goals popover, ribbon pause
{
  const { context, page, errors } = await open({ width: 1280, height: 900 }, 'dark');
  const firstId = page.locator('.order-id').first();
  const id = (await firstId.textContent()).trim();
  await firstId.focus();
  await page.keyboard.press('Enter');
  const details = page.getByRole('dialog', { name: `ORDER_${id}.TXT` });
  check(await details.isVisible(), 'order number opens its details dialog from the keyboard');
  check(await details.locator('dl.nl-info dt').count() === 7, 'order details list seven fields');
  await page.waitForTimeout(300); // end of the enter animation, before measuring contrast
  const v = await axe(page);
  check(v.length === 0, `order dialog open (dark): axe clean${v.length ? ' → ' + v.join(' | ') : ''}`);
  if (shots) await page.screenshot({ path: `${shots}/dashboard-order-dialog.png` });
  await page.keyboard.press('Escape');
  await details.waitFor({ state: 'detached' });
  check(await page.evaluate(() => document.activeElement?.classList.contains('order-id')), 'Escape closes it and focus returns to the order number');

  await page.getByRole('button', { name: 'Nouvel événement' }).click();
  const form = page.getByRole('dialog', { name: 'NEW_EVENT.EXE' });
  await form.getByRole('textbox', { name: 'Titre' }).fill('Synth Jam');
  await form.getByRole('combobox', { name: 'Catégorie' }).selectOption('music');
  await form.getByRole('radio', { name: 'En ligne' }).check();
  await form.getByRole('combobox', { name: 'Lieu' }).fill('Hal');
  const venueOption = page.getByRole('option', { name: 'La Halle aux Pixels' });
  await venueOption.waitFor();
  await page.waitForTimeout(200); // the list's enter transition
  await venueOption.click();
  // React Aria commits the option to the input as the list closes: wait for it rather than reading at once.
  const venueField = form.getByRole('combobox', { name: 'Lieu' });
  await page.waitForFunction((el) => el.value !== 'Hal', await venueField.elementHandle(), { timeout: 2000 }).catch(() => {});
  const venue = await venueField.inputValue();
  await page.getByRole('listbox').waitFor({ state: 'detached', timeout: 2000 }).catch(() => {}); // closing list: not part of the form's audit
  check(venue === 'La Halle aux Pixels', `venue combobox filters and picks an option (got "${venue}")`);
  check((await form.getByRole('group', { name: 'Date' }).textContent()).includes('16/05/2026'), 'date picker shows the French day/month/year order');
  await page.waitForTimeout(300);
  const vf = await axe(page);
  check(vf.length === 0, `new-event form open (dark): axe clean${vf.length ? ' → ' + vf.join(' | ') : ''}`);
  if (shots) await page.screenshot({ path: `${shots}/dashboard-new-event.png` });
  await form.getByRole('button', { name: 'Créer le brouillon' }).click();
  await form.waitFor({ state: 'detached' });
  check(await page.getByRole('status').textContent().then((t) => t.includes('Brouillon « Synth Jam » créé')), 'new-event form submits, closes and announces the draft');

  await page.getByRole('button', { name: 'Comment sont-ils fixés ?' }).click();
  check(await page.getByRole('dialog', { name: 'Objectifs' }).isVisible(), 'goals help opens as a named popover');
  await page.keyboard.press('Escape');

  const ribbon = page.locator('.nl-ribbon');
  await ribbon.getByRole('button', { name: 'Mettre en pause le défilement' }).click();
  check((await ribbon.getAttribute('class')).includes('nl-ribbon--paused'), 'announcement ribbon can be paused');

  check(await page.getByRole('navigation', { name: 'Fil d’Ariane' }).getByRole('link').count() === 2, 'breadcrumb: two links, then the current page');

  await page.getByRole('button', { name: 'Voir la checklist' }).click();
  const drawer = page.getByRole('dialog', { name: 'Checklist · Pixel Party' });
  check(await drawer.getByRole('checkbox').count() === 9, 'checklist drawer lists nine tasks');
  await page.waitForTimeout(300);
  const vd = await axe(page);
  check(vd.length === 0, `checklist drawer open (dark): axe clean${vd.length ? ' → ' + vd.join(' | ') : ''}`);
  if (shots) await page.screenshot({ path: `${shots}/dashboard-drawer.png` });
  await page.keyboard.press('Escape');
  await drawer.waitFor({ state: 'detached' });
  const focusBack = await page.waitForFunction(() => document.activeElement?.textContent === 'Voir la checklist', null, { timeout: 2000 }).then(() => true, () => false);
  check(focusBack, 'Escape closes the drawer, focus back on its button');

  const firstTwo = page.getByRole('checkbox', { name: /^Sélectionner la commande / });
  await firstTwo.nth(0).check(); await firstTwo.nth(1).check();
  check(await page.getByRole('checkbox', { name: 'Sélectionner les commandes affichées' }).evaluate((el) => el.indeterminate), 'select-all is indeterminate with two rows selected');
  const selDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter' }).click();
  await page.getByRole('menuitem', { name: 'Sélection (2) en CSV' }).click();
  const selFile = await selDownload;
  const csv = fs.readFileSync(await selFile.path(), 'utf8').trim().split('\n');
  check(selFile.suggestedFilename() === 'nerdlab-orders-selection.csv' && csv.length === 3, 'export of the selection: header + the two selected orders');

  for (const c of ['Design', 'Musique', 'Code', 'Food']) await page.getByRole('button', { name: c }).click();
  check(await page.getByText('Aucune catégorie sélectionnée').isVisible(), 'warning callout when every category is off');
  check(errors.length === 0, `step-9 journeys: no console error${errors.length ? ' → ' + errors.join(' | ').slice(0, 300) : ''}`);
  await context.close();
}

// 6. Firefox and WebKit (Safari's engine): the page renders cleanly at both widths, in both themes
for (const name of ['firefox', 'webkit']) {
  const engine = await pw[name].launch();
  for (const [w, h, theme] of [[1280, 900, 'light'], [390, 844, 'dark']]) {
    const { context, page, errors } = await open({ width: w, height: h }, theme, engine);
    await page.waitForTimeout(300);
    const v = await axe(page);
    check(v.length === 0, `${name} ${w}px ${theme}: axe clean${v.length ? ' → ' + v.join(' | ') : ''}`);
    check(errors.length === 0, `${name} ${w}px ${theme}: no console error${errors.length ? ' → ' + errors.join(' | ').slice(0, 300) : ''}`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} ${w}px ${theme}: no horizontal overflow`);
    if (shots) await page.screenshot({ path: `${shots}/dashboard-${name}-${w}-${theme}.png`, fullPage: true });
    await context.close();
  }
  await engine.close();
}

await browser.close();
server.close();
if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
if (failures.length) { console.error(`${failures.length} failing check(s)`); process.exit(1); }
console.log('dashboard e2e ok');
