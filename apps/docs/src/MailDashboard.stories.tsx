import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inbox, Mail, Plus } from '@robin-dot-lab/icons';
import { EmailViewer, MessageHeader, MessageList, type MessageSummary } from '@robin-dot-lab/mail';
import {
  AppShell, Avatar, Bento, Button, CopyButton, Meter, MobileNav, Sidebar, SidebarItem, SidebarSection, Split, Stack, StatusDot, Topbar,
} from '@robin-dot-lab/react';
import { useState } from 'react';

// The inbox of the Bento mock-ups (ADR-030), built only from the kit: AppShell, Sidebar, Topbar, the mail
// package and a Bento tile for the detected code. It is a Bento composition, so the story pins the skin
// and is left out of Candy's runs (tag `bento-only`); Candy's own inbox is Mail/Components › Dashboard.
const meta = {
  title: 'Compositions/Mail dashboard',
  tags: ['bento-only'],
  globals: { skin: 'bento' },
  // The email is third-party content in a sandbox with an opaque origin: axe must not message that frame.
  parameters: { layout: 'fullscreen', a11y: { options: { iframes: false } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const MIN = 60_000;
const ago = (ms: number) => Date.now() - ms;
const ADDRESS = 'swift-otter-4821@nerdbox.rsvp';
const MESSAGES: MessageSummary[] = [
  { id: 'm1', from: { name: 'Acme Store', address: 'no-reply@acme.example' }, subject: 'Your verification code', preview: 'Your code: 4821. It is valid for 10 minutes.', date: ago(MIN / 2), unread: true },
  { id: 'm2', from: { name: 'Acme Store', address: 'no-reply@acme.example' }, subject: 'Welcome to Acme', preview: 'Confirm your address to finish signing up…', date: ago(3 * MIN) },
];
const HTML = `<div style="font-family: sans-serif; padding: 16px; color: #16201B">
  <p>Hello,</p><p>Your code: <strong>4821</strong>. It is valid for 10 minutes.</p>
  <p><img src="https://tracker.example/pixel.png" alt="" width="1" height="1"></p>
</div>`;
const TEXT = 'Hello,\n\nYour code: 4821. It is valid for 10 minutes.';

/** The open message, its detected code on a butter tile (`accent`: light with ink text in both themes) and the email. */
export const Inbox_: Story = {
  name: 'Inbox',
  render: function Render() {
    const [id, setId] = useState<string | null>('m1');
    const open = MESSAGES.find((m) => m.id === id) ?? MESSAGES[0]!;
    return (
      <AppShell
        sidebar={
          <Sidebar
            label="Main navigation"
            header={<Stack gap={4}><b className="nl-headline nl-headline--sm">nerdbox</b><Button variant="primary"><Plus /> New address</Button></Stack>}
            footer={<Meter value={3} max={5} low={1} high={3} label="Active addresses" showLabel valueLabel="3 / 5" />}
          >
            <SidebarSection title="My addresses">
              <SidebarItem href="#swift-otter" icon={<Inbox />} current count={2} countLabel="2 mails">swift-otter-4821</SidebarItem>
              <SidebarItem href="#calm-heron" icon={<Mail />} count={1} countLabel="1 mail">calm-heron-0193</SidebarItem>
              <SidebarItem href="#newsletter" icon={<Mail />}>newsletter-test</SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
        topbar={
          <Topbar
            title={<h1 className="nl-break-anywhere" style={{ fontSize: 'var(--text-lg)' }}>{ADDRESS}</h1>}
            actions={<><StatusDot tone="ok" label="Live" pulse /><CopyButton value={ADDRESS} label="Copy address" showLabel /><Button size="sm">Extend by 24 h</Button></>}
            user={<Avatar name="Robin" tone="primary" />}
            mobileNav={<MobileNav><a href="#swift-otter" aria-current="page">swift-otter-4821</a><a href="#calm-heron">calm-heron-0193</a></MobileNav>}
          />
        }
      >
        <Split ratio="sidebar" gap={4} align="start">
          <MessageList messages={MESSAGES} selectedId={id} onSelectionChange={setId} />
          <Bento>
            <Stack gap={4}>
            <MessageHeader subject={open.subject} from={open.from} to={{ address: ADDRESS }} date={open.date} />
            <Bento tone="accent" style={{ minHeight: 0 }}>
              <div className="nl-cluster nl-cluster--between">
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>Code found</p>
                  <p className="nl-display nl-display--md" style={{ letterSpacing: '0.04em' }}>4821</p>
                </div>
                <CopyButton value="4821" label="Copy the code" showLabel variant="primary" />
              </div>
            </Bento>
            <EmailViewer html={HTML} text={TEXT} />
            </Stack>
          </Bento>
        </Split>
      </AppShell>
    );
  },
};
