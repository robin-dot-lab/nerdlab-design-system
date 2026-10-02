import { Badge, Button, Cluster, DataTable, MobileNav, Split, Stack, Switch, type DataTableColumn, type DataTableSort } from '@nerdlab/react';
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { BarList } from './charts/BarList';
import { ChartCard, Legend } from './charts/ChartCard';
import { ChartTipProvider } from './charts/ChartTip';
import { Heatmap } from './charts/Heatmap';
import { LineChart } from './charts/LineChart';
import { ShareBar } from './charts/ShareBar';
import { Sparkline } from './charts/Sparkline';
import {
  activeCats, bucket, catById, catColor, CATS, daily, DAYS, DOW, heatGrid, lineData, ORDERS, SLOTS, slice, STATUS, topEvents, totals,
  type CatId, type Filters, type Order,
} from './data';
import { dShort, eur, eurCompact, int, pct, sum } from './format';
import { useTheme } from './hooks';
import { Delta } from './ui/Delta';
import { Meter } from './ui/Meter';
import { Pagination } from './ui/Pagination';
import { SegmentedControl } from './ui/SegmentedControl';
import { StatTile } from './ui/StatTile';
import { Toast } from './ui/Toast';
import { ToggleChip } from './ui/ToggleChip';

const NAV = ['Vue d’ensemble', 'Événements', 'Billets', 'Audience', 'Réglages'];
const PER_PAGE = 8;

const orderColumns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'N°', cell: (o) => <span className="mono">{o.id}</span> },
  { key: 'client', header: 'Client', sortable: true },
  { key: 'event', header: 'Événement', sortable: true },
  { key: 'cat', header: 'Catégorie', sortable: true, cell: (o) => <span className="cat"><i className="key-rect" style={{ background: catColor(o.cat) }} aria-hidden="true" />{catById[o.cat].name}</span> },
  { key: 'qty', header: 'Billets', align: 'end', sortable: true },
  { key: 'amount', header: 'Montant', align: 'end', sortable: true, cell: (o) => eur.format(o.amount) },
  { key: 'status', header: 'Statut', sortable: true, cell: (o) => <Badge variant={STATUS[o.status].variant}><span aria-hidden="true">{STATUS[o.status].icon}</span> {STATUS[o.status].label}</Badge> },
  { key: 'date', header: 'Date', align: 'end', sortable: true, sortValue: (o) => o.date.getTime(), cell: (o) => <span className="mono">{o.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} {o.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span> },
];

