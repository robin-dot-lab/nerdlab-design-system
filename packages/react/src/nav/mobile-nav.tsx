'use client';

import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

export interface MobileNavProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Accessible name of the toggle button. */
  label?: string;
  /** Show `label` next to the icon instead of only announcing it. */
  showLabel?: boolean;
  /** Links rendered in the panel. Activating one closes the panel. */
  children: ReactNode;
}

/**
 * Disclosure-pattern navigation for small screens: a toggle (aria-expanded / aria-controls)
 * and a panel. Closes on Escape (focus returns to the toggle), on link activation and when
 * the skin hides the toggle (desktop widths). The breakpoint lives in the skin's CSS only:
 * the component watches the toggle's visibility instead of duplicating it.
 */
export function MobileNav({ label: labelProp, showLabel = false, className, children, ...props }: MobileNavProps) {
  const { t } = useMessages();
  const label = labelProp ?? t.menu;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    // When the skin hides the toggle (display: none), its box collapses: close the panel.
    const toggle = toggleRef.current;
    const ro = typeof ResizeObserver === 'undefined' || !toggle ? null
      : new ResizeObserver(() => { if (toggle.offsetParent === null) setOpen(false); });
    if (toggle) ro?.observe(toggle);
    return () => { document.removeEventListener('keydown', onKey); ro?.disconnect(); };
  }, [open]);

  return (
    <div className={className} {...props}>
      <button
        ref={toggleRef}
        type="button"
        className="nl-nav-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={showLabel ? undefined : label}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nl-nav-toggle__icon" aria-hidden="true" />
        {showLabel && label}
      </button>
      <nav
        id={panelId}
        aria-label={label}
        className={cn('nl-nav-panel')}
        data-open={open}
        onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}
      >
        {children}
      </nav>
    </div>
  );
}
