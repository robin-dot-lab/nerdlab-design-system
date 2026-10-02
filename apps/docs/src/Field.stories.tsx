import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Input } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Field',
  component: Field,
  subcomponents: { Input },
  args: { label: 'Email', help: 'We never share it with anyone.', children: <Input placeholder="ada@nerdlab.dev" /> },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithHelp: Story = {};

/** `error` replaces the help text, sets `aria-invalid` and links the message through `aria-describedby`. */
export const WithError: Story = {
  args: { error: 'The domain is missing.', children: <Input defaultValue="ada@nerdlab" /> },
};

export const Form: Story = {
  render: () => (
    <form className="nl-stack" style={{ maxWidth: 360 }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Name"><Input placeholder="Ada Lovelace" /></Field>
      <Field label="Email" error="The domain is missing."><Input defaultValue="ada@nerdlab" /></Field>
    </form>
  ),
};
