# @robin-dot-lab/css-bento

## 1.0.0-rc.0

### Major Changes

- 7dc1c16: New package: the **Bento** skin, a second look for the kit with exactly the same `nl-*` classes as `@robin-dot-lab/css-candy` (ADR-030). Import `@robin-dot-lab/css-bento/bento.css` instead of `candy.css`, and optionally `@robin-dot-lab/css-bento/fonts.css` (Outfit, Manrope and JetBrains Mono, with metric-matched fallback faces). Tonal tiles on a grey-green page, no outlines or hard shadows, a soft shadow on what floats only, pill buttons and fields, a 3:1 boundary on form controls, light and dark themes and `data-theme="auto"`. Bento has a single palette: `data-palette` has no effect under it.

### Patch Changes

- Updated dependencies [7dc1c16]
  - @robin-dot-lab/tokens@1.0.0-rc.2
