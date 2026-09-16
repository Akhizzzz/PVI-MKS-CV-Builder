import { useEffect, useState } from 'react';
import { indexedDbStorage } from '../storage/indexedDbStorage';

/** Resolves a stored photo blobId to a temporary object URL for display,
 * revoking it on cleanup/change to avoid leaking memory. */
export function usePhotoUrl(blobId: string | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!blobId) {
      setUrl(undefined);
      return;
    }
    let objectUrl: string | undefined;
    let cancelled = false;

    indexedDbStorage.getPhoto(blobId).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [blobId]);

  return url;
}
