import { useEffect, useRef, useState } from 'react';
import type { CV } from '../data/cvModel';
import { indexedDbStorage } from '../storage/indexedDbStorage';

export type AutosaveStatus = 'idle' | 'saving' | 'saved';

const DEBOUNCE_MS = 800;

/** Debounced autosave: writes the given CV to IndexedDB shortly after it
 * stops changing, so users never need to press a Save button. */
export function useAutosave(cv: CV | null): AutosaveStatus {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedOnceRef = useRef(false);

  useEffect(() => {
    if (!cv) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('saving');

    timeoutRef.current = setTimeout(() => {
      indexedDbStorage.saveCV(cv).then(() => {
        savedOnceRef.current = true;
        setStatus('saved');
      });
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cv]);

  return status;
}
