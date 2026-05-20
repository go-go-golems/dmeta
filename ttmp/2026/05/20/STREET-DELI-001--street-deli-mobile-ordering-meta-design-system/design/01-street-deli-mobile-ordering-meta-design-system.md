---
Title: Street Deli Mobile Ordering Meta Design System
Ticket: STREET-DELI-001
Status: active
Topics:
    - design-system
    - dsl
    - presentation-based-ui
    - food-ordering
    - intelligent-replacement
    - mobile
DocType: design
Intent: long-term
Owners: []
RelatedFiles:
    - Path: core-model/archetypes.yaml
      Note: Deli-extended archetypes (Composition, Substitution)
    - Path: core-model/capabilities.yaml
      Note: Deli-extended capabilities (composable, substitutable, configurable, dietary)
    - Path: core-model/core-model.yaml
      Note: Core model metadata, logical types, dietary tags, ingredient roles, flavor profiles
    - Path: core-model/presentations.yaml
      Note: Deli-extended presentations and actions for ordering and replacement
    - Path: core-model/street-deli-ordering.yaml
      Note: Concrete domain example mapping deli types to archetypes/capabilities
    - Path: examples/street-deli-ordering/00-index.yaml
      Note: IR package manifest
    - Path: examples/street-deli-ordering/01-core-model.yaml
      Note: Core model package index
    - Path: examples/street-deli-ordering/02-design-language.yaml
      Note: Mobile deli ordering design language
    - Path: examples/street-deli-ordering/03-widgets.yaml
      Note: Deli widget inventory
    - Path: examples/street-deli-ordering/core-model/archetypes.yaml
      Note: Composition and Substitution archetypes
    - Path: examples/street-deli-ordering/core-model/capabilities.yaml
      Note: composable
    - Path: examples/street-deli-ordering/core-model/core-model.yaml
      Note: Core model metadata with dietary tags
    - Path: examples/street-deli-ordering/core-model/presentations.yaml
      Note: Deli presentations and actions including substitution flow
    - Path: examples/street-deli-ordering/core-model/street-deli-ordering.yaml
      Note: Concrete domain example with replacement scenarios
    - Path: examples/street-deli-ordering/prototype-clim/app.js
      Note: CLIM JS with action registry
    - Path: examples/street-deli-ordering/prototype-clim/index.html
      Note: CLIM prototype HTML
    - Path: examples/street-deli-ordering/prototype-clim/styles.css
      Note: Monochrome CLIM CSS
    - Path: examples/street-deli-ordering/prototype/app.js
      Note: Prototype JS with replacement engine
    - Path: examples/street-deli-ordering/prototype/index.html
      Note: Prototype HTML
    - Path: examples/street-deli-ordering/prototype/styles.css
      Note: Prototype CSS
    - Path: ttmp/2026/05/20/STREET-DELI-001--street-deli-mobile-ordering-meta-design-system/examples/street-deli-ordering/02-design-language.yaml
      Note: Mobile deli ordering design language
    - Path: ttmp/2026/05/20/STREET-DELI-001--street-deli-mobile-ordering-meta-design-system/examples/street-deli-ordering/03-widgets.yaml
      Note: Deli-ordering widget inventory
ExternalSources: []
Summary: Full meta design system for a mobile ordering app for a street deli, built on DMETA v0 with intelligent ingredient replacement.
LastUpdated: 2026-05-20T08:00:00-04:00
WhatFor: Use as the top-level design document for understanding and implementing the street deli ordering meta design system.
WhenToUse: Read before implementing the deli ordering UI, extending the replacement engine, or adding new menu items and substitution rules.
---




# Street Deli Mobile Ordering Meta Design System

## Executive Summary

This document describes a meta design system for a mobile ordering app for a street deli, built on the DMETA v0 design-system factory. The core differentiator is an **intelligent ingredient replacement system**: when a customer removes an ingredient (e.g., "no cheese"), the system suggests compatible replacements (e.g., avocado) based on functional role preservation, dietary constraint matching, allergen safety, flavor profile compatibility, and price transparency.

The system maps deli domain objects—menu items, orders, ingredients, substitutions, customers, and prep events—onto the DMETA archetype/capability vocabulary so the same presentation and action machinery used for agent workflows and retail logistics produces a concrete deli ordering UI.

## Design Principles

### 1. Role-based replacement, not category-based

The replacement engine reasons about **ingredient roles**, not food categories. Cheese provides "richness" and "creaminess"; avocado can replace it because it provides similar roles. A pickle provides "acidity" and "crunch"; roasted peppers might substitute because they provide similar acidity. This is why the system has `ingredient_role` as a first-class logical type and `composable` as a first-class capability.

### 2. Composition integrity over simple removal

