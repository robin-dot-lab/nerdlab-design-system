# @robin-dot-lab/css-bento

## 1.0.0-rc.1

### Patch Changes

- e69a4dd: The mail screen as in the Bento mock-ups: cards are 28px tiles, the message list has 10px of padding, a selected message is a fill only, `ghost` + `tomato` is a discreet destructive action and square buttons are discs, `CopyField` is a borderless neutral pill with the value in the text face and a labelled Copy button, the active tab or segment is a white pill on a neutral rail, and the blocked-images notice holds on one line.

## 1.0.0-rc.0

### Major Changes

- 7dc1c16: New package: the **Bento** skin, a second look for the kit with exactly the same `nl-*` classes as `@robin-dot-lab/css-candy` (ADR-030). Import `@robin-dot-lab/css-bento/bento.css` instead of `candy.css`, and optionally `@robin-dot-lab/css-bento/fonts.css` (Outfit, Manrope and JetBrains Mono, with metric-matched fallback faces). Tonal tiles on a grey-green page, no outlines or hard shadows, a soft shadow on what floats only, pill buttons and fields, a 3:1 boundary on form controls, light and dark themes and `data-theme="auto"`. Bento has a single palette: `data-palette` has no effect under it.

### Patch Changes

- Updated dependencies [7dc1c16]
  - @robin-dot-lab/tokens@1.0.0-rc.2
