import type { CV, ThemeId } from '../../../data/cvModel';
import { THEMES } from '../../../data/themes';

interface Props {
  cv: CV;
  update: (patch: Partial<CV>) => void;
}

export function ThemeSelector({ cv, update }: Props) {
  return (
    <div className="form-step">
      <h2 className="form-step-title">Choose Your CV Colour</h2>
      <p className="form-step-hint">
        Pick one of these professional colour themes. Your layout, photo, and content stay exactly the same —
        only the colours change.
      </p>

      <div className="theme-grid" role="radiogroup" aria-label="CV colour theme">
        {THEMES.map((theme) => {
          const selected = cv.themeId === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`theme-option${selected ? ' theme-option-selected' : ''}`}
              onClick={() => update({ themeId: theme.id as ThemeId })}
            >
              <span className="theme-swatches" aria-hidden="true">
                <span className="theme-swatch" style={{ background: theme.primary }} />
                <span className="theme-swatch" style={{ background: theme.accent }} />
              </span>
              <span className="theme-option-name">{theme.name}</span>
              {selected ? <span className="theme-option-check" aria-hidden="true">✓</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
