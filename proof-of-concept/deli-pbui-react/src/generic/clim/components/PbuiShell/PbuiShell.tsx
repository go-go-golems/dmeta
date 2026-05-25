import { PbuiCommandLine } from '../PbuiCommandLine';
import type { PbuiShellProps } from './types';

export function PbuiShell({
  state,
  children,
  commandValue,
  onCommandChange,
  onCommandSubmit,
  onCommandHistoryPrevious,
  onCommandHistoryNext,
  onCommandCancel,
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
        onChange={onCommandChange}
        onSubmit={onCommandSubmit}
        onHistoryPrevious={onCommandHistoryPrevious}
        onHistoryNext={onCommandHistoryNext}
        onCancel={onCommandCancel}
      />
    </div>
  );
}
