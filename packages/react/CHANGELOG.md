# @robin-dot-lab/react

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
