import { useParams } from 'react-router-dom';
import { useActiveCV } from '../../hooks/useActiveCV';
import { usePhotoUrl } from '../../hooks/usePhotoUrl';
import { CVRenderer } from '../../cv-render/CVRenderer';

/**
 * Dedicated print route: renders nothing but the CV document (no app
 * chrome, no form labels). Printing is user-triggered (not automatic) so
 * the "enable Background graphics" instruction is guaranteed to be seen
 * before the print dialog opens — most browsers print without background
 * colours unless that option is explicitly turned on. print.css hides the
 * `.no-print` banner and sets @page A4 with zero margin.
 */
export function PrintView() {
  const { id } = useParams<{ id: string }>();
  const { cv, loading } = useActiveCV(id ?? '');
  const photoUrl = usePhotoUrl(cv?.personalDetails.photo?.blobId);

  if (loading || !cv) return null;

  return (
    <div className="cv-print-root">
      <div className="print-instructions no-print">
        <p>
          <strong>Before you print:</strong> in the print dialog, open "More settings" and turn on{' '}
          <strong>Background graphics</strong> — otherwise your CV's colour theme won't be included. Then choose{' '}
          <strong>Save as PDF</strong> as the destination.
        </p>
        <button type="button" className="button-primary button-large" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>
      <CVRenderer cv={cv} photoUrl={photoUrl} />
    </div>
  );
}
