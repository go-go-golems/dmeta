import { PbuiClickableText } from '../PbuiClickableText';
import { PbuiSectionLabel } from '../PbuiSectionLabel';
import type { PbuiConfirmPromptProps } from './types';

export function PbuiConfirmPrompt({ binding, className, onConfirm, onCancel }: PbuiConfirmPromptProps) {
  if (!binding.confirmation) {
    return null;
  }
  return (
    <div className={['py-3 text-sm', className].filter(Boolean).join(' ')} data-testid="confirm-prompt">
      <PbuiSectionLabel className="text-clim-danger">Confirm</PbuiSectionLabel>
      <div className="my-2 text-clim-bright">{binding.confirmation.prompt}</div>
      <PbuiClickableText tone="danger" className="mr-3" onClick={onConfirm}>
        {binding.confirmation.confirmLabel}
      </PbuiClickableText>
      <PbuiClickableText tone="normal" onClick={onCancel}>
        {binding.confirmation.cancelLabel}
      </PbuiClickableText>
    </div>
  );
}
