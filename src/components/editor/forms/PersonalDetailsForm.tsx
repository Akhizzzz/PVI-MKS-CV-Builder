import type { CV } from '../../../data/cvModel';
import { PLACEHOLDERS } from '../../../data/defaults';
import { PhotoUploader } from './PhotoUploader';

interface Props {
  cv: CV;
  updatePersonalDetails: (patch: Partial<CV['personalDetails']>) => void;
}

export function PersonalDetailsForm({ cv, updatePersonalDetails }: Props) {
  const d = cv.personalDetails;

  return (
    <div className="form-step">
      <h2 className="form-step-title">Personal Details</h2>
      <p className="form-step-hint">Tell us who you are. This appears at the top of your CV.</p>

      <PhotoUploader cv={cv} updatePersonalDetails={updatePersonalDetails} />

      <label className="form-field">
        <span className="form-field-label">Full Name</span>
        <input
          type="text"
          value={d.fullName}
          placeholder={PLACEHOLDERS.fullName}
          onChange={(e) => updatePersonalDetails({ fullName: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">Professional Title / Career Area</span>
        <input
          type="text"
          value={d.professionalTitle}
          placeholder={PLACEHOLDERS.professionalTitle}
          onChange={(e) => updatePersonalDetails({ professionalTitle: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">Address</span>
        <textarea
          value={d.address}
          placeholder={PLACEHOLDERS.address}
          rows={2}
          onChange={(e) => updatePersonalDetails({ address: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">Email</span>
        <input
          type="email"
          value={d.email}
          placeholder={PLACEHOLDERS.email}
          onChange={(e) => updatePersonalDetails({ email: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span className="form-field-label">Phone Number</span>
        <input
          type="tel"
          value={d.phone}
          placeholder={PLACEHOLDERS.phone}
          onChange={(e) => updatePersonalDetails({ phone: e.target.value })}
        />
      </label>
    </div>
  );
}
