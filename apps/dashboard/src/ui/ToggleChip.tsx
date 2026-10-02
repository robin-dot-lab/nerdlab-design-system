import type { ReactNode } from 'react';
// LIBRARY GAP: on/off filter button (aria-pressed) with a colour key.
export function ToggleChip({ pressed, onChange, swatch, children }: { pressed: boolean; onChange: (p: boolean) => void; swatch?: string; children: ReactNode }) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={() => onChange(!pressed)}>
      {swatch && <i className="key-rect" style={{ background: swatch }} aria-hidden="true" />}
      {children}
    </button>
  );
}
