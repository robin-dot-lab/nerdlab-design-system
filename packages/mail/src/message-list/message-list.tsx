'use client';

import { Inbox, Paperclip } from '@robin-dot-lab/icons';
import { EmptyState, RelativeTime, Skeleton } from '@robin-dot-lab/react';
import { useEffect, type ReactNode } from 'react';
import { ListBox, ListBoxItem, type Key, type Selection } from 'react-aria-components';
import { cn } from '../lib/cn.js';
import { useMailMessages } from '../lib/i18n.js';

/** What the list shows of a message. */
export interface MessageSummary {
  id: string;
  /** Sender: a display name and/or an address. */
  from: { name?: string; address: string };
  subject: string;
  /** First words of the body; the skin cuts it to one line. */
  preview?: string;
  /** Reception date (Date, ISO string or timestamp). */
  date: Date | string | number;
  unread?: boolean;
  hasAttachments?: boolean;
}

export interface MessageListItemProps {
  message: MessageSummary;
}

/**
 * One message in a `MessageList`: sender, subject, preview, relative time, attachment mark. Unread: bold, a dot,
 * and “Unread” in words; selected: the skin marks `[data-selected]`. The absolute date is in its text for
 * screen readers (the relative time has no tooltip inside a list item, so nothing in the row takes focus).
 */
export function MessageListItem({ message: m }: MessageListItemProps) {
  const { locale, t } = useMailMessages();
  const sender = m.from.name || m.from.address;
  const absolute = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(m.date));
  return (
    <ListBoxItem id={m.id} textValue={`${sender} ${m.subject}`} className={cn('nl-message', m.unread && 'nl-message--unread')}>
      <span className="nl-message__dot" aria-hidden="true" />
      <span className="nl-message__from">{sender}</span>
      <span className="nl-message__time"><RelativeTime date={m.date} tooltip={false} /><span className="nl-visually-hidden">, {absolute}</span></span>
      <span className="nl-message__subject">{m.subject || t.noSubject}</span>
      {m.preview && <span className="nl-message__preview">{m.preview}</span>}
      <span className="nl-message__flags">
        {m.unread && <span className="nl-visually-hidden">{t.unread}</span>}
        {m.hasAttachments && <Paperclip size="sm" title={t.attachment} />}
      </span>
    </ListBoxItem>
  );
}

export interface MessageListProps {
  messages: readonly MessageSummary[];
  /** Selected message (controlled). */
  selectedId?: string | null;
  onSelectionChange?: (id: string) => void;
  /** Accessible name. Defaults to “Messages”. */
  'aria-label'?: string;
  /** Skeleton rows and a polite “Loading messages” status, instead of the list. */
  loading?: boolean;
  /** Shown when there is no message. Defaults to an `EmptyState`. */
  empty?: ReactNode;
  /**
   * j / k select the next / previous message from anywhere on the page, except while typing in a field or with
   * a modifier key held. ↑ / ↓ always work inside the list.
   */
  shortcuts?: boolean;
  className?: string;
  /** Renders each message; defaults to `<MessageListItem message={m} />`. Return a `MessageListItem`. */
  children?: (message: MessageSummary) => ReactNode;
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(?:INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * Messages of a mailbox, one selected at a time: a React Aria ListBox (a list of options to pick from; the
 * actions live in `MessageHeader`, so rows hold no controls and a grid is not needed). Arrow keys, Home/End and
 * type-ahead come with it; `shortcuts` adds j / k.
 */
export function MessageList({
  messages, selectedId, onSelectionChange, 'aria-label': label, loading = false, empty, shortcuts = false, className, children,
}: MessageListProps) {
  const { t } = useMailMessages();

  useEffect(() => {
    if (!shortcuts || loading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return;
      const step = e.key === 'j' ? 1 : e.key === 'k' ? -1 : 0;
      if (!step || messages.length === 0) return;
      const at = messages.findIndex((m) => m.id === selectedId);
      const next = messages[Math.min(messages.length - 1, Math.max(0, at === -1 ? 0 : at + step))]!;
      e.preventDefault();
      onSelectionChange?.(next.id);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcuts, loading, messages, selectedId, onSelectionChange]);

  if (loading) {
    return (
      <div className={cn('nl-message-list', 'nl-message-list--loading', className)} aria-busy="true">
        <span role="status" className="nl-visually-hidden">{t.loadingMessages}</span>
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="nl-message nl-message--skeleton"><Skeleton lines={3} /></div>)}
      </div>
    );
  }
  return (
    <ListBox
      aria-label={label ?? t.messages}
      className={cn('nl-message-list', className)}
      items={messages}
      selectionMode="single"
      disallowEmptySelection={selectedId != null}
      selectedKeys={selectedId != null ? [selectedId] : []}
      onSelectionChange={(keys: Selection) => {
        const [key] = keys === 'all' ? [] : [...keys];
        if (key != null) onSelectionChange?.(String(key as Key));
      }}
      renderEmptyState={() => empty ?? <EmptyState icon={<Inbox />} title={t.noMessages} description={t.noMessagesHint} headingLevel={3} />}
    >
      {children ?? ((m) => <MessageListItem message={m} />)}
    </ListBox>
  );
}
