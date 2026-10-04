import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface SiteHeaderProps extends Omit<ComponentProps<'header'>, 'children'> {
  /** Logo or site name, usually a link to the home page. */
  brand: ReactNode;
  /** The main links, one `<a>` (or router link) per entry; a list is built around them. */
  nav?: ReactNode[];
  /** Accessible name of the inline navigation. */
  navLabel?: string;
  /** Calls to action on the right (sign in, sign up). */
  actions?: ReactNode;
  /** A `<MobileNav>` with the same links: below the large breakpoint it replaces the inline links. */
  mobileNav?: ReactNode;
  /** Stick to the top while scrolling (default false; never on a short viewport). */
  sticky?: boolean;
}

/** Header of a public page (home, pricing, terms): brand, links and calls to action, inside the content width. */
export function SiteHeader({ brand, nav, navLabel, actions, mobileNav, sticky = false, className, ...props }: SiteHeaderProps) {
  const links = nav ?? [];
  return (
    <header className={cn('nl-site-header', sticky && 'nl-site-header--sticky', mobileNav != null && 'nl-site-header--has-mobile-nav', className)} {...props}>
      <div className="nl-container nl-site-header__inner">
        <div className="nl-site-header__brand">{brand}</div>
        {links.length > 0 && (
          <nav className="nl-site-header__nav" aria-label={navLabel}>
            <ul>{links.map((link, i) => <li key={i}>{link}</li>)}</ul>
          </nav>
        )}
        {actions != null && <div className="nl-site-header__actions">{actions}</div>}
        {mobileNav != null && <div className="nl-site-header__mobile-nav">{mobileNav}</div>}
      </div>
    </header>
  );
}

export interface SiteFooterProps extends ComponentProps<'footer'> {
  /** Small print under the content (copyright, legal links). */
  legal?: ReactNode;
}

/** Footer of a public page: ink background, cream text, inside the content width. */
export function SiteFooter({ legal, className, children, ...props }: SiteFooterProps) {
  return (
    <footer className={cn('nl-site-footer', className)} {...props}>
      <div className="nl-container nl-site-footer__inner">
        {children}
        {legal != null && <div className="nl-site-footer__legal">{legal}</div>}
      </div>
    </footer>
  );
}

const bandVariants = cva('nl-band', {
  variants: {
    tone: { background: '', surface: 'nl-band--surface', paper: 'nl-band--paper', accent: 'nl-band--accent', primary: 'nl-band--primary', ink: 'nl-band--ink' },
  },
  defaultVariants: { tone: 'background' },
});

export interface BandProps extends ComponentProps<'section'>, VariantProps<typeof bandVariants> {
  /** Render the single child (a `<div>`, an `<aside>`) with the band's styles instead of a `<section>`. */
  asChild?: boolean;
}

/**
 * A full-width band of a public page (a hero, a feature row, a final call), lower than `Section` and
 * closed by an ink rule. Put a `<Container>` inside. Text on candy and ink tones is set by the skin.
 */
export function Band({ tone, asChild = false, className, ...props }: BandProps) {
  const Comp = asChild ? Slot : 'section';
  return <Comp className={cn(bandVariants({ tone }), className)} {...props} />;
}
