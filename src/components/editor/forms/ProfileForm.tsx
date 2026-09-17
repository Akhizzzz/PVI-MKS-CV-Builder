import { useState } from 'react';
import type { CV, ProfileDraft } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { useAIEnhance } from '../../../hooks/useAIEnhance';
import { AIEnhanceButton } from '../../shared/AIEnhanceButton';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

const EMPTY_DRAFT: ProfileDraft = { whoAreYou: '', goodAt: '', workEnjoy: '', fieldAiming: '' };

export function ProfileForm({ cv, update }: Props) {
  const draft = cv.profileDraft ?? EMPTY_DRAFT;
  const ai = useAIEnhance();
  const [previousProfile, setPreviousProfile] = useState<string | null>(null);

  const updateDraft = (patch: Partial<ProfileDraft>) => update({ profileDraft: { ...draft, ...patch } });

  const handleCreate = async () => {
    setPreviousProfile(cv.profile);
    const result = await ai.run('PROFILE', {
      who_are_you: draft.whoAreYou,
      good_at: draft.goodAt,
      work_you_enjoy: draft.workEnjoy,
      field_you_are_aiming_for: draft.fieldAiming,
    });
    if (result?.ok && 'output' in result) {
      update({ profile: result.output });
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-step-title">Profile</h2>
      <p className="form-step-hint">
        Answer a few simple questions about yourself in your own words. We'll help turn them into a short
        professional introduction — you can always edit the result afterwards.
      </p>

      <label className="form-field">
        <span className="form-field-label">Who are you?</span>
        <textarea
          value={draft.whoAreYou}
          placeholder={PLACEHOLDERS.profileWhoAreYou}
          rows={2}
          maxLength={1500}
          onChange={(e) => updateDraft({ whoAreYou: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">What are you good at?</span>
        <textarea
          value={draft.goodAt}
          placeholder={PLACEHOLDERS.profileGoodAt}
          rows={2}
          maxLength={1500}
          onChange={(e) => updateDraft({ goodAt: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">What type of work do you enjoy?</span>
        <textarea
          value={draft.workEnjoy}
          placeholder={PLACEHOLDERS.profileWorkEnjoy}
          rows={2}
          maxLength={1500}
          onChange={(e) => updateDraft({ workEnjoy: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">What field are you aiming for? (if applicable)</span>
        <textarea
          value={draft.fieldAiming}
          placeholder={PLACEHOLDERS.profileFieldAiming}
          rows={2}
          maxLength={1500}
          onChange={(e) => updateDraft({ fieldAiming: e.target.value })}
        />
      </label>

      <AIEnhanceButton
        label="✨ Create My Profile"
        onClick={handleCreate}
        status={ai.status}
        errorMessage={ai.errorMessage}
        onConsentContinue={ai.confirmConsent}
        onConsentCancel={ai.cancelConsent}
      />

      <label className="form-field">
        <span className="form-field-label">Your Profile</span>
        <p className="form-field-sublabel">This is what appears on your CV. Write it yourself, or generate it above and edit as you like.</p>
        <textarea
          value={cv.profile}
          placeholder={PLACEHOLDERS.profile}
          rows={7}
          maxLength={600}
          onChange={(e) => update({ profile: e.target.value })}
        />
        <span className="form-field-counter">{cv.profile.length} / 600 characters</span>
        {previousProfile !== null && previousProfile !== cv.profile ? (
          <button
            type="button"
            className="undo-ai-link"
            onClick={() => {
              update({ profile: previousProfile });
              setPreviousProfile(null);
            }}
          >
            Undo AI
          </button>
        ) : null}
      </label>
    </div>
  );
}
