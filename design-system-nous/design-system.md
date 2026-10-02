# Nerdlab Ultramarine — Design System v2.0.0

## Overview

**Nerdlab Ultramarine** est une publication de labo imprimée à une seule encre : un bleu outremer électrique (`#0000F2`) sur papier gris froid. Les titres ultra-condensés et fins crient par la taille, pas par la graisse ; de minuscules étiquettes mono annotent ; les images sont tramées en 1-bit. L'emphase passe par **l'inversion** (bandeaux bleus pleine largeur, encre blanche), jamais par une nouvelle couleur.

Inspiré de [nousresearch.com](https://nousresearch.com/) et [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com/) — vocabulaire visuel uniquement (aucun logo, texte ni image repris). Dérivé de **Nerdlab Pop v1** : même API de classes `nl-*` et mêmes noms de variables, donc remplacer `design-system.css` suffit à changer de peau.

| Élément observé | Traduction dans le système |
|---|---|
| Titre géant fin et condensé (« NOUS RESEARCH ») | `.nl-display` — Antonio 200, uppercase, interligne 0.86 |
| Bandeau bleu pleine largeur avec art tramé | `.nl-invert` + `.nl-dither` |
| Lignes alternées texte / image | `.row` / `.row--flip` (showcase) |
| Boutons carrés minuscules (« READ MISSION ») | `.nl-btn` 32px, mono uppercase, radius 0 |
| Barre « TOGGLE [☀][☾] » | `.nl-window__bar` + interrupteur carré |
| Terminal macOS | `.nl-terminal` (seul élément arrondi, 8px) |
| Grille « #1 CONNECT » | `.nl-feature` |
| FAQ en filets | `.nl-accordion` |

---

## Color System

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| ████ | `ultramarine` / `primary` / `text-primary` | `#0000F2` | **L'encre unique.** Texte (8,2:1 sur papier), filets, boutons, icônes, images |
| ████ | `primary-hover` | `#0000C4` | Survol |
| ████ | `primary-soft` | `#E3E4FF` | Lignes sélectionnées, voile de survol |
| ████ | `background` | `#F2F2F2` | Papier |
| ████ | `surface` | `#FFFFFF` | Cartes, inputs, tables |
| ████ | `secondary` | `#E4E4EC` | Bouton secondaire (texte bleu, 7,3:1) |
| ████ | `border-subtle` | `#C9CBF2` | Séparateurs internes, contours de cartes |
| ████ | `text-secondary` | `#5050C8` | Légendes, méta (5,7:1) |
| ████ | `invert-muted` | `#C9CCFF` | Texte secondaire sur bleu (5,9:1) |
| ████ | `terminal-bg` | `#0B0B12` | Corps du terminal |

**Accents rares** : `glitch-magenta #D61F8C` et `glitch-cyan #0090D0`, seulement en liseré de 3px au bord d'une image (`.nl-glitch-edge`). Jamais pour du texte ni un bouton.

**Statuts** (texte blanc) : `success #087A4D` · `warning #9E5C00` · `error #C8202F` — toujours avec icône + libellé.

### Règles
- ✅ Le texte est **bleu**, pas noir. Il n'y a pas de noir dans l'UI (sauf le terminal).
- ✅ Pour mettre en avant : inverser (`.nl-invert`), agrandir le titre, ou ajouter une image tramée.
- ❌ Pas de seconde couleur d'accent dans le chrome. Pas de dégradé, pas d'ombre portée sur l'UI plate.
- ❌ Pas de photo couleur : toute image passe par le dithering.

### Dark mode — « night »
`[data-theme="dark"]` : fond `#07071F`, surfaces `#0E0E33`, filets `#5B63FF`, texte `#E9EAFF` / `#A3A8E8`, primaire `#3A44FF`. Les sections `.nl-invert` restent bleu plein dans les deux thèmes.

---

## Typography

| Rôle | Police (substitut libre) | Original | Usage |
|---|---|---|---|
| Display | **Antonio** 200 / 300 | Rules Gothic Condensed | Héros 200 uppercase ; titres de section 300 en Title Case |
| Body | **Geist** 300–600 | Rules | Texte, UI |
| Mono | **Geist Mono** 400–600 | Aeonik Fono | Étiquettes méta, boutons, terminal, chiffres de table |

| Token | Taille | Usage |
|---|---|---|
| `xs` | 11px | Méta mono uppercase +0.08em, boutons |
| `sm` | 13px | Légendes, cellules, texte de carte |
| `base` | 15px | Texte courant |
| `lg` | 18px | Chapeau |
| `xl` | 28px | Titres de carte (display 300) |
| `2xl` | 40px | Sous-titres (display 300) |
| `3xl` | 64px | Titres de section (display 300) |
| `4xl` | 96px | Titres de bandeau (display 200) |
| `5xl` | 144px | Héros |
| `6xl` | 192px | Affiche — une fois par page |

**Contraste d'échelle extrême** : 11px mono à côté de 192px display. C'est le cœur du style. Les titres de section ont un exposant mono (`Features⁰⁵`).

---

## Spacing & Layout

- Base **4px** ; échelle `4 8 12 16 20 24 32 40 48 64 80 128`.
- Contenu max **1240px**, gouttière 16px mobile / 40px desktop.
- Sections : 80px vertical. Bandeaux inversés en retrait de 16–24px des bords (effet « planche »).
- Grille papier optionnelle : cellules de 48px en filet `border-subtle`.

## Borders, Radius, Elevation

- **Radius 0 partout.** 2px sur les micro-badges, 8px uniquement pour le terminal (c'est une fenêtre d'OS).
- Filets **1px** : `border` (bleu, structure) ou `border-subtle` (séparateurs).
- Élévation à 3 niveaux : 0 = plat + filet ; 1 = inversion ; 2 = flottant (`shadow-lg`, ombre bleue diffuse) pour terminal, tooltip, modal, toast.

## Imagerie — dithering

Les images sont des **scènes procédurales tramées** par un dithering ordonné Bayer 4×4 en 3 tons (`#0000F2`, `#6E74FF`, `#FFFFFF`), rendues sur `<canvas>` avec `image-rendering: pixelated`. Scènes fournies dans le showcase : `rays`, `orb`, `waves`, `stairs`, `tunnel`, `noise`. Usage : `<div class="nl-dither" data-scene="orb" data-seed="4"></div>`. Pour une vraie photo, appliquer le même algorithme sur ses pixels (luminance → 3 tons).

---

## Component Patterns

- **Button `.nl-btn`** : 32px, carré, mono uppercase 11px. Défaut = gris secondaire ; `--primary` bleu plein ; `--outline` filet ; `--ghost` texte souligné au survol ; `--invert` blanc sur bleu (CTA dans `.nl-invert`) ; `--sm` / `--lg` / `--square`.
- **Window `.nl-window`** : carte à barre de 32px en mono, contrôles `□` carrés 13px. `__bar--primary` = barre bleue pleine.
- **Terminal `.nl-terminal`** : barre avec pastilles macOS, corps `#0B0B12`, invite `~ %` en bleu clair, curseur `.nl-caret` clignotant.
- **Card `.nl-card`** : blanc + filet subtil, padding 24, pas d'ombre.
- **Feature `.nl-feature`** : `#N LABEL` mono → titre display 300 → texte 13px → image tramée carrée.
- **Input `.nl-input` / `.nl-search`** : 40/36px, filet bleu, focus = halo `primary-soft`.
- **Tag `.nl-pill`**, **Badge `.nl-badge`** (variantes `--success/--warning/--error`), **Stamp `.nl-stamp`** (sceau circulaire double filet), **Sparkle `.nl-sparkle`** (✦ 4 branches).
- **Tabs `.nl-tabs`** : segments carrés, onglet actif bleu plein.
- **Toggle `.nl-toggle`** : interrupteur rectangulaire 36×18 à curseur carré.
- **Accordion `.nl-accordion`** : `<details>` séparés par des filets bleus, question en display 300, `+` / `−` mono.
- **Ribbon `.nl-ribbon`** : bandeau défilant mono entre deux filets.

---

## Data Visualization

Voir `dashboard-preview.html`.

| Rôle | Light (surface `#FFFFFF`) | Dark (surface `#0E0E33`) |
|---|---|---|
| Catégoriel (ordre fixe) | `#0000F2` `#D61F8C` `#0090D0` `#D97A00` | `#6A72FF` `#E0479E` `#1C98D0` `#C98420` |
| Séquentiel | `#A6ACFF` → `#0000A8` (5 pas) | `#2F34C4` → `#C9CCFF` (5 pas) |
| Grille | `#E4E5F5` | `#20235C` |

Validées avec `validate_palette.js` : toutes les vérifications passent (CVD ≥ 9,6, vision normale ≥ 24, contraste ≥ 3:1). Le bleu plein (`#0000F2`) échoue comme **surface** de graphe : ne jamais poser un graphe directement sur une section `.nl-invert`, le mettre dans une carte.

Règles : marques sans contour, espace de 2px entre segments, barres ≤ 24px, lignes 2px, points ≥ 8px avec anneau surface, grille en filet plein, un seul axe Y, une hero figure par vue (Geist 300), `tabular-nums` seulement dans tables/axes, tooltip au survol + focus, vue table pour chaque graphe, filtres sur une ligne au-dessus.

---

## AI Agent Instructions

```
Tu utilises le design system "Nerdlab Ultramarine". Importe design-system.css et ses classes nl-*.

1. Une seule encre : #0000F2. Texte, filets, boutons, icônes et images sont bleus. Pas de noir, pas de seconde couleur d'accent.
2. Fond #F2F2F2, surfaces #FFFFFF. Emphase = inversion (.nl-invert : fond bleu, texte blanc), jamais une nouvelle teinte.
3. Titres : Antonio (.nl-display) poids 200 uppercase pour les héros, 300 pour les sections. Très grands (64–192px). Corps : Geist 15px. Méta : Geist Mono 11px uppercase +0.08em (.nl-eyebrow). Interdit : Inter, Roboto, Arial.
4. Radius 0 partout (2px micro-badges, 8px terminal uniquement). Filets 1px. Aucune ombre sauf éléments flottants (shadow-lg).
5. Boutons .nl-btn : 32px, carrés, mono uppercase ; .nl-btn--primary bleu plein ; .nl-btn--invert dans les sections bleues.
6. Images : jamais de photo couleur. Utilise .nl-dither (dithering Bayer 3 tons) ou un halftone.
7. Patterns signature : titre géant centré + eyebrow mono ; bandeau bleu avec art tramé ; lignes alternées texte/image ; grille de features "#N LABEL" ; terminal ; FAQ en accordéon à filets.
8. Glitch magenta/cyan : uniquement en liseré 3px d'image.
9. Statuts : success #087A4D / warning #9E5C00 / error #C8202F, texte blanc, toujours icône + libellé.
10. Graphes : palette catégorielle --chart-1..4 dans cet ordre, rampe --chart-seq-1..5 ; jamais de graphe directement sur fond bleu plein.
11. Dark : [data-theme="dark"], bleu nuit #07071F / #0E0E33.
R1. Mobile-first : styles de base pour < 640px, puis min-width 640/768/1024/1280. Composants : container queries plutôt que media queries.
R2. Tailles de titres et espacements de mise en page via les tokens fluides (--text-*, --space-fluid-*, --space-gutter, --section-y). Jamais de px fixes pour une largeur de mise en page.
R3. Grilles : .nl-grid-auto ou minmax(min(Xpx, 100%), 1fr) ; min-width: 0 sur les enfants de grille. Aucun scroll horizontal de page.
R4. Cibles tactiles ≥ 44px sur pointer: coarse ; champs ≥ 16px.
R5. Tables : .nl-table-wrap + .nl-table--stack avec data-label sur chaque <td>. Nav : .nl-nav-toggle + .nl-nav-panel sous 1024px.
R6. Propriétés logiques (inline/block) ; 100dvh avec repli 100vh.
```

---

## Responsive

Approche **mobile-first** : les styles de base ciblent le petit écran, puis on enrichit. Deux outils, deux usages :
- **Media queries `min-width`** pour la mise en page de la page (nav, colonnes de section).
- **Container queries** pour les composants : un composant s'adapte à la place qu'on lui donne, pas à la taille de l'écran.

| Breakpoint | Valeur | Rôle |
|---|---|---|
| base | < 640px | Une colonne, menu replié, table en cartes |
| `sm` | 640px | Grilles à 2 colonnes |
| `md` | 768px | Tablette : grilles intrinsèques, typo en 2 colonnes |
| `lg` | 1024px | Nav complète, sidebar du dashboard, splits côte à côte |
| `xl` | 1280px | Grand écran |

### Fluide plutôt que fixe
- **Typographie** : `--text-lg` → `--text-6xl` sont des `clamp()` entre 320 et 1280px (titre héros 72 → 192px, `xs` passe à 12px et `base` vaut 16px sur mobile puis 15px dès `lg`). `xs`, `sm` et `base` restent fixes pour la lisibilité.
- **Espacements de mise en page** : `--space-fluid-xs…xl`, `--space-gutter` (16 → 40px) et `--section-y` (rythme vertical des sections). L'intérieur des composants garde l'échelle fixe de 4px.

### Primitives
`.nl-container` (largeur max + gouttière fluide) · `.nl-section` · `.nl-stack` · `.nl-cluster` · `.nl-grid-auto` (`--grid-min`, `minmax(min(…, 100%), 1fr)`, ne déborde jamais) · `.nl-split` (`--split`, côte à côte dès `lg`) · `.nl-full-height` (`100dvh` avec repli `vh`) · `.nl-scroll-x`.

### Container queries
`.nl-card`, `.nl-window`, `.nl-bento`, `.nl-cq` et `.nl-table-wrap` sont des conteneurs `inline-size`.
- Chiffres de KPI : `font-size: clamp(1.75rem, 15cqi, 2.5rem)` (ou `.nl-fit-number`), ils tiennent toujours dans leur tuile.
- `.nl-info` passe en une colonne sous 22rem.
- `.nl-table--stack` transforme chaque ligne en carte libellé/valeur sous 40rem (chaque `<td>` porte `data-label`). Sinon, la table défile horizontalement dans `.nl-table-wrap`.
- Dashboard : les grilles interrogent le conteneur `main`, donc la largeur restante une fois la sidebar affichée, pas l'écran.

### Navigation adaptative
`.nl-nav-toggle` + `.nl-nav-panel` sous `lg`. Le bouton porte `aria-expanded` et `aria-controls`. Le panneau se ferme sur Échap, au clic sur un lien et au passage en `lg`. Chaque lien du panneau fait au moins 44px de haut.

### Tactile & accessibilité
- `@media (pointer: coarse)` : boutons, onglets, champs, pagination, filtres et lignes de barres font au moins **44×44px** ; les cases et interrupteurs sont agrandis.
- Champs ≥ 16px sur tactile (pas de zoom automatique iOS).
- Le survol ne change que la couleur de fond : rien ne reste « collé » après un tap.
- **Propriétés logiques** partout (`margin-inline`, `padding-block`, `border-inline-start`…), prêtes pour le RTL.
- Jamais de `100vh` seul : `dvh`/`svh` avec repli `vh`.
- Grilles : toujours `minmax(min(Xpx, 100%), 1fr)` et `min-width: 0` sur les enfants.

