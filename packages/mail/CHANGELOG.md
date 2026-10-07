# @robin-dot-lab/mail

## 1.0.0-rc.3

### Patch Changes

- 8e9e491: `AttachmentChip`: the link's accessible name now starts with the file name and size it shows (“ticket.pdf, 12.4 kB, download”, “ticket.pdf, 12,4 ko, télécharger”), and a space separates the two in its text, so voice-control users can say what they see (WCAG 2.5.3). axe-core 4.14 reported it (`label-content-name-mismatch`).

## 1.0.0-rc.2

### Minor Changes

- 0540be0: `EmailViewer`:
  
  - offers only the parts the message has: no empty HTML tab for a text-only mail, no text tab for an HTML-only one;
  - `remoteImages` and `onRemoteImagesChange` control the images: an app whose server strips remote images fetches the message again with them and passes the new HTML. Uncontrolled, “Show images” now also restores URLs parked in `data-blocked-src` / `data-blocked-srcset` (by a server that blocks images the same way), which showed broken before.

### Patch Changes

- Updated dependencies [0540be0]
  - @robin-dot-lab/react@1.0.0-rc.2

## 1.0.0-rc.1

### Major Changes

- 13b4c99: Joins the 1.0 release train with the rest of the kit: the mail components listed in `api-surface.txt` are the stable API from 1.0.0 on. No change in behaviour.

## 0.1.0-rc.0

### Minor Changes

- 745b117: New package `@robin-dot-lab/mail`: `MessageList` / `MessageListItem`, `MessageHeader`, `EmailViewer` (sandboxed iframe, injected CSP, remote images on request), `AttachmentChip` / `AttachmentList` and `AddressCard`. Its styles are in the skin (`mail.css`). `ExpiryIndicator` now calls `onStateChange` with the first known state too.

### Patch Changes

- Updated dependencies [ecbd469]
- Updated dependencies [76b8ce3]
- Updated dependencies [324a3f3]
- Updated dependencies [1ff58a3]
- Updated dependencies [b7ae9ad]
- Updated dependencies [a424d04]
- Updated dependencies [deb9a7c]
- Updated dependencies [bdfb231]
- Updated dependencies [745b117]
  - @robin-dot-lab/react@1.0.0-rc.1
  - @robin-dot-lab/icons@1.0.0-rc.1
