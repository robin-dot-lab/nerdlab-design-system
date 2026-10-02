import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Switch } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Switch and Checkbox',
  component: Switch,
  subcomponents: { Checkbox },
  args: { children: 'Notifications', defaultChecked: true, disabled: false },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Native `<input type="checkbox" role="switch">`: works without JavaScript and inside a `<form>`. */
export const SwitchPlayground: Story = {};

export const States: Story = {
  render: () => (
    <div className="nl-stack" style={{ ['--stack-gap' as string]: '12px' }}>
      <Switch defaultChecked>Notifications</Switch>
      <Switch>Zen mode</Switch>
      <Switch disabled>Unavailable</Switch>
      <Checkbox defaultChecked>Get the retro newsletter</Checkbox>
      <Checkbox>Accept chocolate cookies</Checkbox>
      <Checkbox disabled>Locked option</Checkbox>
    </div>
  ),
};
