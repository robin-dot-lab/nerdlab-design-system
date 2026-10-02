import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Bento, Callout, Grid, InfoList, Progress } from '@nerdlab/react';

const meta = {
  title: 'Composants/Affichage',
  component: Callout,
  subcomponents: { Progress, InfoList, Bento },
} satisfies Meta<typeof Callout>;
export default meta;
// Render-only stories mixing several components: args are not typed here.
type Story = StoryObj;

/** Quatre tons. Le ton est aussi dit en mots (texte masqué « Attention : »), jamais par la seule couleur. */
export const Callouts: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 560 }}>
      <Callout title="Données de démonstration">Les chiffres sont générés à partir d’une graine fixe.</Callout>
      <Callout tone="success" title="Export terminé">412 commandes exportées.</Callout>
      <Callout tone="warning" title="Données partielles"><p>La billetterie du 12 n’a pas encore été synchronisée.</p></Callout>
      <Callout tone="error">Le paiement a échoué : la carte a expiré.</Callout>
    </div>
  ),
};

/** `<progress>` natif : avancement d'une tâche. Sans `value`, la barre est indéterminée (immobile si l'utilisateur réduit les animations). */
export const Progresses: Story = {
  render: () => (
    <div className="nl-stack" style={{ maxWidth: 420 }}>
      <Progress value={0.72} label="Import des billets" />
      <Progress value={0.45} label="Inscriptions" />
      <Progress value={0.68} label="Niveau" pixel />
      <Progress label="Synchronisation en cours" />
    </div>
  ),
};

/** Tableau d'infos façon affiche ; libellé au-dessus de la valeur sous 22rem de conteneur. */
export const InfoTable: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <InfoList>
        <InfoList.Item term="Lieu"><b>Nerdlab 378</b> — 12 rue des Pixels, Lyon</InfoList.Item>
        <InfoList.Item term="Date"><Badge>04.27</Badge> ~ <Badge variant="primary">05.01</Badge> · 11h–19h</InfoList.Item>
        <InfoList.Item term="Cadeau">Stickers, tote bag, carte postale holographique</InfoList.Item>
      </InfoList>
    </div>
  ),
};

/** Tuiles bento posées sur une `Grid`. Couleurs bonbon : texte encre ; tuile encre : texte crème. */
export const BentoGrid: Story = {
  render: () => (
    <Grid min="sm" gap={4} style={{ maxWidth: 960 }}>
      <Bento tone="elevated"><Bento.Title>Make money. Without a cut.</Bento.Title><Bento.Foot><span>0 % de commission</span><Badge>Nouveau</Badge></Bento.Foot></Bento>
      <Bento tone="ink"><Bento.Title>Rappels</Bento.Title><Bento.Foot><span>3 événements cette semaine</span></Bento.Foot></Bento>
      <Bento tone="accent"><Bento.Title>40M</Bento.Title><Bento.Foot><span>billets vendus</span></Bento.Foot></Bento>
      <Bento tone="mint" asChild><article><Bento.Title>Ateliers</Bento.Title><Bento.Foot><span>Shader, pixel art, synthé</span></Bento.Foot></article></Bento>
    </Grid>
  ),
};
