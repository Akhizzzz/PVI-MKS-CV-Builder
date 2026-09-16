import { v4 as uuid } from 'uuid';
import type { CV, WorkExperienceEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { BulletListInput } from '../shared/BulletListInput';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function ExperienceForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Work Experience</h2>
      <p className="form-step-hint">Add any jobs you've held. Skip this if you don't have work experience yet.</p>

      <RepeatableList<WorkExperienceEntry>
        items={cv.workExperience}
        onChange={(workExperience) => update({ workExperience })}
        createItem={() => ({ id: uuid(), jobTitle: '', company: '', startDate: '', endDate: '', bullets: [''] })}
        addLabel="Add Work Experience"
        itemNoun="work experience"
        emptyHint="No work experience added yet."
        renderItem={(item, _index, updateItem) => (
          <>
            <label className="form-field">
              <span className="form-field-label">Job Title</span>
              <input
                type="text"
                value={item.jobTitle}
                placeholder={PLACEHOLDERS.jobTitle}
                onChange={(e) => updateItem({ jobTitle: e.target.value })}
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                <span className="form-field-label">Start (Month/Year)</span>
                <input
                  type="text"
                  value={item.startDate}
                  placeholder={PLACEHOLDERS.dateMonthYear}
                  onChange={(e) => updateItem({ startDate: e.target.value })}
                />
              </label>
              <label className="form-field">
                <span className="form-field-label">End (Month/Year)</span>
                <input
                  type="text"
                  value={item.endDate}
                  placeholder={PLACEHOLDERS.dateMonthYear}
                  onChange={(e) => updateItem({ endDate: e.target.value })}
                />
              </label>
            </div>
            <label className="form-field">
              <span className="form-field-label">Company / Organisation</span>
              <input
                type="text"
                value={item.company}
                placeholder={PLACEHOLDERS.company}
                onChange={(e) => updateItem({ company: e.target.value })}
              />
            </label>
            <div className="form-field">
              <span className="form-field-label">Responsibilities / Contributions</span>
              <BulletListInput
                bullets={item.bullets}
                onChange={(bullets) => updateItem({ bullets })}
                placeholder={PLACEHOLDERS.workBullet}
              />
            </div>
          </>
        )}
      />
    </div>
  );
}
