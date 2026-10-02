import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export type InfoListProps = ComponentProps<'dl'>;

function InfoListRoot({ className, ...props }: InfoListProps) {
  return <dl className={cn('nl-info', className)} {...props} />;
}

export interface InfoListItemProps {
  /** The label column (<dt>). */
  term: ReactNode;
  /** The value column (<dd>). */
  children: ReactNode;
}

function InfoListItem({ term, children }: InfoListItemProps) {
  return <><dt>{term}</dt><dd>{children}</dd></>;
}

/**
 * Two-column definition table, poster style: `<InfoList><InfoList.Item term="Lieu">…</InfoList.Item></InfoList>`.
 * Stacks label above value in a narrow container (breakpoint set by the skin).
 */
export const InfoList = Object.assign(InfoListRoot, { Item: InfoListItem });
