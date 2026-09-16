import { useCallback, useEffect, useState } from 'react';
import { useActiveCVContext } from '../context/ActiveCVContext';
import { indexedDbStorage } from '../storage/indexedDbStorage';
import { useAutosave } from './useAutosave';
import type { CV } from '../data/cvModel';

/** Loads the given CV id into the shared active-CV context, wires up
 * autosave, and exposes convenience update helpers for editor forms. */
export function useActiveCV(cvId: string) {
  const { cv, dispatch } = useActiveCVContext();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    indexedDbStorage.getCV(cvId).then((loaded) => {
      if (cancelled) return;
      if (loaded) {
        dispatch({ type: 'load', cv: loaded });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [cvId, dispatch]);

  const autosaveStatus = useAutosave(cv && cv.id === cvId ? cv : null);

  const update = useCallback(
    (patch: Partial<CV>) => dispatch({ type: 'update', patch }),
    [dispatch],
  );

  const updatePersonalDetails = useCallback(
    (patch: Partial<CV['personalDetails']>) => dispatch({ type: 'updatePersonalDetails', patch }),
    [dispatch],
  );

  return {
    cv: cv && cv.id === cvId ? cv : null,
    loading,
    notFound,
    autosaveStatus,
    update,
    updatePersonalDetails,
  };
}
