# Nerdlab UI kit — instructions for agents

Design system and React library for Nerdlab: one CSS skin (Candy) with `nl-*` classes, a thin React layer, a charts package, Storybook, and an integration dashboard. This file is for any coding agent (Claude, Cursor, Copilot, Codex…). It says **how** to work here; the **why** lives in the Obsidian vault.

## Documentation

- The single documentation source is the Obsidian vault, project **Nerdlab Design System** (`Nerdlab/Nerdlab Design System/`): entry note `Nerdlab Design System`, decisions `ADR-001`…, open questions. Read the entry note and `Questions ouvertes du design system Nerdlab` before changing anything structural.
- Do not duplicate the vault in the repo (no CONTRIBUTING, no design docs here). Point to it.
- An open question in the vault is a stop sign: ask, do not pick the plausible option.

## Layout

| Path | What it owns |
|---|---|
| `packages/tokens` | Visual values. DTCG sources `src/candy/*.tokens.json` → Style Dictionary → CSS vars, JS, JSON |
| `packages/css-candy` | The look. One file per component in `src/components/`, assembled by `src/manifest.json` into cascade layers `nl.tokens < nl.base < nl.components < nl.utilities` |
| `packages/react` | `@robin-dot-lab/react`: typed components that only set `nl-*` classes (React 19, built file by file with `tsc`) |
| `packages/charts` | `@robin-dot-lab/charts`: geometry in JS, colours only from skin tokens |
| `packages/icons` | `@robin-dot-lab/icons`: inline SVG icons (`nl-icon`, sized by the skin, `currentColor`); decorative unless given a `title` |
| `apps/docs` | Storybook 10 + a11y audit of every story |
| `apps/dashboard` | Integration test: a real page built against the packages' `dist/` |
| `packages/css-candy/test/reference/` | The original static design, frozen: stylesheet + two pages, the oracle of the parity tests. Never edit it to make a test pass. Candy was called **Pop** until 2026-10-02: these files still say Pop, and `.nl-pop-text` names an effect, not the skin — keep it. Candy is the only skin; colour variety comes from palettes |
| `tools/` | `new-component` generator, `test-fonts` offline font cache, `readme-assets` (README images), `consumer-check` (the published kit, installed from outside) |
| `.github/workflows/` | CI (`pnpm test` in 14 parallel jobs, every palette audited), Pages (Storybook + dashboard), Release (version PR, then publish + tags + releases), Consumer check (after each release: install from the registry into a blank app, build, check), visual baselines (Linux) |

## Commands

