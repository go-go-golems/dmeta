import { useAppDispatch } from '../../../app/hooks';
import {
  actionAcceptsRef,
  actionIntents,
  actionPresentationsForSpecs,
  canFillRefArg,
  canFillValueArg,
  compatibleActionPresentations,
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
  session,
  view,
  navigateToView,
  navigateBack,
}: UseDeliActionControllerOptions) {
  const dispatch = useAppDispatch();
  const interaction = session.interaction;

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

  /** Actions compatible with the currently selected presentation (for hint bar and context menu). */
  const compatibleActions = activeSelected
    ? compatibleActionPresentations(visibleActions, activeSelected, actionContext())
    : [];

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
        action,
        filledArgs,
        resultLine: `Select ${nextArg.objectType} for ${action.label}.`,
        commandHint: `${action.label}: click a compatible presentation. ESC cancels.`,
      }));
      return;
    }
    if (nextArg?.kind === 'value') {
      dispatch(pbuiSessionActions.setResult(`Enter ${nextArg.valueType} for ${action.label}.`));
      dispatch(pbuiSessionActions.setCommandHint(`Enter value for ${nextArg.name}.`));
      return;
    }
    const request = actionRequest(action, filledArgs);
    if (action.requiresConfirmation) {
      dispatch(pbuiSessionActions.enterConfirm({
        action,
        request,
        filledArgs,
        resultLine: `Pending confirmation: ${action.id}`,
        commandHint: `Confirm ${action.id}? Type YES or ESC.`,
      }));
      return;
    }
    runAction(action, filledArgs);
    dispatch(pbuiSessionActions.setCommandHint('Select a presentation or type a command.'));
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

    if (interaction.kind === 'select') {
      const nextArg = nextOpenArg(interaction.action, interaction.filledArgs);
      if (!nextArg || nextArg.kind !== 'ref' || !canFillRefArg(nextArg, presentation, actionContext())) {
        dispatch(pbuiSessionActions.setResult(`${presentation.label} cannot fill the current action argument.`));
        return;
      }
      const filledArgs = { ...interaction.filledArgs, [nextArg.name]: presentation };
      dispatch(pbuiSessionActions.selectCompleted({
        selectedRef: presentation,
        filledArgs,
        commandBuffer: interaction.action.id,
        commandHint: 'Select a presentation or type a command.',
      }));
      continueAction(interaction.action as ActionSpec<DeliCommandId>, filledArgs);
      return;
    }

    if (interaction.kind === 'confirm') {
      return;
    }

    dispatch(pbuiSessionActions.selectRef({
      presentation,
      resultLine: `Selected ${presentation.label}.`,
      commandHint: `Selected <${presentation.type}> ${presentation.label}. Right-click for menu.`,
    }));
  }

  function handlePresentationContextMenu(presentation: PresentationRef, x: number, y: number) {
    const compatible = compatibleActionPresentations(visibleActions, presentation, actionContext());
    dispatch(pbuiSessionActions.showContextMenu({ x, y, ref: presentation, actions: compatible }));
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
    if (interaction.kind !== 'confirm') {
      return;
    }
    runAction(interaction.action as ActionSpec<DeliCommandId>, interaction.request.args);
    navigateToView('tracker');
    dispatch(pbuiSessionActions.confirmCompleted({
      commandBuffer: interaction.action.id,
      resultLine: `Confirmed action request: ${interaction.action.id}`,
      commandHint: 'Select a presentation or type a command.',
    }));
  }

  function cancelPending() {
    dispatch(pbuiSessionActions.confirmCancelled({
      resultLine: 'Cancelled pending action request.',
      commandHint: 'Select a presentation or type a command.',
    }));
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
      if (interaction.kind === 'confirm') {
        cancelPending();
        return;
      }
      if (interaction.kind === 'select') {
        dispatch(pbuiSessionActions.selectCancelled({
          resultLine: 'Cancelled target selection.',
          commandHint: 'Select a presentation or type a command.',
        }));
        return;
      }
      dispatch(pbuiSessionActions.setResult('Nothing to cancel.'));
      return;
    }

    if (parsed.kind === 'confirm') {
      if (interaction.kind === 'confirm') {
        confirmPending();
        return;
      }
      dispatch(pbuiSessionActions.setResult('Nothing pending confirmation.'));
      return;
    }

    if (parsed.kind === 'prefix') {
      dispatch(pbuiSessionActions.setResult(`${parsed.command}: ${parsed.value} — prefix commands not fully wired in this POC yet.`));
      dispatch(pbuiSessionActions.setCommandHint('Prefix commands are recognized but filtering is not yet implemented.'));
      return;
    }

    if (parsed.kind === 'missing-argument') {
      dispatch(pbuiSessionActions.setResult(`${parsed.command} requires an argument. Example: ${parsed.example}`));
      dispatch(pbuiSessionActions.setCommandHint(`Type ${parsed.example}.`));
      return;
    }

    if (parsed.kind === 'unknown') {
      dispatch(pbuiSessionActions.setResult(`Unknown command: ${parsed.command}. Type HELP.`));
      dispatch(pbuiSessionActions.setCommandHint('Type HELP for available commands.'));
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

  function handleContextMenuAction(actionPresentation: ActionPresentation) {
    dispatch(pbuiSessionActions.hideContextMenu());
    handleInvoke(actionPresentation);
  }

  return {
    actionContext: actionContext(),
    actions,
    compatibleActions,
    handleInvoke,
    handlePresentationClick,
    handlePresentationContextMenu,
    handleCommandSubmit,
    handleContextMenuAction,
    confirmPending,
    cancelPending,
  };
}
