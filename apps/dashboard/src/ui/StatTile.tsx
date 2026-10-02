import { Window } from '@nerdlab/react';
import type { ReactNode } from 'react';
// LIBRARY GAP: KPI tile (label, hero-sized value that always fits, delta, trend). Built on Window.
export function StatTile({ title, color, label, value, delta, hero = false, children }: {
  title: string; color?: 'accent' | 'primary' | 'secondary' | 'lavender' | 'mint'; label: string; value: string; delta?: ReactNode; hero?: boolean; children?: ReactNode;
}) {
  return (
    <Window className={hero ? 'kpi kpi--hero' : 'kpi'}>
      <Window.Bar color={color}>{title}</Window.Bar>
      <Window.Body className="kpi__body">
        <span className="kpi__label">{label}</span>
        <span className="kpi__value">{value}</span>
        {delta && <div className="kpi__row">{delta}</div>}
        {children}
      </Window.Body>
    </Window>
  );
}
