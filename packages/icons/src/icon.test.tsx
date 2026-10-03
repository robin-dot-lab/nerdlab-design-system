import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as kit from './index.js';
import { Check, Icon } from './index.js';

const icons = Object.entries(kit).filter(([name]) => name !== 'Icon') as [string, typeof Check][];

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon><path d="M5 12h14" /></Icon>);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.hasAttribute('role')).toBe(false);
    expect(svg.querySelector('title')).toBeNull();
  });

  it('draws a 24×24 stroke icon in currentColor with no width or height', () => {
    const { container } = render(<Check />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-width')).toBe('2');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('stroke-linejoin')).toBe('round');
    expect(svg.hasAttribute('width')).toBe(false);
    expect(svg.hasAttribute('height')).toBe(false);
    expect(svg.hasAttribute('style')).toBe(false);
  });

  it('with a title, is an image named by its <title>', () => {
    render(<Check title="Done" />);
    const img = screen.getByRole('img', { name: 'Done' });
    expect(img.hasAttribute('aria-hidden')).toBe(false);
    const title = img.querySelector('title')!;
    expect(title.textContent).toBe('Done');
    expect(img.getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('gives each titled icon a distinct title id', () => {
    render(<><Check title="One" /><Check title="Two" /></>);
    const [a, b] = screen.getAllByRole('img');
    expect(a!.getAttribute('aria-labelledby')).not.toBe(b!.getAttribute('aria-labelledby'));
    expect(screen.getByRole('img', { name: 'Two' })).toBe(b);
  });

  it('merges className after nl-icon and the size class', () => {
    const { container } = render(<Check size="lg" className="extra" />);
    expect(container.querySelector('svg')!.getAttribute('class')).toBe('nl-icon nl-icon--lg extra');
  });

  it.each([
    ['sm', 'nl-icon nl-icon--sm'],
    ['md', 'nl-icon'],
    ['lg', 'nl-icon nl-icon--lg'],
  ] as const)('size %s → class "%s"', (size, cls) => {
    const { container } = render(<Check size={size} />);
    expect(container.querySelector('svg')!.getAttribute('class')).toBe(cls);
  });

  it('defaults to md (no size modifier)', () => {
    const { container } = render(<Check />);
    expect(container.querySelector('svg')!.getAttribute('class')).toBe('nl-icon');
  });

  it('spreads other SVG props', () => {
    const { container } = render(<Check data-testid="ok" id="check-1" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('data-testid')).toBe('ok');
    expect(svg.id).toBe('check-1');
  });
});

describe('icon set', () => {
  it('exports the full set', () => {
    expect(icons.map(([name]) => name).sort()).toEqual([
      'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Calendar', 'Check', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp',
      'Close', 'Error', 'ExclamationMark', 'ExternalLink', 'Filter', 'Home', 'Info', 'InfoMark', 'Menu', 'Minus', 'MoreHorizontal', 'Pause',
      'Play', 'Plus', 'Search', 'Sort', 'Success', 'User', 'Warning',
    ]);
  });

  it.each(icons)('%s renders an <svg class="nl-icon"> with a shape', (name, Component) => {
    const { container } = render(<Component />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('class')).toBe('nl-icon');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelectorAll('path, circle, rect, line, polyline, polygon, ellipse').length).toBeGreaterThan(0);
    expect(Component.displayName).toBe(name);
  });
});
