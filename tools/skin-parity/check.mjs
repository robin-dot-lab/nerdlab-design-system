// Class API parity between the two skins (ADR-030). Run from packages/css-bento (its `test` does it,
// after both skins are built). Every .nl-* class and modifier of css-candy must exist in css-bento and
// the reverse, and both public API snapshots must be the same list: a class added to one skin is added
// to the other in the same change, or the skins drift apart (what killed the Ultramarine skin, ADR-013).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const classes = (file) => new Set(fs.readFileSync(path.join(ROOT, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').match(/\.nl-[a-z0-9_-]+/g));
const surface = (file) => (fs.existsSync(path.join(ROOT, file)) ? fs.readFileSync(path.join(ROOT, file), 'utf8') : '').split('\n').filter((l) => l && !l.startsWith('#'));
const candy = classes('packages/css-candy/dist/candy.css');
const bento = classes('packages/css-bento/dist/bento.css');
const onlyCandy = [...candy].filter((c) => !bento.has(c)).sort();
const onlyBento = [...bento].filter((c) => !candy.has(c)).sort();
const a = surface('packages/css-candy/api-surface.txt'), b = surface('packages/css-bento/api-surface.txt');
const surfacesDiffer = a.join('\n') !== b.join('\n');
if (onlyCandy.length) console.error(`only in css-candy (add them to css-bento):\n  ${onlyCandy.join('\n  ')}`);
if (onlyBento.length) console.error(`only in css-bento (add them to css-candy):\n  ${onlyBento.join('\n  ')}`);
if (surfacesDiffer) console.error('packages/css-candy/api-surface.txt and packages/css-bento/api-surface.txt differ: run both package tests with UPDATE_API=1 once the classes match');
if (onlyCandy.length || onlyBento.length || surfacesDiffer) process.exit(1);
console.log(`skin parity ok: ${candy.size} classes in both skins`);
