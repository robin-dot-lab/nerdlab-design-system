# Nerdlab — design systems & React library

Documentation lives in the Obsidian vault, project **Nerdlab Design System** (`Nerdlab/Nerdlab Design System/`). Read `_Méta/Protocole agent` and the project entry note before working; the vault is the only documentation source.

## Layout
- `design-system-nerdlab-pop/`, `design-system-nous/` — original static design systems (reference + visual previews). Not the source of truth for tokens anymore.
- `packages/tokens` — DTCG token sources (`src/<theme>/*.tokens.json`) → Style Dictionary → `dist/<theme>/tokens.{css,js,d.ts,json}`.

## Commands
- `pnpm install` · `pnpm build` (turbo) · `pnpm test`
- `pnpm --filter @nerdlab/tokens test` — parity check: generated CSS vars must equal the reference stylesheet's.

## Gotchas
- Git: repo-local config uses robin.meyssonnier@outlook.com with `commit.gpgsign=false` (global config would try to sign with a key that does not exist for this identity).
- Token CSS names = path joined with `-`; a `DEFAULT` leaf maps to the group name (`border.DEFAULT` → `--border`).
