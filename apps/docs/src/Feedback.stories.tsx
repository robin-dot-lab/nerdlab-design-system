import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox } from '@robin-dot-lab/icons';
import { Button, Card, Cluster, CopyButton, CopyField, EmptyState, Field, Spinner, Stack } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Feedback',
  component: EmptyState,
  subcomponents: { Spinner, CopyButton, CopyField },
} satisfies Meta<typeof EmptyState>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** An empty list: decorative icon, title, why it is empty, one action. */
export const Empty: Story = {
  render: () => (
    <Card style={{ maxWidth: 520 }}>
      <EmptyState
        icon={<Inbox />}
        title="No messages yet"
        description="Mail sent to this address shows up here within seconds."
        action={<Button variant="primary">Copy the address</Button>}
      />
    </Card>
  ),
};

/** Without an action or an icon. */
export const EmptyMinimal: Story = { render: () => <EmptyState title="No results" description="Try another search." /> };

/** `Spinner` alone is a polite status with words; it stands still when the user reduces motion. */
export const Spinners: Story = {
  render: () => (
    <Cluster gap={6}>
      <Spinner size="sm" />
      <Spinner label="Loading messages" />
      <Spinner size="lg" />
    </Cluster>
  ),
};

/** `Button loading`: `aria-busy` and `aria-disabled`, still focusable, same name; the spinner replaces the label visually. */
export const ButtonLoading: Story = {
  render: () => (
    <Cluster gap={4}>
      <Button variant="primary" loading>Create address</Button>
      <Button loading>Refresh</Button>
      <Button size="sm" variant="secondary" loading>Save</Button>
    </Cluster>
  ),
};

/** Copy with feedback: the icon becomes a check and “Copied” is announced. When the clipboard refuses, an error mark and a message. */
export const Copy: Story = {
  render: () => (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      <Field label="Your address" help="Expires in 1 hour."><CopyField value="pixel-otter-42@nerdlab.sh" copyLabel="Copy address" /></Field>
      <Cluster gap={3}>
        <CopyButton value="pixel-otter-42@nerdlab.sh" />
        <CopyButton value="pixel-otter-42@nerdlab.sh" showLabel variant="default" />
      </Cluster>
    </Stack>
  ),
};
