import { v4 as uuid } from 'uuid';
import { db } from './db';
import type { CV } from '../data/cvModel';
import { summarizeCV } from '../data/cvModel';
import type { StorageService } from './StorageService';

export const indexedDbStorage: StorageService = {
  async listCVs() {
    const all = await db.cvs.orderBy('updatedAt').reverse().toArray();
    return all.map(summarizeCV);
  },

  async getCV(id) {
    return db.cvs.get(id);
  },

  async saveCV(cv) {
    await db.cvs.put(cv);
  },

  async deleteCV(id) {
    const cv = await db.cvs.get(id);
    await db.transaction('rw', db.cvs, db.photos, async () => {
      await db.cvs.delete(id);
      if (cv?.personalDetails.photo) {
        await db.photos.delete(cv.personalDetails.photo.blobId);
      }
    });
  },

  async renameCV(id, name) {
    await db.cvs.update(id, { name, updatedAt: Date.now() });
  },

  async duplicateCV(id) {
    const source = await db.cvs.get(id);
    if (!source) {
      throw new Error(`CV ${id} not found`);
    }
    const now = Date.now();
    const copy: CV = {
      ...source,
      id: uuid(),
      name: `${source.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    if (source.personalDetails.photo) {
      const originalBlob = await db.photos.get(source.personalDetails.photo.blobId);
      if (originalBlob) {
        const newBlobId = uuid();
        await db.photos.put({ blobId: newBlobId, blob: originalBlob.blob });
        copy.personalDetails = {
          ...copy.personalDetails,
          photo: { ...source.personalDetails.photo, blobId: newBlobId },
        };
      }
    }

    await db.cvs.put(copy);
    return copy;
  },

  async savePhoto(blobId, blob) {
    await db.photos.put({ blobId, blob });
  },

  async getPhoto(blobId) {
    const record = await db.photos.get(blobId);
    return record?.blob;
  },

  async deletePhoto(blobId) {
    await db.photos.delete(blobId);
  },
};
