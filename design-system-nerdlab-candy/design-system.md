# Nerdlab Pop — Design System v1.0.0

## Overview

**Nerdlab Pop** est un néo-brutalisme rétro-pop : chaque élément ressemble à un sticker ou à une fenêtre d'OS des années 2000 collée sur du papier quadrillé. Contours encre épais, ombres portées dures (sans flou), fonds papier pastel et accents « bonbon » (rose, ciel, beurre, lavande). Les décorations — starbursts, sparkles, bulles, bits pixel — font partie intégrante du système.

Sources (`/references`) :

| Référence | Ce qu'on en retient |
|---|---|
| `WERE NEW.jpg` | Fenêtres OS avec barre de titre, papier quadrillé blush, CTA en pills, starbursts jaunes, bleu ciel |
| `GOCHISO.jpg` | Affiches pop asiatiques : contours noirs épais, stickers inclinés, tableaux d'infos encadrés, rose bonbon |
| `Make money..jpg` | Titres display condensés ultra-gras, bento grids, tuiles sombres/violettes arrondies |
| `2015.3.1 SUn.jpg.jpeg` | Pixel art, palette terreuse secondaire (mousse, écorce, citrouille), typo pixel |

---

## Color System

### Fondations

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| ████ | `ink` | `#1B1525` | Contours, ombres dures, texte principal. **Jamais de gris pour une bordure.** |
| ████ | `background` | `#FBF3E8` | Fond de page (papier crème) |
| ████ | `background-grid` | `#F6DDD3` | Sections héro en papier quadrillé (lignes `#E4BFB2`, cellule 24px) |
| ████ | `surface` | `#FFFDF8` | Corps des cartes et fenêtres |
| ████ | `surface-sunken` | `#F1E7DA` | Puits, code, inputs désactivés |
| ████ | `text-secondary` | `#5B5266` | Légendes, labels, placeholders (7.2:1 sur crème) |

### Couleurs « bonbon »

| Swatch | Token | Hex | Usage |
|---|---|---|---|
| ████ | `primary` | `#FF4FA3` | CTA principal, éléments clés |
| ████ | `secondary` | `#6BB3E0` | Actions secondaires, panneaux ciel |
| ████ | `accent` | `#FFE14D` | Starbursts, barres de titre, badges « NEW », surligneur |
| ████ | `tomato` | `#FF6B35` | Cœurs, prix, stickers urgents, barre de recherche |
| ████ | `lavender` | `#C9A7F5` | Panneaux calmes (apprentissage, workshop) |
| ████ | `violet` | `#7B4DFF` | Tuile bento hero, focus ring, liens sur fond sombre |
| ████ | `mint` | `#9BE3A6` | Panneaux positifs, checkbox cochée |
| ████ | `forest` | `#1E5A3C` | Tuiles profondes (texte crème ou mint) |

### Sémantique

`success #2DBE6C` · `warning #FFB020` · `error #FF4D3D` · `info #6BB3E0` — toujours avec **texte ink**.

### Sous-palette Pixel

`moss #7C9A5A` · `bark #5C4A3B` · `pumpkin #E3812B` · `sand #E9E1D2` · `leaf #C9D77A` — réservée au « mode pixel » (gamification, easter eggs, états de chargement). En mode pixel, `bark` remplace `ink`.

### Règles

- ✅ **Texte ink sur toutes les couleurs bonbon** (rose, ciel, beurre, tomate, mint, lavande) — contraste ≥ 7:1.
- ✅ Texte crème uniquement sur `ink`, `forest`, `violet`.
- ✅ Une section = une couleur dominante + au plus deux accents.
- ❌ Pas de texte blanc sur rose/ciel/jaune (contraste insuffisant, et ça casse le style).
- ❌ Pas de dégradés décoratifs. Aplats uniquement (seule exception : rayures de la progress bar).
- ❌ Pas de bordure grise : une bordure est en `ink` (ou `cream` en dark) ou n'existe pas.

### Dark mode (« night desktop »)

