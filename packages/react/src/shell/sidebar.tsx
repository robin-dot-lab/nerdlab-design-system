'use client';

import { PanelLeft } from '@robin-dot-lab/icons';
import { cloneElement, createContext, isValidElement, useContext, useId, useState, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { Badge } from '../badge/badge.js';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';
import { Tooltip, TooltipTrigger } from '../tooltip/tooltip.js';

const Collapsed = createContext(false);

export interface SidebarProps extends Omit<ComponentProps<'aside'>, 'children'> {
  /** Accessible name of the navigation landmark (“Main navigation”). */
  label: string;
  /** Brand or account switcher above the navigation. Clipped to the rail when collapsed: pass a compact mark then. */
  header?: ReactNode;
  /** Content pinned under the navigation (settings, theme switch). */
  footer?: ReactNode;
  /** Icons only: labels are hidden on screen (still read by screen readers) and shown in a tooltip. Controlled. */
  collapsed?: boolean;
  /** Initial state when uncontrolled. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show the collapse toggle (`aria-pressed`, named “Collapse sidebar”). */
  collapsible?: boolean;
  /** `SidebarSection`s, or `SidebarItem`s inside a `<ul>`. */
  children: ReactNode;
}

/**
 * Vertical application navigation (an `<aside>` holding a named `<nav>`) with named sections, counters and the current page (`aria-current="page"`).
 * Optionally collapses to icons. Place it in `AppShell`'s `sidebar` slot; below the large breakpoint the skin
 * hides it, and the links go in the `Topbar`'s `MobileNav`.
 */
export function Sidebar({
  label, header, footer, collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, collapsible = false,
  className, children, ...props
}: SidebarProps) {
  const { t } = useMessages();
  const [own, setOwn] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? own;
  const toggle = () => { setOwn(!collapsed); onCollapsedChange?.(!collapsed); };
  return (
    <aside className={cn('nl-sidebar', collapsed && 'nl-sidebar--collapsed', className)} {...props}>
      {header != null && <div className="nl-sidebar__header">{header}</div>}
      <Collapsed.Provider value={collapsed}>
        <nav aria-label={label} className="nl-sidebar__nav">{children}</nav>
      </Collapsed.Provider>
      {(footer != null || collapsible) && (
        <div className="nl-sidebar__footer">
          {footer}
          {collapsible && (
            <button type="button" className="nl-sidebar__toggle" aria-pressed={collapsed} aria-label={t.collapseSidebar} onClick={toggle}>
              <PanelLeft />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

export interface SidebarSectionProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Section name, shown as a heading and naming the list. Hidden on screen when the sidebar is collapsed. */
  title?: ReactNode;
  /** `SidebarItem`s. */
  children: ReactNode;
}

/** A named group of links. */
export function SidebarSection({ title, className, children, ...props }: SidebarSectionProps) {
  const id = useId();
  return (
    <div className={cn('nl-sidebar__section', className)} {...props}>
      {title != null && <h2 id={id} className="nl-sidebar__heading">{title}</h2>}
      <ul className="nl-sidebar__list" aria-labelledby={title != null ? id : undefined}>{children}</ul>
    </div>
  );
}

export interface SidebarItemProps extends Omit<ComponentProps<'a'>, 'children'> {
  /** Decorative icon; required in practice for the collapsed sidebar. */
  icon?: ReactNode;
  /** The current page: sets `aria-current="page"`. */
  current?: boolean;
  /** Counter shown in a `Badge` (unread messages…). Hidden when 0 or undefined. */
  count?: number;
  /** Words read instead of the bare number (“3 unread”). */
  countLabel?: string;
  /** Render the single child (a router `Link`) as the item, with the icon, label and counter placed inside it. */
  asChild?: boolean;
  /** The label (or, with `asChild`, the link element whose children are the label). */
  children: ReactNode;
}

/** A link of the sidebar. Collapsed, the label stays the link's name and appears in a tooltip. */
export function SidebarItem({ icon, current = false, count, countLabel, asChild = false, className, children, ...props }: SidebarItemProps) {
  const collapsed = useContext(Collapsed);
  const child = asChild && isValidElement(children) ? (children as ReactElement<{ children?: ReactNode; className?: string }>) : null;
  const label = child ? child.props.children : children;
  const content = (
    <>
      {icon != null && <span className="nl-sidebar__icon" aria-hidden="true">{icon}</span>}
      <span className="nl-sidebar__label">{label}</span>
      {count ? (
        <>
          <Badge variant="primary" className="nl-sidebar__count" aria-hidden={countLabel ? true : undefined}>{count}</Badge>
          {countLabel && <span className="nl-visually-hidden">{countLabel}</span>}
        </>
      ) : null}
    </>
  );
  const link = child
    ? cloneElement(child, { ...props, className: cn('nl-sidebar__item', className, child.props.className), 'aria-current': current ? 'page' : undefined, children: content } as Record<string, unknown>)
    : <a className={cn('nl-sidebar__item', className)} aria-current={current ? 'page' : undefined} {...props}>{content}</a>;
  return (
    <li>
      {collapsed
        ? <TooltipTrigger delay={0}>{link}<Tooltip placement="end">{label}</Tooltip></TooltipTrigger>
        : link}
    </li>
  );
}
