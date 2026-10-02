import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Focusable, Tooltip, TooltipTrigger } from '@nerdlab/react';

const meta = {
  title: 'Composants/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipTrigger },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Survol (après 500 ms) ou focus clavier. Échap ferme. Un élément non React Aria s'enveloppe dans `<Focusable>`. */
export const Default: Story = {
  render: () => (
    <TooltipTrigger>
      <Focusable><Button variant="primary">Exporter</Button></Focusable>
      <Tooltip>Télécharge les commandes filtrées en CSV</Tooltip>
    </TooltipTrigger>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="nl-cluster" style={{ padding: '64px 160px', gap: 160 }}>
      {(['top', 'bottom', 'start', 'end'] as const).map((placement) => (
        <TooltipTrigger key={placement} defaultOpen>
          <Focusable><Button size="sm">{placement}</Button></Focusable>
          <Tooltip placement={placement}>Placement {placement}</Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const OnABadge: Story = {
  render: () => (
    <TooltipTrigger delay={0}>
      <Focusable><span tabIndex={0} role="img" aria-label="Statut bêta"><Badge variant="secondary">Beta</Badge></span></Focusable>
      <Tooltip>Fonctionnalité en cours de test</Tooltip>
    </TooltipTrigger>
  ),
};
