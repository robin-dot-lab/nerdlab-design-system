'use client';

import { useEffect, useMemo, useRef, useState, type Key, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Text label used in stacked (card) mode. Required when `header` is not a string. */
  label?: string;
  /** `end` right-aligns and uses tabular figures (amounts, counts, dates). */
  align?: 'start' | 'end';
  sortable?: boolean;
  /** Value used for sorting; defaults to `row[key]`. */
  sortValue?: (row: T) => string | number | Date;
  /** Cell content; defaults to `String(row[key])`. */
  cell?: (row: T) => ReactNode;
}

export type SortDirection = 'ascending' | 'descending';

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => Key;
  /** Accessible name of the table. Always required; hide it visually with `hideCaption`. */
  caption: ReactNode;
  hideCaption?: boolean;
  /** Rows become label/value cards when the table's container is narrow (default true). */
  stack?: boolean;
  /** Border, radius and surface around the table (default true). */
  framed?: boolean;
  /** Shown in a single full-width row when `rows` is empty. */
  empty?: ReactNode;
  /** Initial sort when uncontrolled. */
  defaultSort?: DataTableSort;
  /**
   * Controlled sort. When set, the table does NOT reorder `rows`: the caller sorts (and paginates)
   * them, e.g. server-side or before slicing a page. `null` means unsorted.
   */
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort) => void;
  /** Adds a checkbox column. Keys are those returned by `rowKey`; selection survives pagination. */
  selectable?: boolean;
  /** Controlled selection. */
  selectedKeys?: ReadonlySet<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (keys: Set<Key>) => void;
  /** Accessible names of the checkboxes (French by default). */
  selectionLabels?: { all: string; row: (row: T) => string; column: string };
  className?: string;
}

export interface DataTableSort { key: string; direction: SortDirection }

const field = (row: unknown, key: string) => (row as Record<string, unknown>)[key];
const labelOf = <T,>(c: DataTableColumn<T>) => c.label ?? (typeof c.header === 'string' ? c.header : c.key);

export function DataTable<T>({
  columns, rows, rowKey, caption, hideCaption = false, stack = true, framed = true,
  empty = 'Aucune donnée.', defaultSort, sort: sortProp, onSortChange,
  selectable = false, selectedKeys, defaultSelectedKeys, onSelectionChange,
  selectionLabels = { all: 'Sélectionner toutes les lignes affichées', row: () => 'Sélectionner la ligne', column: 'Sélection' },
  className,
}: DataTableProps<T>) {
  const [innerSelected, setInnerSelected] = useState<Set<Key>>(() => new Set(defaultSelectedKeys));
  const selected = selectedKeys ?? innerSelected;
  const setSelected = (next: Set<Key>) => { if (selectedKeys === undefined) setInnerSelected(next); onSelectionChange?.(next); };
  const [innerSort, setInnerSort] = useState(defaultSort);
  const controlled = sortProp !== undefined;
  const sort = controlled ? (sortProp ?? undefined) : innerSort;

  const sorted = useMemo(() => {
    if (controlled) return rows;
    const col = sort && columns.find((c) => c.key === sort.key);
    if (!sort || !col) return rows;
    const value = col.sortValue ?? ((r: T) => field(r, col.key) as string | number);
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = value(a), vb = value(b);
      return (va > vb ? 1 : va < vb ? -1 : 0) * dir;
    });
  }, [rows, columns, sort, controlled]);

  const toggle = (key: string) => {
    const next: DataTableSort = { key, direction: sort?.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending' };
    if (!controlled) setInnerSort(next);
    onSortChange?.(next);
  };

  const keys = sorted.map((row, i) => rowKey(row, i));
  const selectedCount = keys.filter((k) => selected.has(k)).length;
  const allState = selectedCount === 0 ? false : selectedCount === keys.length ? true : 'mixed';
  const toggleAll = () => {
    const next = new Set(selected);
    for (const k of keys) { if (allState === true) next.delete(k); else next.add(k); }
    setSelected(next);
  };
  const toggleRow = (k: Key) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k); else next.add(k);
    setSelected(next);
  };
  const span = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn('nl-table-wrap', framed && 'nl-table-wrap--framed', className)}>
      <table className={cn('nl-table', stack && 'nl-table--stack')}>
        <caption className={hideCaption ? 'nl-visually-hidden' : undefined}>{caption}</caption>
        <thead>
          <tr>
            {selectable && (
              <th scope="col" className="nl-table__select">
                <SelectAll state={allState} disabled={keys.length === 0} label={selectionLabels.all} onChange={toggleAll} />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={c.align === 'end' ? 'nl-cell--end' : undefined}
                aria-sort={c.sortable ? (sort?.key === c.key ? sort.direction : 'none') : undefined}
              >
                {c.sortable ? <button type="button" className="nl-table__sort" onClick={() => toggle(c.key)}>{c.header}</button> : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td className="nl-table__empty" colSpan={span}>{empty}</td></tr>
          ) : (
            sorted.map((row, i) => {
              const k = keys[i]!, isSelected = selectable && selected.has(k);
              return (
              <tr key={k} className={isSelected ? 'nl-table__row--selected' : undefined}>
                {selectable && (
                  <td className="nl-table__select" data-label={selectionLabels.column}>
                    <input type="checkbox" className="nl-check" checked={isSelected} aria-label={selectionLabels.row(row)} onChange={() => toggleRow(k)} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} data-label={labelOf(c)} className={c.align === 'end' ? 'nl-cell--end' : undefined}>
                    {c.cell ? c.cell(row) : String(field(row, c.key) ?? '')}
                  </td>
                ))}
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Header checkbox: checked, unchecked or indeterminate (some visible rows selected). */
function SelectAll({ state, disabled, label, onChange }: { state: boolean | 'mixed'; disabled: boolean; label: string; onChange: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = state === 'mixed'; }, [state]);
  return <input ref={ref} type="checkbox" className="nl-check" checked={state === true} disabled={disabled} aria-label={label} onChange={onChange} />;
}
