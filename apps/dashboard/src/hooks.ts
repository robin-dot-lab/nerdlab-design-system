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

export type Skin = 'candy' | 'bento';
/** Stylesheet URLs of each skin (fonts, then the skin), filled in by main.tsx. */
export const SKINS: Record<Skin, string[]> = { candy: [], bento: [] };
const SKIN_KEY = 'nl-dashboard-skin';
/**
 * The skin (ADR-030): index.html sets [data-skin] on <html> before first paint, main.tsx links its
 * stylesheet. Switching swaps the two <link>s in place. Bento has one palette: [data-palette] goes away.
 */
export function useSkin() {
  const [skin, setSkinState] = useState<Skin>(() => (document.documentElement.dataset.skin === 'bento' ? 'bento' : 'candy'));
  const setSkin = useCallback((s: Skin) => {
    const [fonts, sheet] = SKINS[s];
    document.getElementById('nl-skin-fonts')?.setAttribute('href', fonts!);
    document.getElementById('nl-skin')?.setAttribute('href', sheet!);
    const root = document.documentElement;
    root.dataset.skin = s;
    if (s === 'bento') delete root.dataset.palette;
    else { try { root.dataset.palette = localStorage.getItem(PALETTE_KEY) || 'candy'; } catch { root.dataset.palette = 'candy'; } }
    try { localStorage.setItem(SKIN_KEY, s); } catch { /* private mode: skin just isn't remembered */ }
    setSkinState(s);
  }, []);
  return [skin, setSkin] as const;
}