export function App() {
  const [theme, setTheme] = useTheme();
  const [filters, setFilters] = useState<Filters>({ range: 30, cats: CATS.map((c) => c.id) });
  const shown = useDeferredValue(filters); // previous render stays on screen while the new slice computes
  const stale = shown !== filters;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<DataTableSort>({ key: 'date', direction: 'descending' });
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  useEffect(() => setPage(1), [filters, query]);

  const cur = useMemo(() => totals(shown), [shown]), prev = useMemo(() => totals(shown, 1), [shown]);
  const line = useMemo(() => lineData(shown), [shown]);
  const events = useMemo(() => topEvents(shown), [shown]);
  const heat = useMemo(() => heatGrid(shown), [shown]);
  const cats = activeCats(shown);
  const vs = `vs ${shown.range} j précédents`;

  const orders = useMemo(() => {
    const from = DAYS - shown.range, q = query.toLowerCase().trim();
    const col = orderColumns.find((c) => c.key === sort.key)!;
    const val = col.sortValue ?? ((o: Order) => o[sort.key as keyof Order] as string | number);
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return ORDERS.filter((o) => o.dayIdx >= from && shown.cats.includes(o.cat) && (!q || (o.id + o.client + o.event).toLowerCase().includes(q)))
      .sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * dir);
  }, [shown, query, sort]);
  const pages = Math.max(1, Math.ceil(orders.length / PER_PAGE));
  const pageRows = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goals = [
    { name: 'Revenu', v: cur.revenue, goal: 165000 * (shown.range / 30), fmt: eurCompact },
    { name: 'Billets', v: cur.tickets, goal: 7600 * (shown.range / 30), fmt: (v: number) => int.format(v) },
    { name: 'Nouveaux membres', v: cur.tickets * 0.21, goal: 3100 * (shown.range / 30), fmt: (v: number) => int.format(v) },
    { name: 'Note moyenne', v: 4.6, goal: 5, fmt: (v: number) => v.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' ★' },
  ];

  const toggleCat = (id: CatId, on: boolean) => setFilters((f) => ({ ...f, cats: on ? CATS.filter((c) => c.id === id || f.cats.includes(c.id)).map((c) => c.id) : f.cats.filter((c) => c !== id) }));
  const exportCsv = () => {
    const csv = ['id;client;event;categorie;billets;montant;statut;date', ...orders.map((o) => [o.id, o.client, o.event, catById[o.cat].name, o.qty, o.amount, STATUS[o.status].label, o.date.toISOString()].join(';'))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `nerdlab-orders-${shown.range}j.csv`; a.click(); URL.revokeObjectURL(a.href);
    setToast(`${orders.length} commandes exportées`);
  };
  const themeSwitch = <Switch checked={theme === 'dark'} onChange={(e) => setTheme(e.currentTarget.checked ? 'dark' : 'light')}>Thème sombre</Switch>;

  return (
    <ChartTipProvider>
      <div className="shell">
        <aside className="side">
          <a className="logo" href="#top"><span className="logo__mark" aria-hidden="true">N</span><span className="logo__name">Nerdlab Events</span></a>
          <nav aria-label="Navigation principale" className="side__nav">
            {NAV.map((n, i) => <a key={n} href="#top" aria-current={i === 0 ? 'page' : undefined}>{n}</a>)}
          </nav>
          <div className="side__theme">{themeSwitch}</div>
          <MobileNav className="side__mobile" label="Menu">{NAV.map((n) => <a key={n} href="#top">{n}</a>)}</MobileNav>
        </aside>

        <main className="main" id="top">
          <header className="top">
            <div><span className="nl-eyebrow nl-muted">Nerdlab Events · Analytics</span><h1 className="nl-display">Dashboard<span className="dot">.</span></h1></div>
            <Cluster gap={3}><span className="top__theme">{themeSwitch}</span><Button variant="primary" onClick={exportCsv}>Exporter CSV</Button></Cluster>
          </header>

          <section className="filters" aria-label="Filtres">
            <SegmentedControl label="Période" value={filters.range} onChange={(range) => setFilters((f) => ({ ...f, range }))}
              options={[{ value: 7, label: '7 j' }, { value: 30, label: '30 j' }, { value: 90, label: '90 j' }]} />
            <Cluster gap={2} role="group" aria-label="Catégories">
              {CATS.map((c) => <ToggleChip key={c.id} pressed={filters.cats.includes(c.id)} onChange={(on) => toggleCat(c.id, on)} swatch={catColor(c.id)}>{c.name}</ToggleChip>)}
            </Cluster>
            <span className="nl-eyebrow nl-muted filters__meta">Données au 02.10.2026</span>
          </section>

          <div className={stale ? 'scope is-stale' : 'scope'}>
            <section className="kpis" aria-label="Indicateurs clés">
              <StatTile hero title="REVENUE.EXE" color="primary" label="Revenu billetterie" value={eur.format(cur.revenue)} delta={<><Delta current={cur.revenue} previous={prev.revenue} /><span className="vs">{vs}</span></>}>
                <Sparkline values={bucket(daily(shown, 'revenue'))} />
              </StatTile>
              <StatTile title="TICKETS" label="Billets vendus" value={int.format(cur.tickets)} delta={<><Delta current={cur.tickets} previous={prev.tickets} /><span className="vs">{vs}</span></>}>
                <Sparkline values={bucket(daily(shown, 'tickets'))} />
              </StatTile>
              <StatTile title="FILL_RATE" color="secondary" label="Taux de remplissage" value={pct(cur.fill)} delta={<><Delta current={cur.fill} previous={prev.fill} /><span className="vs">{vs}</span></>}>
                <Meter value={cur.fill} label="Taux de remplissage" />
                <span className="nl-help">{cur.fill >= 0.7 ? 'Objectif 70 % atteint ✓' : cur.fill >= 0.5 ? 'Sous l’objectif de 70 %' : 'Salle à moitié vide !'}</span>
              </StatTile>
              <StatTile title="BASKET" color="lavender" label="Panier moyen" value={eur.format(cur.basket)} delta={<><Delta current={cur.basket} previous={prev.basket} /><span className="vs">{vs}</span></>}>
                <Sparkline values={bucket(daily(shown, 'revenue')).map((v, i) => v / (bucket(daily(shown, 'tickets'))[i] / 1.85 || 1))} />
              </StatTile>
            </section>

            <div className="grid-a">
              <ChartCard title="Revenu par catégorie" subtitle={line.weekly ? 'Par semaine, en euros' : 'Par jour, en euros'}
                legend={<Legend kind="line" items={line.series.map((s) => ({ name: s.name, color: catColor(s.id) }))} />}
                table={{ columns: [{ key: 'date', header: 'Date' }, ...line.series.map((s) => ({ key: s.id, header: s.name, align: 'end' as const })), { key: 'total', header: 'Total', align: 'end' }],
                  rows: line.labels.map((d, i) => ({ date: dShort(d), ...Object.fromEntries(line.series.map((s) => [s.id, eur.format(s.values[i])])), total: eur.format(sum(line.series.map((s) => s.values[i]))) })) }}>
                <LineChart labels={line.labels} series={line.series} weekly={line.weekly} />
              </ChartCard>
              <ChartCard title="Top événements" subtitle="Billets vendus sur la période"
                legend={<Legend kind="rect" items={cats.map((c) => ({ name: c.name, color: catColor(c.id) }))} />}
                table={{ columns: [{ key: 'name', header: 'Événement' }, { key: 'cat', header: 'Catégorie' }, { key: 'tickets', header: 'Billets', align: 'end' }], rows: events.map((e) => ({ name: e.name, cat: catById[e.cat].name, tickets: int.format(e.tickets) })) }}>
                <BarList rows={events} />
              </ChartCard>
            </div>

            <div className="grid-b">
              <ChartCard title="Affluence" subtitle="Check-ins par jour et créneau"
                table={{ columns: [{ key: 'day', header: 'Jour' }, ...SLOTS.map((s) => ({ key: s, header: s, align: 'end' as const }))], rows: heat.map((r, d) => ({ day: DOW[d], ...Object.fromEntries(r.map((v, s) => [SLOTS[s], int.format(v)])) })) }}>
                {cats.length ? <Heatmap grid={heat} /> : <p className="empty">Aucune donnée.</p>}
              </ChartCard>
              <ChartCard title="Répartition du revenu" subtitle="Part de chaque catégorie">
                <ShareBar theme={theme} items={cats.map((c) => ({ c, v: sum(slice(shown, c.id)) }))} />
              </ChartCard>
              <ChartCard title="Objectifs" subtitle={`Sur ${shown.range} jours`}>
                <ul className="goals">
                  {goals.map((g) => { const p = Math.min(1, g.v / g.goal); return (
                    <li key={g.name}>
                      <div className="goal__top"><b>{g.name}</b><span className="nl-muted num">{g.fmt(g.v)} / {g.fmt(g.goal)}</span></div>
                      <Meter value={p} label={g.name} />
                      <span className={p < 0.5 ? 'nl-help nl-help--error' : 'nl-help'}>{pct(p)} — {p >= 0.7 ? 'en bonne voie' : p >= 0.5 ? 'à surveiller' : 'en retard'}</span>
                    </li>); })}
                </ul>
              </ChartCard>
            </div>

            <section className="orders nl-card" aria-labelledby="orders-title">
              <Split ratio="2-1" gap={4} className="orders__head">
                <div><h2 id="orders-title">Dernières commandes</h2><p>{int.format(orders.length)} commandes · {eur.format(sum(orders.map((o) => o.amount)))}</p></div>
                {/* LIBRARY GAP: no Search component; uses the skin's .nl-search markup directly */}
                <label className="nl-search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M15 15l6 6" strokeLinecap="round" /></svg>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Client, event, n°" aria-label="Rechercher une commande" />
                </label>
              </Split>
              <DataTable caption="Dernières commandes" hideCaption columns={orderColumns} rows={pageRows} rowKey={(o) => o.id}
                sort={sort} onSortChange={setSort} empty="Aucune commande ne correspond." />
              <Stack className="orders__foot">
                <Cluster justify="between" gap={3}>
                  <span className="nl-muted">{orders.length ? `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, orders.length)} sur ${orders.length}` : ''}</span>
                  <Pagination page={page} pages={pages} onChange={setPage} label="Pages des commandes" />
                </Cluster>
              </Stack>
            </section>
          </div>
        </main>
      </div>
      <Toast message={toast} onDone={clearToast} />
    </ChartTipProvider>
  );
}
