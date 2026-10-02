import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Field, Input, Radio, RadioGroup, Select, Textarea } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Forms',
  component: RadioGroup,
  subcomponents: { Radio, Select, Textarea },
} satisfies Meta<typeof RadioGroup>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** Native `<select>`: the system picker on mobile, keyboard type-ahead, submitted with the form. */
export const SelectField: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Field label="City" help="Where you will attend.">
        <Select defaultValue="lyon">
          <option value="lyon">Lyon</option>
          <option value="paris">Paris</option>
          <option value="nantes">Nantes</option>
        </Select>
      </Field>
    </div>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 420 }}>
      <Field label="Message"><Textarea placeholder="A question about the workshop?" /></Field>
      <Field label="Bio" error="300 characters at most."><Textarea defaultValue="Pixel artist, shader nerd…" /></Field>
    </div>
  ),
};

/** Native radios in a `<fieldset>`: arrow keys move the selection, the legend names the group. */
export const Radios: Story = {
  render: () => (
    <div className="nl-stack nl-gap-6">
      <RadioGroup legend="Export format" defaultValue="csv">
        <Radio value="csv">CSV</Radio>
        <Radio value="json">JSON</Radio>
        <Radio value="xlsx" disabled>Excel (coming soon)</Radio>
      </RadioGroup>
      <RadioGroup legend="T-shirt size" orientation="horizontal" error="Pick a size.">
        {['S', 'M', 'L', 'XL'].map((s) => <Radio key={s} value={s}>{s}</Radio>)}
      </RadioGroup>
    </div>
  ),
};

export const FullForm: Story = {
  render: () => (
    <form className="nl-stack" style={{ maxWidth: 420 }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Name"><Input placeholder="Ada Lovelace" /></Field>
      <Field label="Workshop"><Select defaultValue="shader"><option value="shader">Shader</option><option value="pixel">Pixel art</option></Select></Field>
      <RadioGroup legend="Level" defaultValue="beginner" orientation="horizontal">
        <Radio value="beginner">Beginner</Radio>
        <Radio value="advanced">Advanced</Radio>
      </RadioGroup>
      <Field label="Comment"><Textarea /></Field>
      <div><Button type="submit" variant="primary">Sign up</Button></div>
    </form>
  ),
};
