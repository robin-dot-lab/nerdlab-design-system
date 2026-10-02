// Serves Google Fonts from the local test cache to Playwright, so browser tests never depend on the network.
// A font URL missing from the cache is NOT silently replaced: the request is aborted and the URL is reported,
// which makes the test fail with an explicit message. Refresh the cache with `pnpm fetch:test-fonts`.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(import.meta.dirname, 'cache');
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));

export const missingFonts = new Set();

/** Route fonts.googleapis.com and fonts.gstatic.com of a Playwright BrowserContext to the cache. */
export async function routeTestFonts(context) {
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const url = route.request().url();
    const entry = manifest.entries[url];
    if (!entry) {
      missingFonts.add(url);
      console.error(`[test-fonts] not in cache: ${url} — run \`pnpm fetch:test-fonts\``);
      return route.abort('blockedbyclient');
    }
    return route.fulfill({
      status: 200,
      contentType: entry.contentType,
      headers: { 'access-control-allow-origin': '*' },
      body: fs.readFileSync(path.join(DIR, entry.file)),
    });
  });
}
