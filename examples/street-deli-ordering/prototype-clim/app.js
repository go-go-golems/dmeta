/* === HUDSON STREET DELI — CLIM Presentation-Based UI === */
/* app.js — Two interaction modes:                                  */
/*   Normal: click presentation → show actions, click action → exec */
/*   Select: type action → presentations with matching args go red, */
/*           click red presentation → execute action(arg)            */

// ─── MENU DATA ───────────────────────────────────────────────────────
const MENU = [
  { id: 'everything-bagel-cc', name: 'Everything Bagel w/ CC', category: 'bagels', basePrice: 595,
    ingredients: [
      { id: 'everything-bagel', name: 'Everything Bagel', roles: ['structural'], required: true, dietary: [] },
      { id: 'scallion-cc', name: 'Scallion Cream Cheese', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ], dietary: ['vegetarian'], allergens: ['gluten', 'dairy'] },
  { id: 'plain-bagel-butter', name: 'Plain Bagel w/ Butter', category: 'bagels', basePrice: 395,
    ingredients: [
      { id: 'plain-bagel', name: 'Plain Bagel', roles: ['structural'], required: true, dietary: [] },
      { id: 'butter', name: 'Butter', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ], dietary: ['vegetarian'], allergens: ['gluten', 'dairy'] },
  { id: 'sesame-bagel-lox', name: 'Sesame Bagel w/ Lox', category: 'bagels', basePrice: 995,
    ingredients: [
      { id: 'sesame-bagel', name: 'Sesame Bagel', roles: ['structural'], required: true, dietary: [] },
      { id: 'lox', name: 'Smoked Salmon', roles: ['protein', 'umami'], required: false, dietary: [] },
      { id: 'cc', name: 'Cream Cheese', roles: ['richness', 'moisture', 'binding'], required: false, dietary: ['dairy_free'] },
      { id: 'capers', name: 'Capers', roles: ['acidity', 'garnish'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'red-onion', name: 'Red Onion', roles: ['crunch', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
    ], dietary: [], allergens: ['gluten', 'dairy', 'fish'] },
  { id: 'classic-blta', name: 'Classic BLTA', category: 'sandwiches', basePrice: 1195,
    ingredients: [
      { id: 'sourdough', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'bacon', name: 'Bacon', roles: ['protein', 'umami', 'heat'], required: false, dietary: [] },
      { id: 'lettuce', name: 'Lettuce', roles: ['crunch', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'tomato', name: 'Tomato', roles: ['acidity', 'freshness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'avocado', name: 'Avocado', roles: ['richness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free', 'gluten_free'] },
      { id: 'mayo', name: 'Mayonnaise', roles: ['moisture', 'binding'], required: false, dietary: ['dairy_free'] },
    ], dietary: [], allergens: ['gluten', 'eggs'] },
  { id: 'turkey-club', name: 'Turkey Club', category: 'sandwiches', basePrice: 1295,
    ingredients: [
      { id: 'wheat-bread', name: 'Wheat Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'turkey', name: 'Roasted Turkey', roles: ['protein'], required: false, dietary: [] },
      { id: 'bacon-2', name: 'Bacon', roles: ['umami', 'crunch'], required: false, dietary: [] },
      { id: 'lettuce-2', name: 'Lettuce', roles: ['crunch', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'tomato-2', name: 'Tomato', roles: ['acidity', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'mayo-2', name: 'Mayonnaise', roles: ['moisture', 'binding'], required: false, dietary: ['dairy_free'] },
    ], dietary: [], allergens: ['gluten', 'eggs'] },
  { id: 'grilled-cheese', name: 'Grilled Cheese', category: 'sandwiches', basePrice: 895,
    ingredients: [
      { id: 'sourdough-2', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'cheddar', name: 'Cheddar Cheese', roles: ['protein', 'richness', 'umami'], required: false, dietary: ['dairy_free'] },
      { id: 'american', name: 'American Cheese', roles: ['richness', 'moisture', 'binding'], required: false, dietary: ['dairy_free'] },
      { id: 'butter-2', name: 'Butter', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ], dietary: ['vegetarian'], allergens: ['gluten', 'dairy'] },
  { id: 'italian-hero', name: 'Italian Hero', category: 'sandwiches', basePrice: 1395,
    ingredients: [
      { id: 'hero-roll', name: 'Hero Roll', roles: ['structural'], required: true, dietary: [] },
      { id: 'capicola', name: 'Capicola', roles: ['protein', 'umami'], required: false, dietary: [] },
      { id: 'mortadella', name: 'Mortadella', roles: ['protein', 'richness'], required: false, dietary: [] },
      { id: 'provolone', name: 'Provolone', roles: ['richness', 'umami'], required: false, dietary: ['dairy_free'] },
      { id: 'lettuce-3', name: 'Lettuce', roles: ['crunch'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'tomato-3', name: 'Tomato', roles: ['acidity', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'onion', name: 'Red Onion', roles: ['crunch', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'oil-vinegar', name: 'Oil & Vinegar', roles: ['moisture', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
    ], dietary: [], allergens: ['gluten', 'dairy'] },
  { id: 'bacon-egg-cheese', name: 'Bacon, Egg & Cheese', category: 'breakfast', basePrice: 795,
    ingredients: [
      { id: 'kaiser', name: 'Kaiser Roll', roles: ['structural'], required: true, dietary: [] },
      { id: 'fried-egg', name: 'Fried Egg', roles: ['protein', 'binding', 'richness'], required: false, dietary: [] },
      { id: 'cheddar-2', name: 'Cheddar Cheese', roles: ['richness', 'umami'], required: false, dietary: ['dairy_free'] },
      { id: 'bacon-3', name: 'Bacon', roles: ['protein', 'umami', 'crunch'], required: false, dietary: [] },
    ], dietary: [], allergens: ['gluten', 'dairy', 'eggs'] },
  { id: 'sausage-egg-cheese', name: 'Sausage, Egg & Cheese', category: 'breakfast', basePrice: 895,
    ingredients: [
      { id: 'biscuit', name: 'Buttermilk Biscuit', roles: ['structural'], required: true, dietary: [] },
      { id: 'sausage', name: 'Pork Sausage', roles: ['protein', 'umami', 'richness'], required: false, dietary: [] },
      { id: 'egg-2', name: 'Fried Egg', roles: ['protein', 'binding'], required: false, dietary: [] },
      { id: 'american-2', name: 'American Cheese', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
    ], dietary: [], allergens: ['gluten', 'dairy', 'eggs'] },
  { id: 'avocado-toast-egg', name: 'Avocado Toast w/ Egg', category: 'breakfast', basePrice: 1095,
    ingredients: [
      { id: 'sourdough-3', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
      { id: 'avocado-2', name: 'Smashed Avocado', roles: ['richness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free', 'gluten_free'] },
      { id: 'poached-egg', name: 'Poached Egg', roles: ['protein', 'richness'], required: false, dietary: [] },
      { id: 'chili-flakes', name: 'Chili Flakes', roles: ['heat', 'garnish'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'everything-seasoning', name: 'Everything Seasoning', roles: ['garnish', 'umami'], required: false, dietary: ['vegan', 'dairy_free'] },
    ], dietary: ['vegetarian'], allergens: ['gluten', 'eggs'] },
  { id: 'western-omelet-sandwich', name: 'Western Omelet Sandwich', category: 'breakfast', basePrice: 995,
    ingredients: [
      { id: 'kaiser-2', name: 'Kaiser Roll', roles: ['structural'], required: true, dietary: [] },
      { id: 'omelet', name: 'Western Omelet', roles: ['protein', 'binding'], required: false, dietary: [] },
      { id: 'ham', name: 'Ham', roles: ['protein', 'umami'], required: false, dietary: [] },
      { id: 'peppers', name: 'Bell Peppers', roles: ['crunch', 'freshness', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'onion-2', name: 'Onion', roles: ['crunch', 'acidity'], required: false, dietary: ['vegan', 'dairy_free'] },
      { id: 'cheddar-3', name: 'Cheddar Cheese', roles: ['richness', 'umami'], required: false, dietary: ['dairy_free'] },
    ], dietary: [], allergens: ['gluten', 'dairy', 'eggs'] },
];

// ─── SUBSTITUTION RULES ─────────────────────────────────────────────
const SUBS = {
  'bacon': { candidates: [
    { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'vegetarian', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Smoky protein and umami.' },
    { name: 'Tempeh Bacon', roles: ['protein', 'umami', 'crunch'], dietary: ['vegan', 'vegetarian', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 200, auto: true, reasoning: 'Mimics bacon crunch and smokiness.' },
    { name: 'Turkey Bacon', roles: ['protein', 'umami'], dietary: [], allergens: [], flavor: 'similar', priceDelta: 0, auto: false, reasoning: 'Lighter protein, familiar flavor.' },
  ]},
  'cc': { candidates: [
    { name: 'Avocado', roles: ['richness', 'moisture', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Richness and creaminess. Dairy-free.' },
    { name: 'Hummus', roles: ['richness', 'moisture', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 100, auto: false, reasoning: 'Mediterranean shift.' },
  ]},
  'scallion-cc': null,
  'cheddar': { candidates: [
    { name: 'Avocado', roles: ['richness', 'moisture', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Replaces cheese richness.' },
    { name: 'Nutritional Yeast', roles: ['umami', 'garnish'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Cheesy umami without dairy.' },
    { name: 'Cashew Cheese', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free'], allergens: ['tree_nuts'], flavor: 'similar', priceDelta: 200, auto: false, reasoning: 'Creamy like dairy cheese.' },
  ]},
  'american': { candidates: [
    { name: 'Avocado', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Smooth richness, plant-based.' },
    { name: 'Hummus', roles: ['richness', 'moisture', 'binding'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 100, auto: false, reasoning: 'Binding moisture.' },
  ]},
  'provolone': { candidates: [
    { name: 'Avocado', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Replaces provolone richness.' },
    { name: 'Roasted Peppers', roles: ['richness', 'acidity', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Italian-compatible.' },
  ]},
  'butter': { candidates: [
    { name: 'Avocado Mash', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Creamy spread without dairy.' },
    { name: 'Olive Oil', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Classic dairy-free fat.' },
  ]},
  'mayo': { candidates: [
    { name: 'Hummus', roles: ['moisture', 'richness', 'binding', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Replaces mayo moisture and binding.' },
    { name: 'Avocado Mash', roles: ['moisture', 'richness', 'binding'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Closest neutral replacement.' },
    { name: 'Mustard', roles: ['moisture', 'acidity'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Tangy and bright.' },
  ]},
  'sourdough': { candidates: [
    { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'GF structural replacement.' },
    { name: 'Collard Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 100, auto: true, reasoning: 'Sturdier wrap.' },
  ]},
  'wheat-bread': { candidates: [
    { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'GF replacement.' },
    { name: 'Gluten-Free Bread', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Familiar sandwich experience.' },
  ]},
  'kaiser': { candidates: [
    { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Fresh structural replacement.' },
    { name: 'Gluten-Free Roll', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Familiar roll, no gluten.' },
  ]},
  'hero-roll': { candidates: [
    { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'GF replacement.' },
    { name: 'Gluten-Free Roll', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDelta: 200, auto: true, reasoning: 'Hero-style substitute.' },
  ]},
  'biscuit': { candidates: [
    { name: 'English Muffin', roles: ['structural'], dietary: [], allergens: ['gluten'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Similar structural role.' },
    { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'GF option.' },
  ]},
  'lox': { candidates: [
    { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Smoky protein substitute.' },
    { name: 'Cucumber Slices', roles: ['freshness', 'crunch'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Fresh. Loses protein.' },
  ]},
  'fried-egg': { candidates: [
    { name: 'Tofu Scramble', roles: ['protein', 'binding'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'complementary', priceDelta: 100, auto: true, reasoning: 'Protein and binding, plant-based.' },
    { name: 'Extra Cheese', roles: ['protein', 'richness', 'binding'], dietary: ['vegetarian'], allergens: ['dairy'], flavor: 'similar', priceDelta: 50, auto: false, reasoning: 'Protein through dairy.' },
  ]},
  'turkey': { candidates: [
    { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Protein and umami substitute.' },
    { name: 'Grilled Chicken', roles: ['protein'], dietary: [], allergens: [], flavor: 'similar', priceDelta: 0, auto: false, reasoning: 'Familiar flavor.' },
  ]},
  'capicola': { candidates: [
    { name: 'Roasted Eggplant', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Earthy umami. Good on Italian sandwiches.' },
    { name: 'Grilled Zucchini', roles: ['freshness', 'crunch'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Fresh and mild.' },
  ]},
  'mortadella': { candidates: [
    { name: 'Hummus', roles: ['richness', 'moisture', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Replaces richness, adds umami.' },
    { name: 'Roasted Peppers', roles: ['richness', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Italian-compatible.' },
  ]},
  'ham': { candidates: [
    { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Smoky protein substitute.' },
    { name: 'Roasted Mushrooms', roles: ['umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 50, auto: false, reasoning: 'Deep umami.' },
  ]},
  'sausage': { candidates: [
    { name: 'Veggie Sausage', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain soy'], flavor: 'similar', priceDelta: 100, auto: true, reasoning: 'Mimics breakfast sausage.' },
    { name: 'Grilled Portobello', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 100, auto: false, reasoning: 'Earthy and savory.' },
  ]},
};

function resolveSubKey(id) {
  if (SUBS[id] && SUBS[id] !== null) return id;
  const base = id.replace(/-\d+$/, '');
  if (SUBS[base] && SUBS[base] !== null) return base;
  for (const [key, val] of Object.entries(SUBS)) {
    if (val && val !== null) {
      for (const item of MENU) {
        const src = item.ingredients.find(i => i.id === key);
        const tgt = item.ingredients.find(i => i.id === id);
        if (src && tgt && src.name === tgt.name) return key;
      }
    }
  }
  return id;
}

// ─── ACTION REGISTRY ────────────────────────────────────────────────
const ACTIONS = [
  // Navigation
  { id: 'MENU', label: 'MENU', argTypes: [], applicableTo: ['*'],
    description: 'Return to menu browsing.', fn: () => renderMenu() },
  { id: 'CART', label: 'CART', argTypes: [], applicableTo: ['*'],
    description: 'View order cart.', fn: () => renderCart() },
  { id: 'BACK', label: 'BACK', argTypes: [], applicableTo: ['detail'],
    description: 'Return to previous view.', fn: () => renderMenu() },
  { id: 'HELP', label: 'HELP', argTypes: [], applicableTo: ['*'],
    description: 'List all available actions and their argument types.', fn: () => renderHelp() },

  // MenuItem
  { id: 'CUSTOMIZE', label: 'CUSTOMIZE', argTypes: ['MenuItem'], applicableTo: ['menu'],
    description: 'Open customizer for <MenuItem>. Modify ingredients, apply substitutions.',
    fn: (id) => openDetail(id) },
  { id: 'ADD-TO-ORDER', label: 'ADD-TO-ORDER', argTypes: ['MenuItem'], applicableTo: ['menu', 'detail'],
    description: 'Add <MenuItem> to order with current customization.',
    fn: () => addToCart() },
  { id: 'DESCRIBE', label: 'DESCRIBE', argTypes: ['MenuItem', 'Ingredient', 'SubstitutedIngredient', 'OrderItem', 'Substitution'], applicableTo: ['menu', 'detail', 'cart'],
    description: 'Show full description of the selected object.',
    fn: (id, idx, type) => describeObject(id, idx, type) },
  { id: 'FILTER-BY-CATEGORY', label: 'FILTER-BY-CATEGORY', argTypes: [], applicableTo: ['menu'],
    description: 'Filter menu by category (bagels, sandwiches, breakfast).',
    fn: () => filterCategory() },

  // Ingredient
  { id: 'REMOVE-INGREDIENT', label: 'REMOVE-INGREDIENT', argTypes: ['Ingredient'], applicableTo: ['detail'],
    description: 'Remove <Ingredient> from composition. Triggers substitution search.',
    fn: (id) => removeIngredient(id) },
  { id: 'SHOW-SUBSTITUTIONS', label: 'SHOW-SUBSTITUTIONS', argTypes: ['Ingredient', 'RemovedIngredient'], applicableTo: ['detail'],
    description: 'Show all substitution candidates for <Ingredient>.',
    fn: (id) => showSubstitutionsFor(id) },
  { id: 'RESTORE-INGREDIENT', label: 'RESTORE-INGREDIENT', argTypes: ['RemovedIngredient', 'SubstitutedIngredient'], applicableTo: ['detail'],
    description: 'Restore <Ingredient> to composition (undo removal or substitution).',
    fn: (id) => restoreIngredient(id) },
  { id: 'UNDO-SUBSTITUTION', label: 'UNDO-SUBSTITUTION', argTypes: ['SubstitutedIngredient'], applicableTo: ['detail'],
    description: 'Undo applied substitution, keeping ingredient removed. Pick a different replacement.',
    fn: (id) => undoSubstitution(id) },
  { id: 'ALTERNATIVES', label: 'ALTERNATIVES', argTypes: ['SubstitutedIngredient'], applicableTo: ['detail'],
    description: 'Show other substitution candidates besides the currently applied one.',
    fn: (id) => showAlternatives(id) },

  // Substitution
  { id: 'APPLY', label: 'APPLY', argTypes: ['Substitution'], applicableTo: ['detail'],
    description: 'Apply <Substitution> candidate to replace removed ingredient.',
    fn: (id, idx) => applySubstitution(id, idx) },

  // Cart
  { id: 'PLACE-ORDER', label: 'PLACE-ORDER', argTypes: [], applicableTo: ['cart'],
    description: 'Submit order for preparation.',
    fn: () => placeOrder() },
  { id: 'REMOVE-FROM-CART', label: 'REMOVE-FROM-CART', argTypes: ['OrderItem'], applicableTo: ['cart'],
    description: 'Remove <OrderItem> from cart.',
    fn: (id) => removeFromCart(id) },
  { id: 'INSPECT', label: 'INSPECT', argTypes: ['OrderItem'], applicableTo: ['cart'],
    description: 'Show full detail of <OrderItem> including applied substitutions.',
    fn: (id) => inspectOrderItem(id) },
  { id: 'EDIT', label: 'EDIT', argTypes: ['OrderItem'], applicableTo: ['cart'],
    description: 'Re-customize <OrderItem> (remove from cart, open in customizer).',
    fn: (id) => editOrderItem(id) },

  // Dietary
  { id: 'FILTER-DIETARY', label: 'FILTER-DIETARY', argTypes: [], applicableTo: ['menu'],
    description: 'Filter menu by dietary tag (vegan, GF, DF, etc.).',
    fn: () => filterDietary() },
];

// ─── STATE ───────────────────────────────────────────────────────────
const state = {
  view: 'menu',
  mode: 'normal',         // 'normal' | 'select'
  selected: null,          // { type, id, idx } — the currently selected presentation
  pendingAction: null,     // action object — the action waiting for argument selection
  customizing: null,
  cart: [],
  orderNum: 0,
  cmdBuffer: '',
  cmdHistory: [],
  contextMenu: null,
};

// ─── HELPERS ─────────────────────────────────────────────────────────
function fmt(c) { return '$' + (c / 100).toFixed(2); }
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function esc(s) { const d = document.createElement('span'); d.textContent = s; return d.innerHTML; }

function setView(name) {
  state.view = name;
  $$('.view').forEach(v => v.classList.remove('active'));
  const el = $(`#view-${name}`);
  if (el) el.classList.add('active');
  $('#mode-label').textContent = name.toUpperCase();
  closeContextMenu();
  exitSelectMode();
  deselectAll();
}

function setCmdBar(viewId, text) { const el = $(`#cmd-text-${viewId}`); if (el) el.textContent = text; }
function setActions(viewId, html) { const el = $(`#cmd-actions-${viewId}`); if (el) el.innerHTML = html; }
function setHint(text) { $('#cmd-hint').textContent = text; }

function clearMain() {
  ['menu', 'detail', 'substitution', 'cart', 'help', 'tracker'].forEach(v => {
    const el = $(`#${v}-presentations`); if (el) el.innerHTML = '';
    setCmdBar(v, ''); setActions(v, '');
  });
}

// ─── MODE: NORMAL vs SELECT ──────────────────────────────────────────
// Normal mode: click presentation → select it → show applicable actions
//              click action → execute action(selectedPresentation)
// Select mode: typed an action that takes args → compatible presentations turn red
//              click a red presentation → execute action(presentation)
//              ESC or click non-red area → cancel select mode

function enterSelectMode(action) {
  state.mode = 'select';
  state.pendingAction = action;
  state.selected = null;
  // Mark all compatible presentations as selectable (red)
  const argTypes = action.argTypes;
  $$('.pres').forEach(el => {
    const pType = el.dataset.type;
    if (pType && argTypes.includes(pType)) {
      el.classList.add('selectable');
    } else {
      el.classList.add('select-disabled');
    }
  });
  updateModeIndicator();
  setHint(`${action.label} — click a <${action.argTypes.join('> or <')}> to apply. ESC to cancel.`);
}

function exitSelectMode() {
  state.mode = 'normal';
  state.pendingAction = null;
  $$('.pres').forEach(el => {
    el.classList.remove('selectable', 'select-disabled');
  });
  updateModeIndicator();
}

function updateModeIndicator() {
  const label = $('#mode-label');
  if (state.mode === 'select' && state.pendingAction) {
    label.textContent = `${state.view.toUpperCase()} ▸ ${state.pendingAction.label}`;
    label.style.color = '#ff4444';
  } else {
    label.textContent = state.view.toUpperCase();
    label.style.color = '';
  }
}

// ─── SELECTION ──────────────────────────────────────────────────────
function deselectAll() {
  state.selected = null;
  $$('.pres.selected').forEach(el => el.classList.remove('selected'));
  clearActionBar();
}

function selectPresentation(el, type, id, idx) {
  deselectAll();
  state.selected = { type, id, idx: idx ?? null };
  el.classList.add('selected');
  showActionsFor(type, id, idx);
}

function clearActionBar() {
  const el = $(`#cmd-actions-${state.view}`);
  if (el) el.innerHTML = '';
}

function getActionsForType(type, view) {
  const v = view || state.view;
  return ACTIONS.filter(a => {
    if (a.applicableTo.includes('*')) return true;
    if (!a.applicableTo.includes(v)) return false;
    if (a.argTypes.length === 0) return true;
    return a.argTypes.includes(type);
  });
}

function showActionsFor(type, id, idx) {
  const actions = getActionsForType(type);
  const el = $(`#cmd-actions-${state.view}`);
  if (!el) return;
  let html = actions.map(a => {
    const canExec = canExecuteAction(a, type, id, idx);
    const cls = canExec ? 'action' : 'action disabled';
    return `<span class="${cls}" onclick="executeActionFromBar('${a.id}','${type}','${id}',${idx ?? 'null'})">${a.label}</span>`;
  }).join('  ');
  el.innerHTML = html;
  setHint(`Selected <${type}>. Actions: ${actions.filter(a => canExecuteAction(a, type, id, idx)).map(a => a.label).join(', ')}`);
}

function canExecuteAction(action, type, id, idx) {
  if (action.argTypes.length === 0) return true;
  if (action.argTypes.includes(type)) return true;
  return false;
}

// Execute action from action bar click (normal mode: action + selected presentation)
function executeActionFromBar(actionId, type, id, idx) {
  const action = ACTIONS.find(a => a.id === actionId);
  if (!action) { setHint(`Unknown action: ${actionId}`); return; }
  if (!canExecuteAction(action, type, id, idx)) {
    // Enter select mode instead — action needs a different argument type
    enterSelectMode(action);
    return;
  }
  action.fn(id, idx, type);
}

// Execute action with a clicked presentation (select mode)
function executePendingAction(type, id, idx) {
  if (!state.pendingAction) return;
  const action = state.pendingAction;
  if (!action.argTypes.includes(type)) {
    setHint(`<${type}> is not valid for ${action.label}. Need <${action.argTypes.join('> or <')}>.`);
    return;
  }
  action.fn(id, idx, type);
  exitSelectMode();
}

// ─── PRESENTATION CLICK DISPATCH ───────────────────────────────────
function handlePresentationClick(type, id, idx, event) {
  if (event && event.button === 2) return; // right-click handled separately
  closeContextMenu();

  if (state.mode === 'select') {
    // In select mode: click only works on selectable (red) presentations
    const el = event?.currentTarget || event?.target;
    if (el && el.classList.contains('selectable')) {
      executePendingAction(type, id, idx);
    } else {
      setHint(`Not a valid target for ${state.pendingAction?.label || '?'}. Click a red <${state.pendingAction?.argTypes?.join('> or <')}> or ESC to cancel.`);
    }
    return;
  }

  // Normal mode: click selects the presentation and shows actions
  selectPresentation(event?.currentTarget || event?.target, type, id, idx);
}

function handlePresentationContext(type, id, idx, event) {
  event.preventDefault();
  if (state.mode === 'select') return; // no context menu in select mode
  showContextMenu(event.pageX, event.pageY, type, id, idx);
}

// ─── CONTEXT MENU ──────────────────────────────────────────────────
function showContextMenu(x, y, type, id, idx) {
  closeContextMenu();
  const actions = getActionsForType(type);
  const menu = document.createElement('div');
  menu.id = 'context-menu';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';

  let html = `<div class="ctx-header">&lt;${type}&gt; Actions</div>`;
  for (const a of actions) {
    const canExec = canExecuteAction(a, type, id, idx);
    const cls = canExec ? 'ctx-item' : 'ctx-item disabled';
    html += `<div class="${cls}" onclick="executeActionFromBar('${a.id}','${type}','${id}',${idx ?? 'null'});closeContextMenu()">${a.label} <span class="ctx-desc">${esc(a.description)}</span></div>`;
  }
  menu.innerHTML = html;
  document.body.appendChild(menu);
  state.contextMenu = menu;
}

function closeContextMenu() {
  if (state.contextMenu) { state.contextMenu.remove(); state.contextMenu = null; }
}

document.addEventListener('click', (e) => {
  if (state.contextMenu && !state.contextMenu.contains(e.target)) closeContextMenu();
});

// ─── RENDER HELP ────────────────────────────────────────────────────
function renderHelp() {
  setView('help');
  clearMain();
  const container = $('#help-presentations');
  container.innerHTML = '';

  let html = '<span class="section-label">Available Actions</span>\n';
  html += '<span style="color:var(--fg-dim);font-style:italic">Two interaction modes:</span>\n';
  html += '<span style="color:var(--fg-dim)">  <span style="color:var(--fg-bright)">Normal</span> — click presentation to select, click action to execute.</span>\n';
  html += '<span style="color:var(--fg-dim)">  <span style="color:var(--fg-bright)">Select</span> — type action name, compatible presentations turn <span style="color:#ff4444">red</span>, click to apply.</span>\n';
  html += '<span style="color:var(--fg-dim)">  Right-click any presentation for context menu.</span>\n';
  html += '<span style="color:var(--fg-dim)">  ESC cancels select mode or deselects.</span>\n\n';

  const groups = {
    'Navigation': ['MENU', 'CART', 'BACK', 'HELP'],
    'MenuItem': ['CUSTOMIZE', 'ADD-TO-ORDER', 'DESCRIBE', 'FILTER-BY-CATEGORY'],
    'Ingredient': ['REMOVE-INGREDIENT', 'SHOW-SUBSTITUTIONS', 'RESTORE-INGREDIENT', 'UNDO-SUBSTITUTION', 'ALTERNATIVES'],
    'Substitution': ['APPLY', 'DESCRIBE'],
    'Cart': ['PLACE-ORDER', 'REMOVE-FROM-CART', 'INSPECT', 'EDIT'],
    'Dietary': ['FILTER-DIETARY'],
  };

  for (const [group, ids] of Object.entries(groups)) {
    html += `\n<span class="section-label">${group}</span>\n`;
    for (const id of ids) {
      const action = ACTIONS.find(a => a.id === id);
      if (!action) continue;
      const argStr = action.argTypes.length ? action.argTypes.map(t => `<${t}>`).join(' ') : '(no args)';
      html += `<span class="pres-block" style="cursor:default">`;
      html += `  <span style="color:var(--fg-bright);font-weight:700">${action.label}</span>`;
      html += `  <span class="role">${argStr}</span>`;
      html += `</span>\n`;
      html += `<span class="indent" style="color:var(--fg-dim)">${esc(action.description)}</span>\n`;
    }
  }

  html += '\n<span class="section-label">Presentation Types</span>\n';
  const types = [
    ['MenuItem', 'A menu item. Click to select, CUSTOMIZE or DESCRIBE.'],
    ['Ingredient', 'Active ingredient. REMOVE-INGREDIENT or SHOW-SUBSTITUTIONS.'],
    ['Ingredient★', 'Required structural ingredient.'],
    ['RemovedIngredient', 'Removed from composition. RESTORE-INGREDIENT or SHOW-SUBSTITUTIONS.'],
    ['SubstitutedIngredient', 'Replaced by a substitution. UNDO-SUBSTITUTION or ALTERNATIVES.'],
    ['Substitution', 'Replacement candidate. APPLY or DESCRIBE.'],
    ['Substitution ★auto', 'System-recommended replacement (highest compatibility).'],
    ['OrderItem', 'Item in cart. REMOVE-FROM-CART, INSPECT, or EDIT.'],
  ];
  for (const [t, d] of types) {
    html += `<span class="pres-block" style="cursor:default"><span class="pres-type">&lt;${t}&gt;</span> ${esc(d)}</span>\n`;
  }

  html += '\n<span class="section-label">Keyboard</span>\n';
  html += `<span style="color:var(--fg-dim)">Type action + Enter to enter select mode (or execute no-arg actions). ESC cancels select mode / deselects. Click presentation → select → click action → execute.</span>\n`;

  container.innerHTML = html;
  setCmdBar('help', 'HELP');
  setActions('help', '<span class="action" onclick="renderMenu()">MENU</span>');
  setHint('Action reference. Type an action name to enter select mode. Click MENU to return.');
}

// ─── RENDER MENU ────────────────────────────────────────────────────
function renderMenu() {
  setView('menu');
  clearMain();
  const container = $('#menu-presentations');

  let html = '<span class="section-label">Menu</span>\n';
  const categories = ['bagels', 'sandwiches', 'breakfast'];
  const catLabels = { bagels: 'Bagels', sandwiches: 'Sandwiches', breakfast: 'Breakfast' };

  for (const cat of categories) {
    const items = MENU.filter(i => i.category === cat);
    html += `\n<span class="section-label">${catLabels[cat]}</span>\n`;
    for (const item of items) {
      const ingNames = item.ingredients.map(i => i.name).join(', ');
      const dietary = item.dietary.length ? ` [${item.dietary.join(', ')}]` : '';
      html += `<span class="pres pres-block" data-type="MenuItem" data-id="${item.id}" onclick="handlePresentationClick('MenuItem','${item.id}',null,event)" oncontextmenu="handlePresentationContext('MenuItem','${item.id}',null,event)">`;
      html += `  <span class="pres-type">&lt;MenuItem&gt;</span> `;
      html += `${esc(item.name)}`;
      html += ` <span class="pres-id">#${item.id}</span>`;
      html += ` <span class="role">${fmt(item.basePrice)}</span>`;
      html += `${dietary ? ` <span class="role">${dietary}</span>` : ''}`;
      html += `</span>\n`;
      html += `<span class="indent" style="color:var(--fg-dim)">${esc(ingNames)}</span>\n`;
    }
  }

  container.innerHTML = html;
  setCmdBar('menu', 'LIST MENU');
  setActions('menu', '<span class="action" onclick="renderCart()">CART</span>  <span class="action" onclick="filterDietary()">FILTER-DIETARY</span>  <span class="action" onclick="filterCategory()">FILTER-BY-CATEGORY</span>  <span class="action" onclick="renderHelp()">HELP</span>');
  setHint('Click presentation to select + see actions. Type action name to enter select mode. HELP for all commands.');
}

// ─── RENDER DETAIL ───────────────────────────────────────────────────
function openDetail(menuItemId) {
  const menuItem = MENU.find(i => i.id === menuItemId);
  if (!menuItem) return;
  const composition = menuItem.ingredients.map(ing => ({ ...ing, removed: false, substitution: null }));
  state.customizing = { menuItem, composition, currentPriceCents: menuItem.basePrice };
  state.subFor = null;
  renderDetail();
}

function renderDetail() {
  const c = state.customizing;
  if (!c) return;
  setView('detail');
  clearMain();
  const container = $('#detail-presentations');

  let html = `<span class="section-label">Customizing</span>\n`;
  html += `<span class="pres pres-block" data-type="MenuItem" data-id="${c.menuItem.id}" onclick="handlePresentationClick('MenuItem','${c.menuItem.id}',null,event)" oncontextmenu="handlePresentationContext('MenuItem','${c.menuItem.id}',null,event)">`;
  html += `  <span class="pres-type">&lt;MenuItem&gt;</span> ${esc(c.menuItem.name)} <span class="role">${fmt(c.currentPriceCents)}</span></span>\n`;

  html += `\n<span class="section-label">Composition</span>\n`;
  for (const ing of c.composition) { html += renderIngredientPresentation(ing); }

  const removed = c.composition.filter(i => i.removed && !i.substitution);
  for (const ing of removed) { html += renderSubstitutionSuggestion(ing); }

  const subs = c.composition.filter(i => i.substitution);
  if (subs.length > 0) {
    html += `\n<span class="section-label">Applied Substitutions</span>\n`;
    for (const ing of subs) {
      html += `<span class="indent" style="font-style:italic;color:var(--fg-dim)">`;
      html += `${esc(ing.name)} → ${esc(ing.substitution.name)} [${ing.substitution.roles.join(', ')}]`;
      if (ing.substitution.priceDelta) html += ` ${ing.substitution.priceDelta > 0 ? '+' : ''}${fmt(ing.substitution.priceDelta)}`;
      html += `</span>\n`;
    }
  }

  container.innerHTML = html;
  setCmdBar('detail', `CUSTOMIZE ${c.menuItem.name.toUpperCase()}`);
  setActions('detail',
    '<span class="action" onclick="addToCart()">ADD-TO-ORDER</span>  ' +
    '<span class="action" onclick="renderMenu()">BACK</span>  ' +
    '<span class="action" onclick="renderCart()">CART</span>  ' +
    '<span class="action" onclick="renderHelp()">HELP</span>'
  );
  setHint('Click presentation to select + see actions. Type action name for select mode. HELP for all commands.');
}

function renderIngredientPresentation(ing) {
  let html = '';
  const typeStr = ing.required ? '&lt;Ingredient★&gt;' : '&lt;Ingredient&gt;';
  const roleStr = ing.roles.join(', ');

  if (ing.substitution) {
    html += `<span class="pres pres-block ing-substituted" data-type="SubstitutedIngredient" data-id="${ing.id}" onclick="handlePresentationClick('SubstitutedIngredient','${ing.id}',null,event)" oncontextmenu="handlePresentationContext('SubstitutedIngredient','${ing.id}',null,event)">`;
    html += `  <span class="pres-type">${typeStr}</span> `;
    html += `${esc(ing.substitution.name)} <span class="role">(was ${esc(ing.name)})</span>`;
    html += ` <span class="role">[${ing.substitution.roles.join(', ')}]</span>`;
    html += `</span>\n`;
  } else if (ing.removed) {
    html += `<span class="pres pres-block ing-removed" data-type="RemovedIngredient" data-id="${ing.id}" onclick="handlePresentationClick('RemovedIngredient','${ing.id}',null,event)" oncontextmenu="handlePresentationContext('RemovedIngredient','${ing.id}',null,event)">`;
    html += `  <span class="pres-type">${typeStr}</span> `;
    html += `<span style="text-decoration:line-through">${esc(ing.name)}</span>`;
    html += ` <span class="role">[${roleStr}]</span>`;
    html += ` <span style="font-style:italic;color:var(--fg-bright)">removed — roles unfilled</span>`;
    html += `</span>\n`;
  } else {
    html += `<span class="pres pres-block" data-type="Ingredient" data-id="${ing.id}" onclick="handlePresentationClick('Ingredient','${ing.id}',null,event)" oncontextmenu="handlePresentationContext('Ingredient','${ing.id}',null,event)">`;
    html += `  <span class="pres-type">${typeStr}</span> `;
    html += `${esc(ing.name)}`;
    html += ` <span class="role">[${roleStr}]</span>`;
    html += `</span>\n`;
  }
  return html;
}

function renderSubstitutionSuggestion(ing) {
  const key = resolveSubKey(ing.id);
  const rules = SUBS[key];
  if (!rules || !rules.candidates || rules.candidates.length === 0) {
    return `<span class="indent" style="font-style:italic;color:var(--fg-dim)">No substitutions available for ${esc(ing.name)}</span>\n`;
  }

  let html = `\n<span class="section-label indent">Substitutions for ${esc(ing.name)}</span>\n`;
  html += `<span class="indent" style="font-style:italic;color:var(--fg-dim)">Unfilled roles: ${ing.roles.join(', ')}</span>\n`;

  for (let ci = 0; ci < rules.candidates.length; ci++) {
    const cand = rules.candidates[ci];
    const priceStr = cand.priceDelta > 0 ? `+${fmt(cand.priceDelta)}` : 'no extra';
    const autoTag = cand.auto ? ' ★auto' : '';
    const allergenStr = cand.allergens.length ? ` <span class="sub-allergen">⚠ ${cand.allergens.join(', ')}</span>` : '';

    html += `<span class="sub-candidate${cand.auto ? ' auto' : ''}" data-type="Substitution" data-id="${ing.id}" data-idx="${ci}" onclick="handlePresentationClick('Substitution','${ing.id}',${ci},event)" oncontextmenu="handlePresentationContext('Substitution','${ing.id}',${ci},event)">`;
    html += `<span class="sub-arrow">→</span>`;
    html += `<span class="pres-type">&lt;Substitution${autoTag}&gt;</span> `;
    html += `${esc(cand.name)}`;
    html += ` <span class="role">[${cand.roles.join(', ')}]</span>`;
    html += ` <span class="sub-price">${priceStr}</span>`;
    html += `<span class="sub-reasoning">${esc(cand.reasoning)}${allergenStr}</span>`;
    html += `</span>\n`;
  }
  return html;
}

// ─── RENDER CART ─────────────────────────────────────────────────────
function renderCart() {
  setView('cart');
  clearMain();
  const container = $('#cart-presentations');

  if (state.cart.length === 0) {
    container.innerHTML = '<span class="indent" style="font-style:italic;color:var(--fg-dim)">Cart is empty.</span>';
    setCmdBar('cart', 'CART (empty)');
    setActions('cart', '<span class="action" onclick="renderMenu()">MENU</span>  <span class="action" onclick="renderHelp()">HELP</span>');
    setHint('Cart is empty. Type DESCRIBE or CUSTOMIZE a menu item.');
    return;
  }

  let html = '<span class="section-label">Order</span>\n';
  let total = 0;

  for (const item of state.cart) {
    total += item.totalPriceCents;
    html += `<span class="cart-item-block">`;
    html += `<span class="pres pres-block" data-type="OrderItem" data-id="${item.cartId}" onclick="handlePresentationClick('OrderItem','${item.cartId}',null,event)" oncontextmenu="handlePresentationContext('OrderItem','${item.cartId}',null,event)">`;
    html += `  <span class="pres-type">&lt;OrderItem&gt;</span> ${esc(item.menuItem.name)} <span class="role">${fmt(item.totalPriceCents)}</span>`;
    html += `</span>\n`;
    for (const ing of item.composition) {
      if (ing.substitution) html += `<span class="indent2" style="color:var(--fg-dim)">${esc(ing.name)} → ${esc(ing.substitution.name)}</span>\n`;
      else if (ing.removed) html += `<span class="indent2" style="color:var(--removed-fg);text-decoration:line-through">${esc(ing.name)} removed</span>\n`;
    }
    html += `</span>\n`;
  }

  html += `\n<span class="section-label">Total: ${fmt(total)}</span>\n`;
  container.innerHTML = html;
  setCmdBar('cart', `CART (${state.cart.length} items, ${fmt(total)})`);
  setActions('cart',
    '<span class="action" onclick="placeOrder()">PLACE-ORDER</span>  ' +
    '<span class="action" onclick="renderMenu()">MENU</span>  ' +
    '<span class="action" onclick="renderHelp()">HELP</span>'
  );
  setHint('Click presentation to select + see actions. Type REMOVE-FROM-CART or INSPECT + click item.');
}

// ─── RENDER TRACKER ──────────────────────────────────────────────────
function renderTracker() {
  setView('tracker');
  clearMain();
  const container = $('#tracker-presentations');
  const steps = ['Received', 'Preparing', 'Ready', 'Picked Up'];
  let currentStep = 0;

  let html = `<span class="section-label">Order #${state.orderNum}</span>\n`;
  for (let i = 0; i < steps.length; i++) {
    const cls = i < currentStep ? 'done' : (i === currentStep ? 'active' : 'pending');
    html += `<span class="tracker-step ${cls}">${steps[i]}</span>\n`;
  }
  html += `\n<span style="color:var(--fg-dim);font-style:italic">Preparing your order. We will call #${state.orderNum} when ready.</span>\n`;
  container.innerHTML = html;
  setCmdBar('tracker', `TRACKING ORDER #${state.orderNum}`);
  setActions('tracker', '<span class="action" onclick="renderMenu()">MENU</span>  <span class="action" onclick="renderHelp()">HELP</span>');

  function advance() {
    if (currentStep >= steps.length) return;
    currentStep++;
    let h = `<span class="section-label">Order #${state.orderNum}</span>\n`;
    for (let i = 0; i < steps.length; i++) {
      const cls = i < currentStep ? 'done' : (i === currentStep ? 'active' : 'pending');
      h += `<span class="tracker-step ${cls}">${steps[i]}</span>\n`;
    }
    h += `\n<span style="color:var(--fg-dim);font-style:italic">`;
    h += currentStep >= 2 ? `Order #${state.orderNum} is ready for pickup.` : `Preparing your order. We will call #${state.orderNum} when ready.`;
    h += `</span>\n`;
    container.innerHTML = h;
    if (currentStep < steps.length) setTimeout(advance, 2500);
  }
  setTimeout(advance, 2000);
  setHint('Order is being prepared. MENU to order more. HELP for all commands.');
}

// ─── ACTION IMPLEMENTATIONS ──────────────────────────────────────────
function removeIngredient(ingredientId) {
  const c = state.customizing; if (!c) return;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || ing.removed) return;
  ing.removed = true; ing.substitution = null;
  recalcPrice(); renderDetail();
  setHint(`Removed ${ing.name}. SHOW-SUBSTITUTIONS or RESTORE-INGREDIENT.`);
}

function restoreIngredient(ingredientId) {
  const c = state.customizing; if (!c) return;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing) return;
  ing.removed = false; ing.substitution = null;
  recalcPrice(); renderDetail();
  setHint(`Restored ${ing.name}.`);
}

function undoSubstitution(ingredientId) {
  const c = state.customizing; if (!c) return;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || !ing.substitution) return;
  const prevName = ing.substitution.name;
  ing.substitution = null;
  recalcPrice(); renderDetail();
  setHint(`Undid ${prevName}. ${ing.name} still removed. RESTORE-INGREDIENT or SHOW-SUBSTITUTIONS.`);
}

function showSubstitutionsFor(ingredientId) {
  const c = state.customizing; if (!c) return;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing) return;
  if (!ing.removed) { ing.removed = true; ing.substitution = null; }
  recalcPrice(); renderDetail();
  setHint(`Showing substitutions for ${ing.name}. Click <Substitution> → APPLY.`);
}

function showAlternatives(ingredientId) {
  const c = state.customizing; if (!c) return;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || !ing.substitution) return;
  const prevName = ing.substitution.name;
  ing.substitution = null;
  recalcPrice(); renderDetail();
  setHint(`Cleared ${prevName}. Showing alternatives. Click <Substitution> → APPLY.`);
}

function applySubstitution(ingredientId, candidateIdx) {
  const c = state.customizing; if (!c) return;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || !ing.removed) return;
  const key = resolveSubKey(ingredientId);
  const rules = SUBS[key];
  if (!rules || !rules.candidates) return;
  const cand = rules.candidates[candidateIdx];
  if (!cand) return;
  ing.substitution = { ...cand };
  recalcPrice(); renderDetail();
  setHint(`Applied: ${ing.name} → ${cand.name}. UNDO-SUBSTITUTION or ALTERNATIVES.`);
}

function describeObject(id, idx, type) {
  if (type === 'MenuItem') { describeMenuItem(id); return; }
  if (type === 'OrderItem') { inspectOrderItem(id); return; }
  if (type === 'Substitution') { describeSubstitution(id, idx); return; }
  // Ingredient types
  const c = state.customizing;
  if (c) {
    const ing = c.composition.find(i => i.id === id);
    if (ing) {
      const name = ing.substitution ? ing.substitution.name : ing.name;
      const roles = ing.substitution ? ing.substitution.roles : ing.roles;
      const dietary = ing.substitution ? ing.substitution.dietary : ing.dietary;
      setHint(`${name} — roles: [${roles.join(', ')}] — dietary: ${dietary.join(', ') || 'none'}`);
    }
  }
}

function describeMenuItem(menuItemId) {
  const item = MENU.find(i => i.id === menuItemId);
  if (!item) return;
  setHint(`${item.name} — ${fmt(item.basePrice)} — ${item.dietary.join(', ') || 'no dietary tags'} — allergens: ${item.allergens.join(', ') || 'none'} — ${item.ingredients.map(i => i.name).join(', ')}`);
}

function describeSubstitution(ingredientId, candidateIdx) {
  const key = resolveSubKey(ingredientId);
  const rules = SUBS[key];
  if (!rules || !rules.candidates) return;
  const cand = rules.candidates[candidateIdx];
  if (!cand) return;
  setHint(`${cand.name} — roles: [${cand.roles.join(', ')}] — dietary: ${cand.dietary.join(', ')} — allergens: ${cand.allergens.join(', ') || 'none'} — flavor: ${cand.flavor} — ${cand.priceDelta > 0 ? '+' + fmt(cand.priceDelta) : 'no extra'} — ${cand.reasoning}`);
}

function recalcPrice() {
  const c = state.customizing; if (!c) return;
  let price = c.menuItem.basePrice;
  for (const ing of c.composition) { if (ing.substitution) price += ing.substitution.priceDelta; }
  c.currentPriceCents = price;
}

function addToCart() {
  const c = state.customizing; if (!c) return;
  state.cart.push({
    cartId: Date.now(), menuItem: c.menuItem,
    composition: c.composition.map(ing => ({ ...ing, substitution: ing.substitution ? { ...ing.substitution } : null })),
    totalPriceCents: c.currentPriceCents,
  });
  state.customizing = null;
  renderMenu();
  setHint(`Added to order. ${state.cart.length} item(s) in cart.`);
}

function removeFromCart(cartId) {
  state.cart = state.cart.filter(i => i.cartId !== parseInt(cartId));
  renderCart();
  setHint('Item removed from cart.');
}

function inspectOrderItem(cartId) {
  const item = state.cart.find(i => i.cartId === parseInt(cartId));
  if (!item) return;
  const parts = item.composition.map(ing => {
    if (ing.substitution) return `${ing.name} → ${ing.substitution.name}`;
    if (ing.removed) return `${ing.name} (removed)`;
    return ing.name;
  });
  setHint(`${item.menuItem.name} ${fmt(item.totalPriceCents)} — ${parts.join(', ')}`);
}

function editOrderItem(cartId) {
  const item = state.cart.find(i => i.cartId === parseInt(cartId));
  if (!item) return;
  state.cart = state.cart.filter(i => i.cartId !== parseInt(cartId));
  openDetail(item.menuItem.id);
  if (state.customizing) {
    state.customizing.composition = item.composition.map(ing => ({
      ...ing, substitution: ing.substitution ? { ...ing.substitution } : null,
    }));
    recalcPrice(); renderDetail();
  }
  setHint('Re-customizing item from cart.');
}

function placeOrder() {
  if (state.cart.length === 0) { setHint('Cart is empty. Add items first.'); return; }
  state.orderNum = 100 + Math.floor(Math.random() * 900);
  state.cart = [];
  renderTracker();
  setHint(`Order #${state.orderNum} placed.`);
}

function filterDietary() {
  const tags = ['vegan', 'vegetarian', 'gluten_free', 'dairy_free', 'nut_free'];
  const idx = prompt('Filter by dietary tag (enter number):\n' + tags.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n0. Clear filter');
  if (idx === null) return;
  const n = parseInt(idx);
  if (n === 0) { setHint('Filter cleared.'); renderMenu(); return; }
  if (n >= 1 && n <= tags.length) { setHint(`Filter: ${tags[n - 1]}.`); setCmdBar('menu', `LIST MENU [FILTER: ${tags[n - 1]}]`); }
}

function filterCategory() {
  const cats = ['all', 'bagels', 'sandwiches', 'breakfast'];
  const idx = prompt('Filter by category (enter number):\n' + cats.map((t, i) => `${i}. ${t}`).join('\n'));
  if (idx === null) return;
  const n = parseInt(idx);
  if (n >= 0 && n < cats.length) { setHint(`Category: ${cats[n]}.`); setCmdBar('menu', `LIST MENU [CATEGORY: ${cats[n]}]`); }
}

// ─── KEYBOARD COMMAND LINE ──────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'Escape') {
    closeContextMenu();
    if (state.mode === 'select') {
      exitSelectMode();
      setHint('Cancelled. Click a presentation or type a command. HELP for actions.');
      return;
    }
    if (state.selected) {
      deselectAll();
      setHint('Deselected. Click a presentation or type a command. HELP for actions.');
      return;
    }
    if (state.view !== 'menu') { renderMenu(); return; }
    return;
  }

  if (e.key === 'Enter') {
    if (state.cmdBuffer.trim()) {
      executeCommand(state.cmdBuffer.trim());
      state.cmdHistory.push(state.cmdBuffer);
      state.cmdBuffer = '';
      $('#cmd-buffer').textContent = '';
    }
    return;
  }

  if (e.key === 'Backspace') {
    e.preventDefault();
    state.cmdBuffer = state.cmdBuffer.slice(0, -1);
    $('#cmd-buffer').textContent = state.cmdBuffer;
    return;
  }

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    state.cmdBuffer += e.key;
    $('#cmd-buffer').textContent = state.cmdBuffer;
  }
});

function executeCommand(cmd) {
  const upper = cmd.toUpperCase().replace(/\s+/g, '-');
  const lower = cmd.toLowerCase();

  // Try exact action match
  const action = ACTIONS.find(a => a.id === upper || a.label === upper);
  if (action) {
    if (action.argTypes.length === 0) {
      // No-arg action: execute immediately
      action.fn();
      return;
    }
    // Action takes arguments: enter select mode
    enterSelectMode(action);
    return;
  }

  // Navigation shortcuts
  if (lower === 'm') { renderMenu(); return; }
  if (lower === 'c') { renderCart(); return; }
  if (lower === 'h' || lower === '?') { renderHelp(); return; }

  // Look up menu item by partial name
  const match = MENU.find(i => i.name.toLowerCase().includes(lower) || i.id === lower);
  if (match) { openDetail(match.id); return; }

  setHint(`Unknown: "${cmd}". Type HELP for available actions.`);
}

// ─── INIT ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  setHint('Click presentation → select → click action. Type action name for select mode. HELP for all commands.');
});
