import { useRef } from 'react';
import { useElementWidth } from '../hooks';

/** 12-point trend: history in the de-emphasis hue, current period in the accent. Decorative (the tile states the value). */
export function Sparkline({ values }: { values: number[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const W = useElementWidth(ref) || 200, H = 44, p = 5;
  const max = Math.max(...values), min = Math.min(...values), n = values.length;
  const x = (i: number) => p + (i * (W - 2 * p)) / (n - 1);
  const y = (v: number) => H - p - (max === min ? 0.5 : (v - min) / (max - min)) * (H - 2 * p);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return (
    <div ref={ref} className="spark">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path d={d} fill="none" stroke="var(--chart-muted)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={`M${x(n - 2)},${y(values[n - 2])}L${x(n - 1)},${y(values[n - 1])}`} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinecap="round" />
        <circle cx={x(n - 1)} cy={y(values[n - 1])} r={4} fill="var(--chart-1)" stroke="var(--color-surface)" strokeWidth={2} />
      </svg>
    </div>
  );
}
