export type DeliDomainType = 'MenuItem' | 'Ingredient' | 'OrderItem' | 'Order';

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

export type DeliActionId =
  | 'select_menu_item'
  | 'remove_part'
  | 'apply_substitution'
  | 'add_to_order'
  | 'submit_order'
  | 'return_to_menu';
