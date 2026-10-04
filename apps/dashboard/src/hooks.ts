import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const prefersDark = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
const KEY = 'nl-dashboard-theme';
/**
 * The skin reads [data-theme] on <html>; index.html sets it before first paint: the stored choice, or
 * "auto" (follow the device) until the user picks one. Returns the effective theme.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = document.documentElement.dataset.theme;
    return t === 'dark' || (t === 'auto' && prefersDark()) ? 'dark' : 'light';
  });
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const follow = () => { if (document.documentElement.dataset.theme === 'auto') setThemeState(mq.matches ? 'dark' : 'light'); };
    mq.addEventListener('change', follow);
    return () => mq.removeEventListener('change', follow);
  }, []);
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
