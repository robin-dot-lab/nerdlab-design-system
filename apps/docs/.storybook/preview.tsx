import type { Preview } from '@storybook/react-vite';
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      // The skin reads [data-theme] on <html>, exactly like an application would set it.
      document.documentElement.dataset.theme = context.globals.theme;
      return <Story />;
    },
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};
export default preview;
