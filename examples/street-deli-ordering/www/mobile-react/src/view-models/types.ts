/**
 * Concrete view model types for the Street Deli ordering application.
 *
 * These replace the `unknown` aliases in the generated scaffold .types.ts files.
 * Each type is derived from the static prototype's data structures (app.js)
 * and informed by the DMETA semantic context and projection hints.
 *
 * @see www/mobile/app.js -- MENU, SUBSTITUTIONS, state
 * @see examples/street-deli-ordering/meta-design-systems/web - Web MetaDesignSystem provenance
 */

// ─── INGREDIENT ────────────────────────────────────────────────────────

export type IngredientRole =
  | 'structural'
  | 'protein'
  | 'richness'
  | 'moisture'
  | 'acidity'
  | 'crunch'
  | 'heat'
  | 'umami'
  | 'garnish'
  | 'freshness'
  | 'binding';

export type DietaryTag = 'vegan' | 'vegetarian' | 'gluten_free' | 'dairy_free' | 'nut_free' | 'low_carb';

export type AllergenTag = 'gluten' | 'dairy' | 'eggs' | 'fish' | 'soy' | 'tree_nuts' | 'may contain sesame';

export type IngredientViewModel = {
  id: string;
  name: string;
  roles: IngredientRole[];
  required: boolean;
  dietary: DietaryTag[];
};

// ─── SUBSTITUTION ──────────────────────────────────────────────────────

export type FlavorFit = 'similar' | 'complementary';

export type SubstitutionCandidateViewModel = {
  name: string;
  roles: IngredientRole[];
  dietary: DietaryTag[];
  allergens: string[];
  flavor: FlavorFit;
  priceDeltaCents: number;
  auto: boolean;
  reasoning: string;
};

// ─── MENU ITEM ─────────────────────────────────────────────────────────

export type MenuCategory = 'bagels' | 'sandwiches' | 'breakfast';

export type MenuItemViewModel = {
  id: string;
  name: string;
  category: MenuCategory;
  basePriceCents: number;
  description: string;
  ingredients: IngredientViewModel[];
  dietary: DietaryTag[];
  allergens: AllergenTag[];
};

// ─── MENU CATEGORY ─────────────────────────────────────────────────────

export type MenuCategoryViewModel = {
  id: MenuCategory | 'all';
  label: string;
};

// ─── CUSTOMIZATION DRAFT ───────────────────────────────────────────────

export type IngredientState = {
  id: string;
  name: string;
  roles: IngredientRole[];
  required: boolean;
  dietary: DietaryTag[];
  removed: boolean;
  substitution: SubstitutionCandidateViewModel | null;
};

export type CustomizationDraftViewModel = {
  menuItemId: string;
  menuItemName: string;
  composition: IngredientState[];
  config: Record<string, string>;
  currentPriceCents: number;
};

// ─── CONFIG OPTIONS ────────────────────────────────────────────────────

export type ConfigOptionViewModel = {
  key: string;
  label: string;
  values: string[];
  defaultIndex: number;
};

// ─── CART ──────────────────────────────────────────────────────────────

export type CartItemViewModel = {
  id: number;
  menuItem: MenuItemViewModel;
  composition: IngredientState[];
  config: Record<string, string>;
  totalPriceCents: number;
};

export type OrderTotalsViewModel = {
  subtotalCents: number;
  itemCount: number;
};

// ─── ORDER TRACKING ────────────────────────────────────────────────────

export type TrackerStep = 'received' | 'preparing' | 'ready' | 'picked_up';

export type OrderTrackingViewModel = {
  orderNumber: number;
  currentStep: TrackerStep;
};

// ─── PRESENTATION / ACTION TYPES ───────────────────────────────────────

/**
 * A typed reference to a semantic presentation on screen.
 * Used for action routing: "inspect this presentation", "fill action argument from this presentation".
 */
export type PresentationRef = {
  domainType: string;
  semanticId: string;
  presentationId: string;
  archetypes: string[];
  capabilities: string[];
  label: string;
};

/**
 * A typed request to perform a presentation action.
 * Callbacks emit these rather than performing side effects directly.
 */
export type PresentationActionRequest = {
  actionId: string;
  payload: Record<string, unknown>;
  sourcePresentation?: PresentationRef;
};
