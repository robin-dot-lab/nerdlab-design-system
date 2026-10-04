import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Breadcrumb, Callout, ComboBox, DataTable, DatePicker, Delta, Dialog, I18nProvider, Pagination, parseDate, Ribbon, useLocale,
} from './index.js';

// ADR-023: the kit’s words and formats follow React Aria's locale. English without a provider
// (jsdom's browser language is en-US), French under a French provider, English for any other locale.
describe('locale', () => {
  it('English by default', () => {
    render(<>
      <Pagination page={2} pages={3} onPageChange={() => {}} />
      <Delta current={110} previous={100} />
      <Callout tone="warning">Partial data.</Callout>
    </>);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeTruthy();
    expect(screen.getByText('Up 10%')).toBeTruthy();
    expect(screen.getByText('Warning:', { exact: false }).textContent).toBe('Warning: ');
  });

  it('French under <I18nProvider locale="fr-FR">: words, typography and number formats', () => {
    const { container } = render(
      <I18nProvider locale="fr-FR">
        <Pagination page={2} pages={3} onPageChange={() => {}} />
        <Breadcrumb items={[{ label: 'Accueil' }]} />
        <Delta current={110} previous={100} />
        <Callout tone="warning" title="Données partielles">x</Callout>
        <Ribbon items={['a']} />
        <DataTable caption="Vide" columns={[{ key: 'a', header: 'A' }]} rows={[]} rowKey={(_, i) => i} selectable />
        <DatePicker label="Date" defaultValue={parseDate('2026-04-27')} />
        <ComboBox label="Ville" defaultItems={[]}>{() => null}</ComboBox>
      </I18nProvider>,
    );
    expect(screen.getByRole('button', { name: 'Page précédente' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Fil d’Ariane' })).toBeTruthy();
    expect(screen.getByText('Hausse de 10 %')).toBeTruthy();
    expect(container.querySelector('.nl-callout__title')!.textContent).toBe('Attention : Données partielles');
    expect(screen.getByRole('button', { name: 'Mettre en pause le défilement' })).toBeTruthy();
    expect(screen.getByText('Aucune donnée.')).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Sélectionner toutes les lignes affichées' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Date' }).textContent).toContain('27/04/2026');
  });

  it('a dialog’s close button speaks the provider’s language', () => {
    render(<I18nProvider locale="fr-FR"><Dialog title="Bonjour" isOpen>Corps</Dialog></I18nProvider>);
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeTruthy();
  });

  it('any other locale gets English words with its own formats; a prop still wins', () => {
    render(
      <I18nProvider locale="de-DE">
        <Delta current={110} previous={100} />
        <Pagination page={1} pages={2} onPageChange={() => {}} labels={{ previous: 'Zurück', next: 'Weiter', page: (n) => `Seite ${n}` }} />
      </I18nProvider>,
    );
    expect(screen.getByText('Up 10 %')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Zurück' })).toBeTruthy();
  });

  it('useLocale reads the provider', () => {
    function Show() { return <span>{useLocale().locale}</span>; }
    render(<I18nProvider locale="fr-CA"><Show /></I18nProvider>);
    expect(screen.getByText('fr-CA')).toBeTruthy();
  });
});

// The guard behind AGENTS.md rule 11: words live in lib/i18n.ts only, and the locale comes from React
// Aria, never from a prop of ours.
describe('no hard-coded language', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const SRC = import.meta.dirname;
  const files = (fs.readdirSync(SRC, { recursive: true }) as string[])
    .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f) && f !== path.join('lib', 'i18n.ts'));
  it.each(files)('%s', (file) => {
    const code = fs.readFileSync(path.join(SRC, file), 'utf8').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');
    expect(code, 'a `locale` or `lang` prop').not.toMatch(/^\s*(locale|lang)\??:\s*(string|'fr')/m);
    expect(code, 'a French string literal').not.toMatch(/['`][^'`\n]*[éèêàùç’][^'`\n]*['`]/);
  });
});
