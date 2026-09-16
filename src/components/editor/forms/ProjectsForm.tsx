import { v4 as uuid } from 'uuid';
import type { CV, ProjectEntry } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { RepeatableList } from '../shared/RepeatableList';
import { BulletListInput } from '../shared/BulletListInput';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function ProjectsForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Projects / Practical Experience</h2>
      <p className="form-step-hint">Add any projects or practical work you've done. Skip this if none apply.</p>

      <RepeatableList<ProjectEntry>
        items={cv.projects}
        onChange={(projects) => update({ projects })}
        createItem={() => ({ id: uuid(), title: '', organization: '', startDate: '', endDate: '', bullets: [''] })}
        addLabel="Add Another Project"
        itemNoun="project"
        emptyHint="No projects added yet."
        renderItem={(item, _index, updateItem) => (
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
            <div className="form-field">
              <span className="form-field-label">Project Description / Responsibilities</span>
              <BulletListInput
                bullets={item.bullets}
                onChange={(bullets) => updateItem({ bullets })}
                placeholder={PLACEHOLDERS.projectBullet}
              />
            </div>
          </>
        )}
      />
    </div>
  );
}
