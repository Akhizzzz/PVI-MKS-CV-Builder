import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveCV } from '../../hooks/useActiveCV';
import { STEPS } from './steps';
import { StepNav } from './StepNav';
import { AutosaveIndicator } from './AutosaveIndicator';
import { PersonalDetailsForm } from './forms/PersonalDetailsForm';
import { ProfileForm } from './forms/ProfileForm';
import { SkillsForm } from './forms/SkillsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { AwardsForm } from './forms/AwardsForm';
import { ThemeSelector } from './forms/ThemeSelector';
import { PreviewPane } from '../review/PreviewPane';
import { PreviewModal } from '../review/PreviewModal';
import { AppHeader } from '../shared/AppHeader';

export function CVEditor() {
  const { id, stepId = 'personal' } = useParams<{ id: string; stepId: string }>();
  const navigate = useNavigate();
  const { cv, loading, notFound, autosaveStatus, update, updatePersonalDetails } = useActiveCV(id ?? '');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  if (loading) return <p className="screen-loading">Loading your CV…</p>;
  if (notFound || !cv) return <p className="screen-loading">We couldn't find this CV.</p>;

  const stepIndex = Math.max(0, STEPS.findIndex((s) => s.id === stepId));
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const goToStep = (id2: string) => navigate(`/cv/${cv.id}/edit/${id2}`);
  const goBack = () => (isFirstStep ? navigate('/cvs') : goToStep(STEPS[stepIndex - 1].id));
  const goNext = () => (isLastStep ? navigate(`/cv/${cv.id}/review`) : goToStep(STEPS[stepIndex + 1].id));

  return (
    <>
      <AppHeader />
      <div className="editor-shell">
        <aside className="editor-sidebar no-print">
          <StepNav currentStepId={STEPS[stepIndex].id} onSelect={goToStep} />
        </aside>

        <main className="editor-main">
          <div className="editor-main-header">
            <AutosaveIndicator status={autosaveStatus} />
            <button type="button" className="button-secondary editor-preview-toggle" onClick={() => setShowMobilePreview(true)}>
              Preview CV
            </button>
          </div>

          {renderStep(stepId, cv, update, updatePersonalDetails)}

          <div className="editor-nav-buttons">
            <button type="button" className="button-secondary button-large" onClick={goBack}>
              ← Back
            </button>
            <button type="button" className="button-primary button-large" onClick={goNext}>
              {isLastStep ? 'Review & Download →' : 'Next →'}
            </button>
          </div>
        </main>

        <aside className="editor-preview-desktop no-print">
          <PreviewPane cv={cv} />
        </aside>

        {showMobilePreview ? <PreviewModal cv={cv} onClose={() => setShowMobilePreview(false)} /> : null}
      </div>
    </>
  );
}

function renderStep(
  stepId: string,
  cv: NonNullable<ReturnType<typeof useActiveCV>['cv']>,
  update: ReturnType<typeof useActiveCV>['update'],
  updatePersonalDetails: ReturnType<typeof useActiveCV>['updatePersonalDetails'],
) {
  switch (stepId) {
    case 'personal':
      return <PersonalDetailsForm cv={cv} updatePersonalDetails={updatePersonalDetails} />;
    case 'profile':
      return <ProfileForm cv={cv} update={update} />;
    case 'skills':
      return <SkillsForm cv={cv} update={update} />;
    case 'languages':
      return <LanguagesForm cv={cv} update={update} />;
    case 'projects':
      return <ProjectsForm cv={cv} update={update} />;
    case 'experience':
      return <ExperienceForm cv={cv} update={update} />;
    case 'education':
      return <EducationForm cv={cv} update={update} />;
    case 'certifications':
      return <CertificationsForm cv={cv} update={update} />;
    case 'awards':
      return <AwardsForm cv={cv} update={update} />;
    case 'theme':
      return <ThemeSelector cv={cv} update={update} />;
    default:
      return <PersonalDetailsForm cv={cv} updatePersonalDetails={updatePersonalDetails} />;
  }
}
