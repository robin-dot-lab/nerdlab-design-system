'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { encode } from 'uqr';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

const qrVariants = cva('nl-qr', {
  variants: { size: { sm: 'nl-qr--sm', md: '', lg: 'nl-qr--lg' } },
  defaultVariants: { size: 'md' },
});

export interface QRCodeProps extends Omit<ComponentProps<'figure'>, 'children'>, VariantProps<typeof qrVariants> {
  /** The text encoded (an address, a URL). */
  value: string;
  /** Accessible name of the image. Defaults to “QR code” in the active locale. */
  label?: string;
  /** Show the encoded text under the code. Otherwise it is still there for screen readers. */
  showValue?: boolean;
  /** Error correction: L (7 %), M (15 %, default), Q (25 %), H (30 %). */
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * A QR code drawn as SVG from a string, with the same text as its equivalent (visible with `showValue`).
 * The matrix comes from `uqr`; the drawing and its colours belong to the skin, which keeps dark modules on
 * a light square in every theme and palette, so phones can still scan it.
 */
export function QRCode({ value, label, showValue = false, errorCorrection = 'M', size, className, ...props }: QRCodeProps) {
  const { t } = useMessages();
  const qr = encode(value, { ecc: errorCorrection, border: 2 });
  // One path for every dark module: a unit square per module, in matrix coordinates.
  let d = '';
  qr.data.forEach((row, y) => row.forEach((dark, x) => { if (dark) d += `M${x} ${y}h1v1h-1z`; }));
  return (
    <figure className={cn(qrVariants({ size }), className)} {...props}>
      <svg className="nl-qr__code" viewBox={`0 0 ${qr.size} ${qr.size}`} role="img" aria-label={label ?? t.qrCode} shapeRendering="crispEdges">
        <rect className="nl-qr__background" width={qr.size} height={qr.size} />
        <path className="nl-qr__modules" d={d} />
      </svg>
      <figcaption className={showValue ? 'nl-qr__value' : 'nl-visually-hidden'}>{value}</figcaption>
    </figure>
  );
}
