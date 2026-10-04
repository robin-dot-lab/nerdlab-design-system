'use client';

import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';
import { relativeUnit, toDate, useNow } from '../lib/time.js';
import { Tooltip, TooltipTrigger } from '../tooltip/tooltip.js';

export interface RelativeTimeProps extends Omit<ComponentProps<'time'>, 'children' | 'dateTime'> {
  /** The moment to describe (a Date, an ISO string or a timestamp). */
  date: Date | string | number;
  /**
   * Show the absolute date in a tooltip. The `<time>` then becomes a tab stop, so the tooltip opens from the
   * keyboard too. Turn it off inside a list item or a link, and give the absolute date in their text instead.
   */
  tooltip?: boolean;
}

/**
 * “2 minutes ago” / « il y a 2 minutes », in React Aria's locale, refreshed on its own (every 15 s at first, then
 * less often as the moment recedes). Renders `<time datetime>`. The server render and the hydration render
 * print the absolute date in UTC, so they match; the relative wording replaces it once mounted.
 */
export function RelativeTime({ date, tooltip = true, className, ...props }: RelativeTimeProps) {
  const { locale } = useMessages();
  const d = toDate(date);
  const now = useNow(d.getTime());
  const absolute = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', ...(now === null && { timeZone: 'UTC' }) }).format(d);
  const text = now === null ? absolute : new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(...relativeUnit(d.getTime() - now));
  const time = (
    <time dateTime={d.toISOString()} className={cn('nl-relative-time', className)} tabIndex={tooltip ? 0 : undefined} {...props}>
      {text}
    </time>
  );
  if (!tooltip) return time;
  return <TooltipTrigger>{time}<Tooltip>{absolute}</Tooltip></TooltipTrigger>;
}
