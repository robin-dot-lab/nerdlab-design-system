'use client';

import { Check, Copy, Error as ErrorIcon } from '@robin-dot-lab/icons';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Button, type ButtonProps } from '../button/button.js';
import { useFieldControl } from '../field/field.js';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

type CopyState = 'idle' | 'copied' | 'failed';

/** Copies text with the async Clipboard API; resolves to false when it is missing or refused. */
async function writeClipboard(text: string) {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export interface CopyButtonProps extends Omit<ButtonProps, 'value' | 'children' | 'onCopy' | 'asChild' | 'loading'> {
  /** Text put on the clipboard. */
  value: string;
  /** Accessible name (and visible text with `showLabel`). Defaults to “Copy” in the active locale. */
  label?: string;
  /** Show the label next to the icon. */
  showLabel?: boolean;
  /** Called after a successful copy (e.g. to show a `Toast` instead of relying on the built-in announcement). */
  onCopied?: (value: string) => void;
  /** Called when the clipboard is unavailable or refuses the write. */
  onCopyError?: () => void;
  /** Milliseconds the check (or error) mark stays. Default 2000. */
  feedbackDuration?: number;
}

/**
 * Copies `value` to the clipboard. The icon turns into a check (or an error mark) and the outcome is announced
 * in a polite live region that is always rendered; the button keeps the same name throughout.
 */
export function CopyButton({
  value, label, showLabel = false, onCopied, onCopyError, feedbackDuration = 2000,
  variant = 'default', size = 'sm', shape = 'square', className, onClick, ...props
}: CopyButtonProps) {
  const { t } = useMessages();
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy: ButtonProps['onClick'] = async (e) => {
    onClick?.(e);
    const ok = await writeClipboard(value);
    setState(ok ? 'copied' : 'failed');
    if (ok) onCopied?.(value); else onCopyError?.();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), feedbackDuration);
  };

  const name = label ?? t.copy;
  const Mark = state === 'copied' ? Check : state === 'failed' ? ErrorIcon : Copy;
  return (
    <span className={cn('nl-copy', state !== 'idle' && `nl-copy--${state}`, className)}>
      <Button variant={variant} size={size} shape={showLabel ? 'pill' : shape} aria-label={showLabel ? undefined : name} onClick={copy} {...props}>
        <Mark />
        {showLabel && name}
      </Button>
      <span className="nl-visually-hidden" role="status">{state === 'copied' ? t.copied : state === 'failed' ? t.copyFailed : ''}</span>
    </span>
  );
}

export interface CopyFieldProps extends Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'readOnly' | 'type' | 'ref'> {
  /** The value shown (read-only, monospace) and copied. */
  value: string;
  /**
   * Show the whole value, wrapping anywhere over as many lines as it needs (a read-only textarea),
   * instead of one line cut by an ellipsis. For long unbroken values: addresses, tokens, URLs.
   */
  multiline?: boolean;
  /** Accessible name of the copy button. Defaults to “Copy”. */
  copyLabel?: string;
  onCopied?: (value: string) => void;
  /** Class for the wrapper. `className` goes to the input. */
  wrapperClassName?: string;
}

/**
 * A read-only value with a copy button built in. Wire the field to a label with `<Field>` (or `aria-label`).
 * When copying fails, the text is selected so the user can copy it by hand.
 */
export function CopyField({ value, copyLabel, onCopied, multiline = false, wrapperClassName, className, id, ...props }: CopyFieldProps) {
  const c = useFieldControl(id, false, props['aria-describedby']);
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const rows = useContentRows(multiline ? input : null, value);
  const shared = {
    id: c.id, readOnly: true, value,
    className: cn('nl-input nl-copy-field__input', className),
    onFocus: (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => e.currentTarget.select(),
  };
  return (
    <span className={cn('nl-input-group nl-copy-field', multiline && 'nl-copy-field--multiline', wrapperClassName)}>
      {multiline
        ? <textarea ref={input} rows={rows} {...shared} {...(props as ComponentProps<'textarea'>)} aria-describedby={c.describedBy} />
        : <input ref={input} type="text" {...shared} {...props} aria-describedby={c.describedBy} />}
      <CopyButton value={value} label={copyLabel} onCopied={onCopied} onCopyError={() => { input.current?.focus(); input.current?.select(); }} />
    </span>
  );
}

/**
 * Rows a read-only textarea needs to show its whole value. Browsers with `field-sizing: content`
 * (set by the skin) size it themselves; elsewhere the rows follow the text and the field's width.
 */
function useContentRows(ref: { current: HTMLTextAreaElement | null } | null, value: string) {
  const [rows, setRows] = useState(1);
  useEffect(() => {
    const el = ref?.current;
    if (!el || (typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content'))) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const line = parseFloat(cs.lineHeight) || 1;
      el.rows = 1; // measure the text's own height, not the current rows'
      const text = el.scrollHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      setRows(Math.max(1, Math.round(text / line)));
    };
    measure();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [ref, value]);
  return rows;
}
