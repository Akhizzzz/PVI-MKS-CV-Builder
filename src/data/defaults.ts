import { v4 as uuid } from 'uuid';
import type { CV } from './cvModel';
import { DEFAULT_THEME_ID } from './themes';

export function createBlankCV(name: string): CV {
  const now = Date.now();
  return {
    id: uuid(),
    name,
    createdAt: now,
    updatedAt: now,
    themeId: DEFAULT_THEME_ID,
    personalDetails: {
      fullName: '',
      professionalTitle: '',
      address: '',
      email: '',
      phone: '',
    },
    profile: '',
    profileDraft: { whoAreYou: '', goodAt: '', workEnjoy: '', fieldAiming: '' },
    technicalSkills: [],
    workplaceSkills: [],
    languages: [],
    projects: [],
    workExperience: [],
    education: [],
    certifications: [],
    awards: [],
  };
}

// Placeholder copy shown (greyed) inside empty inputs so users always know
// what belongs in a field, per the brief's explicit placeholder requirement.
export const PLACEHOLDERS = {
  fullName: 'e.g. Priya Sharma',
  professionalTitle: 'e.g. Graphic Designer / Office Assistant',
  address: 'e.g. 123, Anywhere, Any City',
  email: 'e.g. name@gmail.com',
  phone: 'e.g. +91 12345 67890',
  profile:
    'Who are you? What are you good at? What type of work do you enjoy? What field are you aiming for?',
  profileWhoAreYou: 'e.g. I recently finished a course in graphic design at PVI.',
  profileGoodAt: 'e.g. I am good at using Canva and coming up with poster ideas.',
  profileWorkEnjoy: 'e.g. I enjoy making social media posts and event posters.',
  profileFieldAiming: 'e.g. I want to work in graphic design or visual content.',
  technicalSkill: 'e.g. MS Office, Canva, Typing / Data Entry',
  workplaceSkill: 'e.g. Communication, Teamwork, Time Management',
  language: 'e.g. English, Hindi',
  projectTitle: 'e.g. College Annual Magazine Design',
  projectOrganization: 'e.g. Organization or Institution Name',
  projectBullet: 'e.g. Created / prepared / contributed to the project layout.',
  projectRoughNotes:
    'e.g. made pages for college magazine. used canva. arranged photos and text. final magazine was printed.',
  jobTitle: 'e.g. Front Office Assistant',
  company: 'e.g. Company Name',
  workBullet: 'e.g. Assisted / Supported / Organised the daily front-desk operations.',
  workRoughNotes: 'e.g. welcomed people, answered calls and entered customer details in excel',
  qualification: "e.g. Bachelor's in Commerce",
  institution: 'e.g. Name of Institution',
  educationPoint: 'e.g. Main areas / practical skills learned: ______.',
  educationRoughNotes: 'e.g. learnt canva, office, workplace communication. final activity made poster',
  certificationName: 'e.g. Short-Term Certificate Course in Office Administration',
  certificationInstitute: 'e.g. Prakramika Vocational Institute',
  certificationDescription: 'e.g. Brief description of what the course covered (optional).',
  awardTitle: 'e.g. Certificate of Recognition for Best Attendance',
  awardOrganization: 'e.g. Organisation Name',
  year: 'e.g. 2024',
  dateMonthYear: 'e.g. Jan 2024',
  cvName: 'e.g. Graphic Designer CV',
} as const;
