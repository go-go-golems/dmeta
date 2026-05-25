import type { ReactNode } from 'react';
export type PbuiTextTone = 'normal' | 'bright' | 'muted' | 'danger' | 'removed';

export interface PbuiTextProps {
  tone?: PbuiTextTone;
  className?: string;
  children: ReactNode;
}
