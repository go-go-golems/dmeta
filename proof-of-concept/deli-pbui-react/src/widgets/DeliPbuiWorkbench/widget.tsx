import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { store } from '../../app/store';
import type { AppStore } from '../../app/store';
import {
  actionPresentationsForSpecs,
  canFillRefArg,
  canFillValueArg,
  nextOpenArg,
  presentationVisualState,
} from '../../generic/clim/actionEngine';
import { parseCommandLine } from '../../generic/clim/commandParser';
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiConfirmPrompt } from '../../generic/clim/components/PbuiConfirmPrompt';
import { PbuiPresentationRef } from '../../generic/clim/components/PbuiPresentationRef';
import { PbuiShell } from '../../generic/clim/components/PbuiShell';
import { pbuiSessionActions } from '../../generic/clim/pbuiSessionSlice';
import { backOrFallback, currentRoute, listenToRouteChanges, pushRoute, replaceRoute } from '../../generic/clim/routing';
import type { RouteCodec, RouteSnapshot } from '../../generic/clim/routing';
import type { ActionPresentation, ActionRequest, ActionSpec, ClimSessionState, PresentationRef } from '../../generic/clim/types';
import { deliActions, deliActionsForView } from '../../domain/deli/actions';
import type { DeliActionRuntimeContext } from '../../domain/deli/actions';
import { useGetMenuQuery } from '../../domain/deli/deliApi';
import { deliWorkbenchActions } from '../../domain/deli/deliWorkbenchSlice';
import { deliViewModels } from '../../domain/deli/viewModels';
import type { DeliCartItem, DeliCommandId, DeliViewId, Ingredient, MenuItem } from '../../domain/deli/types';

export interface DeliPbuiWorkbenchProps {
  initialView?: DeliViewId;
  initialSelectedItemId?: string;
  initialCart?: boolean;
}

function menuItemPresentation(item: MenuItem): PresentationRef<'MenuItem'> {
  return {
    type: 'MenuItem',
    id: item.id,
    label: `${item.name} $${item.price.toFixed(2)}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
  };
}

function ingredientPresentation(ingredient: Ingredient, removed: boolean): PresentationRef<'Ingredient'> {
  return {
    type: 'Ingredient',
    id: ingredient.id,
    label: `${ingredient.name} [${ingredient.role}]${removed ? ' (removed)' : ''}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ingredient.removable ? ['labelable', 'removable'] : ['labelable'],
    metadata: { role: ingredient.role, removable: ingredient.removable ? 'yes' : 'no', removed: removed ? 'yes' : 'no' },
  };
}

function cartPresentation(cartItems: DeliCartItem[]): PresentationRef<'Order'> {
  return {
    type: 'Order',
    id: 'cart.current',
    label: `${cartItems.length} item${cartItems.length === 1 ? '' : 's'} / $${cartItems.reduce((sum, item) => sum + item.item.price, 0).toFixed(2)}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ['stateful', 'submittable'],
    metadata: { items: cartItems.length },
  };
}

function draftPresentation(item: MenuItem | undefined): PresentationRef<'OrderItem'> | undefined {
  if (!item) {
    return undefined;
  }
  return {
    type: 'OrderItem',
    id: `draft.${item.id}`,
    label: `Draft ${item.name}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ['composable', 'substitutable'],
    metadata: { source: item.id },
  };
}

const deliRouteCodec: RouteCodec<DeliViewId> = {
  parse(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    const [view, firstParam] = parts;
    switch (view) {
      case 'detail':
        return { view: 'detail', params: { itemId: firstParam ? decodeURIComponent(firstParam) : undefined } };
      case 'substitution':
        return { view: 'substitution', params: { draftId: firstParam ? decodeURIComponent(firstParam) : undefined } };
      case 'cart':
      case 'help':
      case 'tracker':
      case 'menu':
        return { view };
      default:
        return { view: 'menu' };
    }
  },
  format(snapshot) {
    switch (snapshot.view) {
      case 'detail':
        return `/detail/${encodeURIComponent(snapshot.params?.itemId ?? '')}`;
      case 'substitution':
        return `/substitution/${encodeURIComponent(snapshot.params?.draftId ?? '')}`;
      case 'cart':
        return '/cart';
      case 'help':
        return '/help';
      case 'tracker':
        return '/tracker/current';
      case 'menu':
      default:
        return '/menu';
    }
  },
};

function routeForView(view: DeliViewId, selectedItemId?: string): RouteSnapshot<DeliViewId> {
  if (view === 'detail') {
    return { view, params: { itemId: selectedItemId } };
  }
  return { view };
}

function initialRouteSnapshot(fallbackView: DeliViewId, fallbackItemId?: string): RouteSnapshot<DeliViewId> {
  if (typeof window === 'undefined') {
    return routeForView(fallbackView, fallbackItemId);
  }
  const [firstSegment] = window.location.pathname.split('/').filter(Boolean);
  if (!firstSegment || ['menu', 'detail', 'substitution', 'cart', 'help', 'tracker'].includes(firstSegment)) {
    return currentRoute(deliRouteCodec);
  }
  return routeForView(fallbackView, fallbackItemId);
}

