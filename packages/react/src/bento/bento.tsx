import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export const bentoVariants = cva('nl-bento', {
  variants: {
    tone: {
      surface: '',
      elevated: 'nl-bento--elevated',
      ink: 'nl-bento--ink',
      primary: 'nl-bento--primary',
      secondary: 'nl-bento--secondary',
      accent: 'nl-bento--accent',
      mint: 'nl-bento--mint',
      lavender: 'nl-bento--lavender',
    },
    /** Ink border and hard shadow like `Card` and `Window`, content stacked at the top (default: the soft product tile). */
    outlined: { true: 'nl-bento--outlined', false: '' },
  },
  defaultVariants: { tone: 'surface', outlined: false },
});

export interface BentoProps extends ComponentProps<'div'>, VariantProps<typeof bentoVariants> {
  /** Render the single child (e.g. `<article>`, `<a>`) with tile styles. */
  asChild?: boolean;
}

function BentoRoot({ className, tone, outlined, asChild = false, ...props }: BentoProps) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className={cn(bentoVariants({ tone, outlined }), className)} {...props} />;
}

export type BentoTitleProps = ComponentProps<'h3'>;

function BentoTitle({ className, ...props }: BentoTitleProps) {
  return <h3 className={cn('nl-bento__title', className)} {...props} />;
}

export type BentoFootProps = ComponentProps<'div'>;

function BentoFoot({ className, ...props }: BentoFootProps) {
  return <div className={cn('nl-bento__foot', className)} {...props} />;
}

/**
 * Soft-shadow tile for bento grids: content at the top, `Bento.Foot` pinned to the bottom.
 * Lay tiles out with `Grid`; the tile is a size container for its own content.
 */
export const Bento = Object.assign(BentoRoot, { Title: BentoTitle, Foot: BentoFoot });
