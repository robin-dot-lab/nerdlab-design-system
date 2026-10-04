// The rules every React package of the kit follows, applied to @robin-dot-lab/mail (AGENTS.md rules 1, 3, 4, 10, 11):
// no style value in the sources, "use client" exactly where needed, an index that re-exports only its own
// modules, a story and a test per component, every nl-* class defined in the skin, words in lib/i18n.ts only.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = import.meta.dirname;
const ROOT = path.resolve(SRC, '../../..');
const read = (p: string) => fs.readFileSync(p, 'utf8');
const walk = (dir: string, re: RegExp) =>
  (fs.readdirSync(dir, { recursive: true }) as string[]).filter((f) => re.test(f)).map((f) => path.join(dir, f));
const sources = walk(SRC, /\.tsx?$/).filter((f) => !/\.test\.tsx?$/.test(f));
const rel = (f: string) => path.relative(SRC, f);

describe('no style values (ADR-001)', () => {
  const FORBIDDEN = [
    { name: 'hex colour', re: /#[0-9a-fA-F]{3,8}\b/ },
    { name: 'css function', re: /\b(?:rgba?|hsla?|oklch|color-mix)\(/ },
    { name: 'length', re: /\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw)\b/ },
    { name: 'inline style prop', re: /\bstyle=\{/ },
  ];
  it.each(sources.map(rel))('%s', (file) => {
    const code = read(path.join(SRC, file));
    for (const { name, re } of FORBIDDEN) expect(code, `${name} in ${file}`).not.toMatch(re);
  });
});

describe('"use client" iff needed (ADR-008)', () => {
  const NEEDS_CLIENT = /\b(?:useState|useEffect|useLayoutEffect|useReducer|useRef|useContext|createContext|useMailMessages|useLocale)\b|from 'react-aria-components'/;
  it.each(sources.map(rel).filter((f) => f !== 'index.ts' && !f.startsWith('lib')))('%s', (file) => {
    const code = read(path.join(SRC, file));
    expect(/^\s*['"]use client['"];/.test(code), file).toBe(NEEDS_CLIENT.test(code));
  });
  it('index.ts re-exports only the package’s own modules', () => {
    const froms = [...read(path.join(SRC, 'index.ts')).matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
    expect(froms.filter((s) => !s.startsWith('./'))).toEqual([]);
  });
});

describe('kit integrity', () => {
  const components = [...read(path.join(SRC, 'index.ts')).matchAll(/export \{([^}]+)\}/g)]
    .flatMap((m) => m[1]!.split(',')).map((s) => s.trim()).filter((s) => s && !s.startsWith('type ') && /^[A-Z]/.test(s));
  const stories = walk(path.join(ROOT, 'apps/docs/src'), /\.stories\.tsx$/).map(read).join('\n');
  const tests = walk(SRC, /\.test\.tsx$/).map(read).join('\n');
  const used = (code: string, name: string) => new RegExp(`<${name}[\\s>/.]|component: ${name}\\b`).test(code);
  it.each(components)('%s has a story', (name) => expect(used(stories, name), `no story renders <${name}>`).toBe(true));
  it.each(components)('%s has a test', (name) => expect(used(tests, name), `no test renders <${name}>`).toBe(true));

  const skin = walk(path.join(ROOT, 'packages/css-candy/src'), /\.css$/).map(read).join('\n');
  const selectors = new Set([...skin.matchAll(/\.(nl-[a-z0-9_-]+)/g)].map((m) => m[1]!));
  const classes = [...new Set(sources.flatMap((f) => [...read(f).matchAll(/['"`\s](nl-[a-z0-9_-]*[a-z0-9])(?=['"`\s])/g)].map((m) => m[1]!)))];
  it('finds class uses at all (guards the scanner)', () => expect(classes.length).toBeGreaterThan(20));
  it.each(classes)('%s exists in the skin', (c) => expect(selectors.has(c), `no selector defines .${c}`).toBe(true));
});

describe('no hard-coded language (ADR-023)', () => {
  it.each(sources.map(rel).filter((f) => f !== path.join('lib', 'i18n.ts')))('%s', (file) => {
    const code = read(path.join(SRC, file));
    expect(code, 'a `locale` or `lang` prop').not.toMatch(/^\s*(locale|lang)\??:\s*(string|'fr')/m);
    expect(code, 'a French string literal').not.toMatch(/['`][^'`\n]*[éèêàùç’][^'`\n]*['`]/);
  });
});
