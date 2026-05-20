/* === HUDSON STREET DELI — Mobile Ordering Prototype === */
/* app.js — Menu data, replacement engine, cart, and UI logic */

// ─── MENU DATA ────────────────────────────────────────────────────────
const MENU = [
  // — BAGELS —
  {
    id: 'everything-bagel-cc',
    name: 'Everything Bagel w/ CC',
    category: 'bagels',
    basePrice: 595,
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
    basePrice: 395,
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
    basePrice: 995,
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

  // — SANDWICHES —
  {
    id: 'classic-blta',
    name: 'Classic BLTA',
    category: 'sandwiches',
    basePrice: 1195,
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
    basePrice: 1295,
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
    basePrice: 895,
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
    basePrice: 1395,
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

  // — BREAKFAST SANDWICHES —
  {
    id: 'bacon-egg-cheese',
    name: 'Bacon, Egg & Cheese',
    category: 'breakfast',
    basePrice: 795,
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
    basePrice: 895,
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
    basePrice: 1095,
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
    basePrice: 995,
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

// ─── SUBSTITUTION RULES (the replacement engine) ──────────────────────
const SUBSTITUTIONS = {
  'bacon': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'vegetarian', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Smoked tofu brings protein and smoky umami. The closest vegan match for bacon\'s core roles.' },
      { name: 'Tempeh Bacon', roles: ['protein', 'umami', 'crunch'], dietary: ['vegan', 'vegetarian', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 200, auto: true, reasoning: 'Tempeh bacon mimics bacon\'s crunch and smokiness. The most complete role substitute but costs more.' },
      { name: 'Turkey Bacon', roles: ['protein', 'umami'], dietary: [], allergens: [], flavor: 'similar', priceDelta: 0, auto: false, reasoning: 'Turkey bacon provides protein and umami. Lighter than pork but familiar flavor direction.' },
    ]
  },
  'bacon-2': null, // alias — will resolve to 'bacon' rules
  'bacon-3': null,
  'cc': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Avocado provides similar richness and creaminess. Dairy-free and vegan-compatible.' },
      { name: 'Hummus', roles: ['richness', 'moisture', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 100, auto: false, reasoning: 'Hummus adds richness and moisture with a Mediterranean flavor shift. Watch for sesame.' },
      { name: 'Nutritional Yeast', roles: ['umami', 'garnish'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Adds cheesy umami flavor. Best when richness is not the priority.' },
    ]
  },
  'scallion-cc': null, // alias for cc
  'cheddar': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Avocado replaces cheese\'s richness and creaminess. Adds freshness as a bonus role.' },
      { name: 'Nutritional Yeast', roles: ['umami', 'garnish'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Cheesy umami without the dairy. Less creamy, more sharp.' },
      { name: 'Cashew Cheese', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free'], allergens: ['tree_nuts'], flavor: 'similar', priceDelta: 200, auto: false, reasoning: 'Creamy and rich like dairy cheese. Watch for tree nut allergy.' },
    ]
  },
  'cheddar-2': null,
  'cheddar-3': null,
  'american': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Smooth richness and moisture, just like American cheese but plant-based.' },
      { name: 'Hummus', roles: ['richness', 'moisture', 'binding'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 100, auto: false, reasoning: 'Hummus provides binding moisture. Shifts flavor toward Mediterranean.' },
    ]
  },
  'american-2': null,
  'provolone': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Replaces provolone\'s richness and adds freshness.' },
      { name: 'Roasted Peppers', roles: ['richness', 'acidity', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Sweet and smoky. Complements the Italian flavor profile better than cheese does.' },
    ]
  },
  'butter': {
    candidates: [
      { name: 'Avocado Mash', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Creamy spread that replaces butter\'s richness without dairy.' },
      { name: 'Olive Oil', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Classic dairy-free fat. Light and clean.' },
    ]
  },
  'butter-2': null,
  'mayo': {
    candidates: [
      { name: 'Hummus', roles: ['moisture', 'richness', 'binding', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Hummus replaces mayo\'s moisture and binding with added umami.' },
      { name: 'Avocado Mash', roles: ['moisture', 'richness', 'binding'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Creamy and mild. The closest neutral replacement for mayo.' },
      { name: 'Mustard', roles: ['moisture', 'acidity'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Tangy and bright. Changes the flavor direction but works on sandwiches.' },
    ]
  },
  'mayo-2': null,
  'sourdough': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free', 'low_carb'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Gluten-free structural replacement. Adds freshness, changes the eating experience.' },
      { name: 'Collard Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 100, auto: true, reasoning: 'Sturdier than lettuce. Holds up to wet fillings. Adds earthy flavor.' },
    ]
  },
  'sourdough-2': null,
  'sourdough-3': null,
  'wheat-bread': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free', 'low_carb'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Light and fresh structural replacement.' },
      { name: 'Gluten-Free Bread', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Closest bread-like substitute. Keeps the sandwich experience familiar.' },
    ]
  },
  'kaiser': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Fresh and light structural replacement.' },
      { name: 'Gluten-Free Roll', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDelta: 150, auto: true, reasoning: 'Keeps the roll experience without the gluten.' },
    ]
  },
  'kaiser-2': null,
  'hero-roll': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Gluten-free structural replacement.' },
      { name: 'Gluten-Free Roll', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDelta: 200, auto: true, reasoning: 'Closest roll substitute for hero-style sandwiches.' },
    ]
  },
  'biscuit': {
    candidates: [
      { name: 'English Muffin', roles: ['structural'], dietary: [], allergens: ['gluten'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Similar structural role. Different texture but familiar breakfast sandwich experience.' },
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Gluten-free option. Changes the breakfast sandwich experience significantly.' },
    ]
  },
  'lox': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Smoky umami protein substitute. Different texture but fills the same role profile.' },
      { name: 'Cucumber Slices', roles: ['freshness', 'crunch'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Fresh and light. Loses protein but adds crunch and freshness.' },
    ]
  },
  'fried-egg': {
    candidates: [
      { name: 'Tofu Scramble', roles: ['protein', 'binding'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'complementary', priceDelta: 100, auto: true, reasoning: 'Protein and binding like egg, but plant-based. Slightly different texture.' },
      { name: 'Extra Cheese', roles: ['protein', 'richness', 'binding'], dietary: ['vegetarian'], allergens: ['dairy'], flavor: 'similar', priceDelta: 50, auto: false, reasoning: 'Adds protein and binding through dairy. Not vegan but vegetarian-compatible.' },
    ]
  },
  'egg-2': null,
  'poached-egg': null, // will resolve to fried-egg
  'omelet': null,
  'turkey': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Protein and umami substitute. Different flavor but similar role profile.' },
      { name: 'Grilled Chicken', roles: ['protein'], dietary: [], allergens: [], flavor: 'similar', priceDelta: 0, auto: false, reasoning: 'Lighter protein alternative. Familiar sandwich flavor.' },
    ]
  },
  'capicola': {
    candidates: [
      { name: 'Roasted Eggplant', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Earthy umami with creamy texture. Surprisingly good on Italian sandwiches.' },
      { name: 'Grilled Zucchini', roles: ['freshness', 'crunch'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Fresh and mild. Loses umami but adds freshness and crunch.' },
    ]
  },
  'mortadella': {
    candidates: [
      { name: 'Hummus', roles: ['richness', 'moisture', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDelta: 0, auto: true, reasoning: 'Replaces mortadella\'s richness and adds umami. Watch for sesame.' },
      { name: 'Roasted Peppers', roles: ['richness', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 0, auto: false, reasoning: 'Sweet and smoky richness. Different direction but Italian-compatible.' },
    ]
  },
  'ham': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDelta: 0, auto: true, reasoning: 'Smoky protein substitute. The closest vegan match for ham\'s role profile.' },
      { name: 'Roasted Mushrooms', roles: ['umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 50, auto: false, reasoning: 'Deep umami and earthy richness. Different from ham but satisfying.' },
    ]
  },
  'sausage': {
    candidates: [
      { name: 'Veggie Sausage', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain soy'], flavor: 'similar', priceDelta: 100, auto: true, reasoning: 'Designed to mimic breakfast sausage. Similar shape, flavor, and role profile.' },
      { name: 'Grilled Portobello', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDelta: 100, auto: false, reasoning: 'Earthy and savory. Different flavor but fills the same breakfast role.' },
    ]
  },
};

// Resolve aliases: null entries inherit from a canonical key
function resolveSubKey(ingredientId) {
  const rules = SUBSTITUTIONS[ingredientId];
  if (rules === null) {
    // Try to find the canonical key by stripping trailing digits
    const base = ingredientId.replace(/-\d+$/, '');
    if (SUBSTITUTIONS[base] && SUBSTITUTIONS[base] !== null) return base;
    // Try matching by name from menu data
    const ing = findIngredientById(ingredientId);
    if (ing) {
      for (const [key, val] of Object.entries(SUBSTITUTIONS)) {
        if (val && val !== null) {
          const matchIng = findIngredientById(key);
          if (matchIng && matchIng.name === ing.name) return key;
        }
      }
    }
  }
  return ingredientId;
}

// ─── CONFIG OPTIONS ───────────────────────────────────────────────────
const CONFIG_OPTIONS = {
  bagels: [
    { key: 'toast', label: 'Toast', values: ['Toasted', 'Untoasted'], default: 0 },
  ],
  sandwiches: [
    { key: 'bread', label: 'Bread', values: ['Standard', 'Extra Toast'], default: 0 },
    { key: 'cut', label: 'Cut', values: ['Whole', 'Half'], default: 0 },
  ],
  breakfast: [
    { key: 'egg', label: 'Egg', values: ['Fried', 'Scrambled', 'Over Easy'], default: 0 },
    { key: 'cheese_melt', label: 'Cheese', values: ['Melted', 'Cold'], default: 0 },
  ],
};

// ─── APP STATE ────────────────────────────────────────────────────────
const state = {
  activeDietary: new Set(),
  activeCategory: 'all',
  cart: [],          // [{ menuItem, composition, config, totalPriceCents }]
  customizing: null,  // { menuItem, composition, config, currentPriceCents }
  removedIngredients: {}, // ingredientId → { removed, substitutionApplied }
  nextOrderNum: 100,
};

// ─── HELPERS ──────────────────────────────────────────────────────────
function fmt(cents) {
  return '$' + (cents / 100).toFixed(2);
}

function findIngredientById(id) {
  for (const item of MENU) {
    for (const ing of item.ingredients) {
      if (ing.id === id) return ing;
    }
  }
  return null;
}

function getDietaryBadges(item) {
  const badges = [];
  if (item.dietary.includes('vegan')) badges.push({ tag: 'V', cls: 'v', label: 'Vegan' });
  if (item.dietary.includes('vegetarian')) badges.push({ tag: 'VG', cls: 'vg', label: 'Vegetarian' });
  if (item.dietary.includes('gluten_free')) badges.push({ tag: 'GF', cls: 'gf', label: 'Gluten-Free' });
  if (item.dietary.includes('dairy_free')) badges.push({ tag: 'DF', cls: 'df', label: 'Dairy-Free' });
  if (item.dietary.includes('nut_free')) badges.push({ tag: 'NF', cls: 'nf', label: 'Nut-Free' });
  return badges;
}

function getIngredientDietaryBadges(ing) {
  const badges = [];
  if (ing.dietary.includes('vegan')) badges.push({ tag: 'V', cls: 'v' });
  if (ing.dietary.includes('vegetarian')) badges.push({ tag: 'VG', cls: 'vg' });
  if (ing.dietary.includes('gluten_free')) badges.push({ tag: 'GF', cls: 'gf' });
  if (ing.dietary.includes('dairy_free')) badges.push({ tag: 'DF', cls: 'df' });
  if (ing.dietary.includes('nut_free')) badges.push({ tag: 'NF', cls: 'nf' });
  return badges;
}

function itemMatchesDietary(item) {
  if (state.activeDietary.size === 0) return true;
  // Show item if it has ANY matching dietary tag on the item or its ingredients
  const itemTags = new Set(item.dietary);
  for (const ing of item.ingredients) {
    for (const t of ing.dietary) itemTags.add(t);
  }
  for (const dt of state.activeDietary) {
    if (itemTags.has(dt)) return true;
  }
  return false;
}

// ─── RENDER MENU ──────────────────────────────────────────────────────
function renderMenu() {
  const list = document.getElementById('menu-list');
  list.innerHTML = '';

  const filtered = MENU.filter(item => {
    if (state.activeCategory !== 'all' && item.category !== state.activeCategory) return false;
    if (!itemMatchesDietary(item)) return false;
    return true;
  });

  for (const item of filtered) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.onclick = () => openCustomizer(item);

    const ingNames = item.ingredients.map(i => i.name).join(', ');
    const badges = getDietaryBadges(item);

    card.innerHTML = `
      <div class="menu-card-top">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-price">${fmt(item.basePrice)}</div>
      </div>
      <div class="menu-card-desc">${item.description}</div>
      <div class="menu-card-ingredients">${ingNames}</div>
      ${badges.length ? `<div class="menu-card-dietary">${badges.map(b => `<span class="dietary-badge ${b.cls}">${b.tag}</span>`).join('')}</div>` : ''}
    `;
    list.appendChild(card);
  }
}

// ─── RENDER CATEGORY TABS ────────────────────────────────────────────
function initCategoryTabs() {
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.dataset.cat;
      renderMenu();
    };
  });
}

// ─── DIETARY FILTERS ──────────────────────────────────────────────────
function initDietaryFilters() {
  document.querySelectorAll('.dietary-chip').forEach(chip => {
    chip.onclick = () => {
      const tag = chip.dataset.tag;
      if (state.activeDietary.has(tag)) {
        state.activeDietary.delete(tag);
        chip.classList.remove('active');
      } else {
        state.activeDietary.add(tag);
        chip.classList.add('active');
      }
      renderMenu();
    };
  });
}

// ─── CUSTOMIZER ───────────────────────────────────────────────────────
function openCustomizer(menuItem) {
  // Deep clone composition
  const composition = menuItem.ingredients.map(ing => ({
    ...ing,
    removed: false,
    substitution: null, // { name, roles, dietary, allergens, flavor, priceDelta }
  }));

  state.customizing = {
    menuItem,
    composition,
    config: {},
    currentPriceCents: menuItem.basePrice,
  };

  // Set defaults for config
  const opts = CONFIG_OPTIONS[menuItem.category] || [];
  for (const opt of opts) {
    state.customizing.config[opt.key] = opt.values[opt.default];
  }

  renderCustomizer();
  document.getElementById('customizer-overlay').classList.remove('hidden');
  document.getElementById('customizer-sheet').classList.remove('hidden');
}

function closeCustomizer() {
  document.getElementById('customizer-overlay').classList.add('hidden');
  document.getElementById('customizer-sheet').classList.add('hidden');
  state.customizing = null;
}

function renderCustomizer() {
  const c = state.customizing;
  if (!c) return;

  document.getElementById('cust-item-name').textContent = c.menuItem.name;
  document.getElementById('cust-price').textContent = fmt(c.currentPriceCents);
  document.getElementById('add-to-order-total').textContent = fmt(c.currentPriceCents);

  renderIngredientList();
  renderSubstitutionZone();
  renderConfigControls();
  renderDietarySummary();
  checkAllergenWarnings();
}

function renderIngredientList() {
  const c = state.customizing;
  const list = document.getElementById('ingredient-list');
  list.innerHTML = '';

  for (const ing of c.composition) {
    const row = document.createElement('div');
    row.className = 'ingredient-row';
    if (ing.removed && !ing.substitution) row.classList.add('removed');
    if (ing.substitution) row.classList.add('substituted');

    const roleTags = ing.roles.map(r => `<span class="role-tag ${r}">${r}</span>`).join('');
    const dietBadges = getIngredientDietaryBadges(ing).map(b => `<span class="dietary-badge ${b.cls}" style="height:16px;font-size:9px;padding:0 4px">${b.tag}</span>`).join('');

    let nameHTML = ing.name;
    if (ing.substitution) {
      nameHTML = `${ing.substitution.name} <span style="font-size:12px;color:var(--text-muted)">(was ${ing.name})</span>`;
      // Show substitution's roles
      const subRoleTags = ing.substitution.roles.map(r => `<span class="role-tag ${r}">${r}</span>`).join('');
      const subDietBadges = ing.substitution.dietary.map(d => {
        const cls = d === 'vegan' ? 'v' : d === 'vegetarian' ? 'vg' : d === 'gluten_free' ? 'gf' : d === 'dairy_free' ? 'df' : 'nf';
        return `<span class="dietary-badge ${cls}" style="height:16px;font-size:9px;padding:0 4px">${d.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ /g, '')}</span>`;
      }).join('');
      row.innerHTML = `
        <button class="ing-remove" data-id="${ing.id}" data-undo="true" title="Undo substitution" style="background:#FEF3CD;color:var(--warning);font-size:14px">↶</button>
        <span class="ing-name">${nameHTML}</span>
        <span class="ing-roles">${subRoleTags}</span>
        ${subDietBadges ? `<span class="ing-dietary">${subDietBadges}</span>` : ''}
      `;
      list.appendChild(row);
      continue;
    }

    const removeBtn = !ing.removed
      ? `<button class="ing-remove" data-id="${ing.id}" title="Remove ${ing.name}">−</button>`
      : `<button class="ing-remove" data-id="${ing.id}" data-undo="true" title="Undo remove" style="background:#E8F5E9;color:var(--success)">+</button>`;

    row.innerHTML = `
      ${removeBtn}
      <span class="ing-name">${nameHTML}</span>
      <span class="ing-roles">${roleTags}</span>
      ${dietBadges ? `<span class="ing-dietary">${dietBadges}</span>` : ''}
    `;
    list.appendChild(row);
  }

  // Wire remove/undo buttons
  list.querySelectorAll('.ing-remove').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const isUndo = btn.dataset.undo === 'true';
      if (isUndo) {
        undoRemoveIngredient(id);
      } else {
        removeIngredient(id);
      }
    };
  });
}

