import type { ActionPresentation } from '../../types';

export interface PbuiActionBarProps {
  actions: ActionPresentation[];
  className?: string;
  onInvoke?: (action: ActionPresentation) => void;
}
