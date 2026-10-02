import { Children, cloneElement, isValidElement, useId, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface AccordionProps extends ComponentProps<'div'> {
  /** Only one item open at a time (native `<details name>` grouping). */
  exclusive?: boolean;
}

/** Native <details>/<summary> accordion: keyboard and screen-reader support come from the browser, no JS. */
export function Accordion({ exclusive = false, className, children, ...props }: AccordionProps) {
  const group = useId();
  const items = exclusive
    ? Children.map(children, (child) => (isValidElement<AccordionItemProps>(child) ? cloneElement(child as ReactElement<AccordionItemProps>, { name: child.props.name ?? group }) : child))
    : children;
  return <div className={cn('nl-accordion', className)} {...props}>{items}</div>;
}

export interface AccordionItemProps extends Omit<ComponentProps<'details'>, 'title'> {
  title: ReactNode;
}

export function AccordionItem({ title, children, ...props }: AccordionItemProps) {
  return (
    <details {...props}>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