function rehydratePresentationRef(
  presentation: PresentationRef | undefined,
  menu: MenuItem[],
  removedIngredientIds: string[],
): PresentationRef | undefined {
  if (!presentation) {
    return undefined;
  }
  if (presentation.type === 'MenuItem') {
    const item = menu.find((candidate) => candidate.id === presentation.id);
    return item ? menuItemPresentation(item) : presentation;
  }
  if (presentation.type === 'Ingredient') {
    const ingredient = menu.flatMap((item) => item.ingredients).find((candidate) => candidate.id === presentation.id);
    return ingredient ? ingredientPresentation(ingredient, removedIngredientIds.includes(ingredient.id)) : presentation;
  }
  return presentation;
}

export function DeliPbuiWorkbench({
  initialView = 'menu',
  initialSelectedItemId,
  initialCart = false,
}: DeliPbuiWorkbenchProps) {
  const { data: menu = [] } = useGetMenuQuery();
  const routeInitial = initialRouteSnapshot(initialView, initialSelectedItemId);
  const initialItemId = routeInitial.params?.itemId ?? initialSelectedItemId ?? menu[0]?.id;
  const session = useAppSelector((state) => state.pbuiSession);
  const { viewId, selectedItemId, removedIngredientIds, cartItems } = useAppSelector((state) => state.deliWorkbench);
  const dispatch = useAppDispatch();

  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selectedMenuPresentation = selectedItem ? menuItemPresentation(selectedItem) : undefined;
  const currentSessionSelected = rehydratePresentationRef(session.selectedRef, menu, removedIngredientIds);
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
  };

  useEffect(() => {
    dispatch(deliWorkbenchActions.resetWorkbench({ viewId: routeInitial.view, selectedItemId: initialItemId }));
    dispatch(pbuiSessionActions.resetSession({
      commandBuffer: `LIST ${deliViewModels[routeInitial.view].modeLabel}`,
      resultLine: 'Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.',
    }));
    if (window.location.pathname === '/') {
      replaceRoute(deliRouteCodec, routeForView(routeInitial.view, initialItemId));
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
    pushRoute(deliRouteCodec, routeForView(nextView, params.itemId ?? selectedItemId));
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
  });

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
        <div className="grid gap-2" data-testid="detail-view">
          <div className="py-2">
            <div className="text-clim-muted text-xs uppercase tracking-wide">Composition draft</div>
            <div className="text-clim-bright">{selectedItem?.name}</div>
            <div className="text-clim-muted text-sm">{draft?.id}</div>
          </div>
          {selectedItem?.ingredients.map((ingredient) => {
            const removed = removedIngredientIds.includes(ingredient.id);
            const presentation = ingredientPresentation(ingredient, removed);
            const visual = presentationVisualState({
              presentation,
              selected: activeSelected,
              selectedAction: session.mode === 'select' ? pendingAction : undefined,
              filledArgs: session.filledArgs,
              context: actionContext(),
              removed,
            });
            return (
              <PbuiPresentationRef
                key={ingredient.id}
                presentation={presentation}
                state={visual}
                onSelect={visual.selectable || session.mode !== 'select' ? () => handlePresentationClick(presentation) : undefined}
              />
            );
          })}
        </div>
      );
    }

    if (viewId === 'cart') {
      return (
        <div className="grid gap-2" data-testid="cart-view">
          <PbuiPresentationRef presentation={cart} selected selectable={false} />
          {cartItems.length === 0 ? (
            <div className="text-clim-muted">Cart is empty. Use CUSTOMIZE then ADD-TO-ORDER to create an item.</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-1">
                <span className="text-clim-bright">&lt;OrderItem&gt;</span> {item.item.name}{' '}
                <span className="text-clim-muted">${item.item.price.toFixed(2)}</span>
                {item.removedIngredientIds.length > 0 ? (
                  <span className="text-clim-danger"> removed: {item.removedIngredientIds.join(', ')}</span>
                ) : null}
              </div>
            ))
          )}
        </div>
      );
    }

    if (viewId === 'help') {
      return (
        <div className="grid gap-2 text-sm" data-testid="help-view">
          {Object.values(deliActions).map((action) => (
            <div key={action.id} className="py-1">
              <span className="text-clim-bright">{action.id}</span>{' '}
              <span className="text-clim-muted">-&gt; {action.args.map((arg) => `${arg.name}:${arg.kind === 'ref' ? arg.objectType : arg.valueType}`).join(', ') || 'no args'}</span>
              <div>{action.description}</div>
            </div>
          ))}
        </div>
      );
    }

    if (viewId === 'tracker') {
      return (
        <div className="py-2" data-testid="tracker-view">
          <div className="text-clim-muted text-xs uppercase tracking-wide">Lifecycle</div>
          <div><span className="text-clim-bright">DONE</span> cart submitted</div>
          <div><span className="text-clim-bright">ACTIVE</span> kitchen accepted order</div>
          <div><span className="text-clim-muted">PENDING</span> pickup notification</div>
        </div>
      );
    }

    return (
      <div className="grid gap-1" data-testid="menu-view">
        {menu.map((item) => {
          const presentation = menuItemPresentation(item);
          const visual = presentationVisualState({
            presentation,
            selected: activeSelected?.id === presentation.id ? activeSelected : selectedItemId === item.id ? presentation : activeSelected,
            selectedAction: session.mode === 'select' ? pendingAction : undefined,
            filledArgs: session.filledArgs,
            context: actionContext(),
          });
          return (
            <PbuiPresentationRef
              key={item.id}
              presentation={presentation}
              state={visual}
              onSelect={visual.selectable || session.mode !== 'select' ? () => handlePresentationClick(presentation) : undefined}
            />
          );
        })}
      </div>
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
