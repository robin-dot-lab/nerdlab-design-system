import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem },
  args: { exclusive: true },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Native `<details>`/`<summary>`. `exclusive`: only one item open at a time (`name` attribute). */
export const FAQ: Story = {
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 560 }}>
      <AccordionItem title="Why a thin layer on top of CSS?" open>
        To switch skins by switching stylesheets, with no runtime cost.
      </AccordionItem>
      <AccordionItem title="Are fonts included?">
        No: <code>@robin-dot-lab/css-candy/fonts.css</code> is optional, the application decides.
      </AccordionItem>
      <AccordionItem title="Dark theme?">
        Set <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>.
      </AccordionItem>
    </Accordion>
  ),
};

export const Independent: Story = { ...FAQ, args: { exclusive: false } };
