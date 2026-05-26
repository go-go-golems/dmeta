import type { PbuiInteractionState, PresentationRef } from './types';

export function describeFilledArg(value: unknown): string {
  if (typeof value === 'object' && value !== null && 'type' in value && 'id' in value) {
    const ref = value as PresentationRef;
    return `<${ref.type}>#${ref.id}`;
  }
  return String(value);
}

export function formatFilledSlots(filledArgs: Record<string, unknown>): string {
  const entries = Object.entries(filledArgs);
  if (entries.length === 0) {
    return 'none';
  }
  return entries.map(([name, value]) => `${name}=${describeFilledArg(value)}`).join(', ');
}

export function formatInteractionStatus(interaction: PbuiInteractionState): string {
  switch (interaction.kind) {
    case 'normal':
      return 'ACTION SLICE idle';
    case 'select':
      return `ACTION SLICE mode=select action=${interaction.action.id} filled_slots=${formatFilledSlots(interaction.filledArgs)}`;
    case 'confirm':
      return `ACTION SLICE mode=confirm action=${interaction.action.id} request_actionId=${interaction.request.actionId}`;
  }
}

/** @deprecated Use formatInteractionStatus instead */
export function formatActionSliceStatus({
  selectedActionId,
  filledArgs,
}: {
  selectedActionId?: string;
  filledArgs: Record<string, unknown>;
}): string {
  return `ACTION SLICE selected_action=${selectedActionId ?? 'none'} filled_slots=${formatFilledSlots(filledArgs)}`;
}
