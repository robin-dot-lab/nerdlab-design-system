import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field, Radio, RadioGroup, Select, Textarea } from './index.js';

describe('Textarea', () => {
  it('is labelled, described and invalid through its Field', () => {
    render(<Field label="Message" error="Trop court"><Textarea /></Field>);
    const t = screen.getByRole('textbox', { name: 'Message' });
    expect(t.tagName).toBe('TEXTAREA');
    expect(t.className).toBe('nl-input nl-input--error');
    expect(t.getAttribute('aria-invalid')).toBe('true');
    expect(t.getAttribute('aria-describedby')).toBe(screen.getByText('Trop court').id);
  });
});

describe('Select', () => {
  it('native select, labelled by its Field, wrapped for the chevron', async () => {
    const onChange = vi.fn();
    render(<Field label="Ville" help="Où ?"><Select onChange={onChange}><option value="lyon">Lyon</option><option value="paris">Paris</option></Select></Field>);
    const s = screen.getByRole('combobox', { name: 'Ville' }) as HTMLSelectElement;
    expect(s.tagName).toBe('SELECT');
    expect(s.parentElement!.className).toBe('nl-select');
    expect(s.getAttribute('aria-describedby')).toBe(screen.getByText('Où ?').id);
    await userEvent.selectOptions(s, 'paris');
    expect(s.value).toBe('paris');
    expect(onChange).toHaveBeenCalled();
  });
});

describe('RadioGroup', () => {
  it('a named group of native radios sharing one name', () => {
    render(<RadioGroup legend="Format" defaultValue="csv"><Radio value="csv">CSV</Radio><Radio value="json">JSON</Radio></RadioGroup>);
    const group = screen.getByRole('group', { name: 'Format' });
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(group.tagName).toBe('FIELDSET');
    expect(new Set(radios.map((r) => r.name)).size).toBe(1);
    expect(radios.map((r) => r.checked)).toEqual([true, false]);
    expect(radios[0]!.className).toBe('nl-radio');
  });
  it('controlled: onChange reports the value and the parent decides', async () => {
    function Demo() {
      const [v, setV] = useState('csv');
      return <RadioGroup legend="Format" value={v} onChange={setV} orientation="horizontal"><Radio value="csv">CSV</Radio><Radio value="json">JSON</Radio></RadioGroup>;
    }
    render(<Demo />);
    await userEvent.click(screen.getByRole('radio', { name: 'JSON' }));
    expect((screen.getByRole('radio', { name: 'JSON' }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getByRole('group').className).toBe('nl-radio-group nl-radio-group--horizontal');
  });
  it('arrow keys move the selection (native behaviour)', async () => {
    render(<RadioGroup legend="Taille" defaultValue="s"><Radio value="s">S</Radio><Radio value="m">M</Radio></RadioGroup>);
    await userEvent.click(screen.getByRole('radio', { name: 'S' }));
    await userEvent.keyboard('{ArrowDown}');
    expect((screen.getByRole('radio', { name: 'M' }) as HTMLInputElement).checked).toBe(true);
  });
  it('error text describes the group', () => {
    render(<RadioGroup legend="Format" error="Choisis un format"><Radio value="csv">CSV</Radio></RadioGroup>);
    expect(screen.getByRole('group').getAttribute('aria-describedby')).toBe(screen.getByText('Choisis un format').id);
    expect(screen.getByText('Choisis un format').className).toBe('nl-help nl-help--error');
  });
});
