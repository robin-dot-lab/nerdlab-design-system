import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Window, type WindowBarProps } from '../window/window.js';

export interface StatTileProps {
  /** Window title bar text. */
  title: ReactNode;
  barColor?: WindowBarProps['color'];
  /** What the number is ("Revenu billetterie"). */
  label: ReactNode;
  /** The figure, already formatted. */
  value: ReactNode;
  /** Row under the value: typically a <Delta> and a comparison text. */
  meta?: ReactNode;
  /** Larger value for the one headline figure of a view. */
  hero?: boolean;
  /** Trend or gauge under the figure (sparkline, <Meter>…). */
  children?: ReactNode;
  className?: string;
}

/** KPI tile on a Window. The value scales with the tile (container query units) and always fits. */
export function StatTile({ title, barColor, label, value, meta, hero = false, children, className }: StatTileProps) {
  return (
    <Window className={cn('nl-stat', hero && 'nl-stat--hero', className)}>
      <Window.Bar color={barColor}>{title}</Window.Bar>
      <Window.Body>
        <span className="nl-stat__label">{label}</span>
        <span className="nl-stat__value">{value}</span>
        {meta && <div className="nl-stat__row">{meta}</div>}
        {children}
      </Window.Body>
    </Window>
  );
}
