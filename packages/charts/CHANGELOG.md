# @robin-dot-lab/charts

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
