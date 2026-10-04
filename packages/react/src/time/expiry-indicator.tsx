'use client';

import { Clock } from '@robin-dot-lab/icons';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';
import { relativeUnit, toDate, useNow } from '../lib/time.js';
import { Meter } from '../meter/meter.js';

export type ExpiryState = 'normal' | 'soon' | 'expired';

interface CommonProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The deadline. */
  expiresAt: Date | string | number;
  /** How long before the deadline the state turns to “expiring soon”, in milliseconds. Default 5 minutes. */
  soonBefore?: number;
  /** Called with the state once it is known (after mount), then on every change: to disable actions once expired, say. */
  onStateChange?: (state: ExpiryState) => void;
}

export type ExpiryIndicatorProps = CommonProps & (
  /** One line of text with a clock icon. */
  | { variant?: 'text'; startedAt?: Date | string | number }
  /** The text above a `Meter` of the time left; needs the start of the period. */
  | { variant: 'bar'; startedAt: Date | string | number }
);

/**
 * Time left before a deadline, in words: “Expires in 12 minutes”, “Expiring soon: in 3 minutes”, “Expired”.
 * Counts down by itself (every second in the last minute). A change of state, not every tick, is announced
 * politely. The bar variant reuses `Meter`: a measure with a severity, not the progress of a task.
 */
export function ExpiryIndicator({ expiresAt, soonBefore = 5 * 60_000, onStateChange, className, ...rest }: ExpiryIndicatorProps) {
  const { variant = 'text', startedAt, ...props } = rest as CommonProps & { variant?: 'text' | 'bar'; startedAt?: Date | string | number };
  const { locale, t } = useMessages();
  const end = toDate(expiresAt).getTime();
  const now = useNow(end, true);
  const left = now === null ? null : end - now;
  const state: ExpiryState | null = left === null ? null : left <= 0 ? 'expired' : left <= soonBefore ? 'soon' : 'normal';

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const absolute = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', ...(now === null && { timeZone: 'UTC' }) }).format(end);
  const text = left === null ? t.expiresOn(absolute)
    : state === 'expired' ? t.expired
    : state === 'soon' ? `${t.expiringSoon}${t.colon}${rtf.format(...relativeUnit(left, true))}`
    : `${t.expires} ${rtf.format(...relativeUnit(left, true))}`;

  // Announce a change of state only: a live region that repeated every tick would talk over everything.
  const previous = useRef<ExpiryState | null>(null);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (state === null) return;
    if (previous.current === state) return;
    if (previous.current !== null) setAnnouncement(state === 'expired' ? t.expired : state === 'soon' ? t.expiringSoon : '');
    onStateChange?.(state);
    previous.current = state;
  }, [state, t, onStateChange]);

  const start = startedAt === undefined ? undefined : toDate(startedAt).getTime();
  const total = start === undefined ? 0 : Math.max(1, end - start);
  return (
    <div className={cn('nl-expiry', state && `nl-expiry--${state}`, variant === 'bar' && 'nl-expiry--bar', className)} {...props}>
      <span className="nl-expiry__text">
        <Clock size="sm" />
        <time dateTime={new Date(end).toISOString()}>{text}</time>
      </span>
      {variant === 'bar' && (
        <Meter
          value={left === null ? total : Math.max(0, left)} min={0} max={total}
          low={Math.min(total, 1)} high={Math.min(total, soonBefore)}
          label={text}
        />
      )}
      <span className="nl-visually-hidden" role="status">{announcement}</span>
    </div>
  );
}
