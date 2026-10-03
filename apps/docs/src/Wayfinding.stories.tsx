import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup, Breadcrumb, Card, Skeleton } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Breadcrumb, Avatar and Skeleton',
  component: Breadcrumb,
  subcomponents: { Avatar, AvatarGroup, Skeleton },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** A `<nav>` landmark with an ordered list; the current page is last, with `aria-current="page"`. Slashes are not read out. */
export const Breadcrumbs: Story = {
  render: () => (
    <Breadcrumb label="Breadcrumb" items={[{ label: 'Home', href: '#home' }, { label: 'Events', href: '#events' }, { label: 'Design', href: '#design' }, { label: 'Figma Pixel Party' }]} />
  ),
};

/** A photo when there is one (and it loads), initials on a candy colour otherwise. Named by the person either way. */
export const Avatars: Story = {
  render: () => (
    <div className="nl-stack nl-gap-6">
      <div className="nl-cluster">
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" tone="mint" />
        <Avatar name="Katherine Johnson" tone="accent" size="lg" />
        <Avatar name="Broken Link" tone="primary" src="#missing-photo" />
      </div>
      <AvatarGroup aria-label="4 people attending">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Grace Hopper" tone="mint" />
        <Avatar name="Radia Perlman" tone="secondary" />
        <Avatar name="Margaret Hamilton" tone="accent" />
      </AvatarGroup>
    </div>
  ),
};

/** Placeholders while loading: hidden from assistive tech; the loading region says `aria-busy`. Still under reduced motion. */
export const Skeletons: Story = {
  render: () => (
    <Card asChild>
      <section aria-busy="true" aria-label="Next event (loading)" className="nl-stack" style={{ maxWidth: 360 }}>
        <div className="nl-cluster"><Skeleton shape="circle" /><div style={{ flex: 1 }}><Skeleton /></div></div>
        <Skeleton shape="block" />
        <Skeleton lines={3} />
      </section>
    </Card>
  ),
};
