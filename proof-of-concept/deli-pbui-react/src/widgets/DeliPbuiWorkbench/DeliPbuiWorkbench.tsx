import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { store } from '../../app/store';
import type { AppStore } from '../../app/store';
import {
  actionAcceptsRef,
  actionPresentationsForSpecs,
  canFillRefArg,
  canFillValueArg,
  nextOpenArg,
} from '../../generic/clim/actionEngine';
import { formatActionSliceStatus } from '../../generic/clim/actionStatus';
import { parseCommandLine } from '../../generic/clim/commandParser';
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiConfirmPrompt } from '../../generic/clim/components/PbuiConfirmPrompt';
import { PbuiShell } from '../../generic/clim/components/PbuiShell';
import { pbuiSessionActions } from '../../generic/clim/pbuiSessionSlice';
import { backOrFallback, listenToRouteChanges, pushRoute, replaceRoute } from '../../generic/clim/routing';
import type { ActionPresentation, ActionRequest, ActionSpec, ClimSessionState, PresentationRef } from '../../generic/clim/types';
import { deliActions, deliActionsForView } from '../../domain/deli/actions';
import type { DeliActionRuntimeContext } from '../../domain/deli/actions';
import { useGetMenuQuery } from '../../domain/deli/deliApi';
import { deliWorkbenchActions } from '../../domain/deli/deliWorkbenchSlice';
import { cartPresentation, draftPresentation, menuItemPresentation, rehydrateDeliPresentationRef } from '../../domain/deli/pbuiPresentations';
import { deliRouteCodec, initialDeliRouteSnapshot, routeForDeliView } from '../../domain/deli/pbuiRouting';
import { deliViewModels } from '../../domain/deli/viewModels';
import type { DeliCartItem, DeliCommandId, DeliViewId } from '../../domain/deli/types';
import { DeliCartView } from './parts/DeliCartView';
import { DeliDetailView } from './parts/DeliDetailView';
import { DeliHelpView } from './parts/DeliHelpView';
import { DeliMenuView } from './parts/DeliMenuView';
import { DeliTrackerView } from './parts/DeliTrackerView';
import { DeliViewHeader } from './parts/DeliViewHeader';
import type { DeliPbuiWorkbenchProps } from './types';

