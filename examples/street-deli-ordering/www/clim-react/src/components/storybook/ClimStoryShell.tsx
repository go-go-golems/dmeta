import type { ReactNode } from 'react';

export interface ClimStoryShellProps {
  mode?: 'normal' | 'select' | 'confirm';
  modeLabel?: string;
  children: ReactNode;
}

export function ClimStoryShell({ mode = 'normal', modeLabel = 'MENU', children }: ClimStoryShellProps) {
  return (
    <div className="clim-shell" data-mode={mode}>
      <header className="header">
        <div className="brand">HUDSON STREET DELI</div>
        <div className="mode">{modeLabel}</div>
      </header>
      <main className="main">{children}</main>
      <footer className="command-line">
        <div className="cmd-input-area"><span className="prompt">:</span><span className="cmd-buffer"></span><span className="cmd-cursor">█</span></div>
        <div className="cmd-hint">Storybook fixture mode</div>
      </footer>
    </div>
  );
}
