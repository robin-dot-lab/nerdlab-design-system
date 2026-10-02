import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export const calloutVariants = cva('nl-callout', {
  variants: {
    tone: { info: '', success: 'nl-callout--success', warning: 'nl-callout--warning', error: 'nl-callout--error' },
  },
  defaultVariants: { tone: 'info' },
});

type Tone = NonNullable<VariantProps<typeof calloutVariants>['tone']>;
const ICON: Record<Tone, string> = { info: 'i', success: '✓', warning: '!', error: '×' };
const WORD: Record<Tone, string> = { info: 'Information', success: 'Succès', warning: 'Attention', error: 'Erreur' };

export interface CalloutProps extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof calloutVariants> {
  title?: ReactNode;
  /** Word read before the message, so the tone is not carried by colour alone. Defaults to the tone in French. */
  toneLabel?: string;
}

/**
 * Static message inside the page (a note, a warning about the data). Not announced when it appears:
 * for a message that appears after an action, add role="status" (or role="alert" if it is urgent), or use `Toast`.
 */
export function Callout({ tone, title, toneLabel, className, children, ...props }: CalloutProps) {
  const t: Tone = tone ?? 'info';
  const said = <span className="nl-visually-hidden">{toneLabel ?? WORD[t]} : </span>;
  return (
    <div className={cn(calloutVariants({ tone }), className)} {...props}>
      <span className="nl-callout__icon" aria-hidden="true">{ICON[t]}</span>
      <div className="nl-callout__body">
        {title != null && <p className="nl-callout__title">{said}{title}</p>}
        {title == null && said}
        {children}
      </div>
    </div>
  );
}
