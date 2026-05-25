import type { ActionRequest, CommandBinding, PresentationRef } from '../../generic/clim/types';
import type { PbuiCommandHandlerRegistry } from '../../generic/clim/handlerRegistry';
import type { DeliActionId, DeliCartItem, DeliCommandId, DeliViewId, MenuItem } from './types';

export interface DeliCommandHandlerEnvironment {
  selectedItem?: MenuItem;
  selectedItemId?: string;
  removedIngredientIds: string[];
  cartItemCount: number;
  selectItem: (id: string) => void;
  removeIngredient: (id: string) => void;
  addCartItem: (item: DeliCartItem) => void;
  navigateToView: (view: DeliViewId, params?: { itemId?: string }) => void;
  navigateBack: () => void;
}

function selectedMenuItemId(request: ActionRequest<DeliActionId>, fallback?: string) {
  return request.subject?.type === 'MenuItem' ? request.subject.id : fallback;
}

export const deliCommandHandlers: PbuiCommandHandlerRegistry<DeliCommandId, DeliActionId, DeliCommandHandlerEnvironment> = {
  'deli.selectMenuItem': ({ request, environment }) => {
    const itemId = selectedMenuItemId(request, environment.selectedItemId);
    if (itemId) {
      environment.selectItem(itemId);
    }
    environment.navigateToView('detail', { itemId });
  },
  'deli.removeIngredient': ({ request, environment }) => {
    const part = request.inputs.part_ref as PresentationRef | undefined;
    if (part) {
      environment.removeIngredient(part.id);
    }
  },
  'deli.addToOrder': ({ environment }) => {
    if (!environment.selectedItem) {
      return { handled: false, resultLine: 'No selected menu item to add to the order.' };
    }
    environment.addCartItem({
      id: `cart.${environment.selectedItem.id}.${environment.cartItemCount + 1}`,
      item: environment.selectedItem,
      removedIngredientIds: environment.removedIngredientIds,
      substitutions: {},
    });
    environment.navigateToView('cart');
  },
  'deli.navigateToCart': ({ environment }) => {
    environment.navigateToView('cart');
  },
  'deli.showHelp': ({ environment }) => {
    environment.navigateToView('help');
  },
  'deli.navigateBack': ({ environment }) => {
    environment.navigateBack();
  },
  'deli.returnToMenu': ({ environment }) => {
    environment.navigateToView('menu');
  },
  'deli.filterByDietary': ({ request }) => ({
    handled: true,
    resultLine: `Filter by dietary tag: ${String(request.inputs.dietary_tag ?? 'unknown')}`,
  }),
  'deli.filterByCategory': ({ request }) => ({
    handled: true,
    resultLine: `Filter by category: ${String(request.inputs.category ?? 'unknown')}`,
  }),
  'deli.applySubstitution': () => ({
    handled: true,
    resultLine: 'Substitution application is not implemented in this POC yet.',
  }),
  'deli.describeSubject': ({ request }) => ({
    handled: true,
    resultLine: `Describe ${request.subject?.label ?? 'selected subject'}`,
  }),
  'deli.submitOrder': () => ({
    handled: true,
  }),
};

export function assertDeliHandlerCoverage(bindings: CommandBinding<DeliCommandId, DeliActionId>[]) {
  const missing = bindings.filter((binding) => !deliCommandHandlers[binding.handler]).map((binding) => `${binding.id}:${binding.handler}`);
  if (missing.length > 0) {
    throw new Error(`Missing Deli PBUI handlers: ${missing.join(', ')}`);
  }
}
