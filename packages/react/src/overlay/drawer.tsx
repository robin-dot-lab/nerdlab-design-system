'use client';

import { Close } from '@robin-dot-lab/icons';
import type { ComponentProps, ReactNode } from 'react';
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay, type DialogProps as AriaDialogProps } from 'react-aria-components';
import { cn } from '../lib/cn.js';

export interface DrawerProps extends Omit<AriaDialogProps, 'children' | 'className' | 'style'> {
  /** Visible title in the drawer head; names it for assistive tech. */
  title: ReactNode;
  children: ReactNode | ((opts: { close: () => void }) => ReactNode);
  /** Edge it slides from: the inline end (default), the inline start, or the bottom (a sheet on phones). */
  placement?: 'end' | 'start' | 'bottom';
  /** Close on a click outside. Escape always closes. Default true. */
  isDismissable?: boolean;
  closeLabel?: string;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Modal panel from an edge of the screen (filters, details, navigation on phones): focus is trapped,
 * Escape closes, the page behind is inert, focus returns to the trigger. Open it with `DialogTrigger`.
 */
export function Drawer({ title, children, placement = 'end', isDismissable = true, closeLabel = 'Fermer', className, isOpen, onOpenChange, ...props }: DrawerProps) {
  const controlled = isOpen === undefined ? {} : { isOpen, onOpenChange };
  return (
    <ModalOverlay className="nl-drawer-overlay" isDismissable={isDismissable} {...controlled}>
      <Modal className={cn('nl-drawer', placement !== 'end' && `nl-drawer--${placement}`, className)}>
        <AriaDialog className="nl-drawer__dialog" {...props}>
          {({ close }) => (
            <>
              <div className="nl-drawer__head">
                <Heading slot="title" className="nl-drawer__title">{title}</Heading>
                <button type="button" className="nl-dialog__close" aria-label={closeLabel} onClick={close}><Close /></button>
              </div>
              <div className="nl-drawer__body">{typeof children === 'function' ? children({ close }) : children}</div>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export type DrawerFooterProps = ComponentProps<'div'>;

/** Actions pinned under the drawer body, e.g. Apply / Reset. Put it last in the drawer's children. */
export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return <div className={cn('nl-drawer__foot', className)} {...props} />;
}
