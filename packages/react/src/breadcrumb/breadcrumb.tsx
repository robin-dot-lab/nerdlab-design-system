'use client';

import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

export interface BreadcrumbItem {
  label: ReactNode;
  /** Omit on the current page (the last item). */
  href?: string;
}

export interface BreadcrumbProps extends Omit<ComponentProps<'nav'>, 'children'> {
  items: readonly BreadcrumbItem[];
  /** Accessible name of the navigation landmark. */
  label?: string;
}

/**
 * Where the page sits in the site: a <nav> landmark with an ordered list of links, the current page
 * last with aria-current="page". Separators are drawn by CSS and not read out.
 */
export function Breadcrumb({ items, label, className, ...props }: BreadcrumbProps) {
  const { t } = useMessages();
  return (
    <nav aria-label={label ?? t.breadcrumb} className={cn('nl-breadcrumb', className)} {...props}>
      <ol>
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={i}>
              {item.href && !current ? <a href={item.href}>{item.label}</a> : <span aria-current={current ? 'page' : undefined}>{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
