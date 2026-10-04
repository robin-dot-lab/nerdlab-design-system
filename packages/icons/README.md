# @robin-dot-lab/icons

Icons for the **Nerdlab Candy** design system: small React components that render inline SVG drawn with bold 2px round strokes on a 24×24 grid, in the same friendly neo-brutalist spirit as the Candy outlines.

- Colour follows `currentColor`, so an icon takes the colour of the text around it.
- Size comes from the skin: every icon carries the `nl-icon` class (plus `nl-icon--sm` or `nl-icon--lg`). No `width`, `height` or `style` is set in the component.
- Tree-shakeable ES modules (`sideEffects: false`), typed, server-component friendly (no `"use client"` needed).

Documentation and live examples: https://robin-dot-lab.github.io/nerdlab-design-system/

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

pnpm 11 ignores tokens read from environment variables in a project `.npmrc` (a committed file could leak them), hence the user-level file; `pnpm config set "//npm.pkg.github.com/:_authToken" <token>` works too. pnpm also holds back versions published less than a day ago (`minimumReleaseAge`): right after a release, ask for the version explicitly (`pnpm add @robin-dot-lab/react@0.2.0`).

Then:

```sh
pnpm add @robin-dot-lab/icons
# or: npm install @robin-dot-lab/icons
```

Peer dependency: `react` ^19.

## Usage

```tsx
import { Search, Close, Warning } from '@robin-dot-lab/icons';

export function SearchBar() {
  return (
    <label>
      <Search />
      <input type="search" aria-label="Search" />
      <button type="reset" aria-label="Clear">
        <Close size="sm" />
      </button>
    </label>
  );
}

// A meaningful icon on its own needs a title
<Warning title="Payment overdue" size="lg" />;
```

Props (every icon, and the base `Icon`):

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Adds `nl-icon--sm` / `nl-icon--lg`; `md` adds nothing |
| `title` | `string` | — | Gives the icon an accessible name (see below) |
| `className` | `string` | — | Appended after `nl-icon` and the size class |
| other SVG props | | | Spread onto the `<svg>` (`id`, `data-*`, `aria-*`, handlers…) |

`width`, `height` and `style` are not accepted: size and colour belong to the CSS skin.

Draw your own icon with the same frame using `Icon`:

```tsx
import { Icon, type IconProps } from '@robin-dot-lab/icons';

export const Star = (props: Omit<IconProps, 'children'>) => (
  <Icon {...props}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z" />
  </Icon>
);
```

## Accessibility

- **Decorative by default.** Without `title`, the `<svg>` gets `aria-hidden="true"` and `focusable="false"`: screen readers skip it. Use this when the icon sits next to visible text, or inside a control that already has a name (`<button aria-label="Close"><Close /></button>`).
- **Titled when it carries meaning alone.** With `title`, the icon renders `<title id>` (id from `useId`), gets `role="img"` and `aria-labelledby` pointing to that title, and is no longer hidden.

## Icons

`Check`, `Close`, `ChevronDown`, `ChevronUp`, `ChevronLeft`, `ChevronRight`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Plus`, `Minus`, `Search`, `Menu`, `Info`, `Warning`, `Error`, `Success`, `InfoMark` and `ExclamationMark` (bare marks for a coloured disc), `Calendar`, `User`, `ExternalLink`, `Pause`, `Play`, `Sort`, `Home`, `Filter`, `MoreHorizontal`.

Also exported: `Icon` (the base frame) and the types `IconProps`, `IconSize`, `IconComponentProps`.

`Error` shadows the global `Error` constructor in the importing module; alias it if you need both: `import { Error as ErrorIcon } from '@robin-dot-lab/icons'`.

## Licence

MIT © Nerdlab
