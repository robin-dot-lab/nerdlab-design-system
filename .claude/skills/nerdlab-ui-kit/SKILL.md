---
name: nerdlab-ui-kit
description: Procedure for evolving the Nerdlab UI kit in this repo — adding or changing a React component, a skin class (nl-*), a design token, a chart, or a story. Use whenever a task touches packages/react, packages/css-candy, packages/tokens, packages/charts or apps/docs, so the change lands in every place the kit requires and the Obsidian vault stays in sync.
---

# Evolving the Nerdlab UI kit

The rules and commands are in `AGENTS.md` (already loaded through CLAUDE.md). This skill is the **order of work** and the **definition of done**. The reasons behind each rule are in the vault (`Nerdlab/Nerdlab Design System/`, ADR-001 to ADR-011): read the relevant ADR before going against a rule, and never re-decide it silently.

## 0. Before touching code

1. Read the vault entry note `Nerdlab Design System` and `Questions ouvertes du design system Nerdlab` (Obsidian MCP, read tools only).
2. If the change hits an open question, or contradicts an ADR, stop and ask the user.
3. Decide where the change belongs:
   - a look → `packages/css-candy` (tokens in `packages/tokens` if a value is new);
   - a behaviour or an API → `packages/react` / `packages/charts`;
   - both → CSS first, then React.

## 1. New component

```bash
pnpm new:component <PascalName> [--element span]
```

It creates the skin CSS (appended last to `manifest.json`), the component, a test, a story and the export. Then:

- Style `.nl-<name>` with tokens only (`var(--color-*)`, `var(--space-*)`…). No raw colours, no magic numbers that a token already covers.
- Variants: a `cva` map from props to `nl-<name>--*` classes. Never a style prop, never a CSS variable set from React.
- Prefer a native element (ADR-009). Add `'use client'` only if the module uses state, effects, refs, context or React Aria.
- Accessibility first: role, name, keyboard, `aria-*` states; announce in words, not colour. Test them.
- Story: one per meaningful state; a render-only story on a component with required props is typed `StoryObj` (no generic).

## 2. Changing an existing component or class

- Changing a class's look is a visual change: if the parity test fails, it is either a regression (fix it) or an intended change (declare it in `parity-deviations.json` **and** `test/reference-deviations.css`, plus an ADR or a line in the relevant note). Never edit `design-system-nerdlab-candy/`.
- Renaming or removing a class or a prop is a breaking change for consumers: ask first.

## 3. Tokens and charts

- Tokens: edit `packages/tokens/src/candy/*.tokens.json`; dark overrides in `dark.tokens.json`. New colours used for text must reach 4.5:1 on their background in both themes.
- Charts: geometry in JS, colours via `slotColor(slot)` / `seqColor(step)` only, styles in `packages/css-candy/src/components/charts.css` (ADR-011). Max 4 series.

## 4. Definition of done

- [ ] `pnpm test` green (it builds, typechecks, runs unit tests, kit integrity, parity, Storybook a11y audit, dashboard e2e). If a browser test fails, read its `console` lines first.
- [ ] If the dashboard is a natural consumer, it uses the new piece (it is the integration test).
- [ ] Vault updated, editing notes **in place** (never stacking dated sections), after reading them:
  - component table in `Librairie React Nerdlab` or `Package de graphes Nerdlab`;
  - created-files list in `Package CSS de la peau Candy`;
  - `Documentation Storybook Nerdlab` stories table and audit count;
  - an ADR (`ADR-NNN Titre affirmatif`, with at least one rejected alternative) if someone could reasonably reverse the choice;
  - `source_rev` and `updated` moved together on every note touched; roadmap in the entry note if a step changed.
- [ ] Commit with a message that says why, not only what.
- [ ] Report: files changed, points left undecided, gaps between docs and code.
