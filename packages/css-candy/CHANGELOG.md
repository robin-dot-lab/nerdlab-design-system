# @robin-dot-lab/css-candy

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
