import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

interface ChoiceProps extends Omit<ComponentProps<'input'>, 'type' | 'children'> {
  /** Visible label. Omit only if you pass aria-label / aria-labelledby. */
  children?: ReactNode;
  /** Class for the wrapping <label>. `className` goes to the input. */
  labelClassName?: string;
}

function Choice({ children, labelClassName, className, inputClass, ...props }: ChoiceProps & { inputClass: string; role?: string }) {
  const input = <input type="checkbox" className={cn(inputClass, className)} {...props} />;
  if (children == null) return input;
  return <label className={cn('nl-choice', labelClassName)}>{input}<span>{children}</span></label>;
}

export type CheckboxProps = ChoiceProps;
/** Native checkbox styled by .nl-check. Works without JavaScript and inside <form>. */
export function Checkbox(props: CheckboxProps) {
  return <Choice inputClass="nl-check" {...props} />;
}

export type SwitchProps = ChoiceProps;
/** Native checkbox exposed as role="switch", styled by .nl-toggle. */
export function Switch(props: SwitchProps) {
  return <Choice inputClass="nl-toggle" role="switch" {...props} />;
}
