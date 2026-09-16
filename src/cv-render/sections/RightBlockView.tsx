import type { RightBlock } from '../blocks';
import type { ProjectEntry, WorkExperienceEntry, EducationEntry } from '../../data/cvModel';

function DateRange({ start, end }: { start: string; end: string }) {
  if (!start && !end) return null;
  return <span className="cv-entry-dates"> ({start || '—'} - {end || 'Present'})</span>;
}

function ProjectEntryView({ item }: { item: ProjectEntry }) {
  return (
    <div className="cv-entry">
      <p className="cv-entry-title">
        {item.title}
        <DateRange start={item.startDate} end={item.endDate} />
      </p>
      {item.organization ? <p className="cv-entry-org">{item.organization}</p> : null}
      {item.bullets.length > 0 ? (
        <ul className="cv-bullet-list">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ExperienceEntryView({ item }: { item: WorkExperienceEntry }) {
  return (
    <div className="cv-entry">
      <p className="cv-entry-title">
        {item.jobTitle}
        <DateRange start={item.startDate} end={item.endDate} />
      </p>
      {item.company ? <p className="cv-entry-org">{item.company}</p> : null}
      {item.bullets.length > 0 ? (
        <ul className="cv-bullet-list">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function EducationEntryView({ item }: { item: EducationEntry }) {
  return (
    <div className="cv-entry">
      <p className="cv-entry-title cv-entry-title-italic">
        {item.qualification}
        {(item.startYear || item.endYear) ? <span className="cv-entry-dates"> ({item.startYear || '—'} - {item.endYear || 'Present'})</span> : null}
      </p>
      {item.institution ? <p className="cv-entry-org">{item.institution}</p> : null}
      {item.points.length > 0 ? (
        <ul className="cv-bullet-list">
          {item.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function RightBlockView({ block }: { block: RightBlock }) {
  switch (block.kind) {
    case 'projects-heading-first':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Projects/Practical Experience</h2>
          <ProjectEntryView item={block.first} />
        </section>
      );
    case 'project':
      return (
        <div className="cv-continuation">
          <hr className="cv-divider" />
          <ProjectEntryView item={block.item} />
        </div>
      );

    case 'experience-heading-first':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Work Experience</h2>
          <ExperienceEntryView item={block.first} />
        </section>
      );
    case 'experience':
      return (
        <div className="cv-continuation">
          <hr className="cv-divider" />
          <ExperienceEntryView item={block.item} />
        </div>
      );

    case 'education-heading-first':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Education</h2>
          <EducationEntryView item={block.first} />
        </section>
      );
    case 'education':
      return (
        <div className="cv-continuation">
          <hr className="cv-divider" />
          <EducationEntryView item={block.item} />
        </div>
      );

    default:
      return null;
  }
}
