import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Badge, Button, Card, Field, Input, Tab, TabList, TabPanel, Tabs, Window } from './index.js';

describe('Button', () => {
  it('maps variants to nl-* classes and defaults to type="button"', () => {
    render(<Button variant="primary" size="lg" shape="square">Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toBe('nl-btn nl-btn--primary nl-btn--lg nl-btn--square');
    expect(btn).toHaveProperty('type', 'button');
  });
  it('asChild renders the child element with button classes', () => {
    render(<Button asChild variant="accent"><a href="/docs">Docs</a></Button>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.tagName).toBe('A');
    expect(link.className).toBe('nl-btn nl-btn--accent');
  });
  it('merges a consumer className last', () => {
    render(<Button className="extra">X</Button>);
    expect(screen.getByRole('button').className).toBe('nl-btn extra');
  });
});

describe('Badge / Card', () => {
  it('badge variant class', () => {
    render(<Badge variant="ink">v1</Badge>);
    expect(screen.getByText('v1').className).toBe('nl-badge nl-badge--ink');
  });
  it('card asChild keeps the semantic element', () => {
    render(<Card asChild><article aria-label="card" /></Card>);
    expect(screen.getByRole('article', { name: 'card' }).className).toBe('nl-card');
  });
});

describe('Window', () => {
  it('renders bar with decorative controls hidden from assistive tech', () => {
    const { container } = render(<Window><Window.Bar color="primary">TICKET.EXE</Window.Bar><Window.Body>Body</Window.Body></Window>);
    expect(container.querySelector('.nl-window > .nl-window__bar.nl-window__bar--primary')).not.toBeNull();
    expect(container.querySelector('.nl-window__controls')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.nl-window__controls > span')).toHaveLength(3);
  });
  it('controls={false} removes them', () => {
    const { container } = render(<Window.Bar controls={false}>T</Window.Bar>);
    expect(container.querySelector('.nl-window__controls')).toBeNull();
  });
});

describe('Field / Input', () => {
  it('wires label, help text and error state', () => {
    render(<Field label="Email" error="Domaine manquant"><Input defaultValue="ada@" /></Field>);
    const input = screen.getByLabelText('Email');
    expect(input.className).toBe('nl-input nl-input--error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const message = screen.getByText('Domaine manquant');
    expect(message.className).toBe('nl-help nl-help--error');
    expect(input.getAttribute('aria-describedby')).toBe(message.id);
  });
  it('help text without error is not invalid', () => {
    render(<Field label="Nom" help="Tel qu'affiché"><Input /></Field>);
    const input = screen.getByLabelText('Nom');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByText("Tel qu'affiché").id);
  });
  it('standalone Input supports invalid', () => {
    render(<Input aria-label="q" invalid />);
    expect(screen.getByLabelText('q').className).toBe('nl-input nl-input--error');
  });
});

describe('Tabs', () => {
  it('uses nl classes, aria-selected and arrow-key navigation', async () => {
    render(
      <Tabs>
        <TabList aria-label="Période"><Tab id="7">7 j</Tab><Tab id="30">30 j</Tab></TabList>
        <TabPanel id="7">Sept</TabPanel><TabPanel id="30">Trente</TabPanel>
      </Tabs>,
    );
    const list = screen.getByRole('tablist');
    expect(list.className).toContain('nl-tabs');
    const [first, second] = screen.getAllByRole('tab');
    expect(first!.className).toContain('nl-tab');
    expect(first!.getAttribute('aria-selected')).toBe('true');
    await userEvent.click(first!);
    await userEvent.keyboard('{ArrowRight}');
    expect(second!.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Trente');
  });
});
