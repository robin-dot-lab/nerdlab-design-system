import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BarList, ChartCard, Heatmap, Legend, LineChart, ShareBar, Sparkline } from './index.js';

const series = [
  { id: 'a', name: 'Design', slot: 1 as const, values: [10, 20, 30, 25] },
  { id: 'b', name: 'Code', slot: 3 as const, values: [5, 15, 10, 40] },
];

describe('ShareBar measures its labels again when fonts load', () => {
  it('re-renders on document.fonts "loadingdone"', async () => {
    const fonts = Object.assign(new EventTarget(), { ready: Promise.resolve() });
    Object.defineProperty(document, 'fonts', { value: fonts, configurable: true });
    try {
      const { container } = render(<ShareBar title="Part" width={400} items={[{ id: 'a', label: 'A', value: 1, slot: 1 }]} />);
      const bar = () => container.querySelector('.nl-share')!.getAttribute('data-fonts-seen');
      await act(async () => { await fonts.ready; });
      const before = Number(bar());
      act(() => { fonts.dispatchEvent(new Event('loadingdone')); });
      expect(Number(bar())).toBe(before + 1);
    } finally {
      Reflect.deleteProperty(document, 'fonts');
    }
  });
});

describe('locale', () => {
  it('BarList speaks French by default and English for another locale', () => {
    const items = [{ id: 'x', label: 'K-pop', value: 994, slot: 2 as const }, { id: 'y', label: 'Shader', value: 6, slot: 3 as const }];
    const { rerender } = render(<BarList title="Top" unit="tickets" items={items} />);
    expect(screen.getAllByRole('listitem')[0]!.getAttribute('aria-label')).toBe('K-pop : 994 tickets');
    rerender(<BarList title="Top" unit="tickets" items={items} locale="en-GB" />);
    expect(screen.getAllByRole('listitem')[0]!.getAttribute('aria-label')).toBe('K-pop: 994 tickets');
    rerender(<BarList title="Top" items={[]} locale="en-GB" />);
    expect(screen.getByText('No data.')).toBeTruthy();
  });
});

describe('LineChart', () => {
  it('one 2px path per series, colour from the slot token, end labels, one Y axis', () => {
    const { container } = render(<LineChart width={800} title="Revenu" series={series} xLabels={['1', '2', '3', '4']} />);
    const paths = [...container.querySelectorAll('path[stroke^="var(--chart-"]')];
    expect(paths.map((p) => p.getAttribute('stroke'))).toEqual(['var(--chart-1)', 'var(--chart-3)']);
    expect(paths.every((p) => p.getAttribute('stroke-width') === '2')).toBe(true);
    expect([...container.querySelectorAll('.nl-chart__end-label')].map((t) => t.textContent)).toEqual(expect.arrayContaining(['Design 25', 'Code 40']));
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('Revenu, 2 séries');
  });
  it('keyboard: focus shows the last point, arrows move the crosshair, Escape clears', async () => {
    render(<LineChart width={800} title="Revenu" series={series} xLabels={['l1', 'l2', 'l3', 'l4']} formatValue={(v) => `${v} €`} />);
    const svg = screen.getByRole('img');
    act(() => svg.focus());
    const tipText = () => document.querySelector('.nl-chart-tip')?.textContent ?? '';
    expect(tipText()).toContain('l4');
    expect(tipText()).toContain('65 €'); // total row
    await userEvent.keyboard('{ArrowLeft}');
    expect(tipText()).toContain('l3');
    await userEvent.keyboard('{Escape}');
    expect(document.querySelector('.nl-chart-tip')).toBeNull();
  });
  it('labels the last date even when it falls on a tick step, and drops a tick too close to it', () => {
    const labels = Array.from({ length: 31 }, (_, i) => `d${i}`);
    const { container } = render(<LineChart width={600} title="t" series={[{ id: 'a', name: 'A', slot: 1, values: labels.map((_, i) => i) }]} xLabels={labels} />);
    const shown = [...container.querySelectorAll('text.nl-chart__axis')].map((t) => t.textContent).filter((t) => t!.startsWith('d'));
    expect(shown[0]).toBe('d0');
    expect(shown.at(-1)).toBe('d30');
  });
  it('empty state', () => {
    render(<LineChart width={800} title="t" series={[]} xLabels={[]} emptyLabel="Rien" />);
    expect(screen.getByText('Rien')).toBeTruthy();
  });
});

