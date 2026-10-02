'use client';

import { useWidth } from './lib/use-width.js';

export interface SparklineProps {
  /** About 12 points: history in the de-emphasis hue, the last segment in the accent. */
  values: number[];
  height?: number;
  /** Fixed width (tests, SSR); measured otherwise. */
  width?: number;
}

/** Decorative trend: the figure it accompanies states the value, so it is hidden from assistive tech. */
export function Sparkline({ values, height = 44, width }: SparklineProps) {
  const [ref, W0] = useWidth<HTMLDivElement>(width);
  const W = W0 || 200, H = height, p = 5, n = values.length;
  const max = Math.max(...values), min = Math.min(...values);
  const x = (i: number) => p + (i * (W - 2 * p)) / Math.max(1, n - 1);
  const y = (v: number) => H - p - (max === min ? 0.5 : (v - min) / (max - min)) * (H - 2 * p);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return (
    <div ref={ref} className="nl-spark">
      {n > 1 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <path d={d} fill="none" stroke="var(--chart-muted)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={`M${x(n - 2)},${y(values[n - 2]!)}L${x(n - 1)},${y(values[n - 1]!)}`} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinecap="round" />
          <circle cx={x(n - 1)} cy={y(values[n - 1]!)} r={4} fill="var(--chart-1)" stroke="var(--color-surface)" strokeWidth={2} />
        </svg>
      )}
    </div>
  );
}
