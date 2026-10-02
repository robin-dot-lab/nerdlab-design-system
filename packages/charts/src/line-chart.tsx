'use client';

import { useState } from 'react';
import { useChartTooltip } from './lib/tooltip.js';
import { slotColor, type Slot } from './lib/types.js';
import { useWidth } from './lib/use-width.js';

export interface LineSeries { id: string; name: string; slot: Slot; values: number[] }

export interface LineChartProps {
  series: LineSeries[];
  /** One label per point (x axis). */
  xLabels: string[];
  /** Accessible name; keyboard instructions are appended. */
  title: string;
  formatValue?: (v: number) => string;
  /** Short form for end labels (e.g. "2,3 k €"). Defaults to formatValue. */
  formatCompact?: (v: number) => string;
  formatTick?: (v: number) => string;
  /** Tooltip title for point i; defaults to its x label. */
  pointTitle?: (i: number) => string;
  /** Adds a total row to the tooltip; false to omit. */
  totalLabel?: string | false;
  emptyLabel?: string;
  width?: number;
}

function niceTicks(max: number, count = 4) {
  const raw = max / count, mag = 10 ** Math.floor(Math.log10(raw || 1)), norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const top = Math.ceil(max / step) * step || step;
  const ticks: number[] = []; for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  return { ticks, top };
}
const defaultTick = (t: number) => (t >= 1000 ? `${(t / 1000).toLocaleString('fr-FR')} k` : String(t));
const MIN_LABEL_GAP = 56;

/** 2px lines on one Y axis, end labels with leader lines, crosshair tooltip; ←/→ move it when focused. */
export function LineChart({
  series, xLabels, title, formatValue = String, formatCompact, formatTick = defaultTick,
  pointTitle, totalLabel = 'Total', emptyLabel = 'Aucune série sélectionnée.', width,
}: LineChartProps) {
  const [ref, W] = useWidth<HTMLDivElement>(width);
  const tip = useChartTooltip();
  const [cur, setCur] = useState<number | null>(null);
  const compact = formatCompact ?? formatValue;
  const narrow = W < 520, H = narrow ? 240 : 300, m = { l: 48, r: narrow ? 14 : 112, t: 12, b: 30 };
  const n = xLabels.length;
  const { ticks, top } = niceTicks(Math.max(1, ...series.flatMap((s) => s.values)));
  const x = (i: number) => m.l + (n <= 1 ? 0 : (i * (W - m.l - m.r)) / (n - 1));
  const y = (v: number) => m.t + (H - m.t - m.b) * (1 - v / top);
  const step = n > 1 ? (W - m.l - m.r) / (n - 1) : 1;
  const every = Math.max(1, Math.ceil(n / (narrow ? 3 : 6)));
  const valueAt = (s: LineSeries, i: number) => s.values[i] ?? 0;

  const at = (i: number, cx?: number, cy?: number) => {
    const k = Math.max(0, Math.min(n - 1, i)); setCur(k);
    const r = ref.current?.getBoundingClientRect();
    const rows = series.map((s) => ({ color: slotColor(s.slot), value: formatValue(valueAt(s, k)), name: s.name }));
    if (totalLabel !== false) rows.push({ color: 'transparent', value: formatValue(series.reduce((a, s) => a + valueAt(s, k), 0)), name: totalLabel });
    tip.show({ title: pointTitle ? pointTitle(k) : xLabels[k] ?? '', rows }, cx ?? (r?.left ?? 0) + x(k), cy ?? (r?.top ?? 0) + m.t);
  };
  const clear = () => { setCur(null); tip.hide(); };

  const ends = series.map((s) => ({ s, y0: y(valueAt(s, n - 1)), y: y(valueAt(s, n - 1)) })).sort((a, b) => a.y0 - b.y0);
  for (let i = 1; i < ends.length; i++) if (ends[i]!.y - ends[i - 1]!.y < 16) ends[i]!.y = ends[i - 1]!.y + 16;
  const overflow = ends.length ? ends[ends.length - 1]!.y - (H - m.b) : 0;
  if (overflow > 0) ends.forEach((l) => (l.y -= overflow));

  if (!series.length) return <p className="nl-chart-empty">{emptyLabel}</p>;
  return (
    <div ref={ref} className="nl-chart">
      {W > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img"
          aria-label={`${title}, ${series.length} séries. Flèches gauche et droite pour parcourir les points.`}
          onFocus={() => at(cur ?? n - 1)} onBlur={clear}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); at((cur ?? n - 1) + (e.key === 'ArrowRight' ? 1 : -1)); }
            if (e.key === 'Escape') clear();
          }}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} shapeRendering="crispEdges" />
              <text x={m.l - 8} y={y(t) + 4} textAnchor="end" className="nl-chart__axis">{formatTick(t)}</text>
            </g>
          ))}
          {/* First and last labels always; intermediate ticks every `every` points, dropped when too close to the last. */}
          {xLabels.map((label, i) => (i === 0 || i === n - 1 || (i % every === 0 && x(n - 1) - x(i) >= MIN_LABEL_GAP)) && (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} className="nl-chart__axis">{label}</text>
          ))}
          {series.map((s) => (
            <g key={s.id}>
              <path d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')} fill="none" stroke={slotColor(s.slot)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={x(n - 1)} cy={y(valueAt(s, n - 1))} r={4} fill={slotColor(s.slot)} stroke="var(--color-surface)" strokeWidth={2} />
            </g>
          ))}
          {!narrow && ends.map((l) => (
            <g key={l.s.id}>
              {Math.abs(l.y - l.y0) > 3 && <path d={`M${x(n - 1) + 6},${l.y0}L${W - m.r + 14},${l.y}`} fill="none" stroke="var(--color-text-secondary)" strokeWidth={1} />}
              <text x={W - m.r + 18} y={l.y + 4} className="nl-chart__end-label">{l.s.name} <tspan>{compact(valueAt(l.s, n - 1))}</tspan></text>
            </g>
          ))}
          {cur !== null && (
            <g>
              <line x1={x(cur)} x2={x(cur)} y1={m.t} y2={H - m.b} stroke="var(--color-text-primary)" strokeWidth={1} opacity={0.35} />
              {series.map((s) => <circle key={s.id} cx={x(cur)} cy={y(valueAt(s, cur))} r={5} fill={slotColor(s.slot)} stroke="var(--color-surface)" strokeWidth={2} />)}
            </g>
          )}
          <rect x={m.l - 10} y={m.t} width={Math.max(0, W - m.l - m.r + 20)} height={H - m.t - m.b} fill="transparent"
            onPointerMove={(e) => { const r = ref.current!.getBoundingClientRect(); at(Math.round((e.clientX - r.left - m.l) / step), e.clientX, e.clientY); }}
            onPointerLeave={clear} />
        </svg>
      )}
      {tip.element}
    </div>
  );
}
