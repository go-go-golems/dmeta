import type { ReactNode } from 'react';
export type PbuiClickableTone = 'normal' | 'selectable' | 'danger' | 'disabled';

export interface PbuiClickableTextProps {
  tone?: PbuiClickableTone;
  disabled?: boolean;
  as?: 'button' | 'span';
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}
