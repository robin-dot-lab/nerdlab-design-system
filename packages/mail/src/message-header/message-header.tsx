'use client';

import { Code, Trash } from '@robin-dot-lab/icons';
import { Button, RelativeTime } from '@robin-dot-lab/react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { useMailMessages } from '../lib/i18n.js';

export interface MailAddress { name?: string; address: string }

export interface MessageHeaderProps extends Omit<ComponentProps<'header'>, 'children'> {
  subject: string;
  from: MailAddress;
  to: MailAddress | readonly MailAddress[];
  date: Date | string | number;
  /** Shows a Delete button. Ask for confirmation in the application if the deletion cannot be undone. */
  onDelete?: () => void;
  /** Shows a View source button (switch the `EmailViewer` to its Source tab, for example). */
  onViewSource?: () => void;
  /** More actions, after the built-in ones. */
  actions?: ReactNode;
  /** Level of the subject heading. Default 2. */
  headingLevel?: 2 | 3 | 4;
}

const show = (a: MailAddress) => (a.name ? `${a.name} <${a.address}>` : a.address);

/** The head of an open message: subject as a heading, From / To / Date as a description list, and its actions. */
export function MessageHeader({ subject, from, to, date, onDelete, onViewSource, actions, headingLevel = 2, className, ...props }: MessageHeaderProps) {
  const { locale, t } = useMailMessages();
  const Heading = `h${headingLevel}` as const;
  const recipients = (Array.isArray(to) ? to : [to]) as readonly MailAddress[];
  const absolute = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(new Date(date));
  return (
    <header className={cn('nl-message-header', className)} {...props}>
      <Heading className="nl-message-header__subject">{subject || t.noSubject}</Heading>
      <dl className="nl-message-header__meta">
        <div><dt>{t.from}</dt><dd>{show(from)}</dd></div>
        <div><dt>{t.to}</dt><dd>{recipients.map(show).join(', ')}</dd></div>
        <div><dt>{t.date}</dt><dd>{absolute} (<RelativeTime date={date} tooltip={false} />)</dd></div>
      </dl>
      {(onDelete || onViewSource || actions) && (
        <div className="nl-message-header__actions">
          {onViewSource && <Button size="sm" onClick={onViewSource}><Code /> {t.viewSource}</Button>}
          {onDelete && <Button size="sm" variant="tomato" onClick={onDelete}><Trash /> {t.delete}</Button>}
          {actions}
        </div>
      )}
    </header>
  );
}
