import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  AppShell, Band, Bento, CopyField, I18nProvider, Meter, SiteFooter, SiteHeader, Sidebar, SidebarItem, SidebarSection, Split, Topbar,
} from './index.js';

// The fixes and additions asked by the mail platform's UI audit (K1…K17).
describe('layout and overflow (K1, K3, K4)', () => {
  it('Split align="start" lets each pane keep its height', () => {
    const { container } = render(<Split align="start"><div /><div /></Split>);
    expect(container.firstElementChild!.className).toBe('nl-split nl-split--start');
  });
  it('a sidebar label carries its full text as a title, except in the collapsed sidebar (which has a tooltip)', () => {
    render(<Sidebar label="Main"><SidebarSection title="Addresses"><SidebarItem href="#">very-long-address@disposable.example</SidebarItem></SidebarSection></Sidebar>);
    expect(screen.getByText('very-long-address@disposable.example').getAttribute('title')).toBe('very-long-address@disposable.example');
  });
  it('CopyField multiline shows the value in a read-only textarea, still wired to its label', () => {
    render(<CopyField multiline aria-label="Address" value="newsletter-signup-test-2026-ab@disposable.example" />);
    const field = screen.getByRole('textbox', { name: 'Address' });
    expect(field.tagName).toBe('TEXTAREA');
    expect((field as HTMLTextAreaElement).readOnly).toBe(true);
    expect(field.closest('.nl-copy-field--multiline')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy();
  });
});

describe('application frame (K6, K10)', () => {
  it('AppShell starts with a skip link to its main region, in the locale', () => {
    render(<I18nProvider locale="fr-FR"><AppShell mainProps={{ id: 'content' }}><p>Body</p></AppShell></I18nProvider>);
    const skip = screen.getByRole('link', { name: 'Aller au contenu' });
    expect(skip.getAttribute('href')).toBe('#content');
    expect(screen.getByRole('main').id).toBe('content');
    expect(document.body.querySelector('a')).toBe(skip); // the first tab stop
  });
  it('AppShell generates the main id when none is given', () => {
    render(<AppShell><p>Body</p></AppShell>);
    const id = screen.getByRole('main').id;
    expect(id).not.toBe('');
    expect(screen.getByRole('link', { name: 'Skip to content' }).getAttribute('href')).toBe(`#${id}`);
  });
  it('Topbar can stop sticking and keep its title on one line', () => {
    const { container } = render(<Topbar sticky={false} truncateTitle title={<h1>Inbox</h1>} />);
    expect(container.firstElementChild!.className).toBe('nl-topbar nl-topbar--static nl-topbar--truncate');
  });
});

describe('Meter label (K7)', () => {
  it('without showLabel the label is only the accessible name', () => {
    render(<Meter value={2} max={5} label="Active addresses" />);
    expect(screen.getByRole('meter', { name: 'Active addresses' })).toBeTruthy();
    expect(screen.queryByText('Active addresses')).toBeNull();
  });
  it('with showLabel the words are visible, wired by aria-labelledby, and the value is said in words', () => {
    render(<Meter value={2} max={5} label="Active addresses" valueLabel="2 of 5" showLabel />);
    const meter = screen.getByRole('meter', { name: 'Active addresses' });
    expect(meter.getAttribute('aria-valuetext')).toBe('2 of 5');
    expect(screen.getByText('2 of 5').getAttribute('aria-hidden')).toBe('true');
  });
});

describe('public pages (K14) and Bento (K17)', () => {
  it('SiteHeader: brand, a named list of links, actions; the links give way to a MobileNav when there is one', () => {
    const { container } = render(
      <SiteHeader brand={<a href="/">NERDLAB</a>} nav={[<a key="a" href="#a">How it works</a>, <a key="b" href="#b">FAQ</a>]} navLabel="Site"
        actions={<button type="button">Sign in</button>} />,
    );
    const nav = screen.getByRole('navigation', { name: 'Site' });
    expect(within(nav).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('banner').className).toBe('nl-site-header');
    expect(container.querySelector('.nl-site-header__inner.nl-container')).toBeTruthy();
  });
  it('SiteHeader sticky and with a mobile nav', () => {
    render(<SiteHeader sticky brand="N" mobileNav={<span>menu</span>} />);
    expect(screen.getByRole('banner').className).toBe('nl-site-header nl-site-header--sticky nl-site-header--has-mobile-nav');
  });
  it('SiteFooter is the contentinfo landmark with its legal line', () => {
    render(<SiteFooter legal={<p>© 2026</p>}><p>Nerdlab</p></SiteFooter>);
    const footer = screen.getByRole('contentinfo');
    expect(footer.className).toBe('nl-site-footer');
    expect(within(footer).getByText('© 2026').parentElement!.className).toBe('nl-site-footer__legal');
  });
  it('Band is a section with its tone, or its child with asChild', () => {
    const { container, rerender } = render(<Band tone="ink"><p>x</p></Band>);
    expect(container.firstElementChild!.tagName).toBe('SECTION');
    expect(container.firstElementChild!.className).toBe('nl-band nl-band--ink');
    rerender(<Band asChild tone="paper"><aside>x</aside></Band>);
    expect(container.firstElementChild!.tagName).toBe('ASIDE');
    expect(container.firstElementChild!.className).toBe('nl-band nl-band--paper');
  });
  it('Bento outlined', () => {
    const { container } = render(<Bento tone="primary" outlined>x</Bento>);
    expect(container.firstElementChild!.className).toBe('nl-bento nl-bento--primary nl-bento--outlined');
  });
});
