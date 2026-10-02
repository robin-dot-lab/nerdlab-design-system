import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Focusable, Tooltip, TooltipTrigger } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipTrigger },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Hover (after 500 ms) or keyboard focus. Escape closes. A non-React Aria element is wrapped in `<Focusable>`. */
export const Default: Story = {
  render: () => (
    <TooltipTrigger>
      <Focusable><Button variant="primary">Export</Button></Focusable>
      <Tooltip>Downloads the filtered orders as CSV</Tooltip>
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
      <Focusable><span tabIndex={0} role="img" aria-label="Beta status"><Badge variant="secondary">Beta</Badge></span></Focusable>
      <Tooltip>Feature being tested</Tooltip>
    </TooltipTrigger>
  ),
};
