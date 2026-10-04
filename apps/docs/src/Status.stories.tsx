import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner, Button, Card, CodeBlock, ExpiryIndicator, RelativeTime, Stack, StatusDot } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Time and status',
  component: RelativeTime,
  subcomponents: { ExpiryIndicator, StatusDot, CodeBlock, Banner },
} satisfies Meta<typeof RelativeTime>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

// Dates relative to the moment the story renders, so the wording (and the screenshot) never drifts.
const ago = (ms: number) => new Date(Date.now() - ms);
const inMs = (ms: number) => new Date(Date.now() + ms);
const MIN = 60_000;

/** Relative wording in the toolbar's locale, refreshed on its own. Focus one (Tab) to see the absolute date in a tooltip. */
export const RelativeTimes: Story = {
  render: () => (
    <Stack gap={2}>
      <p style={{ margin: 0 }}>Received <RelativeTime date={ago(10_000)} /></p>
      <p style={{ margin: 0 }}>Received <RelativeTime date={ago(2 * MIN)} /></p>
      <p style={{ margin: 0 }}>Received <RelativeTime date={ago(5 * 60 * MIN)} /></p>
      <p style={{ margin: 0 }}>Received <RelativeTime date={ago(3 * 24 * 60 * MIN)} /></p>
      <p style={{ margin: 0 }}>Without tooltip (inside a list item): <RelativeTime date={ago(40 * MIN)} tooltip={false} /></p>
    </Stack>
  ),
};

/** Three states, each said in words; the colour only repeats them. The bar reuses `Meter` (a measure with a severity). */
export const Expiry: Story = {
  render: () => (
    <Stack gap={6} style={{ maxWidth: 360 }}>
      <ExpiryIndicator expiresAt={inMs(42 * MIN)} />
      <ExpiryIndicator expiresAt={inMs(3 * MIN)} />
      <ExpiryIndicator expiresAt={ago(MIN)} />
      <ExpiryIndicator variant="bar" startedAt={ago(18 * MIN)} expiresAt={inMs(42 * MIN)} />
      <ExpiryIndicator variant="bar" startedAt={ago(57 * MIN)} expiresAt={inMs(3 * MIN)} />
      <ExpiryIndicator variant="bar" startedAt={ago(61 * MIN)} expiresAt={ago(MIN)} />
    </Stack>
  ),
};

/** A dot always comes with words, shown or hidden. `pulse` for something live; still under reduced motion. */
export const StatusDots: Story = {
  render: () => (
    <Stack gap={3}>
      <StatusDot tone="ok" pulse label="Receiving mail" />
      <StatusDot tone="warn" label="Expiring soon" />
      <StatusDot tone="bad" label="Expired" />
      <StatusDot tone="info" label="Forwarding on" />
      <StatusDot label="Paused" />
      <p style={{ margin: 0 }}>Hidden words: <StatusDot tone="ok" label="Active" hideLabel /></p>
    </Stack>
  ),
};

const SOURCE = `Return-Path: <hello@pixelparty.example>
Received: from mx.pixelparty.example (mx.pixelparty.example [203.0.113.7]) by in.nerdlab.sh with ESMTPS id 4f2a9c; Sat, 04 Oct 2026 11:58:02 +0000
From: Pixel Party <hello@pixelparty.example>
To: pixel-otter-42@nerdlab.sh
Subject: Your ticket for Figma Pixel Party
Content-Type: text/html; charset=utf-8

<p>Hi! Your ticket is attached.</p>`;

/** Focus the block (Tab) and scroll long lines with the arrow keys; or wrap them. */
export const CodeBlocks: Story = {
  render: () => (
    <Stack gap={4} style={{ maxWidth: 640 }}>
      <CodeBlock label="Message source">{SOURCE}</CodeBlock>
      <CodeBlock label="Wrapped" wrap>{SOURCE}</CodeBlock>
    </Stack>
  ),
};

/** Site-wide messages, distinct from `Callout` (in the page) and `Toast` (goes away). Close is optional. */
export const Banners: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <Banner tone="warning" action={<Button size="sm">Resend email</Button>} onDismiss={() => {}}>Your email address is not verified yet.</Banner>
      <Banner tone="info" onDismiss={() => {}}>Scheduled maintenance tonight from 10 pm to 11 pm.</Banner>
      <Banner tone="success">Your addresses were extended by 24 hours.</Banner>
      <Banner tone="error" action={<Button size="sm" variant="primary">Retry</Button>}>Incoming mail is delayed.</Banner>
      <Card style={{ margin: 'var(--space-4)' }}><p style={{ margin: 0 }}>Page content.</p></Card>
    </div>
  ),
};
