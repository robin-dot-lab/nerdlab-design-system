'use client';

import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Pressable } from 'react-aria-components';

/**
 * React Aria triggers need a pressable child. Our `Button` is a native <button>, so the first child
 * is wrapped in `Pressable`, which forwards press, focus and ARIA props to it. The rest is the overlay.
 */
export function withPressableTrigger(children: ReactNode): ReactNode[] {
  const [trigger, ...rest] = Children.toArray(children);
  if (!isValidElement(trigger)) throw new Error('The first child of a trigger must be an element, e.g. <Button>.');
  return [<Pressable key="trigger">{trigger as ReactElement<Record<string, unknown>, string>}</Pressable>, ...rest];
}
