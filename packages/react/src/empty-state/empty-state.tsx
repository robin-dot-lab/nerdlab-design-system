import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Decorative icon or illustration (hidden from screen readers): the title carries the meaning. */
  icon?: ReactNode;
  /** What is empty, said plainly (“No messages yet”). */
  title: ReactNode;
  /** Why it is empty, or what will fill it. */
  description?: ReactNode;
  /** The way out: usually one `<Button>`. */
  action?: ReactNode;
  /** Level of the title heading. Default 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** What a list, a table or a page shows when there is nothing in it yet, and how to change that. */
export function EmptyState({ icon, title, description, action, headingLevel = 2, className, ...props }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={cn('nl-empty', className)} {...props}>
      {icon != null && <span className="nl-empty__icon" aria-hidden="true">{icon}</span>}
      <Heading className="nl-empty__title">{title}</Heading>
      {description != null && <p className="nl-empty__description">{description}</p>}
      {action != null && <div className="nl-empty__action">{action}</div>}
    </div>
  );
}
