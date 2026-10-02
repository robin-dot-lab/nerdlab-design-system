import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Window } from '@nerdlab/react';

const meta = {
  title: 'Composants/Window',
  component: Window,
  subcomponents: { 'Window.Bar': Window.Bar, 'Window.Body': Window.Body },
} satisfies Meta<typeof Window>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Window style={{ maxWidth: 380 }}>
      <Window.Bar>NERDLAB.EXE</Window.Bar>
      <Window.Body>Le composant signature de la peau Candy : une fenêtre d'OS rétro.</Window.Body>
    </Window>
  ),
};

export const BarColors: Story = {
  render: () => (
    <div className="nl-grid-auto" style={{ ['--grid-min' as string]: '14rem' }}>
      {(['accent', 'primary', 'secondary', 'lavender', 'mint'] as const).map((color) => (
        <Window key={color}>
          <Window.Bar color={color}>{color.toUpperCase()}.CFG</Window.Bar>
          <Window.Body>color=&quot;{color}&quot;</Window.Body>
        </Window>
      ))}
    </div>
  ),
};

export const WithoutControls: Story = {
  render: () => (
    <Window style={{ maxWidth: 380 }}>
      <Window.Bar color="primary" controls={false}>TICKET.EXE</Window.Bar>
      <Window.Body><Button variant="primary">Réserver</Button></Window.Body>
    </Window>
  ),
};
