import { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { store } from '../../app/store';
import type { AppStore } from '../../app/store';
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiConfirmPrompt } from '../../generic/clim/components/PbuiConfirmPrompt';
import { PbuiPresentationRef } from '../../generic/clim/components/PbuiPresentationRef';
import { PbuiShell } from '../../generic/clim/components/PbuiShell';
import {
  actionPresentationsForBindings,
  bindingUsesInputSource,
  compatibleBindingsForPresentation,
  presentationVisualState,
} from '../../generic/clim/compatibility';
import { runCommandHandler } from '../../generic/clim/handlerRegistry';
import { pbuiSessionActions } from '../../generic/clim/pbuiSessionSlice';
import { buildActionRequestFromBinding, summarizeActionRequest } from '../../generic/clim/runtime';
import { backOrFallback, currentRoute, listenToRouteChanges, pushRoute, replaceRoute } from '../../generic/clim/routing';
import type { RouteCodec, RouteSnapshot } from '../../generic/clim/routing';
import type { ActionPresentation, ClimSessionState, CommandBinding, PresentationRef } from '../../generic/clim/types';
import { deliActionDescriptors } from '../../domain/deli/actions';
import { deliCommandBindings, commandBindingsForView } from '../../domain/deli/commandBindings';
import { assertDeliHandlerCoverage, deliCommandHandlers } from '../../domain/deli/handlers';
import type { DeliCommandHandlerEnvironment } from '../../domain/deli/handlers';
import { useGetMenuQuery } from '../../domain/deli/deliApi';
import { deliViewModels } from '../../domain/deli/viewModels';
import type { DeliActionId, DeliCartItem, DeliCommandId, DeliViewId, Ingredient, MenuItem } from '../../domain/deli/types';

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
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
  };
}

function ingredientPresentation(ingredient: Ingredient, removed: boolean): PresentationRef<'Ingredient'> {
  return {
    type: 'Ingredient',
    id: ingredient.id,
    label: `${ingredient.name} [${ingredient.role}]${removed ? ' (removed)' : ''}`,
    capabilities: ingredient.removable ? ['labelable', 'removable'] : ['labelable'],
    metadata: { role: ingredient.role, removable: ingredient.removable ? 'yes' : 'no', removed: removed ? 'yes' : 'no' },
  };
}

function cartPresentation(cartItems: DeliCartItem[]): PresentationRef<'Order'> {
  return {
    type: 'Order',
    id: 'cart.current',
    label: `${cartItems.length} item${cartItems.length === 1 ? '' : 's'} / $${cartItems.reduce((sum, item) => sum + item.item.price, 0).toFixed(2)}`,
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
    capabilities: ['composable', 'substitutable'],
    metadata: { source: item.id },
  };
}

function actionForBinding(binding: CommandBinding<DeliCommandId, DeliActionId>, subject?: PresentationRef): ActionPresentation<DeliActionId> {
  return {
    descriptor: deliActionDescriptors[binding.actionId],
    commandLabel: binding.label,
    subject,
  };
}

