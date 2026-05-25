import type { ActionArgSpec, ActionPresentation, ActionSpec, PresentationRef, RefActionArgSpec, ValueActionArgSpec } from './types';

export interface AvailabilityResult {
  enabled: boolean;
  reason?: string;
}

export interface PresentationVisualState {
  selected: boolean;
  selectable: boolean;
  disabled: boolean;
  removed: boolean;
  dangerousTarget: boolean;
}

export function nextOpenArg(action: ActionSpec, filledArgs: Record<string, unknown>): ActionArgSpec | undefined {
  return action.args.find((arg) => arg.required !== false && filledArgs[arg.name] === undefined);
}

export function canFillRefArg(arg: RefActionArgSpec, ref: PresentationRef, context: unknown): boolean {
  return (arg.objectType === 'Any' || ref.type === arg.objectType) && (arg.accepts?.(ref, context) ?? true);
}

export function canFillValueArg(arg: ValueActionArgSpec, value: unknown, context: unknown): boolean {
  return arg.accepts?.(value, context) ?? true;
}

export function actionAcceptsRef(action: ActionSpec, ref: PresentationRef, context: unknown, filledArgs: Record<string, unknown> = {}) {
  const arg = nextOpenArg(action, filledArgs);
  return arg?.kind === 'ref' ? canFillRefArg(arg, ref, context) : false;
}

export function actionsForView<TAction extends string>(actions: Record<TAction, ActionSpec<TAction>>, viewId: string): ActionSpec<TAction>[] {
  return (Object.values(actions) as ActionSpec<TAction>[]).filter((action) => action.views.includes(viewId));
}

export function actionsForRef<TAction extends string>(
  actions: ActionSpec<TAction>[],
  ref: PresentationRef,
  context: unknown,
): ActionSpec<TAction>[] {
  return actions.filter((action) => actionAcceptsRef(action, ref, context));
}

export function actionPresentationsForSpecs<TAction extends string>({
  actions,
  availability,
}: {
  actions: ActionSpec<TAction>[];
  availability?: (action: ActionSpec<TAction>) => AvailabilityResult;
}): ActionPresentation<TAction>[] {
  return actions.map((action) => {
    const result = availability?.(action) ?? { enabled: true };
    return {
      action,
      commandLabel: action.label,
      disabledReason: result.enabled ? undefined : result.reason,
    };
  });
}

export function presentationVisualState({
  presentation,
  selected,
  selectedAction,
  filledArgs = {},
  context,
  removed = false,
  disabled = false,
}: {
  presentation: PresentationRef;
  selected?: PresentationRef;
  selectedAction?: ActionSpec;
  filledArgs?: Record<string, unknown>;
  context: unknown;
  removed?: boolean;
  disabled?: boolean;
}): PresentationVisualState {
  const selectable = Boolean(selectedAction && actionAcceptsRef(selectedAction, presentation, context, filledArgs) && !disabled);
  return {
    selected: selected?.id === presentation.id,
    selectable,
    disabled,
    removed,
    dangerousTarget: selectable && Boolean(selectedAction?.requiresConfirmation),
  };
}
