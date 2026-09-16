import { useMemo } from 'react';
import type { CV } from '../../data/cvModel';
import { usePhotoUrl } from '../../hooks/usePhotoUrl';
import { CVRenderer } from '../../cv-render/CVRenderer';
import { paginateCV } from '../../cv-render/pagination';

const PAGE_HEIGHT_MM = 297;
const PAGE_GAP_MM = 12; // matches the gap in cv.css's .cv-document

interface Props {
  cv: CV;
  className?: string;
  /** Scale factor applied to the full-size (210mm-wide) CV document. */
  scale?: number;
}

/** Scaled-down, read-only rendering of the CV for side-by-side or modal
 * preview. Uses the same CVRenderer/pagination as the print output, so it
 * is always an accurate preview of what "Download PDF" will produce.
 *
 * The CV document is rendered at full size and visually shrunk with a CSS
 * transform; the wrapping box's height is computed from the actual page
 * count (rather than a fixed guess) so multi-page CVs never get clipped or
 * leave a huge scrollable gap below. */
export function PreviewPane({ cv, className, scale = 0.4 }: Props) {
  const photoUrl = usePhotoUrl(cv.personalDetails.photo?.blobId);
  const pageCount = useMemo(() => paginateCV(cv).length, [cv]);
  const totalHeightMm = pageCount * PAGE_HEIGHT_MM + (pageCount - 1) * PAGE_GAP_MM;

  return (
    <div className={`preview-pane ${className ?? ''}`}>
      <div className="preview-pane-viewport">
        <div
          className="preview-pane-scale-box"
          style={{ width: `${210 * scale}mm`, height: `${totalHeightMm * scale}mm` }}
        >
          <div className="preview-pane-scale-wrapper" style={{ transform: `scale(${scale})` }}>
            <CVRenderer cv={cv} photoUrl={photoUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
