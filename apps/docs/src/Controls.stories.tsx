import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Cluster, SegmentedControl, ToggleChip, type SwatchToken } from '@robin-dot-lab/react';

const meta = { title: 'Components/Filters', component: SegmentedControl } satisfies Meta<typeof SegmentedControl>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** Single choice without a panel: `aria-pressed` buttons in a group. For panels, use Tabs. */
export const Segmented: Story = {
  render: function Render() {
    const [range, setRange] = useState<7 | 30 | 90>(30);
    return <SegmentedControl label="Period" value={range} onChange={setRange} options={[{ value: 7, label: '7 d' }, { value: 30, label: '30 d' }, { value: 90, label: '90 d' }]} />;
  },
};

const CATS: { id: string; name: string; swatch: SwatchToken }[] = [
  { id: 'design', name: 'Design', swatch: 'chart-1' }, { id: 'music', name: 'Music', swatch: 'chart-2' },
  { id: 'code', name: 'Code', swatch: 'chart-3' }, { id: 'food', name: 'Food', swatch: 'chart-4' },
];

/** On/off filters; the swatch is a token name (`chart-1`…), never a free colour. */
export const Chips: Story = {
  render: function Render() {
    const [on, setOn] = useState(['design', 'music', 'code']);
    return (
      <Cluster gap={2} role="group" aria-label="Categories">
        {CATS.map((c) => (
          <ToggleChip key={c.id} swatch={c.swatch} pressed={on.includes(c.id)} onPressedChange={(p) => setOn((s) => (p ? [...s, c.id] : s.filter((x) => x !== c.id)))}>{c.name}</ToggleChip>
        ))}
      </Cluster>
    );
  },
};
