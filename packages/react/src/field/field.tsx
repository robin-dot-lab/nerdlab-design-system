'use client';

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

interface FieldContextValue { id: string; describedBy: string | undefined; invalid: boolean }
const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  label: ReactNode;
  /** Help text under the control. Replaced by `error` when both are set. */
  help?: ReactNode;
  /** Error message: marks the control invalid and is announced via aria-describedby. */
  error?: ReactNode;
  /** Explicit id for the control; generated otherwise. */
  id?: string;
  children: ReactNode;
}

/** Label + control + help/error, wired together (htmlFor, aria-describedby, aria-invalid). */
export function Field({ label, help, error, id, className, children, ...props }: FieldProps) {
  const generated = useId();
  const controlId = id ?? `nl-field-${generated}`;
  const message = error ?? help;
  const messageId = message ? `${controlId}-message` : undefined;
  return (
    <div className={cn('nl-field', className)} {...props}>
      <label className="nl-label" htmlFor={controlId}>{label}</label>
      <FieldContext.Provider value={{ id: controlId, describedBy: messageId, invalid: Boolean(error) }}>
        {children}
      </FieldContext.Provider>
      {message && <span id={messageId} className={cn('nl-help', error ? 'nl-help--error' : undefined)}>{message}</span>}
    </div>
  );
}

export interface InputProps extends ComponentProps<'input'> {
  /** Error styling + aria-invalid. Set automatically inside a `<Field error>`. */
  invalid?: boolean;
}

export function Input({ className, invalid, id, ...props }: InputProps) {
  const field = useContext(FieldContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const describedBy = [props['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined;
  return (
    <input
      id={id ?? field?.id}
      className={cn('nl-input', isInvalid && 'nl-input--error', className)}
      aria-invalid={isInvalid || undefined}
      {...props}
      aria-describedby={describedBy}
    />
  );
}
