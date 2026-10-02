import type { Preview } from '@storybook/react-vite';
import '@nerdlab/css-pop/fonts.css';
import '@nerdlab/css-pop/pop.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Thème du design system',
      toolbar: { title: 'Thème', icon: 'mirror', items: [{ value: 'light', title: 'Clair' }, { value: 'dark', title: 'Sombre' }], dynamicTitle: true },
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
