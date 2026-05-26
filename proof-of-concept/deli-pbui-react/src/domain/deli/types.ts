export type DeliDomainType = 'MenuItem' | 'Ingredient' | 'OrderItem' | 'Order';

export type DeliViewId = 'menu' | 'detail' | 'substitution' | 'cart' | 'help' | 'tracker';

export interface Ingredient {
  id: string;
  name: string;
  role: 'protein' | 'freshness' | 'fat' | 'acid' | 'bread' | 'condiment';
  removable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
}

export interface DeliCartItem {
  id: string;
  item: MenuItem;
  removedIngredientIds: string[];
  substitutions: Record<string, Ingredient>;
}

export type DeliCommandId =
  | 'CUSTOMIZE'
  | 'FILTER-DIETARY'
  | 'FILTER-BY-CATEGORY'
  | 'REMOVE-INGREDIENT'
  | 'ADD-TO-ORDER'
  | 'APPLY'
  | 'DESCRIBE'
  | 'COPY'
  | 'CART'
  | 'BACK'
  | 'MENU'
  | 'HELP'
  | 'PLACE-ORDER';
