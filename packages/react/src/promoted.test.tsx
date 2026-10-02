import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Delta, Meter, meterLevel, Pagination, Search, SegmentedControl, StatTile, Toast, ToggleChip } from './index.js';

describe('Delta', () => {
  it('good rise: class, visible sign, words for assistive tech', () => {
    const { container } = render(<Delta current={110} previous={100} />);
    const el = container.firstElementChild!;
    expect(el.className).toBe('nl-delta nl-delta--good');
    expect(el.textContent).toContain('▲ +10');
    expect(screen.getByText(/Hausse de 10/).className).toBe('nl-visually-hidden');
    expect(el.hasAttribute('aria-label')).toBe(false);
  });
  it('a rise is bad when upIsGood=false; a fall shows −', () => {
    const { container } = render(<><Delta current={110} previous={100} upIsGood={false} /><Delta current={90} previous={100} /></>);
    const [a, b] = Array.from(container.children);
    expect(a!.className).toContain('nl-delta--bad');
    expect(b!.className).toContain('nl-delta--bad');
    expect(b!.textContent).toContain('▼ −10');
  });
});

describe('Meter', () => {
  it('native meter with value, bounds and severity class', () => {
    render(<Meter value={0.84} label="Remplissage" />);
    const m = screen.getByRole('meter', { name: 'Remplissage' }) as HTMLMeterElement;
    expect(m.tagName).toBe('METER');
    expect(m.value).toBeCloseTo(0.84);
    expect(m.className).toBe('nl-meter nl-meter--ok');
  });
  it('levels follow low/high and values are clamped', () => {
    expect([meterLevel(0.3, 0.5, 0.7), meterLevel(0.6, 0.5, 0.7), meterLevel(0.9, 0.5, 0.7)]).toEqual(['bad', 'warn', 'ok']);
    render(<Meter value={2} label="x" />);
    expect((screen.getByRole('meter') as HTMLMeterElement).value).toBe(1);
  });
});

describe('StatTile', () => {
  it('renders a window with label, value, meta and children', () => {
    const { container } = render(<StatTile hero title="REVENUE.EXE" barColor="primary" label="Revenu" value="144 707 €" meta={<span>vs 30 j</span>}><i data-testid="spark" /></StatTile>);
    expect(container.firstElementChild!.className).toBe('nl-window nl-stat nl-stat--hero');
    expect(container.querySelector('.nl-window__bar--primary')!.textContent).toContain('REVENUE.EXE');
    expect(container.querySelector('.nl-stat__value')!.textContent).toBe('144 707 €');
    expect(container.querySelector('.nl-stat__row')!.textContent).toBe('vs 30 j');
    expect(screen.getByTestId('spark')).toBeTruthy();
  });
});

describe('Pagination', () => {
  it('marks the current page, disables bounds, centres the window', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} pages={9} onPageChange={onPageChange} label="Commandes" />);
    expect(screen.getByRole('navigation', { name: 'Commandes' })).toBeTruthy();
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['←', '4', '5', '6', '→']);
    expect(screen.getByRole('button', { name: 'Page 5' }).getAttribute('aria-current')).toBe('page');
    await userEvent.click(screen.getByRole('button', { name: 'Page suivante' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
  it('first and last pages disable previous / next', () => {
    const { rerender } = render(<Pagination page={1} pages={2} onPageChange={() => {}} />);
    expect((screen.getByRole('button', { name: 'Page précédente' }) as HTMLButtonElement).disabled).toBe(true);
    rerender(<Pagination page={2} pages={2} onPageChange={() => {}} />);
    expect((screen.getByRole('button', { name: 'Page suivante' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('SegmentedControl / ToggleChip', () => {
  it('segmented: group of toggle buttons with a single pressed one', async () => {
    function Demo() { const [v, setV] = useState<7 | 30>(30); return <SegmentedControl label="Période" value={v} onChange={setV} options={[{ value: 7, label: '7 j' }, { value: 30, label: '30 j' }]} />; }
    render(<Demo />);
    expect(screen.getByRole('group', { name: 'Période' }).className).toBe('nl-tabs nl-segmented');
    await userEvent.click(screen.getByRole('button', { name: '7 j' }));
    expect(screen.getByRole('button', { name: '7 j' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '30 j' }).getAttribute('aria-pressed')).toBe('false');
  });
  it('chip: aria-pressed, token swatch class, toggles', async () => {
    const onPressedChange = vi.fn();
    const { container } = render(<ToggleChip pressed swatch="chart-2" onPressedChange={onPressedChange}>Musique</ToggleChip>);
    const chip = screen.getByRole('button', { name: 'Musique' });
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('.nl-swatch')!.className).toBe('nl-swatch nl-swatch--chart-2');
    await userEvent.click(chip);
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });
});

describe('Toast / Search', () => {
  it('toast lives in a polite status region and dismisses itself', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Export terminé" onDismiss={onDismiss} duration={1000} />);
    expect(screen.getByRole('status').textContent).toContain('Export terminé');
    vi.advanceTimersByTime(1000);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
  it('the status region exists even without a message (so the next one is announced)', () => {
    render(<Toast message={null} onDismiss={() => {}} />);
    expect(screen.getByRole('status').textContent).toBe('');
  });
  it('search: labelled searchbox in the skin bar', () => {
    render(<Search label="Rechercher une commande" placeholder="Client" />);
    const box = screen.getByRole('searchbox', { name: 'Rechercher une commande' });
    expect(box.closest('label')!.className).toBe('nl-search');
  });
});
