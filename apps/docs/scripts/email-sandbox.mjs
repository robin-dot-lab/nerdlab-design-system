// What jsdom cannot check: the EmailViewer's isolation in a real browser (Chrome). The Mail/Viewer story
// renders an email holding a <script>, a <form> and a remote image. This script proves, in the iframe:
//   - the script did not run and no <script> or <form> is left; a script injected afterwards does not run either;
//   - the remote image is not requested until “Show images”, then it is, and only then (CSP img-src https:);
//   - an image added behind the viewer's back is refused by the CSP;
//   - links open in a new tab with noopener noreferrer.
import pw from 'playwright-core';
import { missingFonts, routeTestFonts } from '../../../tools/test-fonts/route.mjs';
import { serveStorybook, storyUrl, waitForStory } from './lib/storybook.mjs';

const { base, close } = await serveStorybook();
const browser = await pw.chromium.launch({ channel: process.env.CHROME_CHANNEL ?? 'chrome' });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
await routeTestFonts(context);
// Remote hosts of the story's email: count the requests, never reach the network.
const requests = [];
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
await context.route(/tracker\.example|evil\.example|elsewhere\.example/, (route) => {
  requests.push(route.request().url());
  route.fulfill({ status: 200, contentType: 'image/gif', body: PIXEL });
});

const failures = [];
const check = (ok, label) => { console.log(`${ok ? '✓' : '✗'} ${label}`); if (!ok) failures.push(label); };

const page = await context.newPage();
await page.goto(storyUrl(base, 'mail-components--viewer', 'light'), { waitUntil: 'networkidle' });
await waitForStory(page);
const iframe = page.locator('iframe.nl-email__frame');
await iframe.waitFor();
check(await iframe.getAttribute('sandbox') === 'allow-popups allow-popups-to-escape-sandbox', 'sandbox: popups only (no scripts, same origin or forms)');
const frame = page.frameLocator('iframe.nl-email__frame');
await frame.locator('h1').waitFor();
check(await frame.locator('body').innerText().then((t) => !t.includes('hacked') && t.includes('Your ticket is ready')), 'the email renders and its script did not run');
check(await frame.locator('script, form').count() === 0, 'no <script> or <form> left in the email');
const link = frame.locator('a[href^="https://pixelparty.example"]');
check(await link.getAttribute('target') === '_blank' && await link.getAttribute('rel') === 'noopener noreferrer', 'links open in a new tab, noopener noreferrer');
await page.waitForTimeout(300);
check(requests.length === 0, `remote image not requested before “Show images” (${requests.length} request(s))`);

// Behind the viewer's back: a script and a remote image added to the document directly (devtools-level access).
// The sandbox must keep the script inert and the CSP must refuse the image.
const handle = await iframe.elementHandle();
const doc = await handle.contentFrame();
await doc.evaluate(() => {
  const s = document.createElement('script');
  s.textContent = 'document.body.dataset.ran = "yes"';
  document.body.append(s);
  const img = document.createElement('img');
  img.src = 'https://elsewhere.example/sneaky.png';
  document.body.append(img);
});
await page.waitForTimeout(300);
check(await doc.evaluate(() => document.body.dataset.ran) === undefined, 'an injected script does not run (sandbox without allow-scripts)');
check(!requests.some((u) => u.includes('elsewhere.example')), 'an injected remote image is refused (CSP img-src without https:)');

await page.getByRole('button', { name: 'Show images' }).click();
await frame.locator('img[alt="Pixel Party banner"]').waitFor();
await page.waitForTimeout(500);
check(requests.some((u) => u.includes('tracker.example/banner.png')), 'after “Show images”, the remote image is requested');
check(!requests.some((u) => u.includes('evil.example')), 'nothing ever reached the form’s target');

await browser.close();
close();
if (missingFonts.size) { console.error(`${missingFonts.size} font URL(s) missing from tools/test-fonts/cache — run \`pnpm fetch:test-fonts\``); process.exit(1); }
if (failures.length) { console.error(`${failures.length} failing check(s)`); process.exit(1); }
console.log('email sandbox ok');
