import { useAppDispatch } from '../../../app/hooks';
import {
  actionAcceptsRef,
  actionPresentationsForSpecs,
  canFillRefArg,
  canFillValueArg,
  nextOpenArg,
} from '../../../generic/clim/actionEngine';
import { parseCommandLine } from '../../../generic/clim/commandParser';
import { pbuiSessionActions } from '../../../generic/clim/pbuiSessionSlice';
import type { ActionPresentation, ActionRequest, ActionSpec, PresentationRef } from '../../../generic/clim/types';
import { deliActions } from '../../../domain/deli/actions';
import type { DeliActionRuntimeContext } from '../../../domain/deli/actions';
import { deliWorkbenchActions } from '../../../domain/deli/deliWorkbenchSlice';
import type { PbuiSessionState } from '../../../generic/clim/pbuiSessionSlice';
import type { DeliCartItem, DeliCommandId, DeliViewId, MenuItem } from '../../../domain/deli/types';
import type { DeliViewModelDefinition } from '../../../domain/deli/viewModels';

export interface UseDeliActionControllerOptions {
  menu: MenuItem[];
  selectedItem?: MenuItem;
  selectedItemId?: string;
  removedIngredientIds: string[];
  cartItems: DeliCartItem[];
  activeSelected?: PresentationRef;
  visibleActions: ActionSpec<DeliCommandId>[];
  pendingAction?: ActionSpec<DeliCommandId>;
  session: PbuiSessionState;
  view: DeliViewModelDefinition;
  navigateToView: (view: DeliViewId, params?: { itemId?: string }) => void;
  navigateBack: () => void;
}

