'use client';

import { useLocale } from '@robin-dot-lab/react';

/**
 * The mail package's own words (ADR-023): they follow React Aria's locale like the rest of the kit.
 * French locales get French, every other locale English. Components take props to replace any of them.
 */
const en = {
  messages: 'Messages',
  noMessages: 'No messages yet',
  noMessagesHint: 'Mail sent to this address shows up here.',
  loadingMessages: 'Loading messages',
  unread: 'Unread',
  attachment: 'Has attachments',
  noSubject: '(no subject)',
  from: 'From',
  to: 'To',
  date: 'Date',
  delete: 'Delete',
  viewSource: 'View source',
  html: 'HTML',
  text: 'Text',
  source: 'Source',
  views: 'Message views',
  emailContent: 'Email content',
  remoteImagesBlocked: 'Remote images are blocked to protect your privacy.',
  showImages: 'Show images',
  noText: 'This message has no text version.',
  noHtml: 'This message has no HTML version.',
  attachments: 'Attachments',
  download: (file: string) => `Download ${file}`,
  address: 'Address',
  copyAddress: 'Copy address',
  unreadCount: (n: number) => (n === 1 ? '1 unread message' : `${n} unread messages`),
  actions: 'Actions',
  extend: 'Extend',
  rename: 'Rename',
  deleteAddress: 'Delete address',
  active: 'Receiving mail',
  expired: 'Expired',
  addressActions: (address: string) => `Actions for ${address}`,
};

export type MailMessages = typeof en;

const fr: MailMessages = {
  messages: 'Messages',
  noMessages: 'Aucun message pour l’instant',
  noMessagesHint: 'Les mails envoyés à cette adresse arrivent ici.',
  loadingMessages: 'Chargement des messages',
  unread: 'Non lu',
  attachment: 'Avec pièces jointes',
  noSubject: '(sans objet)',
  from: 'De',
  to: 'À',
  date: 'Date',
  delete: 'Supprimer',
  viewSource: 'Voir la source',
  html: 'HTML',
  text: 'Texte',
  source: 'Source',
  views: 'Vues du message',
  emailContent: 'Contenu du mail',
  remoteImagesBlocked: 'Les images distantes sont bloquées pour protéger votre vie privée.',
  showImages: 'Afficher les images',
  noText: 'Ce message n’a pas de version texte.',
  noHtml: 'Ce message n’a pas de version HTML.',
  attachments: 'Pièces jointes',
  download: (file) => `Télécharger ${file}`,
  address: 'Adresse',
  copyAddress: 'Copier l’adresse',
  unreadCount: (n) => (n <= 1 ? `${n} message non lu` : `${n} messages non lus`),
  actions: 'Actions',
  extend: 'Prolonger',
  rename: 'Renommer',
  deleteAddress: 'Supprimer l’adresse',
  active: 'Reçoit les mails',
  expired: 'Expirée',
  addressActions: (address) => `Actions pour ${address}`,
};

/** The active locale and the mail words for it. */
export function useMailMessages(): { locale: string; t: MailMessages } {
  const { locale } = useLocale();
  return { locale, t: locale.toLowerCase().startsWith('fr') ? fr : en };
}
