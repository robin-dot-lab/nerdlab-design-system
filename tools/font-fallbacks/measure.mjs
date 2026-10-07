// Measures the skin's web fonts against the local fonts that stand in for them while they load, and
// prints the @font-face overrides (size-adjust, ascent-override, descent-override) that make the
// fallback take the same room. Re-run after changing a family or its axes; paste the result into
// packages/css-candy/src/fonts.css (or, with SKIN=bento, packages/css-bento/src/fonts.css).
// Uses the offline font cache of the tests (no network).
import { createRequire } from 'node:module';
import { routeTestFonts } from '../test-fonts/route.mjs';

const require = createRequire(new URL('../../apps/docs/package.json', import.meta.url));
const pw = require('playwright-core');
// [name of the fallback face, web family, CSS of the web text, local font it stands in with]
const SKINS = {
  candy: {
    fonts: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Silkscreen:wght@400;700&display=swap",
    pairs: [
      ['Bricolage Grotesque Fallback', 'Bricolage Grotesque', '800 100px', "'Bricolage Grotesque'", 'Arial', "font-variation-settings: 'wdth' 85"],
      ['Outfit Fallback', 'Outfit', '400 100px', "'Outfit'", 'Arial', ''],
      ['Space Mono Fallback', 'Space Mono', '400 100px', "'Space Mono'", 'Courier New', ''],
    ],
  },
  // Bento sets Outfit in titles only (700), Manrope in text, JetBrains Mono in code.
  bento: {
    fonts: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Manrope:wght@400..700&family=Outfit:wght@600;700&display=swap",
    pairs: [
      ['Outfit Fallback', 'Outfit', '700 100px', "'Outfit'", 'Arial', ''],
      ['Manrope Fallback', 'Manrope', '400 100px', "'Manrope'", 'Arial', ''],
      ['JetBrains Mono Fallback', 'JetBrains Mono', '400 100px', "'JetBrains Mono'", 'Courier New', ''],
    ],
  },
};
const { fonts: FONTS, pairs: PAIRS } = SKINS[process.env.SKIN ?? 'candy'];
const SAMPLE = 'The quick brown fox jumps over the lazy dog 0123456789 Événement à Lyon';

const browser = await pw.chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
await routeTestFonts(context);
const page = await context.newPage();
await page.setContent(`<link rel="stylesheet" href="${FONTS}">${PAIRS.map((p) => `<p style="font: ${p[2]} ${p[3]}">a</p>`).join('')}`, { waitUntil: 'networkidle' });
await page.evaluate(async () => { await document.fonts.ready; });
for (const [face, family, weight, cssFamily, local, variation] of PAIRS) {
  const m = await page.evaluate(({ weight, cssFamily, local, variation, SAMPLE }) => {
    const span = (font) => {
      const el = document.createElement('span');
      el.textContent = SAMPLE; el.style.cssText = `font: ${font}; white-space: nowrap; position: absolute; ${variation ? variation + ';' : ''}`;
      document.body.append(el); const w = el.getBoundingClientRect().width; el.remove(); return w;
    };
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${weight} ${cssFamily}`;
    const t = ctx.measureText(SAMPLE);
    return { web: span(`${weight} ${cssFamily}`), local: span(`${weight} '${local}'`), ascent: t.fontBoundingBoxAscent, descent: t.fontBoundingBoxDescent };
  }, { weight, cssFamily, local, variation, SAMPLE });
  const size = m.web / m.local;
  const pct = (v) => `${(v * 100).toFixed(2)}%`;
  console.log(`@font-face {\n  font-family: '${face}';\n  src: ${/^[78]00/.test(weight) ? `local('${local} Bold'), local('${local.replace(' ', '')}-BoldMT'), ` : ''}local('${local}');\n  size-adjust: ${pct(size)};\n  ascent-override: ${pct(m.ascent / 100 / size)};\n  descent-override: ${pct(m.descent / 100 / size)};\n  line-gap-override: 0%;\n}`);
}
await browser.close();