export function useDeliActionController({
  menu,
  selectedItem,
  selectedItemId,
  removedIngredientIds,
  cartItems,
  activeSelected,
  visibleActions,
  pendingAction,
  session,
  view,
  navigateToView,
  navigateBack,
}: UseDeliActionControllerOptions) {
  const dispatch = useAppDispatch();

  function actionContext(): DeliActionRuntimeContext {
    return {
      selectedItem,
      selectedItemId,
      removedIngredientIds,
      cartItems,
      selectItem: (id) => dispatch(deliWorkbenchActions.setSelectedItemId(id)),
      isRemovableIngredient: (id) => menu.some((item) => item.ingredients.some((ingredient) => ingredient.id === id && ingredient.removable)),
      removeIngredient: (id) => dispatch(deliWorkbenchActions.removeIngredient(id)),
      addCartItem: (item) => dispatch(deliWorkbenchActions.addCartItem(item)),
      navigateToView,
      navigateBack,
    };
  }

  function availabilityForAction(action: ActionSpec<DeliCommandId>) {
    if (action.id === 'PLACE-ORDER' && cartItems.length === 0) {
      return { enabled: false, reason: 'Cart is empty.' };
    }
    return { enabled: true };
  }

  const actions = actionPresentationsForSpecs({
    actions: visibleActions,
    availability: availabilityForAction,
  }).map((actionPresentation) => ({
    ...actionPresentation,
    applicableToSelected: Boolean(
      activeSelected
      && !actionPresentation.disabledReason
      && actionAcceptsRef(actionPresentation.action, activeSelected, actionContext()),
    ),
  }));

  function runAction(action: ActionSpec<DeliCommandId>, filledArgs: Record<string, unknown>) {
    const result = action.run(filledArgs, actionContext());
    dispatch(pbuiSessionActions.setResult(result?.message ?? `${action.label} complete.`));
  }

  function actionRequest(action: ActionSpec<DeliCommandId>, filledArgs: Record<string, unknown>): ActionRequest<DeliCommandId> {
    return { actionId: action.id, args: filledArgs };
  }

  function continueAction(action: ActionSpec<DeliCommandId>, filledArgs: Record<string, unknown>) {
    const nextArg = nextOpenArg(action, filledArgs);
    if (nextArg?.kind === 'ref') {
      dispatch(pbuiSessionActions.enterSelect({
        actionId: action.id,
        filledArgs,
        resultLine: `Select ${nextArg.objectType} for ${action.label}.`,
      }));
      return;
    }
    if (nextArg?.kind === 'value') {
      dispatch(pbuiSessionActions.setResult(`Enter ${nextArg.valueType} for ${action.label}.`));
      return;
    }
    const request = actionRequest(action, filledArgs);
    if (action.requiresConfirmation) {
      dispatch(pbuiSessionActions.enterConfirm({
        actionId: action.id,
        request,
        filledArgs,
        resultLine: `Pending confirmation: ${action.id}`,
      }));
      return;
    }
    runAction(action, filledArgs);
  }

  function startAction(action: ActionSpec<DeliCommandId>, initialArgs: Record<string, unknown> = {}) {
    const availability = availabilityForAction(action);
    if (!availability.enabled) {
      dispatch(pbuiSessionActions.setResult(availability.reason));
      return;
    }
    const filledArgs = { ...initialArgs };
    const nextArg = nextOpenArg(action, filledArgs);
    if (nextArg?.kind === 'ref' && activeSelected && canFillRefArg(nextArg, activeSelected, actionContext())) {
      filledArgs[nextArg.name] = activeSelected;
    }
    continueAction(action, filledArgs);
  }

  function handleInvoke(actionPresentation: ActionPresentation) {
    if (actionPresentation.disabledReason) {
      dispatch(pbuiSessionActions.setResult(actionPresentation.disabledReason));
      return;
    }
    startAction(actionPresentation.action as ActionSpec<DeliCommandId>);
  }

  function handlePresentationClick(presentation: PresentationRef) {
    if (presentation.type === 'MenuItem') {
      dispatch(deliWorkbenchActions.setSelectedItemId(presentation.id));
    }

    if (session.mode === 'select' && pendingAction) {
      const nextArg = nextOpenArg(pendingAction, session.filledArgs);
      if (!nextArg || nextArg.kind !== 'ref' || !canFillRefArg(nextArg, presentation, actionContext())) {
        dispatch(pbuiSessionActions.setResult(`${presentation.label} cannot fill the current action argument.`));
        return;
      }
      const filledArgs = { ...session.filledArgs, [nextArg.name]: presentation };
      dispatch(pbuiSessionActions.selectCompleted({ selectedRef: presentation, filledArgs, commandBuffer: pendingAction.id }));
      continueAction(pendingAction, filledArgs);
      return;
    }

    dispatch(pbuiSessionActions.selectRef({ presentation, resultLine: `Selected ${presentation.label}.` }));
  }

  function valueArgsFromRepl(action: ActionSpec<DeliCommandId>, args: string[]) {
    const filledArgs: Record<string, unknown> = {};
    const valueArg = action.args.find((arg) => arg.kind === 'value');
    if (valueArg && args.length > 0) {
      const value = args.join(' ');
      if (canFillValueArg(valueArg, value, actionContext())) {
        filledArgs[valueArg.name] = value;
      }
    }
    return filledArgs;
  }

  function confirmPending() {
    if (!pendingAction || !session.pendingRequest) {
      return;
    }
    runAction(pendingAction, session.pendingRequest.args);
    navigateToView('tracker');
    dispatch(pbuiSessionActions.confirmCompleted({
      commandBuffer: pendingAction.id,
      resultLine: `Confirmed action request: ${pendingAction.id}`,
    }));
  }

  function cancelPending() {
    dispatch(pbuiSessionActions.confirmCancelled({ resultLine: 'Cancelled pending action request.' }));
  }

  function handleCommandSubmit(value: string) {
    dispatch(pbuiSessionActions.setCommandBuffer(value));
    dispatch(pbuiSessionActions.pushCommandHistory(value));
    const parsed = parseCommandLine(value, Object.keys(deliActions) as DeliCommandId[]);

    if (parsed.kind === 'empty') {
      dispatch(pbuiSessionActions.setResult('Type a command such as CUSTOMIZE, CART, HELP, YES, or CANCEL.'));
      return;
    }

    if (parsed.kind === 'cancel') {
      if (session.mode === 'confirm') {
        cancelPending();
        return;
      }
      if (session.mode === 'select') {
        dispatch(pbuiSessionActions.selectCancelled({ resultLine: 'Cancelled target selection.' }));
        return;
      }
      dispatch(pbuiSessionActions.setResult('Nothing to cancel.'));
      return;
    }

    if (parsed.kind === 'confirm') {
      if (session.mode === 'confirm') {
        confirmPending();
        return;
      }
      dispatch(pbuiSessionActions.setResult('Nothing pending confirmation.'));
      return;
    }

    if (parsed.kind === 'unknown') {
      dispatch(pbuiSessionActions.setResult(`Unknown command: ${parsed.command}. Type HELP.`));
      return;
    }

    const action = visibleActions.find((candidate) => candidate.id === parsed.commandId);
    if (!action) {
      const globalAction = deliActions[parsed.commandId];
      const views = globalAction?.views.join(', ') ?? 'another view';
      dispatch(pbuiSessionActions.setResult(`${parsed.commandId} is not available in ${view.modeLabel}. Available in: ${views}.`));
      return;
    }

    startAction(action, valueArgsFromRepl(action, parsed.args));
  }

  return {
    actionContext: actionContext(),
    actions,
    handleInvoke,
    handlePresentationClick,
    handleCommandSubmit,
    confirmPending,
    cancelPending,
  };
}