- `pnpm install` · `pnpm build` · `pnpm test` (builds, typechecks, then tests every package, ~13 min, no network needed; `STORY_FILTER` to iterate faster) · `pnpm typecheck`
- `pnpm changeset` — describe a change to a published package (`@robin-dot-lab/tokens`, `css-candy`, `react`, `charts`, `icons`) for the changelog. Packages are published to GitHub Packages (`@robin-dot-lab`, `npm.pkg.github.com`) by the manual *Release* workflow
- `pnpm storybook` (:6006, reads sources) · `pnpm --filter @robin-dot-lab/dashboard dev` (:5173, reads `dist/`: run `pnpm build` first)
- `pnpm new:component <PascalName> [--element span]` — scaffold a component everywhere it must exist
- `pnpm fetch:test-fonts` — refresh the offline font cache when a test reports a missing font URL
- `pnpm --filter @robin-dot-lab/docs visual:update` — rewrite the story screenshots of your platform after an intended visual change (CI's Linux set: the *Update visual baselines* workflow)
- `STORY_FILTER=<id fragment>` — limits the Storybook audit, visual and cross-browser scripts to matching stories
- `PALETTE=<id> node scripts/a11y-audit.mjs` (in `apps/docs`) — audits every story in another palette (CI does it for all of them)
- `node tools/readme-assets/capture.mjs` — regenerate the README images (after `pnpm build`)
- `NODE_AUTH_TOKEN=$(gh auth token) tools/consumer-check/run.sh` — install the published kit into a blank app and check it (needs `read:packages`)
- Firefox and WebKit for the cross-browser tests: `node node_modules/playwright-core/cli.js install firefox webkit`

## Rules (each one is enforced; the guard is in brackets)

1. **The CSS is the source of truth.** React never carries a colour, length or `style` prop [`packages/react/src/no-style-values.test.ts`]. Variants are classes, including layout ones (`.nl-gap-*`, `.nl-split--*`…); colour keys are token names (`ToggleChip swatch="chart-2"`), never values.
2. **Charts** compute geometry only; colours come from `--chart-N` / `--chart-seq-N` [`packages/charts/src/guards.test.ts`]. At most 4 series per chart.
3. **`'use client'`** is the first line of a module iff it uses state, effects, refs, context or React Aria components [`use-client.test.ts`, `guards.test.ts`].
4. **Every exported component has a story and a test, and every `nl-*` class it uses exists in the skin** [`packages/react/src/kit-integrity.test.ts`].
5. **Every skin file is in `manifest.json`**; new files go **at the end** so they cannot change the cascade of existing rules [build + kit integrity].
6. **The skin must render identically to the reference** except for declared deviations [`packages/css-candy/scripts/visual-parity.mjs`, `packages/tokens/scripts/check-parity.mjs`]. An intentional visual change goes in `packages/tokens/scripts/parity-deviations.json` **and** `packages/css-candy/test/reference-deviations.css`, with a decision note in the vault.
7. **Accessibility**: no axe violation and no console error in any story, light/dark, 1280/390 px, overlays included [`apps/docs/scripts/a11y-audit.mjs`], nor in the dashboard [`apps/dashboard/scripts/e2e.mjs`]; same in Firefox and WebKit [`apps/docs/scripts/cross-browser.mjs`, e2e]. Text on candy colours is ink; contrast ≥ 4.5:1.
8. **Prefer native elements** when they cover keyboard, screen reader and forms (`<input>`, `<details>`, `<meter>`, `<button aria-pressed>`); React Aria only where the platform falls short (tabs, tooltip, dialog, popover, menu); their triggers wrap our `Button` in `Pressable` themselves.
9. **Every story looks like its committed screenshot** (desktop light, phone dark), per platform [`apps/docs/scripts/visual.mjs`, baselines in `apps/docs/test/visual/<platform>/`]. An intended change updates the baselines in the same commit.

## Adding or changing a component

1. `pnpm new:component <Name>` (or edit the existing files: `packages/css-candy/src/components/<name>.css`, `packages/react/src/<name>/`).
2. Style it in the skin with tokens only. Add variants as `cva` maps to `nl-*` classes.
3. Write real tests (behaviour, ARIA) and a story per meaningful state.
4. If the dashboard should use it, use it there (it is the integration test).
5. `pnpm test` must be green; a new story needs `visual:update`.
6. `pnpm changeset` for the packages it touches.
7. Update the vault: the component table in `Librairie React Nerdlab` (or `Package de graphes Nerdlab`), the created-files list in `Package CSS de la peau Candy`, and an ADR if the change is a decision someone could reverse. Every note carries `source_rev` = the commit it describes.

Tokens: edit `packages/tokens/src/candy/*.tokens.json` (never generated files). **Palettes** live in `packages/tokens/src/candy/palettes/<id>.json`: `light` must redefine every literal colour token of `base.tokens.json` (pixel art excepted), `dark` every one `dark.tokens.json` overrides (the build refuses an incomplete palette), and `scripts/check-contrast.mjs` (tokens test) must pass for all of them. The skin never hard-codes a colour: a literal would not follow the palette. CSS variable name = token path joined by `-`; a `DEFAULT` leaf takes the group name (`border.DEFAULT` → `--border`).

## Gotchas

- `apps/dashboard` and the docs typecheck read `packages/*/dist`: after changing a package, rebuild it or they see the old API (`pnpm test` does it).
- `storybook build` does not typecheck; `pnpm test` does.
- `candy.css` loads no fonts: apps import `@robin-dot-lab/css-candy/fonts.css` (Google Fonts) or self-host the same families.
- Hand-written tables using `.nl-table--stack` must set `data-label` on every cell; `DataTable` does it for you.
- `DataTable` sorts internally unless `sort` is passed; with pagination use controlled `sort` + `onSortChange`.
- React Aria collections (Tabs…) render a hidden `<template>` first inside their parent.
- `TooltipTrigger`, `DialogTrigger` and `MenuTrigger` wrap their first child themselves (`Focusable` / `Pressable`): pass our `Button` directly.
- React Aria sets `z-index: 100000` inline on popovers; do not fight it in the skin. After a `ComboBox` pick, the input value is committed as the list closes: in browser tests, wait for it.
- pnpm 11 blocks dependency install scripts: a new dependency with one must be listed in `allowBuilds` (`pnpm-workspace.yaml`).
- Git identity is repo-local (`robin.dot.meyssonnier@gmail.com`, `commit.gpgsign=false`); do not change the global config. The remote is `github.com/robin-dot-lab/nerdlab-design-system` over HTTPS: push with `git -c credential.helper= -c credential.helper='!gh auth git-credential' push` (gh account `robin-dot-lab`), never with the global SSH key.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
