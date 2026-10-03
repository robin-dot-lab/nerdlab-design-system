// Dashboard pieces built from the step-9 components: order details, new-event form, next-event tiles, goals help.
import { Plus } from '@robin-dot-lab/icons';
import {
  Avatar, AvatarGroup, Badge, Bento, Burst, Button, Callout, Checkbox, Cluster, ComboBox, ComboBoxItem, DatePicker, Dialog, DialogActions,
  DialogTrigger, Divider, Drawer, DrawerFooter, Field, InfoList, Input, parseDate, Pill, Popover, Progress, Radio, RadioGroup, Select,
  Skeleton, Stack, Sticker, StickerSmall, Textarea,
} from '@robin-dot-lab/react';
import type { FormEvent } from 'react';
import { catById, CATS, STATUS, type Order } from './data';
import { eur, int } from './format';

/** The order number opens its details in a modal window. */
export function OrderDetails({ order }: { order: Order }) {
  const status = STATUS[order.status];
  return (
    <DialogTrigger>
      <Button size="sm" variant="ghost" className="order-id" aria-label={`Détails de la commande ${order.id}`}>{order.id}</Button>
      <Dialog title={`ORDER_${order.id}.TXT`} barColor="secondary">
        {({ close }) => (
          <>
            <InfoList>
              <InfoList.Item term="Client">{order.client}</InfoList.Item>
              <InfoList.Item term="Événement">{order.event}</InfoList.Item>
              <InfoList.Item term="Catégorie">{catById[order.cat].name}</InfoList.Item>
              <InfoList.Item term="Billets">{int.format(order.qty)}</InfoList.Item>
              <InfoList.Item term="Montant">{eur.format(order.amount)}</InfoList.Item>
              <InfoList.Item term="Statut"><Badge variant={status.variant}><span aria-hidden="true">{status.icon}</span> {status.label}</Badge></InfoList.Item>
              <InfoList.Item term="Date">{order.date.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</InfoList.Item>
            </InfoList>
            <DialogActions><Button variant="primary" onClick={close}>Fermer</Button></DialogActions>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}

const VENUES = ['Nerdlab 378', 'La Halle aux Pixels', 'Le Sucre', 'Le Périscope', 'Halle Tony Garnier'];
const ATTENDEES = ['Sacha D.', 'Léa M.', 'Noah K.', 'Yuki M.'];
const TASKS = [
  { label: 'Réserver la salle', done: true }, { label: 'Annoncer l’événement', done: true }, { label: 'Ouvrir la billetterie', done: true },
  { label: 'Commander les stickers', done: true }, { label: 'Confirmer les intervenants', done: true }, { label: 'Préparer les tote bags', done: true },
  { label: 'Tester le vidéoprojecteur', done: false }, { label: 'Briefer les bénévoles', done: false }, { label: 'Imprimer les badges', done: false },
];

/** Header button: a draft event form in a modal window. */
export function NewEventDialog({ onCreate }: { onCreate: (title: string) => void }) {
  return (
    <DialogTrigger>
      <Button><Plus /> Nouvel événement</Button>
      <Dialog title="NEW_EVENT.EXE" size="lg">
        {({ close }) => {
          const submit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onCreate(String(new FormData(e.currentTarget).get('title')));
            close();
          };
          return (
            <form className="nl-stack" onSubmit={submit}>
              <Callout title="Brouillon">L’événement reste invisible du public tant qu’il n’est pas publié.</Callout>
              <Field label="Titre"><Input name="title" required placeholder="Pixel Party" /></Field>
              <div className="form-row">
                <DatePicker label="Date" name="date" defaultValue={parseDate('2026-05-16')} isRequired />
                <ComboBox label="Lieu" name="venue" placeholder="Tape pour chercher…" allowsCustomValue>
                  {VENUES.map((v) => <ComboBoxItem key={v} id={v}>{v}</ComboBoxItem>)}
                </ComboBox>
              </div>
              <Field label="Catégorie">
                <Select name="cat" defaultValue="design">{CATS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
              </Field>
              <RadioGroup legend="Format" name="format" defaultValue="onsite" orientation="horizontal">
                <Radio value="onsite">Sur place</Radio>
                <Radio value="online">En ligne</Radio>
                <Radio value="hybrid">Hybride</Radio>
              </RadioGroup>
              <Field label="Description" help="Deux ou trois phrases suffisent."><Textarea name="description" /></Field>
              <DialogActions><Button onClick={close}>Annuler</Button><Button type="submit" variant="primary">Créer le brouillon</Button></DialogActions>
            </form>
          );
        }}
      </Dialog>
    </DialogTrigger>
  );
}

/** Next event: three bento tiles (promo, practical info, preparation). */
export function NextEvent() {
  const done = 6, tasks = 9;
  return (
    <section className="next" aria-labelledby="next-title">
      <h2 id="next-title" className="nl-visually-hidden">Prochain événement</h2>
      <Bento tone="accent" asChild>
        <article className="next__promo">
          <div className="nl-stack nl-gap-3">
            <Cluster gap={3}><span className="nl-eyebrow">Prochain événement</span><Burst tone="primary">NEW</Burst></Cluster>
            <Bento.Title>Figma Pixel Party</Bento.Title>
            <Cluster gap={2}><Pill filled>Atelier</Pill><Pill>Goodies</Pill><Pill>Food truck</Pill></Cluster>
            <Cluster gap={2}>
              <AvatarGroup aria-label={`Derniers inscrits : ${ATTENDEES.join(', ')}`}>
                {ATTENDEES.map((n, i) => <Avatar key={n} name={n} size="sm" tone={(['lavender', 'mint', 'primary', 'secondary'] as const)[i]} />)}
              </AvatarGroup>
              <span className="next__attendees">+ 21 inscrits</span>
            </Cluster>
          </div>
          <Bento.Foot><span>Sam. 27 avril · Lyon</span><Sticker tone="primary" tilt="right">25<StickerSmall>places</StickerSmall></Sticker></Bento.Foot>
        </article>
      </Bento>
      <Bento tone="elevated" asChild>
        <article>
          <Bento.Title>Infos pratiques</Bento.Title>
          <InfoList>
            <InfoList.Item term="Lieu"><b>Nerdlab 378</b> — 12 rue des Pixels, Lyon</InfoList.Item>
            <InfoList.Item term="Horaires">11 h – 19 h</InfoList.Item>
            <InfoList.Item term="Cadeau">Stickers et tote bag</InfoList.Item>
          </InfoList>
        </article>
      </Bento>
      <Bento asChild>
        <article>
          <Bento.Title>Préparation</Bento.Title>
          <div className="nl-stack nl-gap-2">
            <Progress value={done} max={tasks} label="Préparation de la Pixel Party" />
            <Cluster justify="between" gap={2}>
              <span className="nl-help">{done} tâches sur {tasks}</span>
              <DialogTrigger>
                <Button size="sm" variant="ghost">Voir la checklist</Button>
                <Drawer title="Checklist · Pixel Party">
                  {({ close }) => (
                    <Stack gap={3}>
                      {TASKS.map((t) => <Checkbox key={t.label} defaultChecked={t.done}>{t.label}</Checkbox>)}
                      <DrawerFooter><Button variant="primary" onClick={close}>Fermer la checklist</Button></DrawerFooter>
                    </Stack>
                  )}
                </Drawer>
              </DialogTrigger>
            </Cluster>
            <Divider />
            <span className="nl-help">Synchronisation de la billetterie…</span>
            <Progress label="Synchronisation de la billetterie" pixel />
            <div aria-busy="true" aria-label="Dernières ventes (en cours de synchronisation)" role="region" className="sync">
              <Skeleton lines={2} />
            </div>
          </div>
        </article>
      </Bento>
    </section>
  );
}

/** How goals are set: a popover next to the goals list. */
export function GoalsHelp() {
  return (
    <DialogTrigger>
      <Button size="sm" variant="ghost">Comment sont-ils fixés ?</Button>
      <Popover title="Objectifs" placement="bottom">
        <p>Objectifs mensuels de l’équipe, ramenés à la période affichée. La note moyenne vise 5 ★ quelle que soit la période.</p>
      </Popover>
    </DialogTrigger>
  );
}
