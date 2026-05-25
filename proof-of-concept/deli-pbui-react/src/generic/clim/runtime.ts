import type { ActionDescriptor, ActionRequest, CommandBinding, PresentationRef } from './types';

export interface CommandInputContext {
  selected?: PresentationRef;
  currentDraft?: PresentationRef;
  currentCart?: PresentationRef;
  selectedRemovedPart?: PresentationRef;
  commandArguments?: Record<string, string>;
}

export function buildActionRequestFromBinding<TCommand extends string, TAction extends string>(
  binding: CommandBinding<TCommand, TAction>,
  descriptor: ActionDescriptor<TAction>,
  context: CommandInputContext,
): ActionRequest<TAction> {
  const inputs: Record<string, unknown> = {};

  for (const [inputName, source] of Object.entries(binding.inputMapping)) {
    const value = resolveInputSource(source, context);
    if (value !== undefined) {
      inputs[inputName] = value;
    }
  }

  return {
    actionId: descriptor.id,
    subject: context.selected,
    inputs,
  };
}

export function resolveInputSource(source: string, context: CommandInputContext): unknown {
  if (source === 'selected_presentation') {
    return context.selected;
  }
  if (source === 'current_draft') {
    return context.currentDraft;
  }
  if (source === 'current_cart') {
    return context.currentCart;
  }
  if (source === 'selected_removed_part') {
    return context.selectedRemovedPart;
  }
  if (source.startsWith('command_argument:')) {
    const argumentName = source.slice('command_argument:'.length);
    return context.commandArguments?.[argumentName];
  }
  return undefined;
}

export function bindingUsesInputSource(binding: CommandBinding, source: string): boolean {
  return Object.values(binding.inputMapping).includes(source);
}

export function compatibleBindingsForPresentation<TCommand extends string, TAction extends string>(
  bindings: CommandBinding<TCommand, TAction>[],
  _presentation: PresentationRef,
  commandOrder: TCommand[] = [],
): CommandBinding<TCommand, TAction>[] {
  const order = new Map(commandOrder.map((commandID, index) => [commandID, index]));
  return bindings
    .filter((binding) => bindingUsesInputSource(binding, 'selected_presentation'))
    .sort((left, right) => (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER));
}

export function summarizeActionRequest<TAction extends string>(request: ActionRequest<TAction>): string {
  const inputNames = Object.keys(request.inputs);
  const inputSummary = inputNames.length > 0 ? inputNames.join(', ') : 'no inputs';
  return `${request.actionId}(${inputSummary})`;
}
