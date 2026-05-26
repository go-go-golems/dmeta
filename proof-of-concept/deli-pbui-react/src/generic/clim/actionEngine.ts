import type { ActionArgSpec, ActionIntent, ActionPresentation, ActionSpec, PresentationRef, RefActionArgSpec, ValueActionArgSpec } from './types';

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

// --- Arg resolution ---

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

// --- Action lookup helpers ---

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

// --- Intent derivation ---

export function actionIntents(action: ActionSpec): ActionIntent[] {
  const intents: ActionIntent[] = [];
  if (action.requiresConfirmation) intents.push('dangerous', 'mutate');
  if (action.id.startsWith('FILTER-')) intents.push('filter');
  if (action.id === 'INSPECT' || action.id === 'DESCRIBE') intents.push('inspect');
  if (action.id === 'BACK' || action.id === 'MENU' || action.id === 'HELP') intents.push('navigate');
  if (action.args.length === 0 && !action.requiresConfirmation) intents.push('navigate');
  return intents.length > 0 ? intents : ['inspect'];
}

// --- Action presentation builder ---

export function actionToPresentation<TAction extends string = string>(
  action: ActionSpec<TAction>,
  target?: PresentationRef,
  context?: unknown,
): ActionPresentation<TAction> {
  const enabled = !target || action.args.length === 0 || actionAcceptsRef(action, target, context ?? {});
  const intents = actionIntents(action);

  return {
    action,
    commandLabel: action.label,
    disabledReason: enabled ? undefined : `Requires ${action.args.map((a) => a.kind === 'ref' ? a.objectType : a.valueType).join(' or ')}`,
    applicableToSelected: Boolean(target && enabled && action.args.length > 0),
    intents,
    requiresConfirmation: Boolean(action.requiresConfirmation),
  };
}

// --- Action presentation lists ---

export function actionPresentationsForSpecs<TAction extends string>({
  actions,
  availability,
}: {
  actions: ActionSpec<TAction>[];
  availability?: (action: ActionSpec<TAction>) => AvailabilityResult;
}): ActionPresentation<TAction>[] {
  return actions.map((action) => {
    const result = availability?.(action) ?? { enabled: true };
    const intents = actionIntents(action);
    return {
      action,
      commandLabel: action.label,
      disabledReason: result.enabled ? undefined : result.reason,
      intents,
      requiresConfirmation: Boolean(action.requiresConfirmation),
    };
  });
}

/** Get all action presentations compatible with a given presentation ref. */
export function compatibleActionPresentations<TAction extends string = string>(
  actions: ActionSpec<TAction>[],
  ref: PresentationRef,
  context: unknown,
): ActionPresentation<TAction>[] {
  return actions
    .filter((action) => action.args.length === 0 || actionAcceptsRef(action, ref, context))
    .map((action) => actionToPresentation(action, ref, context));
}

// --- Presentation visual state ---

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