function removeIngredient(ingredientId) {
  const c = state.customizing;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || ing.removed) return;

  ing.removed = true;
  ing.substitution = null;
  renderCustomizer();
}

function undoRemoveIngredient(ingredientId) {
  const c = state.customizing;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || !ing.removed) return;

  ing.removed = false;
  ing.substitution = null;
  renderCustomizer();
}

function applySubstitution(ingredientId, candidateIdx) {
  const c = state.customizing;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing || !ing.removed) return;

  const key = resolveSubKey(ingredientId);
  const rules = SUBSTITUTIONS[key];
  if (!rules || !rules.candidates) return;

  const candidate = rules.candidates[candidateIdx];
  if (!candidate) return;

  ing.substitution = { ...candidate };

  // Update price
  recalcCustomizerPrice();
  renderCustomizer();
}

function recalcCustomizerPrice() {
  const c = state.customizing;
  let price = c.menuItem.basePrice;
  for (const ing of c.composition) {
    if (ing.substitution) {
      price += ing.substitution.priceDelta;
    }
  }
  c.currentPriceCents = price;
}

// ─── SUBSTITUTION ZONE ────────────────────────────────────────────────
function renderSubstitutionZone() {
  const c = state.customizing;
  const zone = document.getElementById('substitution-zone');
  const hint = document.getElementById('substitution-hint');
  const cards = document.getElementById('substitution-cards');

  const removed = c.composition.filter(i => i.removed);
  if (removed.length === 0) {
    zone.classList.add('hidden');
    return;
  }

  zone.classList.remove('hidden');

  // Find the first removed ingredient without a substitution applied
  const pending = removed.find(i => !i.substitution);
  if (pending) {
    const key = resolveSubKey(pending.id);
    const rules = SUBSTITUTIONS[key];
    if (rules && rules.candidates && rules.candidates.length > 0) {
      hint.textContent = `You removed ${pending.name}. Here are smart replacements that preserve its role in the sandwich:`;
      cards.innerHTML = '';

      // Show top 2 candidates inline
      const topCandidates = rules.candidates.slice(0, 2);
      for (let ci = 0; ci < topCandidates.length; ci++) {
        const cand = topCandidates[ci];
        const card = document.createElement('div');
        card.className = `sub-card${cand.auto ? ' auto-suggest' : ''}`;

        const roleTags = cand.roles.slice(0, 3).map(r => `<span class="role-tag ${r}">${r}</span>`).join('');
        const priceClass = cand.priceDelta > 0 ? 'positive' : 'zero';
        const priceText = cand.priceDelta > 0 ? `+${fmt(cand.priceDelta)}` : 'no extra';

        card.innerHTML = `
          <span class="sub-original">${pending.name}</span>
          <span class="sub-arrow">→</span>
          <span class="sub-replacement">${cand.name}</span>
          <div class="sub-meta">
            <span class="sub-price ${priceClass}">${priceText}</span>
            <div class="sub-roles-mini">${roleTags}</div>
          </div>
        `;
        card.onclick = () => applySubstitution(pending.id, ci);
        cards.appendChild(card);
      }

      if (rules.candidates.length > 2) {
        const seeAll = document.createElement('button');
        seeAll.className = 'sub-see-all';
        seeAll.textContent = `See all ${rules.candidates.length} options →`;
        seeAll.onclick = () => openSubDetail(pending.id);
        cards.appendChild(seeAll);
      }
    } else {
      hint.textContent = `${pending.name} removed. No substitutions available for this ingredient.`;
      cards.innerHTML = '';
    }
  } else {
    // All removed ingredients have substitutions
    hint.textContent = 'All removed ingredients have replacements applied. Tap a substituted ingredient to change.';
    cards.innerHTML = '';
  }
}

