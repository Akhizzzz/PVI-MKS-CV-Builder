import { STEPS } from './steps';

interface Props {
  currentStepId: string;
  onSelect: (stepId: string) => void;
}

export function StepNav({ currentStepId, onSelect }: Props) {
  return (
    <nav className="step-nav" aria-label="CV sections">
      <ol>
        {STEPS.map((step) => (
          <li key={step.id}>
            <button
              type="button"
              className={`step-nav-button${step.id === currentStepId ? ' step-nav-button-active' : ''}`}
              onClick={() => onSelect(step.id)}
              aria-current={step.id === currentStepId ? 'step' : undefined}
            >
              {step.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
