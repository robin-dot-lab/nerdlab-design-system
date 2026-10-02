// ADR-001: the React layer only maps props to nl-* classes. Any colour, length or
// inline style here would fork the look per skin, so the source must contain none.
import fs from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const SRC = import.meta.dirname;
const files = (fs.readdirSync(SRC, { recursive: true }) as string[])
  .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f));
const FORBIDDEN = [
  { name: 'hex colour', re: /#[0-9a-fA-F]{3,8}\b/ },
  { name: 'css function', re: /\b(?:rgba?|hsla?|oklch|color-mix)\(/ },
  { name: 'length', re: /\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw)\b/ },
  { name: 'inline style prop', re: /\bstyle=\{/ },
];

it.each(files)('%s contains no style values', (file) => {
  const code = fs.readFileSync(path.join(SRC, file), 'utf8');
  for (const { name, re } of FORBIDDEN) expect(code, `${name} in ${file}`).not.toMatch(re);
});
