# @robin-dot-lab/charts

Charts for the **Nerdlab Candy** design system, in React and SVG. They compute geometry only — scales, coordinates, lengths, keyboard interaction — and take every colour from the skin's tokens (`--chart-1` … `--chart-4`, `--chart-seq-1` … `--chart-seq-5`), so they follow the theme, light or dark.

## Install

Published on GitHub Packages. Add an `.npmrc` next to your `package.json`, with a GitHub token that has the `read:packages` scope:

```ini
@robin-dot-lab:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

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

<ChartCard title="Tickets" legend={<Legend kind="line" items={series.map((s) => ({ label: s.name, slot: s.slot }))} />}
  labels={{ showTable: 'Table view', showChart: 'Chart view' }}>
  <LineChart title="Tickets per week" series={[...series]} xLabels={['W1', 'W2', 'W3', 'W4']} locale="en-GB" />
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

A series has a `slot` (1–4): at most four series per chart, colours in a fixed order. `locale` (default `fr-FR`) sets number formats and the few built-in sentences.

## Links

- Storybook, every component and state: https://robin-dot-lab.github.io/nerdlab-design-system/
- Integration dashboard built with the kit: https://robin-dot-lab.github.io/nerdlab-design-system/dashboard/
- Repository and the other packages: https://github.com/robin-dot-lab/nerdlab-design-system

MIT © Nerdlab
