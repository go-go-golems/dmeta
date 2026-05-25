import type { DeliViewHeaderProps } from './types';

export function DeliViewHeader({ view }: DeliViewHeaderProps) {
  return (
    <div className="py-2">
      <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
      <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
      <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
    </div>
  );
}
