import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog, DialogActions, DialogTrigger, Field, Input, Menu, MenuItem, MenuSeparator, MenuTrigger, Popover } from '@nerdlab/react';

const meta = {
  title: 'Composants/Fenêtres et menus',
  component: Dialog,
  subcomponents: { DialogTrigger, Popover, Menu, MenuItem },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** Fenêtre modale : focus piégé, Échap ferme, la page derrière est inerte, le focus revient au bouton. */
export const DialogClosed: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="primary">Nouvel événement</Button>
      <Dialog title="NEW_EVENT.EXE">
        {({ close }) => (
          <form className="nl-stack" onSubmit={(e) => { e.preventDefault(); close(); }}>
            <Field label="Titre"><Input autoFocus placeholder="Pixel Party" /></Field>
            <DialogActions><Button onClick={close}>Annuler</Button><Button type="submit" variant="primary">Créer</Button></DialogActions>
          </form>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

export const DialogOpen: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="primary">Nouvel événement</Button>
      <Dialog title="NEW_EVENT.EXE" barColor="secondary">
        {({ close }) => (
          <div className="nl-stack">
            <p>Un événement créé reste en brouillon tant qu’il n’est pas publié.</p>
            <DialogActions><Button onClick={close}>Annuler</Button><Button variant="primary" onClick={close}>Continuer</Button></DialogActions>
          </div>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** Confirmation : `role="alertdialog"`, pas de fermeture au clic extérieur, l'action dit ce qu'elle détruit. */
export const Confirm: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="tomato">Supprimer</Button>
      <Dialog title="DELETE.EXE" role="alertdialog" barColor="primary" isDismissable={false}>
        {({ close }) => (
          <div className="nl-stack">
            <p>Supprimer la commande NL-9206 ? Le client ne sera pas remboursé automatiquement.</p>
            <DialogActions><Button onClick={close}>Garder</Button><Button variant="tomato" onClick={close}>Supprimer la commande</Button></DialogActions>
          </div>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** Panneau non modal ancré à son bouton. */
export const PopoverOpen: Story = {
  render: () => (
    <div style={{ padding: '24px 24px 200px' }}>
      <DialogTrigger defaultOpen>
        <Button>Détails du billet</Button>
        <Popover title="Billet journée" placement="bottom">Valable le 27 avril, de 11 h à 19 h. Non remboursable, mais transférable.</Popover>
      </DialogTrigger>
    </div>
  ),
};

/** Menu d'actions : flèches, saisie de la première lettre, Entrée ; nommé par son bouton. */
export const MenuOpen: Story = {
  render: () => (
    <div style={{ padding: '24px 24px 240px' }}>
      <MenuTrigger defaultOpen>
        <Button variant="primary">Exporter ▾</Button>
        <Menu onAction={() => {}}>
          <MenuItem id="csv">Commandes filtrées (CSV)</MenuItem>
          <MenuItem id="all">Toutes les commandes (CSV)</MenuItem>
          <MenuItem id="pdf" isDisabled>Rapport PDF (bientôt)</MenuItem>
          <MenuSeparator />
          <MenuItem id="purge" tone="danger">Vider l’historique d’export</MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  ),
};
