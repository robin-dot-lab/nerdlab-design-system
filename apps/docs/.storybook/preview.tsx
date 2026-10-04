import type { Preview } from '@storybook/react-vite';
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import palettes from '@robin-dot-lab/tokens/palettes.json';
import { I18nProvider } from '@robin-dot-lab/react';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design system theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }, { value: 'auto', title: 'System' }], dynamicTitle: true },
    },
    palette: {
      description: 'Colour palette',
      toolbar: { title: 'Palette', icon: 'paintbrush', items: palettes.map((p) => ({ value: p.id, title: p.name })), dynamicTitle: true },
    },
    locale: {
      description: 'Language and formats of the components (React Aria locale)',
      toolbar: { title: 'Locale', icon: 'globe', items: [{ value: 'en-GB', title: 'English (UK)' }, { value: 'en-US', title: 'English (US)' }, { value: 'fr-FR', title: 'Français' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', palette: 'candy', locale: 'en-GB' },
  decorators: [
    (Story, context) => {
      // The skin reads [data-theme] on <html>, exactly like an application would set it.
      document.documentElement.dataset.theme = context.globals.theme;
      document.documentElement.dataset.palette = context.globals.palette ?? 'candy';
      // A fixed locale, not the browser's: the screenshots must not depend on the machine's language.
      return <I18nProvider locale={context.globals.locale ?? 'en-GB'}><Story /></I18nProvider>;
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
