'use client';

import { useEffect, useState } from 'react';
import { readableOn, textWidth } from './lib/contrast.js';
import { useChartTooltip } from './lib/tooltip.js';
import { slotColor, type Slot } from './lib/types.js';
import { useWidth } from './lib/use-width.js';

export interface ShareItem { id: string; label: string; value: number; slot: Slot }

export interface ShareBarProps {
  items: ShareItem[];
  /** Accessible name; also the tooltip title. */
  title: string;
  formatValue?: (v: number) => string;
  emptyLabel?: string;
  width?: number;
}

/**
 * 100% stacked bar with 2px surface gaps. A share is printed inside its segment only if it fits AND
 * one of the skin's ink / cream tokens reaches 4.5:1 on the fill; otherwise the list below carries it.
 */
export function ShareBar({ items, title, formatValue = String, emptyLabel = 'Aucune donnée.', width }: ShareBarProps) {
  const [ref, W] = useWidth<HTMLDivElement>(width);
  const tip = useChartTooltip();
  // Label colours depend on the active theme's tokens: re-read them when <html data-theme> changes.
  const [theme, setTheme] = useState('');
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme ?? '');
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => mo.disconnect();
  }, []);
  const total = items.reduce((a, i) => a + i.value, 0);
  if (!total) return <p className="nl-chart-empty">{emptyLabel}</p>;
  const pct = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 });
  const font = typeof document === 'undefined' ? undefined : `700 12px ${getComputedStyle(document.body).fontFamily}`;
  return (
    <>
      <div ref={ref} className="nl-share" data-theme-seen={theme}>
        {W > 0 && items.map((it) => {
          const share = it.value / total, label = pct.format(share), fill = slotColor(it.slot);
          const text = readableOn(fill);
          const fits = text !== null && textWidth(label, font) + 16 <= share * W - 2;
          return (
            <div key={it.id} className="nl-share__seg" role="img" tabIndex={0} aria-label={`${it.label} ${label}`}
              style={{ flex: `${share} 1 0`, background: fill, color: text ?? undefined }}
              {...tip.markProps(() => ({ title, rows: [{ key: 'rect', color: fill, value: label, name: it.label }] }))}>
              {fits ? label : ''}
            </div>
          );
        })}
      </div>
      <ul className="nl-share-list" aria-label={title}>
        {items.map((it) => (
          <li key={it.id}>
            <i className="nl-key-rect" style={{ background: slotColor(it.slot) }} aria-hidden="true" />
            <span>{it.label}</span>
            <span className="nl-share-list__num nl-share-list__share">{pct.format(it.value / total)}</span>
            <b className="nl-share-list__num">{formatValue(it.value)}</b>
          </li>
        ))}
      </ul>
      {tip.element}
    </>
  );
}
