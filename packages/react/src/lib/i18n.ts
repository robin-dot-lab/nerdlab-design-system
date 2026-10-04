'use client';

import { useLocale } from 'react-aria-components';

/**
 * The library's own words. Language and number formats follow React Aria's locale: the nearest
 * `<I18nProvider locale="…">`, else the browser's language. French locales get French, every other
 * locale English. Each component still takes props to replace any of these words.
 */
const en = {
  close: 'Close',
  menu: 'Menu',
  pagination: 'Pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (n: number) => `Page ${n}`,
  breadcrumb: 'Breadcrumb',
  up: 'Up',
  down: 'Down',
  noResults: 'No results.',
  noData: 'No data.',
  selectAllRows: 'Select all visible rows',
  selectRow: 'Select row',
  selection: 'Selection',
  pauseScrolling: 'Pause scrolling',
  resumeScrolling: 'Resume scrolling',
  tone: { info: 'Info', success: 'Success', warning: 'Warning', error: 'Error' },
  showPassword: 'Show password',
  passwordStrength: 'Password strength',
  strength: ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'] as readonly string[],
  /** Punctuation before a value: "Warning: " / « Attention : ». */
  colon: ': ',
};

export type Messages = typeof en;

const fr: Messages = {
  close: 'Fermer',
  menu: 'Menu',
  pagination: 'Pagination',
  previousPage: 'Page précédente',
  nextPage: 'Page suivante',
  page: (n) => `Page ${n}`,
  breadcrumb: 'Fil d’Ariane',
  up: 'Hausse de',
  down: 'Baisse de',
  noResults: 'Aucun résultat.',
  noData: 'Aucune donnée.',
  selectAllRows: 'Sélectionner toutes les lignes affichées',
  selectRow: 'Sélectionner la ligne',
  selection: 'Sélection',
  pauseScrolling: 'Mettre en pause le défilement',
  resumeScrolling: 'Reprendre le défilement',
  tone: { info: 'Information', success: 'Succès', warning: 'Attention', error: 'Erreur' },
  showPassword: 'Afficher le mot de passe',
  passwordStrength: 'Robustesse du mot de passe',
  strength: ['Très faible', 'Faible', 'Moyen', 'Bon', 'Robuste'],
  colon: ' : ',
};

export const isFrench = (locale: string) => locale.toLowerCase().startsWith('fr');

/** The active locale and the words for it. */
export function useMessages(): { locale: string; t: Messages } {
  const { locale } = useLocale();
  return { locale, t: isFrench(locale) ? fr : en };
}
