---
'@robin-dot-lab/css-candy': minor
---

Fixes and additions from the mail platform's UI audit:

- `Stack` keeps its rows at the top when stretched, and its children lose the browser's margins: the gap is the only spacing. `MessageHeader` keeps its rows at the top.
- Attachment chips never widen the page (long names wrap); sidebar labels are cut by their ellipsis instead of widening the sidebar.
- The MobileNav panel keeps the case of its links, marks the current page, and inside a `Topbar` opens right under the bar whatever its height; the top bar stops sticking on short viewports.
- New classes: `.nl-break-anywhere`, `.nl-display--sm…xl` and `.nl-headline--sm…xl` (fluid sizes), `.nl-bento--outlined`, `.nl-split--start`, the site header, footer and bands, the skip link.
- Accordion questions in the body font; `AuthLayout` footer links at least 24px high; a tilted sticker keeps room for its shadow in a row; the email frame is capped in `svh`.
- `fonts.css` adds metric-matched fallback faces, so the page no longer shifts when the web fonts arrive.
