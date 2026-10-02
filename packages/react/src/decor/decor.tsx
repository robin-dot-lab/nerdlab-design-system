import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export interface PillProps extends ComponentProps<'span'> {
  /** Yellow fill instead of the surface colour. */
  filled?: boolean;
}

/** Rounded uppercase label for perks and features. For a status, use `Badge`. */
export function Pill({ className, filled = false, ...props }: PillProps) {
  return <span className={cn('nl-pill', filled && 'nl-pill--filled', className)} {...props} />;
}

export const stickerVariants = cva('nl-sticker', {
  variants: {
    tone: {
      tomato: '',
      accent: 'nl-sticker--accent',
      primary: 'nl-sticker--primary',
      secondary: 'nl-sticker--secondary',
      mint: 'nl-sticker--mint',
      lavender: 'nl-sticker--lavender',
    },
    tilt: { left: '', right: 'nl-sticker--tilt-right', none: 'nl-sticker--straight' },
    size: { md: '', lg: 'nl-sticker--lg' },
  },
  defaultVariants: { tone: 'tomato', tilt: 'left', size: 'md' },
});

export interface StickerProps extends ComponentProps<'span'>, VariantProps<typeof stickerVariants> {}

/** Round tilted sticker for a short promo (« 25 places », « Free entry »). Keep it to two or three words. */
export function Sticker({ className, tone, tilt, size, children, ...props }: StickerProps) {
  // One inner box: the sticker is a grid, and a text run plus <StickerSmall> would otherwise become two spread rows.
  return <span className={cn(stickerVariants({ tone, tilt, size }), className)} {...props}><span>{children}</span></span>;
}

export type StickerSmallProps = ComponentProps<'small'>;

/** Second, smaller line inside a sticker. */
export function StickerSmall({ className, ...props }: StickerSmallProps) {
  return <small className={cn('nl-sticker__small', className)} {...props} />;
}

export const burstVariants = cva('nl-burst', {
  variants: {
    tone: { accent: '', primary: 'nl-burst--primary', mint: 'nl-burst--mint', tomato: 'nl-burst--tomato' },
  },
  defaultVariants: { tone: 'accent' },
});

export interface BurstProps extends ComponentProps<'span'>, VariantProps<typeof burstVariants> {}

/**
 * Starburst. With text (« NEW ») it is a label; without, a decoration hidden from assistive tech.
 */
export function Burst({ className, tone, children, ...props }: BurstProps) {
  const label = children != null && children !== false;
  return (
    <span
      className={cn(burstVariants({ tone }), label && 'nl-burst--label', className)}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      {children}
    </span>
  );
}

export type BubbleProps = ComponentProps<'span'>;

/** Comic speech bubble with a tail at the bottom left. */
export function Bubble({ className, ...props }: BubbleProps) {
  return <span className={cn('nl-bubble', className)} {...props} />;
}
