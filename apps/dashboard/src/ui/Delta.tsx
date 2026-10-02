import { pct } from '../format';
// LIBRARY GAP: signed variation vs previous period; colour = direction × whether up is good.
export function Delta({ current, previous, upIsGood = true }: { current: number; previous: number; upIsGood?: boolean }) {
  const d = previous ? (current - previous) / previous : 0, up = d >= 0, good = up === upIsGood;
  return (
    <span className={`delta ${good ? 'delta--good' : 'delta--bad'}`} aria-label={`${up ? 'Hausse' : 'Baisse'} de ${pct(Math.abs(d))}`}>
      {up ? '▲ +' : '▼ '}{pct(d).replace('-', '−')}
    </span>
  );
}
