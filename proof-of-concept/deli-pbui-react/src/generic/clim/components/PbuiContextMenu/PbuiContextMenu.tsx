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
          actions.map((ap) => (
            <button
              key={ap.action.id}
              type="button"
              className={[
                'block w-full text-left px-2 py-1 hover:bg-clim-highlight',
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
          ))
        )}
      </div>
    </>
  );
}
