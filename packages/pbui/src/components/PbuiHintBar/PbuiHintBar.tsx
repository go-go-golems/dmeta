import type { ActionPresentation, PresentationRef } from '../../types';

export interface PbuiHintBarProps {
  selectedRef?: PresentationRef;
  actions: ActionPresentation[];
  className?: string;
  onAction: (action: ActionPresentation) => void;
}

export function PbuiHintBar({
  selectedRef,
  actions,
  className,
  onAction,
}: PbuiHintBarProps) {
  if (!selectedRef || actions.length === 0) {
    return null;
  }

  return (
    <div className={['py-1 text-sm border-t border-clim-border mt-2', className].filter(Boolean).join(' ')}>
      <span className="text-clim-muted">Selected &lt;{selectedRef.type}&gt; {selectedRef.label}. </span>
      {actions.map((ap) => (
        <button
          key={ap.action.id}
          type="button"
          className={[
            'mr-2',
            ap.disabledReason ? 'text-clim-muted cursor-not-allowed' : 'text-clim-bright cursor-pointer hover:underline',
            ap.requiresConfirmation ? 'text-clim-danger' : '',
          ].filter(Boolean).join(' ')}
          disabled={Boolean(ap.disabledReason)}
          onClick={() => {
            if (!ap.disabledReason) onAction(ap);
          }}
          title={ap.action.description}
        >
          {ap.action.id}{ap.requiresConfirmation ? ' ⚠' : ''}
        </button>
      ))}
      <span className="text-clim-muted"> Right-click for menu.</span>
    </div>
  );
}
