// Smoke test of the Storybook manager (the UI around the stories), which the other scripts never load:
// they open iframe.html directly. Opens index.html on a story and fails on any page error or console
// error, then checks the toolbar: the Palette menu shows under Candy and goes away under Bento (ADR-030).
import pw from 'playwright-core';
import { serveStorybook } from './lib/storybook.mjs';

const { base, close } = await serveStorybook();
const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
let failures = 0;
const check = (ok, label) => { if (ok) console.log(`✓ ${label}`); else { failures++; console.error(`✗ ${label}`); } };

const palette = () => page.getByRole('button', { name: 'Colour palette' });
await page.goto(`${base}/index.html?path=/story/components-button--variants`, { waitUntil: 'networkidle' });
await page.frameLocator('#storybook-preview-iframe').locator('#storybook-root > :not(template)').first().waitFor({ timeout: 15_000 });
check(await palette().isVisible(), 'Candy: the Palette menu is in the toolbar');
await page.goto(`${base}/index.html?path=/story/components-button--variants&globals=skin:bento`, { waitUntil: 'networkidle' });
await page.frameLocator('#storybook-preview-iframe').locator('#storybook-root > :not(template)').first().waitFor({ timeout: 15_000 });
check(await palette().count() === 0, 'Bento: no Palette menu');
check(errors.length === 0, `manager: no page or console error${errors.length ? ' → ' + errors.join(' | ').slice(0, 300) : ''}`);
await browser.close();
close();
if (failures) { console.error(`${failures} manager check(s) failed`); process.exit(1); }
console.log('storybook manager ok');
