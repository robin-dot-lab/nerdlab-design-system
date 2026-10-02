// Guards the migration: the generated CSS must declare exactly the custom properties
// (names and values) of the reference stylesheet the design system was born in.
import fs from 'node:fs';

const REFERENCE = { pop: '../../design-system-nerdlab-pop/design-system.css' };
const DEVIATIONS = JSON.parse(fs.readFileSync(new URL('./parity-deviations.json', import.meta.url), 'utf8'));

const block = (css, start) => {
  const i = css.indexOf(start); if (i < 0) throw new Error(`block not found: ${start}`);
  const j = css.indexOf('{', i); let depth = 0, k = j;
  for (; k < css.length; k++) { if (css[k] === '{') depth++; else if (css[k] === '}' && --depth === 0) break; }
  return css.slice(j + 1, k);
};
const decls = (b) => new Map([...b.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/--([\w-]+):\s*([^;]+);/g)]
  .map((m) => [m[1], m[2].replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim()]));

let failures = 0;
for (const [theme, ref] of Object.entries(REFERENCE)) {
  const refCss = fs.readFileSync(new URL(ref, import.meta.url.replace('/scripts/', '/scripts/../')), 'utf8');
  const outCss = fs.readFileSync(`dist/${theme}/tokens.css`, 'utf8');
  for (const [label, refStart, outStart] of [['root', ':root {', ':root {'], ['dark', '.dark,\n[data-theme="dark"] {', '.dark,\n[data-theme="dark"] {']]) {
    const a = decls(block(refCss, refStart)), b = decls(block(outCss, outStart));
    // Declared, intentional deviations are applied to the reference before comparing.
    for (const [n, v] of Object.entries(DEVIATIONS[theme]?.[label] ?? {})) a.set(n, v);
    for (const [n, v] of a) if (b.get(n) !== v) { failures++; console.error(`✗ ${theme}/${label} --${n}: expected "${v}", got "${b.get(n)}"`); }
    for (const n of b.keys()) if (!a.has(n)) { failures++; console.error(`✗ ${theme}/${label} --${n}: not in reference`); }
    console.log(`${theme}/${label}: ${a.size} reference vars checked`);
  }
}
if (failures) { console.error(`${failures} parity failure(s)`); process.exit(1); }
console.log('parity ok');
