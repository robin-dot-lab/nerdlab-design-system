# @robin-dot-lab/css-candy

The **Candy** skin of the Nerdlab design system: candy colours on a neo-brutalist frame — 2px ink outlines, hard offset shadows, retro OS windows, pixel art. Plain CSS, framework-free: every component is a set of `nl-*` classes, usable from React (`@robin-dot-lab/react`), any other framework or hand-written HTML.

## Install

Published on GitHub Packages. Add an `.npmrc` next to your `package.json`, with a GitHub token that has the `read:packages` scope:

```ini
@robin-dot-lab:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

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

- **Dark theme:** `<html data-theme="dark">`.
- **Palettes:** `<html data-palette="sorbet">` — Candy (default), Sorbet, Ink, Terracotta, Slate, Moss, Mono Retro, each light and dark; also on any container. List: `@robin-dot-lab/tokens/palettes.json`.
- **Overrides without `!important`:** the whole skin lives in cascade layers (`nl.tokens < nl.base < nl.components < nl.utilities`), and unlayered CSS always wins. `:root { --color-primary: #7B4DFF; }` re-brands a token.
- **Responsive and accessible:** fluid type and spacing, container queries, 44px touch targets on coarse pointers, `prefers-reduced-motion`, text on candy colours always in ink (≥ 4.5:1).
- No fonts are loaded by `candy.css`: import `fonts.css` or self-host the same families.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
