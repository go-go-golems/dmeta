import { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiConfirmPrompt } from '../../generic/clim/components/PbuiConfirmPrompt';
import { PbuiPresentationRef } from '../../generic/clim/components/PbuiPresentationRef';
import { PbuiShell } from '../../generic/clim/components/PbuiShell';
import {
  actionPresentationsForBindings,
  compatibleBindingsForPresentation,
  presentationVisualState,
} from '../../generic/clim/compatibility';
import { buildActionRequestFromBinding, summarizeActionRequest } from '../../generic/clim/runtime';
import type { ActionPresentation, ActionRequest, ClimSessionState, CommandBinding, PresentationRef } from '../../generic/clim/types';
import { deliActionDescriptors } from '../../domain/deli/actions';
import { deliCommandBindings, commandBindingsForView } from '../../domain/deli/commandBindings';
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

export function DeliPbuiWorkbench({
  initialView = 'menu',
  initialSelectedItemId,
  initialCart = false,
}: DeliPbuiWorkbenchProps) {
  const { data: menu = [] } = useGetMenuQuery();
  const initialItemId = initialSelectedItemId ?? menu[0]?.id;
  const [viewId, setViewId] = useState<DeliViewId>(initialView);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(initialItemId);
  const [selectedPresentation, setSelectedPresentation] = useState<PresentationRef | undefined>();
  const [removedIngredientIds, setRemovedIngredientIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<DeliCartItem[]>([]);
  const [pendingBinding, setPendingBinding] = useState<CommandBinding<DeliCommandId, DeliActionId> | undefined>();
  const [pendingRequest, setPendingRequest] = useState<ActionRequest<DeliActionId> | undefined>();
  const [commandBuffer, setCommandBuffer] = useState('LIST MENU');
  const [resultLine, setResultLine] = useState('Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.');

  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selectedMenuPresentation = selectedItem ? menuItemPresentation(selectedItem) : undefined;
  const activeSelected = selectedPresentation ?? selectedMenuPresentation;
  const draft = draftPresentation(selectedItem);
  const effectiveCartItems = useMemo(() => {
    if (cartItems.length > 0 || !initialCart || !selectedItem) {
      return cartItems;
    }
    return [{ id: `cart.${selectedItem.id}`, item: selectedItem, removedIngredientIds: [], substitutions: {} }];
  }, [cartItems, initialCart, selectedItem]);
  const cart = cartPresentation(effectiveCartItems);
  const view = deliViewModels[viewId];
  const mode = pendingBinding ? 'confirm' : 'normal';
  const state: ClimSessionState = {
    mode,
    modeLabel: mode === 'confirm' ? 'CONFIRM' : view.modeLabel,
    selected: activeSelected,
    pendingAction: pendingBinding ? deliActionDescriptors[pendingBinding.actionId] : undefined,
    commandBuffer: mode === 'confirm' ? pendingBinding?.id ?? '' : commandBuffer,
    resultLine,
  };
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
    return compatibleBindingsForPresentation({
      bindings: commandBindings,
      presentation,
      defaultActionOrder: view.defaultActions,
      canUsePresentation,
    });
  }

  function buildRequest(
    binding: CommandBinding<DeliCommandId, DeliActionId>,
    action: ActionPresentation<DeliActionId>,
    commandArguments = commandArgumentsFromBuffer(commandBuffer),
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
    commandArguments = commandArgumentsFromBuffer(commandBuffer),
  ) {
    setCommandBuffer(binding.id);
    const action = actionForBinding(binding, subject);
    const request = buildRequest(binding, action, commandArguments);
    if (binding.requiresConfirmation) {
      setPendingBinding(binding);
      setPendingRequest(request);
      setResultLine(`Pending confirmation: ${binding.id} -> ${summarizeActionRequest(request)}`);
      return;
    }
    executeBinding(binding, request);
  }

  function handleInvoke(action: ActionPresentation) {
    const typedAction = action as ActionPresentation<DeliActionId>;
    if (typedAction.disabledReason) {
      setResultLine(typedAction.disabledReason);
      return;
    }
    const binding = commandBindings.find(
      (candidate) => candidate.actionId === typedAction.descriptor.id && candidate.label === typedAction.commandLabel,
    );
    if (!binding) {
      setResultLine(`No command binding found for ${typedAction.commandLabel ?? typedAction.descriptor.id}`);
      return;
    }
    invokeBinding(binding, typedAction.subject ?? activeSelected);
  }

  function handlePresentationClick(presentation: PresentationRef) {
    setSelectedPresentation(presentation);
    if (presentation.type === 'MenuItem') {
      setSelectedItemId(presentation.id);
    }

    const [binding] = compatibleBindingsFor(presentation);
    if (!binding) {
      setResultLine(`Selected ${presentation.label}`);
      return;
    }
    invokeBinding(binding, presentation);
  }

  function executeBinding(binding: CommandBinding<DeliCommandId, DeliActionId>, request: ActionRequest<DeliActionId>) {
    switch (binding.id) {
      case 'CUSTOMIZE':
        if (request.subject?.type === 'MenuItem') {
          setSelectedItemId(request.subject.id);
        }
        setViewId('detail');
        break;
      case 'REMOVE-INGREDIENT': {
        const part = request.inputs.part_ref as PresentationRef | undefined;
        if (part) {
          setRemovedIngredientIds((ids) => Array.from(new Set([...ids, part.id])));
        }
        break;
      }
      case 'ADD-TO-ORDER':
        if (selectedItem) {
          setCartItems((items) => [...items, { id: `cart.${selectedItem.id}.${items.length + 1}`, item: selectedItem, removedIngredientIds, substitutions: {} }]);
          setViewId('cart');
        }
        break;
      case 'CART':
        setViewId('cart');
        break;
      case 'HELP':
        setViewId('help');
        break;
      case 'BACK':
      case 'MENU':
        setViewId('menu');
        break;
      default:
        break;
    }
    setResultLine(`Built action request: ${binding.id} -> ${summarizeActionRequest(request)}`);
  }

  function handleCommandSubmit(value: string) {
    setCommandBuffer(value);
    const [commandID, ...args] = value.trim().split(/\s+/);
    if (!commandID) {
      setResultLine('Type a command such as CUSTOMIZE, CART, or HELP.');
      return;
    }
    const binding = commandBindings.find((candidate) => candidate.id === commandID.toUpperCase());
    if (!binding) {
      setResultLine(`Unknown command for ${view.modeLabel}: ${commandID.toUpperCase()}`);
      return;
    }
    const availability = availabilityForBinding(binding);
    if (!availability.enabled) {
      setResultLine(availability.reason ?? `${binding.id} is not available.`);
      return;
    }
    const subject = Object.values(binding.inputMapping).includes('selected_presentation') ? activeSelected : undefined;
    invokeBinding(binding, subject, { tag: args[0] ?? 'vegetarian', category: args[0] ?? 'sandwiches' });
  }

  function confirmPending() {
    if (!pendingBinding || !pendingRequest) {
      return;
    }
    setPendingBinding(undefined);
    setPendingRequest(undefined);
    setViewId('tracker');
    setCommandBuffer(pendingBinding.id);
    setResultLine(`Confirmed action request: ${pendingBinding.id} -> ${summarizeActionRequest(pendingRequest)}`);
  }

  function cancelPending() {
    setPendingBinding(undefined);
    setPendingRequest(undefined);
    setResultLine('Cancelled pending action request.');
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
      commandValue={mode === 'confirm' ? pendingBinding?.id ?? commandBuffer : commandBuffer}
      onCommandChange={setCommandBuffer}
      onCommandSubmit={handleCommandSubmit}
    >
      <section className="grid gap-3">
        <div className="py-2">
          <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
          <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
          <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
        </div>

        {renderView()}

        {pendingBinding ? (
          <PbuiConfirmPrompt binding={pendingBinding} onConfirm={confirmPending} onCancel={cancelPending} />
        ) : null}

        <PbuiActionBar actions={actions} onInvoke={handleInvoke} />
      </section>
    </PbuiShell>
  );
}

export function DeliPbuiWorkbenchWithProvider(props: DeliPbuiWorkbenchProps) {
  return (
    <Provider store={store}>
      <DeliPbuiWorkbench {...props} />
    </Provider>
  );
}
