import { PbuiCommandLine } from '../PbuiCommandLine';
import { PbuiConfirmModal } from '../PbuiConfirmModal';
import { PbuiContextMenu } from '../PbuiContextMenu';
import type { PbuiShellProps } from './types';

export function PbuiShell({
  state,
  children,
  commandValue,
  contextMenu,
  confirmAction,
  onCommandChange,
  onCommandSubmit,
  onCommandHistoryPrevious,
  onCommandHistoryNext,
  onCommandCancel,
  onContextMenuAction,
  onContextMenuDismiss,
  onConfirm,
  onCancelConfirm,
}: PbuiShellProps) {
  const value = commandValue ?? state.commandBuffer;
  return (
    <div className="min-h-screen bg-clim-bg text-clim-fg grid grid-rows-[auto_1fr_auto]">
      <header className="flex items-center justify-between border-b border-clim-border px-3 py-2 text-sm">
        <strong className="text-clim-bright tracking-wide">HUDSON STREET DELI</strong>
        <span className="text-clim-bright">{state.modeLabel}</span>
      </header>
      <main className="p-3">{children}</main>
      <PbuiCommandLine
        value={value}
        result={state.resultLine}
        hint={state.commandHint}
        onChange={onCommandChange}
        onSubmit={onCommandSubmit}
        onHistoryPrevious={onCommandHistoryPrevious}
        onHistoryNext={onCommandHistoryNext}
        onCancel={onCommandCancel}
      />

      {contextMenu?.visible ? (
        <PbuiContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          ref={contextMenu.ref}
          actions={contextMenu.actions}
          onAction={onContextMenuAction ?? (() => {})}
          onDismiss={onContextMenuDismiss ?? (() => {})}
        />
      ) : null}

      {confirmAction?.action && state.mode === 'confirm' ? (
        <PbuiConfirmModal
          action={confirmAction.action}
          ref={confirmAction.ref}
          onConfirm={onConfirm ?? (() => {})}
          onCancel={onCancelConfirm ?? (() => {})}
        />
      ) : null}
    </div>
  );
}
