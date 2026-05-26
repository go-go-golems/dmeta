import type { PresentationRef } from '../../generic/clim/types';
import type { DeliCartItem, Ingredient, MenuItem } from './types';

export function menuItemPresentation(item: MenuItem): PresentationRef<'MenuItem'> {
  return {
    type: 'MenuItem',
    id: item.id,
    label: `${item.name} $${item.price.toFixed(2)}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
    copyValue: item.id,
  };
}

export function ingredientPresentation(ingredient: Ingredient, removed: boolean): PresentationRef<'Ingredient'> {
  return {
    type: 'Ingredient',
    id: ingredient.id,
    label: `${ingredient.name} [${ingredient.role}]${removed ? ' (removed)' : ''}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ingredient.removable ? ['labelable', 'removable'] : ['labelable'],
    metadata: { role: ingredient.role, removable: ingredient.removable ? 'yes' : 'no', removed: removed ? 'yes' : 'no' },
    copyValue: ingredient.id,
  };
}

export function cartPresentation(cartItems: DeliCartItem[]): PresentationRef<'Order'> {
  return {
    type: 'Order',
    id: 'cart.current',
    label: `${cartItems.length} item${cartItems.length === 1 ? '' : 's'} / $${cartItems.reduce((sum, item) => sum + item.item.price, 0).toFixed(2)}`,
    presentationType: 'pbui.presentation_ref',
    capabilities: ['stateful', 'submittable'],
    metadata: { items: cartItems.length },
  };
}

export function draftPresentation(item: MenuItem | undefined): PresentationRef<'OrderItem'> | undefined {
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
    copyValue: item.id,
  };
}

export function rehydrateDeliPresentationRef(
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
