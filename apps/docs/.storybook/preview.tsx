/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite';
// Two skins, one page: they share layer and class names, so only one may be in the document at a time.
// Both are bundled as text and the decorator puts the chosen one in a single <style> (ADR-030).
import candyFonts from '@robin-dot-lab/css-candy/fonts.css?inline';
import candy from '@robin-dot-lab/css-candy/candy.css?inline';
import bentoFonts from '@robin-dot-lab/css-bento/fonts.css?inline';
import bento from '@robin-dot-lab/css-bento/bento.css?inline';
import { I18nProvider } from '@robin-dot-lab/react';

const SKINS: Record<string, string> = { candy: `${candyFonts}\n${candy}`, bento: `${bentoFonts}\n${bento}` };

/** Puts the skin's stylesheet in the page, once per change. */
function applySkin(skin: string) {
  let style = document.getElementById('nl-skin') as HTMLStyleElement | null;
  if (!style) { style = document.createElement('style'); style.id = 'nl-skin'; document.head.prepend(style); }
  if (style.dataset.skin !== skin) { style.textContent = SKINS[skin] ?? SKINS.candy!; style.dataset.skin = skin; }
}
applySkin(new URLSearchParams(location.search).get('globals')?.match(/skin:(\w+)/)?.[1] ?? 'candy');

const preview: Preview = {
  globalTypes: {
    skin: {
      description: 'Skin: Candy or Bento (same classes, different look)',
      toolbar: { title: 'Skin', icon: 'contrast', items: [{ value: 'candy', title: 'Candy' }, { value: 'bento', title: 'Bento' }], dynamicTitle: true },
    },
    theme: {
      description: 'Design system theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }, { value: 'auto', title: 'System' }], dynamicTitle: true },
    },
    // Candy's palettes. Its toolbar menu is .storybook/manager.tsx: it only shows under Candy (Bento has one palette).
    palette: { description: 'Colour palette (Candy only)' },
    locale: {
      description: 'Language and formats of the components (React Aria locale)',
      toolbar: { title: 'Locale', icon: 'globe', items: [{ value: 'en-GB', title: 'English (UK)' }, { value: 'en-US', title: 'English (US)' }, { value: 'fr-FR', title: 'Français' }], dynamicTitle: true },
    },
  },
  initialGlobals: { skin: 'candy', theme: 'light', palette: 'candy', locale: 'en-GB' },
  decorators: [
    (Story, context) => {
      const skin = context.globals.skin === 'bento' ? 'bento' : 'candy';
      applySkin(skin);
      // The skin reads [data-theme] (and, in Candy, [data-palette]) on <html>, exactly like an application would set them.
      const root = document.documentElement;
      root.dataset.skin = skin;
      root.dataset.theme = context.globals.theme;
      if (skin === 'candy') root.dataset.palette = context.globals.palette ?? 'candy';
      else delete root.dataset.palette;
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
