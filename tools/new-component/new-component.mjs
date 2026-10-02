// Scaffolds a @nerdlab/react component wired into every place the kit requires, so the result passes
// the kit-integrity, no-style-values and use-client guards from the first run.
//   pnpm new:component <PascalName> [--element span]
// Creates: skin CSS (appended to the manifest), React component, test, story, export.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const [name, ...rest] = process.argv.slice(2);
const element = rest.includes('--element') ? rest[rest.indexOf('--element') + 1] : 'div';
const fail = (msg) => { console.error(`new:component — ${msg}`); process.exit(1); };

if (!name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) fail('usage: pnpm new:component <PascalCaseName> [--element span]');
if (!/^[a-z][a-z0-9]*$/.test(element)) fail(`invalid --element "${element}"`);
const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cls = `nl-${kebab}`;
const p = (rel) => path.join(ROOT, rel);
const files = {
  css: `packages/css-pop/src/components/${kebab}.css`,
  tsx: `packages/react/src/${kebab}/${kebab}.tsx`,
  test: `packages/react/src/${kebab}/${kebab}.test.tsx`,
  story: `apps/docs/src/${name}.stories.tsx`,
};
const index = 'packages/react/src/index.ts', manifest = 'packages/css-pop/src/manifest.json';

const indexCode = fs.readFileSync(p(index), 'utf8');
if (new RegExp(`\\b${name}\\b`).test(indexCode)) fail(`${name} is already exported from ${index}`);
for (const f of Object.values(files)) if (fs.existsSync(p(f))) fail(`${f} already exists`);

fs.writeFileSync(p(files.css), `/* ${name} (new in the package): TODO one line on what it looks like. Values come from tokens only. */
.${cls} {
}
`);
fs.mkdirSync(path.dirname(p(files.tsx)), { recursive: true });
fs.writeFileSync(p(files.tsx), `import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export type ${name}Props = ComponentProps<'${element}'>;

/** TODO: one sentence on what ${name} is for and when to use it. */
export function ${name}({ className, ...props }: ${name}Props) {
  return <${element} className={cn('${cls}', className)} {...props} />;
}
`);
fs.writeFileSync(p(files.test), `import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ${name} } from '../index.js';

describe('${name}', () => {
  it('renders the ${cls} class and merges a consumer className last', () => {
    render(<${name} data-testid="subject" className="extra" />);
    expect(screen.getByTestId('subject').className).toBe('${cls} extra');
  });
});
`);
fs.writeFileSync(p(files.story), `import type { Meta, StoryObj } from '@storybook/react-vite';
import { ${name} } from '@nerdlab/react';

const meta = { title: 'Composants/${name}', component: ${name} } satisfies Meta<typeof ${name}>;
export default meta;
type Story = StoryObj<typeof meta>;

/** TODO: what this story shows. */
export const Default: Story = { args: { children: '${name}' } };
`);

const anchor = "export { Focusable } from 'react-aria-components';";
if (!indexCode.includes(anchor)) fail(`anchor not found in ${index}`);
fs.writeFileSync(p(index), indexCode.replace(anchor, `export { ${name}, type ${name}Props } from './${kebab}/${kebab}.js';\n${anchor}`));

// Appended last: a new file can never change the cascade of the rules before it.
const m = JSON.parse(fs.readFileSync(p(manifest), 'utf8'));
m.components.push(`components/${kebab}.css`);
fs.writeFileSync(p(manifest), JSON.stringify(m, null, 2) + '\n');

console.log(`Created\n${Object.values(files).map((f) => `  + ${f}`).join('\n')}\nModified\n  ~ ${index}\n  ~ ${manifest}

Next (see .claude/skills/nerdlab-ui-kit/SKILL.md or AGENTS.md):
  1. Style .${cls} in ${files.css} with tokens only; add 'use client' to the component only if it needs state/effects.
  2. Replace the TODOs, add variants (cva → nl-* classes) and real tests, enrich the story.
  3. pnpm test   (kit integrity, guards, a11y audit of the new story)
  4. Update the Obsidian vault: "Librairie React Nerdlab" (component table) and "Package CSS de la peau Pop" (created files).`);
