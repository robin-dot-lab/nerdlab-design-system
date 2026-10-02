'use client';

import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import {
  Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Heading, Modal, ModalOverlay,
  type DialogProps as AriaDialogProps, type DialogTriggerProps as AriaDialogTriggerProps,
} from 'react-aria-components';
import { cn } from '../lib/cn.js';
import { windowBarVariants } from '../window/window.js';
import { withPressableTrigger } from './trigger.js';

export interface DialogTriggerProps extends Omit<AriaDialogTriggerProps, 'children'> {
  /** First child: the element that opens the overlay (e.g. `<Button>`). Second: the `<Dialog>` or `<Popover>`. */
  children: ReactNode;
}

/** Opens a `Dialog` or a `Popover` from a button; focus returns to the button when it closes. */
export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  return <AriaDialogTrigger {...props}>{withPressableTrigger(children)}</AriaDialogTrigger>;
}

export interface DialogProps extends Omit<AriaDialogProps, 'children' | 'className' | 'style'> {
  /** Visible title in the window bar; names the dialog for assistive tech. */
  title: ReactNode;
  children: ReactNode | ((opts: { close: () => void }) => ReactNode);
  barColor?: VariantProps<typeof windowBarVariants>['color'];
  size?: 'md' | 'lg';
  /** Close on a click outside. Escape always closes. Default true; set false for a decision the user must make. */
  isDismissable?: boolean;
  closeLabel?: string;
  className?: string;
  /** Controlled use without a DialogTrigger. */
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Modal window: traps focus, closes on Escape, makes the page behind inert, returns focus to the trigger.
 * Use `role="alertdialog"` for a confirmation that interrupts.
 */
export function Dialog({ title, children, barColor, size = 'md', isDismissable = true, closeLabel = 'Fermer', className, isOpen, onOpenChange, ...props }: DialogProps) {
  const controlled = isOpen === undefined ? {} : { isOpen, onOpenChange };
  return (
    <ModalOverlay className="nl-dialog-overlay" isDismissable={isDismissable} {...controlled}>
      <Modal className={cn('nl-dialog-modal', size === 'lg' && 'nl-dialog-modal--lg')}>
        <AriaDialog className={cn('nl-window nl-dialog', className)} {...props}>
          {({ close }) => (
            <>
              <div className={windowBarVariants({ color: barColor })}>
                <Heading slot="title" className="nl-dialog__title">{title}</Heading>
                <button type="button" className="nl-dialog__close" aria-label={closeLabel} onClick={close}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="nl-window__body nl-dialog__body">{typeof children === 'function' ? children({ close }) : children}</div>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export type DialogActionsProps = ComponentProps<'div'>;

/** Button row at the end of a dialog, aligned to the inline end. */
export function DialogActions({ className, ...props }: DialogActionsProps) {
  return <div className={cn('nl-dialog__actions', className)} {...props} />;
}
