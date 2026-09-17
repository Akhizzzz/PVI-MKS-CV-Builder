import { v4 as uuid } from 'uuid';
import type { CV, ThemeId } from '../data/cvModel';
import { indexedDbStorage } from './indexedDbStorage';
import { normalizeCV } from '../data/migrate';

const BACKUP_SCHEMA_VERSION = 1;
const MAX_BACKUP_BYTES = 25 * 1024 * 1024; // 25MB sanity ceiling

interface BackupEnvelope {
  schemaVersion: number;
  exportedAt: number;
  cv: CV;
  photoDataUrl?: string;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function exportBackup(cv: CV): Promise<void> {
  let photoDataUrl: string | undefined;
  if (cv.personalDetails.photo) {
    const blob = await indexedDbStorage.getPhoto(cv.personalDetails.photo.blobId);
    if (blob) {
      photoDataUrl = await blobToDataUrl(blob);
    }
  }

  const envelope: BackupEnvelope = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: Date.now(),
    cv,
    photoDataUrl,
  };

  const json = JSON.stringify(envelope, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = cv.name.trim().replace(/[^a-z0-9\-_ ]/gi, '').replace(/\s+/g, '-') || 'cv';
  link.download = `${safeName}.pvicv.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export class BackupValidationError extends Error {}

const VALID_PROFICIENCIES = new Set(['Written & Spoken', 'Spoken', 'Written']);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new BackupValidationError(message);
  }
}

// Defensive structural validation of untrusted imported JSON before any of
// it is written to IndexedDB. Never executes or evaluates file content.
function validateEnvelope(data: unknown): asserts data is BackupEnvelope {
  assert(typeof data === 'object' && data !== null, 'This file is not a valid CV backup.');
  const envelope = data as Record<string, unknown>;

  assert(typeof envelope.schemaVersion === 'number', 'This backup file is missing version information.');
  assert(typeof envelope.cv === 'object' && envelope.cv !== null, 'This backup file has no CV data.');

  const cv = envelope.cv as Record<string, unknown>;
  assert(typeof cv.id === 'string', 'This backup file is corrupted (missing CV id).');
  assert(typeof cv.name === 'string', 'This backup file is corrupted (missing CV name).');
  assert(typeof cv.themeId === 'string', 'This backup file is corrupted (missing theme).');
  assert(typeof cv.personalDetails === 'object' && cv.personalDetails !== null, 'This backup file is corrupted (missing personal details).');
  assert(typeof cv.profile === 'string', 'This backup file is corrupted (missing profile text).');
  assert(isStringArray(cv.technicalSkills), 'This backup file is corrupted (technical skills).');
  assert(isStringArray(cv.workplaceSkills), 'This backup file is corrupted (workplace skills).');
  assert(Array.isArray(cv.languages), 'This backup file is corrupted (languages).');
  for (const lang of cv.languages as unknown[]) {
    const l = lang as Record<string, unknown>;
    assert(typeof l.language === 'string' && VALID_PROFICIENCIES.has(l.proficiency as string), 'This backup file is corrupted (a language entry).');
  }
  assert(Array.isArray(cv.projects), 'This backup file is corrupted (projects).');
  assert(Array.isArray(cv.workExperience), 'This backup file is corrupted (work experience).');
  assert(Array.isArray(cv.education), 'This backup file is corrupted (education).');
  assert(Array.isArray(cv.certifications), 'This backup file is corrupted (certifications).');
  assert(Array.isArray(cv.awards), 'This backup file is corrupted (awards).');

  if (envelope.photoDataUrl !== undefined) {
    assert(typeof envelope.photoDataUrl === 'string' && envelope.photoDataUrl.startsWith('data:image/'), 'This backup file has an invalid photograph.');
  }
}

/**
 * Validates and imports a backup file. Never mutates existing storage
 * unless validation fully passes, and always creates a fresh CV id to
 * avoid silently overwriting an existing CV with the same id.
 */
export async function importBackup(file: File): Promise<CV> {
  assert(file.size <= MAX_BACKUP_BYTES, 'This backup file is too large to import.');

  let parsed: unknown;
  try {
    const text = await file.text();
    parsed = JSON.parse(text);
  } catch {
    throw new BackupValidationError('This file is not a valid backup (not readable JSON).');
  }

  validateEnvelope(parsed);
  const envelope = parsed;

  const now = Date.now();
  const importedCV: CV = {
    ...normalizeCV(envelope.cv),
    id: uuid(),
    name: envelope.cv.name,
    createdAt: now,
    updatedAt: now,
    themeId: envelope.cv.themeId as ThemeId,
  };

  if (envelope.photoDataUrl) {
    const blob = await dataUrlToBlob(envelope.photoDataUrl);
    const blobId = uuid();
    await indexedDbStorage.savePhoto(blobId, blob);
    importedCV.personalDetails = {
      ...importedCV.personalDetails,
      photo: {
        blobId,
        cropRect: importedCV.personalDetails.photo?.cropRect ?? { x: 0, y: 0, width: 1, height: 1, zoom: 1 },
      },
    };
  } else {
    importedCV.personalDetails = { ...importedCV.personalDetails, photo: undefined };
  }

  await indexedDbStorage.saveCV(importedCV);
  return importedCV;
}
