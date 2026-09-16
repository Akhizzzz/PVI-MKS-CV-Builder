import { v4 as uuid } from 'uuid';
import type { CV, EducationEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { BulletListInput } from '../shared/BulletListInput';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function EducationForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Education</h2>
      <p className="form-step-hint">
        Add your educational background — degrees, PVI programmes, or school, in any order.
      </p>

      <RepeatableList<EducationEntry>
        items={cv.education}
        onChange={(education) => update({ education })}
        createItem={() => ({ id: uuid(), qualification: '', institution: '', startYear: '', endYear: '', points: [''] })}
        addLabel="Add Education"
        itemNoun="education entry"
        emptyHint="No education entries added yet."
        renderItem={(item, _index, updateItem) => (
          <>
            <label className="form-field">
              <span className="form-field-label">Qualification / Programme</span>
              <input
                type="text"
                value={item.qualification}
                placeholder={PLACEHOLDERS.qualification}
                onChange={(e) => updateItem({ qualification: e.target.value })}
              />
            </label>
            <label className="form-field">
              <span className="form-field-label">Institution</span>
              <input
                type="text"
                value={item.institution}
                placeholder={PLACEHOLDERS.institution}
                onChange={(e) => updateItem({ institution: e.target.value })}
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                <span className="form-field-label">Start Year</span>
                <input
                  type="text"
                  value={item.startYear}
                  placeholder={PLACEHOLDERS.year}
                  onChange={(e) => updateItem({ startYear: e.target.value })}
                />
              </label>
              <label className="form-field">
                <span className="form-field-label">End Year</span>
                <input
                  type="text"
                  value={item.endYear}
                  placeholder={PLACEHOLDERS.year}
                  onChange={(e) => updateItem({ endYear: e.target.value })}
                />
              </label>
            </div>
            <div className="form-field">
              <span className="form-field-label">Details (optional)</span>
              <p className="form-field-sublabel">
                e.g. main areas learned, final project, subjects, events, skills developed
              </p>
              <BulletListInput
                bullets={item.points}
                onChange={(points) => updateItem({ points })}
                placeholder={PLACEHOLDERS.educationPoint}
              />
            </div>
          </>
        )}
      />
    </div>
  );
}
