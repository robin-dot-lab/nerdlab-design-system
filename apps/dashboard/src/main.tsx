import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import './app.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
