import type { ReactNode } from 'react';
import { ClimHeader } from './ClimHeader';

export interface ClimShellProps { mode?: 'normal' | 'select' | 'confirm'; modeLabel?: string; children?: ReactNode; }
export function ClimShell({ mode = 'normal', modeLabel = 'MENU', children }: ClimShellProps) {
  return <div className="clim-shell" data-mode={mode}><ClimHeader modeLabel={modeLabel} /><main className="main">{children}</main><footer className="command-line"><div><span className="prompt">:</span><span className="cmd-buffer"></span><span className="cmd-cursor">█</span></div><div className="cmd-hint">Type HELP for commands.</div></footer></div>;
}
