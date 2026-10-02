'use client';

import { useChartTooltip } from './lib/tooltip.js';
import { seqColor } from './lib/types.js';

export interface HeatmapProps {
  rowLabels: string[];
  colLabels: string[];
  /** values[row][col] */
  values: number[][];
  /** Accessible name of the grid. */
  title: string;
  /** Unit of a cell ("check-ins"). */
  unit: string;
  /** Hidden name of the top-left header cell (it names the row labels). */
  cornerLabel: string;
  formatValue?: (v: number) => string;
  /** Number of sequential steps (the skin provides 5). */
  bins?: number;
}

/** Single-hue sequential scale in equal-width bins, 2px surface gaps, scale legend. */
export function Heatmap({ rowLabels, colLabels, values, title, unit, cornerLabel, formatValue = String, bins = 5 }: HeatmapProps) {
  const tip = useChartTooltip();
  const flat = values.flat(), min = Math.min(...flat), max = Math.max(...flat);
  const bin = (v: number) => Math.min(bins - 1, Math.floor((v - min) / ((max - min) / bins || 1)));
  // Only the column count crosses into style; the track sizes live in the skin (.nl-heat).
  const cols = { '--heat-cols': colLabels.length } as React.CSSProperties;
  return (
    <>
      <div className="nl-heat" role="grid" aria-label={title} style={cols}>
        <div role="row" className="nl-heat__row">
          <span role="columnheader"><span className="nl-visually-hidden">{cornerLabel}</span></span>
          {colLabels.map((c) => <span key={c} role="columnheader" className="nl-heat__col-label">{c}</span>)}
        </div>
        {values.map((row, r) => (
          <div role="row" key={r} className="nl-heat__row">
            <span role="rowheader" className="nl-heat__row-label">{rowLabels[r]}</span>
            {row.map((v, c) => {
              const color = seqColor(bin(v) + 1);
              return (
                <div key={c} role="gridcell" tabIndex={0} className="nl-heat__cell" style={{ background: color }}
                  aria-label={`${rowLabels[r]} ${colLabels[c]} : ${formatValue(v)} ${unit}`}
                  {...tip.markProps(() => ({ title: `${rowLabels[r]} · ${colLabels[c]}`, rows: [{ key: 'rect', color, value: formatValue(v), name: unit }] }))} />
              );
            })}
          </div>
        ))}
      </div>
      <div className="nl-scale" aria-hidden="true">
        <span>{formatValue(min)}</span>
        <span className="nl-scale__steps">{Array.from({ length: bins }, (_, i) => <i key={i} style={{ background: seqColor(i + 1) }} />)}</span>
        <span>{formatValue(max)} {unit}</span>
      </div>
      {tip.element}
    </>
  );
}
