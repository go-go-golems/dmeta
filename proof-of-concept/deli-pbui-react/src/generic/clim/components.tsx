import type { ActionPresentation, ClimSessionState, CommandBinding, PresentationRef } from './types';

export function ClimShell({
  state,
  children,
  commandValue,
  onCommandChange,
  onCommandSubmit,
}: {
  state: ClimSessionState;
  children: React.ReactNode;
  commandValue?: string;
  onCommandChange?: (value: string) => void;
  onCommandSubmit?: (value: string) => void;
}) {
  const value = commandValue ?? state.commandBuffer;
  return (
    <div className="min-h-screen bg-clim-bg text-clim-fg grid grid-rows-[auto_1fr_auto]">
      <header className="flex items-center justify-between border-b border-clim-border px-3 py-2 text-sm">
        <strong className="text-clim-bright tracking-wide">HUDSON STREET DELI</strong>
        <span className="text-clim-bright">{state.modeLabel}</span>
      </header>
      <main className="p-3">{children}</main>
      <footer className="border-t border-clim-border px-3 py-2 text-sm">
        <form
          className="flex items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault();
            onCommandSubmit?.(value);
          }}
        >
          <label className="text-clim-bright" htmlFor="clim-command-line">:</label>
          <input
            id="clim-command-line"
            aria-label="Action command"
            className="min-w-0 flex-1 bg-transparent text-clim-bright outline-none caret-clim-danger focus:bg-clim-panel/60"
            value={value}
            onChange={(event) => onCommandChange?.(event.target.value)}
            spellCheck={false}
          />
          <span className="text-clim-bright">█</span>
        </form>
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
        'block w-full text-left px-2 py-1 border border-transparent transition-colors focus:outline-none focus:ring-1 focus:ring-clim-danger/70',
        selected ? 'bg-clim-panel border-clim-border text-clim-bright' : '',
        selectable || onSelect ? 'cursor-pointer text-clim-danger hover:bg-clim-panel/70 hover:border-clim-danger' : 'cursor-default',
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
      className={[
        'underline decoration-dotted mr-3 transition-colors focus:outline-none focus:ring-1 focus:ring-clim-danger/70',
        action.descriptor.requiresConfirmation ? 'text-clim-danger' : 'text-clim-bright',
        action.disabledReason ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-clim-panel hover:text-clim-danger',
      ].join(' ')}
      data-action-id={action.descriptor.id}
    >
      {action.commandLabel ?? action.descriptor.label}
    </button>
  );
}

export function ActionHintBar({ actions, onInvoke }: { actions: ActionPresentation[]; onInvoke?: (action: ActionPresentation) => void }) {
  return (
    <div className="border-y border-clim-border py-2 my-3 text-sm">
      {actions.map((action) => <ActionPresentationInline key={`${action.commandLabel ?? action.descriptor.id}:${action.subject?.id ?? 'global'}`} action={action} onInvoke={() => onInvoke?.(action)} />)}
    </div>
  );
}

export function ConfirmPrompt({
  binding,
  onConfirm,
  onCancel,
}: {
  binding: CommandBinding;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!binding.confirmation) {
    return null;
  }
  return (
    <div className="border border-clim-danger bg-clim-panel p-3 text-sm" data-testid="confirm-prompt">
      <div className="text-clim-danger uppercase tracking-wide">Confirm</div>
      <div className="my-2 text-clim-bright">{binding.confirmation.prompt}</div>
      <button type="button" className="mr-3 cursor-pointer underline text-clim-danger hover:bg-clim-panel focus:outline-none focus:ring-1 focus:ring-clim-danger/70" onClick={onConfirm}>
        {binding.confirmation.confirmLabel}
      </button>
      <button type="button" className="cursor-pointer underline text-clim-bright hover:bg-clim-panel focus:outline-none focus:ring-1 focus:ring-clim-danger/70" onClick={onCancel}>
        {binding.confirmation.cancelLabel}
      </button>
    </div>
  );
}
