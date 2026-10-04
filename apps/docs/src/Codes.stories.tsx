import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Cluster, Field, Kbd, OTPInput, QRCode, Stack } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Codes and keys',
  component: OTPInput,
  subcomponents: { Kbd, QRCode },
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

/** Dark modules on a light square in every theme, so a phone can scan it; the text is the equivalent (shown or hidden). */
export const QRCodes: Story = {
  render: () => (
    <Card style={{ maxWidth: 640 }}>
      <Cluster gap={6}>
        <QRCode value="pixel-otter-42@nerdlab.sh" label="QR code of your address" showValue />
        <QRCode value="https://nerdlab.sh/inbox/pixel-otter-42" size="sm" />
      </Cluster>
    </Card>
  ),
};
