'use client';

import { Pause, Play } from '@robin-dot-lab/icons';
import { useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

export interface RibbonProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Words that scroll by. Read once, in order, by assistive tech; the moving copies are hidden from it. */
  items: readonly string[];
  /** Show a pause button (WCAG 2.2.2: moving content must be stoppable). Default true. */
  pausable?: boolean;
  /** Button labels, for translation. The label says what the button will do (not a toggle with aria-pressed). */
  pauseLabel?: string;
  playLabel?: string;
}

/** Scrolling marquee band. Still under reduced motion; pausable otherwise. */
export function Ribbon({ items, pausable = true, pauseLabel, playLabel, className, ...props }: RibbonProps) {
  const { t } = useMessages();
  const [paused, setPaused] = useState(false);
  // The track slides by half its width: two identical halves, each repeated enough to fill wide screens.
  const half = [...items, ...items];
  return (
    <div className={cn('nl-ribbon', pausable && 'nl-ribbon--pausable', paused && 'nl-ribbon--paused', className)} {...props}>
      <p className="nl-visually-hidden">{items.join(' · ')}</p>
      <div className="nl-ribbon__track" aria-hidden="true">
        {[...half, ...half].map((word, i) => <span key={i}>{word}</span>)}
      </div>
      {pausable && (
        <button type="button" className="nl-ribbon__pause" aria-label={paused ? playLabel ?? t.resumeScrolling : pauseLabel ?? t.pauseScrolling} onClick={() => setPaused((p) => !p)}>
          {paused ? <Play /> : <Pause />}
        </button>
      )}
    </div>
  );
}
