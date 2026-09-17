import { useState } from 'react';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel: string;
  itemNoun: string;
  /** When provided, each row gets a "✨ Make Professional" button that
   * rewrites just that row's text via the AI writing assistant. The parent
   * owns the actual request/consent flow (via useAIEnhance) — this
   * component only tracks which row is loading and offers a brief
   * row-local "Undo AI". */
  onEnhance?: (currentText: string) => Promise<string | null>;
}

export function StringListInput({ items, onChange, placeholder, addLabel, itemNoun, onEnhance }: Props) {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const [undo, setUndo] = useState<{ index: number; previousValue: string } | null>(null);

  const updateAt = (index: number, value: string) => {
    const next = items.slice();
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(items.slice(0, index).concat(items.slice(index + 1)));
  };

  const handleEnhance = async (index: number) => {
    if (!onEnhance || !items[index].trim() || enhancingIndex !== null) return;
    setEnhancingIndex(index);
    const previousValue = items[index];
    const improved = await onEnhance(previousValue);
    setEnhancingIndex(null);
    if (improved !== null) {
      updateAt(index, improved);
      setUndo({ index, previousValue });
    }
  };

  return (
    <div className="string-list-input">
      {items.map((item, index) => (
        <div className="string-list-input-row" key={index}>
          <input
            type="text"
            value={item}
            placeholder={placeholder}
            onChange={(e) => updateAt(index, e.target.value)}
          />
          {onEnhance ? (
            <button
              type="button"
              className="ai-enhance-button ai-enhance-button-small"
              onClick={() => handleEnhance(index)}
              disabled={enhancingIndex !== null || !item.trim()}
            >
              {enhancingIndex === index ? 'Improving…' : '✨ Make Professional'}
            </button>
          ) : null}
          <button
            type="button"
            className="string-list-input-remove"
            onClick={() => removeAt(index)}
            aria-label={`Remove this ${itemNoun}`}
          >
            ✕
          </button>
          {undo?.index === index ? (
            <button
              type="button"
              className="undo-ai-link"
              onClick={() => {
                updateAt(index, undo.previousValue);
                setUndo(null);
              }}
            >
              Undo AI
            </button>
          ) : null}
        </div>
      ))}
      <button type="button" className="add-button add-button-small" onClick={() => onChange([...items, ''])}>
        + {addLabel}
      </button>
    </div>
  );
}
