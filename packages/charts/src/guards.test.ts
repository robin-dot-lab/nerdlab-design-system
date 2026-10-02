// ADR-011: charts compute geometry, but colours come only from the skin's tokens, and
// "use client" sits exactly on the modules that use state, effects, refs or context.
import fs from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const SRC = import.meta.dirname;
const files = (fs.readdirSync(SRC, { recursive: true }) as string[]).filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) && f !== 'index.ts');
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|color-mix)\(|\b(?:white|black)\b/;
const NEEDS_CLIENT = /\b(?:useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|createContext)\b|from '\.\/lib\/(?:tooltip|use-width)\.js'/;

it.each(files)('%s has no raw colour', (file) => {
  const code = fs.readFileSync(path.join(SRC, file), 'utf8').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');
  // contrast.ts parses hex values read from tokens at runtime; it may mention the hex *pattern*, not a colour.
  const scanned = file === path.join('lib', 'contrast.ts') ? code.replace(/\/\^#\?\(\[0-9a-f\]\{6\}\)\$\/i/, '') : code;
  expect(scanned).not.toMatch(RAW_COLOUR);
});

it.each(files)('%s declares "use client" iff it needs it', (file) => {
  const code = fs.readFileSync(path.join(SRC, file), 'utf8');
  expect(/^\s*['"]use client['"];/.test(code), file).toBe(NEEDS_CLIENT.test(code));
});
