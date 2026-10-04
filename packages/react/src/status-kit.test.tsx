import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Banner, CodeBlock, ExpiryIndicator, I18nProvider, RelativeTime, StatusDot } from './index.js';

const NOW = new Date('2026-10-04T12:00:00Z');
afterEach(() => vi.useRealTimers());
const minutes = (n: number) => new Date(NOW.getTime() + n * 60_000);

describe('RelativeTime', () => {
  it('says the gap in the locale, in a <time datetime>, and refreshes on its own', async () => {
    vi.useFakeTimers({ now: NOW });
    const { rerender } = render(<RelativeTime date={minutes(-2)} tooltip={false} />);
    const time = screen.getByText('2 minutes ago');
    expect(time.tagName).toBe('TIME');
    expect(time.getAttribute('datetime')).toBe('2026-10-04T11:58:00.000Z');
    expect(time.hasAttribute('tabindex')).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(screen.getByText('3 minutes ago')).toBeTruthy();
    rerender(<I18nProvider locale="fr-FR"><RelativeTime date={minutes(-2)} tooltip={false} /></I18nProvider>);
    expect(screen.getByText(/^il y a\s3\sminutes$/)).toBeTruthy();
    rerender(<RelativeTime date={new Date(Date.now() - 12_000)} tooltip={false} />);
    expect(screen.getByText('now')).toBeTruthy();
  });
  it('with a tooltip, is a tab stop that shows the absolute date', async () => {
    render(<I18nProvider locale="en-GB"><RelativeTime date={new Date(Date.now() - 3 * 3600_000)} /></I18nProvider>);
    const time = screen.getByText('3 hours ago');
    expect(time.getAttribute('tabindex')).toBe('0');
    await userEvent.tab();
    expect(document.activeElement).toBe(time);
    expect((await screen.findByRole('tooltip')).textContent).toMatch(/\d{4}/);
  });
  it('server and hydration renders match: the absolute date in UTC, then the relative wording', async () => {
    const date = new Date(Date.now() - 5 * 60_000);
    const tree = <I18nProvider locale="en-GB"><RelativeTime date={date} tooltip={false} /></I18nProvider>;
    const html = renderToString(tree);
    expect(html).toContain(new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(date));
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => { hydrateRoot(container, tree); });
    expect(errors).not.toHaveBeenCalled();
    expect(container.textContent).toBe('5 minutes ago');
    errors.mockRestore();
    container.remove();
  });
});

describe('ExpiryIndicator', () => {
  it('normal, then expiring soon, then expired: each said in words, a change announced once', async () => {
    vi.useFakeTimers({ now: NOW });
    const onStateChange = vi.fn();
    const { container } = render(<ExpiryIndicator expiresAt={minutes(6)} onStateChange={onStateChange} />);
    expect(container.textContent).toContain('Expires in 6 minutes');
    expect(container.firstElementChild!.className).toBe('nl-expiry nl-expiry--normal');
    expect(screen.getByRole('status').textContent).toBe('');
    await act(() => vi.advanceTimersByTimeAsync(2 * 60_000));
    expect(container.textContent).toContain('Expiring soon: in 4 minutes');
    expect(screen.getByRole('status').textContent).toBe('Expiring soon');
    expect(onStateChange).toHaveBeenLastCalledWith('soon');
    await act(() => vi.advanceTimersByTimeAsync(4 * 60_000 - 30_000));
    expect(container.textContent).toContain('in 30 seconds');
    await act(() => vi.advanceTimersByTimeAsync(31_000));
    expect(container.querySelector('time')!.textContent).toBe('Expired');
    expect(screen.getByRole('status').textContent).toBe('Expired');
    expect(onStateChange).toHaveBeenLastCalledWith('expired');
  });
  it('the bar variant is a meter of the time left, with a severity', () => {
    vi.useFakeTimers({ now: NOW });
    render(<I18nProvider locale="fr-FR"><ExpiryIndicator variant="bar" startedAt={minutes(-58)} expiresAt={minutes(2)} /></I18nProvider>);
    const meter = screen.getByRole('meter', { name: 'Expire bientôt : dans 2 minutes' });
    expect(meter.className).toBe('nl-meter nl-meter--warn');
    expect(meter.getAttribute('value')).toBe(String(2 * 60_000));
  });
});

describe('StatusDot', () => {
  it('always carries words; they can be visually hidden; pulse is a class', () => {
    const { rerender, container } = render(<StatusDot tone="ok" pulse label="Receiving mail" />);
    expect(container.firstElementChild!.className).toBe('nl-status nl-status--ok nl-status--pulse');
    expect(screen.getByText('Receiving mail').className).toBe('nl-status__label');
    expect(container.querySelector('.nl-status__dot')!.getAttribute('aria-hidden')).toBe('true');
    rerender(<StatusDot tone="bad" label="Expired" hideLabel />);
    expect(screen.getByText('Expired').className).toBe('nl-visually-hidden');
  });
});

describe('CodeBlock', () => {
  it('a named, focusable region of <pre><code> text, with a copy button; never parses HTML', async () => {
    const source = '<script>alert(1)</script>\nSubject: Hi';
    render(<CodeBlock label="Message source" wrap>{source}</CodeBlock>);
    const region = screen.getByRole('region', { name: 'Message source' });
    expect(region.tagName).toBe('PRE');
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region.querySelector('code')!.textContent).toBe(source);
    expect(region.querySelector('script')).toBeNull();
    expect(region.closest('.nl-code')!.className).toBe('nl-code nl-code--wrap');
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
  });
  it('without copy', () => {
    render(<CodeBlock label="Snippet" copyable={false}>x</CodeBlock>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Banner', () => {
  it('a region named by its tone, the tone said before the message, an action and a close button', async () => {
    const onDismiss = vi.fn();
    render(<Banner tone="warning" action={<a href="#verify">Verify</a>} onDismiss={onDismiss}>Your email is not verified.</Banner>);
    const region = screen.getByRole('region', { name: 'Warning' });
    expect(region.className).toBe('nl-banner nl-banner--warning');
    expect(within(region).getByText('Your email is not verified.', { exact: false }).textContent).toBe('Warning: Your email is not verified.');
    await userEvent.click(within(region).getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
  it('no close button without onDismiss; French words', () => {
    render(<I18nProvider locale="fr-FR"><Banner label="Maintenance">Coupure à 22 h.</Banner></I18nProvider>);
    const region = screen.getByRole('region', { name: 'Maintenance' });
    expect(within(region).queryByRole('button')).toBeNull();
    expect(region.textContent).toBe('Information : Coupure à 22 h.');
  });
});
