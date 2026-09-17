import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { CV, WorkExperienceEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { BulletListInput } from '../shared/BulletListInput';
import { useAIEnhance } from '../../../hooks/useAIEnhance';
import { AIEnhanceButton } from '../../shared/AIEnhanceButton';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

function WorkExperienceFields({ item, updateItem }: { item: WorkExperienceEntry; updateItem: (patch: Partial<WorkExperienceEntry>) => void }) {
  const ai = useAIEnhance();
  const [previousBullets, setPreviousBullets] = useState<string[] | null>(null);

  const handleEnhance = async () => {
    setPreviousBullets(item.bullets);
    const result = await ai.run('WORK_EXPERIENCE', {
      job_title: item.jobTitle,
      organisation: item.company,
      start_date: item.startDate,
      end_date: item.endDate,
      current_text: item.roughNotes ?? '',
    });
    if (result?.ok && 'bullets' in result) {
      updateItem({ bullets: result.bullets });
    }
  };

  return (
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

      <label className="form-field">
        <span className="form-field-label">Tell us what you did</span>
        <p className="form-field-sublabel">
          Write in your own words. You don't need to make it sound professional. Include whatever you remember about
          what you did, helped with, created, used or supported.
        </p>
        <textarea
          value={item.roughNotes ?? ''}
          placeholder={PLACEHOLDERS.workRoughNotes}
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
        <span className="form-field-label">Responsibilities / Contributions</span>
        <BulletListInput
          bullets={item.bullets}
          onChange={(bullets) => updateItem({ bullets })}
          placeholder={PLACEHOLDERS.workBullet}
        />
        {previousBullets !== null && JSON.stringify(previousBullets) !== JSON.stringify(item.bullets) ? (
          <button
            type="button"
            className="undo-ai-link"
            onClick={() => {
              updateItem({ bullets: previousBullets });
              setPreviousBullets(null);
            }}
          >
            Undo AI
          </button>
        ) : null}
      </div>
    </>
  );
}

export function ExperienceForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Work Experience</h2>
      <p className="form-step-hint">Add any jobs you've held. Skip this if you don't have work experience yet.</p>

      <RepeatableList<WorkExperienceEntry>
        items={cv.workExperience}
        onChange={(workExperience) => update({ workExperience })}
        createItem={() => ({ id: uuid(), jobTitle: '', company: '', startDate: '', endDate: '', bullets: [''], roughNotes: '' })}
        addLabel="Add Work Experience"
        itemNoun="work experience"
        emptyHint="No work experience added yet."
        renderItem={(item, _index, updateItem) => <WorkExperienceFields item={item} updateItem={updateItem} />}
      />
    </div>
  );
}
