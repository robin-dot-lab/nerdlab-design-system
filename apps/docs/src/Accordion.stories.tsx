import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from '@nerdlab/react';

const meta = {
  title: 'Composants/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem },
  args: { exclusive: true },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

/** `<details>`/`<summary>` natifs. `exclusive` : un seul élément ouvert à la fois (attribut `name`). */
export const FAQ: Story = {
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 560 }}>
      <AccordionItem title="Pourquoi une couche fine au-dessus du CSS ?" open>
        Pour changer de peau en changeant de feuille de style, sans coût à l'exécution.
      </AccordionItem>
      <AccordionItem title="Les polices sont-elles incluses ?">
        Non : <code>@nerdlab/css-pop/fonts.css</code> est facultatif, l'application choisit.
      </AccordionItem>
      <AccordionItem title="Le thème sombre ?">
        Poser <code>data-theme="dark"</code> sur <code>&lt;html&gt;</code>.
      </AccordionItem>
    </Accordion>
  ),
};

export const Independent: Story = { ...FAQ, args: { exclusive: false } };
