'use client';

import { useEffect, type ReactNode } from 'react';

export interface ToastProps {
  /** Message to show; null hides the toast. A new message restarts the timer. */
  message: ReactNode | null;
  onDismiss: () => void;
  /** Milliseconds before dismissal. Default 2200. */
  duration?: number;
  icon?: ReactNode;
}

/**
 * Transient status message in a polite live region. The region is always rendered so that
 * screen readers announce the message when it appears.
 */
export function Toast({ message, onDismiss, duration = 2200, icon = '✓' }: ToastProps) {
  useEffect(() => {
    if (message == null) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, onDismiss, duration]);
  return (
    <div className="nl-toast-region" role="status" aria-live="polite">
      {message != null && (
        <div className="nl-toast">
          <span className="nl-toast__icon" aria-hidden="true">{icon}</span>
          <b>{message}</b>
        </div>
      )}
    </div>
  );
}
