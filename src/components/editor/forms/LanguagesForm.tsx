import { v4 as uuid } from 'uuid';
import type { CV, LanguageEntry, LanguageProficiency } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

const PROFICIENCIES: LanguageProficiency[] = ['Written & Spoken', 'Spoken', 'Written'];

export function LanguagesForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Languages</h2>
      <p className="form-step-hint">Add the languages you speak and how well you know each one.</p>

      <RepeatableList<LanguageEntry>
        items={cv.languages}
        onChange={(languages) => update({ languages })}
        createItem={() => ({ id: uuid(), language: '', proficiency: 'Written & Spoken' })}
        addLabel="Add Language"
        itemNoun="language"
        emptyHint="No languages added yet."
        renderItem={(item, _index, updateItem) => (
          <div className="form-row">
            <label className="form-field">
              <span className="form-field-label">Language</span>
              <input
                type="text"
                value={item.language}
                placeholder={PLACEHOLDERS.language}
                onChange={(e) => updateItem({ language: e.target.value })}
              />
            </label>
            <label className="form-field">
              <span className="form-field-label">Proficiency</span>
              <select
                value={item.proficiency}
                onChange={(e) => updateItem({ proficiency: e.target.value as LanguageProficiency })}
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      />
    </div>
  );
}
