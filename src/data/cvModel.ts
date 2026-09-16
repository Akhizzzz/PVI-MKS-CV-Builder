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
}

export interface WorkExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  startYear: string;
  endYear: string;
  points: string[];
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