// ─── SUBSTITUTION DETAIL SHEET ────────────────────────────────────────
function openSubDetail(ingredientId) {
  const c = state.customizing;
  const ing = c.composition.find(i => i.id === ingredientId);
  if (!ing) return;

  const key = resolveSubKey(ingredientId);
  const rules = SUBSTITUTIONS[key];
  if (!rules || !rules.candidates) return;

  const sheet = document.getElementById('sub-detail-sheet');
  document.getElementById('sub-detail-title').textContent = 'Replacement Options';
  document.getElementById('sub-detail-removed').textContent = `Removed: ${ing.name}`;

  // Show unfilled roles
  const rolesDiv = document.getElementById('sub-detail-roles');
  rolesDiv.innerHTML = ing.roles.map(r => `<span class="role-tag ${r}">${r}</span>`).join('');

  const list = document.getElementById('sub-detail-candidates');
  list.innerHTML = '';

  for (let ci = 0; ci < rules.candidates.length; ci++) {
    const cand = rules.candidates[ci];
    const card = document.createElement('div');
    card.className = `candidate-card${cand.auto ? ' auto' : ''}`;

    const roleTags = cand.roles.map(r => `<span class="role-tag ${r}">${r}</span>`).join('');
    const dietBadges = cand.dietary.map(d => {
      const cls = d === 'vegan' ? 'v' : d === 'vegetarian' ? 'vg' : d === 'gluten_free' ? 'gf' : d === 'dairy_free' ? 'df' : 'nf';
      return `<span class="dietary-badge ${cls}" style="height:18px;font-size:9px;padding:0 5px">${d.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ /g, '')}</span>`;
    }).join('');
    const priceClass = cand.priceDelta > 0 ? 'positive' : 'zero';
    const priceText = cand.priceDelta > 0 ? `+${fmt(cand.priceDelta)}` : 'No extra cost';

    card.innerHTML = `
      <div class="candidate-name">${cand.name}</div>
      <div class="candidate-reasoning">${cand.reasoning}</div>
      <div class="candidate-meta">
        <div class="candidate-roles">${roleTags}</div>
        ${dietBadges ? `<div class="candidate-dietary">${dietBadges}</div>` : ''}
        <span class="candidate-price ${priceClass}">${priceText}</span>
      </div>
      <div class="candidate-flavor">Flavor: ${cand.flavor}</div>
      ${cand.allergens.length ? `<div style="margin-top:4px"><span style="font-size:11px;color:var(--warning)">⚠ Allergens: ${cand.allergens.join(', ')}</span></div>` : ''}
    `;
    card.onclick = () => {
      applySubstitution(ingredientId, ci);
      closeSubDetail();
    };
    list.appendChild(card);
  }

  document.getElementById('sub-detail-overlay').classList.remove('hidden');
  sheet.classList.remove('hidden');
}

