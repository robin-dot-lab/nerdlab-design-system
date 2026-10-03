import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'nl-dashboard-theme';
/** The skin reads [data-theme] on <html>; index.html sets it before first paint. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));
  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(KEY, t); } catch { /* private mode: theme just isn't remembered */ }
    setThemeState(t);
  }, []);
  return [theme, setTheme] as const;
}

const PALETTE_KEY = 'nl-dashboard-palette';
/** The skin reads [data-palette] on <html>; index.html sets it before first paint. */
export function usePalette() {
  const [palette, setPaletteState] = useState(() => document.documentElement.dataset.palette ?? 'candy');
  const setPalette = useCallback((p: string) => {
    document.documentElement.dataset.palette = p;
    try { localStorage.setItem(PALETTE_KEY, p); } catch { /* private mode: palette just isn't remembered */ }
    setPaletteState(p);
  }, []);
  return [palette, setPalette] as const;
}
