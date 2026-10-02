import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

/** Colour keys are token names (closed set), never free colours: the skin owns the colour. */
export type SwatchToken = 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'primary' | 'secondary' | 'accent' | 'tomato' | 'mint' | 'lavender';

export interface ToggleChipProps extends Omit<ComponentProps<'button'>, 'onChange'> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  swatch?: SwatchToken;
}

/** On/off filter button (aria-pressed) with an optional colour key. */
export function ToggleChip({ pressed, onPressedChange, swatch, className, children, ...props }: ToggleChipProps) {
  return (
    <button type="button" className={cn('nl-chip', className)} aria-pressed={pressed} onClick={() => onPressedChange(!pressed)} {...props}>
      {swatch && <span className={`nl-swatch nl-swatch--${swatch}`} aria-hidden="true" />}
      {children}
    </button>
  );
}
