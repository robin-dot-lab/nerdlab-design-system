'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

export interface AppShellProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Usually a `<Sidebar>`. Shown as a column from the skin's large breakpoint, hidden below it. */
  sidebar?: ReactNode;
  /** Usually a `<Topbar>`, sticky at the top of the main column. Below the breakpoint, its `mobileNav` takes over the navigation. */
  topbar?: ReactNode;
  /** Page content, rendered in `<main>`. */
  children: ReactNode;
  /** Props for the `<main>` element. Its `id` (generated if absent) is the target of the skip link. */
  mainProps?: ComponentProps<'main'>;
  /** Text of the “Skip to content” link, visible on focus. Default: the active locale's. */
  skipLabel?: string;
}

/**
 * Application frame: sidebar, top bar and content. The breakpoint lives in the skin only, as for `MobileNav`:
 * nothing here measures the screen.
 */
export function AppShell({ sidebar, topbar, children, mainProps, skipLabel, className, ...props }: AppShellProps) {
  const { t } = useMessages();
  const generated = useId();
  const mainId = mainProps?.id ?? `${generated}-main`;
  return (
    <div className={cn('nl-app-shell', className)} {...props}>
      {/* First tab stop of the page: past the sidebar and the top bar, straight to the content (WCAG 2.4.1). */}
      <a className="nl-skip-link" href={`#${mainId}`}>{skipLabel ?? t.skipToContent}</a>
      {sidebar != null && <div className="nl-app-shell__sidebar">{sidebar}</div>}
      <div className="nl-app-shell__main">
        {topbar}
        <main tabIndex={-1} {...mainProps} id={mainId} className={cn('nl-app-shell__content', mainProps?.className)}>{children}</main>
      </div>
    </div>
  );
}

export interface TopbarProps extends Omit<ComponentProps<'header'>, 'title'> {
  /** Page title or breadcrumb (put the page's `<h1>` here). */
  title?: ReactNode;
  /** Actions for the page (buttons, a `MenuTrigger`). */
  actions?: ReactNode;
  /** The user menu: an `<Avatar>` inside a `MenuTrigger`. */
  user?: ReactNode;
  /** A `<MobileNav>` repeating the sidebar's links; the skin shows it below the large breakpoint only. */
  mobileNav?: ReactNode;
  /**
   * Stick to the top of the viewport while scrolling (default true). The skin stops sticking anyway
   * when the viewport is short (landscape phone, high zoom). False for a public page's header.
   */
  sticky?: boolean;
  /** Keep the title on one line, cut by an ellipsis: give the heading a `title` with its full text. */
  truncateTitle?: boolean;
}

/**
 * Top bar of an application page: title, actions and user menu, plus the small-screen navigation.
 * The `MobileNav` panel opens right under the bar, whatever the bar's height.
 */
export function Topbar({ title, actions, user, mobileNav, sticky = true, truncateTitle = false, className, ...props }: TopbarProps) {
  return (
    <header className={cn('nl-topbar', !sticky && 'nl-topbar--static', truncateTitle && 'nl-topbar--truncate', className)} {...props}>
      {mobileNav != null && <div className="nl-topbar__mobile-nav">{mobileNav}</div>}
      <div className="nl-topbar__title">{title}</div>
      {actions != null && <div className="nl-topbar__actions">{actions}</div>}
      {user != null && <div className="nl-topbar__user">{user}</div>}
    </header>
  );
}

export interface AuthLayoutProps extends Omit<ComponentProps<'main'>, 'title'> {
  /** Brand mark above the card. */
  logo?: ReactNode;
  /** Title of the card, rendered as the page's `<h1>`. */
  title: ReactNode;
  /** One line under the title. */
  description?: ReactNode;
  /** Secondary links under the card (“Already have an account? Sign in”). */
  footer?: ReactNode;
  /** The form. */
  children: ReactNode;
}

/** Centred page for sign-up, sign-in and password reset: logo, a card holding the form, secondary links. */
export function AuthLayout({ logo, title, description, footer, children, className, ...props }: AuthLayoutProps) {
  return (
    <main className={cn('nl-auth', className)} {...props}>
      {logo != null && <div className="nl-auth__logo">{logo}</div>}
      <div className="nl-card nl-auth__card">
        <h1 className="nl-auth__title">{title}</h1>
        {description != null && <p className="nl-auth__description">{description}</p>}
        {children}
      </div>
      {footer != null && <div className="nl-auth__footer">{footer}</div>}
    </main>
  );
}
