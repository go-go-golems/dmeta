import type { ActionSpec, PresentationRef } from '../../generic/clim/types';
import type { DeliCartItem, DeliCommandId, DeliViewId, MenuItem } from './types';

export interface DeliActionRuntimeContext {
  selectedItem?: MenuItem;
  selectedItemId?: string;
  removedIngredientIds: string[];
  cartItems: DeliCartItem[];
  selectItem: (id: string) => void;
  isRemovableIngredient: (id: string) => boolean;
  removeIngredient: (id: string) => void;
  addCartItem: (item: DeliCartItem) => void;
  navigateToView: (view: DeliViewId, params?: { itemId?: string }) => void;
  navigateBack: () => void;
}

function deliContext(context: unknown): DeliActionRuntimeContext {
  return context as DeliActionRuntimeContext;
}

function refArg(args: Record<string, unknown>, name: string): PresentationRef | undefined {
  return args[name] as PresentationRef | undefined;
}

export const deliActions: Record<DeliCommandId, ActionSpec<DeliCommandId>> = {
  CUSTOMIZE: {
    id: 'CUSTOMIZE',
    label: 'CUSTOMIZE',
    description: 'Enter the item customization/detail view for a selected menu item.',
    views: ['menu'],
    args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }],
    run: (args, context) => {
      const ctx = deliContext(context);
      const item = refArg(args, 'item');
      const itemId = item?.id ?? ctx.selectedItemId;
      if (itemId) {
        ctx.selectItem(itemId);
      }
      ctx.navigateToView('detail', { itemId });
      return { message: 'Built action request: CUSTOMIZE -> select_menu_item(item)' };
    },
  },
  'FILTER-DIETARY': {
    id: 'FILTER-DIETARY',
    label: 'FILTER-DIETARY',
    description: 'Filter menu or substitution choices by a dietary/allergen tag.',
    views: ['menu'],
    args: [{ name: 'tag', kind: 'value', valueType: 'DietaryTag', presentation: { kind: 'text-input', label: 'Dietary tag' } }],
    run: (args) => ({ message: `Filter by dietary tag: ${String(args.tag ?? 'unknown')}` }),
  },
  'FILTER-BY-CATEGORY': {
    id: 'FILTER-BY-CATEGORY',
    label: 'FILTER-BY-CATEGORY',
    description: 'Filter menu choices by menu category.',
    views: ['menu'],
    args: [{ name: 'category', kind: 'value', valueType: 'MenuCategory', presentation: { kind: 'text-input', label: 'Category' } }],
    run: (args) => ({ message: `Filter by category: ${String(args.category ?? 'unknown')}` }),
  },
  'REMOVE-INGREDIENT': {
    id: 'REMOVE-INGREDIENT',
    label: 'REMOVE-INGREDIENT',
    description: 'Remove one ingredient from the current composition draft.',
    views: ['detail'],
    args: [
      {
        name: 'ingredient',
        kind: 'ref',
        objectType: 'Ingredient',
        accepts: (ref, context) => {
          const ctx = deliContext(context);
          return ctx.isRemovableIngredient(ref.id) && !ctx.removedIngredientIds.includes(ref.id);
        },
      },
    ],
    run: (args, context) => {
      const ingredient = refArg(args, 'ingredient');
      if (ingredient) {
        deliContext(context).removeIngredient(ingredient.id);
      }
      return { message: 'Built action request: REMOVE-INGREDIENT -> remove_part(ingredient)' };
    },
  },
  'ADD-TO-ORDER': {
    id: 'ADD-TO-ORDER',
    label: 'ADD-TO-ORDER',
    description: 'Add the current configured item draft to the order/cart.',
    views: ['detail'],
    args: [],
    run: (_args, context) => {
      const ctx = deliContext(context);
      if (!ctx.selectedItem) {
        return { message: 'No selected menu item to add to the order.' };
      }
      ctx.addCartItem({
        id: `cart.${ctx.selectedItem.id}.${ctx.cartItems.length + 1}`,
        item: ctx.selectedItem,
        removedIngredientIds: ctx.removedIngredientIds,
        substitutions: {},
      });
      ctx.navigateToView('cart');
      return { message: 'Built action request: ADD-TO-ORDER -> add_to_order()' };
    },
  },
  APPLY: {
    id: 'APPLY',
    label: 'APPLY',
    description: 'Apply the selected substitution candidate to the current draft.',
    views: ['substitution'],
    args: [{ name: 'replacement', kind: 'ref', objectType: 'Ingredient' }],
    run: () => ({ message: 'Substitution application is not implemented in this POC yet.' }),
  },
  DESCRIBE: {
    id: 'DESCRIBE',
    label: 'DESCRIBE',
    description: 'Inspect or describe the selected presentation.',
    views: ['substitution'],
    args: [{ name: 'subject', kind: 'ref', objectType: 'Any' }],
    run: (args) => ({ message: `Describe ${(refArg(args, 'subject')?.label) ?? 'selected subject'}` }),
  },
  CART: {
    id: 'CART',
    label: 'CART',
    description: 'Navigate to the cart/review view.',
    views: ['menu', 'detail'],
    args: [],
    run: (_args, context) => {
      deliContext(context).navigateToView('cart');
      return { message: 'Built action request: CART -> navigate_to_cart()' };
    },
  },
  BACK: {
    id: 'BACK',
    label: 'BACK',
    description: 'Return from the current non-root flow to the previous route or menu fallback.',
    views: ['detail', 'substitution', 'cart', 'help', 'tracker'],
    args: [],
    run: (_args, context) => {
      deliContext(context).navigateBack();
      return { message: 'Built action request: BACK -> return_to_menu()' };
    },
  },
  MENU: {
    id: 'MENU',
    label: 'MENU',
    description: 'Return to the menu browsing surface.',
    views: ['cart', 'help', 'tracker'],
    args: [],
    run: (_args, context) => {
      deliContext(context).navigateToView('menu');
      return { message: 'Built action request: MENU -> return_to_menu()' };
    },
  },
  HELP: {
    id: 'HELP',
    label: 'HELP',
    description: 'Open the help/documentation surface.',
    views: ['menu', 'detail', 'cart', 'tracker'],
    args: [],
    run: (_args, context) => {
      deliContext(context).navigateToView('help');
      return { message: 'Built action request: HELP -> show_help()' };
    },
  },
  'PLACE-ORDER': {
    id: 'PLACE-ORDER',
    label: 'PLACE-ORDER',
    description: 'Submit the cart as an order after confirmation.',
    views: ['cart'],
    args: [],
    requiresConfirmation: true,
    confirmation: {
      prompt: 'Submit the current cart as an order?',
      confirmLabel: 'CONFIRM PLACE-ORDER',
      cancelLabel: 'CANCEL',
    },
    run: () => ({ message: 'Confirmed action request: PLACE-ORDER -> submit_order()' }),
  },
};

export function deliActionsForView(viewId: string) {
  return Object.values(deliActions).filter((action) => action.views.includes(viewId));
}
