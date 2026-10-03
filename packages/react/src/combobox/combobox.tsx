'use client';

import { ChevronDown } from '@robin-dot-lab/icons';
import type { ReactNode } from 'react';
import {
  Button, ComboBox as AriaComboBox, FieldError, Input, Label, ListBox, ListBoxItem, Popover, Text,
  type ComboBoxProps as AriaComboBoxProps, type ListBoxItemProps,
} from 'react-aria-components';
import { cn } from '../lib/cn.js';

export interface ComboBoxProps<T extends object> extends Omit<AriaComboBoxProps<T>, 'children' | 'className' | 'style'> {
  label: ReactNode;
  /** Help text under the field. */
  description?: ReactNode;
  /** Error message: marks the field invalid. */
  errorMessage?: ReactNode;
  placeholder?: string;
  /** Shown in the list when nothing matches. */
  emptyLabel?: ReactNode;
  className?: string;
  children: ReactNode | ((item: T) => ReactNode);
}

/**
 * A text field that filters a list of options (role="combobox"): type to narrow, arrows to move,
 * Enter to pick. Use `Select` when the list is short and needs no search.
 */
export function ComboBox<T extends object>({ label, description, errorMessage, placeholder, emptyLabel = 'Aucun résultat.', className, children, ...props }: ComboBoxProps<T>) {
  return (
    <AriaComboBox className={cn('nl-combobox', className)} isInvalid={errorMessage != null || undefined} {...props}>
      <Label className="nl-label">{label}</Label>
      <div className="nl-combobox__group">
        <Input className={({ isInvalid }) => cn('nl-input', isInvalid && 'nl-input--error')} placeholder={placeholder} />
        <Button className="nl-field-button"><ChevronDown /></Button>
      </div>
      {description != null && errorMessage == null && <Text slot="description" className="nl-help">{description}</Text>}
      <FieldError className="nl-help nl-help--error">{errorMessage}</FieldError>
      <Popover className="nl-popover nl-popover--list" offset={6}>
        <ListBox className="nl-listbox" renderEmptyState={() => <div className="nl-listbox__empty">{emptyLabel}</div>}>
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}

export interface ComboBoxItemProps<T> extends Omit<ListBoxItemProps<T>, 'className' | 'style'> {
  className?: string;
}

/** One option. Give it an `id`, and a `textValue` when its children are not plain text. */
export function ComboBoxItem<T extends object>({ className, ...props }: ComboBoxItemProps<T>) {
  return <ListBoxItem className={cn('nl-listbox__item', className)} {...props} />;
}
