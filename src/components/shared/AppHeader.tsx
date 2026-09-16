import { useNavigate } from 'react-router-dom';

/** Persistent top bar shown on every editor/review screen so users can
 * always get back to their CV list — without it, the only way back was
 * the browser's Back button. */
export function AppHeader() {
  const navigate = useNavigate();

  return (
    <div className="app-header no-print">
      <button type="button" className="app-header-home" onClick={() => navigate('/cvs')}>
        ← My CVs
      </button>
      <span className="app-header-title">PVI CV Builder</span>
    </div>
  );
}
