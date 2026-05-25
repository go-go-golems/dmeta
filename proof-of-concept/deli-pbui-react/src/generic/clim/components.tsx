import type { ActionPresentation, ClimSessionState, PresentationRef } from './types';

export function ClimShell({ state, children }: { state: ClimSessionState; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-clim-bg text-clim-fg grid grid-rows-[auto_1fr_auto]">
      <header className="flex items-center justify-between border-b border-clim-border px-3 py-2 text-sm">
        <strong className="text-clim-bright tracking-wide">HUDSON STREET DELI</strong>
        <span className="text-clim-bright">{state.modeLabel}</span>
      </header>
      <main className="p-3">{children}</main>
      <footer className="border-t border-clim-border px-3 py-2 text-sm">
        <div><span className="text-clim-bright">:</span> {state.commandBuffer}<span className="text-clim-bright">█</span></div>
        <div className="text-clim-muted">{state.resultLine ?? 'Select a presentation or type a command.'}</div>
      </footer>
    </div>
  );
}

export function PresentationRefLine({ presentation, selected, selectable, onSelect }: { presentation: PresentationRef; selected?: boolean; selectable?: boolean; onSelect?: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'block w-full text-left px-2 py-1 border border-transparent',
        selected ? 'bg-clim-panel border-clim-border text-clim-bright' : '',
        selectable ? 'text-clim-danger' : '',
      ].filter(Boolean).join(' ')}
      data-presentation-type={presentation.type}
      data-presentation-id={presentation.id}
    >
      <span className="text-clim-bright">&lt;{presentation.type}&gt;</span> {presentation.label}{' '}
      <span className="text-clim-muted">#{presentation.id}</span>{' '}
      <span className="text-clim-muted">{presentation.capabilities.join(' ')}</span>
    </button>
  );
}

export function ActionPresentationInline({ action, onInvoke }: { action: ActionPresentation; onInvoke?: () => void }) {
  return (
    <button
      type="button"
      onClick={onInvoke}
      disabled={Boolean(action.disabledReason)}
      className={["underline decoration-dotted mr-3", action.descriptor.requiresConfirmation ? 'text-clim-danger' : 'text-clim-bright', action.disabledReason ? 'opacity-40' : ''].join(' ')}
      data-action-id={action.descriptor.id}
    >
      {action.commandLabel ?? action.descriptor.label}
    </button>
  );
}

export function ActionHintBar({ actions, onInvoke }: { actions: ActionPresentation[]; onInvoke?: (action: ActionPresentation) => void }) {
  return (
    <div className="border-y border-clim-border py-2 my-3 text-sm">
      {actions.map((action) => <ActionPresentationInline key={action.descriptor.id} action={action} onInvoke={() => onInvoke?.(action)} />)}
    </div>
  );
}
