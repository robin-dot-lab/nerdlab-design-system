import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog, DialogActions, DialogTrigger, Field, Input, Menu, MenuItem, MenuSeparator, MenuTrigger, Popover } from '@robin-dot-lab/react';

const meta = {
  title: 'Components/Overlays',
  component: Dialog,
  subcomponents: { DialogTrigger, Popover, Menu, MenuItem },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

/** Modal dialog: focus is trapped, Escape closes, the page behind is inert, focus returns to the button. */
export const DialogClosed: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="primary">New event</Button>
      <Dialog title="NEW_EVENT.EXE" closeLabel="Close">
        {({ close }) => (
          <form className="nl-stack" onSubmit={(e) => { e.preventDefault(); close(); }}>
            <Field label="Title"><Input autoFocus placeholder="Pixel Party" /></Field>
            <DialogActions><Button onClick={close}>Cancel</Button><Button type="submit" variant="primary">Create</Button></DialogActions>
          </form>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

export const DialogOpen: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="primary">New event</Button>
      <Dialog title="NEW_EVENT.EXE" barColor="secondary" closeLabel="Close">
        {({ close }) => (
          <div className="nl-stack">
            <p>A new event stays in draft until it is published.</p>
            <DialogActions><Button onClick={close}>Cancel</Button><Button variant="primary" onClick={close}>Continue</Button></DialogActions>
          </div>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** Confirmation: `role="alertdialog"`, no closing on outside click, the action says what it destroys. */
export const Confirm: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="tomato">Delete</Button>
      <Dialog title="DELETE.EXE" role="alertdialog" barColor="primary" isDismissable={false} closeLabel="Close">
        {({ close }) => (
          <div className="nl-stack">
            <p>Delete order NL-9206? The customer will not be refunded automatically.</p>
            <DialogActions><Button onClick={close}>Keep</Button><Button variant="tomato" onClick={close}>Delete order</Button></DialogActions>
          </div>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** Non-modal panel anchored to its button. */
export const PopoverOpen: Story = {
  render: () => (
    <div style={{ padding: '24px 24px 200px' }}>
      <DialogTrigger defaultOpen>
        <Button>Ticket details</Button>
        <Popover title="Day ticket" placement="bottom">Valid on 27 April, from 11am to 7pm. Non-refundable, but transferable.</Popover>
      </DialogTrigger>
    </div>
  ),
};

/** Action menu: arrow keys, first-letter type-ahead, Enter; named by its button. */
export const MenuOpen: Story = {
  render: () => (
    <div style={{ padding: '24px 24px 240px' }}>
      <MenuTrigger defaultOpen>
        <Button variant="primary">Export ▾</Button>
        <Menu onAction={() => {}}>
          <MenuItem id="csv">Filtered orders (CSV)</MenuItem>
          <MenuItem id="all">All orders (CSV)</MenuItem>
          <MenuItem id="pdf" isDisabled>PDF report (coming soon)</MenuItem>
          <MenuSeparator />
          <MenuItem id="purge" tone="danger">Clear export history</MenuItem>
        </Menu>
      </MenuTrigger>
    </div>
  ),
};
