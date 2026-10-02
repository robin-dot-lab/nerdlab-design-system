import { pct } from '../format';
// LIBRARY GAP: meter whose fill carries severity; the track is a lighter step of the same hue.
export function severity(p: number) { return p >= 0.7 ? 'var(--chart-1)' : p >= 0.5 ? 'var(--color-warning)' : 'var(--color-error)'; }
export function Meter({ value, label }: { value: number; label: string }) {
  const p = Math.max(0, Math.min(1, value)), sev = severity(p);
  return (
    <div className="meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} aria-valuetext={pct(p)}
      style={{ background: `color-mix(in oklab, ${sev} 22%, var(--color-surface))` }}>
      <span style={{ width: `${(p * 100).toFixed(1)}%`, background: sev }} />
    </div>
  );
}
