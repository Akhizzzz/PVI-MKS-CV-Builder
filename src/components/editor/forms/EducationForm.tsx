import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { CV, EducationEntry, EducationType } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { BulletListInput } from '../shared/BulletListInput';
import { useAIEnhance } from '../../../hooks/useAIEnhance';
import { AIEnhanceButton } from '../../shared/AIEnhanceButton';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

const EDUCATION_TYPE_OPTIONS: { value: EducationType; label: string }[] = [
  { value: 'higher', label: 'Higher Education / Degree' },
  { value: 'pvi', label: 'PVI Programme' },
  { value: 'school', label: 'School / Senior Secondary' },
  { value: 'other', label: 'Other' },
];

function EducationFields({ item, updateItem }: { item: EducationEntry; updateItem: (patch: Partial<EducationEntry>) => void }) {
  const ai = useAIEnhance();
  const [previousPoints, setPreviousPoints] = useState<string[] | null>(null);

  const handleEnhance = async () => {
    setPreviousPoints(item.points);
    const result = await ai.run('EDUCATION', {
      education_type: item.educationType ?? 'other',
      qualification: item.qualification,
      institution: item.institution,
      start_date: item.startYear,
      end_date: item.endYear,
      current_text: item.roughNotes ?? '',
    });
    if (result?.ok && 'bullets' in result) {
      updateItem({ points: result.bullets });
    }
  };

  return (
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

      <label className="form-field">
        <span className="form-field-label">Education Type</span>
        <select
          value={item.educationType ?? 'other'}
          onChange={(e) => updateItem({ educationType: e.target.value as EducationType })}
        >
          {EDUCATION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span className="form-field-label">Tell us what you learned or did</span>
        <p className="form-field-sublabel">
          Write whatever you remember about subjects, practical skills, projects, assignments, events or skills you
          developed.
        </p>
        <textarea
          value={item.roughNotes ?? ''}
          placeholder={PLACEHOLDERS.educationRoughNotes}
          rows={4}
          maxLength={1500}
          onChange={(e) => updateItem({ roughNotes: e.target.value })}
        />
      </label>

      <AIEnhanceButton
        label="✨ Make Professional"
        onClick={handleEnhance}
        status={ai.status}
        errorMessage={ai.errorMessage}
        onConsentContinue={ai.confirmConsent}
        onConsentCancel={ai.cancelConsent}
        disabled={!(item.roughNotes ?? '').trim()}
      />

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
        {previousPoints !== null && JSON.stringify(previousPoints) !== JSON.stringify(item.points) ? (
          <button
            type="button"
            className="undo-ai-link"
            onClick={() => {
              updateItem({ points: previousPoints });
              setPreviousPoints(null);
            }}
          >
            Undo AI
          </button>
        ) : null}
      </div>
    </>
  );
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
        createItem={() => ({
          id: uuid(),
          qualification: '',
          institution: '',
          startYear: '',
          endYear: '',
          points: [''],
          educationType: 'other',
          roughNotes: '',
        })}
        addLabel="Add Education"
        itemNoun="education entry"
        emptyHint="No education entries added yet."
        renderItem={(item, _index, updateItem) => <EducationFields item={item} updateItem={updateItem} />}
      />
    </div>
  );
}
