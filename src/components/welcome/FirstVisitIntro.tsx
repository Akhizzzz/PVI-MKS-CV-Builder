interface Props {
  onStart: () => void;
}

export function FirstVisitIntro({ onStart }: Props) {
  return (
    <div className="welcome-card">
      <h1 className="welcome-title">Create your CV in 3 simple steps</h1>
      <ol className="intro-steps">
        <li>Fill in your details</li>
        <li>Choose your colour</li>
        <li>Download your CV</li>
      </ol>
      <button type="button" className="button-primary button-large" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
