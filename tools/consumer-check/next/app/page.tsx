import { BarList, ChartCard } from '@robin-dot-lab/charts';
import { Calendar, Plus } from '@robin-dot-lab/icons';
import {
  Badge, Breadcrumb, Button, Callout, Card, Container, DatePicker, Delta, Dialog, DialogTrigger, Meter, Section, Stack,
  StatTile, Tab, TabList, TabPanel, Tabs, Window,
} from '@robin-dot-lab/react';

// A server component: no state, no handlers. Interactive pieces come from the kit's client modules.
export default function Page() {
  return (
    <Container asChild>
      <main>
        <Section>
          <Stack gap={6}>
            <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'Test' }]} />
            <h1 className="nl-display">Consumer test (Next.js)</h1>
            <Window>
              <Window.Bar color="primary">SERVER.EXE</Window.Bar>
              <Window.Body>
                <Stack>
                  <p>Rendu côté serveur. <Badge variant="mint">RSC</Badge></p>
                  <DialogTrigger>
                    <Button variant="primary"><Plus /> Rejoindre la fête</Button>
                    <Dialog title="RSVP.EXE"><p>À bientôt, le 27, à Lyon.</p></Dialog>
                  </DialogTrigger>
                </Stack>
              </Window.Body>
            </Window>
            <StatTile title="TICKETS" label="Billets vendus" value="6 662" meta={<Delta current={110} previous={100} />} />
            <Card><Meter value={0.72} label="Taux de remplissage" /></Card>
            <Tabs defaultSelectedKey="a">
              <TabList aria-label="Vues"><Tab id="a">Aperçu</Tab><Tab id="b">Détail</Tab></TabList>
              <TabPanel id="a">Premier panneau</TabPanel>
              <TabPanel id="b">Second panneau</TabPanel>
            </Tabs>
            {/* No defaultValue here: a CalendarDate is a class instance, which a server component cannot pass to a client one. */}
            <DatePicker label="Date de l’événement" />
            <Callout tone="warning" title="Données partielles"><p><Calendar /> La billetterie du 12 n’est pas synchronisée.</p></Callout>
            <ChartCard title="Billets">
              <BarList title="Billets par événement" unit="billets" items={[
                { id: 'a', label: 'Pixel Party', value: 120, slot: 1 }, { id: 'b', label: 'Synth Night', value: 90, slot: 2 },
                { id: 'c', label: 'Shader Jam', value: 60, slot: 3 }, { id: 'd', label: 'Zine Lab', value: 30, slot: 4 },
              ]} />
            </ChartCard>
          </Stack>
        </Section>
      </main>
    </Container>
  );
}
