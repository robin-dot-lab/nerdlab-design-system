import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb, Callout, Card, DatePicker, Delta, Grid, I18nProvider, Pagination, parseDate, Stack } from '@robin-dot-lab/react';
import { BarList } from '@robin-dot-lab/charts';

const meta = { title: 'Foundations/Locale' } satisfies Meta;
export default meta;
type Story = StoryObj;

function Sample({ locale, name }: { locale: string; name: string }) {
  return (
    <I18nProvider locale={locale}>
      <Card>
        <Stack gap={4}>
          <h3 className="nl-eyebrow">{name} <code>{locale}</code></h3>
          <Breadcrumb label={`Breadcrumb (${locale})`} items={[{ label: 'Home', href: '#' }, { label: 'Events' }]} />
          <Callout tone="warning" title="Partial data">Ticketing for the 12th is not synced yet.</Callout>
          <p>Revenue <Delta current={1104} previous={1000} /></p>
          <DatePicker label="Event date" defaultValue={parseDate('2026-04-27')} />
          <BarList title={`Top events (${locale})`} unit="tickets" items={[{ id: 'a', label: 'Pixel Party', value: 1240, slot: 1 }, { id: 'b', label: 'Synth Night', value: 860, slot: 2 }]} />
          <Pagination page={2} pages={5} onPageChange={() => {}} label={`Pages (${locale})`} />
        </Stack>
      </Card>
    </I18nProvider>
  );
}

/**
 * The kit's own words (close buttons, pagination, tone words…) and its number and date formats follow
 * React Aria's locale: wrap the app in `<I18nProvider locale="fr-FR">`. French locales get French,
 * every other locale English words with its own formats. Without a provider, the browser's language.
 * The stories use the toolbar's « Locale » (English by default).
 */
export const SideBySide: Story = {
  render: () => (
    <Grid min="sm" gap={4}>
      <Sample locale="en-GB" name="English (UK)" />
      <Sample locale="en-US" name="English (US)" />
      <Sample locale="fr-FR" name="Français" />
    </Grid>
  ),
};
