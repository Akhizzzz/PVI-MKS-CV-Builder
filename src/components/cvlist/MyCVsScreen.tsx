import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CVSummary } from '../../data/cvModel';
import { createBlankCV } from '../../data/defaults';
import { indexedDbStorage } from '../../storage/indexedDbStorage';
import { importBackup, BackupValidationError } from '../../storage/BackupService';
import { CVCard } from './CVCard';

export function MyCVsScreen() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CVSummary[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    indexedDbStorage.listCVs().then(setCvs);
  };

  useEffect(refresh, []);

  const handleCreate = async () => {
    const cv = createBlankCV(`My CV ${new Date().toLocaleDateString()}`);
    await indexedDbStorage.saveCV(cv);
    navigate(`/cv/${cv.id}/edit/personal`);
  };

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    setImportError(null);
    try {
      await importBackup(file);
      refresh();
    } catch (err) {
      setImportError(err instanceof BackupValidationError ? err.message : 'This backup file could not be imported.');
    }
  };

  if (cvs === null) return <p className="screen-loading">Loading your CVs…</p>;

  return (
    <div className="screen">
      <div className="screen-header">
        <h1 className="screen-title">My CVs</h1>
        <div className="screen-header-actions">
          <button type="button" className="button-secondary" onClick={() => fileInputRef.current?.click()}>
            Import Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={(e) => handleImportFile(e.target.files?.[0])}
          />
          <button type="button" className="button-primary button-large" onClick={handleCreate}>
            + Create New CV
          </button>
        </div>
      </div>

      {importError ? (
        <p className="form-field-error" role="alert">
          {importError}
        </p>
      ) : null}

      {cvs.length === 0 ? (
        <p className="screen-empty-hint">You don't have any CVs yet. Create one to get started.</p>
      ) : (
        <div className="cv-card-list">
          {cvs.map((summary) => (
            <CVCard key={summary.id} summary={summary} onChanged={refresh} />
          ))}
        </div>
      )}

      <p className="welcome-privacy-note">
        Clearing this browser's site data may remove locally saved CVs. Use Export Backup to keep a copy.
      </p>
    </div>
  );
}
