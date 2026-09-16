import Dexie, { type EntityTable } from 'dexie';
import type { CV } from '../data/cvModel';

export interface PhotoRecord {
  blobId: string;
  blob: Blob;
}

class PviCvDatabase extends Dexie {
  cvs!: EntityTable<CV, 'id'>;
  photos!: EntityTable<PhotoRecord, 'blobId'>;

  constructor() {
    super('pvi-cv-builder');
    this.version(1).stores({
      cvs: 'id, updatedAt',
      photos: 'blobId',
    });
  }
}

export const db = new PviCvDatabase();
