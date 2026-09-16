import type { CV } from '../../data/cvModel';
import { PreviewPane } from './PreviewPane';

interface Props {
  cv: CV;
  onClose: () => void;
}

export function PreviewModal({ cv, onClose }: Props) {
  return (
    <div className="modal-overlay preview-modal-overlay" role="dialog" aria-modal="true" aria-label="Preview your CV">
      <div className="preview-modal-panel">
        <div className="preview-modal-header">
          <h2 className="modal-title">Preview CV</h2>
          <button type="button" className="button-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="preview-modal-body">
          <PreviewPane cv={cv} scale={0.6} />
        </div>
      </div>
    </div>
  );
}
