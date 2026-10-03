import type { Preview } from '@storybook/react-vite';
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import palettes from '@robin-dot-lab/tokens/palettes.json';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true },
    },
    palette: {
      description: 'Colour palette',
      toolbar: { title: 'Palette', icon: 'paintbrush', items: palettes.map((p) => ({ value: p.id, title: p.name })), dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', palette: 'candy' },
  decorators: [
    (Story, context) => {
      // The skin reads [data-theme] on <html>, exactly like an application would set it.
      document.documentElement.dataset.theme = context.globals.theme;
      document.documentElement.dataset.palette = context.globals.palette ?? 'candy';
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
