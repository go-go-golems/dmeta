import { PbuiClickableText } from '../PbuiClickableText';
import { PbuiSectionLabel } from '../PbuiSectionLabel';
import type { PbuiConfirmPromptProps } from './types';

export function PbuiConfirmPrompt({ action, className, onConfirm, onCancel }: PbuiConfirmPromptProps) {
  if (!action.confirmation) {
    return null;
  }
  return (
    <div className={['py-3 text-sm', className].filter(Boolean).join(' ')} data-testid="confirm-prompt">
      <PbuiSectionLabel className="text-clim-danger">Confirm</PbuiSectionLabel>
      <div className="my-2 text-clim-bright">{action.confirmation.prompt}</div>
      <PbuiClickableText tone="danger" className="mr-3" onClick={onConfirm}>
        {action.confirmation.confirmLabel}
      </PbuiClickableText>
      <PbuiClickableText tone="normal" onClick={onCancel}>
        {action.confirmation.cancelLabel}
      </PbuiClickableText>
    </div>
  );
}
