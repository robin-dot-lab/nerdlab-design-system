import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useState } from 'react';
import { Button, Pagination, Search, Stack, Toast } from '@robin-dot-lab/react';

const meta = { title: 'Components/Pagination, Search and Toast', component: Pagination } satisfies Meta<typeof Pagination>;
export default meta;
// Render-only stories: the components have required props, so args are not typed here.
type Story = StoryObj;

const PAGE_LABELS = { previous: 'Previous page', next: 'Next page', page: (n: number) => `Page ${n}` };

export const PaginationDemo: Story = {
  name: 'Pagination',
  render: function Render() {
    const [page, setPage] = useState(4);
    return <Stack gap={3}><span className="nl-muted">Page {page} of 12</span><Pagination page={page} pages={12} onPageChange={setPage} label="Order pages" labels={PAGE_LABELS} /></Stack>;
  },
};

export const SearchDemo: Story = {
  name: 'Search',
  render: () => <div style={{ maxWidth: 360 }}><Search label="Search orders" placeholder="Customer, event, no." /></div>,
};

/** The `role="status"` region always exists: the message is announced when it appears, then removes itself. */
export const ToastDemo: Story = {
  name: 'Toast',
  render: function Render() {
    const [msg, setMsg] = useState<string | null>(null);
    const dismiss = useCallback(() => setMsg(null), []);
    return <><Button variant="primary" onClick={() => setMsg('64 orders exported')}>Export</Button><Toast message={msg} onDismiss={dismiss} /></>;
  },
};