function closeSubDetail() {
  document.getElementById('sub-detail-overlay').classList.add('hidden');
  document.getElementById('sub-detail-sheet').classList.add('hidden');
}

// ─── CONFIG CONTROLS ──────────────────────────────────────────────────
function renderConfigControls() {
  const c = state.customizing;
  const container = document.getElementById('config-controls');
  container.innerHTML = '';

  const opts = CONFIG_OPTIONS[c.menuItem.category] || [];
  if (opts.length === 0) {
    document.getElementById('config-section').classList.add('hidden');
    return;
  }
  document.getElementById('config-section').classList.remove('hidden');

  for (const opt of opts) {
    const row = document.createElement('div');
    row.className = 'config-row';
    row.innerHTML = `
      <span class="config-label">${opt.label}</span>
      <div class="config-options">
        ${opt.values.map((v, i) => `<button class="config-opt${c.config[opt.key] === v ? ' active' : ''}" data-key="${opt.key}" data-val="${v}">${v}</button>`).join('')}
      </div>
    `;
    container.appendChild(row);
  }

  container.querySelectorAll('.config-opt').forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.key;
      const val = btn.dataset.val;
      c.config[key] = val;
      renderConfigControls();
    };
  });
}

// ─── DIETARY SUMMARY ──────────────────────────────────────────────────
function renderDietarySummary() {
  const c = state.customizing;
  const container = document.getElementById('dietary-summary');
  container.innerHTML = '';

  // Collect all dietary tags from active (not removed) ingredients + substitutions
  const allTags = new Set();
  for (const ing of c.composition) {
    if (ing.removed && !ing.substitution) continue;
    if (ing.substitution) {
      for (const t of ing.substitution.dietary) allTags.add(t);
    } else {
      for (const t of ing.dietary) allTags.add(t);
    }
  }

  // Also show item-level dietary
  for (const t of c.menuItem.dietary) allTags.add(t);

  if (allTags.size === 0) {
    document.getElementById('dietary-summary-section').classList.add('hidden');
    return;
  }
  document.getElementById('dietary-summary-section').classList.remove('hidden');

  const tagMap = { vegan: 'V', vegetarian: 'VG', gluten_free: 'GF', dairy_free: 'DF', nut_free: 'NF' };
  const clsMap = { vegan: 'v', vegetarian: 'vg', gluten_free: 'gf', dairy_free: 'df', nut_free: 'nf' };

  for (const tag of allTags) {
    const badge = document.createElement('span');
    badge.className = `dietary-badge ${clsMap[tag] || ''}`;
    badge.textContent = tagMap[tag] || tag;
    badge.title = tag.replace('_', ' ');
    container.appendChild(badge);
  }
}

