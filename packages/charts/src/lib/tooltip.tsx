'use client';

import { useCallback, useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react';

export interface TipRow { color: string; value: string; name: string; key?: 'line' | 'rect' }
export interface TipContent { title: string; rows: TipRow[] }
interface TipState extends TipContent { x: number; y: number }

/**
 * Pointer-following tooltip owned by one chart. Values lead, labels follow; keyboard focus shows the
 * same content. It is aria-hidden: every value is also reachable through labels or the table twin.
 */
export function useChartTooltip() {
  const [tip, setTip] = useState<TipState | null>(null);
  const show = useCallback((content: TipContent, x: number, y: number) => setTip({ ...content, x, y }), []);
  const hide = useCallback(() => setTip(null), []);
  const markProps = (content: () => TipContent) => ({
    onPointerMove: (e: PointerEvent) => show(content(), e.clientX, e.clientY),
    onPointerLeave: hide,
    onFocus: (e: FocusEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); show(content(), r.right, r.top); },
    onBlur: hide,
  });
  const element: ReactNode = tip ? <ChartTip {...tip} /> : null;
  return { show, hide, markProps, element, visible: tip !== null };
}

function ChartTip({ title, rows, x, y }: TipState) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x + 16, top: y + 16 });
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    let left = x + 16, top = y + 16;
    if (left + el.offsetWidth > window.innerWidth - 8) left = x - el.offsetWidth - 16;
    if (top + el.offsetHeight > window.innerHeight - 8) top = y - el.offsetHeight - 16;
    setPos({ left: Math.max(8, left), top: Math.max(8, top) });
  }, [x, y]);
  return (
    <div ref={ref} className="nl-chart-tip" style={pos} aria-hidden="true">
      <div className="nl-chart-tip__title">{title}</div>
      {rows.map((r, i) => (
        <div key={i} className="nl-chart-tip__row">
          <i className={r.key === 'rect' ? 'nl-key-rect' : 'nl-key-line'} style={{ background: r.color }} /><b>{r.value}</b><span>{r.name}</span>
        </div>
      ))}
    </div>
  );
}
