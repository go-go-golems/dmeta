import type { PbuiSectionLabelProps } from './types';

export function PbuiSectionLabel({ children, className }: PbuiSectionLabelProps) {
  return (
    <div className={['text-clim-muted text-xs uppercase tracking-wide', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
