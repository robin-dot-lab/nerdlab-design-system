'use client';

import { useEffect, useRef, useState } from 'react';

/** Measured content width (ResizeObserver), unless a fixed `width` is given (tests, SSR, print). */
export function useWidth<T extends HTMLElement>(fixed?: number) {
  const ref = useRef<T>(null);
  const [measured, setMeasured] = useState(0);
  useEffect(() => {
    if (fixed !== undefined || typeof ResizeObserver === 'undefined') return;
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([entry]) => entry && setMeasured(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixed]);
  return [ref, fixed ?? measured] as const;
}
