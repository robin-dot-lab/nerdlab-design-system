# Changesets

Every pull request that changes a published package (`@robin-dot-lab/tokens`, `@robin-dot-lab/css-candy`, `@robin-dot-lab/react`, `@robin-dot-lab/charts`) adds a changeset:

```bash
pnpm changeset
```

Pick the packages, the bump (patch / minor / major) and write one line for the changelog, from the consumer's point of view. `pnpm version-packages` turns the pending changesets into versions and `CHANGELOG.md` entries.

Packages are published to **GitHub Packages** (`npm.pkg.github.com`, scope `@robin-dot-lab`) by the **Release** workflow: run it once to open the version pull request, merge it, run it again to publish.
