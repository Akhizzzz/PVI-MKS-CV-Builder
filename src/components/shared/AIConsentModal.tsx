interface Props {
  onCancel: () => void;
  onContinue: () => void;
}

/** Shown once per device before the first "Make Professional" request
 * actually goes out (brief §27). Deliberately non-technical. */
export function AIConsentModal({ onCancel, onContinue }: Props) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-label="AI Writing Assistance">
      <div className="modal-panel">
        <h2 className="modal-title">AI Writing Assistance</h2>
        <p className="modal-hint">
          When you use "Make Professional", the information needed from this section is sent for AI processing to
          improve the wording. Other sections of your CV are not sent.
        </p>
        <div className="modal-actions">
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="button-primary" onClick={onContinue} autoFocus>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
