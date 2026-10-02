'use client';

import type { ReactNode } from 'react';
import {
  Dialog as AriaDialog, Heading, OverlayArrow, Popover as AriaPopover, type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import { cn } from '../lib/cn.js';

export interface PopoverProps extends Omit<AriaPopoverProps, 'children' | 'className' | 'style'> {
  children: ReactNode;
  /** Visible heading, which also names the popover. */
  title?: ReactNode;
  /** Accessible name when there is no title. */
  label?: string;
  arrow?: boolean;
  className?: string;
}

/**
 * Non-modal panel anchored to its trigger (inside a `DialogTrigger`): details, a short form, help.
 * Closes on Escape or a click outside; focus moves in, and back to the trigger on close.
 */
export function Popover({ children, title, label, arrow = true, offset = 10, className, ...props }: PopoverProps) {
  return (
    <AriaPopover className={cn('nl-popover', className)} offset={offset} {...props}>
      {arrow && (
        <OverlayArrow className="nl-popover__arrow">
          <svg width={14} height={9} viewBox="0 0 14 9" aria-hidden="true"><path d="M0 0 L7 7 L14 0" /></svg>
        </OverlayArrow>
      )}
      <AriaDialog className="nl-popover__dialog" aria-label={title == null ? label : undefined}>
        {title != null && <Heading slot="title" className="nl-popover__title">{title}</Heading>}
        {children}
      </AriaDialog>
    </AriaPopover>
  );
}
