#!/usr/bin/env bash
# Installs the kit into blank apps outside the workspace, the way the README says, builds them and
# checks them in Chrome:
#   vite/  a single-page app (skin, palettes, components, icons, a chart, axe in three palettes);
#   next/  a Next.js App Router app whose layout and page are server components (ADR-008, ADR-021).
#
#   SOURCE=registry (default)  installs this checkout's versions from GitHub Packages. Needs NODE_AUTH_TOKEN,
#                              a GitHub token with read:packages; it goes in a throwaway user config, never ~/.npmrc.
#   SOURCE=local               installs tarballs packed from this checkout (run `pnpm build` first), so a
#                              change is checked before it is released. No token needed.
#   APPS="vite next"           which apps to check (default both).
#   SKINS="candy bento"        which skins to check each app with (default both, ADR-030): for Bento the
#                              apps import @robin-dot-lab/css-bento instead of css-candy, nothing else changes.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
SOURCE="${SOURCE:-registry}"
APPS="${APPS:-vite next}"
SKINS="${SKINS:-candy bento}"
PKGS="tokens icons css-candy css-bento react charts mail"
WORK="$(mktemp -d)"
version() { node -p "require('$ROOT/packages/$1/package.json').version"; }
# The audit uses the workspace's axe-core, not the latest release: a new axe rule must not turn this
# check red overnight. Upgrading axe-core is a change of its own, made in the workspace first.
AXE="$(grep -m1 -oE '^  axe-core@[0-9][^:]*' "$ROOT/pnpm-lock.yaml" | tr -d ' ')"

SPECS=""
OVERRIDES=""
if [ "$SOURCE" = local ]; then
  mkdir -p "$WORK/tgz"
  for p in $PKGS; do
    (cd "$ROOT/packages/$p" && pnpm pack --pack-destination "$WORK/tgz" >/dev/null)
    tgz="$(ls "$WORK"/tgz/robin-dot-lab-"$p"-*.tgz)"
    SPECS="$SPECS @robin-dot-lab/$p@file:$tgz"
    # The tarballs depend on each other by version: point those at the tarballs too, not at the registry.
    OVERRIDES="$OVERRIDES  '@robin-dot-lab/$p': 'file:$tgz'"$'\n'
  done
else
  : "${NODE_AUTH_TOKEN:?set NODE_AUTH_TOKEN to a GitHub token with read:packages (or SOURCE=local)}"
  printf '//npm.pkg.github.com/:_authToken=%s\n' "$NODE_AUTH_TOKEN" > "$WORK/.userrc"
  export npm_config_userconfig="$WORK/.userrc"
  for p in $PKGS; do SPECS="$SPECS @robin-dot-lab/$p@$(version "$p")"; done
fi
echo "source: $SOURCE"

prepare() {
  local dir="$WORK/$1-$2"
  cp -R "$HERE/$1/." "$dir"
  cd "$dir"
  # The Bento variant: the same app, importing the other skin (the README's two lines).
  if [ "$2" = bento ]; then
    find . -name '*.tsx' -exec sed -i.bak -e 's#@robin-dot-lab/css-candy/fonts.css#@robin-dot-lab/css-bento/fonts.css#' -e 's#@robin-dot-lab/css-candy/candy.css#@robin-dot-lab/css-bento/bento.css#' {} + && find . -name '*.bak' -delete
  fi
  echo '@robin-dot-lab:registry=https://npm.pkg.github.com' > .npmrc
  echo "{ \"name\": \"nerdlab-consumer-$1\", \"private\": true, \"type\": \"module\" }" > package.json
  # A release is checked minutes after it is published: lift pnpm 11's one-day release-age hold here only.
  printf 'minimumReleaseAge: 0\n' > pnpm-workspace.yaml
  if [ -n "$OVERRIDES" ]; then printf 'overrides:\n%s' "$OVERRIDES" >> pnpm-workspace.yaml; fi
}
installed() { node -e "for (const p of '$PKGS'.split(' ')) console.log('@robin-dot-lab/' + p, require('./node_modules/@robin-dot-lab/' + p + '/package.json').version)"; }

for app in $APPS; do for skin in $SKINS; do
  echo "== $app ($skin)"
  prepare "$app" "$skin"
  case "$app" in
    vite)
      # shellcheck disable=SC2086
      pnpm add react@^19 react-dom@^19 $SPECS
      pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom playwright-core "$AXE"
      installed
      npx tsc -p tsconfig.json
      npx vite build
      ;;
    next)
      # shellcheck disable=SC2086
      pnpm add next react@^19 react-dom@^19 $SPECS
      pnpm add -D typescript @types/react @types/react-dom @types/node playwright-core "$AXE"
      installed
      NEXT_TELEMETRY_DISABLED=1 npx next build
      ;;
  esac
  SKIN="$skin" node check.mjs
done; done
echo "consumer checks ok ($SOURCE: $APPS × $SKINS)"
