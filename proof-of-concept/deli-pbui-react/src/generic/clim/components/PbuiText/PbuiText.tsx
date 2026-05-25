import type { PbuiTextProps, PbuiTextTone } from './types';

const toneClasses: Record<PbuiTextTone, string> = {
  normal: 'text-clim-fg',
  bright: 'text-clim-bright',
  muted: 'text-clim-muted',
  danger: 'text-clim-danger',
  removed: 'text-clim-muted opacity-35 line-through',
};

export function PbuiText({ tone = 'normal', className, children }: PbuiTextProps) {
  return <span className={[toneClasses[tone], className].filter(Boolean).join(' ')}>{children}</span>;
}
