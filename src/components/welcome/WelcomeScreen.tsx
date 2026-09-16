import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlankCV } from '../../data/defaults';
import { indexedDbStorage } from '../../storage/indexedDbStorage';
import { FirstVisitIntro } from './FirstVisitIntro';

const VISITED_KEY = 'pvi-cv-builder:visited';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem(VISITED_KEY) !== '1';
    } catch {
      return false;
    }
  });

  const dismissIntro = () => {
    try {
      localStorage.setItem(VISITED_KEY, '1');
    } catch {
      /* private browsing or storage disabled — proceed without persisting */
    }
    setShowIntro(false);
  };

  const handleCreate = async () => {
    const cv = createBlankCV(`My CV ${new Date().toLocaleDateString()}`);
    await indexedDbStorage.saveCV(cv);
    navigate(`/cv/${cv.id}/edit/personal`);
  };

  return (
    <div className="screen screen-centered">
      {showIntro ? (
        <FirstVisitIntro onStart={dismissIntro} />
      ) : (
        <div className="welcome-card">
          <h1 className="welcome-title">PVI CV Builder</h1>
          <p className="welcome-subtitle">Create your professional CV step by step.</p>
          <button type="button" className="button-primary button-large" onClick={handleCreate}>
            Create My CV
          </button>
          <p className="welcome-privacy-note">
            Your work is saved on this device. No account is required.
          </p>
        </div>
      )}
    </div>
  );
}
