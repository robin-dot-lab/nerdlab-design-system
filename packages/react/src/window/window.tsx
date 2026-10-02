import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export const windowBarVariants = cva('nl-window__bar', {
  variants: {
    color: {
      accent: '',
      primary: 'nl-window__bar--primary',
      secondary: 'nl-window__bar--secondary',
      lavender: 'nl-window__bar--lavender',
      mint: 'nl-window__bar--mint',
    },
  },
  defaultVariants: { color: 'accent' },
});

export type WindowProps = ComponentProps<'div'>;

function WindowRoot({ className, ...props }: WindowProps) {
  return <div className={cn('nl-window', className)} {...props} />;
}

export interface WindowBarProps extends Omit<ComponentProps<'div'>, 'color'>, VariantProps<typeof windowBarVariants> {
  /** Decorative title-bar buttons. Hidden from assistive tech; pass `false` to omit them. */
  controls?: readonly string[] | false;
}

function WindowBar({ className, color, controls = ['_', '□', '×'], children, ...props }: WindowBarProps) {
  return (
    <div className={cn(windowBarVariants({ color }), className)} {...props}>
      <span>{children}</span>
      {controls && controls.length > 0 && (
        <span className="nl-window__controls" aria-hidden="true">
          {controls.map((c, i) => <span key={i}>{c}</span>)}
        </span>
      )}
    </div>
  );
}

export type WindowBodyProps = ComponentProps<'div'>;

function WindowBody({ className, ...props }: WindowBodyProps) {
  return <div className={cn('nl-window__body', className)} {...props} />;
}

/** OS-style card: `<Window><Window.Bar>Title</Window.Bar><Window.Body>…</Window.Body></Window>`. */
export const Window = Object.assign(WindowRoot, { Bar: WindowBar, Body: WindowBody });
