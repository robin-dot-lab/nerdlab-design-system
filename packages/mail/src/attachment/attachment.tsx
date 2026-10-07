'use client';

import { Download, File, FileArchive, FileImage, FileText } from '@robin-dot-lab/icons';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';
import { useMailMessages } from '../lib/i18n.js';

export interface Attachment {
  /** File name, shown and used to name the download. */
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type: picks the icon. */
  type: string;
  /** Where to download it from. */
  href: string;
}

const ARCHIVE = /zip|x-tar|gzip|x-7z|x-rar|compressed/;
const TEXT = /^text\/|pdf|msword|officedocument|opendocument|rtf|json|xml/;
const iconFor = (type: string) =>
  type.startsWith('image/') ? FileImage : ARCHIVE.test(type) ? FileArchive : TEXT.test(type) ? FileText : File;

/** A byte count in the locale: 980 B, 12.4 kB, 3.1 MB (decimal units, as the unit names say). */
export function formatFileSize(bytes: number, locale: string) {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;
  let value = bytes, i = 0;
  while (value >= 1000 && i < units.length - 1) { value /= 1000; i++; }
  return new Intl.NumberFormat(locale, { style: 'unit', unit: units[i], unitDisplay: 'short', maximumFractionDigits: i === 0 ? 0 : 1 }).format(value);
}

export interface AttachmentChipProps extends Omit<ComponentProps<'a'>, 'href' | 'children' | 'download' | 'type'> {
  attachment: Attachment;
}

/** A downloadable attachment: icon by type, name, size in the locale. The link is named “<file>, <size>, download”:
 *  its name starts with the text it shows (WCAG 2.5.3, label in name). */
export function AttachmentChip({ attachment: a, className, ...props }: AttachmentChipProps) {
  const { locale, t } = useMailMessages();
  const Icon = iconFor(a.type);
  const size = formatFileSize(a.size, locale);
  return (
    <a className={cn('nl-attachment', className)} href={a.href} download={a.name} aria-label={t.download(a.name, size)} {...props}>
      <Icon className="nl-attachment__icon" />
      <span className="nl-attachment__name">{a.name}</span>
      {/* A space between name and size: the link's text reads "name size", which its name starts with. */}{' '}
      <span className="nl-attachment__size">{size}</span>
      <Download className="nl-attachment__download" />
    </a>
  );
}

export interface AttachmentListProps extends Omit<ComponentProps<'ul'>, 'children'> {
  attachments: readonly Attachment[];
}

/** The attachments of a message, as a named list of `AttachmentChip`s. Renders nothing when there is none. */
export function AttachmentList({ attachments, className, ...props }: AttachmentListProps) {
  const { t } = useMailMessages();
  if (attachments.length === 0) return null;
  return (
    <ul className={cn('nl-attachments', className)} aria-label={t.attachments} {...props}>
      {attachments.map((a) => <li key={a.href}><AttachmentChip attachment={a} /></li>)}
    </ul>
  );
}
