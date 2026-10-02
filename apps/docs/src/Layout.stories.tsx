import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card, Cluster, Container, Grid, Section, Split, Stack, VisuallyHidden, Window } from '@nerdlab/react';

const meta = {
  title: 'Mise en page/Primitives',
  component: Stack,
  subcomponents: { Cluster, Grid, Split, Container },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (label: string) => <Card key={label}><strong>{label}</strong></Card>;

/** `gap` choisit un pas de la grille d'espacement (classes `.nl-gap-*`), jamais une valeur libre. */
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
            <Badge variant="ink">{justify}</Badge><Button size="sm">Un</Button><Button size="sm" variant="primary">Deux</Button>
          </Cluster>
        ))}
      </Stack>
    </Container>
  ),
};

/** Autant de colonnes que la place le permet, chacune d'au moins `min` (xs 10rem · sm 13rem · md 16rem · lg 22rem · xl 28rem). */
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

/** Empilé sur petit écran, côte à côte à partir du grand point de rupture de la peau. */
export const SplitRatios: Story = {
  render: () => (
    <Container>
      <Stack gap={8} style={{ paddingBlock: 24 }}>
        {([['equal', 'Moitié', 'Moitié'], ['2-1', 'Principal (2/3)', 'Secondaire (1/3)'], ['sidebar', 'Barre latérale', 'Contenu'], ['sidebar-end', 'Contenu', 'Barre latérale']] as const).map(([ratio, first, second]) => (
          <Split key={ratio} ratio={ratio} gap={6}>
            <Window><Window.Bar>ratio=&quot;{ratio}&quot;</Window.Bar><Window.Body>{first}</Window.Body></Window>
            <Window><Window.Bar color="secondary">&nbsp;</Window.Bar><Window.Body>{second}</Window.Body></Window>
          </Split>
        ))}
      </Stack>
    </Container>
  ),
};

/** `asChild` : la primitive pose ses classes sur l'élément sémantique (ici une liste). */
export const AsList: Story = {
  render: () => (
    <Container>
      <Stack asChild gap={2} style={{ paddingBlock: 24 }}>
        <ul aria-label="Étapes">
          <li>Tokens</li><li>Peau CSS</li><li>Composants</li>
        </ul>
      </Stack>
    </Container>
  ),
};

/** `Section` donne le rythme vertical entre deux blocs de page (`--section-y`, fluide). */
export const Sections: Story = {
  render: () => (
    <Container>
      <Section aria-labelledby="s1"><h2 id="s1" className="nl-headline">Première section</h2><p>Le rythme vertical vient de la peau.</p></Section>
      <Section aria-labelledby="s2" style={{ borderBlockStart: 'var(--border)' }}><h2 id="s2" className="nl-headline">Seconde section</h2><p>Même espacement, quel que soit l'écran.</p></Section>
    </Container>
  ),
};

/** `VisuallyHidden` : texte lu par les lecteurs d'écran, invisible à l'écran (ici, le nom du bouton icône). */
export const VisuallyHiddenText: Story = {
  render: () => (
    <Container>
      <div style={{ paddingBlock: 24 }}>
        <Button shape="square" size="sm">✕<VisuallyHidden>Fermer le panneau</VisuallyHidden></Button>
      </div>
    </Container>
  ),
};
