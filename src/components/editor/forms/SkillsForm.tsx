import type { CV } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { StringListInput } from '../shared/StringListInput';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function SkillsForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Skills</h2>
      <p className="form-step-hint">Add your skills in two groups. Only fill in what applies to you.</p>

      <div className="form-field">
        <span className="form-field-label">Technical Skills</span>
        <p className="form-field-sublabel">e.g. software, tools, or specific technical abilities</p>
        <StringListInput
          items={cv.technicalSkills}
          onChange={(technicalSkills) => update({ technicalSkills })}
          placeholder={PLACEHOLDERS.technicalSkill}
          addLabel="Add Skill"
          itemNoun="skill"
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
        />
      </div>
    </div>
  );
}