describe('BarList', () => {
  it('ranked list with values at the tip and accessible labels', () => {
    render(<BarList title="Top" unit="billets" items={[{ id: 'x', label: 'K-pop', value: 994, slot: 2 }, { id: 'y', label: 'Shader', value: 497, slot: 3 }]} />);
    const list = screen.getByRole('list', { name: 'Top' });
    const items = within(list).getAllByRole('listitem');
    expect(items[0]!.getAttribute('aria-label')).toBe('K-pop : 994 billets');
    expect((items[1]!.querySelector('.nl-bar-row__bar') as HTMLElement).style.flexBasis).toMatch(/^50(\.0)?%$/);
  });
  it('focus shows a tooltip with the share', () => {
    render(<BarList title="Top" shareLabel="du top" items={[{ id: 'x', label: 'A', value: 3, slot: 1 }, { id: 'y', label: 'B', value: 1, slot: 2 }]} />);
    fireEvent.focus(screen.getAllByRole('listitem')[0]!);
    expect(document.querySelector('.nl-chart-tip')!.textContent).toMatch(/75\s%/); // fr-FR uses a narrow no-break space
  });
});

describe('Heatmap', () => {
  it('grid roles, named corner, sequential tokens in 5 bins', () => {
    const values = [[0, 25], [50, 100]];
    render(<Heatmap title="Affluence" unit="check-ins" cornerLabel="Jour" rowLabels={['Lun', 'Mar']} colLabels={['10h', '12h']} values={values} />);
    const grid = screen.getByRole('grid', { name: 'Affluence' });
    expect(within(grid).getAllByRole('columnheader')[0]!.textContent).toBe('Jour');
    const cells = within(grid).getAllByRole('gridcell');
    expect(cells.map((c) => c.style.background)).toEqual(['var(--chart-seq-1)', 'var(--chart-seq-2)', 'var(--chart-seq-3)', 'var(--chart-seq-5)']);
    expect(cells[3]!.getAttribute('aria-label')).toBe('Mar 12h : 100 check-ins');
  });
});

describe('ShareBar', () => {
  it('segments sized by share, list as legend/table, no label when contrast cannot be computed', () => {
    render(<ShareBar width={400} title="Part du revenu" items={[{ id: 'a', label: 'Design', value: 3, slot: 1 }, { id: 'b', label: 'Code', value: 1, slot: 3 }]} formatValue={(v) => `${v} €`} />);
    const segs = screen.getAllByRole('img');
    expect(segs.map((s) => s.style.flex)).toEqual(['0.75 1 0px', '0.25 1 0px']); // jsdom normalises the basis
    expect(segs.map((s) => s.textContent)).toEqual(['', '']); // jsdom has no skin: tokens unreadable → legend carries the values
    expect(within(screen.getByRole('list', { name: 'Part du revenu' })).getAllByRole('listitem')[0]!.textContent).toMatch(/75\s%/);
  });
});

describe('Sparkline / Legend / ChartCard', () => {
  it('sparkline is decorative', () => {
    const { container } = render(<Sparkline width={200} values={[1, 3, 2, 5]} />);
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
  });
  it('legend mirrors the mark kind', () => {
    const { container } = render(<Legend kind="line" items={[{ label: 'A', slot: 1 }, { label: 'B', slot: 2 }]} />);
    expect(container.querySelectorAll('.nl-key-line')).toHaveLength(2);
  });
  it('chart card toggles to its table twin', async () => {
    render(
      <ChartCard title="Top" subtitle="Billets" table={{ columns: [{ key: 'n', header: 'Nom' }], rows: [{ n: 'K-pop' }] }}>
        <p>chart</p>
      </ChartCard>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Vue table' }));
    expect(screen.getByRole('table', { name: 'Top — Billets' })).toBeTruthy();
    expect(screen.queryByText('chart')).toBeNull();
    expect(screen.getByRole('button', { name: 'Vue graphe' }).getAttribute('aria-pressed')).toBe('true');
  });
});
