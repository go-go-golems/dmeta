import { clickableDecorationStyle } from '../PbuiClickableText';
import type { PbuiCommandLineProps } from './types';

export function PbuiCommandLine({ value, result, className, onChange, onSubmit }: PbuiCommandLineProps) {
  return (
    <footer className={['border-t border-clim-border px-3 py-2 text-sm', className].filter(Boolean).join(' ')}>
      <form
        className="flex items-center gap-1"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(value);
        }}
      >
        <label className="text-clim-bright" htmlFor="clim-command-line">:</label>
        <input
          id="clim-command-line"
          aria-label="Action command"
          className="min-w-0 flex-1 bg-transparent text-clim-bright outline-none caret-clim-danger focus:decoration-clim-danger"
          style={clickableDecorationStyle}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          spellCheck={false}
        />
        <span className="text-clim-bright">█</span>
      </form>
      <div className="text-clim-muted">{result ?? 'Select a presentation or type a command.'}</div>
    </footer>
  );
}
