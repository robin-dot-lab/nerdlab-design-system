import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export type MeterLevel = 'ok' | 'warn' | 'bad';

export interface MeterProps extends Omit<ComponentProps<'meter'>, 'children' | 'value'> {
  value: number;
  /** Accessible name. */
  label: string;
  min?: number;
  max?: number;
  /** Below `low` is bad, between `low` and `high` is a warning, from `high` up is fine (higher is better). */
  low?: number;
  high?: number;
}

/** Severity class for a value, using the same thresholds as the native meter. */
export function meterLevel(value: number, low: number, high: number): MeterLevel {
  return value >= high ? 'ok' : value >= low ? 'warn' : 'bad';
}

/**
 * Native <meter>: the browser draws the fill width and exposes value/min/max to assistive tech.
 * The component only adds the severity class that colours fill and track.
 */
export function Meter({ value, label, min = 0, max = 1, low = min + (max - min) * 0.5, high = min + (max - min) * 0.7, className, ...props }: MeterProps) {
  const clamped = Math.min(max, Math.max(min, value));
  return (
    <meter
      className={cn('nl-meter', `nl-meter--${meterLevel(clamped, low, high)}`, className)}
      aria-label={label}
      value={clamped} min={min} max={max} low={low} high={high} optimum={max}
      {...props}
    />
  );
}
