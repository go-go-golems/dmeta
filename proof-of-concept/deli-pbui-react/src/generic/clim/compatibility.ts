import type { ActionPresentation, CommandBinding, PresentationRef } from './types';
import type {
  ActionDerivationContext,
  AvailabilityResult,
  CompatiblePresentationContext,
  PresentationVisualState,
} from './engineTypes';

const enabled: AvailabilityResult = { enabled: true };

export function bindingUsesInputSource(binding: CommandBinding, source: string): boolean {
  return Object.values(binding.inputMapping).includes(source);
}

export function sortBindingsByCommandOrder<TCommand extends string, TAction extends string>(
  bindings: CommandBinding<TCommand, TAction>[],
  commandOrder: TCommand[] = [],
): CommandBinding<TCommand, TAction>[] {
  const order = new Map(commandOrder.map((commandID, index) => [commandID, index]));
  return [...bindings].sort(
    (left, right) => (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function compatibleBindingsForPresentation<TCommand extends string, TAction extends string>({
  bindings,
  presentation,
  defaultActionOrder = [],
  canUsePresentation,
}: CompatiblePresentationContext<TCommand, TAction>): CommandBinding<TCommand, TAction>[] {
  return sortBindingsByCommandOrder(
    bindings.filter((binding) => {
      if (!bindingUsesInputSource(binding, 'selected_presentation')) {
        return false;
      }
      return canUsePresentation?.(binding, presentation) ?? true;
    }),
    defaultActionOrder,
  );
}

export function actionPresentationForBinding<TCommand extends string, TAction extends string>(
  binding: CommandBinding<TCommand, TAction>,
  actions: Record<TAction, ActionPresentation<TAction>['descriptor']>,
  subject?: PresentationRef,
  availability: AvailabilityResult = enabled,
): ActionPresentation<TAction> {
  return {
    descriptor: actions[binding.actionId],
    commandLabel: binding.label,
    disabledReason: availability.enabled ? undefined : availability.reason,
    subject,
  };
}

export function actionPresentationsForBindings<TCommand extends string, TAction extends string>({
  bindings,
  actions,
  selected,
  defaultActionOrder = [],
  availability,
}: ActionDerivationContext<TCommand, TAction>): ActionPresentation<TAction>[] {
  const byID = new Map(bindings.map((binding) => [binding.id, binding]));
  const orderedBindings = defaultActionOrder.length > 0
    ? defaultActionOrder.flatMap((commandID) => byID.get(commandID) ? [byID.get(commandID)!] : [])
    : sortBindingsByCommandOrder(bindings, defaultActionOrder);

  return orderedBindings.map((binding) => {
    const subject = bindingUsesInputSource(binding, 'selected_presentation') ? selected : undefined;
    return actionPresentationForBinding(binding, actions, subject, availability?.(binding) ?? enabled);
  });
}

export function presentationVisualState<TCommand extends string, TAction extends string>({
  presentation,
  selected,
  compatibleBindings,
  removed = false,
  disabled = false,
}: {
  presentation: PresentationRef;
  selected?: PresentationRef;
  compatibleBindings: CommandBinding<TCommand, TAction>[];
  removed?: boolean;
  disabled?: boolean;
}): PresentationVisualState {
  const selectable = compatibleBindings.length > 0 && !disabled;
  return {
    selected: selected?.id === presentation.id,
    selectable,
    disabled,
    removed,
    dangerousTarget: selectable && compatibleBindings.some((binding) => binding.requiresConfirmation),
  };
}
