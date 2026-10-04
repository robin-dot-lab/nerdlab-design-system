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
| `packages/mail` | `@robin-dot-lab/mail`: mail components on top of `react` (message list, email viewer, attachments, address card). No CSS of its own: its styles are `css-candy/src/components/mail.css`. Its guards (style values, `'use client'`, story/test/class integrity, language) are `src/guards.test.ts` |
| `apps/docs` | Storybook 10 + a11y audit of every story |
| `apps/dashboard` | Integration test: a real page built against the packages' `dist/` |
| `packages/css-candy/test/reference/` | The original static design, frozen: stylesheet + two pages, the oracle of the parity tests. Never edit it to make a test pass. Candy was called **Pop** until 2026-10-02: these files still say Pop, and `.nl-pop-text` names an effect, not the skin — keep it. Candy is the only skin; colour variety comes from palettes |
| `tools/` | `new-component` generator, `test-fonts` offline font cache, `readme-assets` (README images), `consumer-check` (the kit installed from outside into a Vite app and a Next.js App Router app), `api-surface` (public API snapshot) |
| `.github/workflows/` | CI (`pnpm test` in 16 parallel jobs, every palette audited, forced colours, packed packages checked in Vite and Next.js), Pages (Storybook + dashboard), Release (version PR, then publish + tags + releases), Consumer check (after each release: install from the registry into a blank app, build, check), visual baselines (Linux) |

## Commands

