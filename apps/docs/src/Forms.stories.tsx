import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ComboBox, ComboBoxItem, DatePicker, Field, I18nProvider, Input, parseDate, Radio, RadioGroup, Select, Textarea } from '@robin-dot-lab/react';

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

const CITIES = ['Amsterdam', 'Barcelona', 'Berlin', 'Lille', 'Lisbon', 'London', 'Lyon', 'Paris', 'Prague'];

/** A text field that filters its options: type « li » to keep Lille and Lisbon. Use Select when there is nothing to search. */
export const ComboBoxField: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 360, paddingBlockEnd: 280 }}>
      <ComboBox label="City" description="Where the event takes place." placeholder="Start typing…" emptyLabel="No matching city.">
        {CITIES.map((c) => <ComboBoxItem key={c} id={c}>{c}</ComboBoxItem>)}
      </ComboBox>
      <ComboBox label="Venue" errorMessage="Pick a venue from the list." defaultInputValue="Atlantis">
        {['Nerdlab 378', 'La Halle', 'Le Sucre'].map((v) => <ComboBoxItem key={v} id={v}>{v}</ComboBoxItem>)}
      </ComboBox>
    </div>
  ),
};

/** Typed segment by segment (arrows change the focused one) or picked in the calendar. The locale (`I18nProvider`, toolbar « Locale ») sets the order. */
export const DatePickerField: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 360 }}>
      <DatePicker label="Event date" defaultValue={parseDate('2026-04-27')} description="Day, month, year." />
      <I18nProvider locale="en-US"><DatePicker label="US order" defaultValue={parseDate('2026-04-27')} /></I18nProvider>
    </div>
  ),
};

export const DatePickerOpen: Story = {
  render: () => (
    <div style={{ maxWidth: 360, paddingBlockEnd: 380 }}>
      <DatePicker label="Event date" defaultValue={parseDate('2026-04-27')} defaultOpen />
    </div>
  ),
};
