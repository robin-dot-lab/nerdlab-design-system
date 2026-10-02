import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, Burst, Divider, Pill, Ribbon, Sticker, StickerSmall } from '@nerdlab/react';

const meta = {
  title: 'Composants/Décor',
  component: Sticker,
  subcomponents: { Pill, Burst, Bubble, Ribbon, Divider },
} satisfies Meta<typeof Sticker>;
export default meta;
// Render-only stories mixing several components: args are not typed here.
type Story = StoryObj;

export const Pills: Story = {
  render: () => (
    <div className="nl-cluster">
      <Pill filled>Mentoring with Drew</Pill>
      <Pill>Free coffee</Pill>
      <Pill>3 hours learning</Pill>
      <Pill>Certificate</Pill>
    </div>
  ),
};

/** Deux ou trois mots maximum. Une étoile sans texte est décorative (masquée aux lecteurs d'écran). */
export const StickersAndBursts: Story = {
  render: () => (
    <div className="nl-cluster nl-gap-8" style={{ padding: 16 }}>
      <Sticker>25<StickerSmall>places</StickerSmall></Sticker>
      <Sticker tone="accent" tilt="right" size="lg">Free entry</Sticker>
      <Sticker tone="mint" tilt="none">Sold out</Sticker>
      <Burst>NEW</Burst>
      <Burst tone="primary">-20%</Burst>
      <Burst tone="mint" />
      <Bubble>OK!</Bubble>
    </div>
  ),
};

/** Bandeau défilant : lu une fois par les lecteurs d'écran, bouton pause (WCAG 2.2.2), immobile si les animations sont réduites. */
export const RibbonBand: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <Ribbon items={['Stay nerdy', 'Pixel art', 'Workshops', 'Lyon 04.27']} />,
};

export const Dividers: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <p>Billet standard</p>
      <Divider />
      <p>Billet VIP</p>
    </div>
  ),
};
