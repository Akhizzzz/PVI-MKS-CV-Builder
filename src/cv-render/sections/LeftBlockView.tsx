import type { LeftBlock } from '../blocks';

function EntryLine({ title, meta }: { title: string; meta: string }) {
  return (
    <li className="cv-entry-line">
      <span className="cv-entry-line-title">{title}</span>
      {meta ? <span className="cv-entry-line-meta"> | {meta}</span> : null}
    </li>
  );
}

export function LeftBlockView({ block }: { block: LeftBlock }) {
  switch (block.kind) {
    case 'profile':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Profile</h2>
          <p className="cv-profile-text">{block.text}</p>
        </section>
      );

    case 'skills':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Skills</h2>
          <div className="cv-skills-grid">
            <div>
              <h3 className="cv-subheading">Technical</h3>
              <ul className="cv-bullet-list">
                {block.technical.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="cv-subheading">Workplace</h3>
              <ul className="cv-bullet-list">
                {block.workplace.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      );

    case 'languages':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Language</h2>
          <ul className="cv-bullet-list cv-language-list">
            {block.items.map((l) => (
              <li key={l.id}>
                <span>{l.language}</span>
                <span className="cv-entry-line-meta">{l.proficiency}</span>
              </li>
            ))}
          </ul>
        </section>
      );

    case 'certifications-heading-first':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Certifications</h2>
          <ul className="cv-bullet-list">
            <EntryLine
              title={block.first.name}
              meta={[block.first.institute, block.first.year].filter(Boolean).join(' | ')}
            />
          </ul>
        </section>
      );

    case 'certification':
      return (
        <ul className="cv-bullet-list cv-continuation">
          <EntryLine title={block.item.name} meta={[block.item.institute, block.item.year].filter(Boolean).join(' | ')} />
        </ul>
      );

    case 'awards-heading-first':
      return (
        <section className="cv-section">
          <h2 className="cv-heading">Awards</h2>
          <ul className="cv-bullet-list">
            <EntryLine
              title={block.first.title}
              meta={[block.first.organization, block.first.year].filter(Boolean).join(' | ')}
            />
          </ul>
        </section>
      );

    case 'award':
      return (
        <ul className="cv-bullet-list cv-continuation">
          <EntryLine
            title={block.item.title}
            meta={[block.item.organization, block.item.year].filter(Boolean).join(' | ')}
          />
        </ul>
      );

    default:
      return null;
  }
}
