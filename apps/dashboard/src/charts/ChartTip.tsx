import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

// Pointer-following tooltip shared by all charts. Values lead, labels follow; keyboard focus shows the same content.
export interface TipRow { color: string; value: string; name: string; key?: 'line' | 'rect' }
interface TipState { title: string; rows: TipRow[]; x: number; y: number }
const Ctx = createContext<{ show: (t: TipState) => void; hide: () => void }>({ show: () => {}, hide: () => {} });
export const useChartTip = () => useContext(Ctx);

export function ChartTipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<TipState | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  useLayoutEffect(() => {
    if (!tip || !ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    let left = tip.x + 16, top = tip.y + 16;
    if (left + w > innerWidth - 8) left = tip.x - w - 16;
    if (top + h > innerHeight - 8) top = tip.y - h - 16;
    setPos({ left: Math.max(8, left), top: Math.max(8, top) });
  }, [tip]);
  const show = useCallback((t: TipState) => setTip(t), []);
  const hide = useCallback(() => setTip(null), []);
  return (
    <Ctx.Provider value={{ show, hide }}>
      {children}
      {tip && (
        <div ref={ref} className="chart-tip" style={pos} aria-hidden="true">
          <div className="chart-tip__title">{tip.title}</div>
          {tip.rows.map((r, i) => (
            <div key={i} className="chart-tip__row">
              <i className={r.key === 'rect' ? 'key-rect' : 'key-line'} style={{ background: r.color }} /><b>{r.value}</b><span>{r.name}</span>
            </div>
          ))}
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Pointer + focus handlers that show a tooltip for a mark. */
export function useMarkTip(content: () => Omit<TipState, 'x' | 'y'>) {
  const { show, hide } = useChartTip();
  return {
    onPointerMove: (e: React.PointerEvent) => show({ ...content(), x: e.clientX, y: e.clientY }),
    onPointerLeave: hide,
    onFocus: (e: React.FocusEvent) => { const r = e.currentTarget.getBoundingClientRect(); show({ ...content(), x: r.right, y: r.top }); },
    onBlur: hide,
  };
}
