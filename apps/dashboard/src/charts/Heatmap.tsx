import { DOW, SLOTS } from '../data';
import { int } from '../format';
import { useMarkTip } from './ChartTip';

const BINS = 5;
function Cell({ d, s, v, bin }: { d: number; s: number; v: number; bin: number }) {
  const color = `var(--chart-seq-${bin + 1})`;
  const tip = useMarkTip(() => ({ title: `${DOW[d]} · ${SLOTS[s]}`, rows: [{ key: 'rect', color, value: int.format(v), name: 'check-ins' }] }));
  return <div className="heat__cell" role="gridcell" tabIndex={0} aria-label={`${DOW[d]} ${SLOTS[s]} : ${v} check-ins`} style={{ background: color }} {...tip} />;
}

/** Single-hue sequential scale, 5 bins, 2px surface gaps, scale legend. */
export function Heatmap({ grid }: { grid: number[][] }) {
  const flat = grid.flat(), min = Math.min(...flat), max = Math.max(...flat);
  const bin = (v: number) => Math.min(BINS - 1, Math.floor((v - min) / ((max - min) / BINS || 1)));
  return (
    <>
      <div className="heat" role="grid" aria-label="Check-ins par jour et créneau">
        <div role="row" className="heat__row">
          <span role="columnheader"><span className="nl-visually-hidden">Jour</span></span>
          {SLOTS.map((s) => <span key={s} role="columnheader" className="heat__col">{s}</span>)}
        </div>
        {grid.map((row, d) => (
          <div role="row" key={d} className="heat__row">
            <span role="rowheader" className="heat__lab">{DOW[d]}</span>
            {row.map((v, s) => <Cell key={s} d={d} s={s} v={v} bin={bin(v)} />)}
          </div>
        ))}
      </div>
      <div className="scale" aria-hidden="true">
        <span>{int.format(min)}</span>
        <span className="scale__steps">{Array.from({ length: BINS }, (_, i) => <i key={i} style={{ background: `var(--chart-seq-${i + 1})` }} />)}</span>
        <span>{int.format(max)} check-ins</span>
      </div>
    </>
  );
}
