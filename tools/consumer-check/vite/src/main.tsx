// A consumer app written from the README only: skin + fonts, components, a chart, icons, palettes, locale.
import '@robin-dot-lab/css-candy/fonts.css';
import '@robin-dot-lab/css-candy/candy.css';
import { BarList, ChartCard } from '@robin-dot-lab/charts';
import { Calendar, Plus } from '@robin-dot-lab/icons';
import { MessageList } from '@robin-dot-lab/mail';
import {
  Badge, Button, Callout, Container, DatePicker, Dialog, DialogActions, DialogTrigger, Field, I18nProvider, parseDate, Section, Select, Stack, Switch, Window,
} from '@robin-dot-lab/react';
import palettes from '@robin-dot-lab/tokens/palettes.json';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [palette, setPalette] = useState(document.documentElement.dataset.palette ?? 'candy');
  const [dark, setDark] = useState(false);
  const choose = (p: string) => { document.documentElement.dataset.palette = p; setPalette(p); };
  const toggle = (on: boolean) => { document.documentElement.dataset.theme = on ? 'dark' : 'light'; setDark(on); };
  return (
    <Container asChild>
      <main>
        <Section>
          <Stack gap={6}>
            <h1 className="nl-display">Consumer test</h1>
            <Field label="Palette"><Select value={palette} onChange={(e) => choose(e.currentTarget.value)}>{palettes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
            <Switch checked={dark} onChange={(e) => toggle(e.currentTarget.checked)}>Dark theme</Switch>
            <Window>
              <Window.Bar color="primary">HELLO.EXE</Window.Bar>
              <Window.Body>
                <Stack>
                  <p>Installed from GitHub Packages. <Badge variant="mint">Vite</Badge></p>
                  <DialogTrigger>
                    <Button variant="primary"><Plus /> Join the party</Button>
                    <Dialog title="RSVP.EXE">
                      {({ close }) => (<><p>See you on the 27th, in Lyon.</p><DialogActions><Button onClick={close}>Close</Button></DialogActions></>)}
                    </Dialog>
                  </DialogTrigger>
                </Stack>
              </Window.Body>
            </Window>
            <DatePicker label="Event date" defaultValue={parseDate('2026-04-27')} />
            <Callout tone="success" title="It works"><p><Calendar /> Components, icons, charts and palettes from the registry.</p></Callout>
            <MessageList messages={[{ id: 'm1', from: { name: 'Pixel Party', address: 'hello@pixelparty.example' }, subject: 'Your ticket', preview: 'See you on the 27th.', date: Date.now() - 120_000, unread: true }]} selectedId="m1" />
            <ChartCard title="Tickets">
              <BarList title="Tickets per event" unit="tickets" items={[
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
createRoot(document.getElementById('root')!).render(<StrictMode><I18nProvider locale="en-GB"><App /></I18nProvider></StrictMode>);
