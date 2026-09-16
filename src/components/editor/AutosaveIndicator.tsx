import type { AutosaveStatus } from '../../hooks/useAutosave';

export function AutosaveIndicator({ status }: { status: AutosaveStatus }) {
  if (status === 'idle') return <span className="autosave-indicator" aria-live="polite" />;
  return (
    <span className="autosave-indicator" aria-live="polite">
      {status === 'saving' ? 'Saving…' : '✓ Saved automatically'}
    </span>
  );
}
