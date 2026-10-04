import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Inbox, Mail, Plus, Trash } from '@robin-dot-lab/icons';
import {
  AppShell, AuthLayout, Avatar, Button, Card, Field, Input, MenuItem, MenuTrigger, Menu, MobileNav, PasswordInput, Sidebar,
  SidebarItem, SidebarSection, Stack, Topbar,
} from '@robin-dot-lab/react';
import { useState } from 'react';

const meta = {
  title: 'Components/App shell',
  component: AppShell,
  subcomponents: { Sidebar, SidebarSection, SidebarItem, Topbar, AuthLayout },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

const Logo = () => <b className="nl-display" style={{ fontSize: 'var(--text-xl)' }}>nerdlab.sh</b>;

function Nav({ collapsed, onCollapsedChange }: { collapsed?: boolean; onCollapsedChange?: (c: boolean) => void }) {
  return (
    <Sidebar label="Main navigation" header={collapsed ? <b className="nl-display"><span aria-hidden="true">n.</span><span className="nl-visually-hidden">nerdlab.sh</span></b> : <Logo />} collapsible collapsed={collapsed} onCollapsedChange={onCollapsedChange}>
      <SidebarSection title="Mail">
        <SidebarItem href="#inbox" icon={<Inbox />} current count={3} countLabel="3 unread">Inbox</SidebarItem>
        <SidebarItem href="#addresses" icon={<Mail />} count={5} countLabel="5 addresses">Addresses</SidebarItem>
        <SidebarItem href="#trash" icon={<Trash />}>Trash</SidebarItem>
      </SidebarSection>
      <SidebarSection title="Account">
        <SidebarItem href="#home" icon={<Home />}>Overview</SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
}

const userMenu = (
  <MenuTrigger>
    <Button variant="ghost" shape="square" aria-label="Account: Ada Lovelace"><Avatar name="Ada Lovelace" size="sm" /></Button>
    <Menu placement="bottom end">
      <MenuItem id="settings">Settings</MenuItem>
      <MenuItem id="logout">Sign out</MenuItem>
    </Menu>
  </MenuTrigger>
);

function Shell({ initiallyCollapsed = false }: { initiallyCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  return (
    <AppShell
      sidebar={<Nav collapsed={collapsed} onCollapsedChange={setCollapsed} />}
      topbar={
        <Topbar
          title={<h1>Inbox</h1>}
          actions={<Button variant="primary" size="sm"><Plus /> New address</Button>}
          user={userMenu}
          mobileNav={<MobileNav><a href="#inbox">Inbox</a><a href="#addresses">Addresses</a><a href="#trash">Trash</a></MobileNav>}
        />
      }
    >
      <Card><p style={{ margin: 0 }}>Messages go here.</p></Card>
    </AppShell>
  );
}

/** Sidebar, top bar and content. Below 1024px (the phone screenshot) the sidebar is hidden and the menu button takes over. */
export const Playground: Story = { render: () => <Shell /> };

/** Collapsed sidebar: icons only. Each link keeps its label as its name; a tooltip shows it on hover and focus. */
export const CollapsedSidebar: Story = { render: () => <Shell initiallyCollapsed /> };

/** The top bar alone: title, actions, user menu. */
export const TopbarOnly: Story = {
  render: () => <Topbar title={<h1>Addresses</h1>} actions={<Button size="sm">Refresh</Button>} user={userMenu} />,
};

/** Sign-up page: centred card with the form, secondary link under it. */
export const SignUp: Story = {
  render: () => (
    <AuthLayout
      logo={<Logo />}
      title="Create your account"
      description="Disposable addresses, ready in one click."
      footer={<p>Already have an account? <a href="#login">Sign in</a></p>}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack gap={4}>
          <Field label="Email"><Input type="email" autoComplete="email" /></Field>
          <Field label="Password" help="12 characters or more."><PasswordInput autoComplete="new-password" strength={3} /></Field>
          <Button type="submit" variant="primary">Create account</Button>
        </Stack>
      </form>
    </AuthLayout>
  ),
};
