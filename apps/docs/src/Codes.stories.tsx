import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Kbd, OTPInput, Stack } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Codes and keys',
  component: OTPInput,
  subcomponents: { Kbd },
} satisfies Meta<typeof OTPInput>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** One group named by the field; each cell says its position. Paste the whole code in any cell, or let the browser autofill it. */
export const OneTimeCode: Story = {
  render: () => (
    <Stack gap={6} style={{ maxWidth: 420 }}>
      <Field label="Verification code" help="Sent to pixel-otter-42@nerdlab.sh."><OTPInput defaultValue="482" /></Field>
      <Field label="Recovery code" error="This code has expired."><OTPInput length={4} mode="alphanumeric" defaultValue="K9Q2" /></Field>
      <Field label="Disabled"><OTPInput length={4} disabled /></Field>
    </Stack>
  ),
};

/** Keys and combinations in `<kbd>`. */
export const Keys: Story = {
  render: () => (
    <Stack gap={3}>
      <p style={{ margin: 0 }}>Next message: <Kbd>J</Kbd> or <Kbd>↓</Kbd> · previous: <Kbd>K</Kbd> or <Kbd>↑</Kbd></p>
      <p style={{ margin: 0 }}>Search: <Kbd><Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></Kbd></p>
    </Stack>
  ),
};
