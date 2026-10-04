'use client';

import { Eye, EyeOff } from '@robin-dot-lab/icons';
import { useId, useState } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';
import { Meter } from '../meter/meter.js';
import { useFieldControl, type InputProps } from './field.js';

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /**
   * Strength computed by the application (0 very weak … 4 strong): the kit ships no estimator.
   * Shown as a bar plus a word, announced politely and tied to the field by aria-describedby.
   */
  strength?: PasswordStrength;
  /** Accessible name of the show/hide toggle. Defaults to “Show password”: the name stays, aria-pressed says the state. */
  toggleLabel?: string;
  /** Class for the wrapper. `className` goes to the input. */
  wrapperClassName?: string;
}

/**
 * Password field with a show/hide toggle (`aria-pressed`) and an optional strength indicator.
 * Wire it to a label with `<Field>`, like `Input`.
 */
export function PasswordInput({ strength, toggleLabel, wrapperClassName, className, invalid, id, ...props }: PasswordInputProps) {
  const { t } = useMessages();
  const [visible, setVisible] = useState(false);
  const strengthId = useId();
  const described = [props['aria-describedby'], strength !== undefined ? strengthId : undefined].filter(Boolean).join(' ') || undefined;
  const c = useFieldControl(id, invalid, described);
  return (
    <>
      <span className={cn('nl-input-group nl-password', wrapperClassName)}>
        <input
          id={c.id}
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          spellCheck={false}
          className={cn('nl-input', c.isInvalid && 'nl-input--error', className)}
          aria-invalid={c.isInvalid || undefined}
          {...props}
          aria-describedby={c.describedBy}
        />
        <button
          type="button"
          className="nl-input-group__button"
          aria-pressed={visible}
          aria-label={toggleLabel ?? t.showPassword}
          aria-controls={c.id}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </span>
      {strength !== undefined && (
        <span className="nl-password__strength">
          <Meter value={strength} min={0} max={4} low={2} high={3} label={t.passwordStrength} aria-hidden="true" />
          <span id={strengthId} aria-live="polite">{t.passwordStrength}{t.colon}<b>{t.strength[strength]}</b></span>
        </span>
      )}
    </>
  );
}
