import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Cluster, Container, DataTable, Grid, Section, Split, Stack, VisuallyHidden, type DataTableColumn } from './index.js';

describe('layout primitives', () => {
  it('map props to base + modifier classes', () => {
    render(
      <>
        <Stack data-testid="stack" gap={6} align="start" />
        <Cluster data-testid="cluster" gap="fluid-sm" justify="between" />
        <Grid data-testid="grid" min="lg" />
        <Split data-testid="split" ratio="sidebar" gap={0} />
        <Container data-testid="container" />
        <Section data-testid="section" />
      </>,
    );
    expect(screen.getByTestId('stack').className).toBe('nl-stack nl-stack--start nl-gap-6');
    expect(screen.getByTestId('cluster').className).toBe('nl-cluster nl-cluster--between nl-gap-fluid-sm');
    expect(screen.getByTestId('grid').className).toBe('nl-grid-auto nl-grid-auto--lg');
    expect(screen.getByTestId('split').className).toBe('nl-split nl-split--sidebar nl-gap-0');
    expect(screen.getByTestId('container').className).toBe('nl-container');
    expect(screen.getByTestId('section').tagName).toBe('SECTION');
  });
  it('asChild keeps the semantic element (a list stays a list)', () => {
    render(<Stack asChild gap={2}><ul aria-label="liste"><li>a</li></ul></Stack>);
    const list = screen.getByRole('list', { name: 'liste' });
    expect(list.className).toBe('nl-stack nl-gap-2');
  });
  it('VisuallyHidden', () => {
    render(<VisuallyHidden>caché</VisuallyHidden>);
    expect(screen.getByText('caché').className).toBe('nl-visually-hidden');
  });
});

interface Order { id: string; client: string; amount: number }
const rows: Order[] = [
  { id: 'NL-2', client: 'Grace', amount: 35 },
  { id: 'NL-1', client: 'Ada', amount: 140 },
  { id: 'NL-3', client: 'Linus', amount: 18 },
];
const columns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'N°' },
  { key: 'client', header: 'Client', sortable: true },
  { key: 'amount', header: <b>Montant</b>, label: 'Montant', align: 'end', sortable: true, cell: (r) => `${r.amount} €` },
];

describe('DataTable', () => {
  const setup = (extra = {}) => render(<DataTable caption="Commandes" columns={columns} rows={rows} rowKey={(r) => r.id} {...extra} />);
  it('renders a captioned, framed, stackable table with data-label on every cell', () => {
    const { container } = setup();
    const table = screen.getByRole('table', { name: 'Commandes' });
    expect(table.className).toBe('nl-table nl-table--stack');
    expect(container.firstElementChild!.className).toBe('nl-table-wrap nl-table-wrap--framed');
    const firstRow = within(table).getAllByRole('row')[1]!;
    const labels = within(firstRow).getAllByRole('cell').map((c) => c.getAttribute('data-label'));
    expect(labels).toEqual(['N°', 'Client', 'Montant']);
    expect(within(firstRow).getAllByRole('cell')[2]!.className).toBe('nl-cell--end');
  });
  it('sorts with aria-sort, toggling ascending / descending', async () => {
    setup();
    const amountHeader = screen.getByRole('columnheader', { name: 'Montant' });
    expect(amountHeader.getAttribute('aria-sort')).toBe('none');
    expect(screen.getByRole('columnheader', { name: 'N°' }).hasAttribute('aria-sort')).toBe(false);
    const order = () => screen.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0]!.textContent);
    await userEvent.click(within(amountHeader).getByRole('button'));
    expect(amountHeader.getAttribute('aria-sort')).toBe('ascending');
    expect(order()).toEqual(['NL-3', 'NL-2', 'NL-1']);
    await userEvent.click(within(amountHeader).getByRole('button'));
    expect(amountHeader.getAttribute('aria-sort')).toBe('descending');
    expect(order()).toEqual(['NL-1', 'NL-2', 'NL-3']);
  });
  it('honours defaultSort, empty state, hideCaption, stack=false, framed=false', () => {
    const { container, rerender } = setup({ defaultSort: { key: 'client', direction: 'ascending' } });
    expect(screen.getAllByRole('row')[1]!.textContent).toContain('Ada');
    rerender(<DataTable caption="Vide" hideCaption stack={false} framed={false} empty="Rien ici" columns={columns} rows={[]} rowKey={(r) => r.id} />);
    expect(screen.getByText('Rien ici').getAttribute('colspan')).toBe('3');
    expect(container.querySelector('caption')!.className).toBe('nl-visually-hidden');
    expect(screen.getByRole('table').className).toBe('nl-table');
    expect(container.firstElementChild!.className).toBe('nl-table-wrap');
  });
});
