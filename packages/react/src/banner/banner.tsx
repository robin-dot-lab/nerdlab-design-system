'use client';

import { Check, Close, ExclamationMark, InfoMark } from '@robin-dot-lab/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ComponentType, ReactNode } from 'react';
import { Button } from '../button/button.js';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

const bannerVariants = cva('nl-banner', {
  variants: { tone: { info: '', success: 'nl-banner--success', warning: 'nl-banner--warning', error: 'nl-banner--error' } },
  defaultVariants: { tone: 'info' },
});

type Tone = NonNullable<VariantProps<typeof bannerVariants>['tone']>;
const ICON: Record<Tone, ComponentType> = { info: InfoMark, success: Check, warning: ExclamationMark, error: Close };

export interface BannerProps extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof bannerVariants> {
  /** Names the region. Defaults to the tone in words (“Warning”). */
  label?: string;
  /** An action next to the message (a link or a small `Button`). */
  action?: ReactNode;
  /** Shows a close button; the application decides whether the banner stays closed on the next visit. */
  onDismiss?: () => void;
  /** Accessible name of the close button. Defaults to “Dismiss”. */
  dismissLabel?: string;
}

/**
 * A site-wide message across the top of the page that stays until it is dealt with or closed (maintenance,
 * an unverified email). Not `Callout` (a message inside the page) nor `Toast` (a message that goes away).
 * A named region; the tone is said in words before the message.
 */
export function Banner({ tone, label, action, onDismiss, dismissLabel, className, children, ...props }: BannerProps) {
  const { t } = useMessages();
  const tn: Tone = tone ?? 'info';
  const Mark = ICON[tn];
  return (
    <div role="region" aria-label={label ?? t.tone[tn]} className={cn(bannerVariants({ tone }), className)} {...props}>
      <span className="nl-banner__icon" aria-hidden="true"><Mark /></span>
      <div className="nl-banner__body">
        <p className="nl-banner__message"><span className="nl-visually-hidden">{t.tone[tn]}{t.colon}</span>{children}</p>
        {action != null && <div className="nl-banner__action">{action}</div>}
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" shape="square" className="nl-banner__close" aria-label={dismissLabel ?? t.dismiss} onClick={onDismiss}>
          <Close />
        </Button>
      )}
    </div>
  );
}
