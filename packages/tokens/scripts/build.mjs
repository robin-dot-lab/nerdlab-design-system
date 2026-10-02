// Compiles the DTCG sources in src/<theme>/ into CSS custom properties, ES module and flat JSON.
// The CSS variable name is the token path joined with "-" (a trailing "DEFAULT" segment is dropped),
// so the output keeps the exact names used by the nl-* stylesheets.
import fs from 'node:fs';
import StyleDictionary from 'style-dictionary';

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
  fs.writeFileSync(`${out}tokens.css`, `${base}\n${dark}`);
  fs.rmSync(`${out}tokens.base.css`);
  fs.rmSync(`${out}tokens.dark.css`);
  console.log(`tokens: ${theme} built`);
}
