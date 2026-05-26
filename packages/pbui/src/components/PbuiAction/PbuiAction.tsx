import { PbuiClickableText } from '../PbuiClickableText';
import type { PbuiActionProps } from './types';

export function PbuiAction({ action, selected, className, onInvoke }: PbuiActionProps) {
  const isActionForSelection = selected || action.applicableToSelected || action.action.requiresConfirmation;
  return (
    <PbuiClickableText
      tone={isActionForSelection ? 'danger' : 'normal'}
      disabled={Boolean(action.disabledReason)}
      onClick={onInvoke}
      className={className}
    >
      {action.commandLabel ?? action.action.label}
    </PbuiClickableText>
  );
}
