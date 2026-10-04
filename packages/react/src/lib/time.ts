'use client';

import { useEffect, useState } from 'react';

const SECOND = 1000, MINUTE = 60 * SECOND, HOUR = 60 * MINUTE, DAY = 24 * HOUR;

export const toDate = (value: Date | string | number) => (value instanceof Date ? value : new Date(value));

/**
 * The value and unit Intl.RelativeTimeFormat should say for a signed gap in milliseconds (target − now).
 * Under 45 seconds: the seconds for a countdown, else 0 (“now” with `numeric: 'auto'`).
 */
export function relativeUnit(gap: number, seconds = false): [number, Intl.RelativeTimeFormatUnit] {
  const abs = Math.abs(gap);
  const round = (unit: number) => Math.round(gap / unit);
  if (abs < 45 * SECOND) return [seconds ? round(SECOND) : 0, 'second'];
  if (abs < 45 * MINUTE) return [round(MINUTE) || Math.sign(gap), 'minute'];
  if (abs < 22 * HOUR) return [round(HOUR) || Math.sign(gap), 'hour'];
  if (abs < 6 * DAY) return [round(DAY) || Math.sign(gap), 'day'];
  if (abs < 26 * DAY) return [round(7 * DAY) || Math.sign(gap), 'week'];
  if (abs < 320 * DAY) return [round(30 * DAY) || Math.sign(gap), 'month'];
  return [round(365 * DAY) || Math.sign(gap), 'year'];
}

/** How long a relative label stays right: refresh often when the gap is small, rarely when it is large. */
export function refreshDelay(gap: number, seconds = false) {
  const abs = Math.abs(gap);
  if (abs < MINUTE) return seconds ? SECOND : 15 * SECOND;
  if (abs < HOUR) return 15 * SECOND;
  if (abs < DAY) return 5 * MINUTE;
  return HOUR;
}

/**
 * The current time, refreshed at a pace suited to the gap with `target`. `null` during the server render and
 * the hydration render, so both print the same markup; the client switches to the live value right after.
 */
export function useNow(target: number, seconds = false): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      timer = setTimeout(tick, refreshDelay(target - t, seconds));
    };
    tick();
    return () => clearTimeout(timer);
  }, [target, seconds]);
  return now;
}
