import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { CV, ProjectEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { BulletListInput } from '../shared/BulletListInput';
import { useAIEnhance } from '../../../hooks/useAIEnhance';
import { AIEnhanceButton } from '../../shared/AIEnhanceButton';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

function ProjectFields({ item, updateItem }: { item: ProjectEntry; updateItem: (patch: Partial<ProjectEntry>) => void }) {
  const ai = useAIEnhance();
  const [previousBullets, setPreviousBullets] = useState<string[] | null>(null);

  const handleEnhance = async () => {
    setPreviousBullets(item.bullets);
    const result = await ai.run('PROJECT', {
      project_title: item.title,
      organisation: item.organization,
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
        <span className="form-field-label">Project Title</span>
        <input
          type="text"
          value={item.title}
          placeholder={PLACEHOLDERS.projectTitle}
          onChange={(e) => updateItem({ title: e.target.value })}
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
        <span className="form-field-label">Organisation Name</span>
        <input
          type="text"
          value={item.organization}
          placeholder={PLACEHOLDERS.projectOrganization}
          onChange={(e) => updateItem({ organization: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">Tell us about this project</span>
        <p className="form-field-sublabel">
          Write whatever you remember. You can mention what the project was about, what you did, what you created or
          prepared, any tools or skills you used, and the final result.
        </p>
        <textarea
          value={item.roughNotes ?? ''}
          placeholder={PLACEHOLDERS.projectRoughNotes}
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
        <span className="form-field-label">Project Description / Responsibilities</span>
        <BulletListInput
          bullets={item.bullets}
          onChange={(bullets) => updateItem({ bullets })}
          placeholder={PLACEHOLDERS.projectBullet}
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

export function ProjectsForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Projects / Practical Experience</h2>
      <p className="form-step-hint">Add any projects or practical work you've done. Skip this if none apply.</p>

      <RepeatableList<ProjectEntry>
        items={cv.projects}
        onChange={(projects) => update({ projects })}
        createItem={() => ({ id: uuid(), title: '', organization: '', startDate: '', endDate: '', bullets: [''], roughNotes: '' })}
        addLabel="Add Another Project"
        itemNoun="project"
        emptyHint="No projects added yet."
        renderItem={(item, _index, updateItem) => <ProjectFields item={item} updateItem={updateItem} />}
      />
    </div>
  );
}
