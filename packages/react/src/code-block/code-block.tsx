'use client';

import type { ComponentProps } from 'react';
import { CopyButton } from '../copy/copy-button.js';
import { cn } from '../lib/cn.js';
import { useMessages } from '../lib/i18n.js';

export interface CodeBlockProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The code, as text (it is never parsed as HTML). */
  children: string;
  /** Names the scrollable region (“Message source”); shown in the bar above the code. */
  label: string;
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Show a copy button. Default true. */
  copyable?: boolean;
}

/**
 * Monospace code in `<pre><code>`. The block is a named region that takes keyboard focus, so long lines can be
 * scrolled with the arrow keys; `wrap` breaks them instead. A built-in `CopyButton` copies the whole text.
 */
export function CodeBlock({ children, label, wrap = false, copyable = true, className, ...props }: CodeBlockProps) {
  const { t } = useMessages();
  return (
    <div className={cn('nl-code', wrap && 'nl-code--wrap', className)} {...props}>
      <div className="nl-code__bar">
        <span className="nl-code__label">{label}</span>
        {copyable && <CopyButton value={children} label={t.copyCode} />}
      </div>
      <pre className="nl-code__pre" tabIndex={0} role="region" aria-label={label}><code>{children}</code></pre>
    </div>
  );
}
