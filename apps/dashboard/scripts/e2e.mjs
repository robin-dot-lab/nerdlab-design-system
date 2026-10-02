// Integration test of the dashboard built against the packages' dist/ files.
// Serves dist/, drives the installed Chrome, and checks: no console error, no axe violation
// (light/dark × 1280/390 px), and real user journeys through the library components.
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
if (!fs.existsSync(path.join(ROOT, 'index.html'))) throw new Error('dist/ missing: run `pnpm --filter @nerdlab/dashboard build` first');

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

async function open(viewport, theme) {
  const context = await browser.newContext({ viewport, colorScheme: theme, acceptDownloads: true });
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
  await page.getByRole('button', { name: 'Exporter CSV' }).click();
  check((await download).suggestedFilename() === 'nerdlab-orders-90j.csv', 'CSV export downloads the filtered orders');
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

await browser.close();
server.close();
if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
if (failures.length) { console.error(`${failures.length} failing check(s)`); process.exit(1); }
console.log('dashboard e2e ok');
