import { Check, Close, ExclamationMark, InfoMark } from '@robin-dot-lab/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ComponentType, ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export const calloutVariants = cva('nl-callout', {
  variants: {
    tone: { info: '', success: 'nl-callout--success', warning: 'nl-callout--warning', error: 'nl-callout--error' },
  },
  defaultVariants: { tone: 'info' },
});

type Tone = NonNullable<VariantProps<typeof calloutVariants>['tone']>;
const ICON: Record<Tone, ComponentType> = { info: InfoMark, success: Check, warning: ExclamationMark, error: Close };
const WORD: Record<'fr' | 'en', Record<Tone, string>> = {
  fr: { info: 'Information', success: 'Succès', warning: 'Attention', error: 'Erreur' },
  en: { info: 'Info', success: 'Success', warning: 'Warning', error: 'Error' },
};

export interface CalloutProps extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof calloutVariants> {
  title?: ReactNode;
  /** Word read before the message, so the tone is not carried by colour alone. Defaults to the tone in `lang`. */
  toneLabel?: string;
  /** Language of the default tone word and its punctuation (« Attention : » / "Warning: "). Default 'fr'. */
  lang?: 'fr' | 'en';
}

/**
 * Static message inside the page (a note, a warning about the data). Not announced when it appears:
 * for a message that appears after an action, add role="status" (or role="alert" if it is urgent), or use `Toast`.
 */
export function Callout({ tone, title, toneLabel, lang = 'fr', className, children, ...props }: CalloutProps) {
  const t: Tone = tone ?? 'info';
  const Mark = ICON[t];
  const said = <span className="nl-visually-hidden">{toneLabel ?? WORD[lang][t]}{lang === 'fr' ? ' : ' : ': '}</span>;
  return (
    <div className={cn(calloutVariants({ tone }), className)} {...props}>
      <span className="nl-callout__icon" aria-hidden="true"><Mark /></span>
      <div className="nl-callout__body">
        {title != null && <p className="nl-callout__title">{said}{title}</p>}
        {title == null && said}
        {children}
      </div>
    </div>
  );
}
