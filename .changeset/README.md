# Changesets

Every pull request that changes a published package (`@nerdlab/tokens`, `@nerdlab/css-candy`, `@nerdlab/react`, `@nerdlab/charts`) adds a changeset:

```bash
pnpm changeset
```

Pick the packages, the bump (patch / minor / major) and write one line for the changelog, from the consumer's point of view. `pnpm version-packages` turns the pending changesets into versions and `CHANGELOG.md` entries; the **Release** workflow does it in a pull request.

Nothing is published yet: the registry is not chosen. `"access": "restricted"` keeps an accidental `changeset publish` from going public.
