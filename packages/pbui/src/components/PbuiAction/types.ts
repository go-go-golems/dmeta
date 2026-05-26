import type { ActionPresentation } from '../../types';

export interface PbuiActionProps {
  action: ActionPresentation;
  selected?: boolean;
  className?: string;
  onInvoke?: () => void;
}
