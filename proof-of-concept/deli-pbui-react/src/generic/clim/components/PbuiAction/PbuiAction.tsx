import { PbuiClickableText } from '../PbuiClickableText';
import type { PbuiActionProps } from './types';

export function PbuiAction({ action, className, onInvoke }: PbuiActionProps) {
  return (
    <PbuiClickableText
      tone={action.descriptor.requiresConfirmation ? 'danger' : 'normal'}
      disabled={Boolean(action.disabledReason)}
      onClick={onInvoke}
      className={className}
    >
      {action.commandLabel ?? action.descriptor.label}
    </PbuiClickableText>
  );
}
