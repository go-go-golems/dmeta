import type { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 'sandwich.hudson-classic',
    name: 'Hudson Classic',
    price: 12.5,
    category: 'Sandwiches',
    tags: ['popular'],
    ingredients: [
      { id: 'ingredient.sourdough', name: 'sourdough', role: 'bread', removable: false },
      { id: 'ingredient.turkey', name: 'turkey', role: 'protein', removable: true },
      { id: 'ingredient.tomato', name: 'tomato', role: 'freshness', removable: true },
      { id: 'ingredient.aioli', name: 'garlic aioli', role: 'condiment', removable: true },
    ],
  },
  {
    id: 'salad.market-greens',
    name: 'Market Greens',
    price: 10.75,
    category: 'Salads',
    tags: ['vegetarian'],
    ingredients: [
      { id: 'ingredient.greens', name: 'mixed greens', role: 'freshness', removable: false },
      { id: 'ingredient.avocado', name: 'avocado', role: 'fat', removable: true },
      { id: 'ingredient.vinaigrette', name: 'lemon vinaigrette', role: 'acid', removable: true },
    ],
  },
];
