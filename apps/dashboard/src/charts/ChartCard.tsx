import { Button, Card, DataTable, type DataTableColumn } from '@nerdlab/react';
import { useState, type ReactNode } from 'react';

export interface TwinTable { columns: DataTableColumn<Record<string, string>>[]; rows: Record<string, string>[] }

/** Chart card with legend and a table-view twin (every chart has one: tooltips never gate a value). */
export function ChartCard({ title, subtitle, legend, table, children }: { title: string; subtitle: string; legend?: ReactNode; table?: TwinTable; children: ReactNode }) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card className="chart-card">
      <div className="card-head">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        {table && <Button variant="outline" size="sm" aria-pressed={asTable} onClick={() => setAsTable((v) => !v)}>{asTable ? 'Vue graphe' : 'Vue table'}</Button>}
      </div>
      {asTable && table
        ? <DataTable caption={`${title} — ${subtitle}`} hideCaption framed={false} columns={table.columns} rows={table.rows} rowKey={(_, i) => i} />
        : <>{legend}{children}</>}
    </Card>
  );
}

export function Legend({ items, kind }: { items: { name: string; color: string }[]; kind: 'line' | 'rect' }) {
  return (
    <ul className="legend">
      {items.map((i) => <li key={i.name}><i className={kind === 'line' ? 'key-line' : 'key-rect'} style={{ background: i.color }} aria-hidden="true" />{i.name}</li>)}
    </ul>
  );
}
