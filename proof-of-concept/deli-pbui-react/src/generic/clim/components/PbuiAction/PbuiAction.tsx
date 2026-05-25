import { PbuiClickableText } from '../PbuiClickableText';
import type { PbuiActionProps } from './types';

export function PbuiAction({ action, selected, className, onInvoke }: PbuiActionProps) {
  return (
    <PbuiClickableText
      tone={selected ? 'selectable' : action.action.requiresConfirmation ? 'danger' : 'normal'}
      disabled={Boolean(action.disabledReason)}
      onClick={onInvoke}
      className={className}
    >
      {action.commandLabel ?? action.action.label}
    </PbuiClickableText>
  );
}
