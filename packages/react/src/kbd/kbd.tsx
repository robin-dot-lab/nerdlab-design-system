import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export type KbdProps = ComponentProps<'kbd'>;

/** A key or a key combination the user types (`<kbd>`). Nest them for a combination: `<Kbd><Kbd>Ctrl</Kbd>+<Kbd>K</Kbd></Kbd>`. */
export function Kbd({ className, ...props }: KbdProps) {
  return <kbd className={cn('nl-kbd', className)} {...props} />;
}
