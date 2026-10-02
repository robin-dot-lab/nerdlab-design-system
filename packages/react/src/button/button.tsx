import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
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
}

export function Button({ className, variant, size, shape, asChild = false, type, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, shape }), className);
  if (asChild) return <Slot className={classes} {...(props as ComponentProps<typeof Slot>)} />;
  return <button type={type ?? 'button'} className={classes} {...props} />;
}
