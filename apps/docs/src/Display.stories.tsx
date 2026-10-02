import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Bento, Callout, Grid, InfoList, Progress } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Display',
  component: Callout,
  subcomponents: { Progress, InfoList, Bento },
} satisfies Meta<typeof Callout>;
export default meta;
// Render-only stories mixing several components: args are not typed here.
type Story = StoryObj;

/** Four tones. The tone is also given in words (hidden text such as “Warning:”, set with `toneLabel`), never by colour alone. */
export const Callouts: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 560 }}>
      <Callout lang="en" title="Demo data">The figures are generated from a fixed seed.</Callout>
      <Callout tone="success" lang="en" title="Export complete">412 orders exported.</Callout>
      <Callout tone="warning" lang="en" title="Partial data"><p>Ticketing for the 12th has not been synced yet.</p></Callout>
      <Callout tone="error" lang="en">Payment failed: the card has expired.</Callout>
    </div>
  ),
};

/** Native `<progress>`: progress of a task. Without `value`, the bar is indeterminate (still if the user reduces motion). */
export const Progresses: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 420 }}>
      <Progress value={0.72} label="Importing tickets" />
      <Progress value={0.45} label="Sign-ups" />
      <Progress value={0.68} label="Level" pixel />
      <Progress label="Syncing" />
    </div>
  ),
};

/** Poster-style info table; the label sits above the value when the container is under 22rem. */
export const InfoTable: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <InfoList>
        <InfoList.Item term="Venue"><b>Nerdlab 378</b> — 12 Pixel Street, Lyon</InfoList.Item>
        <InfoList.Item term="Date"><Badge>04.27</Badge> ~ <Badge variant="primary">05.01</Badge> · 11am–7pm</InfoList.Item>
        <InfoList.Item term="Gift">Stickers, tote bag, holographic postcard</InfoList.Item>
      </InfoList>
    </div>
  ),
};

/** Bento tiles laid out on a `Grid`. Candy colours: ink text; ink tile: cream text. */
export const BentoGrid: Story = {
  render: () => (
    <Grid min="sm" gap={4} style={{ maxWidth: 960 }}>
      <Bento tone="elevated"><Bento.Title>Make money. Without a cut.</Bento.Title><Bento.Foot><span>0% commission</span><Badge>New</Badge></Bento.Foot></Bento>
      <Bento tone="ink"><Bento.Title>Reminders</Bento.Title><Bento.Foot><span>3 events this week</span></Bento.Foot></Bento>
      <Bento tone="accent"><Bento.Title>40M</Bento.Title><Bento.Foot><span>tickets sold</span></Bento.Foot></Bento>
      <Bento tone="mint" asChild><article><Bento.Title>Workshops</Bento.Title><Bento.Foot><span>Shaders, pixel art, synths</span></Bento.Foot></article></Bento>
    </Grid>
  ),
};