// ─── ALLERGEN WARNINGS ────────────────────────────────────────────────
function checkAllergenWarnings() {
  const c = state.customizing;
  const warning = document.getElementById('allergen-warning');
  const warningText = document.getElementById('allergen-warning-text');

  // Check if any substitution introduces a new allergen
  const baseAllergens = new Set(c.menuItem.allergens.map(a => a.toLowerCase()));
  for (const ing of c.composition) {
    if (ing.substitution && ing.substitution.allergens.length > 0) {
      const newAllergens = ing.substitution.allergens.filter(a => !baseAllergens.has(a.toLowerCase()));
      if (newAllergens.length > 0) {
        warningText.textContent = `Substitution "${ing.substitution.name}" introduces: ${newAllergens.join(', ')}`;
        warning.classList.remove('hidden');
        return;
      }
    }
  }

  // Check if removing an ingredient leaves a required role unfilled
  const requiredRoles = new Set();
  for (const ing of c.composition) {
    if (ing.required) {
      for (const r of ing.roles) requiredRoles.add(r);
    }
  }
  const filledRoles = new Set();
  for (const ing of c.composition) {
    if (!ing.removed || ing.substitution) {
      const src = ing.substitution || ing;
      for (const r of src.roles) filledRoles.add(r);
    }
  }
  const missing = [...requiredRoles].filter(r => !filledRoles.has(r));

  if (missing.length > 0) {
    warningText.textContent = `Required role unfilled: ${missing.join(', ')}. Consider a substitution.`;
    warning.classList.remove('hidden');
    return;
  }

  warning.classList.add('hidden');
}

