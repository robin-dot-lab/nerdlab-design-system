// Next.js App Router consumer: the layout and the page are React Server Components. They import the
// kit straight from the packages, with no 'use client' file of their own: the kit's modules must
// carry the directive where they need it (ADR-008), or the build or the render fails.
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import { I18nProvider } from '@robin-dot-lab/react';
import type { ReactNode } from 'react';

export const metadata = { title: 'Nerdlab consumer test (Next.js)', icons: { icon: 'data:,' } };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-palette="ink" data-theme="light">
      <body><I18nProvider locale="fr-FR">{children}</I18nProvider></body>
    </html>
  );
}
