# @robin-dot-lab/react

React 19 components for the **Nerdlab Candy** design system. A thin, typed layer over the `nl-*` classes of `@robin-dot-lab/css-candy`: components map props to classes and add behaviour and accessibility — no CSS-in-JS, no style props, Server Components welcome.

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
pnpm add @robin-dot-lab/react @robin-dot-lab/css-candy
```

Peer dependencies: `react` and `react-dom` ^19.

## Usage

```tsx
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import { Button, Dialog, DialogActions, DialogTrigger } from '@robin-dot-lab/react';

export function Rsvp() {
  return (
    <DialogTrigger>
      <Button variant="primary">Join the party</Button>
      <Dialog title="RSVP.EXE">
        {({ close }) => <DialogActions><Button onClick={close}>See you there</Button></DialogActions>}
      </Dialog>
    </DialogTrigger>
  );
}
```

## Components

| Family | Components |
|---|---|
| Actions | `Button`, `Menu` · `MenuTrigger` · `MenuItem`, `Pagination`, `SegmentedControl`, `ToggleChip` |
| Forms | `Field`, `Input`, `Textarea`, `Select`, `ComboBox`, `DatePicker`, `RadioGroup`, `Checkbox`, `Switch`, `Search` |
| Overlays | `Dialog`, `Drawer`, `Popover`, `Tooltip` (with `DialogTrigger` / `TooltipTrigger`) |
| Content | `Window`, `Card`, `Bento`, `Callout`, `InfoList`, `Accordion`, `Tabs`, `DataTable` (sortable, selectable, stacks into cards) |
| Navigation and people | `Breadcrumb`, `MobileNav`, `Avatar`, `AvatarGroup` |
| Indicators | `StatTile`, `Delta`, `Meter`, `Progress`, `Skeleton`, `Badge`, `Toast` |
| Layout | `Container`, `Section`, `Stack`, `Cluster`, `Grid`, `Split`, `VisuallyHidden` |
| Personality | `Sticker`, `Burst`, `Bubble`, `Pill`, `Ribbon`, `Divider` |

Interactive parts use native elements when the platform is enough (`<details>`, `<meter>`, `<select>`, radios) and [React Aria](https://react-spectrum.adobe.com/react-aria/) otherwise (tabs, tooltip, dialog, drawer, popover, menu, combobox, date picker). Default words and formats follow React Aria's locale: wrap the app in `<I18nProvider locale="fr-FR">` (re-exported here, with `useLocale`); without it, the browser's language. French locales get French words, every other locale English ones; any word can still be passed as a prop (`closeLabel`, `labels`, `emptyLabel`…).

Server Components: import from a server component directly; modules that need the client carry `'use client'`. Function props and `CalendarDate` values cannot cross from a server to a client component: set those from a client component.

Public API: everything exported by the package index, listed in [`api-surface.txt`](api-surface.txt). `Focusable`, `I18nProvider`, `useLocale` (React Aria) and `parseDate`, `today`, `getLocalTimeZone`, `CalendarDate` (@internationalized/date) are passed through: they behave as those packages document.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