Removing an ingredient is not just a deletion—it creates unfilled roles in the composition. A BLT without bacon has lost its primary protein and smoky umami; the replacement engine should flag this and suggest role-preserving alternatives. A composition with no structural part (e.g., removing bread without a wrap replacement) should warn the customer.

### 3. Dietary transparency as a safety requirement

Dietary tags and allergen warnings are always visible, never hidden behind interactions. This is not a UX preference—it is a safety requirement for a food ordering application. The `dietary` capability and `dietary_badge`/`allergen_warning` presentations enforce this at the design-system level.

### 4. Substitution is recommendation, not upselling

Replacement suggestions are generated by role preservation and dietary compatibility, not by profit margin. If a higher-priced item is suggested, it is because it is the best role match. The lint rule `substitution_not_upsell` enforces this.

### 5. Mobile-first, touch-native

All interactive targets meet 44×44pt minimum. Swipe gestures are primary for ingredient list actions. Bottom sheets are preferred over modals. The primary ordering flow (see → customize → add → order) is under 5 taps.

## Domain Model

### Archetype Mapping

| Deli Concept | DMETA Archetype | Rationale |
|---|---|---|
| Customer | Actor | Places orders, has dietary profile |
| Station | Actor + Resource | Prep station with location and status |
| MenuItem | Composition + ActionSpec | Composable food item that can be ordered |
| Ingredient | Resource | Part of a composition with role and dietary metadata |
| SubstitutionRule | Substitution + Relation | Replacement rule connecting ingredients |
| Order | WorkItem + TimelineSpan | Moves through preparation lifecycle |
| OrderItem | WorkItem + Composition | Customized line item with applied substitutions |
| PrepEvent | Event | Append-only preparation status update |

### Capability Extensions

The deli domain adds four capabilities beyond the base DMETA v0 model:

1. **composable** — A thing is assembled from parts with functional roles. This is the foundation of the replacement engine: when a part is removed, the system knows which roles are unfilled.

2. **substitutable** — A part can be replaced by alternatives that preserve composition integrity. This encodes the replacement knowledge: role preservation, dietary compatibility, allergen flags, flavor fit, and price delta.

3. **configurable** — A thing has customer-configurable options beyond composition (size, spice, temperature). These are distinct from ingredient substitutions.

4. **dietary** — A thing carries dietary constraint tags and allergen metadata. This filters substitutions and displays safety information.

### The Intelligent Replacement Flow

```
Customer swipes to remove cheese from a sandwich
  → IngredientRow emits onRemove with PresentationRef
  → Composition state updates: cheese removed, roles [richness, creaminess, umami] now unfilled
  → Replacement engine queries SubstitutionRules for cheese
  → Returns ranked candidates:
      1. Avocado (richness, creaminess, freshness) — dairy_free, vegan — +$1.50 — auto_suggest
      2. Nutritional yeast (umami, sharpness) — dairy_free, vegan — +$0.00
      3. Hummus (richness, moisture, umami) — dairy_free, vegan, may_contain_sesame — +$1.00
  → SubstitutionChip appears inline: "No cheese → Avocado (+$1.50)"
  → Customer taps chip to apply, or taps "See alternatives" for full candidate list
  → If customer has dairy_free in dietary profile, cheese removal is auto-suggested
  → If replacement introduces allergen (e.g., hummus → sesame), AllergenWarningBanner appears
  → Composition updates: cheese replaced by avocado, roles filled, dietary tags updated
  → Price updates: +$1.50 shown on PriceText
```

## Concrete Replacement Examples

### No cheese → Avocado (dairy-free or preference)

| Candidate | Roles Filled | Flavor Fit | Dietary | Allergens | Price Delta | Auto-Suggest |
|---|---|---|---|---|---|---|
| Avocado | richness, creaminess, freshness | similar | DF, V, GF | none | +$1.50 | ✅ |
| Nutritional yeast | umami, sharpness | complementary | DF, V, GF | none | +$0.00 | ❌ |
| Hummus | richness, moisture, umami | complementary | DF, V, GF | may contain sesame | +$1.00 | ❌ |

### No bacon → Smoked tofu (vegan/vegetarian or preference)

| Candidate | Roles Filled | Flavor Fit | Dietary | Allergens | Price Delta | Auto-Suggest |
|---|---|---|---|---|---|---|
| Smoked tofu | protein, umami, smokiness | similar | V, VG, DF | contains soy | +$0.00 | ✅ |
| Tempeh bacon | protein, umami, smokiness, crunch | similar | V, VG, DF | contains soy | +$2.00 | ✅ |
| Grilled portobello | protein, umami, earthiness | complementary | V, VG, GF, DF | none | +$1.00 | ❌ |

### No bread → Lettuce wrap (gluten-free or keto)

