export const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const eurCompact = (v: number) => new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(v) + ' €';
export const int = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
export const pct = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 }).format(v);
export const dShort = (d: Date) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '');
export const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
