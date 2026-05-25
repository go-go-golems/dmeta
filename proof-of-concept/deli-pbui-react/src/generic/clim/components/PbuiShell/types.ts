import type { ReactNode } from 'react';
import type { ClimSessionState } from '../../types';

export interface PbuiShellProps {
  state: ClimSessionState;
  children: ReactNode;
  commandValue?: string;
  onCommandChange?: (value: string) => void;
  onCommandSubmit?: (value: string) => void;
}
