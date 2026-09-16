import { v4 as uuid } from 'uuid';
import type { CV, CertificationEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function CertificationsForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Certifications</h2>
      <p className="form-step-hint">Add any courses or certifications you've completed. Skip this if none apply.</p>

      <RepeatableList<CertificationEntry>
        items={cv.certifications}
        onChange={(certifications) => update({ certifications })}
        createItem={() => ({ id: uuid(), name: '', institute: '', year: '' })}
        addLabel="Add Certification"
        itemNoun="certification"
        emptyHint="No certifications added yet."
        renderItem={(item, _index, updateItem) => (
          <>
            <label className="form-field">
              <span className="form-field-label">Certification / Course Name</span>
              <input
                type="text"
                value={item.name}
                placeholder={PLACEHOLDERS.certificationName}
                onChange={(e) => updateItem({ name: e.target.value })}
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                <span className="form-field-label">Institute / Organisation</span>
                <input
                  type="text"
                  value={item.institute}
                  placeholder={PLACEHOLDERS.certificationInstitute}
                  onChange={(e) => updateItem({ institute: e.target.value })}
                />
              </label>
              <label className="form-field">
                <span className="form-field-label">Year</span>
                <input
                  type="text"
                  value={item.year}
                  placeholder={PLACEHOLDERS.year}
                  onChange={(e) => updateItem({ year: e.target.value })}
                />
              </label>
            </div>
            <label className="form-field">
              <span className="form-field-label">Description (optional)</span>
              <textarea
                value={item.description ?? ''}
                placeholder={PLACEHOLDERS.certificationDescription}
                rows={2}
                onChange={(e) => updateItem({ description: e.target.value })}
              />
            </label>
          </>
        )}
      />
    </div>
  );
}
