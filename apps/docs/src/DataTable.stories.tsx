import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, DataTable, type DataTableColumn } from '@nerdlab/react';

interface Order { id: string; client: string; event: string; qty: number; amount: number; status: 'paid' | 'pending' | 'refund'; date: string }
const STATUS = { paid: { label: '✓ Payé', variant: 'mint' }, pending: { label: '◷ En attente', variant: 'accent' }, refund: { label: '↺ Remboursé', variant: 'tomato' } } as const;
const ORDERS: Order[] = [
  { id: 'NL-9924', client: 'Sacha D.', event: 'Synthwave Night', qty: 1, amount: 18, status: 'paid', date: '2026-09-30' },
  { id: 'NL-9206', client: 'Léa M.', event: 'K-pop Listening Party', qty: 2, amount: 36, status: 'pending', date: '2026-09-29' },
  { id: 'NL-9809', client: 'Noah K.', event: 'Risograph Zine Lab', qty: 4, amount: 140, status: 'paid', date: '2026-09-25' },
  { id: 'NL-9268', client: 'Yuki M.', event: 'Pixel Shader Jam', qty: 2, amount: 30, status: 'refund', date: '2026-09-27' },
  { id: 'NL-8957', client: 'Radia P.', event: 'Graphic Design Workshop', qty: 1, amount: 35, status: 'paid', date: '2026-09-24' },
];
const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const columns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'N°', cell: (o) => <span className="nl-eyebrow">{o.id}</span> },
  { key: 'client', header: 'Client', sortable: true },
  { key: 'event', header: 'Événement', sortable: true },
  { key: 'qty', header: 'Billets', align: 'end', sortable: true },
  { key: 'amount', header: 'Montant', align: 'end', sortable: true, cell: (o) => eur.format(o.amount) },
  { key: 'status', header: 'Statut', cell: (o) => <Badge variant={STATUS[o.status].variant}>{STATUS[o.status].label}</Badge> },
  { key: 'date', header: 'Date', align: 'end', sortable: true, cell: (o) => new Date(o.date).toLocaleDateString('fr-FR') },
];

const meta = {
  title: 'Composants/DataTable',
  component: DataTable<Order>,
  args: { caption: 'Dernières commandes', columns, rows: ORDERS, rowKey: (o: Order) => o.id, defaultSort: { key: 'date', direction: 'descending' } },
} satisfies Meta<typeof DataTable<Order>>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Clic (ou Entrée) sur un en-tête triable : `aria-sort` passe à ascending puis descending. */
export const Orders: Story = {};

/** Sous 40rem de large, chaque ligne devient une carte libellé / valeur (les `data-label` sont posés par le composant). */
export const Stacked: Story = { globals: { viewport: { value: 'mobile2', isRotated: false } } };

export const Empty: Story = { args: { rows: [], empty: 'Aucune commande ne correspond.' } };

export const HiddenCaption: Story = { args: { hideCaption: true, framed: false } };
