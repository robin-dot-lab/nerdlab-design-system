import { useEffect } from 'react';
// LIBRARY GAP: transient status message (role=status, auto-dismiss).
export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => { if (!message) return; const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [message, onDone]);
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message && <div className="nl-toast"><span className="nl-toast__icon" aria-hidden="true">✓</span><b>{message}</b></div>}
    </div>
  );
}
