# @robin-dot-lab/css-bento

The **Bento** skin of the Nerdlab design system: tonal tiles on a grey-green page, large rounded corners, pill buttons, big numbers in Outfit, text in Manrope — no outlines, no hard shadows, no pixel art. It has **exactly the same `nl-*` classes** as [`@robin-dot-lab/css-candy`](../css-candy) (a test fails if one skin has a class the other lacks), so `@robin-dot-lab/react`, `@robin-dot-lab/charts` and `@robin-dot-lab/mail` render in either skin unchanged. Plain CSS, framework-free.

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
pnpm add @robin-dot-lab/css-bento
```

## Usage

Import **one** skin: Bento instead of Candy, never both (they share class and layer names).

```ts
import '@robin-dot-lab/css-bento/fonts.css'; // optional: Outfit, Manrope, JetBrains Mono from Google Fonts
import '@robin-dot-lab/css-bento/bento.css'; // tokens + base + components + utilities
```

```html
<button class="nl-btn nl-btn--primary nl-btn--arrow">Create an account</button>
<div class="nl-bento nl-bento--secondary">
  <h3 class="nl-bento__title">4821</h3>
</div>
```

- **Dark theme:** `<html data-theme="dark">`, or `data-theme="auto"` to follow the device (live). A container with `data-theme="light"` stays light on a dark page (a highlighted code, a preview).
- **One palette:** Bento's own. `data-palette` has no effect under this skin.
- **Tones** (same names as Candy, Bento colours — green, yellow and pink, flat): `primary` forest (white text), `accent` butter (the call to action, always ink text), `secondary` powder pink (selection, current page), `mint` sage (success), `lavender` neutral grey-green (info), `tomato` raspberry for destructive actions (white text), `violet` dark forest (links), `ink`.
- **Only what floats has a shadow** (dialog, menu, popover, tooltip, toast, drawer). Form controls keep a 1.5px boundary at 3:1; tiles and buttons have none. Focus is an offset ring over a surface-coloured halo, an outline in forced colours.
- **Overrides without `!important`:** cascade layers `nl.tokens < nl.base < nl.components < nl.utilities`; unlayered CSS always wins.
- No fonts are loaded by `bento.css`: import `fonts.css` or self-host the same families, and copy its metric-matched fallback faces (`Outfit Fallback`, `Manrope Fallback`, `JetBrains Mono Fallback`) so the page does not shift when the web fonts arrive.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