// ─── CART ─────────────────────────────────────────────────────────────
function addToCart() {
  const c = state.customizing;
  if (!c) return;

  const cartItem = {
    id: Date.now(),
    menuItem: c.menuItem,
    composition: c.composition.map(ing => ({ ...ing })),
    config: { ...c.config },
    totalPriceCents: c.currentPriceCents,
  };

  state.cart.push(cartItem);
  closeCustomizer();
  renderCartFab();
}

function renderCartFab() {
  const fab = document.getElementById('cart-fab');
  if (state.cart.length === 0) {
    fab.classList.add('hidden');
    return;
  }
  fab.classList.remove('hidden');
  document.getElementById('cart-fab-count').textContent = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.totalPriceCents, 0);
  document.getElementById('cart-fab-total').textContent = fmt(total);
}

function renderCart() {
  const screen = document.getElementById('cart-screen');
  const menuScreen = document.getElementById('menu-screen');
  menuScreen.classList.remove('active');
  menuScreen.classList.add('hidden');
  screen.classList.remove('hidden');
  screen.classList.add('active');

  document.getElementById('cart-fab').classList.add('hidden');

  const container = document.getElementById('cart-items');
  container.innerHTML = '';

  for (const item of state.cart) {
    const card = document.createElement('div');
    card.className = 'cart-item';

    const subs = item.composition.filter(i => i.substitution);
    const subsHTML = subs.map(i => `<div class="cart-sub-line">↳ ${i.name} → ${i.substitution.name}</div>`).join('');
    const removed = item.composition.filter(i => i.removed && !i.substitution);
    const removedHTML = removed.map(i => `<div class="cart-sub-line" style="color:var(--danger);text-decoration:line-through">${i.name} removed</div>`).join('');

    const configStr = Object.entries(item.config).map(([k, v]) => v).join(' · ');

    card.innerHTML = `
      <div class="cart-item-header">
        <div>
          <div class="cart-item-name">${item.menuItem.name}</div>
          ${configStr ? `<div class="cart-item-config">${configStr}</div>` : ''}
        </div>
        <div class="cart-item-price">${fmt(item.totalPriceCents)}</div>
      </div>
      <div class="cart-item-subs">
        ${subsHTML}
        ${removedHTML}
      </div>
      <button class="cart-remove-btn" data-id="${item.id}">Remove</button>
    `;
    container.appendChild(card);
  }

  // Wire remove buttons
  container.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      state.cart = state.cart.filter(i => i.id !== id);
      renderCart();
      renderCartFab();
      if (state.cart.length === 0) goBackToMenu();
    };
  });

  const total = state.cart.reduce((sum, item) => sum + item.totalPriceCents, 0);
  document.getElementById('cart-total-price').textContent = fmt(total);
}

