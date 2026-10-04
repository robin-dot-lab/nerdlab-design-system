# @robin-dot-lab/react

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