function commandArgumentsFromBuffer(value: string) {
  const [, firstArg] = value.trim().split(/\s+/);
  return { tag: firstArg ?? 'vegetarian', category: firstArg ?? 'sandwiches' };
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

assertDeliHandlerCoverage(Object.values(deliCommandBindings));

export function DeliPbuiWorkbench({
  initialView = 'menu',
  initialSelectedItemId,
  initialCart = false,
}: DeliPbuiWorkbenchProps) {
  const { data: menu = [] } = useGetMenuQuery();
  const routeInitial = initialRouteSnapshot(initialView, initialSelectedItemId);
  const initialItemId = routeInitial.params?.itemId ?? initialSelectedItemId ?? menu[0]?.id;
  const [viewId, setViewId] = useState<DeliViewId>(routeInitial.view);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(initialItemId);
  const [removedIngredientIds, setRemovedIngredientIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<DeliCartItem[]>([]);
  const session = useAppSelector((state) => state.pbuiSession);
  const dispatchSession = useAppDispatch();

  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selectedMenuPresentation = selectedItem ? menuItemPresentation(selectedItem) : undefined;
  const activeSelected = session.selectedRef ?? selectedMenuPresentation;
  const draft = draftPresentation(selectedItem);
  const effectiveCartItems = useMemo(() => {
    if (cartItems.length > 0 || !initialCart || !selectedItem) {
      return cartItems;
    }
    return [{ id: `cart.${selectedItem.id}`, item: selectedItem, removedIngredientIds: [], substitutions: {} }];
  }, [cartItems, initialCart, selectedItem]);
  const cart = cartPresentation(effectiveCartItems);
  const view = deliViewModels[viewId];
  const mode = session.mode;
  const state: ClimSessionState = {
    mode,
    modeLabel: mode === 'confirm' ? 'CONFIRM' : mode === 'select' ? 'SELECT' : view.modeLabel,
    selected: activeSelected,
    pendingAction: session.pendingCommand ? deliActionDescriptors[session.pendingCommand.actionId as DeliActionId] : undefined,
    commandBuffer: mode === 'confirm' ? session.pendingCommand?.id ?? '' : session.commandBuffer,
    resultLine: session.resultLine,
  };
  useEffect(() => {
    dispatchSession(pbuiSessionActions.resetSession({
      commandBuffer: `LIST ${view.modeLabel}`,
      resultLine: 'Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.',
    }));
    if (window.location.pathname === '/') {
      replaceRoute(deliRouteCodec, routeForView(viewId, selectedItemId));
    }
    return listenToRouteChanges(deliRouteCodec, (snapshot) => {
      setViewId(snapshot.view);
      if (snapshot.params?.itemId) {
        setSelectedItemId(snapshot.params.itemId);
      }
      dispatchSession(pbuiSessionActions.routeChanged({ commandBuffer: `LIST ${deliViewModels[snapshot.view].modeLabel}` }));
    });
  }, []);

  function navigateToView(nextView: DeliViewId, params: { itemId?: string } = {}) {
    if (params.itemId) {
      setSelectedItemId(params.itemId);
    }
    setViewId(nextView);
    pushRoute(deliRouteCodec, routeForView(nextView, params.itemId ?? selectedItemId));
  }

  function navigateBack() {
    backOrFallback(deliRouteCodec, { view: 'menu' });
  }

  const commandBindings = commandBindingsForView(view.id);
  const actions = actionPresentationsForBindings({
    bindings: commandBindings,
    actions: deliActionDescriptors,
    selected: activeSelected,
    defaultActionOrder: view.defaultActions,
    availability: availabilityForBinding,
  });

  function availabilityForBinding(binding: CommandBinding<DeliCommandId, DeliActionId>) {
    if (binding.id === 'PLACE-ORDER' && effectiveCartItems.length === 0) {
      return { enabled: false, reason: 'Cart is empty.' };
    }
    return { enabled: true };
  }

  function canUsePresentation(binding: CommandBinding<DeliCommandId, DeliActionId>, presentation: PresentationRef) {
    if (binding.id === 'CUSTOMIZE') {
      return presentation.type === 'MenuItem';
    }
    if (binding.id === 'REMOVE-INGREDIENT') {
      return presentation.type === 'Ingredient' && presentation.capabilities.includes('removable') && presentation.metadata?.removed !== 'yes';
    }
    return true;
  }

  function compatibleBindingsFor(presentation: PresentationRef) {
    if (session.mode === 'select' && session.pendingCommand) {
      const pendingCommand = session.pendingCommand as CommandBinding<DeliCommandId, DeliActionId>;
      return bindingUsesInputSource(pendingCommand, 'selected_presentation') && canUsePresentation(pendingCommand, presentation)
        ? [pendingCommand]
        : [];
    }
    return compatibleBindingsForPresentation({
      bindings: commandBindings,
      presentation,
      defaultActionOrder: view.defaultActions,
      canUsePresentation,
    });
  }

  function bindingHasCompatibleSubject(binding: CommandBinding<DeliCommandId, DeliActionId>, subject: PresentationRef | undefined) {
    if (!bindingUsesInputSource(binding, 'selected_presentation')) {
      return true;
    }
    return subject ? canUsePresentation(binding, subject) : false;
  }

  function buildRequest(
    binding: CommandBinding<DeliCommandId, DeliActionId>,
    action: ActionPresentation<DeliActionId>,
    commandArguments = commandArgumentsFromBuffer(session.commandBuffer),
  ) {
    return buildActionRequestFromBinding(binding, action.descriptor, {
      selected: action.subject ?? activeSelected,
      currentDraft: draft,
      currentCart: cart,
      commandArguments,
    });
  }

  function invokeBinding(
    binding: CommandBinding<DeliCommandId, DeliActionId>,
    subject?: PresentationRef,
    commandArguments = commandArgumentsFromBuffer(session.commandBuffer),
  ) {
    dispatchSession(pbuiSessionActions.setCommandBuffer(binding.id));
    const action = actionForBinding(binding, subject);
    const request = buildRequest(binding, action, commandArguments);
    if (binding.requiresConfirmation) {
      dispatchSession(pbuiSessionActions.enterConfirm({
        command: binding,
        request,
        resultLine: `Pending confirmation: ${binding.id} -> ${summarizeActionRequest(request)}`,
      }));
      return;
    }
    executeBinding(binding, request);
  }

  function handleInvoke(action: ActionPresentation) {
    const typedAction = action as ActionPresentation<DeliActionId>;
    if (typedAction.disabledReason) {
      dispatchSession(pbuiSessionActions.setResult(typedAction.disabledReason));
      return;
    }
    const binding = commandBindings.find(
      (candidate) => candidate.actionId === typedAction.descriptor.id && candidate.label === typedAction.commandLabel,
    );
    if (!binding) {
      dispatchSession(pbuiSessionActions.setResult(`No command binding found for ${typedAction.commandLabel ?? typedAction.descriptor.id}`));
      return;
    }
    const subject = typedAction.subject ?? activeSelected;
    if (!bindingHasCompatibleSubject(binding, subject)) {
      dispatchSession(pbuiSessionActions.enterSelect({ command: binding, resultLine: `Select a compatible target for ${binding.id}.` }));
      return;
    }
    invokeBinding(binding, subject);
  }

  function handlePresentationClick(presentation: PresentationRef) {
    if (presentation.type === 'MenuItem') {
      setSelectedItemId(presentation.id);
    }

    if (session.mode === 'select' && session.pendingCommand) {
      if (!canUsePresentation(session.pendingCommand as CommandBinding<DeliCommandId, DeliActionId>, presentation)) {
        dispatchSession(pbuiSessionActions.setResult(`${presentation.label} is not a compatible target for ${session.pendingCommand.id}.`));
        return;
      }
      dispatchSession(pbuiSessionActions.selectCompleted({ selectedRef: presentation, commandBuffer: session.pendingCommand.id }));
      invokeBinding(session.pendingCommand as CommandBinding<DeliCommandId, DeliActionId>, presentation);
      return;
    }

    dispatchSession(pbuiSessionActions.selectRef({ presentation }));
    const [binding] = compatibleBindingsFor(presentation);
    if (!binding) {
      dispatchSession(pbuiSessionActions.setResult(`Selected ${presentation.label}`));
      return;
    }
    invokeBinding(binding, presentation);
  }

  function commandHandlerEnvironment(): DeliCommandHandlerEnvironment {
    return {
      selectedItem,
      selectedItemId,
      removedIngredientIds,
      cartItemCount: effectiveCartItems.length,
      setSelectedItemId,
      removeIngredient: (id) => setRemovedIngredientIds((ids) => Array.from(new Set([...ids, id]))),
      addCartItem: (item) => setCartItems((items) => [...items, item]),
      navigateToView,
      navigateBack,
    };
  }

  function executeBinding(binding: CommandBinding<DeliCommandId, DeliActionId>, request: ReturnType<typeof buildRequest>) {
    const result = runCommandHandler({
      registry: deliCommandHandlers,
      binding,
      request,
      environment: commandHandlerEnvironment(),
    });
    const defaultResultLine = `Built action request: ${binding.id} -> ${summarizeActionRequest(request)}`;
    dispatchSession(pbuiSessionActions.setResult(result.resultLine ?? defaultResultLine));
  }

  function handleCommandSubmit(value: string) {
    dispatchSession(pbuiSessionActions.setCommandBuffer(value));
    const [commandID, ...args] = value.trim().split(/\s+/);
    if (!commandID) {
      dispatchSession(pbuiSessionActions.setResult('Type a command such as CUSTOMIZE, CART, or HELP.'));
      return;
    }
    const binding = commandBindings.find((candidate) => candidate.id === commandID.toUpperCase());
    if (!binding) {
      dispatchSession(pbuiSessionActions.setResult(`Unknown command for ${view.modeLabel}: ${commandID.toUpperCase()}`));
      return;
    }
    const availability = availabilityForBinding(binding);
    if (!availability.enabled) {
      dispatchSession(pbuiSessionActions.setResult(availability.reason ?? `${binding.id} is not available.`));
      return;
    }
    const subject = bindingUsesInputSource(binding, 'selected_presentation') ? activeSelected : undefined;
    if (!bindingHasCompatibleSubject(binding, subject)) {
      dispatchSession(pbuiSessionActions.enterSelect({ command: binding, resultLine: `Select a compatible target for ${binding.id}.` }));
      return;
    }
    invokeBinding(binding, subject, { tag: args[0] ?? 'vegetarian', category: args[0] ?? 'sandwiches' });
  }

  function confirmPending() {
    if (!session.pendingCommand || !session.pendingRequest) {
      return;
    }
    const confirmedCommand = session.pendingCommand as CommandBinding<DeliCommandId, DeliActionId>;
    const confirmedRequest = session.pendingRequest;
    const result = runCommandHandler({
      registry: deliCommandHandlers,
      binding: confirmedCommand,
      request: confirmedRequest as ReturnType<typeof buildRequest>,
      environment: commandHandlerEnvironment(),
    });
    navigateToView('tracker');
    dispatchSession(pbuiSessionActions.confirmCompleted({
      commandBuffer: confirmedCommand.id,
      resultLine: result.resultLine ?? `Confirmed action request: ${confirmedCommand.id} -> ${summarizeActionRequest(confirmedRequest)}`,
    }));
  }

  function cancelPending() {
    dispatchSession(pbuiSessionActions.confirmCancelled({ resultLine: 'Cancelled pending action request.' }));
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
            const compatible = compatibleBindingsFor(presentation);
            const visual = presentationVisualState({
              presentation,
              selected: activeSelected,
              compatibleBindings: compatible,
              removed,
            });
            return (
              <PbuiPresentationRef
                key={ingredient.id}
                presentation={presentation}
                state={visual}
                onSelect={visual.selectable ? () => handlePresentationClick(presentation) : undefined}
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
          {effectiveCartItems.length === 0 ? (
            <div className="text-clim-muted">Cart is empty. Use CUSTOMIZE then ADD-TO-ORDER to create an item.</div>
          ) : (
            effectiveCartItems.map((item) => (
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
          {Object.values(deliCommandBindings).map((binding) => (
            <div key={binding.id} className="py-1">
              <span className="text-clim-bright">{binding.id}</span>{' '}
              <span className="text-clim-muted">-&gt; {binding.actionId} / {binding.handler}</span>
              <div>{binding.summary}</div>
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
          const compatible = compatibleBindingsFor(presentation);
          const visual = presentationVisualState({
            presentation,
            selected: activeSelected?.id === presentation.id ? activeSelected : selectedItemId === item.id ? presentation : activeSelected,
            compatibleBindings: compatible,
          });
          return (
            <PbuiPresentationRef
              key={item.id}
              presentation={presentation}
              state={visual}
              onSelect={visual.selectable ? () => handlePresentationClick(presentation) : undefined}
            />
          );
        })}
      </div>
    );
  }

  return (
    <PbuiShell
      state={state}
      commandValue={mode === 'confirm' || mode === 'select' ? session.pendingCommand?.id ?? session.commandBuffer : session.commandBuffer}
      onCommandChange={(value) => dispatchSession(pbuiSessionActions.setCommandBuffer(value))}
      onCommandSubmit={handleCommandSubmit}
    >
      <section className="grid gap-3">
        <div className="py-2">
          <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
          <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
          <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
        </div>

        {renderView()}

        {session.pendingCommand ? (
          <PbuiConfirmPrompt binding={session.pendingCommand} onConfirm={confirmPending} onCancel={cancelPending} />
        ) : null}

        <PbuiActionBar actions={actions} onInvoke={handleInvoke} />
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
