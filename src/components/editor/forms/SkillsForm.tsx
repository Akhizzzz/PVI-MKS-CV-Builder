import type { CV } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { StringListInput } from '../shared/StringListInput';
import { useAIEnhance } from '../../../hooks/useAIEnhance';
import { AIConsentModal } from '../../shared/AIConsentModal';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function SkillsForm({ cv, update }: Props) {
  const ai = useAIEnhance();

  const enhanceSkill = (group: 'TECHNICAL' | 'WORKPLACE') => async (currentText: string): Promise<string | null> => {
    const result = await ai.run('SKILL', { technical_or_workplace: group, current_text: currentText });
    return result?.ok && 'output' in result ? result.output : null;
  };

  return (
    <div className="form-step">
      <h2 className="form-step-title">Skills</h2>
      <p className="form-step-hint">
        Add your skills in two groups. Only fill in what applies to you. Use "✨ Make Professional" on any skill to
        turn rough wording into a clean CV-ready label.
      </p>

      <div className="form-field">
        <span className="form-field-label">Technical Skills</span>
        <p className="form-field-sublabel">e.g. software, tools, or specific technical abilities</p>
        <StringListInput
          items={cv.technicalSkills}
          onChange={(technicalSkills) => update({ technicalSkills })}
          placeholder={PLACEHOLDERS.technicalSkill}
          addLabel="Add Skill"
          itemNoun="skill"
          onEnhance={enhanceSkill('TECHNICAL')}
        />
      </div>

      <div className="form-field">
        <span className="form-field-label">Workplace Skills</span>
        <p className="form-field-sublabel">e.g. communication, teamwork, time management</p>
        <StringListInput
          items={cv.workplaceSkills}
          onChange={(workplaceSkills) => update({ workplaceSkills })}
          placeholder={PLACEHOLDERS.workplaceSkill}
          addLabel="Add Skill"
          itemNoun="skill"
          onEnhance={enhanceSkill('WORKPLACE')}
        />
      </div>

      {ai.status === 'error' && ai.errorMessage ? (
        <p className="ai-enhance-error" role="status">
          {ai.errorMessage}
        </p>
      ) : null}
      {ai.status === 'pending-consent' ? (
        <AIConsentModal onContinue={ai.confirmConsent} onCancel={ai.cancelConsent} />
      ) : null}
    </div>
  );
}
