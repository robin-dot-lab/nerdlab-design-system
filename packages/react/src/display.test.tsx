import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Bento, Bubble, Burst, Callout, Divider, InfoList, Pill, Progress, Ribbon, Sticker, StickerSmall } from './index.js';

describe('Progress', () => {
  it('native progress with a name, clamped value and the pixel variant', () => {
    render(<Progress value={1.4} label="Import" pixel />);
    const p = screen.getByRole('progressbar', { name: 'Import' }) as HTMLProgressElement;
    expect(p.tagName).toBe('PROGRESS');
    expect(p.value).toBe(1);
    expect(p.className).toBe('nl-progress nl-progress--pixel');
  });
  it('is indeterminate without a value', () => {
    render(<Progress label="Chargement" />);
    expect(screen.getByRole('progressbar').hasAttribute('value')).toBe(false);
  });
});

describe('InfoList', () => {
  it('renders term/description pairs in a <dl>', () => {
    const { container } = render(<InfoList><InfoList.Item term="Lieu">Lyon</InfoList.Item><InfoList.Item term="Date">04.27</InfoList.Item></InfoList>);
    const dl = container.querySelector('dl.nl-info')!;
    expect(Array.from(dl.children).map((c) => `${c.tagName}:${c.textContent}`)).toEqual(['DT:Lieu', 'DD:Lyon', 'DT:Date', 'DD:04.27']);
  });
});

describe('Bento', () => {
  it('tone class, title and foot; asChild renders the child element', () => {
    const { container } = render(
      <Bento tone="ink" asChild><article><Bento.Title>Rappels</Bento.Title><Bento.Foot>3</Bento.Foot></article></Bento>,
    );
    const tile = container.firstElementChild!;
    expect(tile.tagName).toBe('ARTICLE');
    expect(tile.className).toBe('nl-bento nl-bento--ink');
    expect(screen.getByRole('heading', { name: 'Rappels' }).className).toBe('nl-bento__title');
    expect(container.querySelector('.nl-bento__foot')!.textContent).toBe('3');
  });
});

describe('decorations', () => {
  it('Pill, Sticker and Bubble set their classes', () => {
    const { container } = render(<><Pill filled>Café</Pill><Sticker tone="accent" tilt="right" size="lg">25<StickerSmall>places</StickerSmall></Sticker><Bubble>OK!</Bubble></>);
    const [pill, sticker, bubble] = Array.from(container.children);
    expect(pill!.className).toBe('nl-pill nl-pill--filled');
    expect(sticker!.className).toBe('nl-sticker nl-sticker--accent nl-sticker--tilt-right nl-sticker--lg');
    expect(sticker!.querySelector('small')!.className).toBe('nl-sticker__small');
    expect(bubble!.className).toBe('nl-bubble');
  });
  it('a Burst with text is a label; without, it is hidden from assistive tech', () => {
    const { container } = render(<><Burst tone="mint">NEW</Burst><Burst /></>);
    const [label, deco] = Array.from(container.children);
    expect(label!.className).toBe('nl-burst nl-burst--mint nl-burst--label');
    expect(label!.hasAttribute('aria-hidden')).toBe(false);
    expect(deco!.getAttribute('aria-hidden')).toBe('true');
  });
  it('Divider is a separator', () => {
    render(<Divider />);
    expect(screen.getByRole('separator').className).toBe('nl-divider-dashed');
  });
});

describe('Ribbon', () => {
  it('words are read once; the moving copies are hidden', () => {
    const { container } = render(<Ribbon items={['Lyon', 'Pixels']} />);
    expect(container.querySelector('.nl-visually-hidden')!.textContent).toBe('Lyon · Pixels');
    const track = container.querySelector('.nl-ribbon__track')!;
    expect(track.getAttribute('aria-hidden')).toBe('true');
    expect(track.children).toHaveLength(8);
  });
  it('the pause button stops the track and says what it will do next', async () => {
    const { container } = render(<Ribbon items={['Lyon']} />);
    await userEvent.click(screen.getByRole('button', { name: 'Mettre en pause le défilement' }));
    expect(container.firstElementChild!.className).toContain('nl-ribbon--paused');
    await userEvent.click(screen.getByRole('button', { name: 'Reprendre le défilement' }));
    expect(container.firstElementChild!.className).not.toContain('nl-ribbon--paused');
  });
  it('pausable={false} drops the button', () => {
    render(<Ribbon items={['Lyon']} pausable={false} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Callout', () => {
  it('tone class, hidden tone word before the title, decorative icon', () => {
    const { container } = render(<Callout tone="warning" title="Données partielles"><p>Le 12 manque.</p></Callout>);
    const el = container.firstElementChild!;
    expect(el.className).toBe('nl-callout nl-callout--warning');
    expect(el.querySelector('.nl-callout__title')!.textContent).toBe('Attention : Données partielles');
    expect(el.querySelector('.nl-callout__icon')!.getAttribute('aria-hidden')).toBe('true');
  });
  it('without a title the tone word leads the body; toneLabel translates it', () => {
    const { container } = render(<Callout tone="error" toneLabel="Error">Payment failed.</Callout>);
    expect(container.querySelector('.nl-callout__body')!.textContent).toBe('Error : Payment failed.');
  });
});
