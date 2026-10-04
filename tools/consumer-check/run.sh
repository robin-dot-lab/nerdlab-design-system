#!/usr/bin/env bash
# Installs the published kit into a blank Vite app, outside the workspace, the way the README says,
# then builds it and checks it in Chrome (app/check.mjs). Needs NODE_AUTH_TOKEN: a GitHub token with
# read:packages. Never touches ~/.npmrc: the token goes in a throwaway user config.
set -euo pipefail
: "${NODE_AUTH_TOKEN:?set NODE_AUTH_TOKEN to a GitHub token with read:packages}"
HERE="$(cd "$(dirname "$0")" && pwd)"
DIR="$(mktemp -d)"
cp -R "$HERE/app/." "$DIR"
cd "$DIR"
echo '@robin-dot-lab:registry=https://npm.pkg.github.com' > .npmrc
printf '//npm.pkg.github.com/:_authToken=%s\n' "$NODE_AUTH_TOKEN" > "$DIR/.userrc"
export npm_config_userconfig="$DIR/.userrc"
echo '{ "name": "nerdlab-consumer-check", "private": true, "type": "module" }' > package.json
# A release is checked minutes after it is published: lift pnpm 11's one-day release-age hold here only.
printf 'minimumReleaseAge: 0\n' > pnpm-workspace.yaml
pnpm add react@^19 react-dom@^19 @robin-dot-lab/css-candy @robin-dot-lab/react @robin-dot-lab/charts @robin-dot-lab/icons @robin-dot-lab/tokens
pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom playwright-core axe-core
node -e "for (const p of ['css-candy','react','charts','icons','tokens']) console.log('@robin-dot-lab/' + p, require('./node_modules/@robin-dot-lab/' + p + '/package.json').version)"
npx tsc -p tsconfig.json
npx vite build
node check.mjs
