import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import './app.css';
import { I18nProvider } from '@robin-dot-lab/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  // The dashboard is French: every component's words, dates and numbers follow this locale.
  <StrictMode><I18nProvider locale="fr-FR"><App /></I18nProvider></StrictMode>,
);
