'use client';

import { useMemo, useState, type Key, type ReactNode } from 'react';
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
  className?: string;
}

export interface DataTableSort { key: string; direction: SortDirection }

const field = (row: unknown, key: string) => (row as Record<string, unknown>)[key];
const labelOf = <T,>(c: DataTableColumn<T>) => c.label ?? (typeof c.header === 'string' ? c.header : c.key);

export function DataTable<T>({
  columns, rows, rowKey, caption, hideCaption = false, stack = true, framed = true,
  empty = 'Aucune donnée.', defaultSort, sort: sortProp, onSortChange, className,
}: DataTableProps<T>) {
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

  return (
    <div className={cn('nl-table-wrap', framed && 'nl-table-wrap--framed', className)}>
      <table className={cn('nl-table', stack && 'nl-table--stack')}>
        <caption className={hideCaption ? 'nl-visually-hidden' : undefined}>{caption}</caption>
        <thead>
          <tr>
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
            <tr><td className="nl-table__empty" colSpan={columns.length}>{empty}</td></tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={rowKey(row, i)}>
                {columns.map((c) => (
                  <td key={c.key} data-label={labelOf(c)} className={c.align === 'end' ? 'nl-cell--end' : undefined}>
                    {c.cell ? c.cell(row) : String(field(row, c.key) ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
