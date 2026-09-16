import type { ReactNode } from 'react';
import { useUndoableRemove } from '../../../hooks/useUndoableRemove';
import { UndoToast } from './UndoToast';

interface RepeatableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  itemNoun: string; // e.g. "skill", "project" — used in remove button labels & undo message
  emptyHint?: string;
}

export function RepeatableList<T extends object>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel,
  itemNoun,
  emptyHint,
}: RepeatableListProps<T>) {
  const { remove, undo, pendingRemoval } = useUndoableRemove(items, onChange);

  const updateAt = (index: number, patch: Partial<T>) => {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="repeatable-list">
      {items.length === 0 && emptyHint ? <p className="repeatable-list-empty-hint">{emptyHint}</p> : null}

      {items.map((item, index) => (
        <div className="repeatable-list-item" key={index}>
          <div className="repeatable-list-item-content">{renderItem(item, index, (patch) => updateAt(index, patch))}</div>
          <button
            type="button"
            className="repeatable-list-remove-button"
            onClick={() => remove(index)}
            aria-label={`Remove this ${itemNoun}`}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={() => onChange([...items, createItem()])}
      >
        + {addLabel}
      </button>

      {pendingRemoval ? (
        <UndoToast message={`${itemNoun[0].toUpperCase()}${itemNoun.slice(1)} removed.`} onUndo={undo} />
      ) : null}
    </div>
  );
}
