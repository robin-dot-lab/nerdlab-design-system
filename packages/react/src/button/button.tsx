import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, MouseEvent } from 'react';
import { cn } from '../lib/cn.js';

export const buttonVariants = cva('nl-btn', {
  variants: {
    variant: {
      default: '',
      primary: 'nl-btn--primary',
      secondary: 'nl-btn--secondary',
      accent: 'nl-btn--accent',
      tomato: 'nl-btn--tomato',
      outline: 'nl-btn--outline',
      ghost: 'nl-btn--ghost',
      pixel: 'nl-btn--pixel',
    },
    size: { sm: 'nl-btn--sm', md: '', lg: 'nl-btn--lg' },
    shape: { pill: '', square: 'nl-btn--square' },
  },
  defaultVariants: { variant: 'default', size: 'md', shape: 'pill' },
});

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the single child (e.g. a link) with button styles instead of a `<button>`. */
  asChild?: boolean;
  /**
   * Work in progress after a press: a spinner replaces the label visually; the button is `aria-busy` and
   * `aria-disabled` (clicks and form submission are ignored) but keeps its focus and its accessible name.
   */
  loading?: boolean;
}

const ignore = (e: MouseEvent) => e.preventDefault();

export function Button({ className, variant, size, shape, asChild = false, loading = false, type, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, shape }), loading && 'nl-btn--loading', className);
  if (asChild) return <Slot className={classes} {...(props as ComponentProps<typeof Slot>)} />;
  if (!loading) return <button type={type ?? 'button'} className={classes} {...props} />;
  // aria-disabled rather than disabled: a disabled button drops focus mid-press and leaves the tab order.
  // The label stays in the accessibility tree (the skin only makes it transparent): the name does not change.
  const { children, onClick: _onClick, ...rest } = props;
  return (
    <button type={type ?? 'button'} className={classes} aria-busy="true" aria-disabled="true" {...rest} onClick={ignore}>
      <span className="nl-btn__label">{children}</span>
      <span className="nl-spinner nl-btn__spinner" aria-hidden="true" />
    </button>
  );
}
