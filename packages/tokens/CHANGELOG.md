# @robin-dot-lab/tokens

## 1.0.0-rc.2

### Minor Changes

- 7dc1c16: Bento tokens next to Candy's: `@robin-dot-lab/tokens/bento.css`, `@robin-dot-lab/tokens/bento` (JS) and `@robin-dot-lab/tokens/bento.json`, with exactly the same variable names as Candy and their own values (ADR-030). Contrast and colour-blind-safe chart colours are checked in both themes at build time.

## 1.0.0-rc.1

### Patch Changes

- 0540be0: The font stacks name the metric-matched fallback faces of `@robin-dot-lab/css-candy/fonts.css` right after each web font. Without `fonts.css` the names are simply skipped.

## 1.0.0-rc.0

### Major Changes

- ace30e8: 1.0 release candidate: the CSS variables and palette ids listed in `api-surface.txt` are the stable API. No change in values.

## 0.3.0

### Minor Changes

- bf353fe: `data-theme="auto"` follows the device's light/dark setting, live, in every palette (`data-theme="light"` stays the default, `"dark"` forces dark). An explicit `data-theme="light"` container still wins inside a dark or automatic page.

## 0.2.0

### Minor Changes

- 75904b7: New `--color-overlay` token for the scrim behind dialogs and drawers, much deeper in the dark theme where the old ink-based scrim was barely visible. Skin classes for icons, drawer, breadcrumb, avatar, skeleton, combobox and list box, date picker and calendar, table row selection, and the indeterminate checkbox.
- 5b84565: Seven colour palettes, each with a light and a dark theme: Candy (default), Sorbet, Ink, Terracotta, Slate, Moss and Mono Retro. Select one with `data-palette="…"` on `<html>` or on any container; `@robin-dot-lab/tokens/palettes.json` lists them. Every palette is checked at build time: text 4.5:1 on every background and fill, lines and focus rings 3:1, adjacent chart colours distinct with normal vision and under protanopia, deuteranopia and tritanopia. The tomato button hover and the search placeholder now derive from tokens so they follow the palette.
