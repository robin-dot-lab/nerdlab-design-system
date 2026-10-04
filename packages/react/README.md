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

pnpm 11 ignores tokens read from environment variables in a project `.npmrc` (a committed file could leak them), hence the user-level file; `pnpm config set "//npm.pkg.github.com/:_authToken" <token>` works too. pnpm also holds back versions published less than a day ago (`minimumReleaseAge`): right after a release, ask for the version explicitly (`pnpm add @robin-dot-lab/react@0.2.0`).

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
      <Dialog title="RSVP.EXE" closeLabel="Close">
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

Interactive parts use native elements when the platform is enough (`<details>`, `<meter>`, `<select>`, radios) and [React Aria](https://react-spectrum.adobe.com/react-aria/) otherwise (tabs, tooltip, dialog, drawer, popover, menu, combobox, date picker). Default labels are in French; every component takes its labels as props (`closeLabel`, `labels`, `locale`…).

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