Classe `.dark` ou `[data-theme="dark"]`. Le fond passe en `#15111C`, les surfaces en `#231C2E`, et **les contours + ombres basculent en crème**. Les couleurs bonbon ne changent pas, leur texte reste `ink`.

---

## Typography

| Rôle | Police | Pourquoi |
|---|---|---|
| Display | **Bricolage Grotesque** 800, `wdth 75` | Le grotesque condensé ultra-gras de « Make money. » et « WE'RE NEW » — avec une pointe d'excentricité dans les détails |
| Body | **Outfit** 400–700 | Géométrique ronde, proche du sans fin de l'affiche « Graphic Design Workshop » ; très lisible |
| Mono | **Space Mono** 400/700 | Métadonnées, dates, URLs — l'esprit « YOUTUBE.COM/KIDSPORT » et « 2015.3.1 SUN » |
| Pixel | **Silkscreen** | Barres de titre de fenêtres, compteurs, mode pixel. Jamais pour un paragraphe. |

### Échelle

| Token | Taille / Interligne | Usage |
|---|---|---|
| `xs` | 12 / 16 | Badges, eyebrows mono |
| `sm` | 14 / 20 | Labels, pills |
| `base` | 16 / 24 | Texte courant |
| `lg` | 18 / 28 | Lead, titres de carte |
| `xl` | 22 / 28 | Sous-titres de section |
| `2xl` | 28 / 32 | Titres display de carte |
| `3xl` | 40 / 40 | Titres de section |
| `4xl` | 56 / 52 | Titres de page |
| `5xl` | 80 / 72 | Héro |
| `6xl` | 120 / 104 | Affiche — **une seule fois par page** |

### Règles

- Display : **toujours en uppercase**, `letter-spacing: -0.03em`, `line-height ≈ 0.92`. Classe `.nl-display`.
- Headline en casse normale (`.nl-headline`) pour le style « Make money. Without a cut. » : point final assumé.
- Eyebrow mono : uppercase, `letter-spacing: 0.08em`, 12px, bold. Classe `.nl-eyebrow`.
- Effets de titre autorisés : `.nl-outline-text` (lettres creuses), `.nl-pop-text` (ombre dure 3px), `.nl-mark` (surligneur jaune).
- Poids : 400 corps, 500 pills, 600 boutons, 700 emphase, 800 display uniquement.

---

## Spacing & Layout

- **Base 4px**. Échelle : `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`.
- Cartes : padding `24px` (`space-6`). Fenêtres : `20px` (`space-5`). Tuiles bento : `24px`.
- Gap entre cartes : `24px`. Entre sections : `80px` (`space-20`).
- **Papier quadrillé** : cellule de 24px. Alignez les éléments décoratifs sur la grille.
- Les grilles bento utilisent des gaps de `16px` et des tuiles de hauteurs variées (1 ou 2 rangées).
- Laissez déborder les décorations (starbursts, stickers) hors des cartes — c'est le collage qui donne vie.

## Borders, Radius & Shadows

| Token | Valeur | Usage |
|---|---|---|
| `radius-sm` | 6px | Badges, contrôles de fenêtre, checkbox |
| `radius-md` | 12px | Fenêtres, inputs |
| `radius-lg` | 20px | Cartes |
| `radius-xl` | 28px | Tuiles bento |
| `radius-full` | ∞ | Boutons, pills, stickers |
| `border-width` | 2px | Toutes les bordures |
| `border-thick` | 3px | Stickers, ruban, focus |
| `shadow-sm` | `2px 2px 0 ink` | Badges, inputs |
| `shadow-md` | `4px 4px 0 ink` | Boutons, cartes, fenêtres |
| `shadow-lg` | `8px 8px 0 ink` | Modales, fenêtres héro |
| `shadow-soft` | flou doux | **Uniquement** tuiles bento (sans contour) |

**Interaction physique** : au hover, l'élément monte de `-2px/-2px` et son ombre grandit d'autant ; à l'`:active`, il descend de `2px/2px` et l'ombre rétrécit. Ça doit ressembler à un bouton qu'on enfonce.

