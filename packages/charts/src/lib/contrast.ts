// Readable label colour on a fill, chosen among the skin's own ink and cream tokens.
// Any CSS colour format works (hex, rgb(), hsl(), oklch(), color-mix()…): non-hex values are
// converted by the browser itself, by painting one pixel and reading it back in sRGB.

const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = (r: number, g: number, b: number) => 0.2126 * channel(r / 255) + 0.7152 * channel(g / 255) + 0.0722 * channel(b / 255);

let pixel: CanvasRenderingContext2D | null | undefined;
function pixelContext() {
  if (pixel === undefined) {
    const canvas = typeof document === 'undefined' ? null : document.createElement('canvas');
    if (canvas) { canvas.width = 1; canvas.height = 1; }
    pixel = canvas?.getContext('2d', { willReadFrequently: true }) ?? null;
  }
  return pixel;
}

/** Relative luminance of any CSS colour string, or null if it is empty, invalid or not opaque. */
export function cssLuminance(css: string): number | null {
  const value = css.trim();
  if (!value) return null;
  const hex = value.match(/^#([0-9a-f]{6})$/i)?.[1];
  if (hex) return luminance(parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16));
  const ctx = pixelContext();
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // sentinel: an invalid colour leaves it unchanged → alpha 0 → null
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 255 ? luminance(r, g, b) : null;
}

const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name);

/** `var(--ink)` or `var(--cream)`, whichever contrasts best with `fillVar`; null when neither reaches 4.5:1. */
export function readableOn(fillVar: string): string | null {
  const fill = cssLuminance(token(fillVar.replace(/^var\((--[\w-]+)\)$/, '$1')));
  const ink = cssLuminance(token('--ink')), cream = cssLuminance(token('--cream'));
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
