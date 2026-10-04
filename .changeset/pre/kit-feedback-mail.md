---
'@robin-dot-lab/mail': minor
---

`EmailViewer`:

- offers only the parts the message has: no empty HTML tab for a text-only mail, no text tab for an HTML-only one;
- `remoteImages` and `onRemoteImagesChange` control the images: an app whose server strips remote images fetches the message again with them and passes the new HTML. Uncontrolled, “Show images” now also restores URLs parked in `data-blocked-src` / `data-blocked-srcset` (by a server that blocks images the same way), which showed broken before.
