import type { ActionPresentation } from '../../types';

export interface PbuiActionProps {
  action: ActionPresentation;
  className?: string;
  onInvoke?: () => void;
}
