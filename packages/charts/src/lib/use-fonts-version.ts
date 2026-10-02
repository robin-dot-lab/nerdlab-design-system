'use client';

import { useEffect, useState } from 'react';

/**
 * Changes whenever web fonts finish loading. Components that measure text on a canvas
 * (ShareBar decides whether a label fits its segment) call it to measure again with the real
 * font: a first render can happen before the skin's fonts arrive, with fallback-font widths.
 */
export function useFontsVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const fonts = typeof document === 'undefined' ? undefined : document.fonts;
    if (!fonts) return;
    let live = true;
    const bump = () => { if (live) setVersion((v) => v + 1); };
    void fonts.ready.then(bump);
    fonts.addEventListener('loadingdone', bump);
    return () => { live = false; fonts.removeEventListener('loadingdone', bump); };
  }, []);
  return version;
}
