import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CVSummary } from '../../data/cvModel';
import { getTheme } from '../../data/themes';
import { indexedDbStorage } from '../../storage/indexedDbStorage';
import { exportBackup } from '../../storage/BackupService';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface Props {
  summary: CVSummary;
  onChanged: () => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function CVCard({ summary, onChanged }: Props) {
  const navigate = useNavigate();
  const theme = getTheme(summary.themeId);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(summary.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleRenameSubmit = async () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== summary.name) {
      await indexedDbStorage.renameCV(summary.id, trimmed);
      onChanged();
    }
    setRenaming(false);
  };

  const handleDuplicate = async () => {
    setBusy(true);
    await indexedDbStorage.duplicateCV(summary.id);
    setBusy(false);
    onChanged();
  };

  const handleDelete = async () => {
    setBusy(true);
    await indexedDbStorage.deleteCV(summary.id);
    setBusy(false);
    setConfirmingDelete(false);
    onChanged();
  };

  const handleExport = async () => {
    const cv = await indexedDbStorage.getCV(summary.id);
    if (cv) await exportBackup(cv);
  };

  return (
    <div className="cv-card">
      <span className="cv-card-swatch" style={{ background: theme.primary }} aria-hidden="true">
        <span className="cv-card-swatch-accent" style={{ background: theme.accent }} />
      </span>

      <div className="cv-card-body">
        {renaming ? (
          <input
            type="text"
            className="cv-card-rename-input"
            value={nameDraft}
            autoFocus
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') {
                setNameDraft(summary.name);
                setRenaming(false);
              }
            }}
          />
        ) : (
          <h3 className="cv-card-name">{summary.name}</h3>
        )}
        <p className="cv-card-meta">Last edited: {formatDate(summary.updatedAt)}</p>
      </div>

      <div className="cv-card-actions">
        <button type="button" className="button-primary" onClick={() => navigate(`/cv/${summary.id}/edit/personal`)}>
          Continue
        </button>
        <button type="button" className="button-secondary" onClick={() => setRenaming(true)} disabled={busy}>
          Rename
        </button>
        <button type="button" className="button-secondary" onClick={handleDuplicate} disabled={busy}>
          Duplicate
        </button>
        <button type="button" className="button-secondary" onClick={handleExport} disabled={busy}>
          Export Backup
        </button>
        <button type="button" className="button-secondary button-danger-text" onClick={() => setConfirmingDelete(true)} disabled={busy}>
          Delete
        </button>
      </div>

      {confirmingDelete ? (
        <DeleteConfirmDialog
          cvName={summary.name}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  );
}
