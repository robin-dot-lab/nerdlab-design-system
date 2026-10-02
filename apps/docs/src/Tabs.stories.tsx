import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tab, TabList, TabPanel, Tabs } from '@robin-dot-lab/react';

const meta = { title: 'Components/Tabs', component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Keyboard: left/right arrows switch tabs, Tab moves into the panel (React Aria). */
export const Default: Story = {
  render: () => (
    <Tabs defaultSelectedKey="30">
      <TabList aria-label="Period">
        <Tab id="7">7 d</Tab>
        <Tab id="30">30 d</Tab>
        <Tab id="90">90 d</Tab>
      </TabList>
      <TabPanel id="7" style={{ paddingTop: 16 }}>The last 7 days.</TabPanel>
      <TabPanel id="30" style={{ paddingTop: 16 }}>The last 30 days.</TabPanel>
      <TabPanel id="90" style={{ paddingTop: 16 }}>The last 90 days.</TabPanel>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs disabledKeys={['jams']}>
      <TabList aria-label="Categories">
        <Tab id="all">All</Tab>
        <Tab id="workshops">Workshops</Tab>
        <Tab id="talks">Talks</Tab>
        <Tab id="jams">Jams</Tab>
      </TabList>
      <TabPanel id="all">All events.</TabPanel>
      <TabPanel id="workshops">Workshops.</TabPanel>
      <TabPanel id="talks">Talks.</TabPanel>
      <TabPanel id="jams">Jams.</TabPanel>
    </Tabs>
  ),
};
