import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Input } from '@nerdlab/react';

const meta = {
  title: 'Composants/Field',
  component: Field,
  subcomponents: { Input },
  args: { label: 'Email', help: 'On ne le partage avec personne.', children: <Input placeholder="ada@nerdlab.dev" /> },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithHelp: Story = {};

/** `error` remplace l'aide, pose `aria-invalid` et relie le message par `aria-describedby`. */
export const WithError: Story = {
  args: { error: 'Il manque le domaine.', children: <Input defaultValue="ada@nerdlab" /> },
};

export const Form: Story = {
  render: () => (
    <form className="nl-stack" style={{ maxWidth: 360 }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Nom"><Input placeholder="Ada Lovelace" /></Field>
      <Field label="Email" error="Il manque le domaine."><Input defaultValue="ada@nerdlab" /></Field>
    </form>
  ),
};
