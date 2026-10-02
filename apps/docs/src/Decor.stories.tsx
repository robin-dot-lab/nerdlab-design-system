import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, Burst, Divider, Pill, Ribbon, Sticker, StickerSmall } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Decor',
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

/** Two or three words at most. A star without text is decorative (hidden from screen readers). */
export const StickersAndBursts: Story = {
  render: () => (
    <div className="nl-cluster nl-gap-8" style={{ padding: 16 }}>
      <Sticker>25<StickerSmall>spots</StickerSmall></Sticker>
      <Sticker tone="accent" tilt="right" size="lg">Free entry</Sticker>
      <Sticker tone="mint" tilt="none">Sold out</Sticker>
      <Burst>NEW</Burst>
      <Burst tone="primary">-20%</Burst>
      <Burst tone="mint" />
      <Bubble>OK!</Bubble>
    </div>
  ),
};

/** Scrolling band: read once by screen readers, with a pause button (WCAG 2.2.2), still when motion is reduced. */
export const RibbonBand: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <Ribbon items={['Stay nerdy', 'Pixel art', 'Workshops', 'Lyon 04.27']} pauseLabel="Pause scrolling" playLabel="Resume scrolling" />,
};

export const Dividers: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <p>Standard ticket</p>
      <Divider />
      <p>VIP ticket</p>
    </div>
  ),
};
