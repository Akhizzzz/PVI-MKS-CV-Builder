interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel: string;
  itemNoun: string;
}

/** Simple repeatable list of plain strings (e.g. skills) — remove is
 * immediate since these are single short fields, not multi-field entries
 * worth an undo window. */
export function StringListInput({ items, onChange, placeholder, addLabel, itemNoun }: Props) {
  const updateAt = (index: number, value: string) => {
    const next = items.slice();
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(items.slice(0, index).concat(items.slice(index + 1)));
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
          <button
            type="button"
            className="string-list-input-remove"
            onClick={() => removeAt(index)}
            aria-label={`Remove this ${itemNoun}`}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="add-button add-button-small" onClick={() => onChange([...items, ''])}>
        + {addLabel}
      </button>
    </div>
  );
}
