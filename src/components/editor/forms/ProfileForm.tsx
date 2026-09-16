import type { CV } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

const GUIDANCE = [
  'Who are you?',
  'What are you good at?',
  'What type of work do you enjoy?',
  'What field are you aiming for? (if applicable)',
];

export function ProfileForm({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Profile</h2>
      <p className="form-step-hint">
        Write a short introduction about yourself. Think about the questions below as you write:
      </p>
      <ul className="form-step-guidance">
        {GUIDANCE.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <label className="form-field">
        <span className="form-field-label">Your Profile</span>
        <textarea
          value={cv.profile}
          placeholder={PLACEHOLDERS.profile}
          rows={7}
          maxLength={600}
          onChange={(e) => update({ profile: e.target.value })}
        />
        <span className="form-field-counter">{cv.profile.length} / 600 characters</span>
      </label>
    </div>
  );
}
