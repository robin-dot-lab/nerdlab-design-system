// No "use client": useId is a server-safe hook, and nothing here uses state, effects or context.
// Size and colour come from the skin (.nl-icon, .nl-icon--sm, .nl-icon--lg; stroke follows currentColor),
// so this file sets no width, height, style or colour value.
import { useId, type ReactNode, type SVGProps } from 'react';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'style' | 'children'> {
  /** md (default) adds no class; sm and lg add nl-icon--sm / nl-icon--lg. */
  size?: IconSize;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  title?: string;
  children?: ReactNode;
}

const SIZE_CLASS: Record<IconSize, string | undefined> = { sm: 'nl-icon--sm', md: undefined, lg: 'nl-icon--lg' };

export function Icon({ size = 'md', title, className, children, ...props }: IconProps) {
  const titleId = useId();
  const classes = ['nl-icon', SIZE_CLASS[size], className].filter(Boolean).join(' ');
  const a11y = title
    ? { role: 'img', 'aria-labelledby': titleId }
    : { 'aria-hidden': true as const };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...a11y}
      {...props}
      className={classes}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {children}
    </svg>
  );
}
