'use client';

import { MoreHorizontal } from '@robin-dot-lab/icons';
import { Badge, Button, Card, CopyField, ExpiryIndicator, Menu, MenuItem, MenuSeparator, MenuTrigger, StatusDot, type ExpiryState } from '@robin-dot-lab/react';
import { useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useMailMessages } from '../lib/i18n.js';

export type AddressAction = 'extend' | 'rename' | 'delete';

export interface AddressCardProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The disposable address. */
  address: string;
  /** Unread messages: a counter, said in words. Hidden when 0. */
  unread?: number;
  /** When the address stops receiving mail. */
  expiresAt: Date | string | number;
  /** When it was created: with it, the time left is a bar. */
  createdAt?: Date | string | number;
  /** Called with the chosen action of the menu (extend, rename, delete). */
  onAction?: (action: AddressAction) => void;
}

/**
 * One disposable address: the address to copy, its unread counter, the time left and its state in words, and a
 * menu to extend, rename or delete it. The state follows the deadline on its own (“Receiving mail” → “Expired”).
 */
export function AddressCard({ address, unread = 0, expiresAt, createdAt, onAction, className, ...props }: AddressCardProps) {
  const { t } = useMailMessages();
  const [state, setState] = useState<ExpiryState | null>(null);
  const expired = state === 'expired';
  return (
    <Card className={cn('nl-address-card', expired && 'nl-address-card--expired', className)} {...props}>
      <div className="nl-address-card__head">
        <StatusDot tone={expired ? 'bad' : state === 'soon' ? 'warn' : 'ok'} pulse={!expired && state !== null} label={expired ? t.expired : t.active} />
        {unread > 0 && (
          <Badge variant="primary" className="nl-address-card__unread">
            <span aria-hidden="true">{unread}</span><span className="nl-visually-hidden">{t.unreadCount(unread)}</span>
          </Badge>
        )}
        <MenuTrigger>
          <Button variant="ghost" shape="square" size="sm" className="nl-address-card__menu" aria-label={t.addressActions(address)}><MoreHorizontal /></Button>
          <Menu placement="bottom end" onAction={(key) => onAction?.(key as AddressAction)}>
            <MenuItem id="extend">{t.extend}</MenuItem>
            <MenuItem id="rename">{t.rename}</MenuItem>
            <MenuSeparator />
            <MenuItem id="delete" tone="danger">{t.deleteAddress}</MenuItem>
          </Menu>
        </MenuTrigger>
      </div>
      <CopyField value={address} aria-label={t.address} copyLabel={t.copyAddress} />
      {createdAt !== undefined
        ? <ExpiryIndicator variant="bar" startedAt={createdAt} expiresAt={expiresAt} onStateChange={setState} />
        : <ExpiryIndicator expiresAt={expiresAt} onStateChange={setState} />}
    </Card>
  );
}
