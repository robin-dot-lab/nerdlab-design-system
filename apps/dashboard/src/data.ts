// Seeded, deterministic data model — ported from design-system-nerdlab-pop/dashboard-preview.html.
// Category order is the fixed categorical slot order (--chart-1 … --chart-4): colour follows the entity.
import { sum } from './format';

export type CatId = 'design' | 'music' | 'code' | 'food';
export interface Category { id: CatId; name: string; slot: 1 | 2 | 3 | 4; base: number; price: number }
export const CATS: Category[] = [
  { id: 'design', name: 'Design', slot: 1, base: 1150, price: 35 },
  { id: 'music', name: 'Musique', slot: 2, base: 980, price: 18 },
  { id: 'code', name: 'Code', slot: 3, base: 760, price: 15 },
  { id: 'food', name: 'Food', slot: 4, base: 640, price: 25 },
];
export const catById = Object.fromEntries(CATS.map((c) => [c.id, c])) as Record<CatId, Category>;
export const catColor = (id: CatId) => `var(--chart-${catById[id].slot})`;

function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const DAYS = 180;
const TODAY = new Date(2026, 9, 2);
export const dates = Array.from({ length: DAYS }, (_, i) => { const d = new Date(TODAY); d.setDate(d.getDate() - (DAYS - 1 - i)); return d; });
const rnd = mulberry32(42);
export const DAILY = {} as Record<CatId, number[]>;
CATS.forEach((c, ci) => {
  DAILY[c.id] = dates.map((d, i) => {
    const dow = d.getDay(), weekend = dow === 0 || dow === 5 || dow === 6;
    const season = 1 + 0.18 * Math.sin((i / 30) * Math.PI * (0.8 + ci * 0.15) + ci);
    const trend = 1 + (i / DAYS) * (0.25 + ci * 0.08) - (c.id === 'code' ? (i / DAYS) * 0.2 : 0);
    const wk = weekend ? (c.id === 'music' || c.id === 'food' ? 1.55 : 1.1) : 0.85;
    return Math.round(c.base * season * trend * wk * (0.78 + rnd() * 0.44));
  });
});

export const EVENTS: { name: string; cat: CatId; w: number }[] = [
  { name: 'Graphic Design Workshop', cat: 'design', w: 0.34 }, { name: 'Risograph Zine Lab', cat: 'design', w: 0.24 },
  { name: 'Figma Pixel Party', cat: 'design', w: 0.18 }, { name: 'K-pop Listening Party', cat: 'music', w: 0.46 },
  { name: 'Synthwave Night', cat: 'music', w: 0.28 }, { name: 'Pixel Shader Jam', cat: 'code', w: 0.41 },
  { name: 'Y2K Web Revival', cat: 'code', w: 0.33 }, { name: 'Gochisō Ramen Night', cat: 'food', w: 0.52 },
  { name: 'Mochi & Matcha Lab', cat: 'food', w: 0.3 },
];
const CLIENTS = ['Ada L.', 'Hedy L.', 'Grace H.', 'Alan T.', 'Margaret H.', 'Linus T.', 'Radia P.', 'Satoshi T.', 'Yuki M.', 'Inès B.', 'Noah K.', 'Léa M.', 'Hugo R.', 'Mina P.', 'Sacha D.', 'Jun K.'];
export type Status = 'paid' | 'pending' | 'refund';
export interface Order { id: string; client: string; event: string; cat: CatId; qty: number; amount: number; status: Status; date: Date; dayIdx: number }
export const ORDERS: Order[] = Array.from({ length: 900 }, (_, i) => {
  const ev = EVENTS[Math.floor(rnd() * EVENTS.length)], day = Math.floor(rnd() ** 0.7 * DAYS), qty = 1 + Math.floor(rnd() ** 2 * 4);
  const r = rnd(), status: Status = r < 0.8 ? 'paid' : r < 0.92 ? 'pending' : 'refund';
  const d = new Date(dates[DAYS - 1 - day]); d.setHours(9 + Math.floor(rnd() * 13), Math.floor(rnd() * 60));
  return { id: 'NL-' + String(9820 - i).padStart(4, '0'), client: CLIENTS[Math.floor(rnd() * CLIENTS.length)], event: ev.name, cat: ev.cat, qty, amount: qty * catById[ev.cat].price, status, date: d, dayIdx: DAYS - 1 - day };
});
export const STATUS: Record<Status, { label: string; icon: string; variant: 'mint' | 'accent' | 'tomato' }> = {
  paid: { label: 'Payé', icon: '✓', variant: 'mint' }, pending: { label: 'En attente', icon: '◷', variant: 'accent' }, refund: { label: 'Remboursé', icon: '↺', variant: 'tomato' },
};

