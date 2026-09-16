import type { CV, CVSummary } from '../data/cvModel';

// Persistence abstraction. IndexedDB (Dexie) is the only implementation in
// v1; a future cloud-backed implementation can satisfy this same interface
// without touching the editor/renderer code.
export interface StorageService {
  listCVs(): Promise<CVSummary[]>;
  getCV(id: string): Promise<CV | undefined>;
  saveCV(cv: CV): Promise<void>;
  deleteCV(id: string): Promise<void>;
  renameCV(id: string, name: string): Promise<void>;
  duplicateCV(id: string): Promise<CV>;

  savePhoto(blobId: string, blob: Blob): Promise<void>;
  getPhoto(blobId: string): Promise<Blob | undefined>;
  deletePhoto(blobId: string): Promise<void>;
}
