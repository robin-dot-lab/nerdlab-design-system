import {
  AppShell, Avatar, Badge, Breadcrumb, Bubble, Button, Callout, Cluster, DataTable, Delta, Field, Menu, MenuItem, MenuTrigger, Meter, MobileNav, Pagination, Ribbon, Search, SegmentedControl, Select, Sidebar, SidebarItem, SidebarSection, Split, Stack, StatTile, Switch, Toast, ToggleChip, Topbar,
  type DataTableColumn, type DataTableSort,
} from '@robin-dot-lab/react';
import { ChevronDown } from '@robin-dot-lab/icons';
import { useCallback, useDeferredValue, useEffect, useMemo, useState, type Key } from 'react';
import { BarList, ChartCard, Heatmap, Legend, LineChart, ShareBar, Sparkline } from '@robin-dot-lab/charts';
import {
  activeCats, bucket, catById, catColor, CATS, daily, DAYS, DOW, heatGrid, lineData, ORDERS, SLOTS, slice, STATUS, topEvents, totals,
  type CatId, type Filters, type Order,
} from './data';
import { dShort, eur, eurCompact, int, pct, sum } from './format';
import { GoalsHelp, NewEventDialog, NextEvent, OrderDetails } from './extras';
import palettes from '@robin-dot-lab/tokens/palettes.json';
import { usePalette, useSkin, useTheme } from './hooks';

const NAV = ['Vue d’ensemble', 'Événements', 'Billets', 'Audience', 'Réglages'];
const PER_PAGE = 8;
const AVATAR_TONES = ['lavender', 'mint', 'accent', 'secondary'] as const;

const orderColumns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'N°', cell: (o) => <OrderDetails order={o} /> },
  { key: 'client', header: 'Client', sortable: true, cell: (o) => <span className="client"><Avatar name={o.client} size="sm" tone={AVATAR_TONES[o.client.charCodeAt(0) % AVATAR_TONES.length]} />{o.client}</span> },
  { key: 'event', header: 'Événement', sortable: true },
  { key: 'cat', header: 'Catégorie', sortable: true, cell: (o) => <span className="cat"><i className="nl-key-rect" style={{ background: catColor(o.cat) }} aria-hidden="true" />{catById[o.cat].name}</span> },
  { key: 'qty', header: 'Billets', align: 'end', sortable: true },
  { key: 'amount', header: 'Montant', align: 'end', sortable: true, cell: (o) => eur.format(o.amount) },
  { key: 'status', header: 'Statut', sortable: true, cell: (o) => <Badge variant={STATUS[o.status].variant}><span aria-hidden="true">{STATUS[o.status].icon}</span> {STATUS[o.status].label}</Badge> },
  { key: 'date', header: 'Date', align: 'end', sortable: true, sortValue: (o) => o.date.getTime(), cell: (o) => <span className="mono">{o.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} {o.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span> },
];

