// Public API snapshot (ADR-021). Run from a package directory (its `test` script does it, after the build).
// Lists what consumers can rely on and compares it with the committed `api-surface.txt`:
//   react, charts, icons   every name exported by src/index.ts (values and types);
//   css-candy              every .nl-* class in dist/candy.css;
//   css-bento              every .nl-* class in dist/bento.css (the same set as css-candy: tools/skin-parity);
//   tokens                 every CSS custom property in dist/candy/tokens.css, the palette ids and the skins
//                          (Bento's variables are the same names, checked by scripts/check-parity.mjs).
// A name that disappears is a breaking change: it needs a major changeset. UPDATE_API=1 rewrites the file.
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')).name.replace('@robin-dot-lab/', '');
const sorted = (xs) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, 'en'));

function surface() {
  if (pkg === 'css-candy' || pkg === 'css-bento') {
    const file = `dist/${pkg.replace('css-', '')}.css`;
    return sorted(fs.readFileSync(file, 'utf8').match(/\.nl-[a-z0-9_-]+/g).map((c) => `class ${c}`));
  }
  if (pkg === 'tokens') {
    const vars = fs.readFileSync('dist/candy/tokens.css', 'utf8').match(/--[a-z0-9-]+(?=\s*:)/g);
    const palettes = JSON.parse(fs.readFileSync('dist/candy/palettes.json', 'utf8')).map((p) => `palette ${p.id}`);
    const skins = fs.readdirSync('dist', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `skin ${d.name}`);
    return [...sorted(vars.map((v) => `var ${v}`)), ...palettes, ...sorted(skins)];
  }
  const index = fs.readFileSync('src/index.ts', 'utf8').replace(/\/\/.*$/gm, '');
  if (/export \*/.test(index)) throw new Error('src/index.ts: name every export (no `export *`), so the surface is explicit');
  const names = [...index.matchAll(/export\s*\{([^}]*)\}/g)].flatMap((m) => m[1].split(',').map((s) => s.trim()).filter(Boolean))
    .map((s) => (s.startsWith('type ') ? `type ${s.slice(5).trim()}` : `value ${s}`));
  return sorted(names);
}

const file = path.resolve('api-surface.txt');
const now = surface();
const header = `# Public API of @robin-dot-lab/${pkg}, checked by tools/api-surface/check.mjs. Removing a line is a breaking change.\n`;
if (process.env.UPDATE_API || !fs.existsSync(file)) {
  fs.writeFileSync(file, header + now.join('\n') + '\n');
  console.log(`api surface written (${now.length} entries)`);
  process.exit(0);
}
const before = fs.readFileSync(file, 'utf8').split('\n').filter((l) => l && !l.startsWith('#'));
const removed = before.filter((x) => !now.includes(x));
const added = now.filter((x) => !before.includes(x));
if (removed.length || added.length) {
  if (removed.length) console.error(`removed from the public API (breaking: needs a major changeset):\n  ${removed.join('\n  ')}`);
  if (added.length) console.error(`added to the public API (needs a minor changeset):\n  ${added.join('\n  ')}`);
  console.error('then run the package test with UPDATE_API=1 to accept the new surface');
  process.exit(1);
}
console.log(`api surface ok (${now.length} entries)`);
