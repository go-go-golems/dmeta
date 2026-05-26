import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActionPresentation, PresentationRef } from '../../types';

export interface PbuiContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  ref: PresentationRef | null;
  actions: ActionPresentation[];
  className?: string;
  onAction: (action: ActionPresentation) => void;
  onDismiss: () => void;
}

export function PbuiContextMenu({
  visible,
  x,
  y,
  ref,
  actions,
  className,
  onAction,
  onDismiss,
}: PbuiContextMenuProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledActions = actions.filter((ap) => !ap.disabledReason);

  // Reset focus when menu opens/closes
  useEffect(() => {
    if (visible) {
      setFocusedIndex(-1);
    }
  }, [visible]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!visible) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      onDismiss();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = focusedIndex < enabledActions.length - 1 ? focusedIndex + 1 : 0;
      setFocusedIndex(next);
      buttonRefs.current[next]?.focus();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = focusedIndex > 0 ? focusedIndex - 1 : enabledActions.length - 1;
      setFocusedIndex(prev);
      buttonRefs.current[prev]?.focus();
      return;
    }
    if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < enabledActions.length) {
      e.preventDefault();
      onAction(enabledActions[focusedIndex]);
      return;
    }
  }, [visible, focusedIndex, enabledActions, onAction, onDismiss]);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleKeyDown]);

  if (!visible || !ref) {
    return null;
  }

  return (
    <>
      {/* Click-away backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onDismiss}
        onContextMenu={(e) => { e.preventDefault(); onDismiss(); }}
      />
      {/* Menu panel */}
      <div
        className={['fixed z-50 min-w-[200px] bg-black border border-clim-border py-0.5 text-sm', className].filter(Boolean).join(' ')}
        style={{ left: x, top: y }}
      >
        <div className="px-2 py-1 text-clim-muted italic border-b border-clim-border">
          &lt;{ref.type}&gt; {ref.label}
        </div>
        {actions.length === 0 ? (
          <div className="px-2 py-1 text-clim-muted">No actions available</div>
        ) : (
          actions.map((ap, i) => {
            const enabledIndex = ap.disabledReason ? -1 : enabledActions.indexOf(ap);
            return (
              <button
                key={ap.action.id}
                ref={(el) => { buttonRefs.current[enabledIndex] = el; }}
                type="button"
                className={[
                  'block w-full text-left px-2 py-1 hover:bg-clim-highlight focus:bg-clim-highlight focus:outline-none',
                  ap.disabledReason ? 'text-clim-muted cursor-not-allowed' : 'text-clim-bright cursor-pointer',
                  ap.requiresConfirmation ? 'text-clim-danger' : '',
                ].filter(Boolean).join(' ')}
                disabled={Boolean(ap.disabledReason)}
                onClick={() => {
                  if (!ap.disabledReason) onAction(ap);
                }}
              >
                {ap.action.id}{ap.requiresConfirmation ? ' ⚠' : ''}
                {ap.disabledReason ? ` (${ap.disabledReason})` : ''}
              </button>
            );
          })
        )}
      </div>
    </>
  );
}
