import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type Key } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Avatar, AvatarGroup, Breadcrumb, Button, ComboBox, ComboBoxItem, DataTable, DatePicker, DialogTrigger, Drawer, DrawerFooter,
  I18nProvider, parseDate, Skeleton, Tooltip, TooltipTrigger,
} from './index.js';

describe('Breadcrumb', () => {
  it('a named nav with links and the current page last', () => {
    render(<Breadcrumb label="Breadcrumb" items={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: 'Pixel Party' }]} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.className).toBe('nl-breadcrumb');
    expect(within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/', '/events']);
    expect(within(nav).getByText('Pixel Party').getAttribute('aria-current')).toBe('page');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
  });
  it('defaults to the locale’s name', () => {
    render(<Breadcrumb items={[{ label: 'Home' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
  });
});

describe('Avatar', () => {
  it('initials when there is no photo, named by the person', () => {
    render(<Avatar name="Ada Lovelace" tone="mint" size="lg" />);
    const a = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(a.className).toBe('nl-avatar nl-avatar--lg nl-avatar--mint');
    expect(a.textContent).toBe('AL');
  });
  it('a photo with alt text, and initials again when it fails to load', () => {
    render(<Avatar name="Grace Hopper" src="/grace.jpg" />);
    const img = screen.getByRole('img', { name: 'Grace Hopper' });
    expect(img.tagName).toBe('IMG');
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'Grace Hopper' }).textContent).toBe('GH');
  });
  it('AvatarGroup is a named group', () => {
    render(<AvatarGroup aria-label="3 attendees"><Avatar name="A B" /><Avatar name="C D" /></AvatarGroup>);
    expect(screen.getByRole('group', { name: '3 attendees' }).className).toBe('nl-avatar-group');
  });
});

describe('Skeleton', () => {
  it('hidden from assistive tech, one line or several', () => {
    const { container } = render(<><Skeleton shape="circle" /><Skeleton lines={3} /></>);
    const [circle, group] = Array.from(container.children);
    expect(circle!.className).toBe('nl-skeleton nl-skeleton--circle');
    expect(circle!.getAttribute('aria-hidden')).toBe('true');
    expect(group!.querySelectorAll('.nl-skeleton--text')).toHaveLength(3);
    expect(group!.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('Drawer', () => {
  it('opens from a Button, is named by its title, closes on Escape and returns focus', async () => {
    render(
      <DialogTrigger>
        <Button>Filters</Button>
        <Drawer title="Filters" placement="start" closeLabel="Close">{({ close }) => <DrawerFooter><Button onClick={close}>Apply</Button></DrawerFooter>}</Drawer>
      </DialogTrigger>,
    );
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog.closest('.nl-drawer')!.className).toContain('nl-drawer--start');
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});

describe('ComboBox', () => {
  const cities = ['Lyon', 'Lille', 'Paris'];
  it('labelled combobox that filters as you type and reports the choice', async () => {
    const onSelectionChange = vi.fn();
    render(<ComboBox label="City" onSelectionChange={onSelectionChange}>{cities.map((c) => <ComboBoxItem key={c} id={c}>{c}</ComboBoxItem>)}</ComboBox>);
    const input = screen.getByRole('combobox', { name: 'City' });
    expect(input.className).toContain('nl-input');
    await userEvent.type(input, 'Li');
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['Lille']);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onSelectionChange).toHaveBeenCalledWith('Lille');
  });
  it('shows the empty state when nothing matches, and an error message', async () => {
    render(<ComboBox label="City" errorMessage="Pick a city" emptyLabel="No match" allowsEmptyCollection>{cities.map((c) => <ComboBoxItem key={c} id={c}>{c}</ComboBoxItem>)}</ComboBox>);
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
    await userEvent.type(screen.getByRole('combobox'), 'zz');
    expect(await screen.findByText('No match')).toBeTruthy();
  });
});

describe('DatePicker', () => {
  it('labelled segments in the locale order; picking a day in the calendar sets the value', async () => {
    const onChange = vi.fn();
    render(<I18nProvider locale="en-GB"><DatePicker label="Date" defaultValue={parseDate('2026-04-27')} onChange={onChange} /></I18nProvider>);
    const group = screen.getByRole('group', { name: 'Date' });
    const segments = within(group).getAllByRole('spinbutton');
    expect(segments.map((s) => s.getAttribute('aria-label') ?? s.textContent)).toHaveLength(3);
    expect(group.textContent).toContain('27/04/2026');
    await userEvent.click(within(group).getByRole('button'));
    const grid = await screen.findByRole('grid');
    await userEvent.click(within(grid).getByText('29'));
    expect(onChange.mock.calls.at(-1)![0].toString()).toBe('2026-04-29');
  });
  it('follows the browser locale without a provider', () => {
    render(<DatePicker label="Date" defaultValue={parseDate('2026-04-27')} />);
    expect(screen.getByRole('group', { name: 'Date' }).textContent).toContain('4/27/2026');
  });
});

describe('DataTable selection', () => {
  type Row = { id: string; name: string };
  const rows: Row[] = [{ id: 'a', name: 'Ada' }, { id: 'b', name: 'Bob' }, { id: 'c', name: 'Cy' }];
  const cols = [{ key: 'name', header: 'Name' }];
  it('row checkboxes, select-all with an indeterminate state, selected row class', async () => {
    const onSelectionChange = vi.fn();
    render(<DataTable caption="People" columns={cols} rows={rows} rowKey={(r) => r.id} selectable onSelectionChange={onSelectionChange}
      selectionLabels={{ all: 'Select all', row: (r) => `Select ${r.name}`, column: 'Selection' }} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Bob' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['b']));
    const all = screen.getByRole('checkbox', { name: 'Select all' }) as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    expect(screen.getByRole('checkbox', { name: 'Select Bob' }).closest('tr')!.className).toBe('nl-table__row--selected');
    await userEvent.click(all);
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['a', 'b', 'c']));
    expect(all.checked).toBe(true);
    await userEvent.click(all);
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set());
  });
  it('controlled: the parent owns the keys, which survive a page change', async () => {
    function Demo() {
      const [keys, setKeys] = useState<Set<Key>>(new Set(['z']));
      const [page, setPage] = useState(0);
      return (<>
        <DataTable caption="People" columns={cols} rows={page ? rows.slice(2) : rows.slice(0, 2)} rowKey={(r) => r.id} selectable selectedKeys={keys} onSelectionChange={setKeys} />
        <button onClick={() => setPage(1)}>next</button><output>{[...keys].sort().join(',')}</output>
      </>);
    }
    render(<Demo />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all visible rows' }));
    await userEvent.click(screen.getByText('next'));
    await userEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(screen.getByRole('status').textContent).toBe('a,b,c,z');
  });
});

describe('TooltipTrigger without Focusable', () => {
  it('our Button is wrapped for you: keyboard focus shows the tooltip', async () => {
    render(<TooltipTrigger delay={0}><Button>Export</Button><Tooltip>Download CSV</Tooltip></TooltipTrigger>);
    await act(async () => { await userEvent.tab(); });
    expect(await screen.findByRole('tooltip')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Export' }).getAttribute('aria-describedby')).toBe(screen.getByRole('tooltip').id);
  });
});
