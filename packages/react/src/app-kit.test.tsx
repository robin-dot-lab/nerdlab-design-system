import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Button, CopyButton, CopyField, EmptyState, Field, I18nProvider, Input, InputAddon, InputGroup, PasswordInput, Select, Spinner,
} from './index.js';

const clipboard = (writeText: (s: string) => Promise<void>) =>
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

afterEach(() => { vi.useRealTimers(); Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }); });

describe('Button loading', () => {
  it('is busy and aria-disabled, keeps its name and focus, and ignores presses', async () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    render(<form onSubmit={(e) => onSubmit(e.nativeEvent)}><Button type="submit" loading onClick={onClick}>Create address</Button></form>);
    const button = screen.getByRole('button', { name: 'Create address' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.className).toBe('nl-btn nl-btn--loading');
    expect(button.querySelector('.nl-spinner')!.getAttribute('aria-hidden')).toBe('true');
    button.focus();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(button);
  });
  it('renders as before when not loading', () => {
    render(<Button>Go</Button>);
    const b = screen.getByRole('button', { name: 'Go' });
    expect(b.hasAttribute('aria-busy')).toBe(false);
    expect(b.textContent).toBe('Go');
  });
});

describe('Spinner', () => {
  it('a polite status named by its label, in the locale by default', () => {
    const { rerender } = render(<Spinner />);
    expect(screen.getByRole('status').textContent).toBe('Loading');
    rerender(<I18nProvider locale="fr-FR"><Spinner size="lg" /></I18nProvider>);
    expect(screen.getByRole('status').textContent).toBe('Chargement');
    expect(screen.getByRole('status').querySelector('.nl-spinner--lg')!.getAttribute('aria-hidden')).toBe('true');
    rerender(<Spinner label="Loading messages" />);
    expect(screen.getByRole('status').textContent).toBe('Loading messages');
  });
});

describe('EmptyState', () => {
  it('a heading, a description, a decorative icon and an action', () => {
    render(<EmptyState icon={<svg data-testid="icon" />} title="No messages yet" description="Mail sent to this address shows up here." action={<Button>Refresh</Button>} headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'No messages yet' })).toBeTruthy();
    expect(screen.getByText('Mail sent to this address shows up here.')).toBeTruthy();
    expect(screen.getByTestId('icon').parentElement!.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeTruthy();
  });
});

describe('CopyButton', () => {
  it('copies, shows a check and announces it, then resets; the name never changes', async () => {
    const write = vi.fn(() => Promise.resolve());
    clipboard(write);
    const onCopied = vi.fn();
    render(<CopyButton value="ada@nerdlab.sh" label="Copy address" onCopied={onCopied} feedbackDuration={50} />);
    const button = screen.getByRole('button', { name: 'Copy address' });
    await userEvent.click(button);
    expect(write).toHaveBeenCalledWith('ada@nerdlab.sh');
    expect(onCopied).toHaveBeenCalledWith('ada@nerdlab.sh');
    expect(screen.getByRole('status').textContent).toBe('Copied');
    expect(button.closest('.nl-copy')!.className).toContain('nl-copy--copied');
    expect(screen.getByRole('button', { name: 'Copy address' })).toBe(button);
    await act(() => new Promise((r) => setTimeout(r, 80)));
    expect(screen.getByRole('status').textContent).toBe('');
  });
  it('says so when the clipboard refuses, or is missing', async () => {
    clipboard(() => Promise.reject(new Error('denied')));
    const onCopyError = vi.fn();
    const { rerender } = render(<CopyButton value="x" onCopyError={onCopyError} />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(onCopyError).toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe('Copy failed: select the text and copy it by hand');
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    rerender(<I18nProvider locale="fr-FR"><CopyButton value="x" /></I18nProvider>);
    await userEvent.click(screen.getByRole('button', { name: 'Copier' }));
    expect(screen.getByRole('status').textContent).toContain('Copie impossible');
  });
});

describe('CopyField', () => {
  it('a read-only value named by its Field, with a copy button; selects the text when copying fails', async () => {
    render(<Field label="Address" help="Expires in 1 hour"><CopyField value="ada@nerdlab.sh" /></Field>);
    const input = screen.getByRole('textbox', { name: 'Address' }) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe('ada@nerdlab.sh');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(input.className).toBe('nl-input nl-copy-field__input');
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(document.activeElement).toBe(input);
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, input.value.length]);
  });
});

describe('InputGroup', () => {
  it('the input keeps the Field’s name and error; a select addon gets its own name, not the field’s id', () => {
    render(
      <Field label="Alias" error="Already taken">
        <InputGroup>
          <Input />
          <InputAddon><Select aria-label="Domain"><option>nerdlab.sh</option></Select></InputAddon>
        </InputGroup>
      </Field>,
    );
    const alias = screen.getByRole('textbox', { name: 'Alias' });
    expect(alias.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Already taken').id).toBe(alias.getAttribute('aria-describedby'));
    const domain = screen.getByRole('combobox', { name: 'Domain' });
    expect(domain.id).toBe('');
    expect(domain.hasAttribute('aria-invalid')).toBe(false);
    expect(alias.closest('.nl-input-group')).toBe(domain.closest('.nl-input-group'));
  });
  it('a text addon', () => {
    render(<Field label="Alias"><InputGroup><Input /><InputAddon>@nerdlab.sh</InputAddon></InputGroup></Field>);
    expect(screen.getByText('@nerdlab.sh').className).toBe('nl-input-group__addon');
  });
});

describe('PasswordInput', () => {
  it('wired by Field; the toggle is a pressed button with a stable name', async () => {
    render(<Field label="Password"><PasswordInput /></Field>);
    const input = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement;
    expect(input.type).toBe('password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(toggle);
    expect(input.type).toBe('text');
    expect(screen.getByRole('button', { name: 'Show password' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('says the strength in words, tied to the field, in the locale', () => {
    const { rerender } = render(<Field label="Password" help="12 characters or more"><PasswordInput strength={1} /></Field>);
    const input = screen.getByLabelText('Password', { selector: 'input' });
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(ids.map((id) => document.getElementById(id)!.textContent)).toContain('Password strength: Weak');
    expect(document.querySelector('meter')!.getAttribute('aria-hidden')).toBe('true');
    rerender(<I18nProvider locale="fr-FR"><Field label="Mot de passe"><PasswordInput strength={4} /></Field></I18nProvider>);
    expect(screen.getByText('Robuste').parentElement!.textContent).toBe('Robustesse du mot de passe : Robuste');
  });
  it('error state from Field', () => {
    render(<Field label="Password" error="Too short"><PasswordInput /></Field>);
    expect(screen.getByLabelText('Password', { selector: 'input' }).getAttribute('aria-invalid')).toBe('true');
  });
});

