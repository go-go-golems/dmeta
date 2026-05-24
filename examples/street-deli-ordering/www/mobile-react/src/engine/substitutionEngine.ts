/**
 * Substitution engine ported from the static prototype (www/mobile/app.js → SUBSTITUTIONS).
 *
 * Maps ingredient IDs to ranked replacement candidates based on role
 * preservation, dietary compatibility, and flavor fit. This implements
 * the DMETA `role_preserving_substitutable` capability.
 *
 * @see www/mobile/app.js → SUBSTITUTIONS, resolveSubKey
 * @see core-model/street-deli-ordering.yaml → SubstitutionRule
 */

import type { SubstitutionCandidateViewModel } from '../view-models/types';

type SubstitutionRule = {
  candidates: SubstitutionCandidateViewModel[];
};

// ─── SUBSTITUTION RULES ────────────────────────────────────────────────

const SUBSTITUTIONS: Record<string, SubstitutionRule | null> = {
  'bacon': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'vegetarian', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDeltaCents: 0, auto: true, reasoning: "Smoked tofu brings protein and smoky umami. The closest vegan match for bacon's core roles." },
      { name: 'Tempeh Bacon', roles: ['protein', 'umami', 'crunch'], dietary: ['vegan', 'vegetarian', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDeltaCents: 200, auto: true, reasoning: "Tempeh bacon mimics bacon's crunch and smokiness. The most complete role substitute but costs more." },
      { name: 'Turkey Bacon', roles: ['protein', 'umami'], dietary: [], allergens: [], flavor: 'similar', priceDeltaCents: 0, auto: false, reasoning: "Turkey bacon provides protein and umami. Lighter than pork but familiar flavor direction." },
    ]
  },
  'bacon-2': null,
  'bacon-3': null,
  'cc': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: 'Avocado provides similar richness and creaminess. Dairy-free and vegan-compatible.' },
      { name: 'Hummus', roles: ['richness', 'moisture', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDeltaCents: 100, auto: false, reasoning: 'Hummus adds richness and moisture with a Mediterranean flavor shift. Watch for sesame.' },
      { name: 'Nutritional Yeast', roles: ['umami', 'garnish'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Adds cheesy umami flavor. Best when richness is not the priority.' },
    ]
  },
  'scallion-cc': null,
  'cheddar': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: "Avocado replaces cheese's richness and creaminess. Adds freshness as a bonus role." },
      { name: 'Nutritional Yeast', roles: ['umami', 'garnish'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Cheesy umami without the dairy. Less creamy, more sharp.' },
      { name: 'Cashew Cheese', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free'], allergens: ['tree_nuts'], flavor: 'similar', priceDeltaCents: 200, auto: false, reasoning: 'Creamy and rich like dairy cheese. Watch for tree nut allergy.' },
    ]
  },
  'cheddar-2': null,
  'cheddar-3': null,
  'american': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: 'Smooth richness and moisture, just like American cheese but plant-based.' },
      { name: 'Hummus', roles: ['richness', 'moisture', 'binding'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDeltaCents: 100, auto: false, reasoning: 'Hummus provides binding moisture. Shifts flavor toward Mediterranean.' },
    ]
  },
  'american-2': null,
  'provolone': {
    candidates: [
      { name: 'Avocado', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: "Replaces provolone's richness and adds freshness." },
      { name: 'Roasted Peppers', roles: ['richness', 'acidity', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Sweet and smoky. Complements the Italian flavor profile better than cheese does.' },
    ]
  },
  'butter': {
    candidates: [
      { name: 'Avocado Mash', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: "Creamy spread that replaces butter's richness without dairy." },
      { name: 'Olive Oil', roles: ['richness', 'moisture'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Classic dairy-free fat. Light and clean.' },
    ]
  },
  'butter-2': null,
  'mayo': {
    candidates: [
      { name: 'Hummus', roles: ['moisture', 'richness', 'binding', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: "Hummus replaces mayo's moisture and binding with added umami." },
      { name: 'Avocado Mash', roles: ['moisture', 'richness', 'binding'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: 'Creamy and mild. The closest neutral replacement for mayo.' },
      { name: 'Mustard', roles: ['moisture', 'acidity'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Tangy and bright. Changes the flavor direction but works on sandwiches.' },
    ]
  },
  'mayo-2': null,
  'sourdough': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free', 'low_carb'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Gluten-free structural replacement. Adds freshness, changes the eating experience.' },
      { name: 'Collard Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 100, auto: true, reasoning: 'Sturdier than lettuce. Holds up to wet fillings. Adds earthy flavor.' },
    ]
  },
  'sourdough-2': null,
  'sourdough-3': null,
  'wheat-bread': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free', 'low_carb'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Light and fresh structural replacement.' },
      { name: 'Gluten-Free Bread', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: 'Closest bread-like substitute. Keeps the sandwich experience familiar.' },
    ]
  },
  'kaiser': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Fresh and light structural replacement.' },
      { name: 'Gluten-Free Roll', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 150, auto: true, reasoning: 'Keeps the roll experience without the gluten.' },
    ]
  },
  'kaiser-2': null,
  'hero-roll': {
    candidates: [
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Gluten-free structural replacement.' },
      { name: 'Gluten-Free Roll', roles: ['structural'], dietary: ['gluten_free'], allergens: [], flavor: 'similar', priceDeltaCents: 200, auto: true, reasoning: 'Closest roll substitute for hero-style sandwiches.' },
    ]
  },
  'biscuit': {
    candidates: [
      { name: 'English Muffin', roles: ['structural'], dietary: [], allergens: ['gluten'], flavor: 'similar', priceDeltaCents: 0, auto: true, reasoning: 'Similar structural role. Different texture but familiar breakfast sandwich experience.' },
      { name: 'Lettuce Wrap', roles: ['structural', 'freshness'], dietary: ['gluten_free', 'vegan', 'dairy_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Gluten-free option. Changes the breakfast sandwich experience significantly.' },
    ]
  },
  'lox': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDeltaCents: 0, auto: true, reasoning: "Smoky umami protein substitute. Different texture but fills the same role profile." },
      { name: 'Cucumber Slices', roles: ['freshness', 'crunch'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Fresh and light. Loses protein but adds crunch and freshness.' },
    ]
  },
  'fried-egg': {
    candidates: [
      { name: 'Tofu Scramble', roles: ['protein', 'binding'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'complementary', priceDeltaCents: 100, auto: true, reasoning: 'Protein and binding like egg, but plant-based. Slightly different texture.' },
      { name: 'Extra Cheese', roles: ['protein', 'richness', 'binding'], dietary: ['vegetarian'], allergens: ['dairy'], flavor: 'similar', priceDeltaCents: 50, auto: false, reasoning: 'Adds protein and binding through dairy. Not vegan but vegetarian-compatible.' },
    ]
  },
  'egg-2': null,
  'poached-egg': null,
  'omelet': null,
  'turkey': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Protein and umami substitute. Different flavor but similar role profile.' },
      { name: 'Grilled Chicken', roles: ['protein'], dietary: [], allergens: [], flavor: 'similar', priceDeltaCents: 0, auto: false, reasoning: 'Lighter protein alternative. Familiar sandwich flavor.' },
    ]
  },
  'capicola': {
    candidates: [
      { name: 'Roasted Eggplant', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: 'Earthy umami with creamy texture. Surprisingly good on Italian sandwiches.' },
      { name: 'Grilled Zucchini', roles: ['freshness', 'crunch'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Fresh and mild. Loses umami but adds freshness and crunch.' },
    ]
  },
  'mortadella': {
    candidates: [
      { name: 'Hummus', roles: ['richness', 'moisture', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain sesame'], flavor: 'complementary', priceDeltaCents: 0, auto: true, reasoning: "Replaces mortadella's richness and adds umami. Watch for sesame." },
      { name: 'Roasted Peppers', roles: ['richness', 'freshness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 0, auto: false, reasoning: 'Sweet and smoky richness. Different direction but Italian-compatible.' },
    ]
  },
  'ham': {
    candidates: [
      { name: 'Smoked Tofu', roles: ['protein', 'umami'], dietary: ['vegan', 'dairy_free'], allergens: ['soy'], flavor: 'similar', priceDeltaCents: 0, auto: true, reasoning: "Smoky protein substitute. The closest vegan match for ham's role profile." },
      { name: 'Roasted Mushrooms', roles: ['umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 50, auto: false, reasoning: 'Deep umami and earthy richness. Different from ham but satisfying.' },
    ]
  },
  'sausage': {
    candidates: [
      { name: 'Veggie Sausage', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free'], allergens: ['may contain soy'], flavor: 'similar', priceDeltaCents: 100, auto: true, reasoning: 'Designed to mimic breakfast sausage. Similar shape, flavor, and role profile.' },
      { name: 'Grilled Portobello', roles: ['protein', 'umami', 'richness'], dietary: ['vegan', 'dairy_free', 'gluten_free'], allergens: [], flavor: 'complementary', priceDeltaCents: 100, auto: false, reasoning: 'Earthy and savory. Different flavor but fills the same breakfast role.' },
    ]
  },
};

// ─── ALIAS RESOLUTION ──────────────────────────────────────────────────

/**
 * Resolve an ingredient ID to its canonical substitution key.
 * Null entries in SUBSTITUTIONS inherit from a canonical key
 * by stripping trailing digits (e.g., 'bacon-2' → 'bacon').
 */
export function resolveSubKey(ingredientId: string): string {
  const rules = SUBSTITUTIONS[ingredientId];
  if (rules !== undefined && rules !== null) {
    return ingredientId;
  }
  // Try stripping trailing digits
  const base = ingredientId.replace(/-\d+$/, '');
  if (SUBSTITUTIONS[base] && SUBSTITUTIONS[base] !== null) {
    return base;
  }
  return ingredientId;
}

/**
 * Get substitution candidates for an ingredient.
 * Returns null if no rules exist for this ingredient.
 */
export function getSubstitutionCandidates(ingredientId: string): SubstitutionCandidateViewModel[] | null {
  const key = resolveSubKey(ingredientId);
  const rules = SUBSTITUTIONS[key];
  if (!rules || rules === null) return null;
  return rules.candidates;
}

/**
 * Get the top N auto-suggest candidates for an ingredient.
 * Returns empty array if no auto-suggest candidates exist.
 */
export function getAutoSuggestCandidates(ingredientId: string, count: number = 2): SubstitutionCandidateViewModel[] {
  const candidates = getSubstitutionCandidates(ingredientId);
  if (!candidates) return [];
  return candidates.filter(c => c.auto).slice(0, count);
}

/**
 * Format a price in cents as a dollar string.
 */
export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}
