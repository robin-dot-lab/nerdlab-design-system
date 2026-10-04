import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@robin-dot-lab/react';

const meta = { title: 'Foundations/Type scale' } satisfies Meta;
export default meta;
type Story = StoryObj;

/**
 * `.nl-display` and `.nl-headline` set the face, weight and spacing; the size comes from a modifier
 * (`--sm`, `--md`, `--lg`, `--xl`), each reading a fluid `--text-*` token, so titles grow with the screen.
 */
export const Scale: Story = {
  render: () => (
    <Stack gap={6}>
      <Stack gap={3}>
        <p className="nl-eyebrow">Display</p>
        <p className="nl-display nl-display--xl">Mail in one click</p>
        <p className="nl-display nl-display--lg">Mail in one click</p>
        <p className="nl-display nl-display--md">Mail in one click</p>
        <p className="nl-display nl-display--sm">Mail in one click</p>
      </Stack>
      <Stack gap={3}>
        <p className="nl-eyebrow">Headline</p>
        <p className="nl-headline nl-headline--xl">How it works</p>
        <p className="nl-headline nl-headline--lg">How it works</p>
        <p className="nl-headline nl-headline--md">How it works</p>
        <p className="nl-headline nl-headline--sm">How it works</p>
      </Stack>
    </Stack>
  ),
};
