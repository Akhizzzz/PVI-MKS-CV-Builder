interface BulletListInputProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  placeholder: string;
  addLabel?: string;
}

export function BulletListInput({ bullets, onChange, placeholder, addLabel = 'Add Point' }: BulletListInputProps) {
  const updateBullet = (index: number, value: string) => {
    const next = bullets.slice();
    next[index] = value;
    onChange(next);
  };

  const removeBullet = (index: number) => {
    onChange(bullets.slice(0, index).concat(bullets.slice(index + 1)));
  };

  return (
    <div className="bullet-list-input">
      {bullets.map((bullet, index) => (
        <div className="bullet-list-input-row" key={index}>
          <span className="bullet-list-input-marker" aria-hidden="true">
            •
          </span>
          <textarea
            className="bullet-list-input-textarea"
            value={bullet}
            placeholder={placeholder}
            onChange={(e) => updateBullet(index, e.target.value)}
            rows={2}
          />
          <button
            type="button"
            className="bullet-list-input-remove"
            onClick={() => removeBullet(index)}
            aria-label="Remove this point"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="add-button add-button-small" onClick={() => onChange([...bullets, ''])}>
        + {addLabel}
      </button>
    </div>
  );
}
