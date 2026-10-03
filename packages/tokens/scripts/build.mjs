// Compiles the DTCG sources in src/<theme>/ into CSS custom properties, ES module and flat JSON.
// The CSS variable name is the token path joined with "-" (a trailing "DEFAULT" segment is dropped),
// so the output keeps the exact names used by the nl-* stylesheets.
import fs from 'node:fs';
import StyleDictionary from 'style-dictionary';
import { cssName, loadPalettes } from './palettes.mjs';

const THEMES = ['candy'];
const DARK_SELECTOR = '.dark,\n[data-theme="dark"]';

StyleDictionary.registerTransform({
  name: 'name/nl',
  type: 'name',
  transform: (token) => token.path.filter((p) => p !== 'DEFAULT').join('-'),
});

const isDark = (token) => token.filePath.endsWith('dark.tokens.json');

for (const theme of THEMES) {
  const src = `src/${theme}`;
  const out = `dist/${theme}/`;

  // Base tokens -> :root, plus JS/JSON exports (resolved values)
  await new StyleDictionary({
    source: [`${src}/base.tokens.json`],
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transforms: ['name/nl'],
        buildPath: out,
        files: [{ destination: 'tokens.base.css', format: 'css/variables', options: { outputReferences: true, selector: ':root' } }],
      },
      js: {
        transforms: ['name/camel'],
        buildPath: out,
        files: [
          { destination: 'tokens.js', format: 'javascript/es6' },
          { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
        ],
      },
      json: {
        transforms: ['name/nl'],
        buildPath: out,
        files: [{ destination: 'tokens.json', format: 'json/flat' }],
      },
    },
  }).buildAllPlatforms();

  // Dark overrides only -> .dark / [data-theme="dark"]
  await new StyleDictionary({
    include: [`${src}/base.tokens.json`],
    source: [`${src}/dark.tokens.json`],
    log: { verbosity: 'silent', warnings: 'disabled' },
    platforms: {
      css: {
        transforms: ['name/nl'],
        buildPath: out,
        files: [{ destination: 'tokens.dark.css', format: 'css/variables', filter: isDark, options: { outputReferences: true, selector: DARK_SELECTOR } }],
      },
    },
  }).buildAllPlatforms();

  const base = fs.readFileSync(`${out}tokens.base.css`, 'utf8');
  const dark = fs.readFileSync(`${out}tokens.dark.css`, 'utf8').replace(/^\/\*\*[\s\S]*?\*\/\n/, '');
  // Palettes: [data-palette="…"] on <html> (or on any container) swaps every colour, in both themes.
  // Derived tokens (border, shadows, line…) are re-declared in each block so a nested palette recomputes them.
  const derived = (css) => css.split('\n').filter((l) => /^\s*--[\w-]+: .*var\(/.test(l)).map((l) => l.replace(/\s*\/\*\*.*\*\/\s*$/, ''));
  const derivedLight = derived(base), derivedDark = derived(dark);
  const block = (sel, values, extra) => `${sel} {\n${Object.entries(values).map(([k, v]) => `  ${cssName(k)}: ${v};`).join('\n')}\n${extra.join('\n')}\n}`;
  const palettes = loadPalettes();
  const paletteCss = palettes.map((p) => [
    block(`[data-palette="${p.id}"]`, p.light, derivedLight),
    block(`[data-palette="${p.id}"][data-theme="dark"],\n[data-theme="dark"] [data-palette="${p.id}"],\n.dark [data-palette="${p.id}"]`, p.dark, [...derivedLight, ...derivedDark]),
    // An explicit light container inside a dark page (showcases, previews) wins over the inherited dark.
    block(`[data-palette="${p.id}"][data-theme="light"]`, p.light, derivedLight),
  ].join('\n')).join('\n');
  fs.writeFileSync(`${out}tokens.css`, `${base}\n${dark}\n/* Palettes (src/${theme}/palettes, plus Candy itself) */\n${paletteCss}\n`);
  fs.writeFileSync(`${out}palettes.json`, JSON.stringify(palettes.map(({ id, name, description }) => ({ id, name, description })), null, 2) + '\n');
  fs.rmSync(`${out}tokens.base.css`);
  fs.rmSync(`${out}tokens.dark.css`);
  console.log(`tokens: ${theme} built, ${palettes.length} palettes`);
}
