'use client';

import { Children, isValidElement, type ReactElement } from 'react';
import {
  Focusable, OverlayArrow, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger,
  type TooltipProps as AriaTooltipProps, type TooltipTriggerComponentProps,
} from 'react-aria-components';
import { composeClass } from '../lib/compose-class.js';

export type TooltipTriggerProps = TooltipTriggerComponentProps;

/**
 * Wraps a focusable trigger and a <Tooltip>: `<TooltipTrigger><Button/><Tooltip/></TooltipTrigger>`.
 * The trigger is wrapped in React Aria's <Focusable> for you (an explicit <Focusable> still works).
 * Shows on hover (after `delay`) and on keyboard focus.
 */
export function TooltipTrigger({ delay = 500, closeDelay = 200, children, ...props }: TooltipTriggerProps) {
  const [trigger, ...rest] = Children.toArray(children);
  const wrapped = isValidElement(trigger) && trigger.type !== Focusable
    ? <Focusable key="trigger">{trigger as ReactElement<Record<string, unknown>, string>}</Focusable>
    : trigger;
  return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props}>{wrapped}{rest}</AriaTooltipTrigger>;
}

export interface TooltipProps extends AriaTooltipProps {
  /** Pointer arrow towards the trigger. */
  arrow?: boolean;
}

export function Tooltip({ className, offset = 10, arrow = true, children, ...props }: TooltipProps) {
  return (
    <AriaTooltip className={composeClass('nl-tooltip', className)} offset={offset} {...props}>
      {(renderProps) => (
        <>
          {arrow && (
            <OverlayArrow className="nl-tooltip__arrow">
              <svg width={12} height={8} viewBox="0 0 12 8" aria-hidden="true"><path d="M0 0 L6 6 L12 0" /></svg>
            </OverlayArrow>
          )}
          {typeof children === 'function' ? children(renderProps) : children}
        </>
      )}
    </AriaTooltip>
  );
}
