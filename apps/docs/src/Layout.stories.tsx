import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, Cluster, Container, Grid, Section, Split, Stack, VisuallyHidden, Window } from '@robin-dot-lab/react';

const meta = {
  title: 'Layout/Primitives',
  component: Stack,
  subcomponents: { Cluster, Grid, Split, Container },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (label: string) => <Card key={label}><strong>{label}</strong></Card>;

/** `gap` picks a step of the spacing scale (`.nl-gap-*` classes), never a free value. */
export const StackGaps: Story = {
  render: () => (
    <Container>
      <Grid min="sm" gap={6} style={{ paddingBlock: 24 }}>
        {([2, 4, 'fluid-md', 8] as const).map((gap) => (
          <Stack key={gap} gap={gap}>
            <span className="nl-eyebrow nl-muted">gap={String(gap)}</span>
            {box('A')}{box('B')}{box('C')}
          </Stack>
        ))}
      </Grid>
    </Container>
  ),
};

export const ClusterJustify: Story = {
  render: () => (
    <Container>
      <Stack gap={6} style={{ paddingBlock: 24 }}>
        {(['start', 'center', 'end', 'between'] as const).map((justify) => (
          <Cluster key={justify} justify={justify} gap={3}>
            <Badge variant="ink">{justify}</Badge><Button size="sm">One</Button><Button size="sm" variant="primary">Two</Button>
          </Cluster>
        ))}
      </Stack>
    </Container>
  ),
};

/** As many columns as fit, each at least `min` wide (xs 10rem · sm 13rem · md 16rem · lg 22rem · xl 28rem). */
export const GridMin: Story = {
  render: () => (
    <Container>
      <Stack gap={8} style={{ paddingBlock: 24 }}>
        {(['xs', 'md', 'xl'] as const).map((min) => (
          <Stack key={min} gap={3}>
            <span className="nl-eyebrow nl-muted">min=&quot;{min}&quot;</span>
            <Grid min={min} gap={4}>{['1', '2', '3', '4', '5', '6'].map(box)}</Grid>
          </Stack>
        ))}
      </Stack>
    </Container>
  ),
};

/** Stacked on small screens, side by side from the skin's large breakpoint up. */
export const SplitRatios: Story = {
  render: () => (
    <Container>
      <Stack gap={8} style={{ paddingBlock: 24 }}>
        {([['equal', 'Half', 'Half'], ['2-1', 'Main (2/3)', 'Secondary (1/3)'], ['sidebar', 'Sidebar', 'Content'], ['sidebar-end', 'Content', 'Sidebar']] as const).map(([ratio, first, second]) => (
          <Split key={ratio} ratio={ratio} gap={6}>
            <Window><Window.Bar>ratio=&quot;{ratio}&quot;</Window.Bar><Window.Body>{first}</Window.Body></Window>
            <Window><Window.Bar color="secondary">&nbsp;</Window.Bar><Window.Body>{second}</Window.Body></Window>
          </Split>
        ))}
      </Stack>
    </Container>
  ),
};

/** `asChild`: the primitive puts its classes on the semantic element (here a list). */
export const AsList: Story = {
  render: () => (
    <Container>
      <Stack asChild gap={2} style={{ paddingBlock: 24 }}>
        <ul aria-label="Steps">
          <li>Tokens</li><li>CSS skin</li><li>Components</li>
        </ul>
      </Stack>
    </Container>
  ),
};

/** `Section` sets the vertical rhythm between two page blocks (`--section-y`, fluid). */
export const Sections: Story = {
  render: () => (
    <Container>
      <Section aria-labelledby="s1"><h2 id="s1" className="nl-headline">First section</h2><p>The vertical rhythm comes from the skin.</p></Section>
      <Section aria-labelledby="s2" style={{ borderBlockStart: 'var(--border)' }}><h2 id="s2" className="nl-headline">Second section</h2><p>Same spacing, whatever the screen.</p></Section>
    </Container>
  ),
};

/** `VisuallyHidden`: text read by screen readers but invisible on screen (here, the name of the icon button). */
export const VisuallyHiddenText: Story = {
  render: () => (
    <Container>
      <div style={{ paddingBlock: 24 }}>
        <Button shape="square" size="sm">✕<VisuallyHidden>Close the panel</VisuallyHidden></Button>
      </div>
    </Container>
  ),
};
