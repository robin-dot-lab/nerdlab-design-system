import { useId, type ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export type MeterLevel = 'ok' | 'warn' | 'bad';

export interface MeterProps extends Omit<ComponentProps<'meter'>, 'children' | 'value'> {
  value: number;
  /** Accessible name; shown above the bar with `showLabel`. */
  label: string;
  /** Show `label` as text above the bar, wired to it, instead of only announcing it. */
  showLabel?: boolean;
  /** With `showLabel`: the value in words, shown at the end of the label row (“2 of 5”) and announced instead of a percentage. */
  valueLabel?: string;
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
export function Meter({ value, label, showLabel = false, valueLabel, min = 0, max = 1, low = min + (max - min) * 0.5, high = min + (max - min) * 0.7, className, ...props }: MeterProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const labelId = useId();
  const meter = (
    <meter
      className={cn('nl-meter', `nl-meter--${meterLevel(clamped, low, high)}`, className)}
      {...(showLabel ? { 'aria-labelledby': labelId, 'aria-valuetext': valueLabel } : { 'aria-label': label })}
      value={clamped} min={min} max={max} low={low} high={high} optimum={max}
      {...props}
    />
  );
  if (!showLabel) return meter;
  return (
    <div className="nl-meter-field">
      <div className="nl-meter-field__head">
        <span id={labelId} className="nl-meter-field__label">{label}</span>
        {valueLabel != null && <span className="nl-meter-field__value" aria-hidden="true">{valueLabel}</span>}
      </div>
      {meter}
    </div>
  );
}
