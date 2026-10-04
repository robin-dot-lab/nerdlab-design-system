# @robin-dot-lab/css-candy

The **Candy** skin of the Nerdlab design system: candy colours on a neo-brutalist frame — 2px ink outlines, hard offset shadows, retro OS windows, pixel art. Plain CSS, framework-free: every component is a set of `nl-*` classes, usable from React (`@robin-dot-lab/react`), any other framework or hand-written HTML.

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
pnpm add @robin-dot-lab/css-candy
```

## Usage

```ts
import '@robin-dot-lab/css-candy/fonts.css'; // optional: Bricolage Grotesque, Outfit, Space Mono, Silkscreen from Google Fonts
import '@robin-dot-lab/css-candy/candy.css'; // tokens + base + components + utilities
```

```html
<button class="nl-btn nl-btn--primary">Join the party</button>
<span class="nl-badge nl-badge--mint">New</span>
<div class="nl-window">
  <div class="nl-window__bar"><span>HELLO.EXE</span></div>
  <div class="nl-window__body">Hi!</div>
</div>
```

- **Dark theme:** `<html data-theme="dark">`, or `data-theme="auto"` to follow the device's light/dark setting (live).
- **Palettes:** `<html data-palette="sorbet">` — Candy (default), Sorbet, Ink, Terracotta, Slate, Moss, Mono Retro, each light and dark; also on any container. List: `@robin-dot-lab/tokens/palettes.json` (add `@robin-dot-lab/tokens` to your dependencies to import it).
- **Overrides without `!important`:** the whole skin lives in cascade layers (`nl.tokens < nl.base < nl.components < nl.utilities`), and unlayered CSS always wins. `:root { --color-primary: #7B4DFF; }` re-brands a token.
- **Responsive and accessible:** fluid type and spacing, container queries, 44px touch targets on coarse pointers, `prefers-reduced-motion`, text on candy colours always in ink (≥ 4.5:1).
- No fonts are loaded by `candy.css`: import `fonts.css` or self-host the same families. `fonts.css` also declares metric-matched fallback faces (`Outfit Fallback`…, local Arial and Courier New resized to the web fonts' metrics): the page does not shift when the web fonts arrive. Self-hosting? Copy those `@font-face` blocks too.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
