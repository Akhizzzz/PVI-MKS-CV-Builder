export interface StepDef {
  id: string;
  label: string;
}

// Ordered list of guided form steps. Review & Download is a separate screen
// reached after the last step (see CVEditor / ReviewScreen).
export const STEPS: StepDef[] = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'languages', label: 'Languages' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards', label: 'Awards' },
  { id: 'theme', label: 'Theme' },
];
