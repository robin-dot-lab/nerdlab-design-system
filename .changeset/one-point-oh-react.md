---
'@robin-dot-lab/react': major
---

1.0 release candidate: the public API is now stable and listed in `api-surface.txt`.

Breaking changes:

- **Language follows React Aria's locale.** The kit's words and formats come from the nearest `<I18nProvider locale="…">` (now re-exported, with `useLocale`), else the browser's language; French locales get French, every other locale English. The defaults were French before: wrap a French app in `<I18nProvider locale="fr-FR">`.
- Removed props: `Callout` `lang`, `Delta` `locale`, `DatePicker` `locale` (use `I18nProvider`). Label props (`closeLabel`, `labels`, `emptyLabel`, `selectionLabels`…) still override any word.
- Removed exports: the `cva` maps (`buttonVariants`, `badgeVariants`, `windowBarVariants`, `bentoVariants`, `stickerVariants`, `burstVariants`, `calloutVariants`, `avatarVariants`), `cn`, `meterLevel` and the `MeterLevel` type. They were implementation details.
- `Breadcrumb`, `Callout`, `Delta` and `Pagination` are now client components (they read the locale).

Fixes:

- Importing the package from a React Server Component no longer crashes: `Focusable` and the new `I18nProvider` / `useLocale` were re-exported straight from React Aria, which has no `'use client'`. `parseDate`, `today`, `getLocalTimeZone` and `CalendarDate` can now be called on the server.
