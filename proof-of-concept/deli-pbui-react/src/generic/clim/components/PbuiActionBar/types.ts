import type { ActionPresentation } from '../../types';

export interface PbuiActionBarProps {
  actions: ActionPresentation[];
  selectedCommandLabel?: string;
  className?: string;
  onInvoke?: (action: ActionPresentation) => void;
}
