---
'@robin-dot-lab/charts': major
---

1.0 release candidate. Breaking: the `locale` prop is removed from `LineChart`, `BarList`, `ShareBar` and `Heatmap`; number formats and built-in sentences follow React Aria's locale (`<I18nProvider>` from `@robin-dot-lab/react`), English unless the locale is French. `ChartCard`'s toggle labels follow it too.