| Candidate | Roles Filled | Flavor Fit | Dietary | Allergens | Price Delta | Auto-Suggest |
|---|---|---|---|---|---|---|
| Lettuce wrap | structural, freshness | complementary | GF, LC, K, V | none | +$0.00 | ✅ |
| Collard green wrap | structural, freshness | complementary | GF, LC, V | none | +$1.00 | ✅ |
| Rice paper wrap | structural | neutral | GF, V | none | +$0.50 | ❌ |

### No mayo → Hummus (egg-free or vegan)

| Candidate | Roles Filled | Flavor Fit | Dietary | Allergens | Price Delta | Auto-Suggest |
|---|---|---|---|---|---|---|
| Hummus | moisture, richness, binding, umami | complementary | DF, EF, V | may contain sesame | +$0.00 | ✅ |
| Avocado mash | moisture, richness, binding | similar | DF, EF, V, GF | none | +$1.50 | ✅ |
| Vegan aioli | moisture, richness, binding | similar | DF, EF, V | contains soy | +$1.00 | ❌ |

## Ordering Flow

### Browsing → Customizing → Ordering → Tracking

```
1. Menu Browser (dietary filters at top, category tabs, composition cards)
2. Tap composition card → Composition Customizer (bottom sheet)
3. Ingredient list with role tags, dietary badges, swipe actions
4. Swipe ingredient → Remove or Substitute
5. If remove: replacement engine generates substitution chips
6. Tap substitution chip to apply → composition updates
7. Configure size/spice/temperature via ConfigSelector
8. Tap "Add to Order" → OrderCart updates
9. Review cart → Place Order
10. Order Tracker shows station progress, prep events, pickup
```

### Touch Interaction Model

- **Tap**: Select, open detail, apply substitution
- **Swipe left**: Remove ingredient from composition
- **Swipe right**: Open substitution alternatives
- **Long press**: Open ingredient detail / full substitution sheet
- **Bottom sheet**: Composition customizer, substitution detail, cart

## Widget Inventory

### Atoms

| Widget | Purpose |
|---|---|
| RoleTag | Ultra-compact ingredient role label (PROTEIN, RICHNESS, etc.) |
| DietaryBadge | Compact dietary constraint badge (V, GF, DF, NF) |
| SubstitutionChip | Inline "No X → Y" replacement suggestion |
| PriceText | Tabular price display with delta indicator |
| PrepStatusBadge | Order preparation status indicator |

### Molecules

| Widget | Purpose |
|---|---|
| IngredientRow | Single ingredient with role tags, dietary flags, swipe actions |
| ConfigSelector | Size/spice/temperature option picker |
| AllergenWarningBanner | Allergen conflict warning between substitution and customer profile |

### Organisms

| Widget | Purpose |
|---|---|
| CompositionCard | Browsable menu item card |
| CompositionCustomizer | Full customization surface (ingredients, substitutions, config, add-to-order) |
| SubstitutionDetailSheet | Full candidate list for a replacement |
| OrderCart | Cart with items, substitutions, dietary summary, place-order |
| OrderTracker | Post-order station progress and pickup |
| MenuBrowser | Primary browsing surface with filters and categories |

## Relationship to Base DMETA v0

This design system is an **instance** of the DMETA v0 factory, not a fork. It:

- Inherits all base archetypes and capabilities without modification
- Adds two archetypes (Composition, Substitution) and four capabilities (composable, substitutable, configurable, dietary)
- Adds domain-specific presentations and actions
- Adapts the design language for mobile-first touch interaction
- Defines a domain-specific widget inventory

The domain example (`street-deli-ordering.yaml`) pressure-tests the model by mapping concrete deli types and providing concrete replacement scenarios.

## File Layout

```
dmeta/examples/street-deli-ordering/
  00-index.yaml                          # IR package manifest
  01-core-model.yaml                     # Core model package index
  core-model/
    core-model.yaml                      # Metadata, logical types, dietary tags, ingredient roles
    archetypes.yaml                      # Deli-extended archetypes
    capabilities.yaml                    # Deli-extended capabilities
    presentations.yaml                   # Deli-extended presentations and actions
    street-deli-ordering.yaml            # Concrete domain example with replacement scenarios
  02-design-language.yaml                # Mobile deli ordering design language
  03-widgets.yaml                        # Deli-ordering widget inventory
```

## Open Questions

1. Should the replacement engine be a client-side reasoning system, a server-side API, or a hybrid with local caching of substitution rules?
2. Should cascading substitutions be supported (e.g., removing bread → lettuce wrap → which itself changes which condiments work)?
3. How should the system handle out-of-stock ingredients that are required for a composition?
4. Should customer dietary profiles be persistent (across sessions) or per-order?
5. Should the replacement engine learn from customer acceptance/rejection patterns over time?
6. How should station capacity and wait time influence the ordering flow (e.g., "grill is backed up, cold items will be faster")?
