// Readable label colour on a fill, chosen among the skin's own ink and cream tokens.
const hexLum = (css: string) => {
  const m = css.trim().match(/^#?([0-9a-f]{6})$/i); if (!m) return null;
  return [0, 2, 4].map((i) => parseInt(m[1]!.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i]!, 0);
};
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name);

/** `var(--ink)` or `var(--cream)`, whichever contrasts best with `fillVar`; null when neither reaches 4.5:1. */
export function readableOn(fillVar: string): string | null {
  const fill = hexLum(token(fillVar.replace(/^var\((--[\w-]+)\)$/, '$1')));
  const ink = hexLum(token('--ink')), cream = hexLum(token('--cream'));
  if (fill === null || ink === null || cream === null) return null;
  const [color, r] = ratio(fill, ink) >= ratio(fill, cream) ? ['var(--ink)', ratio(fill, ink)] : ['var(--cream)', ratio(fill, cream)];
  return r >= 4.5 ? color : null;
}

let ctx: CanvasRenderingContext2D | null | undefined;
/** Rendered text width, measured lazily (no canvas is created at import time, so the module is SSR-safe). */
export function textWidth(text: string, font = '700 12px sans-serif') {
  ctx ??= typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * 7;
  ctx.font = font;
  return ctx.measureText(text).width;
}
