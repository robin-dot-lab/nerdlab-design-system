# @robin-dot-lab/tokens

The design tokens of **Nerdlab Candy** — colours, type scale, spacing, radii, borders, shadows and chart palettes — in [DTCG](https://www.designtokens.org/) format, compiled by Style Dictionary. The single source of every visual value of the kit.

## Install

Published on GitHub Packages. Add an `.npmrc` next to your `package.json`, with a GitHub token that has the `read:packages` scope:

```ini
@robin-dot-lab:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```sh
pnpm add @robin-dot-lab/tokens
```

## What you get

| Export | Contents |
|---|---|
| `@robin-dot-lab/tokens/candy.css` | CSS custom properties on `:root`, and the dark theme's overrides on `[data-theme="dark"]` / `.dark`. Aliases stay `var()` references, so the dark theme only redefines what changes |
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
