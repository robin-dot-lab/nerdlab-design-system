'use client';

import {
  Tab as AriaTab, TabList as AriaTabList, TabPanel as AriaTabPanel, Tabs as AriaTabs,
  type TabListProps as AriaTabListProps, type TabPanelProps, type TabProps, type TabsProps,
} from 'react-aria-components';
import { composeClass } from '../lib/compose-class.js';

/** Behaviour (roving focus, arrow keys, ARIA roles) comes from React Aria; looks come from nl-tabs / nl-tab. */
export function Tabs(props: TabsProps) {
  return <AriaTabs {...props} />;
}

export function TabList<T extends object>({ className, ...props }: AriaTabListProps<T>) {
  return <AriaTabList className={composeClass('nl-tabs', className)} {...props} />;
}

export function Tab({ className, ...props }: TabProps) {
  return <AriaTab className={composeClass('nl-tab', className)} {...props} />;
}

export function TabPanel(props: TabPanelProps) {
  return <AriaTabPanel {...props} />;
}

export type { TabsProps, TabProps, TabPanelProps };
export type TabListProps<T extends object> = AriaTabListProps<T>;
