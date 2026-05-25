import type { CommandBinding } from '../../types';

export interface PbuiConfirmPromptProps {
  binding: CommandBinding;
  className?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