---

## Component Patterns

### Button — `.nl-btn`
Pill, bordure ink 2px, ombre `md`, texte uppercase semibold.
- `--primary` (rose) : l'action principale, **une par vue**.
- `--secondary` (ciel) / `--accent` (beurre) / `--tomato` : actions alternatives ou thématiques.
- `--outline` : action neutre sans ombre. `--ghost` : action tertiaire, liens d'UI.
- `--pixel` : mode pixel / gamification uniquement.
- Tailles `--sm`, `--lg` ; `--square` pour un radius `md`.

### Window — `.nl-window`
La signature du système. Barre de titre (`.nl-window__bar`, Silkscreen xs, fond accent par défaut ou `--primary/--secondary/--lavender/--mint`) avec contrôles `_ □ ×`. Utiliser pour : formulaires, dialogues, médias, encarts promo.

### Card — `.nl-card`
Surface + bordure + `radius-lg` + `shadow-md`. Pour le contenu courant sans métaphore « fenêtre ».

### Bento tile — `.nl-bento`
`radius-xl`, **pas de bordure**, `shadow-soft`. Fond aplat de la palette ou photo. Pied `.nl-bento__foot` : label + flèche `→`. Pour landing pages et dashboards d'accueil.

### Input — `.nl-input`, `.nl-search`
Bordure ink, `radius-md`, `shadow-sm`. Focus : bordure violette + halo rose (`shadow-glow`). Label en mono uppercase (`.nl-label`). La recherche (`.nl-search`) est une barre tomate façon « SCAN QR-CODE ».

### Pill / Badge / Sticker
- `.nl-pill` : tags et options (« FREE COFFEE », « 3 HOURS LEARNING »).
- `.nl-badge` : statuts courts, mono uppercase, ombre `sm`. Variantes de couleur.
- `.nl-sticker` : rond, bordure 3px, **incliné (-8° par défaut)**, pour prix et promos (« ₩100 », « 25 soles »).

### Décorations
- `.nl-burst` : starburst 12 branches (clip-path) ou SVG avec contour ink.
- Sparkle 4 branches (SVG), bulle `.nl-bubble` (« HELLO! »), ruban défilant `.nl-ribbon`.
- Animations : `.nl-wobble`, `.nl-spin-slow` — désactivées par `prefers-reduced-motion`.

### Autres
`.nl-tabs` (segmented pill, onglet actif jaune), `.nl-toggle`, `.nl-check` (mint coché), `.nl-progress` (rayures roses) et `.nl-progress--pixel`, `.nl-toast`, `.nl-info` (tableau d'infos d'affiche : PLACE / DATE / GIFT), `.nl-divider-dashed` (bord de ticket).

---

## AI Agent Instructions

> Copiez ce bloc dans un system prompt ou un `CLAUDE.md`.

