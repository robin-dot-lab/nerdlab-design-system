import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card } from '@nerdlab/react';

const meta = { title: 'Composants/Card', component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <div className="nl-stack">
        <span className="nl-eyebrow nl-muted">24 oct</span>
        <h3 className="nl-headline">Graphic Design Workshop</h3>
        <p>Trois heures pour apprendre la mise en page d'affiche rétro.</p>
        <div className="nl-cluster"><Badge variant="lavender">Batch 26</Badge><Button size="sm" variant="primary">Réserver</Button></div>
      </div>
    </Card>
  ),
};

/** `asChild` garde l'élément sémantique (ici `<article>`). */
export const AsArticle: Story = {
  render: () => <Card asChild><article style={{ maxWidth: 360 }}>Une carte rendue comme <code>&lt;article&gt;</code>.</article></Card>,
};
