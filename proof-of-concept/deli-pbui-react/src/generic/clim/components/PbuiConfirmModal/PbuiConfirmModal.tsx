import { useEffect } from 'react';
import type { ActionSpec, PresentationRef } from '../../types';

export interface PbuiConfirmModalProps {
  action: ActionSpec;
  ref?: PresentationRef;
  className?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PbuiConfirmModal({
  action,
  ref,
  className,
  onConfirm,
  onCancel,
}: PbuiConfirmModalProps) {
  // Handle Escape key to cancel the confirm modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className={['min-w-[360px] max-w-[500px] bg-black border border-clim-border text-sm', className].filter(Boolean).join(' ')}>
        <div className="px-3 py-2 text-clim-danger font-bold tracking-wide border-b border-clim-border">
          Confirm
        </div>
        <div className="px-3 py-3 text-clim-bright leading-relaxed">
          <span className="text-clim-muted">&lt;{action.id}&gt;</span>{' '}
          {action.confirmation?.prompt ?? action.description}
          {ref ? (
            <>
              <br />
              <span className="text-clim-muted">&lt;{ref.type}&gt;</span>{' '}
              {ref.label}
            </>
          ) : null}
        </div>
        <div className="px-3 py-2 border-t border-clim-border flex gap-6">
          <button
            type="button"
            className="px-3 py-1 border border-clim-danger text-clim-danger hover:bg-clim-danger hover:text-black cursor-pointer"
            onClick={onConfirm}
          >
            {action.confirmation?.confirmLabel ?? 'YES'}
          </button>
          <button
            type="button"
            className="px-3 py-1 border border-clim-border text-clim-bright hover:bg-clim-bright hover:text-black cursor-pointer"
            onClick={onCancel}
          >
            {action.confirmation?.cancelLabel ?? 'CANCEL'}
          </button>
        </div>
        <div className="px-3 py-1 text-clim-muted italic">
          or type YES / ESC
        </div>
      </div>
    </div>
  );
}
