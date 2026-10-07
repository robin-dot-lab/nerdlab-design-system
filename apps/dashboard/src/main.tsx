import candyFonts from '@robin-dot-lab/css-candy/fonts.css?url';
import candy from '@robin-dot-lab/css-candy/candy.css?url';
import bentoFonts from '@robin-dot-lab/css-bento/fonts.css?url';
import bento from '@robin-dot-lab/css-bento/bento.css?url';
import './app.css';
import { I18nProvider } from '@robin-dot-lab/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { SKINS, type Skin } from './hooks';

// An application imports one skin. The dashboard tests both (ADR-030): each skin is a stylesheet URL,
// and the chosen one (index.html reads it before first paint) is linked before the app renders.
SKINS.candy = [candyFonts, candy];
SKINS.bento = [bentoFonts, bento];
const skin = (document.documentElement.dataset.skin === 'bento' ? 'bento' : 'candy') satisfies Skin;
const links = SKINS[skin].map((href, i) => {
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href, id: i ? 'nl-skin' : 'nl-skin-fonts' });
  document.head.prepend(link);
  return new Promise((resolve) => { link.onload = link.onerror = resolve; });
});
await Promise.all(links);

createRoot(document.getElementById('root')!).render(
  // The dashboard is French: every component's words, dates and numbers follow this locale.
  <StrictMode><I18nProvider locale="fr-FR"><App /></I18nProvider></StrictMode>,
);
