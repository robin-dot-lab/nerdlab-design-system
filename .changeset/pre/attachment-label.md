---
'@robin-dot-lab/mail': patch
---

`AttachmentChip`: the link's accessible name now starts with the file name and size it shows (“ticket.pdf, 12.4 kB, download”, “ticket.pdf, 12,4 ko, télécharger”), and a space separates the two in its text, so voice-control users can say what they see (WCAG 2.5.3). axe-core 4.14 reported it (`label-content-name-mismatch`).
