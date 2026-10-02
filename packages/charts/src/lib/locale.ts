/**
 * The charts speak French by default (the kit's first consumer is French) and English for any other
 * locale. `locale` drives number formats, the punctuation before a colon, and the few built-in sentences.
 */
export const DEFAULT_LOCALE = 'fr-FR';
export const isFrench = (locale: string) => locale.toLowerCase().startsWith('fr');
/** "Lyon : 42" in French typography, "Lyon: 42" otherwise. */
export const colon = (locale: string) => (isFrench(locale) ? ' : ' : ': ');
export const percent = (locale: string) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
