import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field, I18nProvider, Kbd, OTPInput } from './index.js';

const cells = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const code = () => cells().map((c) => c.value).join('');

describe('OTPInput', () => {
  it('a group named by its Field; each cell says its position; one-time-code autofill on the first', () => {
    render(<Field label="Verification code" help="Sent to ada@nerdlab.sh"><OTPInput length={4} /></Field>);
    const group = screen.getByRole('group', { name: 'Verification code' });
    expect(group.getAttribute('aria-describedby')).toBeTruthy();
    const [first, second] = within(group).getAllByRole('textbox') as HTMLInputElement[];
    expect(first!.getAttribute('aria-label')).toBe('Digit 1 of 4');
    expect(first!.autocomplete).toBe('one-time-code');
    expect(second!.autocomplete).toBe('off');
    expect(first!.inputMode).toBe('numeric');
    // The Field's label still focuses the first cell.
    expect(screen.getByText('Verification code').getAttribute('for')).toBe(first!.id);
  });
  it('typing moves forward, Backspace goes back, arrows move, letters are refused in numeric mode', async () => {
    const onComplete = vi.fn();
    render(<OTPInput aria-label="Code" length={4} onComplete={onComplete} />);
    await userEvent.click(cells()[0]!);
    await userEvent.keyboard('1a2');
    expect(code()).toBe('12');
    expect(document.activeElement).toBe(cells()[2]);
    await userEvent.keyboard('{Backspace}');
    expect(code()).toBe('1');
    expect(document.activeElement).toBe(cells()[1]);
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(cells()[0]);
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(cells()[1]);
    await userEvent.keyboard('234');
    expect(code()).toBe('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });
  it('pasting the whole code fills every cell', () => {
    const onChange = vi.fn();
    render(<OTPInput aria-label="Code" onChange={onChange} />);
    fireEvent.paste(cells()[3]!, { clipboardData: { getData: () => ' 482 913 ' } });
    expect(code()).toBe('482913');
    expect(onChange).toHaveBeenLastCalledWith('482913');
  });
  it('controlled, alphanumeric, French words, a hidden input for forms, error from Field', async () => {
    function Controlled() {
      const [v, setV] = useState('AB');
      return <I18nProvider locale="fr-FR"><Field label="Code" error="Code expiré"><OTPInput length={3} mode="alphanumeric" value={v} onChange={setV} name="otp" /></Field></I18nProvider>;
    }
    const { container } = render(<Controlled />);
    expect(cells()[0]!.getAttribute('aria-label')).toBe('Caractère 1 sur 3');
    expect(cells()[0]!.getAttribute('aria-invalid')).toBe('true');
    await userEvent.click(cells()[2]!);
    await userEvent.keyboard('c');
    expect(code()).toBe('ABC');
    expect((container.querySelector('input[type="hidden"]') as HTMLInputElement).value).toBe('ABC');
  });
});

describe('Kbd', () => {
  it('a <kbd>, nestable for a combination', () => {
    const { container } = render(<Kbd><Kbd>Ctrl</Kbd>+<Kbd>K</Kbd></Kbd>);
    const outer = container.firstElementChild!;
    expect(outer.tagName).toBe('KBD');
    expect(outer.className).toBe('nl-kbd');
    expect(outer.querySelectorAll('kbd')).toHaveLength(2);
  });
});
