# Nerdlab UI kit — instructions for agents

Design system and React library for Nerdlab: one CSS skin (Pop) with `nl-*` classes, a thin React layer, a charts package, Storybook, and an integration dashboard. This file is for any coding agent (Claude, Cursor, Copilot, Codex…). It says **how** to work here; the **why** lives in the Obsidian vault.

## Documentation

- The single documentation source is the Obsidian vault, project **Nerdlab Design System** (`Nerdlab/Nerdlab Design System/`): entry note `Nerdlab Design System`, decisions `ADR-001`…, open questions. Read the entry note and `Questions ouvertes du design system Nerdlab` before changing anything structural.
- Do not duplicate the vault in the repo (no CONTRIBUTING, no design docs here). Point to it.
- An open question in the vault is a stop sign: ask, do not pick the plausible option.

## Layout

| Path | What it owns |
|---|---|
| `packages/tokens` | Visual values. DTCG sources `src/pop/*.tokens.json` → Style Dictionary → CSS vars, JS, JSON |
| `packages/css-pop` | The look. One file per component in `src/components/`, assembled by `src/manifest.json` into cascade layers `nl.tokens < nl.base < nl.components < nl.utilities` |
| `packages/react` | `@nerdlab/react`: typed components that only set `nl-*` classes (React 19, built file by file with `tsc`) |
| `packages/charts` | `@nerdlab/charts`: geometry in JS, colours only from skin tokens |
| `apps/docs` | Storybook 10 + a11y audit of every story |
| `apps/dashboard` | Integration test: a real page built against the packages' `dist/` |
| `design-system-nerdlab-pop/`, `design-system-nous/` | Original static systems: visual reference and parity oracle. Never edit them to make a test pass. Ultramarine is on hold |
| `tools/` | `new-component` generator, `test-fonts` offline font cache |

## Commands

- `pnpm install` · `pnpm build` · `pnpm test` (builds, typechecks, then tests every package, ~4 min, no network needed) · `pnpm typecheck`
- `pnpm storybook` (:6006, reads sources) · `pnpm --filter @nerdlab/dashboard dev` (:5173, reads `dist/`: run `pnpm build` first)
- `pnpm new:component <PascalName> [--element span]` — scaffold a component everywhere it must exist
- `pnpm fetch:test-fonts` — refresh the offline font cache when a test reports a missing font URL

## Rules (each one is enforced; the guard is in brackets)

1. **The CSS is the source of truth.** React never carries a colour, length or `style` prop [`packages/react/src/no-style-values.test.ts`]. Variants are classes, including layout ones (`.nl-gap-*`, `.nl-split--*`…); colour keys are token names (`ToggleChip swatch="chart-2"`), never values.
2. **Charts** compute geometry only; colours come from `--chart-N` / `--chart-seq-N` [`packages/charts/src/guards.test.ts`]. At most 4 series per chart.
3. **`'use client'`** is the first line of a module iff it uses state, effects, refs, context or React Aria components [`use-client.test.ts`, `guards.test.ts`].
4. **Every exported component has a story and a test, and every `nl-*` class it uses exists in the skin** [`packages/react/src/kit-integrity.test.ts`].
5. **Every skin file is in `manifest.json`**; new files go **at the end** so they cannot change the cascade of existing rules [build + kit integrity].
6. **The skin must render identically to the reference** except for declared deviations [`packages/css-pop/scripts/visual-parity.mjs`, `packages/tokens/scripts/check-parity.mjs`]. An intentional visual change goes in `packages/tokens/scripts/parity-deviations.json` **and** `packages/css-pop/test/reference-deviations.css`, with a decision note in the vault.
7. **Accessibility**: no axe violation and no console error in any story, light/dark, 1280/390 px [`apps/docs/scripts/a11y-audit.mjs`], nor in the dashboard [`apps/dashboard/scripts/e2e.mjs`]. Text on candy colours is ink; contrast ≥ 4.5:1.
8. **Prefer native elements** when they cover keyboard, screen reader and forms (`<input>`, `<details>`, `<meter>`, `<button aria-pressed>`); React Aria only where the platform falls short (tabs, tooltip).

## Adding or changing a component

1. `pnpm new:component <Name>` (or edit the existing files: `packages/css-pop/src/components/<name>.css`, `packages/react/src/<name>/`).
2. Style it in the skin with tokens only. Add variants as `cva` maps to `nl-*` classes.
3. Write real tests (behaviour, ARIA) and a story per meaningful state.
4. If the dashboard should use it, use it there (it is the integration test).
5. `pnpm test` must be green.
6. Update the vault: the component table in `Librairie React Nerdlab` (or `Package de graphes Nerdlab`), the created-files list in `Package CSS de la peau Pop`, and an ADR if the change is a decision someone could reverse. Every note carries `source_rev` = the commit it describes.

Tokens: edit `packages/tokens/src/pop/*.tokens.json` (never generated files). CSS variable name = token path joined by `-`; a `DEFAULT` leaf takes the group name (`border.DEFAULT` → `--border`).

## Gotchas

- `apps/dashboard` and the docs typecheck read `packages/*/dist`: after changing a package, rebuild it or they see the old API (`pnpm test` does it).
- `storybook build` does not typecheck; `pnpm test` does.
- `pop.css` loads no fonts: apps import `@nerdlab/css-pop/fonts.css` (Google Fonts) or self-host the same families.
- Hand-written tables using `.nl-table--stack` must set `data-label` on every cell; `DataTable` does it for you.
- `DataTable` sorts internally unless `sort` is passed; with pagination use controlled `sort` + `onSortChange`.
- React Aria collections (Tabs…) render a hidden `<template>` first inside their parent.
- Tooltips need a React Aria trigger: wrap a plain element (even `<Button>`) in `<Focusable>`.
- pnpm 11 blocks dependency install scripts: a new dependency with one must be listed in `allowBuilds` (`pnpm-workspace.yaml`).
- Git identity is repo-local (outlook address, `commit.gpgsign=false`); do not change the global config.