/* ---------- Derived slices for a filter state ---------- */
export interface Filters { range: 7 | 30 | 90; cats: CatId[] }
export const activeCats = (f: Filters) => CATS.filter((c) => f.cats.includes(c.id));
export function slice(f: Filters, id: CatId, offset = 0) { const end = DAYS - offset * f.range; return DAILY[id].slice(end - f.range, end); }
export function totals(f: Filters, offset = 0) {
  const cats = activeCats(f);
  const revenue = sum(cats.map((c) => sum(slice(f, c.id, offset))));
  const tickets = sum(cats.map((c) => sum(slice(f, c.id, offset)) / c.price));
  const orders = tickets / 1.85;
  const capacity = sum(cats.map((c) => (c.base / c.price) * 1.62 * f.range));
  return { revenue, tickets, basket: orders ? revenue / orders : 0, fill: capacity ? Math.min(0.99, tickets / capacity) : 0 };
}
export function daily(f: Filters, metric: 'revenue' | 'tickets') {
  const cats = activeCats(f);
  return Array.from({ length: f.range }, (_, i) => sum(cats.map((c) => { const v = slice(f, c.id)[i]; return metric === 'tickets' ? v / c.price : v; })));
}
export function bucket(arr: number[], n = 12) { const size = arr.length / n; return Array.from({ length: n }, (_, i) => sum(arr.slice(Math.floor(i * size), Math.floor((i + 1) * size)))); }
export function lineData(f: Filters) {
  const n = f.range, weekly = n > 30, labels: Date[] = [], idx: [number, number][] = [], start = DAYS - n;
  if (!weekly) for (let i = 0; i < n; i++) { labels.push(dates[start + i]); idx.push([i, i + 1]); }
  else for (let i = 0; i < n; i += 7) { labels.push(dates[start + i]); idx.push([i, Math.min(n, i + 7)]); }
  const series = activeCats(f).map((c) => { const s = slice(f, c.id); return { id: c.id, name: c.name, values: idx.map(([a, b]) => sum(s.slice(a, b))) }; });
  return { labels, series, weekly };
}
export function topEvents(f: Filters) {
  return EVENTS.filter((e) => f.cats.includes(e.cat))
    .map((e) => ({ ...e, tickets: Math.round((sum(slice(f, e.cat)) / catById[e.cat].price) * e.w) }))
    .sort((a, b) => b.tickets - a.tickets).slice(0, 6);
}
export const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const SLOTS = ['10h', '12h', '14h', '16h', '18h', '20h', '22h'];
export function heatGrid(f: Filters) {
  const cats = activeCats(f), r2 = mulberry32(7), weight = sum(cats.map((c) => c.base)) / 3530, scale = f.range / 30;
  return DOW.map((_, d) => SLOTS.map((_, s) => {
    const evening = s >= 4 ? 1.6 + (d >= 4 ? 0.9 : 0) : 1, lunch = s === 1 ? 1.3 : 1, wknd = d >= 5 ? 1.4 : 1;
    return Math.round(22 * evening * lunch * wknd * weight * scale * (0.7 + r2() * 0.6));
  }));
}