export function DeliPbuiWorkbench({
  initialView = 'menu',
  initialSelectedItemId,
  initialCart = false,
}: DeliPbuiWorkbenchProps) {
  const { data: menu = [] } = useGetMenuQuery();
  const routeInitial = initialDeliRouteSnapshot(initialView, initialSelectedItemId);
  const initialItemId = routeInitial.params?.itemId ?? initialSelectedItemId ?? menu[0]?.id;
  const session = useAppSelector((state) => state.pbuiSession);
  const { viewId, selectedItemId, removedIngredientIds, cartItems } = useAppSelector((state) => state.deliWorkbench);
  const dispatch = useAppDispatch();

  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selectedMenuPresentation = selectedItem ? menuItemPresentation(selectedItem) : undefined;
  const currentSessionSelected = rehydrateDeliPresentationRef(session.selectedRef, menu, removedIngredientIds);
  const activeSelected = currentSessionSelected ?? selectedMenuPresentation;
  const draft = draftPresentation(selectedItem);
  const cart = cartPresentation(cartItems);
  const view = deliViewModels[viewId];
  const visibleActions = deliActionsForView(view.id);
  const pendingAction = session.pendingActionId ? deliActions[session.pendingActionId as DeliCommandId] : undefined;
  const mode = session.mode;
  const state: ClimSessionState = {
    mode,
    modeLabel: mode === 'confirm' ? 'CONFIRM' : mode === 'select' ? 'SELECT' : view.modeLabel,
    selected: activeSelected,
    pendingAction,
    commandBuffer: session.commandBuffer,
    resultLine: session.resultLine,
    actionStatusLine: formatActionSliceStatus({ selectedActionId: session.pendingActionId, filledArgs: session.filledArgs }),
  };

  useEffect(() => {
    dispatch(deliWorkbenchActions.resetWorkbench({ viewId: routeInitial.view, selectedItemId: initialItemId }));
    dispatch(pbuiSessionActions.resetSession({
      commandBuffer: `LIST ${deliViewModels[routeInitial.view].modeLabel}`,
      resultLine: 'Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.',
    }));
    if (window.location.pathname === '/') {
      replaceRoute(deliRouteCodec, routeForDeliView(routeInitial.view, initialItemId));
    }
    return listenToRouteChanges(deliRouteCodec, (snapshot) => {
      dispatch(deliWorkbenchActions.setViewId(snapshot.view));
      if (snapshot.params?.itemId) {
        dispatch(deliWorkbenchActions.setSelectedItemId(snapshot.params.itemId));
      }
      dispatch(pbuiSessionActions.routeChanged({ commandBuffer: `LIST ${deliViewModels[snapshot.view].modeLabel}` }));
    });
  }, []);

  useEffect(() => {
    if (initialCart && selectedItem && cartItems.length === 0) {
      dispatch(deliWorkbenchActions.seedCartItemIfEmpty({
        id: `cart.${selectedItem.id}`,
        item: selectedItem,
        removedIngredientIds: [],
        substitutions: {},
      }));
    }
  }, [initialCart, selectedItem, cartItems.length, dispatch]);

  function navigateToView(nextView: DeliViewId, params: { itemId?: string } = {}) {
    if (params.itemId) {
      dispatch(deliWorkbenchActions.setSelectedItemId(params.itemId));
    }
    dispatch(deliWorkbenchActions.setViewId(nextView));
    pushRoute(deliRouteCodec, routeForDeliView(nextView, params.itemId ?? selectedItemId));
  }

  function navigateBack() {
    backOrFallback(deliRouteCodec, { view: 'menu' });
  }

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

  function renderView() {
    if (viewId === 'detail') {
      return (
        <DeliDetailView
          selectedItem={selectedItem}
          draft={draft}
          removedIngredientIds={removedIngredientIds}
          activeSelected={activeSelected}
          pendingAction={pendingAction}
          filledArgs={session.filledArgs}
          actionContext={actionContext()}
          onPresentationClick={handlePresentationClick}
          selectMode={session.mode === 'select'}
        />
      );
    }

    if (viewId === 'cart') {
      return <DeliCartView cart={cart} cartItems={cartItems} />;
    }

    if (viewId === 'help') {
      return <DeliHelpView actions={Object.values(deliActions)} />;
    }

    if (viewId === 'tracker') {
      return <DeliTrackerView />;
    }

    return (
      <DeliMenuView
        menu={menu}
        selectedItemId={selectedItemId}
        activeSelected={activeSelected}
        pendingAction={pendingAction}
        filledArgs={session.filledArgs}
        actionContext={actionContext()}
        onPresentationClick={handlePresentationClick}
        selectMode={session.mode === 'select'}
      />
    );
  }

  return (
    <PbuiShell
      state={state}
      commandValue={session.commandBuffer}
      onCommandChange={(value) => dispatch(pbuiSessionActions.setCommandBuffer(value))}
      onCommandSubmit={handleCommandSubmit}
      onCommandHistoryPrevious={() => dispatch(pbuiSessionActions.recallPreviousCommand())}
      onCommandHistoryNext={() => dispatch(pbuiSessionActions.recallNextCommand())}
      onCommandCancel={() => handleCommandSubmit('ESC')}
    >
      <section className="grid gap-3">
        <div className="py-2">
          <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
          <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
          <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
        </div>

        {renderView()}

        {pendingAction && session.mode === 'confirm' ? (
          <PbuiConfirmPrompt action={pendingAction} onConfirm={confirmPending} onCancel={cancelPending} />
        ) : null}

        <PbuiActionBar actions={actions} selectedCommandLabel={session.pendingActionId} onInvoke={handleInvoke} />
      </section>
    </PbuiShell>
  );
}

export function DeliPbuiWorkbenchWithProvider({ appStore = store, ...props }: DeliPbuiWorkbenchProps & { appStore?: AppStore }) {
  return (
    <Provider store={appStore}>
      <DeliPbuiWorkbench {...props} />
    </Provider>
  );
}
