import type { Meta, StoryObj } from '@storybook/react-vite';
import { Delta, Grid, Meter, StatTile } from '@robin-dot-lab/react';

const meta = {
  title: 'Indicators/StatTile',
  component: StatTile,
  subcomponents: { Delta, Meter },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StatTile>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;


/** The value follows the tile's width (container units): it always fits, even four to a row. */
export const KpiRow: Story = {
  render: () => (
    <Grid min="sm" gap={4} style={{ padding: 24 }}>
      <StatTile hero title="REVENUE.EXE" barColor="primary" label="Ticket revenue" value="€144,707"
        meta={<><Delta current={144707} previous={136210} /><span>vs previous 30 days</span></>} />
      <StatTile title="TICKETS" label="Tickets sold" value="6,662" meta={<><Delta current={6662} previous={6443} /><span>vs previous 30 days</span></>} />
      <StatTile title="FILL_RATE" barColor="secondary" label="Fill rate" value="83.8%" meta={<Delta current={0.838} previous={0.81} />}>
        <Meter value={0.838} label="Fill rate" />
      </StatTile>
      <StatTile title="CHURN" barColor="lavender" label="Unsubscribes" value="3.1%" meta={<><Delta current={0.031} previous={0.026} upIsGood={false} /><span>a rise is bad news</span></>} />
    </Grid>
  ),
};

/** Native `<meter>`: the browser draws the width; the colour follows severity (`low` / `high`). */
export const Meters: Story = {
  render: () => (
    <div className="nl-stack" style={{ padding: 24, maxWidth: 420 }}>
      {[0.92, 0.62, 0.31].map((v) => (
        <div key={v} className="nl-stack nl-gap-2">
          <span className="nl-eyebrow nl-muted">value={v}</span>
          <Meter value={v} label={`Goal at ${Math.round(v * 100)}%`} />
        </div>
      ))}
    </div>
  ),
};
