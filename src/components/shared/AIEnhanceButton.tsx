import type { AIEnhanceStatus } from '../../hooks/useAIEnhance';
import { AIConsentModal } from './AIConsentModal';

interface Props {
  label: string;
  onClick: () => void;
  status: AIEnhanceStatus;
  errorMessage: string | null;
  onConsentContinue: () => void;
  onConsentCancel: () => void;
  disabled?: boolean;
}

/** Shared "✨ Make Professional" / "✨ Create My Profile" control — keeps
 * wording, loading state and the first-use consent prompt consistent across
 * every AI-enabled section instead of six separate implementations. */
export function AIEnhanceButton({ label, onClick, status, errorMessage, onConsentContinue, onConsentCancel, disabled }: Props) {
  const loading = status === 'loading';

  return (
    <div className="ai-enhance">
      <button type="button" className="ai-enhance-button" onClick={onClick} disabled={disabled || loading}>
        {loading ? 'Improving your wording…' : label}
      </button>
      {status === 'error' && errorMessage ? (
        <p className="ai-enhance-error" role="status">
          {errorMessage}
        </p>
      ) : null}
      {status === 'pending-consent' ? <AIConsentModal onContinue={onConsentContinue} onCancel={onConsentCancel} /> : null}
    </div>
  );
}
