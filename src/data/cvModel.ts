// Core CV data model. Kept deliberately decoupled from rendering/storage
// so a future cloud-storage backend or alternate renderer can reuse it.

export type ThemeId =
  | 'pvi-classic'
  | 'deep-teal-sand'
  | 'burgundy-champagne'
  | 'charcoal-sage'
  | 'navy-powder-blue'
  | 'forest-beige'
  | 'slate-dusty-rose';

export type LanguageProficiency = 'Written & Spoken' | 'Spoken' | 'Written';

export interface PhotoCropRect {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

export interface ProfileDraft {
  whoAreYou: string;
  goodAt: string;
  workEnjoy: string;
  fieldAiming: string;
}

export interface PersonalDetails {
  fullName: string;
  professionalTitle: string;
  address: string;
  email: string;
  phone: string;
  photo?: {
    blobId: string;
    cropRect: PhotoCropRect;
  };
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
}

export interface ProjectEntry {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  /** Rough, unpolished notes the user wrote before AI turned them into bullets. */
  roughNotes?: string;
}

export interface WorkExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  roughNotes?: string;
}

export type EducationType = 'higher' | 'pvi' | 'school' | 'other';

export interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  startYear: string;
  endYear: string;
  points: string[];
  educationType?: EducationType;
  roughNotes?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  institute: string;
  year: string;
  description?: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface CV {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  themeId: ThemeId;

  personalDetails: PersonalDetails;
  profile: string;
  /** The four guided-question answers behind the AI-generated profile, kept
   * so the professional can revise them and regenerate later. */
  profileDraft?: ProfileDraft;

  technicalSkills: string[];
  workplaceSkills: string[];
  languages: LanguageEntry[];
  projects: ProjectEntry[];
  workExperience: WorkExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
}

export interface CVSummary {
  id: string;
  name: string;
  updatedAt: number;
  themeId: ThemeId;
  hasPhoto: boolean;
}

export function summarizeCV(cv: CV): CVSummary {
  return {
    id: cv.id,
    name: cv.name,
    updatedAt: cv.updatedAt,
    themeId: cv.themeId,
    hasPhoto: Boolean(cv.personalDetails.photo),
  };
}
