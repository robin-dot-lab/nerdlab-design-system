import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Callout, Card, Cluster, Meter, Stack, Window } from '@robin-dot-lab/react';
import palettes from '@robin-dot-lab/tokens/palettes.json';

const meta = { title: 'Foundations/Palettes', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj;

const SWATCHES = ['primary', 'secondary', 'accent', 'mint', 'lavender', 'tomato'] as const;

function Sample({ id, name, description, theme }: { id: string; name: string; description: string; theme: 'light' | 'dark' }) {
  return (
    <section data-palette={id} data-theme={theme} aria-label={`${name}, ${theme}`} className="nl-stack nl-gap-4"
      style={{ padding: 20, background: 'var(--color-background)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-lg)', border: 'var(--border)' }}>
      <div>
        <h3 className="nl-headline" style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{name} <span className="nl-eyebrow nl-muted">{theme}</span></h3>
        <p className="nl-muted" style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)' }}>{description}</p>
      </div>
      <Cluster gap={2} aria-hidden="true">
        {SWATCHES.map((s) => <span key={s} title={s} style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', border: 'var(--border)', background: `var(--color-${s})` }} />)}
        {[1, 2, 3, 4].map((i) => <span key={i} style={{ width: 28, height: 12, borderRadius: 4, background: `var(--chart-${i})` }} />)}
      </Cluster>
      <Cluster gap={2}>
        <Button variant="primary" size="sm">Primary</Button>
        <Button size="sm">Default</Button>
        <Badge>New</Badge><Badge variant="mint">Live</Badge><Badge variant="lavender">Beta</Badge>
      </Cluster>
      <Window>
        <Window.Bar color="secondary">{name.toUpperCase()}.EXE</Window.Bar>
        <Window.Body><Stack gap={2}><span>Fill rate</span><Meter value={0.72} label={`Fill rate (${name})`} /></Stack></Window.Body>
      </Window>
      <Callout tone="warning" lang="en" title="Heads up">Every pair here passes the contrast checks.</Callout>
    </section>
  );
}

/** Every palette, light and dark side by side. On an app: `<html data-palette="sorbet" data-theme="dark">`. */
export const AllPalettes: Story = {
  render: () => (
    <div className="nl-stack nl-gap-6" style={{ padding: 24 }}>
      {palettes.map((p) => (
        <Card key={p.id} asChild>
          <article className="nl-grid-auto nl-grid-auto--lg nl-gap-4" aria-label={p.name}>
            <Sample {...p} theme="light" />
            <Sample {...p} theme="dark" />
          </article>
        </Card>
      ))}
    </div>
  ),
};
