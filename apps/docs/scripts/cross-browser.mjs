// Cross-browser smoke test of every story in Firefox (light theme) and WebKit, Safari's engine (dark
// theme), at desktop width: the story renders, logs no console error and has no axe violation. Chrome is covered
// by a11y-audit.mjs. Browsers come from Playwright: `node node_modules/playwright-core/cli.js install firefox webkit`.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import pw from 'playwright-core';
import { missingFonts, routeTestFonts } from '../../../tools/test-fonts/route.mjs';
import { listStories, serveStorybook, storyUrl, waitForStory } from './lib/storybook.mjs';

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
// One theme per engine: engine bugs do not depend on the theme, and both themes stay covered.
const ENGINES = [{ name: 'firefox', theme: 'light' }, { name: 'webkit', theme: 'dark' }];
const { base, close } = await serveStorybook();
const stories = listStories();
let failures = 0;

for (const { name: engine, theme } of ENGINES) {
  const browser = await pw[engine].launch();
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
    await routeTestFonts(context);
    for (const story of stories) {
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(storyUrl(base, story.id, theme), { waitUntil: 'networkidle' });
      await waitForStory(page).catch(() => errors.push('story did not render'));
      await page.waitForTimeout(250);
      await page.addScriptTag({ content: AXE });
      const violations = await page.evaluate(async () => (await window.axe.run({
        include: [...document.body.children].filter((el) => el.id === 'storybook-root' || el.matches('.nl-dialog-overlay, .nl-popover, :has(.nl-dialog-overlay, .nl-popover)')),
      })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`));
      const label = `${engine} ${theme} ${story.id}`;
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
}
close();
if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
console.log(`${stories.length} stories × ${ENGINES.length} engines (Firefox light, WebKit dark)`);
if (failures) { console.error(`${failures} failing render(s)`); process.exit(1); }
console.log('cross-browser ok');
