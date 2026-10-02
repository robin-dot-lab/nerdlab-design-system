import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileNav } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/MobileNav',
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
    <a href="#colours">Colours <span>01</span></a>
    <a href="#typography">Typography <span>02</span></a>
    <a href="#components">Components <span>03</span></a>
    <a href="#dashboard">Dashboard <span>→</span></a>
  </>
);

/** Button (aria-expanded) + panel. Escape closes and returns focus to the button; clicking a link closes. */
export const Default: Story = {
  render: (args) => (
    <header style={{ ['--nav-offset' as string]: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, paddingInline: 16, borderBottom: 'var(--border)' }}>
      <strong className="nl-headline">NERDLAB</strong>
      <MobileNav {...args}>{links}</MobileNav>
    </header>
  ),
};

export const WithVisibleLabel: Story = { ...Default, args: { showLabel: true } };

/** Open panel (audited as is by the accessibility test). Above 1024px the skin hides the button: nothing to open. */
export const Opened: Story = {
  ...Default,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.queryByRole('button', { name: 'Menu' });
    if (toggle) await userEvent.click(toggle);
  },
};
