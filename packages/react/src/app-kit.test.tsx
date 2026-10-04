import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Field, I18nProvider, Input, InputAddon, InputGroup, PasswordInput, Select,
} from './index.js';


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

