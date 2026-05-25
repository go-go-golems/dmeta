import type { ActionSpec } from '../../types';

export interface PbuiConfirmPromptProps {
  action: ActionSpec;
  className?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
