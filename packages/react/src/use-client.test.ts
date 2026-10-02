// ADR-008: "use client" is a per-file marker and the package is compiled file by file.
// A component module using state, effects, context or React Aria components must declare it,
// otherwise it crashes only at runtime inside a React Server Component tree.
import fs from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const SRC = import.meta.dirname;
const files = (fs.readdirSync(SRC, { recursive: true }) as string[])
  .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) && !f.startsWith('lib') && f !== 'index.ts');
const NEEDS_CLIENT = /\b(?:useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|createContext)\b|from 'react-aria-components'/;

it.each(files)('%s declares "use client" iff it needs it', (file) => {
  const code = fs.readFileSync(path.join(SRC, file), 'utf8');
  const declares = /^\s*['"]use client['"];/.test(code);
  expect(declares, `${file}: ${NEEDS_CLIENT.test(code) ? 'needs' : 'does not need'} "use client"`).toBe(NEEDS_CLIENT.test(code));
});
