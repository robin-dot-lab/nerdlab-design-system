'use client';

import { Button, Callout, CodeBlock, Tab, TabList, TabPanel, Tabs } from '@robin-dot-lab/react';
import { useEffect, useRef, useState, type ComponentProps, type Key } from 'react';
import { cn } from '../lib/cn.js';
import { emailDocument, hasRemoteImages } from '../lib/email-html.js';
import { useMailMessages } from '../lib/i18n.js';

export type EmailView = 'html' | 'text' | 'source';

export interface EmailViewerProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The HTML body. Shown in a sandboxed iframe: no script, no form, no same-origin access, a strict CSP. */
  html?: string;
  /** The plain-text body. */
  text?: string;
  /** The raw message (headers and body), shown in a `CodeBlock`. */
  source?: string;
  /** Selected tab (controlled). */
  view?: EmailView;
  /** Initially selected tab. Default: HTML when there is HTML, else text. */
  defaultView?: EmailView;
  onViewChange?: (view: EmailView) => void;
}

/**
 * An email, safely. The HTML version renders in `<iframe srcdoc sandbox>` without `allow-scripts`,
 * `allow-same-origin` or `allow-forms` (only popups, so links open in a new tab, with `noopener noreferrer`),
 * and with a CSP injected into the document: nothing loads but inline styles and embedded images. Remote images
 * load only after “Show images”, which adds `https:` to the CSP for this message. Tabs switch to the text version
 * and the source. The frame cannot measure its content (that would need same-origin): the skin gives it a height.
 */
export function EmailViewer({ html, text, source, view, defaultView, onViewChange, className, ...props }: EmailViewerProps) {
  const { t } = useMailMessages();
  const [images, setImages] = useState(false);
  // Built after mount: DOMParser does not exist on the server, and a srcdoc that differed between the
  // server and the client would break hydration.
  const [doc, setDoc] = useState<string | null>(null);
  useEffect(() => { setImages(false); }, [html]);
  useEffect(() => { setDoc(html == null ? null : emailDocument(html, { remoteImages: images })); }, [html, images]);
  const remote = html != null && hasRemoteImages(html);

  // Focus inside the email's document matches no selector on the <iframe> (:focus, :focus-within…), so
  // the page cannot draw a ring around it by CSS alone. The attribute is set right in the focus events
  // (not through a re-render) so the ring is there as soon as focus lands; the skin styles [data-focused].
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const sync = () => { const el = frame.current; el?.toggleAttribute('data-focused', document.activeElement === el); };
    const onBlur = () => { sync(); setTimeout(sync, 0); };
    window.addEventListener('blur', onBlur);
    document.addEventListener('focusin', sync);
    return () => { window.removeEventListener('blur', onBlur); document.removeEventListener('focusin', sync); };
  }, []);

  return (
    <div className={cn('nl-email', className)} {...props}>
      <Tabs
        selectedKey={view}
        defaultSelectedKey={defaultView ?? (html != null ? 'html' : 'text')}
        onSelectionChange={(k: Key) => onViewChange?.(k as EmailView)}
      >
        <TabList aria-label={t.views}>
          <Tab id="html">{t.html}</Tab>
          <Tab id="text">{t.text}</Tab>
          {source != null && <Tab id="source">{t.source}</Tab>}
        </TabList>
        <TabPanel id="html" className="nl-email__panel">
          {html == null ? <p className="nl-email__missing">{t.noHtml}</p> : (
            <>
              {remote && !images && (
                <Callout className="nl-email__images">
                  <p>{t.remoteImagesBlocked}</p>
                  <Button size="sm" onClick={() => setImages(true)}>{t.showImages}</Button>
                </Callout>
              )}
              {doc != null && (
                <iframe
                  ref={frame}
                  className="nl-email__frame"
                  title={t.emailContent}
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                  referrerPolicy="no-referrer"
                  srcDoc={doc}
                />
              )}
            </>
          )}
        </TabPanel>
        <TabPanel id="text" className="nl-email__panel">
          {text == null ? <p className="nl-email__missing">{t.noText}</p> : <div className="nl-email__text">{text}</div>}
        </TabPanel>
        {source != null && (
          <TabPanel id="source" className="nl-email__panel">
            <CodeBlock label={t.source}>{source}</CodeBlock>
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
}
