import type { DeliViewHeaderProps } from './types';

export function DeliViewHeader({ view, activeFilters }: DeliViewHeaderProps) {
  return (
    <div className="py-2">
      <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
      <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
      <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
      {activeFilters && activeFilters.length > 0 && (
        <div className="flex gap-2 mt-1">
          {activeFilters.map((filter) => (
            <span key={filter} className="text-xs px-1.5 py-0.5 border border-clim-danger text-clim-danger">
              {filter}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
