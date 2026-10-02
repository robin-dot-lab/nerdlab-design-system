import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, Dialog, DialogActions, DialogTrigger, Menu, MenuItem, MenuSeparator, MenuTrigger, Popover } from './index.js';

describe('Dialog', () => {
  it('opens from a Button, is named by its title, traps focus and closes on Escape', async () => {
    render(
      <DialogTrigger>
        <Button>Supprimer</Button>
        <Dialog title="Supprimer la commande ?" barColor="primary">
          {({ close }) => <DialogActions><Button onClick={close}>Annuler</Button></DialogActions>}
        </Dialog>
      </DialogTrigger>,
    );
    const trigger = screen.getByRole('button', { name: 'Supprimer' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Supprimer la commande ?' });
    expect(dialog.className).toBe('nl-window nl-dialog');
    expect(dialog.querySelector('.nl-window__bar--primary')).toBeTruthy();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it('the close button and a child close() both close it', async () => {
    render(
      <DialogTrigger>
        <Button>Ouvrir</Button>
        <Dialog title="Infos">{({ close }) => <Button onClick={close}>OK</Button>}</Dialog>
      </DialogTrigger>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await userEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('alertdialog role and controlled use', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog title="Attention" role="alertdialog" isOpen onOpenChange={onOpenChange}>Sûr ?</Dialog>);
    expect(screen.getByRole('alertdialog', { name: 'Attention' })).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('Popover', () => {
  it('opens next to its trigger as a named, non-modal dialog', async () => {
    render(
      <DialogTrigger>
        <Button>Détails</Button>
        <Popover title="Billet">Valable une journée.</Popover>
      </DialogTrigger>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Détails' }));
    const dialog = screen.getByRole('dialog', { name: 'Billet' });
    expect(dialog.className).toBe('nl-popover__dialog');
    expect(dialog.closest('.nl-popover')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('without a title it takes its name from label', async () => {
    render(<DialogTrigger><Button>Aide</Button><Popover label="Aide sur les filtres">Texte</Popover></DialogTrigger>);
    await userEvent.click(screen.getByRole('button', { name: 'Aide' }));
    expect(screen.getByRole('dialog', { name: 'Aide sur les filtres' })).toBeTruthy();
  });
});

describe('Menu', () => {
  it('opens from the keyboard, is named by its button, runs the chosen action', async () => {
    const onAction = vi.fn();
    render(
      <MenuTrigger>
        <Button>Exporter</Button>
        <Menu onAction={onAction}>
          <MenuItem id="csv">CSV</MenuItem>
          <MenuItem id="json">JSON</MenuItem>
          <MenuSeparator />
          <MenuItem id="purge" tone="danger">Vider l’historique</MenuItem>
        </Menu>
      </MenuTrigger>,
    );
    screen.getByRole('button', { name: 'Exporter' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = screen.getByRole('menu', { name: 'Exporter' });
    expect(menu.className).toBe('nl-menu');
    expect(screen.getAllByRole('menuitem').map((i) => i.className)).toEqual(['nl-menu__item', 'nl-menu__item', 'nl-menu__item nl-menu__item--danger']);
    expect(screen.getByRole('separator').className).toBe('nl-menu__separator');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onAction.mock.calls[0]![0]).toBe('json');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });
});
