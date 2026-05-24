/**
 * Main reducer for the Street Deli ordering application.
 *
 * Ported from www/mobile/app.js state management.
 */

import type { DeliState, DeliAction } from './types';
import type { IngredientState } from '../view-models/types';
import { MENU, CONFIG_OPTIONS } from '../data/menuData';
import { getSubstitutionCandidates, resolveSubKey } from '../engine/substitutionEngine';

export const initialState: DeliState = {
  activeScreen: 'menu',
  activeDietary: new Set(),
  activeCategory: 'all',
  cart: [],
  customizing: null,
  placedOrder: null,
  nextOrderNum: 100,
  showSubDetail: null,
};

function recalcPrice(composition: IngredientState[], basePrice: number): number {
  let price = basePrice;
  for (const ing of composition) {
    if (ing.substitution) {
      price += ing.substitution.priceDeltaCents;
    }
  }
  return price;
}

export function deliReducer(state: DeliState, action: DeliAction): DeliState {
  switch (action.type) {
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.category };

    case 'TOGGLE_DIETARY': {
      const next = new Set(state.activeDietary);
      if (next.has(action.tag)) {
        next.delete(action.tag);
      } else {
        next.add(action.tag);
      }
      return { ...state, activeDietary: next };
    }

    case 'OPEN_CUSTOMIZER': {
      const menuItem = MENU.find(m => m.id === action.itemId);
      if (!menuItem) return state;
      const composition: IngredientState[] = menuItem.ingredients.map(ing => ({
        ...ing,
        removed: false,
        substitution: null,
      }));
      const opts = CONFIG_OPTIONS[menuItem.category] || [];
      const config: Record<string, string> = {};
      for (const opt of opts) {
        config[opt.key] = opt.values[opt.defaultIndex];
      }
      return {
        ...state,
        customizing: {
          menuItem,
          composition,
          config,
          currentPriceCents: menuItem.basePriceCents,
        },
      };
    }

    case 'CLOSE_CUSTOMIZER':
      return { ...state, customizing: null, showSubDetail: null };

    case 'REMOVE_INGREDIENT': {
      if (!state.customizing) return state;
      const composition = state.customizing.composition.map(ing =>
        ing.id === action.ingredientId
          ? { ...ing, removed: true, substitution: null }
          : ing
      );
      return {
        ...state,
        customizing: {
          ...state.customizing,
          composition,
          currentPriceCents: recalcPrice(composition, state.customizing.menuItem.basePriceCents),
        },
      };
    }

    case 'UNDO_INGREDIENT': {
      if (!state.customizing) return state;
      const composition = state.customizing.composition.map(ing =>
        ing.id === action.ingredientId
          ? { ...ing, removed: false, substitution: null }
          : ing
      );
      return {
        ...state,
        customizing: {
          ...state.customizing,
          composition,
          currentPriceCents: recalcPrice(composition, state.customizing.menuItem.basePriceCents),
        },
      };
    }

    case 'APPLY_SUBSTITUTION': {
      if (!state.customizing) return state;
      const key = resolveSubKey(action.ingredientId);
      const rules = getSubstitutionCandidates(key);
      if (!rules) return state;
      const candidate = rules[action.candidateIndex];
      if (!candidate) return state;
      const composition = state.customizing.composition.map(ing =>
        ing.id === action.ingredientId
          ? { ...ing, substitution: candidate }
          : ing
      );
      return {
        ...state,
        customizing: {
          ...state.customizing,
          composition,
          currentPriceCents: recalcPrice(composition, state.customizing.menuItem.basePriceCents),
        },
        showSubDetail: null,
      };
    }

    case 'CHANGE_CONFIG': {
      if (!state.customizing) return state;
      return {
        ...state,
        customizing: {
          ...state.customizing,
          config: { ...state.customizing.config, [action.key]: action.value },
        },
      };
    }

    case 'ADD_TO_ORDER': {
      if (!state.customizing) return state;
      const cartItem: import('../view-models/types').CartItemViewModel = {
        id: Date.now(),
        menuItem: state.customizing.menuItem,
        composition: state.customizing.composition.map(ing => ({ ...ing })),
        config: { ...state.customizing.config },
        totalPriceCents: state.customizing.currentPriceCents,
      };
      return {
        ...state,
        cart: [...state.cart, cartItem],
        customizing: null,
      };
    }

    case 'REMOVE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.cartItemId),
      };

    case 'SHOW_CART':
      return { ...state, activeScreen: 'cart' };

    case 'BACK_TO_MENU':
      return {
        ...state,
        activeScreen: 'menu',
        placedOrder: null,
      };

    case 'PLACE_ORDER': {
      const num = state.nextOrderNum;
      return {
        ...state,
        cart: [],
        activeScreen: 'tracker',
        placedOrder: {
          orderNumber: num,
          currentStep: 'received',
          placedAt: Date.now(),
        },
        nextOrderNum: num + 1,
      };
    }

    case 'SHOW_SUB_DETAIL':
      return { ...state, showSubDetail: action.ingredientId };

    case 'CLOSE_SUB_DETAIL':
      return { ...state, showSubDetail: null };

    case 'ADVANCE_TRACKER_STEP': {
      if (!state.placedOrder) return state;
      const steps: Array<import('../view-models/types').TrackerStep> = ['received', 'preparing', 'ready', 'picked_up'];
      const currentIndex = steps.indexOf(state.placedOrder.currentStep);
      if (currentIndex >= steps.length - 1) return state;
      return {
        ...state,
        placedOrder: {
          ...state.placedOrder,
          currentStep: steps[currentIndex + 1],
        },
      };
    }

    default:
      return state;
  }
}
