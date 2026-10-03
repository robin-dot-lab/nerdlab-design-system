import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from '@robin-dot-lab/icons';
import { Button } from '@robin-dot-lab/react';

const { Icon, ...ICONS } = Icons;
const meta = { title: 'Components/Icons', component: Icon } satisfies Meta<typeof Icon>;
export default meta;
// Render-only stories: args are not typed here.
type Story = StoryObj;

/** `@robin-dot-lab/icons`: 24×24, 2px strokes in `currentColor`, sized by the surrounding text. Decorative unless given a `title`. */
export const Gallery: Story = {
  render: () => (
    <ul className="nl-grid-auto nl-grid-auto--xs" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {Object.entries(ICONS).map(([name, Glyph]) => (
        <li key={name} className="nl-card nl-stack nl-stack--center nl-gap-2" style={{ padding: 16 }}>
          <Glyph size="lg" />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};

/** Three sizes, following the font size; colour follows the text. */
export const Sizes: Story = {
  render: () => (
    <div className="nl-cluster nl-gap-6" style={{ fontSize: 20 }}>
      <Icons.Calendar size="sm" /> <Icons.Calendar /> <Icons.Calendar size="lg" />
      <span style={{ color: 'var(--color-primary)' }}><Icons.Check size="lg" /></span>
    </div>
  ),
};

/** In a button, decorative next to a label; alone, the icon carries the name with `title`. */
export const InButtons: Story = {
  render: () => (
    <div className="nl-cluster">
      <Button variant="primary"><Icons.Plus /> New event</Button>
      <Button shape="square" aria-label="Search"><Icons.Search /></Button>
      <Button variant="ghost"><Icons.Filter title="Filters" /></Button>
    </div>
  ),
};
