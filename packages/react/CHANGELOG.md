# @robin-dot-lab/react

## 1.0.0-rc.1

### Minor Changes

- ecbd469: Application frame: `AppShell`, `Sidebar` / `SidebarSection` / `SidebarItem` (current page, counters, collapsed mode with tooltips), `Topbar` and `AuthLayout`. The breakpoint stays in the skin; below it the top bar's `MobileNav` takes over.
- 76b8ce3: `CodeBlock` (monospace `<pre><code>` in a named, focusable scroll region, optional wrapping, built-in copy) and `Banner` (a persistent, dismissible site-wide message, distinct from `Callout` and `Toast`).
- 324a3f3: Feedback: `Spinner`, `Button loading` (`aria-busy` and `aria-disabled`, same name and focus, still under reduced motion), `EmptyState`, and `CopyButton` / `CopyField` (clipboard copy with a check mark and a polite announcement; a failed copy is said and the text selected).
- b7ae9ad: `PasswordInput` (show/hide toggle in `aria-pressed` with a stable name, optional strength said in words) and `InputGroup` / `InputAddon` (text or control addons; the input keeps its `Field`'s name, a control in an addon names itself).
- a424d04: `OTPInput` (one-time code in N cells: paste or autofill fills them all, keyboard navigation, a group named by its `Field`, each cell says its position) and `Kbd` (`<kbd>`, nestable for combinations). `Field` now gives its label an id, so a group control can be named by it.
- deb9a7c: `QRCode`: an SVG QR code of a string, with the text as its equivalent; dark modules on a light square in every theme and palette. Encoding by `uqr` (MIT, no dependencies), now a dependency of `@robin-dot-lab/react`.
- bdfb231: Time and status: `RelativeTime` (Intl wording in React Aria's locale, refreshed on its own, `<time datetime>`, absolute date in a tooltip, no hydration mismatch), `ExpiryIndicator` (text or `Meter` bar; normal, expiring soon and expired said in words, a change of state announced once) and `StatusDot` (a dot always with words, optional pulse still under reduced motion).
- 745b117: New package `@robin-dot-lab/mail`: `MessageList` / `MessageListItem`, `MessageHeader`, `EmailViewer` (sandboxed iframe, injected CSP, remote images on request), `AttachmentChip` / `AttachmentList` and `AddressCard`. Its styles are in the skin (`mail.css`). `ExpiryIndicator` now calls `onStateChange` with the first known state too.

### Patch Changes

- Updated dependencies [1ff58a3]
  - @robin-dot-lab/icons@1.0.0-rc.1

## 1.0.0-rc.0

### Major Changes

- ace30e8: 1.0 release candidate: the public API is now stable and listed in `api-surface.txt`.
  
  Breaking changes:
  
  - **Language follows React Aria's locale.** The kit's words and formats come from the nearest `<I18nProvider locale="…">` (now re-exported, with `useLocale`), else the browser's language; French locales get French, every other locale English. The defaults were French before: wrap a French app in `<I18nProvider locale="fr-FR">`.
  - Removed props: `Callout` `lang`, `Delta` `locale`, `DatePicker` `locale` (use `I18nProvider`). Label props (`closeLabel`, `labels`, `emptyLabel`, `selectionLabels`…) still override any word.
  - Removed exports: the `cva` maps (`buttonVariants`, `badgeVariants`, `windowBarVariants`, `bentoVariants`, `stickerVariants`, `burstVariants`, `calloutVariants`, `avatarVariants`), `cn`, `meterLevel` and the `MeterLevel` type. They were implementation details.
  - `Breadcrumb`, `Callout`, `Delta` and `Pagination` are now client components (they read the locale).
  
  Fixes:
  
  - Importing the package from a React Server Component no longer crashes: `Focusable` and the new `I18nProvider` / `useLocale` were re-exported straight from React Aria, which has no `'use client'`. `parseDate`, `today`, `getLocalTimeZone` and `CalendarDate` can now be called on the server.

### Patch Changes

- Updated dependencies [ace30e8]
  - @robin-dot-lab/icons@1.0.0-rc.0

## 0.2.1

### Patch Changes

- bf353fe: README: installation steps that work with pnpm 11 (the token goes in the user-level `~/.npmrc`; how to ask for a version published less than a day ago).
- Updated dependencies [bf353fe]
  - @robin-dot-lab/icons@0.1.1

## 0.2.0

### Minor Changes

- 75904b7: New components: `Breadcrumb`, `Avatar` and `AvatarGroup`, `Skeleton`, `Drawer` and `DrawerFooter`, `ComboBox` and `ComboBoxItem`, `DatePicker` (with `parseDate`, `today`, `getLocalTimeZone` and `CalendarDate` re-exported). `DataTable` gets row selection (`selectable`, `selectedKeys`, `onSelectionChange`, `selectionLabels`). `TooltipTrigger` now wraps its trigger in `Focusable` itself; an explicit `<Focusable>` keeps working.

### Patch Changes

- d6a72ef: Pictograms are now the icons of `@robin-dot-lab/icons` instead of text characters: pagination arrows, toast tick, delta arrows, ribbon play/pause, callout marks, dialog and drawer close, search magnifier. In the skin, the checkbox tick, the accordion +/− and the table sort arrows use the same drawings as CSS masks, so they still work without React.
