// Turns the HTML of an email into the document of a sandboxed <iframe srcdoc> (ADR on the email viewer).
// The sandbox (no allow-scripts, no allow-same-origin, no allow-forms) and the CSP below are the
// security boundary; the clean-up here is defence in depth and makes the document behave (links open in
// a new tab, no refresh redirect). Browser only: it needs DOMParser.

/** CSP injected into the email: nothing loads but inline styles and embedded images, plus https images once allowed. */
export const emailCsp = (remoteImages: boolean) =>
  `default-src 'none'; style-src 'unsafe-inline'; img-src data: cid:${remoteImages ? ' https:' : ''}`;

const REMOTE_IMAGE = /\b(?:src|background|srcset)\s*=\s*["']?\s*(?:https?:)?\/\/|url\(\s*["']?\s*(?:https?:)?\/\//i;
const REMOTE_URL = /^\s*(?:https?:)?\/\//i;

/** Whether the email asks for images from the network (so the viewer offers to show them). */
export const hasRemoteImages = (html: string) => REMOTE_IMAGE.test(html);

const DROP = 'script, noscript, iframe, frame, frameset, object, embed, applet, base, link, meta';

/** The srcdoc for an email: cleaned, with the CSP, a no-referrer policy and links that open in a new tab. */
export function emailDocument(html: string, { remoteImages = false } = {}): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll(DROP).forEach((el) => el.remove());
  // Forms cannot submit in the sandbox anyway; they become plain blocks so nothing looks submittable.
  doc.querySelectorAll('form').forEach((form) => {
    const div = doc.createElement('div');
    div.append(...form.childNodes);
    form.replaceWith(div);
  });
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      const value = attr.value.replace(/[\s\u0000-\u001f]/g, '').toLowerCase();
      if (name.startsWith('on') || name === 'formaction' || name === 'action' || /^(?:javascript|vbscript|data:text\/html)/.test(value)) {
        el.removeAttribute(attr.name);
      }
    }
  });
  // Until the user allows them, remote images are not even requested: their URLs are parked in data-*
  // attributes (a request the CSP blocked would still reach the console, and say nothing to the sender).
  if (!remoteImages) {
    doc.querySelectorAll('img, source, input[type="image"]').forEach((el) => {
      for (const name of ['src', 'srcset']) {
        const value = el.getAttribute(name);
        if (value && (REMOTE_URL.test(value) || (name === 'srcset' && /(?:https?:)?\/\//i.test(value)))) {
          el.setAttribute(`data-blocked-${name}`, value);
          el.removeAttribute(name);
        }
      }
    });
    doc.querySelectorAll('[background]').forEach((el) => { if (REMOTE_URL.test(el.getAttribute('background')!)) el.removeAttribute('background'); });
  } else {
    // Allowed: images parked in data-blocked-* (by this function, or by a server that blocks remote images
    // the same way) get their URLs back, so “Show images” works even on HTML that arrived without them.
    doc.querySelectorAll('img, source, input[type="image"]').forEach((el) => {
      for (const name of ['src', 'srcset']) {
        const parked = el.getAttribute(`data-blocked-${name}`);
        if (parked && !el.hasAttribute(name)) el.setAttribute(name, parked);
        el.removeAttribute(`data-blocked-${name}`);
      }
    });
  }
  doc.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  const head = doc.head;
  const meta = (attrs: Record<string, string>) => {
    const m = doc.createElement('meta');
    for (const [k, v] of Object.entries(attrs)) m.setAttribute(k, v);
    return m;
  };
  const base = doc.createElement('base');
  base.setAttribute('target', '_blank');
  head.prepend(
    meta({ charset: 'utf-8' }),
    meta({ 'http-equiv': 'Content-Security-Policy', content: emailCsp(remoteImages) }),
    meta({ name: 'referrer', content: 'no-referrer' }),
    meta({ name: 'color-scheme', content: 'light' }),
    base,
  );
  return `<!doctype html>${doc.documentElement.outerHTML}`;
}
