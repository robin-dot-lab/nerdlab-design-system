'use client';

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  defaultValue: string | undefined;
  onChange: ((value: string) => void) | undefined;
}
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<ComponentProps<'fieldset'>, 'onChange' | 'defaultValue'> {
  /** Visible group label (<legend>). */
  legend: ReactNode;
  /** Shared `name` of the radios; generated if omitted. Set it when the group is submitted in a <form>. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  /** Help or error text under the options, linked to the group with aria-describedby. */
  help?: ReactNode;
  error?: ReactNode;
}

/**
 * Native radios in a <fieldset>: arrow keys move the selection, the group is named by its legend,
 * and the value is submitted with the form. Children are `<Radio>`.
 */
export function RadioGroup({ legend, name, value, defaultValue, onChange, orientation = 'vertical', help, error, className, children, ...props }: RadioGroupProps) {
  const generated = useId();
  const message = error ?? help;
  const messageId = message ? `${generated}-message` : undefined;
  return (
    <fieldset
      className={cn('nl-radio-group', orientation === 'horizontal' && 'nl-radio-group--horizontal', className)}
      aria-describedby={messageId}
      {...props}
    >
      <legend className="nl-label">{legend}</legend>
      <RadioGroupContext.Provider value={{ name: name ?? generated, value, defaultValue, onChange }}>
        <div className="nl-radio-group__options">{children}</div>
      </RadioGroupContext.Provider>
      {message && <span id={messageId} className={cn('nl-help', error ? 'nl-help--error' : undefined)}>{message}</span>}
    </fieldset>
  );
}

export interface RadioProps extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'children'> {
  value: string;
  children: ReactNode;
  /** Class for the wrapping <label>. `className` goes to the input. */
  labelClassName?: string;
}

/** One option of a `RadioGroup`. */
export function Radio({ value, children, className, labelClassName, onChange, ...props }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const controlled = group?.value !== undefined;
  return (
    <label className={cn('nl-choice', labelClassName)}>
      <input
        type="radio"
        className={cn('nl-radio', className)}
        name={group?.name}
        value={value}
        checked={controlled ? group?.value === value : undefined}
        defaultChecked={controlled ? undefined : group?.defaultValue === value}
        onChange={(e) => { onChange?.(e); if (e.target.checked) group?.onChange?.(value); }}
        {...props}
      />
      <span>{children}</span>
    </label>
  );
}
