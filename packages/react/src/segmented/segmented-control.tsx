import { cn } from '../lib/cn.js';

export interface SegmentedControlProps<T extends string | number> {
  /** Accessible name of the group. */
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * A single choice among a few options, without panels (use Tabs when each option shows a panel).
 * Toggle buttons with aria-pressed inside role="group", styled on .nl-tabs / .nl-tab.
 */
export function SegmentedControl<T extends string | number>({ label, options, value, onChange, className }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn('nl-tabs nl-segmented', className)}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" className="nl-tab" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
