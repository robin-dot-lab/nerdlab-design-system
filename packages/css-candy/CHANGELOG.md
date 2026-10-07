# @robin-dot-lab/css-candy

## 1.0.0-rc.3

### Minor Changes

- 7dc1c16: New modifier `.nl-btn--arrow`: a round companion disc with an arrow right after a button, drawn by the button itself (one target, one accessible name). Pass it in `className`; the Bento skin has the same class.

### Patch Changes

- Updated dependencies [7dc1c16]
  - @robin-dot-lab/tokens@1.0.0-rc.2

## 1.0.0-rc.2

### Minor Changes

- 0540be0: Fixes and additions from the mail platform's UI audit:
  
  - `Stack` keeps its rows at the top when stretched, and its children lose the browser's margins: the gap is the only spacing. `MessageHeader` keeps its rows at the top.
  - Attachment chips never widen the page (long names wrap); sidebar labels are cut by their ellipsis instead of widening the sidebar.
  - The MobileNav panel keeps the case of its links, marks the current page, and inside a `Topbar` opens right under the bar whatever its height; the top bar stops sticking on short viewports.
  - New classes: `.nl-break-anywhere`, `.nl-display--sm…xl` and `.nl-headline--sm…xl` (fluid sizes), `.nl-bento--outlined`, `.nl-split--start`, the site header, footer and bands, the skip link.
  - Accordion questions in the body font; `AuthLayout` footer links at least 24px high; a tilted sticker keeps room for its shadow in a row; the email frame is capped in `svh`.
  - `fonts.css` adds metric-matched fallback faces, so the page no longer shifts when the web fonts arrive.

### Patch Changes

- Updated dependencies [0540be0]
  - @robin-dot-lab/tokens@1.0.0-rc.1

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

## 1.0.0-rc.0

### Major Changes

- ace30e8: 1.0 release candidate: the `nl-*` classes listed in `api-surface.txt` are the stable API. New: forced-colours support (Windows high contrast): icon-mask marks, chart marks, selected states and focus rings stay visible.

### Patch Changes

- Updated dependencies [ace30e8]
  - @robin-dot-lab/tokens@1.0.0-rc.0

## 0.3.0

### Minor Changes

- bf353fe: `data-theme="auto"` follows the device's light/dark setting, live, in every palette (`data-theme="light"` stays the default, `"dark"` forces dark). An explicit `data-theme="light"` container still wins inside a dark or automatic page.

### Patch Changes

- Updated dependencies [bf353fe]
  - @robin-dot-lab/tokens@0.3.0

## 0.2.0

### Minor Changes

- 75904b7: New `--color-overlay` token for the scrim behind dialogs and drawers, much deeper in the dark theme where the old ink-based scrim was barely visible. Skin classes for icons, drawer, breadcrumb, avatar, skeleton, combobox and list box, date picker and calendar, table row selection, and the indeterminate checkbox.
- 5b84565: Seven colour palettes, each with a light and a dark theme: Candy (default), Sorbet, Ink, Terracotta, Slate, Moss and Mono Retro. Select one with `data-palette="…"` on `<html>` or on any container; `@robin-dot-lab/tokens/palettes.json` lists them. Every palette is checked at build time: text 4.5:1 on every background and fill, lines and focus rings 3:1, adjacent chart colours distinct with normal vision and under protanopia, deuteranopia and tritanopia. The tomato button hover and the search placeholder now derive from tokens so they follow the palette.

### Patch Changes

- d6a72ef: Pictograms are now the icons of `@robin-dot-lab/icons` instead of text characters: pagination arrows, toast tick, delta arrows, ribbon play/pause, callout marks, dialog and drawer close, search magnifier. In the skin, the checkbox tick, the accordion +/− and the table sort arrows use the same drawings as CSS masks, so they still work without React.
- Updated dependencies [75904b7]
- Updated dependencies [5b84565]
  - @robin-dot-lab/tokens@0.2.0
