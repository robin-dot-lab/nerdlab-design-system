import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem, Button, Checkbox, Focusable, MobileNav, Switch, Tooltip, TooltipTrigger } from './index.js';

describe('Switch / Checkbox', () => {
  it('switch is a native checkbox exposed as role=switch and labelled by its text', async () => {
    render(<Switch defaultChecked>Notifications</Switch>);
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    expect(sw.className).toBe('nl-toggle');
    expect(sw.closest('label')?.className).toBe('nl-choice');
    expect((sw as HTMLInputElement).checked).toBe(true);
    await userEvent.click(screen.getByText('Notifications'));
    expect((sw as HTMLInputElement).checked).toBe(false);
  });
  it('checkbox without children renders the bare input', () => {
    render(<Checkbox aria-label="Newsletter" />);
    const cb = screen.getByRole('checkbox', { name: 'Newsletter' });
    expect(cb.className).toBe('nl-check');
    expect(cb.closest('label')).toBeNull();
  });
});

describe('Accordion', () => {
  it('renders native details and groups exclusive items under one name', () => {
    const { container } = render(
      <Accordion exclusive>
        <AccordionItem title="Pourquoi ?" open>Parce que.</AccordionItem>
        <AccordionItem title="Comment ?">Ainsi.</AccordionItem>
      </Accordion>,
    );
    const details = container.querySelectorAll('.nl-accordion > details');
    expect(details).toHaveLength(2);
    expect(details[0]!.getAttribute('name')).toBeTruthy();
    expect(details[0]!.getAttribute('name')).toBe(details[1]!.getAttribute('name'));
    expect(details[0]!.hasAttribute('open')).toBe(true);
    expect(screen.getByText('Comment ?').tagName).toBe('SUMMARY');
  });
  it('non-exclusive items have no name', () => {
    const { container } = render(<Accordion><AccordionItem title="A">a</AccordionItem></Accordion>);
    expect(container.querySelector('details')!.hasAttribute('name')).toBe(false);
  });
});

describe('Tooltip', () => {
  it('shows on keyboard focus with the nl-tooltip class and is linked to the trigger', async () => {
    render(
      <TooltipTrigger>
        <Focusable><Button>Exporter</Button></Focusable>
        <Tooltip>Télécharge un CSV</Tooltip>
      </TooltipTrigger>,
    );
    await userEvent.tab();
    const tip = await screen.findByRole('tooltip');
    expect(tip.className).toContain('nl-tooltip');
    expect(tip.textContent).toContain('Télécharge un CSV');
    expect(screen.getByRole('button', { name: 'Exporter' }).getAttribute('aria-describedby')).toBe(tip.id);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

describe('MobileNav', () => {
  const setup = () => render(<MobileNav><a href="#a">Couleurs</a><a href="#b">Typo</a></MobileNav>);
  it('toggles the panel with aria-expanded / aria-controls / data-open', async () => {
    setup();
    const toggle = screen.getByRole('button', { name: 'Menu' });
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    expect(panel.dataset.open).toBe('false');
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(panel.dataset.open).toBe('true');
  });
  it('Escape closes and returns focus to the toggle', async () => {
    setup();
    const toggle = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(toggle);
    act(() => screen.getByText('Typo').focus());
    await userEvent.keyboard('{Escape}');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });
  it('activating a link closes the panel', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await userEvent.click(screen.getByText('Couleurs'));
    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe('false');
  });
});
