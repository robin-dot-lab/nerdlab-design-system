import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card } from '@robin-dot-lab/react';

const meta = { title: 'Components/Card', component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <div className="nl-stack">
        <span className="nl-eyebrow nl-muted">Oct 24</span>
        <h3 className="nl-headline">Graphic Design Workshop</h3>
        <p>Three hours to learn retro poster layout.</p>
        <div className="nl-cluster"><Badge variant="lavender">Batch 26</Badge><Button size="sm" variant="primary">Book</Button></div>
      </div>
    </Card>
  ),
};

/** `asChild` keeps the semantic element (here `<article>`). */
export const AsArticle: Story = {
  render: () => <Card asChild><article style={{ maxWidth: 360 }}>A card rendered as <code>&lt;article&gt;</code>.</article></Card>,
};