function goBackToMenu() {
  const screen = document.getElementById('cart-screen');
  screen.classList.remove('active');
  screen.classList.add('hidden');
  const menuScreen = document.getElementById('menu-screen');
  menuScreen.classList.remove('hidden');
  menuScreen.classList.add('active');
  renderCartFab();
}

// ─── ORDER TRACKER ────────────────────────────────────────────────────
function placeOrder() {
  const num = state.nextOrderNum++;
  state.cart = [];

  // Switch to tracker
  const cartScreen = document.getElementById('cart-screen');
  cartScreen.classList.remove('active');
  cartScreen.classList.add('hidden');

  const tracker = document.getElementById('tracker-screen');
  tracker.classList.remove('hidden');
  tracker.classList.add('active');

  document.getElementById('tracker-order-num').textContent = '#' + num;

  // Animate tracker steps
  const steps = ['received', 'preparing', 'ready', 'picked-up'];
  let currentStep = 0;

  function advanceStep() {
    if (currentStep >= steps.length) return;
    const stepEls = document.querySelectorAll('.tracker-step');
    for (let i = 0; i <= currentStep; i++) {
      stepEls[i].classList.add('completed');
    }
    if (currentStep < steps.length) {
      stepEls[currentStep].classList.add('active');
    }
    currentStep++;
    if (currentStep < steps.length) {
      setTimeout(advanceStep, 2500);
    }
  }

  // Reset steps
  document.querySelectorAll('.tracker-step').forEach(s => {
    s.classList.remove('completed', 'active');
  });
  document.getElementById('tracker-detail').innerHTML = '<p>We\'re making your order now. We\'ll call your number when it\'s ready.</p>';

  setTimeout(advanceStep, 500);
}

function backToMenuFromTracker() {
  const tracker = document.getElementById('tracker-screen');
  tracker.classList.remove('active');
  tracker.classList.add('hidden');

  const menuScreen = document.getElementById('menu-screen');
  menuScreen.classList.remove('hidden');
  menuScreen.classList.add('active');
  renderCartFab();
}

// ─── INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCategoryTabs();
  initDietaryFilters();
  renderMenu();

  // Customizer overlay close
  document.getElementById('customizer-overlay').onclick = closeCustomizer;
  document.getElementById('sub-detail-overlay').onclick = closeSubDetail;

  // Add to order
  document.getElementById('add-to-order-btn').onclick = addToCart;

  // Cart FAB
  document.getElementById('cart-fab').onclick = renderCart;

  // Cart back
  document.getElementById('cart-back').onclick = goBackToMenu;

  // Place order
  document.getElementById('place-order-btn').onclick = placeOrder;

  // Tracker back
  document.getElementById('tracker-back').onclick = backToMenuFromTracker;
});
