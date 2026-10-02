import { catById, catColor, type CatId } from '../data';
import { int, pct, sum } from '../format';
import { useMarkTip } from './ChartTip';

interface Row { name: string; cat: CatId; tickets: number }

function BarRow({ r, max, total }: { r: Row; max: number; total: number }) {
  const tip = useMarkTip(() => ({ title: catById[r.cat].name, rows: [{ key: 'rect', color: catColor(r.cat), value: `${int.format(r.tickets)} billets`, name: r.name }, { key: 'rect', color: 'transparent', value: pct(r.tickets / total), name: 'du top 6' }] }));
  return (
    <li className="bar-row" tabIndex={0} aria-label={`${r.name} : ${int.format(r.tickets)} billets`} {...tip}>
      <span className="bar-name" title={r.name}>{r.name}</span>
      <span className="bar-track"><span className="bar" style={{ flexBasis: `${((r.tickets / max) * 100).toFixed(1)}%`, background: catColor(r.cat) }} /><span className="bar-val">{int.format(r.tickets)}</span></span>
    </li>
  );
}

/** Horizontal bars ≤ 24px, 4px rounded data-end, value at the tip; colour = category (the entity). */
export function BarList({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="empty">Aucune donnée.</p>;
  const max = rows[0].tickets, total = sum(rows.map((r) => r.tickets));
  return <ol className="bars">{rows.map((r) => <BarRow key={r.name} r={r} max={max} total={total} />)}</ol>;
}
