import { useLocale } from '@robin-dot-lab/react';

/**
 * The charts’ words and number formats follow React Aria’s locale, like the rest of the kit (ADR-023): the nearest
 * `<I18nProvider locale="…">` (re-exported by @robin-dot-lab/react), else the browser's language.
 * French locales get French sentences and typography, every other locale English.
 */
const en = {
  noData: 'No data.',
  noSeries: 'No series selected.',
  ofTotal: 'of total',
  total: 'Total',
  showTable: 'Table view',
  showChart: 'Chart view',
  keyboardHint: (title: string, n: number) => `${title}, ${n} series. Left and right arrows move through the points.`,
  thousands: 'k',
  colon: ': ',
};
type Words = typeof en;
const fr: Words = {
  noData: 'Aucune donnée.',
  noSeries: 'Aucune série sélectionnée.',
  ofTotal: 'du total',
  total: 'Total',
  showTable: 'Vue table',
  showChart: 'Vue graphe',
  keyboardHint: (title, n) => `${title}, ${n} séries. Flèches gauche et droite pour parcourir les points.`,
  thousands: ' k',
  colon: ' : ',
};

export function useChartLocale() {
  const { locale } = useLocale();
  const t = locale.toLowerCase().startsWith('fr') ? fr : en;
  return { locale, t, percent: new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }) };
}
