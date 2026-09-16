interface UndoToastProps {
  message: string;
  onUndo: () => void;
}

export function UndoToast({ message, onUndo }: UndoToastProps) {
  return (
    <div className="undo-toast" role="status">
      <span>{message}</span>
      <button type="button" className="undo-toast-button" onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
