import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileNav } from '@nerdlab/react';

const meta = {
  title: 'Composants/MobileNav',
  component: MobileNav,
  args: { label: 'Menu', showLabel: false, children: null },
  // The skin hides the toggle from 1024px up: show the story on a phone-sized viewport.
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MobileNav>;
export default meta;
type Story = StoryObj<typeof meta>;

const links = (
  <>
    <a href="#couleurs">Couleurs <span>01</span></a>
    <a href="#typo">Typographie <span>02</span></a>
    <a href="#composants">Composants <span>03</span></a>
    <a href="#dashboard">Dashboard <span>→</span></a>
  </>
);

/** Bouton (aria-expanded) + panneau. Échap ferme et rend le focus au bouton ; cliquer un lien ferme. */
export const Default: Story = {
  render: (args) => (
    <header style={{ ['--nav-offset' as string]: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, paddingInline: 16, borderBottom: 'var(--border)' }}>
      <strong className="nl-headline">NERDLAB</strong>
      <MobileNav {...args}>{links}</MobileNav>
    </header>
  ),
};

export const WithVisibleLabel: Story = { ...Default, args: { showLabel: true } };

/** Panneau ouvert (audité tel quel par le test d'accessibilité). Au-delà de 1024px la peau masque le bouton : rien à ouvrir. */
export const Opened: Story = {
  ...Default,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.queryByRole('button', { name: 'Menu' });
    if (toggle) await userEvent.click(toggle);
  },
};
