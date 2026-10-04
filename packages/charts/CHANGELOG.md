# @robin-dot-lab/charts

## 1.0.0-rc.1

### Patch Changes

- Updated dependencies [ecbd469]
- Updated dependencies [76b8ce3]
- Updated dependencies [324a3f3]
- Updated dependencies [b7ae9ad]
- Updated dependencies [a424d04]
- Updated dependencies [deb9a7c]
- Updated dependencies [bdfb231]
- Updated dependencies [745b117]
  - @robin-dot-lab/react@1.0.0-rc.1

## 1.0.0-rc.0

### Major Changes

- ace30e8: 1.0 release candidate. Breaking: the `locale` prop is removed from `LineChart`, `BarList`, `ShareBar` and `Heatmap`; number formats and built-in sentences follow React Aria's locale (`<I18nProvider>` from `@robin-dot-lab/react`), English unless the locale is French. `ChartCard`'s toggle labels follow it too.

### Patch Changes

- Updated dependencies [ace30e8]
  - @robin-dot-lab/react@1.0.0-rc.0

## 0.1.3

### Patch Changes

- bf353fe: `ShareBar` re-reads its label colours when the palette changes and when the device switches scheme, not only on `data-theme` changes.
- Updated dependencies [bf353fe]
  - @robin-dot-lab/react@0.2.1

## 0.1.2

### Patch Changes

- Updated dependencies [75904b7]
- Updated dependencies [d6a72ef]
  - @robin-dot-lab/react@0.2.0

## 0.1.1

### Patch Changes

- b4477de: `ShareBar` measures its segment labels again once web fonts have loaded, so a percentage is no longer dropped (or left overflowing) when the first render happened before the fonts arrived.
