import { useCallback, useRef, useState } from 'react';

interface PendingRemoval<T> {
  item: T;
  index: number;
}

const UNDO_WINDOW_MS = 5000;

/**
 * Generic "remove with a brief Undo window" helper for repeatable list
 * sections (skills, languages, projects, ...). Removing an item doesn't
 * mutate the list immediately in the UI's memory of "what happened" — it
 * stages the removal and gives the user a few seconds to undo it.
 */
export function useUndoableRemove<T>(list: T[], setList: (next: T[]) => void) {
  const [pending, setPending] = useState<PendingRemoval<T> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const remove = useCallback(
    (index: number) => {
      const item = list[index];
      const next = list.slice(0, index).concat(list.slice(index + 1));
      setList(next);
      setPending({ item, index });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setPending(null), UNDO_WINDOW_MS);
    },
    [list, setList],
  );

  const undo = useCallback(() => {
    if (!pending) return;
    const restored = list.slice(0, pending.index).concat([pending.item], list.slice(pending.index));
    setList(restored);
    setPending(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [pending, list, setList]);

  return { remove, undo, pendingRemoval: pending };
}
