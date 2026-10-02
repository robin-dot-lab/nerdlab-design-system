'use client';

import type { ReactNode } from 'react';
import {
  Menu as AriaMenu, MenuItem as AriaMenuItem, MenuTrigger as AriaMenuTrigger, Popover as AriaPopover, Separator,
  type MenuItemProps as AriaMenuItemProps, type MenuProps as AriaMenuProps, type MenuTriggerProps as AriaMenuTriggerProps,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import { cn } from '../lib/cn.js';
import { withPressableTrigger } from './trigger.js';

export interface MenuTriggerProps extends Omit<AriaMenuTriggerProps, 'children'> {
  /** First child: the button that opens the menu (e.g. `<Button>`). Second: the `<Menu>`. */
  children: ReactNode;
}

/** Opens a `Menu` from a button, by click, Enter, Space or arrow keys. The menu is named by the button. */
export function MenuTrigger({ children, ...props }: MenuTriggerProps) {
  return <AriaMenuTrigger {...props}>{withPressableTrigger(children)}</AriaMenuTrigger>;
}

export interface MenuProps<T> extends Omit<AriaMenuProps<T>, 'className' | 'style'> {
  className?: string;
  placement?: AriaPopoverProps['placement'];
}

/**
 * List of actions (role="menu"): arrow keys and typeahead move focus, Enter runs `onAction(id)`,
 * Escape closes. For navigation between pages, use links instead.
 */
export function Menu<T extends object>({ className, placement = 'bottom start', ...props }: MenuProps<T>) {
  return (
    <AriaPopover className="nl-popover" placement={placement} offset={6}>
      <AriaMenu className={cn('nl-menu', className)} {...props} />
    </AriaPopover>
  );
}

export interface MenuItemProps<T> extends Omit<AriaMenuItemProps<T>, 'className' | 'style'> {
  /** `danger` for destructive actions (red text; say what is destroyed in the label too). */
  tone?: 'default' | 'danger';
  className?: string;
}

/** One action. Give it an `id` for `onAction`, and a `textValue` when its children are not plain text. */
export function MenuItem<T extends object>({ tone = 'default', className, ...props }: MenuItemProps<T>) {
  return <AriaMenuItem className={cn('nl-menu__item', tone === 'danger' && 'nl-menu__item--danger', className)} {...props} />;
}

/** Dashed line between groups of actions (role="separator"). */
export function MenuSeparator() {
  return <Separator className="nl-menu__separator" />;
}
