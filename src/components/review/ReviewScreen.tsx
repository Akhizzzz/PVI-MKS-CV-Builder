import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveCV } from '../../hooks/useActiveCV';
import { PreviewPane } from './PreviewPane';
import { PreviewModal } from './PreviewModal';
import { downloadCvAsPdf } from '../../pdf/PDFExport';
import { AppHeader } from '../shared/AppHeader';

function getMissingFields(cv: NonNullable<ReturnType<typeof useActiveCV>['cv']>): string[] {
  const missing: string[] = [];
  if (!cv.personalDetails.fullName.trim()) missing.push('Full Name');
  if (!cv.personalDetails.professionalTitle.trim()) missing.push('Professional Title');
  if (!cv.profile.trim()) missing.push('Profile');
  return missing;
}

export function ReviewScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cv, loading, notFound } = useActiveCV(id ?? '');
  const [showPreview, setShowPreview] = useState(false);

  if (loading) return <p className="screen-loading">Loading your CV…</p>;
  if (notFound || !cv) return <p className="screen-loading">We couldn't find this CV.</p>;

  const missing = getMissingFields(cv);

  return (
    <>
      <AppHeader />
      <div className="screen">
      <div className="review-screen-layout">
        <div className="review-screen-main">
          <h1 className="screen-title">{missing.length === 0 ? 'Your CV is ready' : 'Almost there'}</h1>

          {missing.length > 0 ? (
            <p className="form-field-error" role="status">
              A few fields are still empty: {missing.join(', ')}. You can still preview or download, but
              consider filling these in first.
            </p>
          ) : (
            <p className="form-step-hint">Preview your CV, or download it as a PDF whenever you're ready.</p>
          )}

          <div className="review-screen-actions">
            <button type="button" className="button-secondary button-large" onClick={() => setShowPreview(true)}>
              Preview CV
            </button>
            <button type="button" className="button-primary button-large" onClick={() => downloadCvAsPdf(cv.id)}>
              Download PDF
            </button>
            <button
              type="button"
              className="button-secondary button-large"
              onClick={() => navigate(`/cv/${cv.id}/edit/theme`)}
            >
              ← Go Back & Edit
            </button>
          </div>

          <p className="welcome-privacy-note">
            When the print dialog opens, choose "Save as PDF" as the destination to download your CV.
          </p>
        </div>

        <div className="review-screen-preview no-print">
          <PreviewPane cv={cv} />
        </div>
      </div>

      {showPreview ? <PreviewModal cv={cv} onClose={() => setShowPreview(false)} /> : null}
      </div>
    </>
  );
}
