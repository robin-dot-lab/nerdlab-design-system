import { afterEach, describe, expect, it, vi } from 'vitest';

// jsdom has no canvas: simulate the browser's conversion of a colour to an sRGB pixel.
function fakeCanvas(pixels: Record<string, [number, number, number, number]>) {
  let style = 'rgba(0, 0, 0, 0)';
  const ctx = {
    clearRect: () => {}, fillRect: () => {},
    set fillStyle(v: string) { if (v in pixels || v === 'rgba(0, 0, 0, 0)') style = v; },
    get fillStyle() { return style; },
    getImageData: () => ({ data: Uint8ClampedArray.from(pixels[style] ?? [0, 0, 0, 0]) }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
}

describe('cssLuminance', () => {
  afterEach(() => { vi.restoreAllMocks(); vi.resetModules(); });

  it('hex fast path without any canvas', async () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
    const { cssLuminance } = await import('./lib/contrast.js');
    expect(cssLuminance('#FFFFFF')).toBeCloseTo(1);
    expect(cssLuminance('#000000')).toBeCloseTo(0);
    expect(spy).not.toHaveBeenCalled();
  });
  it('any other format goes through the browser (oklch, rgb…)', async () => {
    fakeCanvas({ 'oklch(0.68 0.24 355)': [255, 79, 163, 255], 'rgb(27 21 37)': [27, 21, 37, 255] });
    const { cssLuminance } = await import('./lib/contrast.js');
    expect(cssLuminance('oklch(0.68 0.24 355)')).toBeCloseTo(cssLuminance('#FF4FA3')!, 5);
    expect(cssLuminance('rgb(27 21 37)')).toBeCloseTo(cssLuminance('#1B1525')!, 5);
  });
  it('empty, invalid or translucent colours give null', async () => {
    fakeCanvas({ 'rgba(255, 0, 0, 0.5)': [255, 0, 0, 128] });
    const { cssLuminance } = await import('./lib/contrast.js');
    expect(cssLuminance('')).toBeNull();
    expect(cssLuminance('not-a-colour')).toBeNull();
    expect(cssLuminance('rgba(255, 0, 0, 0.5)')).toBeNull();
  });
});