export function App() {
  const [theme, setTheme] = useTheme();
  const [palette, setPalette] = usePalette();
  const [skin, setSkin] = useSkin();
  const [filters, setFilters] = useState<Filters>({ range: 30, cats: CATS.map((c) => c.id) });
  const shown = useDeferredValue(filters); // previous render stays on screen while the new slice computes
  const stale = shown !== filters;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<DataTableSort>({ key: 'date', direction: 'descending' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<Key>>(new Set());
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
  const exportCsv = (list: readonly Order[], file: string) => {
    const csv = ['id;client;event;categorie;billets;montant;statut;date', ...list.map((o) => [o.id, o.client, o.event, catById[o.cat].name, o.qty, o.amount, STATUS[o.status].label, o.date.toISOString()].join(';'))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = file; a.click(); URL.revokeObjectURL(a.href);
    setToast(`${list.length} commandes exportées`);
  };
  const onExport = (key: unknown) =>
    key === 'all' ? exportCsv(ORDERS, 'nerdlab-orders-tout.csv')
    : key === 'selection' ? exportCsv(ORDERS.filter((o) => selected.has(o.id)), 'nerdlab-orders-selection.csv')
    : exportCsv(orders, `nerdlab-orders-${shown.range}j.csv`);
  const logo = <a className="logo" href="#top"><span className="logo__mark" aria-hidden="true">N</span><span className="logo__name">Nerdlab Events</span></a>;
  const themeSwitch = <Switch checked={theme === 'dark'} onChange={(e) => setTheme(e.currentTarget.checked ? 'dark' : 'light')}>Thème sombre</Switch>;
  // Skin, then Candy's palettes (Bento has a single palette: no palette picker under it).
  const paletteSelect = (id: string) => (
    <>
      <Field label="Peau" id={`${id}-skin`}>
        <Select value={skin} onChange={(e) => setSkin(e.currentTarget.value === 'bento' ? 'bento' : 'candy')}>
          <option value="candy">Candy</option>
          <option value="bento">Bento</option>
        </Select>
      </Field>
      {skin === 'candy' && (
        <Field label="Palette" id={id}>
          <Select value={palette} onChange={(e) => setPalette(e.currentTarget.value)}>
            {palettes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
      )}
    </>
  );

  return (
    <>
      <AppShell
        sidebar={
          <Sidebar label="Navigation principale" header={logo} footer={<div className="side__theme">{paletteSelect('palette-side')}{themeSwitch}</div>}>
            <SidebarSection>{NAV.map((n, i) => <SidebarItem key={n} href="#top" current={i === 0}>{n}</SidebarItem>)}</SidebarSection>
          </Sidebar>
        }
        topbar={<Topbar className="mobile-bar" title={logo} mobileNav={<MobileNav label="Menu">{NAV.map((n) => <a key={n} href="#top">{n}</a>)}</MobileNav>} />}
        mainProps={{ id: 'top', className: 'main' }}
      >
          <Ribbon className="announce" items={['Figma Pixel Party · 27.04 · Lyon', 'Plus que 25 places', 'Pixel Shader Jam le 03.05', 'Stay nerdy']} aria-label="Annonces" role="region" />
          <header className="top">
            <div><Breadcrumb items={[{ label: 'Nerdlab Events', href: '#top' }, { label: 'Analytics', href: '#top' }, { label: 'Vue d’ensemble' }]} /><h1 className="nl-display">Dashboard<span className="dot">.</span></h1></div>
            <Cluster gap={3}><span className="top__theme">{paletteSelect('palette-top')}{themeSwitch}</span><NewEventDialog onCreate={(t) => setToast(`Brouillon « ${t} » créé`)} /><MenuTrigger>
              <Button variant="primary">Exporter <ChevronDown /></Button>
              <Menu onAction={onExport} placement="bottom end">
                <MenuItem id="filtered">Commandes filtrées (CSV)</MenuItem>
                <MenuItem id="all">Toutes les commandes (CSV)</MenuItem>
                <MenuItem id="selection" isDisabled={selected.size === 0}>{`Sélection (${selected.size}) en CSV`}</MenuItem>
              </Menu>
            </MenuTrigger></Cluster>
          </header>

          <section className="filters" aria-label="Filtres">
            <SegmentedControl label="Période" value={filters.range} onChange={(range) => setFilters((f) => ({ ...f, range }))}
              options={[{ value: 7, label: '7 j' }, { value: 30, label: '30 j' }, { value: 90, label: '90 j' }]} />
            <Cluster gap={2} role="group" aria-label="Catégories">
              {CATS.map((c) => <ToggleChip key={c.id} pressed={filters.cats.includes(c.id)} onPressedChange={(on) => toggleCat(c.id, on)} swatch={`chart-${c.slot}`}>{c.name}</ToggleChip>)}
            </Cluster>
            <span className="nl-eyebrow nl-muted filters__meta">Données au 02.10.2026</span>
          </section>
          {filters.cats.length === 0 && (
            <Callout tone="warning" title="Aucune catégorie sélectionnée">Les graphes et la table sont vides : réactive au moins une catégorie.</Callout>
          )}

          <div className={stale ? 'scope is-stale' : 'scope'}>
            <section className="kpis" aria-label="Indicateurs clés">
              <StatTile hero title="REVENUE.EXE" barColor="primary" label="Revenu billetterie" value={eur.format(cur.revenue)} meta={<><Delta current={cur.revenue} previous={prev.revenue} /><span>{vs}</span></>}>
                <Sparkline values={bucket(daily(shown, 'revenue'))} />
              </StatTile>
              <StatTile title="TICKETS" label="Billets vendus" value={int.format(cur.tickets)} meta={<><Delta current={cur.tickets} previous={prev.tickets} /><span>{vs}</span></>}>
                <Sparkline values={bucket(daily(shown, 'tickets'))} />
              </StatTile>
              <StatTile title="FILL_RATE" barColor="secondary" label="Taux de remplissage" value={pct(cur.fill)} meta={<><Delta current={cur.fill} previous={prev.fill} /><span>{vs}</span></>}>
                <Meter value={cur.fill} label="Taux de remplissage" />
                <span className="nl-help">{cur.fill >= 0.7 ? 'Objectif 70 % atteint ✓' : cur.fill >= 0.5 ? 'Sous l’objectif de 70 %' : 'Salle à moitié vide !'}</span>
              </StatTile>
              <StatTile title="BASKET" barColor="lavender" label="Panier moyen" value={eur.format(cur.basket)} meta={<><Delta current={cur.basket} previous={prev.basket} /><span>{vs}</span></>}>
                <Sparkline values={bucket(daily(shown, 'revenue')).map((v, i) => v / (bucket(daily(shown, 'tickets'))[i] / 1.85 || 1))} />
              </StatTile>
            </section>

            <NextEvent />

            <div className="grid-a">
              <ChartCard title="Revenu par catégorie" subtitle={line.weekly ? 'Par semaine, en euros' : 'Par jour, en euros'}
                legend={<Legend kind="line" items={line.series.map((s) => ({ label: s.name, slot: catById[s.id].slot }))} />}
                table={{ columns: [{ key: 'date', header: 'Date' }, ...line.series.map((s) => ({ key: s.id, header: s.name, align: 'end' as const })), { key: 'total', header: 'Total', align: 'end' }],
                  rows: line.labels.map((d, i) => ({ date: dShort(d), ...Object.fromEntries(line.series.map((s) => [s.id, eur.format(s.values[i])])), total: eur.format(sum(line.series.map((s) => s.values[i]))) })) }}>
                <LineChart title="Revenu par catégorie" formatValue={eur.format} formatCompact={eurCompact}
                  series={line.series.map((s) => ({ ...s, slot: catById[s.id].slot }))} xLabels={line.labels.map(dShort)}
                  pointTitle={(i) => (line.weekly ? 'Semaine du ' : '') + line.labels[i].toLocaleDateString('fr-FR', { weekday: line.weekly ? undefined : 'short', day: 'numeric', month: 'long' })} />
              </ChartCard>
              <ChartCard title="Top événements" subtitle="Billets vendus sur la période"
                legend={<Legend kind="rect" items={cats.map((c) => ({ label: c.name, slot: c.slot }))} />}
                table={{ columns: [{ key: 'name', header: 'Événement' }, { key: 'cat', header: 'Catégorie' }, { key: 'tickets', header: 'Billets', align: 'end' }], rows: events.map((e) => ({ name: e.name, cat: catById[e.cat].name, tickets: int.format(e.tickets) })) }}>
                <BarList title="Top événements" unit="billets" shareLabel="du top 6" formatValue={(v) => int.format(v)}
                  items={events.map((e) => ({ id: e.name, label: e.name, value: e.tickets, slot: catById[e.cat].slot, group: catById[e.cat].name }))} />
              </ChartCard>
            </div>

            <div className="grid-b">
              <ChartCard title="Affluence" subtitle="Check-ins par jour et créneau"
                table={{ columns: [{ key: 'day', header: 'Jour' }, ...SLOTS.map((s) => ({ key: s, header: s, align: 'end' as const }))], rows: heat.map((r, d) => ({ day: DOW[d], ...Object.fromEntries(r.map((v, s) => [SLOTS[s], int.format(v)])) })) }}>
                {cats.length ? <Heatmap title="Check-ins par jour et créneau" unit="check-ins" cornerLabel="Jour" rowLabels={DOW} colLabels={SLOTS} values={heat} formatValue={(v) => int.format(v)} /> : <p className="nl-chart-empty">Aucune donnée.</p>}
              </ChartCard>
              <ChartCard title="Répartition du revenu" subtitle="Part de chaque catégorie">
                <ShareBar title="Part du revenu" formatValue={eur.format} items={cats.map((c) => ({ id: c.id, label: c.name, value: sum(slice(shown, c.id)), slot: c.slot }))} />
              </ChartCard>
              <ChartCard title="Objectifs" subtitle={`Sur ${shown.range} jours`}>
                <GoalsHelp />
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
                <div><h2 id="orders-title">Dernières commandes</h2><p>{int.format(orders.length)} commandes · {eur.format(sum(orders.map((o) => o.amount)))}{selected.size > 0 && ` · ${selected.size} sélectionnée${selected.size > 1 ? 's' : ''}`}</p></div>
                <Search label="Rechercher une commande" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Client, event, n°" />
              </Split>
              <DataTable caption="Dernières commandes" hideCaption columns={orderColumns} rows={pageRows} rowKey={(o) => o.id}
                sort={sort} onSortChange={setSort} selectable selectedKeys={selected} onSelectionChange={setSelected}
                selectionLabels={{ all: 'Sélectionner les commandes affichées', row: (o) => `Sélectionner la commande ${o.id}`, column: 'Sélection' }} empty={<><Bubble>Rien ici…</Bubble> Aucune commande ne correspond.</>} />
              <Stack className="orders__foot">
                <Cluster justify="between" gap={3}>
                  <span className="nl-muted">{orders.length ? `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, orders.length)} sur ${orders.length}` : ''}</span>
                  <Pagination page={page} pages={pages} onPageChange={setPage} label="Pages des commandes" />
                </Cluster>
              </Stack>
            </section>
          </div>
      </AppShell>
      <Toast message={toast} onDismiss={clearToast} />
    </>
  );
}
