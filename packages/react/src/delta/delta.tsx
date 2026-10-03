import { ArrowDown, ArrowUp } from '@robin-dot-lab/icons';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export interface DeltaProps extends Omit<ComponentProps<'span'>, 'children'> {
  current: number;
  previous: number;
  /** Whether an increase is good news (revenue) or bad news (churn). Default true. */
  upIsGood?: boolean;
  locale?: string;
  /** Words announced to assistive tech. Defaults are French, like the rest of the library. */
  labels?: { up: string; down: string };
}

/** Signed change vs a previous period. Colour = direction × `upIsGood`; announced in words, not by colour. */
export function Delta({ current, previous, upIsGood = true, locale = 'fr-FR', labels = { up: 'Hausse de', down: 'Baisse de' }, className, ...props }: DeltaProps) {
  const ratio = previous ? (current - previous) / previous : 0;
  const up = ratio >= 0;
  const fmt = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
  return (
    <span className={cn('nl-delta', up === upIsGood ? 'nl-delta--good' : 'nl-delta--bad', className)} {...props}>
      <span aria-hidden="true">{up ? <ArrowUp size="sm" /> : <ArrowDown size="sm" />} {up ? '+' : '−'}{fmt.format(Math.abs(ratio))}</span>
      {/* aria-label is not allowed on a role-less span: the words go in hidden text instead */}
      <span className="nl-visually-hidden">{`${up ? labels.up : labels.down} ${fmt.format(Math.abs(ratio))}`}</span>
    </span>
  );
}
