import type { Meta, StoryObj } from '@storybook/react-vite';
import { Delta, Grid, Meter, StatTile } from '@nerdlab/react';

const meta = {
  title: 'Indicateurs/StatTile',
  component: StatTile,
  subcomponents: { Delta, Meter },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StatTile>;
export default meta;
type Story = StoryObj<typeof meta>;

/** La valeur suit la largeur de la tuile (unités de conteneur) : elle tient toujours, même à quatre par ligne. */
export const KpiRow: Story = {
  render: () => (
    <Grid min="sm" gap={4} style={{ padding: 24 }}>
      <StatTile hero title="REVENUE.EXE" barColor="primary" label="Revenu billetterie" value="144 707 €"
        meta={<><Delta current={144707} previous={136210} /><span>vs 30 j précédents</span></>} />
      <StatTile title="TICKETS" label="Billets vendus" value="6 662" meta={<><Delta current={6662} previous={6443} /><span>vs 30 j précédents</span></>} />
      <StatTile title="FILL_RATE" barColor="secondary" label="Taux de remplissage" value="83,8 %" meta={<Delta current={0.838} previous={0.81} />}>
        <Meter value={0.838} label="Taux de remplissage" />
      </StatTile>
      <StatTile title="CHURN" barColor="lavender" label="Désabonnements" value="3,1 %" meta={<><Delta current={0.031} previous={0.026} upIsGood={false} /><span>une hausse est une mauvaise nouvelle</span></>} />
    </Grid>
  ),
};

/** `<meter>` natif : la largeur est dessinée par le navigateur ; la couleur suit la sévérité (`low` / `high`). */
export const Meters: Story = {
  render: () => (
    <div className="nl-stack" style={{ padding: 24, maxWidth: 420 }}>
      {[0.92, 0.62, 0.31].map((v) => (
        <div key={v} className="nl-stack nl-gap-2">
          <span className="nl-eyebrow nl-muted">value={v}</span>
          <Meter value={v} label={`Objectif à ${Math.round(v * 100)} %`} />
        </div>
      ))}
    </div>
  ),
};
