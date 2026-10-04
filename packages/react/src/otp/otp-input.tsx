'use client';

import { useRef, useState, type ClipboardEvent, type ComponentProps, type KeyboardEvent } from 'react';
import { useFieldControl } from '../field/field.js';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

export interface OTPInputProps extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Number of cells. Default 6. */
  length?: number;
  /** Controlled value: the code typed so far. */
  value?: string;
  defaultValue?: string;
  /** Called with the whole code on every change. */
  onChange?: (code: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (code: string) => void;
  /** Digits only (default), or letters and digits (upper-cased). */
  mode?: 'numeric' | 'alphanumeric';
  /** Name of a hidden input that carries the code in a form. */
  name?: string;
  disabled?: boolean;
  /** Error styling + aria-invalid. Set automatically inside a `<Field error>`. */
  invalid?: boolean;
}

/**
 * A one-time code in N cells. Typing moves to the next cell, Backspace to the previous one, arrows and Home/End
 * move freely; pasting the code, or the browser's one-time-code autofill on the first cell, fills every cell.
 * The cells form a group named by the enclosing `<Field>` (or `aria-label`); each cell says its position.
 */
export function OTPInput({
  length = 6, value: valueProp, defaultValue = '', onChange, onComplete, mode = 'numeric', name, disabled, invalid,
  className, id, ...props
}: OTPInputProps) {
  const { t } = useMessages();
  const c = useFieldControl(id, invalid, props['aria-describedby']);
  const [own, setOwn] = useState(defaultValue);
  const value = (valueProp ?? own).slice(0, length);
  const cells = useRef<(HTMLInputElement | null)[]>([]);
  const clean = (s: string) => (s.match(mode === 'numeric' ? /\d/g : /[a-z0-9]/gi) ?? []).join('').toUpperCase();
  const focus = (i: number) => cells.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const commit = (next: string) => {
    const code = next.slice(0, length);
    setOwn(code);
    onChange?.(code);
    if (code.length === length) onComplete?.(code);
  };
  // The code has no holes: writing past its end writes at its end.
  const write = (i: number, chars: string) => {
    const at = Math.min(i, value.length);
    commit(value.slice(0, at) + chars + value.slice(at + chars.length));
    focus(at + chars.length);
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    const moves: Record<string, number> = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: value.length };
    if (e.key in moves) { e.preventDefault(); focus(moves[e.key]!); return; }
    if (e.key !== 'Backspace') return;
    e.preventDefault();
    const at = value[i] ? i : i - 1;
    if (at < 0 || at >= value.length) { focus(value.length - 1); return; }
    commit(value.slice(0, at) + value.slice(at + 1));
    focus(at);
  };
  const onPaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const chars = clean(e.clipboardData.getData('text'));
    if (chars) write(chars.length >= length ? 0 : i, chars);
  };

  return (
    <div
      role="group"
      aria-labelledby={c.labelId}
      className={cn('nl-otp', c.isInvalid && 'nl-otp--error', className)}
      {...props}
      aria-describedby={c.describedBy}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { cells.current[i] = el; }}
          id={i === 0 ? c.id : undefined}
          className={cn('nl-input nl-otp__cell', c.isInvalid && 'nl-input--error')}
          value={value[i] ?? ''}
          inputMode={mode === 'numeric' ? 'numeric' : 'text'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoCapitalize="characters"
          spellCheck={false}
          disabled={disabled}
          aria-label={t.otpCell(i + 1, length, mode === 'numeric')}
          aria-invalid={c.isInvalid || undefined}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={onKeyDown(i)}
          onPaste={onPaste(i)}
          onChange={(e) => {
            const raw = clean(e.currentTarget.value);
            if (!raw) return;
            if (raw.length >= length) { write(0, raw); return; }
            // A cell that kept its old character (selection lost) receives the old one plus the new one.
            const old = value[i] ?? '';
            write(i, raw.length > 1 && raw.startsWith(old) ? raw.slice(old.length, old.length + 1) : raw.slice(0, 1));
          }}
        />
      ))}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
