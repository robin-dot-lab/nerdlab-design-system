import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Bento, Button, Grid, Stack } from '@robin-dot-lab/react';

// The tone names are shared by both skins, their colours are not (ADR-030): this page shows what each
// name becomes in the selected skin, with the text each tone carries.
const meta = { title: 'Foundations/Tones', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj;

const TONES = [
  { tone: 'surface', note: 'Default tile' },
  { tone: 'primary', note: 'Forest in Bento' },
  { tone: 'secondary', note: 'Butter in Bento' },
  { tone: 'accent', note: 'Orange in Bento: always ink text' },
  { tone: 'mint', note: 'Sage in Bento' },
  { tone: 'lavender', note: 'Lilac in Bento' },
  { tone: 'ink', note: 'Ink' },
] as const;

/** Every tile tone, its text and a secondary line on it. */
export const Tiles: Story = {
  render: () => (
    <Grid min="xs" gap={4}>
      {TONES.map(({ tone, note }) => (
        <Bento key={tone} tone={tone}>
          <Bento.Title>{tone}</Bento.Title>
          <p className="nl-muted" style={{ margin: 0 }}>{note}</p>
        </Bento>
      ))}
    </Grid>
  ),
};

/** Badges and buttons in every tone, including the coral used for destructive actions (`tomato`). */
export const Fills: Story = {
  render: () => (
    <Stack gap={4}>
      <div className="nl-cluster">
        {(['primary', 'secondary', 'accent', 'mint', 'lavender', 'tomato', 'ink'] as const).map((v) => <Badge key={v} variant={v}>{v}</Badge>)}
      </div>
      <div className="nl-cluster">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="tomato">Delete</Button>
        <Button>Default</Button>
      </div>
    </Stack>
  ),
};
