// Checks every palette, light and dark, before it ships:
//  - text pairs reach 4.5:1 (WCAG AA), lines and focus rings 3:1 against what they sit on;
//  - adjacent categorical chart colours (1/2, 2/3, 3/4: series are assigned in that fixed order, and the
//    dataviz method checks the adjacent pair list) stay apart for everyone: OKLab ΔE ≥ 15 with normal vision,
//    and ≥ 6 under protanopia, deuteranopia and tritanopia (6–8 is allowed only because every chart
//    has a legend, direct labels and a table view; it is reported as a warning).
// Chart marks under 3:1 against the surface are reported too, never fatal (labels and tables back them).
import { loadPalettes } from './palettes.mjs';

const hex = (c) => {
  const m = /^#([0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
};
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
const oklab = (rgb) => {
  const [r, g, b] = rgb.map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};
const dE = (a, b) => { const [x, y] = [oklab(a), oklab(b)]; return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
// Machado et al. (2009) matrices, severity 1, applied in linear RGB.
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const unlin = (v) => { const c = Math.min(1, Math.max(0, v)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const simulate = (rgb, m) => { const l = rgb.map(lin); return m.map((row) => unlin(row[0] * l[0] + row[1] * l[1] + row[2] * l[2])); };

const FILLS = ['color.primary', 'color.primary-hover', 'color.secondary', 'color.secondary-hover', 'color.accent', 'color.accent-hover',
  'color.tomato', 'color.lavender', 'color.mint', 'color.success', 'color.warning', 'color.error', 'color.info'];
const TEXT = [
  ['color.text-primary', 'color.background'], ['color.text-primary', 'color.surface'], ['color.text-primary', 'color.surface-elevated'],
  ['color.text-primary', 'color.surface-sunken'], ['color.text-primary', 'color.primary-soft'], ['color.text-primary', 'color.secondary-soft'],
  ['color.text-secondary', 'color.background'], ['color.text-secondary', 'color.surface'],
  ['color.error-text', 'color.background'], ['color.error-text', 'color.surface'],
  ['cream', 'ink'], ...FILLS.map((f) => ['ink', f]),
];
const LINE = [['line', 'color.background'], ['line', 'color.surface'], ['color.violet', 'color.surface'], ['color.violet', 'color.background']];

let failures = 0, warnings = 0;
for (const p of loadPalettes()) for (const mode of ['light', 'dark']) {
  const v = { ...p[mode], line: mode === 'dark' ? p[mode].cream : p[mode].ink };
  const get = (k) => { const c = hex(v[k]); if (!c) throw new Error(`${p.id} ${mode}: ${k} is not #RRGGBB (${v[k]})`); return c; };
  const bad = [], warn = [];
  for (const [fg, bg] of TEXT) { const r = ratio(get(fg), get(bg)); if (r < 4.5) bad.push(`${fg} on ${bg} ${r.toFixed(2)}:1`); }
  for (const [fg, bg] of LINE) { const r = ratio(get(fg), get(bg)); if (r < 3) bad.push(`${fg} on ${bg} ${r.toFixed(2)}:1 (needs 3)`); }
  const cats = [1, 2, 3, 4].map((i) => get(`chart.${i}`));
  for (const [i, c] of cats.entries()) { const r = ratio(c, get('color.surface')); if (r < 3) warn.push(`chart.${i + 1} on surface ${r.toFixed(2)}:1`); }
  for (const [i, j] of [[0, 1], [1, 2], [2, 3]]) {
    const normal = dE(cats[i], cats[j]);
    if (normal < 15) bad.push(`chart.${i + 1}/${j + 1} ΔE ${normal.toFixed(1)} (needs 15)`);
    for (const [kind, m] of Object.entries(CVD)) {
      const d = dE(simulate(cats[i], m), simulate(cats[j], m));
      if (d < 6) bad.push(`chart.${i + 1}/${j + 1} ${kind} ΔE ${d.toFixed(1)} (needs 6)`);
      else if (d < 8) warn.push(`chart.${i + 1}/${j + 1} ${kind} ΔE ${d.toFixed(1)}`);
    }
  }
  const seq = [1, 2, 3, 4, 5].map((i) => lum(get(`chart.seq-${i}`)));
  const monotonic = seq.every((l, i) => i === 0 || (mode === 'light' ? l < seq[i - 1] : l > seq[i - 1]));
  if (!monotonic) bad.push(`chart.seq-1…5 not ordered ${mode === 'light' ? 'light → dark' : 'dark → light'}`);
  failures += bad.length; warnings += warn.length;
  console.log(`${bad.length ? '✗' : '✓'} ${p.id} ${mode}${warn.length ? ` (${warn.length} warning${warn.length > 1 ? 's' : ''})` : ''}`);
  for (const b of bad) console.log(`    ✗ ${b}`);
  for (const w of warn) console.log(`    ! ${w}`);
}
if (failures) { console.error(`${failures} contrast or distinctness failure(s)`); process.exit(1); }
console.log(`palettes ok (${warnings} warning(s))`);
