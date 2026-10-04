# @robin-dot-lab/tokens

The design tokens of **Nerdlab Candy** — colours, type scale, spacing, radii, borders, shadows and chart palettes — in [DTCG](https://www.designtokens.org/) format, compiled by Style Dictionary. The single source of every visual value of the kit.

## Install

Published on GitHub Packages. Two lines of configuration, in two places:

```ini
# .npmrc in your project (commit it): where the scope lives
@robin-dot-lab:registry=https://npm.pkg.github.com
```

```ini
# ~/.npmrc, your user-level config (never commit it): a GitHub token with the read:packages scope
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

pnpm 11 ignores tokens read from environment variables in a project `.npmrc` (a committed file could leak them), hence the user-level file; `pnpm config set "//npm.pkg.github.com/:_authToken" <token>` works too. pnpm also holds back versions published less than a day ago (`minimumReleaseAge`): right after a release, ask for the version explicitly (`pnpm add @robin-dot-lab/react@1.0.0-rc.0`). Release candidates are published under the `rc` dist-tag (`pnpm add @robin-dot-lab/react@rc`).

```sh
pnpm add @robin-dot-lab/tokens
```

## What you get

| Export | Contents |
|---|---|
| `@robin-dot-lab/tokens/candy.css` | CSS custom properties on `:root`, and the dark theme's overrides on `[data-theme="dark"]` / `.dark` (and on `[data-theme="auto"]` when the device prefers dark). Aliases stay `var()` references, so the dark theme only redefines what changes |
| `@robin-dot-lab/tokens/candy` | One constant per token (`colorPrimary`, `shadowMd`…), typed, with **resolved light-theme** values — for canvas, charts or tests, never for styling components |
| `@robin-dot-lab/tokens/candy.json` | Flat name → value map |

```css
@import '@robin-dot-lab/tokens/candy.css';

.ticket { background: var(--color-accent); color: var(--ink); border: var(--border); box-shadow: var(--shadow-md); }
```

## Palettes

`candy.css` also contains seven palettes (Candy, Sorbet, Ink, Terracotta, Slate, Moss, Mono Retro), each light and dark, selected with `data-palette="…"` on `<html>` or any container. `@robin-dot-lab/tokens/palettes.json` lists them (`id`, `name`, `description`). Each one is checked for contrast and colour-blind-safe chart colours at build time.

Most apps import `@robin-dot-lab/css-candy/candy.css` instead, which already contains these tokens.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
