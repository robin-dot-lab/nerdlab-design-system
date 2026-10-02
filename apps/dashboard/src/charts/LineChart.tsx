import { useRef, useState } from 'react';
import { catColor, type CatId } from '../data';
import { dShort, eur, eurCompact, sum } from '../format';
import { useElementWidth } from '../hooks';
import { useChartTip } from './ChartTip';

function niceTicks(max: number, count = 4) {
  const raw = max / count, mag = 10 ** Math.floor(Math.log10(raw || 1)), norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const top = Math.ceil(max / step) * step || step;
  const ticks: number[] = []; for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  return { ticks, top };
}

export interface LineSeries { id: CatId; name: string; values: number[] }

/** 2px lines, single Y axis, end labels with leader lines, crosshair tooltip; ←/→ when focused. */
export function LineChart({ labels, series, weekly }: { labels: Date[]; series: LineSeries[]; weekly: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const W = useElementWidth(ref);
  const { show, hide } = useChartTip();
  const [cur, setCur] = useState<number | null>(null);
  const narrow = W < 520, H = narrow ? 240 : 300, m = { l: 48, r: narrow ? 14 : 112, t: 12, b: 30 };
  const n = labels.length;
  const { ticks, top } = niceTicks(Math.max(1, ...series.flatMap((s) => s.values)));
  const x = (i: number) => m.l + (n === 1 ? 0 : (i * (W - m.l - m.r)) / (n - 1));
  const y = (v: number) => m.t + (H - m.t - m.b) * (1 - v / top);
  const step = n > 1 ? (W - m.l - m.r) / (n - 1) : 1;
  const every = Math.max(1, Math.ceil(n / (narrow ? 3 : 6)));
  const MIN_LABEL_GAP = 56; // px between the last date label and the previous one, measured, not counted in steps

  const at = (i: number, cx?: number, cy?: number) => {
    const k = Math.max(0, Math.min(n - 1, i)); setCur(k);
    const r = ref.current!.getBoundingClientRect();
    const title = (weekly ? 'Semaine du ' : '') + labels[k].toLocaleDateString('fr-FR', { weekday: weekly ? undefined : 'short', day: 'numeric', month: 'long' });
    show({ title, rows: [...series.map((s) => ({ color: catColor(s.id), value: eur.format(s.values[k]), name: s.name })), { color: 'transparent', value: eur.format(sum(series.map((s) => s.values[k]))), name: 'Total' }], x: cx ?? r.left + x(k), y: cy ?? r.top + m.t });
  };
  const clear = () => { setCur(null); hide(); };

  // End labels: sorted by value position, pushed apart, joined to their line by a leader when displaced.
  const ends = series.map((s) => ({ s, y0: y(s.values[n - 1]), y: y(s.values[n - 1]) })).sort((a, b) => a.y0 - b.y0);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
  const overflow = ends.length ? ends[ends.length - 1].y - (H - m.b) : 0;
  if (overflow > 0) ends.forEach((l) => (l.y -= overflow));

  return (
    <div ref={ref} className="chart">
      {W > 0 && series.length > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} tabIndex={0} role="img"
          aria-label={`Revenu par catégorie, ${series.length} séries. Flèches gauche et droite pour parcourir les dates.`}
          onFocus={() => at(cur ?? n - 1)} onBlur={clear}
          onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); at((cur ?? n - 1) + (e.key === 'ArrowRight' ? 1 : -1)); } if (e.key === 'Escape') clear(); }}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} shapeRendering="crispEdges" />
              <text x={m.l - 8} y={y(t) + 4} textAnchor="end" className="axis">{t >= 1000 ? (t / 1000).toLocaleString('fr-FR') + ' k' : t}</text>
            </g>
          ))}
          {/* First and last dates always; intermediate ticks every `every` steps, dropped when too close to the last one. */}
          {labels.map((d, i) => (i === 0 || i === n - 1 || (i % every === 0 && x(n - 1) - x(i) >= MIN_LABEL_GAP)) && (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} className="axis">{dShort(d)}</text>
          ))}
          {series.map((s) => (
            <g key={s.id}>
              <path d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')} fill="none" stroke={catColor(s.id)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={x(n - 1)} cy={y(s.values[n - 1])} r={4} fill={catColor(s.id)} stroke="var(--color-surface)" strokeWidth={2} />
            </g>
          ))}
          {!narrow && ends.map((l) => (
            <g key={l.s.id}>
              {Math.abs(l.y - l.y0) > 3 && <path d={`M${x(n - 1) + 6},${l.y0}L${W - m.r + 14},${l.y}`} fill="none" stroke="var(--color-text-secondary)" strokeWidth={1} />}
              <text x={W - m.r + 18} y={l.y + 4} className="end-label">{l.s.name} <tspan>{eurCompact(l.s.values[n - 1])}</tspan></text>
            </g>
          ))}
          {cur !== null && (
            <g>
              <line x1={x(cur)} x2={x(cur)} y1={m.t} y2={H - m.b} stroke="var(--color-text-primary)" strokeWidth={1} opacity={0.35} />
              {series.map((s) => <circle key={s.id} cx={x(cur)} cy={y(s.values[cur])} r={5} fill={catColor(s.id)} stroke="var(--color-surface)" strokeWidth={2} />)}
            </g>
          )}
          <rect x={m.l - 10} y={m.t} width={W - m.l - m.r + 20} height={H - m.t - m.b} fill="transparent"
            onPointerMove={(e) => { const r = ref.current!.getBoundingClientRect(); at(Math.round((e.clientX - r.left - m.l) / step), e.clientX, e.clientY); }}
            onPointerLeave={clear} />
        </svg>
      )}
      {series.length === 0 && <p className="empty">Aucune catégorie sélectionnée.</p>}
    </div>
  );
}
