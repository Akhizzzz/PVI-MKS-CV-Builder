import type { CV } from './cvModel';

/**
 * Fills in any newer optional CV fields that a CV saved before those
 * fields existed won't have. Applied wherever a CV is read out of storage
 * so older saved CVs keep loading exactly as before — nothing on disk is
 * rewritten, this only shapes the in-memory object.
 */
export function normalizeCV(cv: CV): CV {
  return {
    ...cv,
    profileDraft: cv.profileDraft ?? { whoAreYou: '', goodAt: '', workEnjoy: '', fieldAiming: '' },
    projects: cv.projects.map((p) => ({ ...p, roughNotes: p.roughNotes ?? '' })),
    workExperience: cv.workExperience.map((w) => ({ ...w, roughNotes: w.roughNotes ?? '' })),
    education: cv.education.map((e) => ({ ...e, educationType: e.educationType ?? 'other', roughNotes: e.roughNotes ?? '' })),
  };
}
