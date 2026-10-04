// Forced-colours audit (Windows high contrast, `@media (forced-colors: active)`) of every story.
// The browser replaces the skin's colours with a few system ones and drops box-shadows, so what the
// skin draws with colour alone can vanish. Each story is rendered with forced colours on, and fails if:
//   - a CSS-drawn mark (an icon mask: checkbox tick, accordion +/−, sort arrow…) is painted in the
//     page's own Canvas colour, so it is invisible;
//   - a data mark coloured from React (chart bars, segments, cells, legend keys) lost its colour;
//   - a selected / pressed / current element looks exactly like its unselected sibling;
//   - an element reached with Tab shows no outline (a box-shadow focus ring is dropped in this mode).
// STORY_FILTER=<substring> limits the run. Run after `storybook build`.
import pw from 'playwright-core';
import { missingFonts, routeTestFonts } from '../../../tools/test-fonts/route.mjs';
import { listStories, serveStorybook, storyUrl, waitForStory } from './lib/storybook.mjs';

const { base, close } = await serveStorybook();
const stories = listStories();
const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, forcedColors: 'active' });
await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
await routeTestFonts(context);
let failures = 0;

for (const story of stories) {
  const page = await context.newPage();
  await page.goto(storyUrl(base, story.id, 'light'), { waitUntil: 'networkidle' });
  await waitForStory(page);
  await page.waitForTimeout(250);
  const issues = await page.evaluate(() => {
    const out = [];
    const probe = document.createElement('div');
    probe.style.cssText = 'background-color: Canvas; position: absolute';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const rgb = (s) => (s.match(/[\d.]+/g) ?? []).map(Number);
    const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const contrast = (a, b) => { const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const transparent = (c) => c === 'transparent' || rgb(c)[3] === 0;
    const name = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
    const shown = (el) => el.checkVisibility?.({ opacityProperty: true, visibilityProperty: true }) ?? true;
    const scope = [...document.body.children].filter((el) => el.id === 'storybook-root' || el.matches('.nl-dialog-overlay, .nl-popover, :has(.nl-dialog-overlay, .nl-popover)'));
    const all = scope.flatMap((r) => [r, ...r.querySelectorAll('*')]).filter(shown);

    for (const el of all) for (const pseudo of ['', '::before', '::after']) {
      const cs = getComputedStyle(el, pseudo || null);
      if (pseudo && cs.content === 'none') continue;
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
      const mask = cs.maskImage !== 'none' ? cs.maskImage : cs.webkitMaskImage;
      if (mask && mask !== 'none' && contrast(cs.backgroundColor, canvas) < 3) out.push(`mask painted in Canvas: ${name(el)}${pseudo}`);
    }
    for (const el of all) {
      if (!el.style.background && !el.style.backgroundColor) continue;
      const cs = getComputedStyle(el);
      if (cs.forcedColorAdjust !== 'none' && !transparent(cs.backgroundColor) && contrast(cs.backgroundColor, canvas) < 1.5) out.push(`data mark lost its colour: ${name(el)}`);
      if (cs.forcedColorAdjust !== 'none' && transparent(cs.backgroundColor) && !transparent(el.style.backgroundColor || el.style.background || 'transparent')) out.push(`data mark lost its colour: ${name(el)}`);
    }
    for (const el of all.filter((e) => e instanceof SVGTextElement || e instanceof SVGTSpanElement)) {
      if (!el.textContent.trim()) continue;
      const fill = getComputedStyle(el).fill;
      if (fill.startsWith('rgb') && contrast(fill, canvas) < 4.5) out.push(`SVG text unreadable on Canvas: ${el.closest('[class]')?.getAttribute('class')?.split(' ')[0] ?? 'svg'} ${el.getAttribute('class') ?? el.tagName}`);
    }
    const STATE = '[aria-pressed="true"], [aria-selected="true"], [aria-current]:not([aria-current="false"]), [aria-checked="true"]:not(input), [data-selected]';
    const look1 = (el) => { const cs = getComputedStyle(el); return [cs.backgroundColor, cs.color, cs.borderTopColor, cs.borderTopWidth, cs.borderBottomWidth, cs.outlineStyle, cs.fontWeight, cs.textDecorationLine].join('|'); };
    // A grid cell often carries the state while its child draws it (calendar days): compare both.
    const look = (el) => look1(el) + (el.firstElementChild ? '/' + look1(el.firstElementChild) : '');
    for (const el of all.filter((e) => e.matches(STATE))) {
      const role = el.getAttribute('role'), group = el.parentElement?.parentElement ?? el.parentElement;
      const peer = [...(group?.querySelectorAll(el.tagName) ?? [])].find((p) => p !== el && p.getAttribute('role') === role && !p.matches(STATE) && shown(p) && p.className === el.className.replace(/\s*\S*(--active|--current|--selected|--on)\b/g, ''));
      const loose = peer ?? [...(group?.querySelectorAll(el.tagName) ?? [])].find((p) => p !== el && p.getAttribute('role') === role && !p.matches(STATE) && shown(p));
      if (loose && look(loose) === look(el)) out.push(`selected looks unselected: ${name(el)}`);
    }
    return [...new Set(out)];
  });

  // Keyboard focus: Tab through the story; every stop inside it must draw an outline.
  // Where the story put focus itself (an open menu focuses its list) is not a Tab stop.
  const seen = new Set([await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 120))]);
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      // A container React Aria focuses by script (tabindex=-1) is not a Tab stop the user lands on.
      if (el.tabIndex < 0) return { key: el.outerHTML.slice(0, 120), inside: false, ring: true, name: '' };
      const inside = el.closest('#storybook-root, .nl-dialog-overlay, .nl-popover');
      const cs = getComputedStyle(el);
      const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      return { key: el.outerHTML.slice(0, 120), inside: !!inside, ring, name: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '') };
    });
    if (!stop || seen.has(stop.key)) break;
    seen.add(stop.key);
    if (stop.inside && !stop.ring) issues.push(`focus without outline: ${stop.name}`);
  }

  const uniq = [...new Set(issues)];
  if (uniq.length) { failures++; console.error(`✗ ${story.id}`); for (const m of uniq) console.error(`    ${m}`); }
  else console.log(`✓ ${story.id}`);
  await page.close();
}
await browser.close();
close();
if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
console.log(`${stories.length} stories in forced colours`);
if (failures) { console.error(`${failures} failing stor${failures > 1 ? 'ies' : 'y'}`); process.exit(1); }
console.log('forced-colors audit ok');
