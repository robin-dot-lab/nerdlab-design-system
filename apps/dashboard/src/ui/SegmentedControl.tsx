// LIBRARY GAP: single choice among a few options (not tabs: there is no panel). Styled on .nl-tabs/.nl-tab.
export function SegmentedControl<T extends string | number>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="nl-tabs segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="nl-tab" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
