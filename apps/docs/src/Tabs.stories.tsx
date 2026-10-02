import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from '@nerdlab/react';

const meta = { title: 'Composants/Tabs', component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Clavier : flèches gauche/droite pour changer d'onglet, Tab pour entrer dans le panneau (React Aria). */
export const Default: Story = {
  render: () => (
    <Tabs defaultSelectedKey="30">
      <TabList aria-label="Période">
        <Tab id="7">7 j</Tab>
        <Tab id="30">30 j</Tab>
        <Tab id="90">90 j</Tab>
      </TabList>
      <TabPanel id="7" style={{ paddingTop: 16 }}>Les 7 derniers jours.</TabPanel>
      <TabPanel id="30" style={{ paddingTop: 16 }}>Les 30 derniers jours.</TabPanel>
      <TabPanel id="90" style={{ paddingTop: 16 }}>Les 90 derniers jours.</TabPanel>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs disabledKeys={['jams']}>
      <TabList aria-label="Catégories">
        <Tab id="tout">Tout</Tab>
        <Tab id="ateliers">Ateliers</Tab>
        <Tab id="talks">Talks</Tab>
        <Tab id="jams">Jams</Tab>
      </TabList>
      <TabPanel id="tout">Tous les événements.</TabPanel>
      <TabPanel id="ateliers">Ateliers.</TabPanel>
      <TabPanel id="talks">Talks.</TabPanel>
      <TabPanel id="jams">Jams.</TabPanel>
    </Tabs>
  ),
};
