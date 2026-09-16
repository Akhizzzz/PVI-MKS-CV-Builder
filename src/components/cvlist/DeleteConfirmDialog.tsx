interface Props {
  cvName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ cvName, onCancel, onConfirm }: Props) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-label="Confirm delete">
      <div className="modal-panel">
        <h2 className="modal-title">Delete "{cvName}"?</h2>
        <p className="modal-hint">
          Are you sure you want to delete this CV? This cannot be undone. Consider exporting a backup first.
        </p>
        <div className="modal-actions">
          <button type="button" className="button-primary" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className="button-danger" onClick={onConfirm}>
            Delete CV
          </button>
        </div>
      </div>
    </div>
  );
}
