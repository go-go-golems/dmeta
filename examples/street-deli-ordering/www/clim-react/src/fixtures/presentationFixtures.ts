import type { ActionPresentation, LifecycleStep, PresentationRef } from '../clim/types';

export const menuItemPresentation: PresentationRef = {
  type: 'MenuItem',
  id: 'sandwich.hudson-classic',
  label: 'Hudson Classic',
  capabilities: ['composable', 'substitutable'],
  metadata: { price: '$12.50', category: 'Sandwiches', tags: ['popular'] },
};

export const ingredientPresentation: PresentationRef = {
  type: 'Ingredient',
  id: 'ingredient.tomato',
  label: 'tomato',
  capabilities: ['substitutable'],
  metadata: { role: 'freshness', state: 'selected' },
};

export const removeIngredientAction: ActionPresentation = {
  id: 'remove_part',
  label: 'REMOVE-INGREDIENT',
  description: 'Remove an ingredient from the selected composition.',
  dangerous: false,
  disabled: false,
};

export const placeOrderAction: ActionPresentation = {
  id: 'place_order',
  label: 'PLACE-ORDER',
  description: 'Submit the current cart.',
  dangerous: true,
  disabled: false,
};

export const trackerSteps: LifecycleStep[] = [
  { id: 'received', label: 'Received', state: 'done' },
  { id: 'preparing', label: 'Preparing', state: 'active' },
  { id: 'ready', label: 'Ready', state: 'pending' },
  { id: 'picked-up', label: 'Picked Up', state: 'pending' },
];
