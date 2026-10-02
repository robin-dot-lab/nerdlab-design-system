import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@nerdlab/react';

const meta = {
  title: 'Composants/Badge',
  component: Badge,
  args: { children: 'New', variant: 'accent' },
  argTypes: { variant: { control: 'select', options: ['accent', 'primary', 'secondary', 'mint', 'lavender', 'tomato', 'ink'] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="nl-cluster">
      <Badge>New</Badge>
      <Badge variant="primary">Hot</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="mint">Live</Badge>
      <Badge variant="lavender">Batch 26</Badge>
      <Badge variant="tomato">Sold out</Badge>
      <Badge variant="ink">v1.0</Badge>
    </div>
  ),
};
