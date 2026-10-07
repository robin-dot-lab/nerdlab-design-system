// Guards of the Bento skin (ADR-030):
//  - no literal colour in src/: every colour is a token, so the theme (and the explicit light container)
//    reaches every rule. Icon masks are data URLs painted through background-color: they are skipped.
//  - no hard shadow and no ink outline: box-shadow takes a token, none, or an inset/halo built from tokens.
import fs from 'node:fs';
import path from 'node:path';

const files = fs.readdirSync('src', { recursive: true }).filter((f) => f.endsWith('.css') && f !== 'fonts.css');
const COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(|(?<![\w-])(?:white|black|red|green|blue|yellow|orange|pink|purple|gray|grey)(?![\w-])/i;
let failures = 0;
for (const f of files) {
  const css = fs.readFileSync(path.join('src', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\("data:[^"]*"\)/g, 'url()');
  css.split('\n').forEach((line, i) => {
    const m = COLOUR.exec(line.replace(/var\(--[\w-]+\)/g, ''));
    if (m) { failures++; console.error(`✗ src/${f}:${i + 1} literal colour "${m[0]}": use a token`); }
  });
}
if (failures) { console.error(`${failures} literal colour(s) in the Bento skin`); process.exit(1); }
console.log(`bento skin: ${files.length} files, no literal colour`);
