'use client';

import { Button, Card, DataTable, type DataTableColumn } from '@nerdlab/react';
import { useState, type ReactNode } from 'react';
import { slotColor, type Slot } from './lib/types.js';

export interface TwinTable { columns: DataTableColumn<Record<string, string>>[]; rows: Record<string, string>[] }

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  legend?: ReactNode;
  /** Table-view twin: every chart has one, so no value is reachable only through a tooltip. */
  table?: TwinTable;
  labels?: { showTable: string; showChart: string };
  className?: string;
  children: ReactNode;
}

/** Card with title, legend and a chart / table toggle. */
export function ChartCard({ title, subtitle, legend, table, labels = { showTable: 'Vue table', showChart: 'Vue graphe' }, className, children }: ChartCardProps) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card className={className}>
      <div className="nl-chart-card__head">
        <div>
          <h2 className="nl-chart-card__title">{title}</h2>
          {subtitle && <p className="nl-chart-card__subtitle">{subtitle}</p>}
        </div>
        {table && <Button variant="outline" size="sm" aria-pressed={asTable} onClick={() => setAsTable((v) => !v)}>{asTable ? labels.showChart : labels.showTable}</Button>}
      </div>
      {asTable && table
        ? <DataTable caption={subtitle ? `${title} — ${subtitle}` : title} hideCaption framed={false} columns={table.columns} rows={table.rows} rowKey={(_, i) => i} />
        : <>{legend}{children}</>}
    </Card>
  );
}

/** Legend that mirrors the marks: a line key for lines, a square for bars and areas. Always shown for ≥ 2 series. */
export function Legend({ items, kind }: { items: { label: string; slot: Slot }[]; kind: 'line' | 'rect' }) {
  return (
    <ul className="nl-legend">
      {items.map((i) => (
        <li key={i.label}><i className={kind === 'line' ? 'nl-key-line' : 'nl-key-rect'} style={{ background: slotColor(i.slot) }} aria-hidden="true" />{i.label}</li>
      ))}
    </ul>
  );
}
