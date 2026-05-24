/**
 * Menu data ported from the static prototype (www/mobile/app.js → MENU).
 *
 * This is the canonical source of menu items for the React application.
 * The data structure is unchanged from the prototype; only the types are explicit.
 *
 * @see www/mobile/app.js → MENU
 */

import type { MenuItemViewModel, MenuCategoryViewModel, ConfigOptionViewModel } from '../view-models/types';

export const MENU_CATEGORIES: MenuCategoryViewModel[] = [
  { id: 'all', label: 'All' },
  { id: 'bagels', label: 'Bagels' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'breakfast', label: 'Breakfast' },
];

export const MENU: MenuItemViewModel[] = [
  // -- BAGELS --
  {
    id: 'everything-bagel-cc',
    name: 'Everything Bagel w/ CC',
    category: 'bagels',
    basePriceCents: 595,
    description: 'Toasted everything bagel with scallion cream cheese',
    ingredients: [
      { id: 'everything-bagel', name: 'Everything Bagel', roles: ['structural'], required: true, dietary: [] },
      { id: 'scallion-cc', name: 'Scallion Cream Cheese', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'plain-bagel-butter',
    name: 'Plain Bagel w/ Butter',
    category: 'bagels',
    basePriceCents: 395,
    description: 'Warm toasted plain bagel with butter',
    ingredients: [
      { id: 'plain-bagel', name: 'Plain Bagel', roles: ['structural'], required: true, dietary: [] },
      { id: 'butter', name: 'Butter', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'sesame-bagel-lox',
    name: 'Sesame Bagel w/ Lox',
    category: 'bagels',
    basePriceCents: 995,
    description: 'Sesame bagel with smoked salmon, cream cheese, capers, and red onion',
    ingredients: [
      { id: 'sesame-bagel', name: 'Sesame Bagel', roles: ['structural'], required: true, dietary: [] },
      { id: 'lox', name: 'Smoked Salmon', roles: ['protein', 'umami'], required: false, dietary: [] },
      { id: 'cc', name: 'Cream Cheese', roles: ['richness', 'moisture', 'binding'], required: false, dietary: ['dairy_free'] },
      { id: 'capers', name: 'Capers', roles: ['acidity', 'garnish'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'red-onion', name: 'Red Onion', roles: ['crunch', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
    ],
    dietary: [],
    allergens: ['gluten', 'dairy', 'fish'],
  },

  // -- SANDWICHES --
  {
    id: 'classic-blta',
    name: 'Classic BLTA',
    category: 'sandwiches',
    basePriceCents: 1195,
    description: 'Bacon, lettuce, tomato, avocado on toasted sourdough',
    ingredients: [
      { id: 'sourdough', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'bacon', name: 'Bacon', roles: ['protein', 'umami', 'heat'], required: false, dietary: [] },
      { id: 'lettuce', name: 'Lettuce', roles: ['crunch', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'tomato', name: 'Tomato', roles: ['acidity', 'freshness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'avocado', name: 'Avocado', roles: ['richness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free', 'gluten_free'] },
      { id: 'mayo', name: 'Mayonnaise', roles: ['moisture', 'binding'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: [],
    allergens: ['gluten', 'eggs'],
  },
  {
    id: 'turkey-club',
    name: 'Turkey Club',
    category: 'sandwiches',
    basePriceCents: 1295,
    description: 'Roasted turkey, bacon, lettuce, tomato, mayo on triple-deck wheat',
    ingredients: [
      { id: 'wheat-bread', name: 'Wheat Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'turkey', name: 'Roasted Turkey', roles: ['protein'], required: false, dietary: [] },
      { id: 'bacon-2', name: 'Bacon', roles: ['umami', 'crunch'], required: false, dietary: [] },
      { id: 'lettuce-2', name: 'Lettuce', roles: ['crunch', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'tomato-2', name: 'Tomato', roles: ['acidity', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'mayo-2', name: 'Mayonnaise', roles: ['moisture', 'binding'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: [],
    allergens: ['gluten', 'eggs'],
  },
  {
    id: 'grilled-cheese',
    name: 'Grilled Cheese',
    category: 'sandwiches',
    basePriceCents: 895,
    description: 'Melted cheddar and American on griddled sourdough',
    ingredients: [
      { id: 'sourdough-2', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'cheddar', name: 'Cheddar Cheese', roles: ['protein', 'richness', 'umami'], required: false, dietary: ['dairy_free'] },
      { id: 'american', name: 'American Cheese', roles: ['richness', 'moisture', 'binding'], required: false, dietary: ['dairy_free'] },
      { id: 'butter-2', name: 'Butter', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: ['vegetarian'],
    allergens: ['gluten', 'dairy'],
  },
  {
    id: 'italian-hero',
    name: 'Italian Hero',
    category: 'sandwiches',
    basePriceCents: 1395,
    description: 'Capicola, mortadella, provolone, lettuce, tomato, onion, oil & vinegar on a hero roll',
    ingredients: [
      { id: 'hero-roll', name: 'Hero Roll', roles: ['structural'], required: true, dietary: [] },
      { id: 'capicola', name: 'Capicola', roles: ['protein', 'umami'], required: false, dietary: [] },
      { id: 'mortadella', name: 'Mortadella', roles: ['protein', 'richness'], required: false, dietary: [] },
      { id: 'provolone', name: 'Provolone', roles: ['richness', 'umami'], required: false, dietary: ['dairy_free'] },
      { id: 'lettuce-3', name: 'Lettuce', roles: ['crunch'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'tomato-3', name: 'Tomato', roles: ['acidity', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'onion', name: 'Red Onion', roles: ['crunch', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'oil-vinegar', name: 'Oil & Vinegar', roles: ['moisture', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
    ],
    dietary: [],
    allergens: ['gluten', 'dairy'],
  },

  // -- BREAKFAST SANDWICHES --
  {
    id: 'bacon-egg-cheese',
    name: 'Bacon, Egg & Cheese',
    category: 'breakfast',
    basePriceCents: 795,
    description: 'Fried egg, cheddar, bacon on a kaiser roll',
    ingredients: [
      { id: 'kaiser', name: 'Kaiser Roll', roles: ['structural'], required: true, dietary: [] },
      { id: 'fried-egg', name: 'Fried Egg', roles: ['protein', 'binding', 'richness'], required: false, dietary: [] },
      { id: 'cheddar-2', name: 'Cheddar Cheese', roles: ['richness', 'umami'], required: false, dietary: ['dairy_free'] },
      { id: 'bacon-3', name: 'Bacon', roles: ['protein', 'umami', 'crunch'], required: false, dietary: [] },
    ],
    dietary: [],
    allergens: ['gluten', 'dairy', 'eggs'],
  },
  {
    id: 'sausage-egg-cheese',
    name: 'Sausage, Egg & Cheese',
    category: 'breakfast',
    basePriceCents: 895,
    description: 'Pork sausage patty, egg, American cheese on a biscuit',
    ingredients: [
      { id: 'biscuit', name: 'Buttermilk Biscuit', roles: ['structural'], required: true, dietary: [] },
      { id: 'sausage', name: 'Pork Sausage', roles: ['protein', 'umami', 'richness'], required: false, dietary: [] },
      { id: 'egg-2', name: 'Fried Egg', roles: ['protein', 'binding'], required: false, dietary: [] },
      { id: 'american-2', name: 'American Cheese', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: [],
    allergens: ['gluten', 'dairy', 'eggs'],
  },
  {
    id: 'avocado-toast-egg',
    name: 'Avocado Toast w/ Egg',
    category: 'breakfast',
    basePriceCents: 1095,
    description: 'Smashed avocado, poached egg, chili flakes, everything seasoning on sourdough',
    ingredients: [
      { id: 'sourdough-3', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'avocado-2', name: 'Smashed Avocado', roles: ['richness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free', 'gluten_free'] },
      { id: 'poached-egg', name: 'Poached Egg', roles: ['protein', 'richness'], required: false, dietary: [] },
      { id: 'chili-flakes', name: 'Chili Flakes', roles: ['heat', 'garnish'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'everything-seasoning', name: 'Everything Seasoning', roles: ['garnish', 'umami'], required: false, dietary: ['vegan', 'dairy_free'] },
    ],
    dietary: ['vegetarian'],
    allergens: ['gluten', 'eggs'],
  },
  {
    id: 'western-omelet-sandwich',
    name: 'Western Omelet Sandwich',
    category: 'breakfast',
    basePriceCents: 995,
    description: 'Ham, peppers, onion, cheddar omelet on a kaiser roll',
    ingredients: [
      { id: 'kaiser-2', name: 'Kaiser Roll', roles: ['structural'], required: true, dietary: [] },
      { id: 'omelet', name: 'Western Omelet', roles: ['protein', 'binding'], required: false, dietary: [] },
      { id: 'ham', name: 'Ham', roles: ['protein', 'umami'], required: false, dietary: [] },
      { id: 'peppers', name: 'Bell Peppers', roles: ['crunch', 'freshness', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'onion-2', name: 'Onion', roles: ['crunch', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'cheddar-3', name: 'Cheddar Cheese', roles: ['richness', 'umami'], required: false, dietary: ['dairy_free'] },
    ],
    dietary: [],
    allergens: ['gluten', 'dairy', 'eggs'],
  },
];

// ─── CONFIG OPTIONS ────────────────────────────────────────────────────

export const CONFIG_OPTIONS: Record<string, ConfigOptionViewModel[]> = {
  bagels: [
    { key: 'toast', label: 'Toast', values: ['Toasted', 'Untoasted'], defaultIndex: 0 },
  ],
  sandwiches: [
    { key: 'bread', label: 'Bread', values: ['Standard', 'Extra Toast'], defaultIndex: 0 },
    { key: 'cut', label: 'Cut', values: ['Whole', 'Half'], defaultIndex: 0 },
  ],
  breakfast: [
    { key: 'egg', label: 'Egg', values: ['Fried', 'Scrambled', 'Over Easy'], defaultIndex: 0 },
    { key: 'cheese_melt', label: 'Cheese', values: ['Melted', 'Cold'], defaultIndex: 0 },
  ],
};