- `pnpm install` · `pnpm build` · `pnpm test` (builds, typechecks, then tests every package, ~13 min, no network needed; `STORY_FILTER` to iterate faster) · `pnpm typecheck`
- `pnpm changeset` — describe a change to a published package (`@robin-dot-lab/tokens`, `css-candy`, `react`, `charts`, `icons`, `mail`) for the changelog. Packages are published to GitHub Packages (`@robin-dot-lab`, `npm.pkg.github.com`) by the manual *Release* workflow. While `.changeset/pre.json` exists the repo is in pre-release mode (`1.0.0-rc.N`, dist-tag `rc`); `pnpm changeset pre exit` before the final 1.0.0
- `pnpm storybook` (:6006, reads sources) · `pnpm --filter @robin-dot-lab/dashboard dev` (:5173, reads `dist/`: run `pnpm build` first)
- `pnpm new:component <PascalName> [--element span]` — scaffold a component everywhere it must exist
- `pnpm fetch:test-fonts` — refresh the offline font cache when a test reports a missing font URL
- `pnpm --filter @robin-dot-lab/docs visual:update` — rewrite the story screenshots of your platform after an intended visual change (CI's Linux set: the *Update visual baselines* workflow)
- `STORY_FILTER=<id fragment>` — limits the Storybook audit, visual and cross-browser scripts to matching stories
- `PALETTE=<id> node scripts/a11y-audit.mjs` (in `apps/docs`) — audits every story in another palette (CI does it for all of them)
- `node scripts/forced-colors.mjs` (in `apps/docs`) — every story in forced colours (Windows high contrast)
- `node scripts/email-sandbox.mjs` (in `apps/docs`) — the `EmailViewer`'s isolation in Chrome: no script, no form, no remote image before “Show images”
- `UPDATE_API=1 pnpm --filter <package> test` — accept a change of the public API snapshot (`api-surface.txt`); a removed line needs a major changeset
- `node tools/readme-assets/capture.mjs` — regenerate the README images (after `pnpm build`)
- `SOURCE=local tools/consumer-check/run.sh` — pack this checkout and install it into a blank Vite app and a Next.js App Router app, build and check them (after `pnpm build`; needs the network for npm). Without `SOURCE=local` it installs this checkout's versions from the registry: `NODE_AUTH_TOKEN=$(gh auth token)` (needs `read:packages`)
- Firefox and WebKit for the cross-browser tests: `node node_modules/playwright-core/cli.js install firefox webkit`

## Rules (each one is enforced; the guard is in brackets)

1. **The CSS is the source of truth.** React never carries a colour, length or `style` prop [`packages/react/src/no-style-values.test.ts`]. Variants are classes, including layout ones (`.nl-gap-*`, `.nl-split--*`…); colour keys are token names (`ToggleChip swatch="chart-2"`), never values.
2. **Charts** compute geometry only; colours come from `--chart-N` / `--chart-seq-N` [`packages/charts/src/guards.test.ts`]. At most 4 series per chart.
3. **`'use client'`** is the first line of a module iff it uses state, effects, refs, context or React Aria components [`use-client.test.ts`, `guards.test.ts`].
4. **Every exported component has a story and a test, and every `nl-*` class it uses exists in the skin** [`packages/react/src/kit-integrity.test.ts`].
5. **Every skin file is in `manifest.json`**; new files go **at the end** so they cannot change the cascade of existing rules [build + kit integrity].
6. **The skin must render identically to the reference** except for declared deviations [`packages/css-candy/scripts/visual-parity.mjs`, `packages/tokens/scripts/check-parity.mjs`]. An intentional visual change goes in `packages/tokens/scripts/parity-deviations.json` **and** `packages/css-candy/test/reference-deviations.css`, with a decision note in the vault.
7. **Accessibility**: no axe violation and no console error in any story, light/dark, 1280/390 px, overlays included [`apps/docs/scripts/a11y-audit.mjs`], nor in the dashboard [`apps/dashboard/scripts/e2e.mjs`]; same in Firefox and WebKit [`apps/docs/scripts/cross-browser.mjs`, e2e]. Text on candy colours is ink; contrast ≥ 4.5:1. In forced colours, marks, data, selected states and focus rings stay visible: fixes go in `forced-colors.css` [`apps/docs/scripts/forced-colors.mjs`].
8. **Prefer native elements** when they cover keyboard, screen reader and forms (`<input>`, `<details>`, `<meter>`, `<button aria-pressed>`); React Aria only where the platform falls short (tabs, tooltip, dialog, popover, menu); their triggers wrap our `Button` in `Pressable` themselves.
9. **Every story looks like its committed screenshot** (desktop light, phone dark), per platform [`apps/docs/scripts/visual.mjs`, baselines in `apps/docs/test/visual/<platform>/`]. An intended change updates the baselines in the same commit.
10. **The public API is a snapshot**: every export of `react`/`charts`/`icons`, every `.nl-*` class, CSS variable and palette id is listed in the package's `api-surface.txt`; a removal is a breaking change (major changeset) [`tools/api-surface/check.mjs`, in each package's `test`]. `packages/react/src/index.ts` re-exports only from the package's own modules [`use-client.test.ts`].
11. **The kit's words follow React Aria's locale** (`useMessages()` in `packages/react/src/lib/i18n.ts`, `useChartLocale()` in charts): English and French, never a hard-coded sentence; a component never takes a `locale` or `lang` prop [`packages/react/src/i18n.test.tsx`, `packages/charts/src/charts.test.tsx`].

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
- React Aria Components has no `'use client'`: never re-export it from the package index directly, go through a `'use client'` module (`lib/react-aria.ts`). In a server component, function props and `CalendarDate` values cannot reach a client component.
- Stories render under `<I18nProvider locale="en-GB">` (toolbar *Locale*), the dashboard under `fr-FR`: screenshots never depend on the machine's language. `visual.mjs` also freezes the clock (2026-10-04 10:00 UTC) and the time zone (UTC): write story dates relative to `Date.now()`.
- `forced-colors.css` stays the last file of the manifest: a new skin file goes just before it, or its rules would override the forced-colour fixes.
- A sandboxed iframe (the `EmailViewer`) has an opaque origin: axe runs with `iframes: false`, and focus inside it matches no selector on the `<iframe>` (the viewer sets `data-focused` itself).
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
