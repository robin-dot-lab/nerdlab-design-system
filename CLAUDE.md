# Nerdlab — design systems & React library

Documentation lives in the Obsidian vault, project **Nerdlab Design System** (`Nerdlab/Nerdlab Design System/`). Read `_Méta/Protocole agent` and the project entry note before working; the vault is the only documentation source.

## Layout
- `design-system-nerdlab-pop/`, `design-system-nous/` — original static design systems (reference + visual previews). Not the source of truth for tokens anymore.
- `packages/tokens` — DTCG token sources (`src/<theme>/*.tokens.json`) → Style Dictionary → `dist/<theme>/tokens.{css,js,d.ts,json}`.
- `packages/css-pop` — Pop skin split one file per component (`src/components/*.css`), assembled by `scripts/build.mjs` into `dist/pop.css` with layers `nl.tokens < nl.base < nl.components < nl.utilities`. Fonts are NOT in pop.css: `dist/fonts.css` is opt-in.

## Commands
- `pnpm install` · `pnpm build` (turbo) · `pnpm test`
- `pnpm --filter @nerdlab/tokens test` — parity check: generated CSS vars must equal the reference stylesheet's.
- `pnpm --filter @nerdlab/css-pop test` — visual parity: showcase + dashboard screenshots (1440/375, light/dark) must be pixel-identical with the original stylesheet. Uses the installed Chrome via Playwright `channel: "chrome"` (override with `CHROME_CHANNEL`).

## Gotchas
- A new CSS file in `packages/css-pop/src` must be added to `src/manifest.json` (order = cascade order); the build fails otherwise.
- Git: repo-local config uses robin.meyssonnier@outlook.com with `commit.gpgsign=false` (global config would try to sign with a key that does not exist for this identity).
- Token CSS names = path joined with `-`; a `DEFAULT` leaf maps to the group name (`border.DEFAULT` → `--border`).
