import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface AppShellProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Usually a `<Sidebar>`. Shown as a column from the skin's large breakpoint, hidden below it. */
  sidebar?: ReactNode;
  /** Usually a `<Topbar>`, sticky at the top of the main column. Below the breakpoint, its `mobileNav` takes over the navigation. */
  topbar?: ReactNode;
  /** Page content, rendered in `<main>`. */
  children: ReactNode;
  /** Props for the `<main>` element (an `id` for a skip link, for example). */
  mainProps?: ComponentProps<'main'>;
}

/**
 * Application frame: sidebar, top bar and content. The breakpoint lives in the skin only, as for `MobileNav`:
 * nothing here measures the screen.
 */
export function AppShell({ sidebar, topbar, children, mainProps, className, ...props }: AppShellProps) {
  return (
    <div className={cn('nl-app-shell', className)} {...props}>
      {sidebar != null && <div className="nl-app-shell__sidebar">{sidebar}</div>}
      <div className="nl-app-shell__main">
        {topbar}
        <main {...mainProps} className={cn('nl-app-shell__content', mainProps?.className)}>{children}</main>
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
}

/** Top bar of an application page: title, actions and user menu, plus the small-screen navigation. */
export function Topbar({ title, actions, user, mobileNav, className, ...props }: TopbarProps) {
  return (
    <header className={cn('nl-topbar', className)} {...props}>
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
