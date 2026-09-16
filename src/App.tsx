import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ActiveCVProvider } from './context/ActiveCVContext';
import { indexedDbStorage } from './storage/indexedDbStorage';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { MyCVsScreen } from './components/cvlist/MyCVsScreen';
import { CVEditor } from './components/editor/CVEditor';
import { ReviewScreen } from './components/review/ReviewScreen';
import { PrintView } from './components/review/PrintView';
import './styles/theme.css';
import './styles/app.css';
import './styles/print.css';

function RootRoute() {
  const [hasAnyCv, setHasAnyCv] = useState<boolean | null>(null);

  useEffect(() => {
    indexedDbStorage.listCVs().then((cvs) => setHasAnyCv(cvs.length > 0));
  }, []);

  if (hasAnyCv === null) return <p className="screen-loading">Loading…</p>;
  return hasAnyCv ? <Navigate to="/cvs" replace /> : <WelcomeScreen />;
}

export default function App() {
  return (
    <ActiveCVProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/cvs" element={<MyCVsScreen />} />
          <Route path="/cv/:id/edit/:stepId" element={<CVEditor />} />
          <Route path="/cv/:id/review" element={<ReviewScreen />} />
          <Route path="/cv/:id/print" element={<PrintView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ActiveCVProvider>
  );
}
