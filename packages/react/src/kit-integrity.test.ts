// Kit integrity: the checklist for evolving the UI kit, enforced as tests so that no agent (or human)
// can leave the repo half-updated. See AGENTS.md › "Adding or changing a component".
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const walk = (dir: string, re: RegExp): string[] =>
  (fs.readdirSync(path.join(ROOT, dir), { recursive: true }) as string[]).filter((f) => re.test(f)).map((f) => path.join(dir, f));

/** Value exports that are components (PascalCase), excluding re-exports of third-party primitives. */
// Focusable (React Aria) and CalendarDate (@internationalized/date) are re-exports, not kit components.
const THIRD_PARTY = new Set(['Focusable', 'CalendarDate']);
const components = [...read('packages/react/src/index.ts').matchAll(/export \{([^}]+)\}/g)]
  .flatMap((m) => m[1]!.split(','))
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith('type ') && /^[A-Z]/.test(s) && !THIRD_PARTY.has(s));

const stories = walk('apps/docs/src', /\.stories\.tsx$/).map(read).join('\n');
const tests = walk('packages/react/src', /\.test\.tsx?$/).filter((f) => !f.endsWith('kit-integrity.test.ts')).map(read).join('\n');
// Rendered as JSX, used as a compound (`Window.Bar`), or declared as a story's `component:`.
const used = (code: string, name: string) => new RegExp(`<${name}[\\s>/.]|\\b${name}\\.|component: ${name}\\b`).test(code);

describe('every exported component is documented and tested', () => {
  it.each(components)('%s has a story', (name) => expect(used(stories, name), `no story renders <${name}>`).toBe(true));
  it.each(components)('%s has a test', (name) => expect(used(tests, name), `no test renders <${name}>`).toBe(true));
});

// Every nl-* class written by the React layers (react, charts, icons) must exist in the skin (static names exactly,
// template-literal prefixes such as `nl-meter--${level}` as a prefix of at least one selector).
const skinCss = walk('packages/css-candy/src', /\.css$/).map(read).join('\n');
const selectors = new Set([...skinCss.matchAll(/\.(nl-[a-z0-9_-]+)/g)].map((m) => m[1]!));
const sources = [...walk('packages/react/src', /\.tsx?$/), ...walk('packages/charts/src', /\.tsx?$/), ...walk('packages/icons/src', /\.tsx?$/)].filter((f) => !/\.test\.tsx?$/.test(f));
const classUses = sources.flatMap((file) => {
  const code = read(file);
  const statics = [...code.matchAll(/['"`\s](nl-[a-z0-9_-]*[a-z0-9])(?=['"`\s])/g)].map((m) => ({ file, name: m[1]!, prefix: false }));
  const prefixes = [...code.matchAll(/`[^`]*?(nl-[a-z0-9_-]+?-)\$\{/g)].map((m) => ({ file, name: m[1]!, prefix: true }));
  return [...statics, ...prefixes];
});
// nl-* strings that are not classes: `nl-field-${id}` is a generated element id (Field), not a selector.
const NOT_CLASSES = new Set(['nl-field-']);
const unique = [...new Map(classUses.filter((u) => !NOT_CLASSES.has(u.name)).map((u) => [`${u.name}|${u.prefix}`, u])).values()];

describe('every class used by React exists in the skin', () => {
  it('finds class uses at all (guards the scanner itself)', () => expect(unique.length).toBeGreaterThan(40));
  it.each(unique.map((u) => [u.prefix ? `${u.name}*` : u.name, u] as const))('%s', (_label, u) => {
    const ok = u.prefix ? [...selectors].some((s) => s.startsWith(u.name)) : selectors.has(u.name);
    expect(ok, `${u.file} uses "${u.name}${u.prefix ? '…' : ''}" but no selector in packages/css-candy/src defines it`).toBe(true);
  });
});

describe('every skin file is assembled', () => {
  const manifest = JSON.parse(read('packages/css-candy/src/manifest.json')) as Record<string, string[]>;
  const listed = new Set(Object.values(manifest).flat());
  const onDisk = walk('packages/css-candy/src', /\.css$/).map((f) => path.relative('packages/css-candy/src', f)).filter((f) => f !== 'fonts.css');
  it.each(onDisk)('%s is listed in manifest.json', (f) => expect(listed.has(f)).toBe(true));
});
