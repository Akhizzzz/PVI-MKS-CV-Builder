// Content-driven pagination model.
//
// A CV is decomposed into two independent ordered streams of atomic
// "blocks" — one for the left (narrow) column, one for the right (wide)
// column. Each block bundles a section heading with just enough of that
// section's content that a heading is never left alone at the bottom of a
// page (see pagination.ts). Empty sections simply produce no blocks, so
// unused space is automatically reclaimed (brief §17).
import type { CV } from '../data/cvModel';

export type LeftBlock =
  | { kind: 'profile'; id: string; text: string }
  | { kind: 'skills'; id: string; technical: string[]; workplace: string[] }
  | { kind: 'languages'; id: string; items: CV['languages'] }
  | { kind: 'certifications-heading-first'; id: string; heading: 'Certifications'; first: CV['certifications'][number] }
  | { kind: 'certification'; id: string; item: CV['certifications'][number] }
  | { kind: 'awards-heading-first'; id: string; heading: 'Awards'; first: CV['awards'][number] }
  | { kind: 'award'; id: string; item: CV['awards'][number] };

export type RightBlock =
  | { kind: 'projects-heading-first'; id: string; heading: 'Projects/Practical Experience'; first: CV['projects'][number] }
  | { kind: 'project'; id: string; item: CV['projects'][number] }
  | { kind: 'experience-heading-first'; id: string; heading: 'Work Experience'; first: CV['workExperience'][number] }
  | { kind: 'experience'; id: string; item: CV['workExperience'][number] }
  | { kind: 'education-heading-first'; id: string; heading: 'Education'; first: CV['education'][number] }
  | { kind: 'education'; id: string; item: CV['education'][number] };

export function buildLeftBlocks(cv: CV): LeftBlock[] {
  const blocks: LeftBlock[] = [];

  if (cv.profile.trim()) {
    blocks.push({ kind: 'profile', id: 'profile', text: cv.profile });
  }
  if (cv.technicalSkills.length > 0 || cv.workplaceSkills.length > 0) {
    blocks.push({ kind: 'skills', id: 'skills', technical: cv.technicalSkills, workplace: cv.workplaceSkills });
  }
  if (cv.languages.length > 0) {
    blocks.push({ kind: 'languages', id: 'languages', items: cv.languages });
  }
  if (cv.certifications.length > 0) {
    const [first, ...rest] = cv.certifications;
    blocks.push({ kind: 'certifications-heading-first', id: 'cert-head', heading: 'Certifications', first });
    for (const item of rest) blocks.push({ kind: 'certification', id: `cert-${item.id}`, item });
  }
  if (cv.awards.length > 0) {
    const [first, ...rest] = cv.awards;
    blocks.push({ kind: 'awards-heading-first', id: 'award-head', heading: 'Awards', first });
    for (const item of rest) blocks.push({ kind: 'award', id: `award-${item.id}`, item });
  }

  return blocks;
}

export function buildRightBlocks(cv: CV): RightBlock[] {
  const blocks: RightBlock[] = [];

  if (cv.workExperience.length > 0) {
    const [first, ...rest] = cv.workExperience;
    blocks.push({ kind: 'experience-heading-first', id: 'exp-head', heading: 'Work Experience', first });
    for (const item of rest) blocks.push({ kind: 'experience', id: `exp-${item.id}`, item });
  }
  if (cv.projects.length > 0) {
    const [first, ...rest] = cv.projects;
    blocks.push({ kind: 'projects-heading-first', id: 'proj-head', heading: 'Projects/Practical Experience', first });
    for (const item of rest) blocks.push({ kind: 'project', id: `proj-${item.id}`, item });
  }
  if (cv.education.length > 0) {
    const [first, ...rest] = cv.education;
    blocks.push({ kind: 'education-heading-first', id: 'edu-head', heading: 'Education', first });
    for (const item of rest) blocks.push({ kind: 'education', item, id: `edu-${item.id}` });
  }

  return blocks;
}
