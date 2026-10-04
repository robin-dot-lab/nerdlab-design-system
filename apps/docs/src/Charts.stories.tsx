import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarList, ChartCard, Heatmap, Legend, LineChart, ShareBar, Sparkline, type LineSeries } from '@robin-dot-lab/charts';
import { Grid, StatTile, Delta } from '@robin-dot-lab/react';

const eur = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 }).format;
const CARD_LABELS = { showTable: 'Table view', showChart: 'Chart view' };
const wave = (base: number, k: number) => Array.from({ length: 14 }, (_, i) => Math.round(base * (1 + 0.25 * Math.sin(i / 2 + k) + i * 0.02)));
const SERIES: LineSeries[] = [
  { id: 'design', name: 'Design', slot: 1, values: wave(1800, 0) },
  { id: 'music', name: 'Music', slot: 2, values: wave(1500, 1.3) },
  { id: 'code', name: 'Code', slot: 3, values: wave(1100, 2.1) },
  { id: 'food', name: 'Food', slot: 4, values: wave(900, 3.4) },
];
// Real calendar days from 19 September (an earlier `${i + 19} Sep` ran past the end of the month).
const DAYS = Array.from({ length: 14 }, (_, i) => new Date(Date.UTC(2026, 8, 19 + i)).toLocaleDateString('en-US', { day: '2-digit', month: 'short', timeZone: 'UTC' }));

const meta = { title: 'Charts/All', component: LineChart, parameters: { layout: 'padded' } } satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Colour = series (`slot` 1 → 4, fixed order). Focus + ←/→: crosshair and tooltip from the keyboard. */
export const Line: Story = {
  args: { title: 'Revenue by category', series: SERIES, xLabels: DAYS, formatValue: eur.format, formatCompact: compact },
  render: (args) => (
    <ChartCard title="Revenue by category" subtitle="Per day, in euros" labels={CARD_LABELS}
      legend={<Legend kind="line" items={SERIES.map((s) => ({ label: s.name, slot: s.slot }))} />}
      table={{ columns: [{ key: 'd', header: 'Date' }, ...SERIES.map((s) => ({ key: s.id, header: s.name, align: 'end' as const }))], rows: DAYS.map((d, i) => ({ d, ...Object.fromEntries(SERIES.map((s) => [s.id, eur.format(s.values[i]!)])) })) }}>
      <LineChart {...args} />
    </ChartCard>
  ),
};

export const Bars: Story = {
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <ChartCard title="Top events" subtitle="Tickets sold" labels={CARD_LABELS} legend={<Legend kind="rect" items={SERIES.map((s) => ({ label: s.name, slot: s.slot }))} />}>
      <BarList title="Top events" unit="tickets" shareLabel="of top 5" emptyLabel="No data." items={[
        { id: '1', label: 'K-pop Listening Party', value: 994, slot: 2, group: 'Music' },
        { id: '2', label: 'Pixel Shader Jam', value: 805, slot: 3, group: 'Code' },
        { id: '3', label: 'Gochisō Ramen Night', value: 647, slot: 4, group: 'Food' },
        { id: '4', label: 'Synthwave Night', value: 605, slot: 2, group: 'Music' },
        { id: '5', label: 'Graphic Design Workshop', value: 439, slot: 1, group: 'Design' },
      ]} />
    </ChartCard>
  ),
};

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
export const HeatmapStory: Story = {
  name: 'Heatmap',
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <ChartCard title="Attendance" subtitle="Check-ins by day and time slot" labels={CARD_LABELS}>
      <Heatmap title="Check-ins by day and time slot" unit="check-ins" cornerLabel="Day" rowLabels={DOW} colLabels={SLOTS}
        values={DOW.map((_, d) => SLOTS.map((_, s) => Math.round(20 * (s >= 4 ? 1.6 + (d >= 4 ? 0.9 : 0) : 1) * (d >= 5 ? 1.4 : 1) + ((d * 7 + s) % 5) * 3)))} />
    </ChartCard>
  ),
};

/** A percentage is written inside a segment only if it fits AND stays readable (≥ 4.5:1); otherwise the list carries it. */
export const Share: Story = {
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <ChartCard title="Revenue split" subtitle="Share of each category" labels={CARD_LABELS}>
      <ShareBar title="Share of revenue" emptyLabel="No data." formatValue={eur.format} items={SERIES.map((s) => ({ id: s.id, label: s.name, value: s.values.reduce((a, v) => a + v, 0), slot: s.slot }))} />
    </ChartCard>
  ),
};

export const SparklinesInTiles: Story = {
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <Grid min="sm" gap={4}>
      {SERIES.slice(0, 3).map((s) => (
        <StatTile key={s.id} title={s.name.toUpperCase()} label={`${s.name} revenue`} value={eur.format(s.values.at(-1)!)} meta={<Delta current={s.values.at(-1)!} previous={s.values.at(-2)!} />}>
          <Sparkline values={s.values.slice(-12)} />
        </StatTile>
      ))}
    </Grid>
  ),
};
