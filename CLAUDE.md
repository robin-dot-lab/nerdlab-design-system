# Nerdlab — design systems & React library

Documentation lives in the Obsidian vault, project **Nerdlab Design System** (`Nerdlab/Nerdlab Design System/`). Read `_Méta/Protocole agent` and the project entry note before working; the vault is the only documentation source.

## Layout
- `design-system-nerdlab-pop/`, `design-system-nous/` — original static design systems (reference + visual previews). Not the source of truth for tokens anymore.
- `packages/tokens` — DTCG token sources (`src/<theme>/*.tokens.json`) → Style Dictionary → `dist/<theme>/tokens.{css,js,d.ts,json}`.
- `packages/css-pop` — Pop skin split one file per component (`src/components/*.css`), assembled by `scripts/build.mjs` into `dist/pop.css` with layers `nl.tokens < nl.base < nl.components < nl.utilities`. Fonts are NOT in pop.css: `dist/fonts.css` is opt-in.
- `packages/react` — `@nerdlab/react`, React 19 only, built with plain `tsc` (one ESM file per module, so `"use client"` survives on `field` and `tabs` only). No style values allowed in its sources (`no-style-values.test.ts`).
- `apps/docs` — Storybook 10 (`@nerdlab/docs`). Stories import `@nerdlab/react` **sources** through a Vite alias (`.storybook/main.ts`), so no rebuild is needed while editing components. Telemetry disabled.

## Commands
- `pnpm install` · `pnpm build` (turbo) · `pnpm test`
- `pnpm --filter @nerdlab/tokens test` — parity check: generated CSS vars must equal the reference stylesheet's.
- `pnpm storybook` — dev server on :6006 · `pnpm --filter @nerdlab/react test` — vitest (jsdom)
- `pnpm --filter @nerdlab/docs test` — axe audit of every story (light/dark × 1280/390) on the static build; needs local Chrome + network, ~4 min
- `pnpm --filter @nerdlab/css-pop test` — visual parity: showcase + dashboard screenshots (1440/375, light/dark) must be pixel-identical with the original stylesheet. Uses the installed Chrome via Playwright `channel: "chrome"` (override with `CHROME_CHANNEL`).

## Gotchas
- Layout variants are CSS modifier classes (`.nl-gap-*`, `.nl-grid-auto--*`, `.nl-split--*`, `.nl-cluster--*`, `.nl-stack--*` in `utilities/layout-modifiers.css`); React primitives map props to them. Never set `--stack-gap` & co. inline from React.
- `DataTable` writes `data-label` on every cell (stacked mode). Hand-written tables using `.nl-table--stack` must do it themselves.
- `'use client'` must be the first line of any React module using state/effects/context/React Aria components, and only those (`use-client.test.ts`). Do not put breakpoints or any style value in React code: e.g. `MobileNav` closes when the skin hides its toggle (ResizeObserver), it never reads a media query.
- React Aria collections (Tabs…) render a hidden `<template>` first inside their parent.
- Parity tests compare against the original static stylesheet **plus declared deviations**: `packages/tokens/scripts/parity-deviations.json` and `packages/css-pop/test/reference-deviations.css`. An intentional visual change goes in both places with a decision note; never edit `design-system-nerdlab-pop/` to make a test pass.
- pnpm 11 blocks dependency build scripts: `allowBuilds` in `pnpm-workspace.yaml` (esbuild is set to `false`, it works without its postinstall). A new dependency with a build script makes `pnpm install`/`pnpm run` fail until it is listed there.
- A new CSS file in `packages/css-pop/src` must be added to `src/manifest.json` (order = cascade order); the build fails otherwise.
- Git: repo-local config uses robin.meyssonnier@outlook.com with `commit.gpgsign=false` (global config would try to sign with a key that does not exist for this identity).
- Token CSS names = path joined with `-`; a `DEFAULT` leaf maps to the group name (`border.DEFAULT` → `--border`).
