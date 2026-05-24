/**
 * State types for the Street Deli ordering application.
 *
 * @see www/mobile/app.js → state object
 */

import type { MenuItemViewModel, MenuCategory, DietaryTag, IngredientState, CartItemViewModel, TrackerStep } from '../view-models/types';

export type DeliState = {
  activeScreen: 'menu' | 'cart' | 'tracker';
  activeDietary: Set<string>;
  activeCategory: MenuCategory | 'all';
  cart: CartItemViewModel[];
  customizing: CustomizingState | null;
  placedOrder: PlacedOrderState | null;
  nextOrderNum: number;
  showSubDetail: string | null;   // ingredientId when substitution detail sheet is open
};

export type CustomizingState = {
  menuItem: MenuItemViewModel;
  composition: IngredientState[];
  config: Record<string, string>;
  currentPriceCents: number;
};

export type PlacedOrderState = {
  orderNumber: number;
  currentStep: TrackerStep;
  placedAt: number;
};

// ─── ACTIONS ──────────────────────────────────────────────────────────

export type DeliAction =
  | { type: 'SET_ACTIVE_CATEGORY'; category: MenuCategory | 'all' }
  | { type: 'TOGGLE_DIETARY'; tag: DietaryTag }
  | { type: 'OPEN_CUSTOMIZER'; itemId: string }
  | { type: 'CLOSE_CUSTOMIZER' }
  | { type: 'REMOVE_INGREDIENT'; ingredientId: string }
  | { type: 'UNDO_INGREDIENT'; ingredientId: string }
  | { type: 'APPLY_SUBSTITUTION'; ingredientId: string; candidateIndex: number }
  | { type: 'CHANGE_CONFIG'; key: string; value: string }
  | { type: 'ADD_TO_ORDER' }
  | { type: 'REMOVE_CART_ITEM'; cartItemId: number }
  | { type: 'SHOW_CART' }
  | { type: 'BACK_TO_MENU' }
  | { type: 'PLACE_ORDER' }
  | { type: 'SHOW_SUB_DETAIL'; ingredientId: string }
  | { type: 'CLOSE_SUB_DETAIL' }
  | { type: 'ADVANCE_TRACKER_STEP' };
