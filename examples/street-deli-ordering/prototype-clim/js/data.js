/* === HUDSON STREET DELI — CLIM Presentation-Based UI === */
/* app.js — Two interaction modes:                                  */
/*   Normal: click presentation → show actions, click action → exec */
/*   Select: type action → presentations with matching args go red, */
/*           click red presentation → execute action(arg)            */

// ─── MENU DATA ───────────────────────────────────────────────────────
export const MENU = [
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
export const SUBS = {
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

export function resolveSubKey(id) {
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