```
Tu utilises le design system "Nerdlab Pop" (retro-pop néo-brutaliste). Importe design-system.css et utilise ses variables/classes.

RÈGLES ABSOLUES
1. Bordures : toujours 2px solid var(--color-line) (ink #1B1525). Jamais de gris, jamais de 1px.
2. Ombres : dures, décalées, sans flou (--shadow-sm/md/lg = 2/4/8px offset). Le flou (--shadow-soft) est réservé aux tuiles bento sans bordure.
3. Texte sur couleurs vives (rose #FF4FA3, ciel #6BB3E0, jaune #FFE14D, tomate #FF6B35, mint, lavande) = ink, jamais blanc.
4. Fond de page crème #FBF3E8 ; héros sur papier quadrillé (.nl-grid-paper).
5. Polices : Bricolage Grotesque 800 condensé UPPERCASE pour les titres (.nl-display), Outfit pour le corps, Space Mono uppercase pour les métadonnées (.nl-eyebrow), Silkscreen pour les barres de titre de fenêtre. Interdit : Inter, Roboto, Arial.
6. Boutons = pills (.nl-btn) avec ombre md ; hover = translate(-2px,-2px) + ombre plus grande ; active = translate(2px,2px).
7. Composant signature : fenêtre OS rétro (.nl-window + .nl-window__bar avec contrôles _ □ ×).
8. Décore : starbursts, sparkles, stickers inclinés, bulles. Laisse-les déborder des cartes. 1 à 3 décorations par section, pas plus.
9. Radius : 6 badges / 12 fenêtres & inputs / 20 cartes / 28 bento / full boutons & pills.
10. Espacements multiples de 4px ; padding carte 24px ; gap 24px ; sections 80px.
11. Une seule couleur dominante par section + 2 accents max. Un seul bouton primary par vue.
12. Pas de dégradés, pas de glassmorphism, pas de backdrop-blur.
13. Dark mode via [data-theme="dark"] : contours et ombres deviennent crème automatiquement.
R1. Mobile-first : styles de base pour < 640px, puis min-width 640/768/1024/1280. Composants : container queries plutôt que media queries.
R2. Tailles de titres et espacements de mise en page via les tokens fluides (--text-*, --space-fluid-*, --space-gutter, --section-y). Jamais de px fixes pour une largeur de mise en page.
R3. Grilles : .nl-grid-auto ou minmax(min(Xpx, 100%), 1fr) ; min-width: 0 sur les enfants de grille. Aucun scroll horizontal de page.
R4. Cibles tactiles ≥ 44px sur pointer: coarse ; champs ≥ 16px.
R5. Tables : .nl-table-wrap + .nl-table--stack avec data-label sur chaque <td>. Nav : .nl-nav-toggle + .nl-nav-panel sous 1024px.
R6. Propriétés logiques (inline/block) ; 100dvh avec repli 100vh.
```

---

## Data Visualization

Voir `dashboard-preview.html` pour l'implémentation de référence.

| Rôle | Light (surface `#FFFDF8`) | Dark (surface `#231C2E`) |
|---|---|---|
| Catégoriel (ordre fixe) | `#7B4DFF` `#FF4FA3` `#2E9BD6` `#FF6B35` | `#8A63FF` `#E04A92` `#3F9AD6` `#D9632F` |
| Séquentiel (heatmap) | `#F592C0` → `#6E0F3D` (5 pas) | `#9E2A63` → `#F9B3D3` (5 pas) |
| Grille | `#E8DCCD` | `#362D45` |

Palettes validées (`validate_palette.js`) : séparation CVD ≥ 10, vision normale ≥ 22. Le rose et la tomate sont sous 3:1 en clair → **légende + labels directs + vue tableau obligatoires**.

**Règles** : le chrome (cartes, fenêtres, filtres) est néo-brutaliste ; **les marques de données ne le sont pas** — pas de contour ink sur les barres, mais un espace de 2px couleur surface. Barres ≤ 24px avec bout arrondi 4px, lignes 2px, points ≥ 8px avec anneau surface. Grille en filet 1px plein. Un seul axe Y. Une seule hero figure par vue, en Outfit (pas en display). Chiffres alignés en `tabular-nums` uniquement dans les tables et axes. Tooltip au survol **et** au focus clavier ; chaque graphe a sa vue tableau. Filtres sur une seule ligne au-dessus de tout ce qu'ils filtrent. Couleurs de statut réservées aux statuts, toujours avec icône + libellé.

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
- **Typographie** : `--text-lg` → `--text-6xl` sont des `clamp()` entre 320 et 1280px (titre héros 64 → 120px). `xs`, `sm` et `base` restent fixes pour la lisibilité.
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
- `@media (hover: none)` : pas d'effet « soulevé » qui reste collé après un tap.
- **Propriétés logiques** partout (`margin-inline`, `padding-block`, `border-inline-start`…), prêtes pour le RTL.
- Jamais de `100vh` seul : `dvh`/`svh` avec repli `vh`.
- Grilles : toujours `minmax(min(Xpx, 100%), 1fr)` et `min-width: 0` sur les enfants.

