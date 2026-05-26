import type { CSSProperties } from 'react';
import type { PbuiClickableTextProps, PbuiClickableTone } from './types';

const clickableDecorationStyle: CSSProperties = {
  textDecorationLine: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationSkipInk: 'auto',
  textUnderlineOffset: '2.5px',
  textDecorationThickness: '1px',
};

const toneClasses: Record<PbuiClickableTone, string> = {
  normal: 'text-clim-bright decoration-clim-bright hover:text-clim-danger hover:decoration-clim-danger',
  selectable: 'text-clim-danger decoration-clim-danger hover:text-clim-bright hover:decoration-clim-bright',
  danger: 'text-clim-danger decoration-clim-danger hover:text-clim-bright hover:decoration-clim-bright',
  disabled: 'text-clim-muted decoration-clim-muted opacity-40 cursor-not-allowed',
};

export function PbuiClickableText({
  tone = 'normal',
  disabled,
  as = 'button',
  className,
  children,
  onClick,
}: PbuiClickableTextProps) {
  const effectiveTone = disabled ? 'disabled' : tone;
  const classes = [
    'inline bg-transparent p-0 text-left font-inherit transition-colors focus:outline-none focus:decoration-clim-danger',
    toneClasses[effectiveTone],
    disabled ? '' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ');

  if (as === 'span') {
    return (
      <span className={classes} style={clickableDecorationStyle}>
        {children}
      </span>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={classes} style={clickableDecorationStyle}>
      {children}
    </button>
  );
}

export { clickableDecorationStyle };
