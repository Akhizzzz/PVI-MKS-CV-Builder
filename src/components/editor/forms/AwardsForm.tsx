import { v4 as uuid } from 'uuid';
import type { CV, AwardEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function AwardsForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Awards</h2>
      <p className="form-step-hint">Add any awards or recognitions you've received. Skip this if none apply.</p>

      <RepeatableList<AwardEntry>
        items={cv.awards}
        onChange={(awards) => update({ awards })}
        createItem={() => ({ id: uuid(), title: '', organization: '', year: '' })}
        addLabel="Add Award"
        itemNoun="award"
        emptyHint="No awards added yet."
        renderItem={(item, _index, updateItem) => (
          <>
            <label className="form-field">
              <span className="form-field-label">Award / Recognition / Competition</span>
              <input
                type="text"
                value={item.title}
                placeholder={PLACEHOLDERS.awardTitle}
                onChange={(e) => updateItem({ title: e.target.value })}
              />
            </label>
            <div className="form-row">
              <label className="form-field">
                <span className="form-field-label">Organisation</span>
                <input
                  type="text"
                  value={item.organization}
                  placeholder={PLACEHOLDERS.awardOrganization}
                  onChange={(e) => updateItem({ organization: e.target.value })}
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
          </>
        )}
      />
    </div>
  );
}
