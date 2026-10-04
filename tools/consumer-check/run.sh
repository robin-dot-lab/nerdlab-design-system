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
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
SOURCE="${SOURCE:-registry}"
APPS="${APPS:-vite next}"
PKGS="tokens icons css-candy react charts mail"
WORK="$(mktemp -d)"
version() { node -p "require('$ROOT/packages/$1/package.json').version"; }

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
  local dir="$WORK/$1"
  cp -R "$HERE/$1/." "$dir"
  cd "$dir"
  echo '@robin-dot-lab:registry=https://npm.pkg.github.com' > .npmrc
  echo "{ \"name\": \"nerdlab-consumer-$1\", \"private\": true, \"type\": \"module\" }" > package.json
  # A release is checked minutes after it is published: lift pnpm 11's one-day release-age hold here only.
  printf 'minimumReleaseAge: 0\n' > pnpm-workspace.yaml
  if [ -n "$OVERRIDES" ]; then printf 'overrides:\n%s' "$OVERRIDES" >> pnpm-workspace.yaml; fi
}
installed() { node -e "for (const p of '$PKGS'.split(' ')) console.log('@robin-dot-lab/' + p, require('./node_modules/@robin-dot-lab/' + p + '/package.json').version)"; }

for app in $APPS; do
  echo "== $app"
  prepare "$app"
  case "$app" in
    vite)
      # shellcheck disable=SC2086
      pnpm add react@^19 react-dom@^19 $SPECS
      pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom playwright-core axe-core
      installed
      npx tsc -p tsconfig.json
      npx vite build
      ;;
    next)
      # shellcheck disable=SC2086
      pnpm add next react@^19 react-dom@^19 $SPECS
      pnpm add -D typescript @types/react @types/react-dom @types/node playwright-core axe-core
      installed
      NEXT_TELEMETRY_DISABLED=1 npx next build
      ;;
  esac
  node check.mjs
done
echo "consumer checks ok ($SOURCE: $APPS)"
