# @robin-dot-lab/charts

Charts for the **Nerdlab Candy** design system, in React and SVG. They compute geometry only — scales, coordinates, lengths, keyboard interaction — and take every colour from the skin's tokens (`--chart-1` … `--chart-4`, `--chart-seq-1` … `--chart-seq-5`), so they follow the theme, light or dark.

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
pnpm add @robin-dot-lab/charts @robin-dot-lab/react @robin-dot-lab/css-candy
```

## Usage

```tsx
import { ChartCard, Legend, LineChart } from '@robin-dot-lab/charts';

const series = [
  { id: 'design', name: 'Design', slot: 1, values: [12, 18, 15, 22] },
  { id: 'music', name: 'Music', slot: 2, values: [8, 11, 14, 13] },
] as const;

<ChartCard title="Tickets" legend={<Legend kind="line" items={series.map((s) => ({ label: s.name, slot: s.slot }))} />}>
  <LineChart title="Tickets per week" series={[...series]} xLabels={['W1', 'W2', 'W3', 'W4']} />
</ChartCard>
```

| Component | What it shows |
|---|---|
| `LineChart` | time series on one axis, end labels, crosshair and tooltip, ←/→ from the keyboard |
| `BarList` | ranked horizontal bars with values |
| `Heatmap` | day × time slot grid on a sequential ramp |
| `ShareBar` | 100% stacked bar and its value/share list |
| `Sparkline` | decorative trend in a stat tile |
| `ChartCard`, `Legend` | title, legend and a **table view twin** for every chart |

A series has a `slot` (1–4): at most four series per chart, colours in a fixed order. Number formats and the few built-in sentences follow React Aria's locale, like the rest of the kit: `<I18nProvider locale="fr-FR">` from `@robin-dot-lab/react` (French for French locales, English otherwise).

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
