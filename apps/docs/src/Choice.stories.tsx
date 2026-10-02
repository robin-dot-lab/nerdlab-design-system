import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Switch } from '@nerdlab/react';

const meta = {
  title: 'Composants/Switch et Checkbox',
  component: Switch,
  subcomponents: { Checkbox },
  args: { children: 'Notifications', defaultChecked: true, disabled: false },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

/** `<input type="checkbox" role="switch">` natif : fonctionne sans JavaScript et dans un `<form>`. */
export const SwitchPlayground: Story = {};

export const States: Story = {
  render: () => (
    <div className="nl-stack" style={{ ['--stack-gap' as string]: '12px' }}>
      <Switch defaultChecked>Notifications</Switch>
      <Switch>Mode zen</Switch>
      <Switch disabled>Indisponible</Switch>
      <Checkbox defaultChecked>Recevoir la newsletter rétro</Checkbox>
      <Checkbox>Accepter les cookies au chocolat</Checkbox>
      <Checkbox disabled>Option verrouillée</Checkbox>
    </div>
  ),
};
