import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Cluster, SegmentedControl, ToggleChip, type SwatchToken } from '@nerdlab/react';

const meta = { title: 'Composants/Filtres', component: SegmentedControl } satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Choix unique sans panneau : boutons `aria-pressed` dans un groupe. Pour des panneaux, utiliser Tabs. */
export const Segmented: Story = {
  render: function Render() {
    const [range, setRange] = useState<7 | 30 | 90>(30);
    return <SegmentedControl label="Période" value={range} onChange={setRange} options={[{ value: 7, label: '7 j' }, { value: 30, label: '30 j' }, { value: 90, label: '90 j' }]} />;
  },
};

const CATS: { id: string; name: string; swatch: SwatchToken }[] = [
  { id: 'design', name: 'Design', swatch: 'chart-1' }, { id: 'music', name: 'Musique', swatch: 'chart-2' },
  { id: 'code', name: 'Code', swatch: 'chart-3' }, { id: 'food', name: 'Food', swatch: 'chart-4' },
];

/** Filtres marche/arrêt ; la pastille est un nom de token (`chart-1`…), jamais une couleur libre. */
export const Chips: Story = {
  render: function Render() {
    const [on, setOn] = useState(['design', 'music', 'code']);
    return (
      <Cluster gap={2} role="group" aria-label="Catégories">
        {CATS.map((c) => (
          <ToggleChip key={c.id} swatch={c.swatch} pressed={on.includes(c.id)} onPressedChange={(p) => setOn((s) => (p ? [...s, c.id] : s.filter((x) => x !== c.id)))}>{c.name}</ToggleChip>
        ))}
      </Cluster>
    );
  },
};
