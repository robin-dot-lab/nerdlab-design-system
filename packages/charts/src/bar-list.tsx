'use client';

import { useChartTooltip } from './lib/tooltip.js';
import { colon, DEFAULT_LOCALE, isFrench, percent } from './lib/locale.js';
import { slotColor, type Slot } from './lib/types.js';

export interface BarItem { id: string; label: string; value: number; slot: Slot; /** Tooltip title, e.g. the category. */ group?: string }

export interface BarListProps {
  items: BarItem[];
  /** Accessible name of the list. */
  title: string;
  formatValue?: (v: number) => string;
  /** Unit appended in labels and tooltip ("billets"). */
  unit?: string;
  /** Text after the share in the tooltip ("du top 6"); false to omit the share row. */
  shareLabel?: string | false;
  emptyLabel?: string;
  /** Number format and punctuation of the labels; French by default. */
  locale?: string;
}

/** Ranked horizontal bars ≤ 24px, 4px rounded data-end, value at the tip. Items are shown in the given order. */
export function BarList({ items, title, formatValue = String, unit = '', locale = DEFAULT_LOCALE, shareLabel = isFrench(locale) ? 'du total' : 'of total', emptyLabel = isFrench(locale) ? 'Aucune donnée.' : 'No data.' }: BarListProps) {
  const tip = useChartTooltip();
  if (!items.length) return <p className="nl-chart-empty">{emptyLabel}</p>;
  const max = Math.max(...items.map((i) => i.value)) || 1, total = items.reduce((a, i) => a + i.value, 0) || 1;
  const pct = percent(locale);
  const withUnit = (v: number) => (unit ? `${formatValue(v)} ${unit}` : formatValue(v));
  return (
    <>
      <ol className="nl-bars" aria-label={title}>
        {items.map((it) => (
          <li key={it.id} className="nl-bar-row" tabIndex={0} aria-label={`${it.label}${colon(locale)}${withUnit(it.value)}`}
            {...tip.markProps(() => ({
              title: it.group ?? it.label,
              rows: [{ key: 'rect', color: slotColor(it.slot), value: withUnit(it.value), name: it.label },
                ...(shareLabel === false ? [] : [{ key: 'rect' as const, color: 'transparent', value: pct.format(it.value / total), name: shareLabel }])],
            }))}>
            <span className="nl-bar-row__name" title={it.label}>{it.label}</span>
            <span className="nl-bar-row__track">
              <span className="nl-bar-row__bar" style={{ flexBasis: `${((it.value / max) * 100).toFixed(1)}%`, background: slotColor(it.slot) }} />
              <span className="nl-bar-row__value">{formatValue(it.value)}</span>
            </span>
          </li>
        ))}
      </ol>
      {tip.element}
    </>
  );
}
