export function DeliTrackerView() {
  return (
    <div className="py-2" data-testid="tracker-view">
      <div className="text-clim-muted text-xs uppercase tracking-wide">Lifecycle</div>
      <div><span className="text-clim-bright">DONE</span> cart submitted</div>
      <div><span className="text-clim-bright">ACTIVE</span> kitchen accepted order</div>
      <div><span className="text-clim-muted">PENDING</span> pickup notification</div>
    </div>
  );
}
