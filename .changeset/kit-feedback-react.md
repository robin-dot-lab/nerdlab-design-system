---
'@robin-dot-lab/react': minor
---

Fixes and additions from the mail platform's UI audit:

- New: `SiteHeader`, `SiteFooter` and `Band` for public pages (home, pricing, terms).
- New options: `Split align="start"` (panes keep their own height), `CopyField multiline` (the whole value, wrapping anywhere), `Meter showLabel` / `valueLabel` (the label and value as text, wired to the bar), `Topbar sticky={false}` and `truncateTitle`, `Bento outlined` (border and hard shadow like `Card`, content at the top).
- `AppShell` starts with a “Skip to content” link (in the locale) to its `<main>`, whose id is generated when none is given. `AppShell`, `Topbar` and `AuthLayout` are now client components.
- `SidebarItem` gives its label in full as a `title` when the ellipsis cuts it.
