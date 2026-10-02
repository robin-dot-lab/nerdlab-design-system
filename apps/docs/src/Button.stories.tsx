import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@nerdlab/react';

const meta = {
  title: 'Composants/Button',
  component: Button,
  args: { children: 'Subscribe', variant: 'primary', size: 'md', shape: 'pill', disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'secondary', 'accent', 'tomato', 'outline', 'ghost', 'pixel'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['pill', 'square'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="nl-cluster">
      <Button variant="primary">Subscribe</Button>
      <Button variant="secondary">Scan QR-code</Button>
      <Button variant="accent">Mentoring</Button>
      <Button variant="tomato">₩100</Button>
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="pixel">Press start</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="nl-cluster">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
      <Button variant="secondary" shape="square">Square</Button>
    </div>
  ),
};

/** `asChild` : un lien garde sa sémantique (`<a>`) et prend l'apparence d'un bouton. */
export const AsLink: Story = {
  render: () => <Button asChild variant="accent"><a href="#docs">Lire la doc</a></Button>,
};
