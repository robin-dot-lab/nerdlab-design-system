import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarList, ChartCard, Heatmap, Legend, LineChart, ShareBar, Sparkline, type LineSeries } from '@nerdlab/charts';
import { Grid, StatTile, Delta } from '@nerdlab/react';

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const compact = (v: number) => new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(v) + ' €';
const wave = (base: number, k: number) => Array.from({ length: 14 }, (_, i) => Math.round(base * (1 + 0.25 * Math.sin(i / 2 + k) + i * 0.02)));
const SERIES: LineSeries[] = [
  { id: 'design', name: 'Design', slot: 1, values: wave(1800, 0) },
  { id: 'music', name: 'Musique', slot: 2, values: wave(1500, 1.3) },
  { id: 'code', name: 'Code', slot: 3, values: wave(1100, 2.1) },
  { id: 'food', name: 'Food', slot: 4, values: wave(900, 3.4) },
];
const DAYS = Array.from({ length: 14 }, (_, i) => `${String(i + 19).padStart(2, '0')} sept`);

const meta = { title: 'Graphes/Tous', component: LineChart, parameters: { layout: 'padded' } } satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Couleur = série (`slot` 1 → 4, ordre fixe). Focus + ←/→ : réticule et infobulle au clavier. */
export const Line: Story = {
  args: { title: 'Revenu par catégorie', series: SERIES, xLabels: DAYS, formatValue: eur.format, formatCompact: compact },
  render: (args) => (
    <ChartCard title="Revenu par catégorie" subtitle="Par jour, en euros"
      legend={<Legend kind="line" items={SERIES.map((s) => ({ label: s.name, slot: s.slot }))} />}
      table={{ columns: [{ key: 'd', header: 'Date' }, ...SERIES.map((s) => ({ key: s.id, header: s.name, align: 'end' as const }))], rows: DAYS.map((d, i) => ({ d, ...Object.fromEntries(SERIES.map((s) => [s.id, eur.format(s.values[i]!)])) })) }}>
      <LineChart {...args} />
    </ChartCard>
  ),
};

export const Bars: Story = {
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <ChartCard title="Top événements" subtitle="Billets vendus" legend={<Legend kind="rect" items={SERIES.map((s) => ({ label: s.name, slot: s.slot }))} />}>
      <BarList title="Top événements" unit="billets" shareLabel="du top 5" items={[
        { id: '1', label: 'K-pop Listening Party', value: 994, slot: 2, group: 'Musique' },
        { id: '2', label: 'Pixel Shader Jam', value: 805, slot: 3, group: 'Code' },
        { id: '3', label: 'Gochisō Ramen Night', value: 647, slot: 4, group: 'Food' },
        { id: '4', label: 'Synthwave Night', value: 605, slot: 2, group: 'Musique' },
        { id: '5', label: 'Graphic Design Workshop', value: 439, slot: 1, group: 'Design' },
      ]} />
    </ChartCard>
  ),
};

const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], SLOTS = ['10h', '12h', '14h', '16h', '18h', '20h', '22h'];
export const HeatmapStory: Story = {
  name: 'Heatmap',
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <ChartCard title="Affluence" subtitle="Check-ins par jour et créneau">
      <Heatmap title="Check-ins par jour et créneau" unit="check-ins" cornerLabel="Jour" rowLabels={DOW} colLabels={SLOTS}
        values={DOW.map((_, d) => SLOTS.map((_, s) => Math.round(20 * (s >= 4 ? 1.6 + (d >= 4 ? 0.9 : 0) : 1) * (d >= 5 ? 1.4 : 1) + ((d * 7 + s) % 5) * 3)))} />
    </ChartCard>
  ),
};

/** Un pourcentage n'est écrit dans un segment que s'il y tient ET reste lisible (≥ 4,5:1) ; sinon la liste le porte. */
export const Share: Story = {
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <ChartCard title="Répartition du revenu" subtitle="Part de chaque catégorie">
      <ShareBar title="Part du revenu" formatValue={eur.format} items={SERIES.map((s) => ({ id: s.id, label: s.name, value: s.values.reduce((a, v) => a + v, 0), slot: s.slot }))} />
    </ChartCard>
  ),
};

export const SparklinesInTiles: Story = {
  args: { title: '', series: [], xLabels: [] },
  render: () => (
    <Grid min="sm" gap={4}>
      {SERIES.slice(0, 3).map((s) => (
        <StatTile key={s.id} title={s.name.toUpperCase()} label={`Revenu ${s.name}`} value={eur.format(s.values.at(-1)!)} meta={<Delta current={s.values.at(-1)!} previous={s.values.at(-2)!} />}>
          <Sparkline values={s.values.slice(-12)} />
        </StatTile>
      ))}
    </Grid>
  ),
};
