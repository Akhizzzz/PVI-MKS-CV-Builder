import type { CV } from '../data/cvModel';
import type { Page } from './pagination';
import { PhotoFrame } from './PhotoFrame';
import { LeftBlockView } from './sections/LeftBlockView';
import { RightBlockView } from './sections/RightBlockView';

interface CVPageProps {
  cv: CV;
  page: Page;
  photoUrl?: string;
}

export function CVPage({ cv, page, photoUrl }: CVPageProps) {
  const { personalDetails } = cv;

  return (
    <div className="cv-page">
      {page.isFirstPage && (
        <header className="cv-header">
          <PhotoFrame photoUrl={photoUrl} fullName={personalDetails.fullName} />
          <div className="cv-header-text">
            <h1 className="cv-full-name">{personalDetails.fullName || 'Full Name'}</h1>
            <p className="cv-title">{personalDetails.professionalTitle || 'Professional Title / Career Area'}</p>
          </div>
        </header>
      )}

      {page.isFirstPage && (personalDetails.address || personalDetails.email || personalDetails.phone) && (
        <div className="cv-contact-bar">
          {personalDetails.address ? <span className="cv-contact-item">{personalDetails.address}</span> : null}
          {personalDetails.email ? <span className="cv-contact-item">{personalDetails.email}</span> : null}
          {personalDetails.phone ? <span className="cv-contact-item">{personalDetails.phone}</span> : null}
        </div>
      )}

      <div className="cv-body">
        <div className="cv-col-left">
          {page.left.map((block) => (
            <LeftBlockView key={block.id} block={block} />
          ))}
        </div>
        <div className="cv-col-divider" aria-hidden="true" />
        <div className="cv-col-right">
          {page.right.map((block) => (
            <RightBlockView key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}
