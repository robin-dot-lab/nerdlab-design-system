'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

export const avatarVariants = cva('nl-avatar', {
  variants: {
    size: { sm: 'nl-avatar--sm', md: '', lg: 'nl-avatar--lg' },
    tone: { lavender: '', mint: 'nl-avatar--mint', accent: 'nl-avatar--accent', primary: 'nl-avatar--primary', secondary: 'nl-avatar--secondary' },
  },
  defaultVariants: { size: 'md', tone: 'lavender' },
});

export interface AvatarProps extends Omit<ComponentProps<'span'>, 'children'>, VariantProps<typeof avatarVariants> {
  /** The person's name: the accessible name, and the source of the initials. */
  name: string;
  src?: string;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** A person: their photo, or their initials when there is none or it fails to load. */
export function Avatar({ name, src, size, tone, className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const photo = src && !failed;
  return (
    <span className={cn(avatarVariants({ size, tone }), className)} {...(photo ? {} : { role: 'img', 'aria-label': name })} {...props}>
      {photo ? <img src={src} alt={name} onError={() => setFailed(true)} /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}

export type AvatarGroupProps = ComponentProps<'div'>;

/** Overlapping avatars, e.g. the people attending. Give it an aria-label that sums them up. */
export function AvatarGroup({ className, ...props }: AvatarGroupProps) {
  return <div role="group" className={cn('nl-avatar-group', className)} {...props} />;
}
