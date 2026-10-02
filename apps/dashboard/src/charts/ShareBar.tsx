import { useRef } from 'react';
import type { Category } from '../data';
import { catColor } from '../data';
import { eur, pct, sum } from '../format';
import { useElementWidth } from '../hooks';
import { useMarkTip } from './ChartTip';

const ctx = document.createElement('canvas').getContext('2d')!;
const textWidth = (t: string) => { ctx.font = '700 12px Outfit'; return ctx.measureText(t).width; };
function luminance(css: string) {
  const m = css.match(/^#?([0-9a-f]{6})$/i); if (!m) return null;
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
}
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const INK = '#1B1525', WHITE = '#FFFFFF', L_INK = luminance(INK)!, L_WHITE = 1;
/** Text colour with the best contrast on the fill, or null if neither reaches 4.5:1 (small text). */
function labelColor(fill: string) {
  const l = luminance(fill); if (l === null) return null;
  const [color, ratio] = contrast(l, L_INK) >= contrast(l, L_WHITE) ? [INK, contrast(l, L_INK)] : [WHITE, contrast(l, L_WHITE)];
  return ratio >= 4.5 ? color : null;
}

function Segment({ c, share, width, theme }: { c: Category; share: number; width: number; theme: string }) {
  const label = pct(share), hex = getComputedStyle(document.documentElement).getPropertyValue(`--chart-${c.slot}`).trim();
  const tip = useMarkTip(() => ({ title: 'Part du revenu', rows: [{ key: 'rect', color: catColor(c.id), value: label, name: c.name }] }));
  // Label inside only if it fits AND is readable; otherwise the legend list and the tooltip carry it.
  const text = labelColor(hex);
  const fits = text !== null && textWidth(label) + 16 <= share * width - 2;
  return (
    <div className="stack100__seg" data-theme-key={theme} role="img" tabIndex={0} aria-label={`${c.name} ${label}`} {...tip}
      style={{ flex: `${share} 1 0`, background: catColor(c.id), color: text ?? undefined }}>
      {fits ? label : ''}
    </div>
  );
}

/** 100% stacked bar with 2px surface gaps; the list below is the legend and the table. */
export function ShareBar({ items, theme }: { items: { c: Category; v: number }[]; theme: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const W = useElementWidth(ref), total = sum(items.map((x) => x.v));
  if (!total) return <p className="empty">Aucune donnée.</p>;
  return (
    <>
      <div ref={ref} className="stack100">{W > 0 && items.map(({ c, v }) => <Segment key={c.id} c={c} share={v / total} width={W} theme={theme} />)}</div>
      <ul className="share-list">
        {items.map(({ c, v }) => (
          <li key={c.id}><i className="key-rect" style={{ background: catColor(c.id) }} aria-hidden="true" /><span>{c.name}</span><span className="num nl-muted">{pct(v / total)}</span><b className="num">{eur.format(v)}</b></li>
        ))}
      </ul>
    </>
  );
}
