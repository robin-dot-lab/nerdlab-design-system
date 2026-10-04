import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox } from '@robin-dot-lab/icons';
import { AttachmentList, EmailViewer, MessageHeader } from '@robin-dot-lab/mail';
import {
  Accordion, AccordionItem, AuthLayout, Avatar, Bento, Button, Card, Cluster, CopyField, Field, Grid, Meter, MobileNav, Sidebar,
  SidebarItem, SidebarSection, Split, Stack, StatusDot, Sticker, Topbar,
} from '@robin-dot-lab/react';

// Each story reproduces a defect reported by the mail platform's UI audit (K1…K17) and shows it fixed.
// They stay as regression tests: the visual baselines catch a return of the defect.
const meta = { title: 'Foundations/Stress cases' } satisfies Meta;
export default meta;
type Story = StoryObj;

/** K1, K16: a pane next to a taller one keeps its rows at the top; headings and paragraphs keep no browser margin. */
export const StretchedPane: Story = {
  render: () => (
    <Split ratio="sidebar">
      <Stack gap={2} aria-label="Many rows">
        {Array.from({ length: 30 }, (_, i) => <p key={i}>Row {i + 1}</p>)}
      </Stack>
      <Stack gap={4}>
        <MessageHeader subject="A short message" from={{ name: 'Sender', address: 'sender@example.org' }} to={[{ address: 'me@example.org' }]}
          date="2026-10-04T10:00:00Z" onDelete={() => {}} onViewSource={() => {}} />
        <Card><Stack gap={2}><h3>Receive only</h3><p>You cannot reply or write from these addresses.</p></Stack></Card>
      </Stack>
    </Split>
  ),
};

/** K2: long attachment names wrap inside the list instead of widening the page. */
export const LongAttachmentNames: Story = {
  render: () => (
    <AttachmentList attachments={[
      { name: 'Q3-2026-financial-report-final-version-reviewed-by-legal-and-accounting.pdf', size: 184_000, type: 'application/pdf', href: '#' },
      { name: 'archive-of-everything-you-asked-for-including-the-old-backups.zip', size: 4_900_000, type: 'application/zip', href: '#' },
    ]} />
  ),
};

/** K3: a long sidebar label is cut by an ellipsis (whole on hover and for screen readers); the sidebar keeps its width. */
export const LongSidebarLabels: Story = {
  render: () => (
    <div className="nl-card" style={{ height: 240, padding: 0, overflow: 'hidden' }}>
      <Sidebar label="Main navigation">
        <SidebarSection title="Addresses">
          <SidebarItem href="#" icon={<Inbox />} current count={66} countLabel="66 unread messages">newsletter-signup-test-2026-ab@disposable.example</SidebarItem>
        </SidebarSection>
      </Sidebar>
    </div>
  ),
};

/** K4: a long unbroken value shown whole, in a multiline CopyField or as text with `.nl-break-anywhere`. */
export const LongCopyValue: Story = {
  render: () => (
    <Card style={{ maxWidth: 320 }}>
      <Stack gap={4}>
        <Field label="Address"><CopyField multiline value="newsletter-signup-test-2026-ab@disposable.example" /></Field>
        <p className="nl-break-anywhere">tok_live_9f8e7d6c5b4a39281706f5e4d3c2b1a0ffeeddccbbaa99887766</p>
      </Stack>
    </Card>
  ),
};

/** K5, K6: the mobile menu keeps the case of an address and marks the current page; it opens under a two-row bar. */
export const MobileNavUnderATallBar: Story = {
  // Opened when the toggle exists (below the skin's 1024px breakpoint: the phone screenshot).
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.queryByRole('button', { name: 'Menu' });
    if (toggle && (toggle as HTMLElement).offsetParent) await userEvent.click(toggle);
  },
  render: () => (
    <Topbar
      title={<h1>newsletter-signup-test-2026-ab@disposable.example</h1>}
      actions={<StatusDot tone="ok" label="Live" />}
      user={<Button shape="square" aria-label="Account"><Avatar name="Ada Lovelace" size="sm" /></Button>}
      mobileNav={
        <MobileNav label="Menu">
          <a href="#">Overview</a>
          <a href="#" aria-current="page">swift-otter-4821@disposable.example</a>
        </MobileNav>
      }
    />
  ),
};

/** K6: with `truncateTitle`, the title stays on one line; the heading's `title` gives it whole. */
export const TruncatedTitle: Story = {
  render: () => (
    <Topbar truncateTitle sticky={false}
      title={<h1 title="newsletter-signup-test-2026-ab@disposable.example">newsletter-signup-test-2026-ab@disposable.example</h1>}
      actions={<StatusDot tone="ok" label="Live" />} />
  ),
};

/** K7: a meter with its label and value as text. */
export const MeterWithLabel: Story = {
  render: () => <div style={{ maxWidth: 360 }}><Meter value={2} max={5} label="Active addresses" valueLabel="2 of 5" showLabel /></div>,
};

/** K11: a text-only mail offers no empty HTML tab. */
export const TextOnlyMail: Story = {
  render: () => <EmailViewer text={'Line 1\nLine 2'} />,
};

/** K12: AuthLayout's footer links are at least 24px high. */
export const AuthFooter: Story = {
  render: () => (
    <AuthLayout title="Check your email" footer={<a href="#">Back to the home page</a>}>
      <p>We sent a link to your address.</p>
    </AuthLayout>
  ),
};

/** K13: a tilted sticker next to a large button keeps its shadow inside the row. */
export const StickerInARow: Story = {
  render: () => (
    <Cluster gap={4} style={{ maxWidth: 360 }}>
      <Button variant="primary" size="lg">Create an address</Button>
      <Sticker tone="accent">Free</Sticker>
    </Cluster>
  ),
};

/** K15: long questions in the body font. */
export const LongQuestions: Story = {
  render: () => (
    <Accordion>
      <AccordionItem title="How many addresses can I have, and for how long does each one last?"><p>Five at a time, for a week each.</p></AccordionItem>
    </Accordion>
  ),
};

/** K17: an outlined Bento speaks the language of Card, its content at the top. */
export const OutlinedBento: Story = {
  render: () => (
    <Grid min="sm" gap={4}>
      <Bento tone="primary" outlined><Bento.Title>Create an address</Bento.Title><p>Random, or an alias of your choice.</p></Bento>
      <Card><Stack gap={2}><h3>Receive only</h3><p>You cannot reply or write from these addresses.</p></Stack></Card>
    </Grid>
  ),
};
