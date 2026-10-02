import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { Button, Pagination, Search, Stack, Toast } from '@nerdlab/react';

const meta = { title: 'Composants/Pagination, Search et Toast', component: Pagination } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PaginationDemo: Story = {
  name: 'Pagination',
  render: function Render() {
    const [page, setPage] = useState(4);
    return <Stack gap={3}><span className="nl-muted">Page {page} sur 12</span><Pagination page={page} pages={12} onPageChange={setPage} label="Pages des commandes" /></Stack>;
  },
};

export const SearchDemo: Story = {
  name: 'Search',
  render: () => <div style={{ maxWidth: 360 }}><Search label="Rechercher une commande" placeholder="Client, event, n°" /></div>,
};

/** La région `role="status"` existe toujours : le message est annoncé à son apparition, puis se retire seul. */
export const ToastDemo: Story = {
  name: 'Toast',
  render: function Render() {
    const [msg, setMsg] = useState<string | null>(null);
    const dismiss = useCallback(() => setMsg(null), []);
    return <><Button variant="primary" onClick={() => setMsg('64 commandes exportées')}>Exporter</Button><Toast message={msg} onDismiss={dismiss} /></>;
  },
};
