import { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { ActionHintBar, ClimShell, ConfirmPrompt, PresentationRefLine } from '../../generic/clim/components';
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

function ingredientPresentation(ingredient: Ingredient): PresentationRef<'Ingredient'> {
  return {
    type: 'Ingredient',
    id: ingredient.id,
    label: `${ingredient.name} [${ingredient.role}]`,
    capabilities: ingredient.removable ? ['labelable', 'removable'] : ['labelable'],
    metadata: { role: ingredient.role, removable: ingredient.removable ? 'yes' : 'no' },
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

function actionForCommand(viewId: string, commandId: DeliCommandId, subject?: PresentationRef): ActionPresentation<DeliActionId> {
  const binding = commandBindingsForView(viewId).find((candidate) => candidate.id === commandId);
  if (!binding) {
    throw new Error(`No command binding for ${commandId}`);
  }
  return {
    descriptor: deliActionDescriptors[binding.actionId],
    commandLabel: binding.label,
    subject,
  };
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
  const [cartItems, setCartItems] = useState<DeliCartItem[]>([]);
  const [pendingBinding, setPendingBinding] = useState<CommandBinding<DeliCommandId, DeliActionId> | undefined>();
  const [pendingRequest, setPendingRequest] = useState<ActionRequest<DeliActionId> | undefined>();
  const [resultLine, setResultLine] = useState('Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.');

  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selected = selectedItem ? menuItemPresentation(selectedItem) : undefined;
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
    selected,
    pendingAction: pendingBinding ? deliActionDescriptors[pendingBinding.actionId] : undefined,
    commandBuffer: mode === 'confirm' ? pendingBinding?.id ?? '' : `LIST ${view.modeLabel}`,
    resultLine,
  };
  const commandBindings = commandBindingsForView(view.id);
  const actions = view.defaultActions.map((commandId) =>
    actionForCommand(view.id, commandId, commandId === 'CUSTOMIZE' ? selected : undefined),
  );

  function buildRequest(binding: CommandBinding<DeliCommandId, DeliActionId>, action: ActionPresentation<DeliActionId>) {
    return buildActionRequestFromBinding(binding, action.descriptor, {
      selected: action.subject ?? selected,
      currentDraft: draft,
      currentCart: cart,
      commandArguments: { tag: 'vegetarian', category: 'sandwiches' },
    });
  }

  function handleInvoke(action: ActionPresentation) {
    const typedAction = action as ActionPresentation<DeliActionId>;
    const binding = commandBindings.find(
      (candidate) => candidate.actionId === typedAction.descriptor.id && candidate.label === typedAction.commandLabel,
    );
    if (!binding) {
      setResultLine(`No command binding found for ${typedAction.commandLabel ?? typedAction.descriptor.id}`);
      return;
    }
    const request = buildRequest(binding, typedAction);
    if (binding.requiresConfirmation) {
      setPendingBinding(binding);
      setPendingRequest(request);
      setResultLine(`Pending confirmation: ${binding.id} -> ${summarizeActionRequest(request)}`);
      return;
    }
    executeBinding(binding, request);
  }

  function executeBinding(binding: CommandBinding<DeliCommandId, DeliActionId>, request: ActionRequest<DeliActionId>) {
    switch (binding.id) {
      case 'CUSTOMIZE':
        setViewId('detail');
        break;
      case 'ADD-TO-ORDER':
        if (selectedItem) {
          setCartItems((items) => [...items, { id: `cart.${selectedItem.id}.${items.length + 1}`, item: selectedItem, removedIngredientIds: [], substitutions: {} }]);
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

  function confirmPending() {
    if (!pendingBinding || !pendingRequest) {
      return;
    }
    setPendingBinding(undefined);
    setPendingRequest(undefined);
    setViewId('tracker');
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
          <div className="border border-clim-border bg-clim-panel/40 p-3">
            <div className="text-clim-muted text-xs uppercase tracking-wide">Composition draft</div>
            <div className="text-clim-bright">{selectedItem?.name}</div>
            <div className="text-clim-muted text-sm">{draft?.id}</div>
          </div>
          {selectedItem?.ingredients.map((ingredient) => (
            <PresentationRefLine key={ingredient.id} presentation={ingredientPresentation(ingredient)} selectable={ingredient.removable} />
          ))}
        </div>
      );
    }

    if (viewId === 'cart') {
      return (
        <div className="grid gap-2" data-testid="cart-view">
          <PresentationRefLine presentation={cart} selected selectable />
          {effectiveCartItems.length === 0 ? (
            <div className="text-clim-muted">Cart is empty. Use CUSTOMIZE then ADD-TO-ORDER to create an item.</div>
          ) : (
            effectiveCartItems.map((item) => (
              <div key={item.id} className="border border-clim-border bg-clim-panel/30 p-2">
                <span className="text-clim-bright">&lt;OrderItem&gt;</span> {item.item.name}{' '}
                <span className="text-clim-muted">${item.item.price.toFixed(2)}</span>
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
            <div key={binding.id} className="border border-clim-border bg-clim-panel/30 p-2">
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
        <div className="border border-clim-border bg-clim-panel/40 p-3" data-testid="tracker-view">
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
          return (
            <PresentationRefLine
              key={item.id}
              presentation={presentation}
              selected={selectedItemId === item.id}
              selectable
              onSelect={() => {
                setSelectedItemId(item.id);
                setResultLine(`Selected ${presentation.label}`);
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <ClimShell state={state}>
      <section className="grid gap-3">
        <div className="border border-clim-border bg-clim-panel/40 p-3">
          <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
          <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
          <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
        </div>

        {renderView()}

        {pendingBinding ? (
          <ConfirmPrompt binding={pendingBinding} onConfirm={confirmPending} onCancel={cancelPending} />
        ) : null}

        <ActionHintBar actions={actions} onInvoke={handleInvoke} />
      </section>
    </ClimShell>
  );
}

export function DeliPbuiWorkbenchWithProvider(props: DeliPbuiWorkbenchProps) {
  return (
    <Provider store={store}>
      <DeliPbuiWorkbench {...props} />
    </Provider>
  );
}
