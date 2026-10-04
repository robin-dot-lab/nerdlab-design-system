// Visual regression of every story: each one is screenshotted (desktop light, phone dark) and
// compared with the committed baseline of the current platform, apps/docs/test/visual/<platform>/.
// Font rasterisation differs between macOS and Linux, hence one baseline set per platform.
//   node scripts/visual.mjs            compare (fails on any changed pixel)
//   UPDATE=1 node scripts/visual.mjs   write the baselines (pnpm --filter @robin-dot-lab/docs visual:update)
// A missing baseline fails locally; on CI it is reported and skipped until the Linux set is refreshed
// by the "Update visual baselines" workflow. Diffs land in test/visual/__diff__/ (git-ignored).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import pw from 'playwright-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { missingFonts, routeTestFonts } from '../../../tools/test-fonts/route.mjs';
import { listStories, serveStorybook, storyUrl, waitForStory } from './lib/storybook.mjs';

const UPDATE = Boolean(process.env.UPDATE);
const DIR = path.resolve('test/visual', os.platform());
const DIFF = path.resolve('test/visual/__diff__');
const VARIANTS = [
  { name: 'desktop-light', theme: 'light', viewport: { width: 1280, height: 800 } },
  { name: 'phone-dark', theme: 'dark', viewport: { width: 390, height: 844 } },
];
// VARIANT=desktop-light|phone-dark runs one variant only (CI shards the comparison across machines).
const ACTIVE = VARIANTS.filter((v) => !process.env.VARIANT || v.name === process.env.VARIANT);
// Motion is frozen so a screenshot never catches an animation mid-way (marquee, stripes, enter transitions).
const FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';
// Time is frozen too, in a fixed zone: stories that show dates relative to now (RelativeTime, ExpiryIndicator,
// the mail list) or a clock time render the same pixels on every run and every machine. Timers still run.
const FIXED_NOW = new Date('2026-10-04T10:00:00Z');
// Story ids keep the accents of their titles; file names stay ASCII.
const fileName = (id, variant) => `${id.normalize('NFD').replace(/[̀-ͯ]/g, '')}--${variant}.png`;

fs.mkdirSync(DIR, { recursive: true });
fs.rmSync(DIFF, { recursive: true, force: true });
const { base, close } = await serveStorybook();
const stories = listStories();
const browser = await pw.chromium.launch({
  channel: process.env.CHROME_CHANNEL ?? 'chrome',
  args: ['--disable-gpu', '--disable-partial-raster', '--force-color-profile=srgb', '--font-render-hinting=none'],
});
let failures = 0, missing = 0, written = 0;

for (const v of ACTIVE) {
  const context = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: 1, timezoneId: 'UTC' });
  await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
  await routeTestFonts(context);
  for (const story of stories) {
    const page = await context.newPage();
    await page.clock.setFixedTime(FIXED_NOW);
    await page.goto(storyUrl(base, story.id, v.theme), { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: FREEZE });
    await waitForStory(page).catch(() => {});
    await page.waitForTimeout(300); // play functions, overlays opened by default
    const shot = PNG.sync.read(await page.screenshot({ fullPage: true }));
    await page.close();
    const file = path.join(DIR, fileName(story.id, v.name));
    const label = `${v.name} ${story.id}`;
    if (UPDATE) { fs.writeFileSync(file, PNG.sync.write(shot)); written++; continue; }
    if (!fs.existsSync(file)) { missing++; console.error(`? ${label}: no baseline`); continue; }
    const ref = PNG.sync.read(fs.readFileSync(file));
    let n = -1;
    if (ref.width === shot.width && ref.height === shot.height) {
      const diff = new PNG({ width: ref.width, height: ref.height });
      n = pixelmatch(ref.data, shot.data, diff.data, ref.width, ref.height, { threshold: 0.1 });
      if (n > 0) { fs.mkdirSync(DIFF, { recursive: true }); fs.writeFileSync(path.join(DIFF, fileName(story.id, `${v.name}-diff`)), PNG.sync.write(diff)); }
    }
    if (n === 0) { console.log(`✓ ${label}`); continue; }
    failures++;
    fs.mkdirSync(DIFF, { recursive: true });
    fs.writeFileSync(path.join(DIFF, fileName(story.id, `${v.name}-actual`)), PNG.sync.write(shot));
    console.error(`✗ ${label}: ${n < 0 ? `size ${shot.width}×${shot.height} vs baseline ${ref.width}×${ref.height}` : `${n} px differ`}`);
  }
  await context.close();
}
await browser.close();
close();

if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
if (UPDATE) { console.log(`${written} baseline(s) written to ${path.relative(process.cwd(), DIR)}`); process.exit(0); }
console.log(`${stories.length} stories × ${ACTIVE.length} variant(s) on ${os.platform()}`);
if (missing) {
  const hint = `${missing} story screenshot(s) have no ${os.platform()} baseline: run \`pnpm --filter @robin-dot-lab/docs visual:update\`${process.env.CI ? ' (on Linux: the "Update visual baselines" workflow)' : ''}`;
  if (process.env.CI) console.warn(`warning: ${hint}`); else { console.error(hint); process.exit(1); }
}
if (failures) { console.error(`${failures} visual change(s): if intended, run \`pnpm --filter @robin-dot-lab/docs visual:update\` and commit the baselines; diffs in test/visual/__diff__/`); process.exit(1); }
console.log('visual regression ok');
