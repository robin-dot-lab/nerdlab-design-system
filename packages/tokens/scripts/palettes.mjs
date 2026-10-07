// Palettes: alternative colour sets for the Candy skin. A palette redefines every literal colour
// token (and shadow.soft) of src/candy/base.tokens.json, plus the ones dark.tokens.json overrides
// for its dark theme. Candy itself is a palette too, read from those two files.
import fs from 'node:fs';
import path from 'node:path';

const SRC = new URL('../src/candy/', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, SRC), 'utf8'));

/** Literal colour tokens of a DTCG tree, as { 'color.primary': '#FF4FA3', … } (aliases left out). */
function literals(tree, prefix = []) {
  const out = {};
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) {
      const key = [...prefix, k].join('.');
      // Pixel-art colours (pixel.*) are the same in every palette: a sprite keeps its colours.
      const isColour = (v.$type === 'color' && !key.startsWith('pixel.')) || key === 'shadow.soft';
      if (isColour && !String(v.$value).startsWith('{')) out[key] = v.$value;
    } else if (v && typeof v === 'object') Object.assign(out, literals(v, [...prefix, k]));
  }
  return out;
}

export const cssName = (key) => `--${key.split('.').filter((p) => p !== 'DEFAULT').join('-')}`;

/** Every palette, Candy first: { id, name, description, light: {...all keys}, dark: {...all keys} }. */
export function loadPalettes() {
  const light = literals(read('base.tokens.json'));
  const darkOverrides = literals(read('dark.tokens.json'));
  const candy = { id: 'candy', name: 'Candy', description: 'The original: candy colours on a neo-brutalist frame.', light, dark: { ...light, ...darkOverrides } };
  const dir = new URL('palettes/', SRC);
  const others = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const p = JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
    const id = path.basename(f, '.json');
    const missing = Object.keys(light).filter((k) => !(k in p.light));
    const extra = Object.keys(p.light).filter((k) => !(k in light));
    const missingDark = Object.keys(darkOverrides).filter((k) => !(k in p.dark));
    if (missing.length || extra.length || missingDark.length) {
      throw new Error(`palette ${id}: missing [${missing}] extra [${extra}] missing in dark [${missingDark}]`);
    }
    return { id, name: p.name, description: p.description, light: p.light, dark: { ...p.light, ...p.dark } };
  });
  return [candy, ...others];
}

/** Every token of a DTCG tree, flat ({ 'color.primary': '#…', 'color.line': '{ink}', … }). */
function flat(tree, prefix = [], out = {}) {
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out[[...prefix, k].join('.')] = String(v.$value);
    else if (v && typeof v === 'object') flat(v, [...prefix, k], out);
  }
  return out;
}
const resolve = (values) => {
  // Whole-value aliases only ({ink}); composite values (borders, shadows) are left as written.
  const get = (k, depth = 0) => {
    const v = values[k] ?? values[`${k}.DEFAULT`];
    if (depth > 10 || v === undefined) throw new Error(`cannot resolve ${k}`);
    return /^\{[^}]+\}$/.test(v) ? get(v.slice(1, -1), depth + 1) : v;
  };
  return Object.fromEntries(Object.keys(values).map((k) => [k, get(k)]));
};

/** Bento's single palette, aliases resolved: { light: {...}, dark: {...} } (ADR-030). */
export function loadBento() {
  const read = (f) => JSON.parse(fs.readFileSync(new URL(`../src/bento/${f}`, import.meta.url), 'utf8'));
  const light = flat(read('base.tokens.json'));
  return { light: resolve(light), dark: resolve({ ...light, ...flat(read('dark.tokens.json')) }) };
}
