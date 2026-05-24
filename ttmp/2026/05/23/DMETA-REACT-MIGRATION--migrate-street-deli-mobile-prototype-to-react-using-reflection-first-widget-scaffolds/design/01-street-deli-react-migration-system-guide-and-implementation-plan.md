---
Title: Street Deli React Migration: System Guide and Implementation Plan
Ticket: DMETA-REACT-MIGRATION
Status: active
Topics:
  - dmeta
  - react
  - migration
  - design-system
  - street-deli
  - widget-scaffolds
DocType: design
Intent: long-term
Owners: []
RelatedFiles:
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/mobile/index.html
    Note: Static HTML/CSS/JS prototype — the UX reference for all widget implementations
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/mobile/styles.css
    Note: Full CSS including design tokens, layout, typography, role colors, interaction states
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/mobile/app.js
    Note: Full application logic — menu data, substitution engine, cart, tracker, semantic view models
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
    Note: Instance manifest defining selected widgets, variants, and excluded templates
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/generated/widgets/
    Note: All generated widget scaffolds (metadata, types, adapter TODOs, stories)
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/widget-templates/
    Note: Local widget template YAML files with semantic_context, projection_hints, generation
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/02-design-language.yaml
    Note: Instance design-language IR with typography, color, density, layout, lint rules
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/core-model/street-deli-ordering.yaml
    Note: Domain example mapping concrete deli types onto archetypes and capabilities
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/design-docs/07-generated-instance-widget-review-guide.md
    Note: Review guide for scaffold evaluation and promotion rules
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/23/DMETA-WIDGET-REFLECTIVE-SCAFFOLDS--reflection-first-widget-scaffolds/design-doc/01-reflection-first-widget-scaffold-implementation-guide.md
    Note: Reflection-first scaffold philosophy, YAML model, generation modes
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/playbooks/02-dmeta-design-system-factory-runthrough-playbook.md
    Note: Phase-by-phase factory playbook from intent to concrete design-system instance
  - Path: /home/manuel/code/wesen/go-go-golems/dmeta/playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md
    Note: Core layer model, archetype vs capability, presentation-based UI playbook
ExternalSources: []
Summary: Exhaustive intern-ready guide explaining the DMETA system, the Street Deli domain, the static prototype, generated widget scaffolds, semantic inheritance, and the step-by-step plan to migrate to a React application.
LastUpdated: 2026-05-23T15:00:00-04:00
WhatFor: Read this before touching any React migration code. It explains every layer of the system from scratch.
WhenToUse: Open when starting work, when reviewing widget implementations, when deciding whether a scaffold fits or needs a new template, and when validating IR and plan output.
---

# Street Deli React Migration: System Guide and Implementation Plan

## Table of Contents

1. [Goal](#goal)
2. [System Overview](#system-overview)
3. [The DMETA Design-System Factory](#the-dmeta-design-system-factory)
4. [Semantic Inheritance: Archetypes, Capabilities, and Projections](#semantic-inheritance)
5. [Presentation-Based UI](#presentation-based-ui)
6. [The Street Deli Domain](#the-street-deli-domain)
7. [The Static Prototype (UX Reference)](#the-static-prototype)
8. [Generated Widget Scaffolds](#generated-widget-scaffolds)
9. [Instance Manifest and Template Selection](#instance-manifest-and-template-selection)
10. [Design Language IR](#design-language-ir)
11. [Reflection-First Philosophy](#reflection-first-philosophy)
12. [Promotion Rules](#promotion-rules)
13. [Migration Strategy](#migration-strategy)
14. [React Application Architecture](#react-application-architecture)
15. [Widget-by-Widget Implementation Guide](#widget-by-widget-implementation-guide)
16. [State Management](#state-management)
17. [Design Tokens and Styling](#design-tokens-and-styling)
18. [Validation Commands](#validation-commands)
19. [File Layout](#file-layout)
20. [Implementation Sequence](#implementation-sequence)
21. [Testing Strategy](#testing-strategy)
22. [Review Checklist](#review-checklist)
23. [Appendix: Data Flow Diagrams](#appendix-data-flow-diagrams)
24. [Appendix: API Reference — DMETA CLI Commands](#appendix-cli-reference)
25. [Appendix: Key File Reference Table](#appendix-file-reference)

---

## Goal {#goal}

Migrate the Hudson Street Deli mobile ordering prototype from its current form — a single-page static HTML/CSS/JS application — to a React + TypeScript + Vite application. The static prototype is the **UX reference**: its visual design, interaction patterns, layout, and information density are the ground truth for what the React app must produce.

The generated widget scaffolds under `examples/street-deli-ordering/generated/widgets/` are **semantic scaffolds**, not finished components. They carry metadata, type stubs, projection hints, adapter TODOs, and doc comments that explain *why* each widget was selected and *what* semantic context it sits in. The implementor promotes each scaffold into a real React component by replacing the JSON `<pre>` placeholder with real markup, real props, and real callbacks — guided by the scaffold's semantic context and the static prototype's visual behavior.

The instance manifest (`instantiations/street-deli-ordering.yaml`) tells us which 8 widgets are selected and which 6 templates are excluded. Widget template YAML files under `widget-templates/` carry `semantic_context`, `projection_hints`, and `generation` sections that explain applicability without forcing a rigid prop surface.

---

## System Overview {#system-overview}

DMETA is a *meta* design-system factory. It does not produce one component library. It produces a repeatable process — schemas, generators, validators, lint rules, and review playbooks — that can instantiate a concrete design system for any dense operational domain.

The layers, from most abstract to most concrete:

```
┌─────────────────────────────────────────────┐
│  Application Intent                          │
│  "Build a mobile deli ordering app"          │
├─────────────────────────────────────────────┤
│  Semantic Archetypes & Capabilities          │
│  WorkItem, ProductComposition, ingredient_   │
│  composable, dietary, stateful, temporal    │
├─────────────────────────────────────────────┤
│  Domain Mappings                             │
│  MenuItem → ProductComposition, OrderItem    │
│  → WorkItem + ProductComposition            │
├─────────────────────────────────────────────┤
│  Presentations & Actions                     │
│  composition_card, ingredient_list,          │
│  substitute_part, filter_by_dietary          │
├─────────────────────────────────────────────┤
│  Widget Template IR                          │
│  deli.composition_card, deli.menu_browser,   │
│  deli.order_tracker...                       │
├─────────────────────────────────────────────┤
│  Design Language IR                          │
│  Typography, color, density, lint rules     │
├─────────────────────────────────────────────┤
│  Instance Manifest                           │
│  Which widgets selected, which excluded,     │
│  which variants, what reasons               │
├─────────────────────────────────────────────┤
│  Generated Scaffolds                         │
│  .tsx, .types.ts, .metadata.ts,             │
│  .adapter.todo.ts, .stories.tsx             │
├─────────────────────────────────────────────┤
│  Promoted React Implementation               │
│  Real markup, real props, real callbacks,   │
│  real stories, passing lint                 │
└─────────────────────────────────────────────┘
```

Each layer has a clear consumer and a clear question it answers:

| Layer | Question | Consumer |
|---|---|---|
| Semantic archetypes | What reusable roles recur across domains? | Capability and presentation authors |
| Capabilities | What affordances can an object have? | Widget and presentation authors |
| Domain mappings | How do app-specific objects map onto archetypes? | Adapter implementors |
| Presentations | How can semantic values appear on screen? | Widget authors, action routers |
| Widget IR | What React component classes consume those presentations? | Scaffold generator |
| Design language | What visual/interaction constraints make the UI dense but calm? | React implementor, lint rules |
| Instance manifest | Which widgets are selected for this concrete app? | Scaffold generator |
| Generated scaffolds | What is the starting point for each widget? | React implementor (promotes) |
| Promoted React | What ships? | Users, Storybook, lint, audit |

---

## The DMETA Design-System Factory {#the-dmeta-design-system-factory}

The factory operates in phases (see `playbooks/02-dmeta-design-system-factory-runthrough-playbook.md`):

1. **Phase 0 — Orientation**: Import sources, create ticket, set up diary.
2. **Phase 1 — Semantic/archetype model**: Define reusable roles like Actor, WorkItem, Event.
3. **Phase 2 — Graphic design/UX archetype**: Define visual/interaction archetype as *ranges*, not hard values.
4. **Phase 3 — Concrete schema design**: Write YAML schemas with prose context.
5. **Phase 4 — Hard design rules**: Choose exact design tokens for one instance.
6. **Phase 5 — Widget DSL and generator design**: Define widget classes and generation outputs.
7. **Phase 6 — Tooling and validation**: Build validators, generators, lint rules.
8. **Phase 7 — Concrete domain instantiation**: Use the factory to produce a running app.

For Street Deli, Phases 0–6 are already complete. Phase 7 — producing a running React application — is what this ticket addresses.

The factory uses two intermediate documents:

- **Semantic archetype model** (`design-docs/02-semantic-archetype-and-capability-model.md`): Defines what archetypes, capabilities, projections, presentations, and actions are, and how they inherit.
- **Dense operational UI graphic design archetype** (`design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md`): Defines the visual/UX archetype as ranges.

---

## Semantic Inheritance: Archetypes, Capabilities, and Projections {#semantic-inheritance}

### Archetypes

An **archetype** is a reusable functional role that appears across many applications. They form an explicit inheritance tree rooted at the abstract `Archetype` class.

Key archetypes in the Street Deli domain:

| Archetype | Extends | Description | Abstract? |
|---|---|---|---|
| `Archetype` | — | Root | yes |
| `Composition` | Archetype | Something assembled from parts | yes |
| `ProductComposition` | Composition | Composition intended to become a sellable product | yes |
| `ProductSpec` | Archetype | Product metadata side (name, description, price) | yes |
| `MenuItem` | ProductSpec, ProductComposition | A sellable menu item | no |
| `WorkItem` | Archetype | Something with state and progress | no |
| `OrderItem` | WorkItem, ProductComposition | An item in an order | no |
| `Resource` | Archetype | A reusable thing with identity | no |
| `Ingredient` | Resource | An individual ingredient | no |
| `Substitution` | Archetype | A replacement rule | yes |
| `SubstitutionSuggestion` | Substitution | A concrete replacement suggestion | no |

**Important rule**: Concrete domain types (MenuItem, OrderItem, Ingredient) should never be base factory concepts. They map *onto* archetypes. The factory vocabulary stays domain-neutral.

### Capabilities

A **capability** is a reusable affordance or behavior. They also form an inheritance tree rooted at the abstract `Capability` class.

Key capabilities for Street Deli:

| Capability | Extends | Key Projections | Required? |
|---|---|---|---|
| `identifiable` | Capability | `id` | yes |
| `labelable` | Capability | `label`, `subtitle` | label required |
| `stateful` | Capability | `state`, `state_label`, `state_tone` | `state` required |
| `temporal` | Capability | `timestamp`, `start_time`, `end_time`, `duration_ms` | — |
| `available` | stateful, temporal | `availability_state`, `available_from`, `available_until` | `availability_state`, `state` required |
| `measurable` | Capability | `value`, `unit` | `value` required |
| `dietary` | Capability | `dietary_tags`, `allergen_contains`, `allergen_may_contain` | `dietary_tags` required |
| `composable` | Capability | `parts`, `part_count` | `parts` required |
| `ingredient_composable` | composable, role_composable | `ingredient_roles`, `optional_roles`, `required_roles`, `role_profile` | `ingredient_roles`, `parts` required |
| `configurable` | Capability | `config_options`, `current_config` | `config_options` required |
| `substitutable` | Capability | `replaces`, `replacement_candidates` | `replaces`, `replacement_candidates` required |
| `role_preserving_substitutable` | substitutable | `role_preservation`, `role_overlap_score`, `dietary_compatibility`, `price_delta_cents`, `flavor_fit`, `auto_suggest`, `allergen_flags` | `replaces`, `replacement_candidates` required |
| `dietary_substitutable` | dietary, substitutable | Inherits dietary + substitutable | `dietary_tags`, `replaces`, `replacement_candidates` required |
| `price_aware_substitutable` | measurable, substitutable | `price_delta_cents` (required) | `value`, `replaces`, `replacement_candidates` required |

### Projections

A **projection** is a typed field on a capability that can be rendered. Think of it as the semantic equivalent of a model field.

For example, `ingredient_composable` has these projections:

- `parts` (required): the list of ingredients
- `ingredient_roles` (required): the role map (structural, protein, richness, etc.)
- `optional_roles`: roles that are nice-to-have
- `required_roles`: roles that must be filled for composition integrity
- `role_profile`: the full role breakdown (documentation-only for widgets)
- `part_count`: number of parts

A widget's `projection_hints` reference these as `<capability_id>.<projection_name>` strings, e.g. `ingredient_composable.parts` or `dietary.dietary_tags`.

### How inheritance resolves

The Go resolver at `pkg/dmeta/validator/inheritance.go` computes:

- **Effective capabilities**: all capabilities a domain type inherits through its archetype chain
- **Effective projections**: all projections inherited through the capability chain
- **Effective presentations**: all presentations from those capabilities
- **Effective actions**: all actions from those capabilities
- **Effective filters**: all filters from those capabilities

The generated `.metadata.ts` sidecar already contains the resolved inheritance for each widget's consumed archetypes and capabilities, so the React implementor can read the metadata to understand *why* a widget was selected and *what* it has access to.

---

## Presentation-Based UI {#presentation-based-ui}

The central idea: application-specific entities are mapped onto reusable semantic archetypes and capabilities, then rendered through **typed presentations**. Actions declare what semantic archetypes/capabilities/domain types they accept, so users can invoke actions from on-screen representations.

A **presentation** is a named display contract, not just a visual component. It answers: "How can a semantic value appear on screen?"

Presentations attach at three levels:

| Level | Example | When to use |
|---|---|---|
| Capability | `status_badge` → `stateful`; `dietary_badge` → `dietary` | The presentation represents one reusable affordance |
| Archetype | `composition_card` → `ProductComposition`; `work_item_row` → `WorkItem` | The presentation composes multiple capabilities into a recognizable object |
| Domain type | Only when the generic presentation is insufficient | Rare; prefer archetype/capability level |

For Street Deli, the key presentations are:

| Presentation | Layer | Role | Attached to |
|---|---|---|---|
| `composition_card` | archetype | `summary_card` | ProductComposition |
| `composition_detail` | archetype | `detail_panel` | ProductComposition |
| `ingredient_list` | capability | `composition_list` | ingredient_composable |
| `substitution_badge` | capability | `badge` | substitutable |
| `substitution_pair` | capability | — | substitutable |
| `substitution_detail` | capability | — | substitutable |
| `dietary_badge` | capability | — | dietary |
| `allergen_warning` | capability | — | dietary |
| `status_badge` | capability | — | stateful |
| `prep_status_indicator` | capability | — | available |
| `config_selector` | capability | — | configurable |
| `order_item_row` | archetype | — | WorkItem + ProductComposition |

---

## The Street Deli Domain {#the-street-deli-domain}

The Street Deli domain is a mobile ordering app for "Hudson Street Deli" — a fictional sandwich counter that sells bagels, sandwiches, and breakfast items. The core innovation is an **intelligent ingredient replacement system**: when a customer removes an ingredient (e.g., "no cheese"), the system suggests role-preserving substitutions (e.g., "→ avocado") based on dietary compatibility, flavor fit, and price delta.

### Domain objects and their archetype/capability mappings

From `core-model/street-deli-ordering.yaml`:

```
Customer        → Actor                    + identifiable, labelable, dietary
Station         → Actor + Resource          + identifiable, labelable, stateful, spatial
MenuItem        → Composition + ActionSpec  + identifiable, labelable, composable, configurable, dietary
Ingredient      → Resource                  + identifiable, labelable, dietary
SubstitutionRule → Substitution + Relation  + identifiable, labelable, substitutable
OrderItem       → WorkItem + ProductComposition + ingredient_composable, configurable, stateful, relatable
```

### The replacement engine

The replacement engine lives in `app.js` as the `SUBSTITUTIONS` map and `resolveSubKey` function. It works as follows:

1. A customer removes an ingredient (e.g., bacon).
2. The engine looks up the ingredient in the substitution rules.
3. It finds ranked replacement candidates, each with:
   - `name`: what to replace with
   - `roles`: which ingredient roles the replacement fills (e.g., protein, umami, crunch)
   - `dietary`: dietary tags of the replacement
   - `allergens`: allergens the replacement introduces
   - `flavor`: `similar` or `complementary`
   - `priceDelta`: price change in cents
   - `auto`: whether this is the top auto-suggestion
   - `reasoning`: human-readable explanation
4. The UI shows top 2 candidates inline, with a "See all N options" button for more.
5. The customer taps a replacement to apply it.
6. The UI recalculates price, dietary summary, and allergen warnings.

This maps directly to the `role_preserving_substitutable` capability and its projections: `replaces`, `replacement_candidates`, `role_preservation`, `role_overlap_score`, `dietary_compatibility`, `price_delta_cents`, `flavor_fit`, `auto_suggest`, `allergen_flags`.

---

## The Static Prototype (UX Reference) {#the-static-prototype}

The static prototype at `www/mobile/` consists of three files:

| File | Lines | Purpose |
|---|---|---|
| `index.html` | ~130 | HTML structure: dietary filter bar, menu screen, customizer sheet, substitution detail sheet, cart FAB, cart screen, tracker screen |
| `styles.css` | ~700 | Full CSS with design tokens, component styles, role colors, interaction states, responsive frame |
| `app.js` | ~1117 | Menu data, substitution rules, config options, app state, semantic view model, render functions, event handlers |

### Screen flow

```
┌──────────────┐    tap card     ┌──────────────────────┐
│  Menu Screen  │ ──────────────→│  Customizer Sheet    │
│  (with dietary│                │  (bottom sheet)      │
│   filter bar  │←──────────────│  - ingredient list   │
│   + category  │  close/tap     │  - substitution zone │
│     tabs)     │  overlay       │  - config options    │
│               │                │  - dietary summary   │
│               │                │  - allergen warning  │
│               │                │  - add-to-order btn  │
└──────┬───────┘                └──────────────────────┘
       │
       │ tap cart FAB
       ▼
┌──────────────┐    place order  ┌──────────────────────┐
│  Cart Screen  │ ──────────────→│  Tracker Screen      │
│  (order items,│                │  (received →         │
│   totals,     │←──────────────│   preparing →        │
│   place order)│  back to menu   │   ready → picked up) │
└──────────────┘                └──────────────────────┘
```

### Key UX patterns from the prototype

1. **Dietary filter bar**: Sticky at top, horizontal scroll of pill chips (V, VG, GF, DF, NF). Active chips are filled green. Filtering is additive (show items matching ANY active tag).

2. **Category tabs**: Horizontal scroll below filter bar. "All", "Bagels", "Sandwiches", "Breakfast". Active tab is filled dark.

3. **Menu cards**: Vertical stack. Each card shows:
   - Semantic strip (DMETA archetype/capability badges) — optional in production, useful for debugging
   - Name + price (top row, flex space-between)
   - Description (secondary text)
   - Ingredient names (muted text, comma-separated)
   - Dietary badges (pill chips: V, VG, GF, DF, NF with semantic colors)

4. **Customizer bottom sheet**: Slides up from bottom. Contains:
   - Drag handle
   - Item name + price header
   - Semantic panel (DMETA badges)
   - Ingredients section: list of rows with remove button (−), name, role tags, dietary badges
   - Substitution zone (appears when ingredient removed): hint text, inline replacement cards with original → replacement, role tags, price delta
   - "See all N options" button opens substitution detail sheet
   - Config options: segmented controls (Toasted/Untoasted, Fried/Scrambled/Over Easy, etc.)
   - Dietary summary: aggregated badges
   - Allergen warning: danger-toned bar if substitution introduces new allergens
   - "Add to Order — $X.XX" button

5. **Substitution detail sheet**: Second bottom sheet showing:
   - Title + removed ingredient name
   - Unfilled role tags (yellow dashed border)
   - Full candidate list with name, reasoning, roles, dietary badges, price, flavor indicator, allergen warnings

6. **Cart FAB**: Fixed bottom bar with item count, "View Order" label, total price. Dark background.

7. **Cart screen**: Header with back button, list of cart items showing name, config summary, substitution lines, price, remove button. Footer with total and "Place Order" button.

8. **Tracker screen**: Step indicator (Received → Preparing → Ready → Picked Up) with animated dots and labels. Status text. Back to menu button.

### Design tokens from the prototype CSS

```css
:root {
  --bg: #FAF8F5;           /* warm white background */
  --surface: #FFFFFF;       /* card/sheet surface */
  --text: #2C2520;          /* primary text (warm dark brown) */
  --text-secondary: #7A7067;
  --text-muted: #A69E94;
  --divider: #E8E2DA;
  --accent: #5B8C3E;        /* warm avocado green */
  --accent-light: #EAF2E3;
  --font-sans: 'DM Sans', ...;
  --font-mono: 'SF Mono', 'Berkeley Mono', ...;
  --space-1: 4px; --space-2: 8px; ... --space-10: 40px;
  --r-sm: 6px; --r-md: 10px; --r-lg: 14px;
  --touch-min: 44px;
}
```

Role colors (ingredient role tags):

```css
--role-structural: #C49A3C;   /* amber */
--role-protein: #8B5E3C;       /* warm brown */
--role-richness: #6B8E4E;     /* avocado green */
--role-moisture: #5B8DB8;     /* light blue */
--role-acidity: #9AB844;      /* yellow-green */
--role-crunch: #7AB648;       /* lettuce green */
--role-heat: #C85A3A;         /* red-orange */
--role-umami: #7A5A3E;        /* brown */
--role-garnish: #6B9E6B;     /* herb green */
```

Semantic colors:

```css
--info: #3B7DD8; --success: #3A8A5C; --warning: #C4860B; --danger: #C43B3B;
```

---

## Generated Widget Scaffolds {#generated-widget-scaffolds}

The `dmeta scaffold-instance` command reads the instance manifest, resolves the selected templates, and writes scaffold files. Each widget gets a directory under `generated/widgets/`:

```
StreetDeliCompositionCard/
  StreetDeliCompositionCard.tsx              ← Component scaffold (JSON <pre> placeholder)
  StreetDeliCompositionCard.types.ts         ← Type stubs (unknown aliases)
  StreetDeliCompositionCard.metadata.ts      ← Metadata sidecar with semantic context
  StreetDeliCompositionCard.adapter.todo.ts  ← Adapter TODO (if scaffold_mode: adapter_todos)
  StreetDeliCompositionCard.stories.tsx      ← Storybook seed
  index.ts                                   ← Barrel export
```

### What each file is for

**`.tsx` (Component)**: A placeholder React component that renders `<section data-dmeta-widget="..."><pre>{JSON.stringify(props)}</pre></section>`. The implementor replaces this with real markup.

**`.types.ts` (Types)**: Stub types using `unknown` aliases (`MenuItemViewModel = unknown`, `PresentationRef = unknown`). The implementor replaces `unknown` with concrete view model types.

**`.metadata.ts` (Metadata sidecar)**: A `const` object recording template provenance, instance selection, variant, reason, full resolved semantic context, projection hints, and generation policy. This file should NOT be overwritten during promotion — it is the audit trail.

**`.adapter.todo.ts` (Adapter TODO)**: A scaffold file with a mapping function `mapDomainToXxxProps(input: unknown): XxxProps` that contains TODO comments for each projection hint. Not exported from the barrel. The implementor fills in real domain-to-view-model mapping or deletes this file.

**`.stories.tsx` (Stories)**: A minimal Storybook story that renders the component with placeholder props. The implementor adds stories for selected variant and edge states.

### The 8 selected widgets

| # | Template | Component | Variant | Category |
|---|---|---|---|---|
| 1 | `deli.menu_browser` | StreetDeliMenuBrowser | mobile_cards | menu_browsing |
| 2 | `deli.composition_card` | StreetDeliCompositionCard | mobile_default | item_cards |
| 3 | `deli.composition_customizer` | StreetDeliCompositionCustomizer | bottom_sheet | customization |
| 4 | `deli.ingredient_row` | StreetDeliIngredientRow | mobile_default | substitutions |
| 5 | `deli.substitution_chip` | StreetDeliSubstitutionChip | mobile_default | substitutions |
| 6 | `deli.order_cart` | StreetDeliOrderCart | mobile_bottom_sheet | ordering |
| 7 | `deli.order_tracker` | StreetDeliOrderTracker | compact_status | tracking |
| 8 | `deli.role_tag` | StreetDeliRoleTag | compact_mode | substitutions |

### The 6 excluded templates (and why)

| Template | Reason excluded |
|---|---|
| `dmeta.detail_drawer` | Mobile uses bottom sheets, not desktop drawers |
| `dmeta.dense_table` | Card-oriented flow, not table-oriented |
| `dmeta.record_stream` | No high-volume event streams |
| `dmeta.action_palette` | Explicit tap actions, not command palette |
| `deli.simple_menu_item_card` | Composition cards cover the sandwich items |
| `deli.bundle_menu_item_card` | No bundles/catering in this flow |

### Which widgets have adapter TODOs

Widgets with `scaffold_mode: adapter_todos` in their template YAML generate an `.adapter.todo.ts` file:

- `StreetDeliCompositionCard`
- `StreetDeliCompositionCustomizer`
- `StreetDeliSubstitutionChip`
- `StreetDeliOrderCart`
- `StreetDeliOrderTracker`

Widgets without adapter TODOs (scaffold_mode is `reflective` or not set):

- `StreetDeliMenuBrowser`
- `StreetDeliIngredientRow`
- `StreetDeliRoleTag`

---

## Instance Manifest and Template Selection {#instance-manifest-and-template-selection}

The instance manifest at `instantiations/street-deli-ordering.yaml` is the single source of truth for which widgets are selected.

Key sections:

```yaml
id: street_deli_ordering
name: Street Deli Ordering
template_sources:
  global_ir_root: ../../../sources/dmeta-ir
  local_template_files:
  - ../widget-templates/menu-browsing.yaml
  - ../widget-templates/item-cards.yaml
  - ../widget-templates/customization.yaml
  - ../widget-templates/modifiers.yaml
  - ../widget-templates/substitutions.yaml
  - ../widget-templates/ordering.yaml
  - ../widget-templates/availability.yaml
  - ../widget-templates/tracking.yaml
generation:
  output_dir: ../generated/widgets
  package_name: street-deli-ordering-widgets
selected_templates:
- template: deli.menu_browser
  as: StreetDeliMenuBrowser
  variant: mobile_cards
  reason: Primary mobile ordering entrypoint needs category browsing and menu-item cards.
# ... (7 more selected)
excluded_templates:
- template: dmeta.detail_drawer
  reason: The mobile ordering flow uses bottom-sheet/full-screen surfaces instead of desktop detail drawers.
# ... (5 more excluded)
```

The `template_sources.local_template_files` list is important: it defines the search path for widget template YAML. If a selected widget needs adjustments, you edit the corresponding YAML file under `widget-templates/`, NOT the generated scaffold.

If a new widget is needed that doesn't match any existing template, you add a new YAML entry to the appropriate `widget-templates/*.yaml` file, then re-run `dmeta scaffold-instance`.

---

## Design Language IR {#design-language-ir}

The design-language IR at `02-design-language.yaml` is a rich specification covering:

### Typography roles

| Role | Family | Size | Weight | Purpose |
|---|---|---|---|---|
| `body` | ui_sans | 15–17px | 400–500 | Menu item names, ingredient labels |
| `metadata` | ui_mono | 12–14px | 400–500 | Order numbers, timestamps, prices |
| `label` | ui_sans | 11–13px | 600–700 | Section headers, dietary badges, role tags |
| `title` | ui_sans | 20–28px | 600–700 | Detail view titles |
| `price` | ui_mono | 15–17px | 500–600 | Prices on cards and totals |
| `role_tag` | ui_sans | 10–12px | 600–700 | Ingredient role badges |
| `code` | ui_mono | 12–14px | 400–500 | Identifiers, order numbers |
| `section_heading` | ui_sans | 13–16px | 700–800 | Category and section headings |

### Color system

Neutral roles: `background` (warm white), `surface` (white), `text_primary`, `text_secondary`, `text_muted`, `divider`.

Semantic roles: `neutral`, `info`, `success`, `warning`, `danger`, `pending`, `active`, `selected`.

Ingredient role colors: `structural` (amber), `protein` (warm brown), `richness` (avocado green), `moisture` (light blue), `acidity` (yellow-green), `crunch` (lettuce green), `heat` (red-orange), `umami` (brown), `garnish` (herb green).

Additional roles from the CSS: `freshness` (green), `binding` (indigo).

### Density modes

| Mode | Row height | Cell padding | Font body |
|---|---|---|---|
| compact | 22–28px | 4–8 / 2–4 | 12–13px |
| regular | 28–36px | 6–10 / 4–6 | 13–14px |
| spacious | 36–44px | 10–14 / 6–10 | 14–15px |

**Hard boundary**: Touch targets must be ≥ 44×44pt regardless of density mode.

### Lint rules (severity)

| Rule | Severity |
|---|---|
| `no_raw_colors` | warning |
| `no_unauthorized_type_roles` | warning |
| `no_local_status_badges` | warning |
| `no_local_density_constants` | warning |
| `touch_target_minimum` | **error** |
| `dietary_always_visible` | **error** |
| `allergen_warning_visible` | **error** |
| `focus_visible_all_interactive` | **error** |
| `substitution_not_upsell` | warning |
| `no_hidden_substitution_costs` | warning |

---

## Reflection-First Philosophy {#reflection-first-philosophy}

The reflection-first principle (from `01-reflection-first-widget-scaffold-implementation-guide.md`) is central to this migration:

> **DMETA widget generation should produce semantically informed scaffolds, not semantically mandated components.**

What this means for the React implementor:

- **Use the metadata as guidance, not as a rigid prop specification.** The `.metadata.ts` tells you *why* a widget was selected and *what* semantic context is relevant. It does not tell you *exactly* what props to accept or *how* to lay out the component.
- **Use projection hints as suggestions, not requirements.** `labelable.label`, `measurable.value`, `ingredient_composable.parts`, and `dietary.dietary_tags` are recommended — but a compact card might show only the label and price, while a detail customizer shows all of them.
- **Adapter TODOs are checklists, not generated code.** The `.adapter.todo.ts` files list what you should think about when mapping domain data to widget props. They are not runtime code.
- **Doc comments are for humans and LLMs.** The generated JSDoc comments in `.tsx` files explain semantic context. They should be preserved (or evolved) during promotion — not deleted.

The three scaffold modes:

| Mode | What gets generated |
|---|---|
| `reflective` | Metadata, doc comments, Storybook docs, README. No adapter TODOs, no projection adapters. |
| `adapter_todos` | Everything from `reflective` PLUS `.adapter.todo.ts` files with TODO mapping functions. |
| `strict` | Everything from `adapter_todos` PLUS typed projection adapter stubs. Required hints must resolve. Opt-in only. |

Street Deli uses `adapter_todos` mode for most widgets.

---

## Promotion Rules {#promotion-rules}

From `design-docs/07-generated-instance-widget-review-guide.md`:

A promoted widget should have:

1. **Real semantic markup** rather than a JSON `<pre>` placeholder
2. **Props backed by concrete view-model types** (not `unknown`)
3. **Callbacks that emit typed presentation/action/filter requests**
4. **Storybook coverage** for selected variants and edge states
5. **No direct backend calls** inside the widget
6. **Metadata still recording** the originating template and instance selection reason
7. **Semantic context preserved** where useful for debugging/review

Before promotion, ask:

- Does the scaffold use archetype/capability context as guidance rather than a mandatory layout recipe?
- Are required projection hints genuinely required for this widget, or merely recommended/optional?
- Would strict projection adapter mode make this widget safer, or would it overconstrain the design?

**Regeneration rule**: Do not blindly overwrite promoted widgets. Regeneration is safe for scaffold-stage files. Once promoted, generator output becomes a migration aid, not an automatic replacement.

---

## Migration Strategy {#migration-strategy}

The migration proceeds in three phases:

### Phase 1: Project setup and design tokens

1. Initialize a Vite + React + TypeScript project in `www/mobile-react/`.
2. Extract design tokens from the static CSS into a `design-tokens/` module:
   - `tokens.ts` — color, spacing, radius, typography role constants
   - `typography.ts` — font family, size, weight, line-height helpers per role
   - `density.ts` — row height, padding helpers per density mode
   - `presentationStyles.ts` — reusable style maps per presentation recipe
   - `dataAttributes.ts` — helper for generating `data-dmeta-*` attributes
3. Set up Tailwind or CSS Modules with the design tokens as custom properties.
4. Copy the prototype's ingredient role colors, semantic colors, and neutral palette.

### Phase 2: View models and state management

1. Define concrete TypeScript view-model types that replace the `unknown` aliases in `.types.ts` files:
   - `MenuItemViewModel`
   - `IngredientViewModel`
   - `SubstitutionCandidateViewModel`
   - `CustomizationDraftViewModel`
   - `OrderItemViewModel`
   - `OrderTrackingViewModel`
   - `PresentationRef` (typed action/presentation request)
   - `PresentationActionRequest`
2. Set up state management (React context + useReducer or Zustand) that mirrors the static prototype's `state` object.
3. Port the substitution engine (SUBSTITUTIONS map, resolveSubKey, candidate filtering) into a `substitutionEngine.ts` module.
4. Port the menu data (MENU array, CONFIG_OPTIONS) into data modules.

### Phase 3: Widget-by-widget promotion

Promote each widget from scaffold to real implementation, following the implementation sequence below. For each widget:

1. Read the `.metadata.ts` to understand semantic context and projection hints.
2. Read the `.adapter.todo.ts` (if present) for the mapping checklist.
3. Read the corresponding section of the static prototype (HTML structure + CSS + JS render function).
4. Replace the `unknown` types in `.types.ts` with concrete view-model types.
5. Replace the `<pre>{JSON.stringify(props)}</pre>` in `.tsx` with real markup matching the prototype.
6. Implement callbacks that emit typed action/presentation requests.
7. Add `data-dmeta-*` attributes using the generated data attribute helpers.
8. Add Storybook stories for the selected variant and edge cases.
9. Do NOT overwrite `.metadata.ts` — it stays as the audit trail.

---

## React Application Architecture {#react-application-architecture}

```
www/mobile-react/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx                        ← Entry point
│   ├── App.tsx                          ← Screen router + global state provider
│   ├── design-tokens/
│   │   ├── tokens.ts                   ← Color, spacing, radius constants
│   │   ├── typography.ts               ← Typography role helpers
│   │   ├── density.ts                  ← Density mode helpers
│   │   ├── presentationStyles.ts       ← Per-presentation style maps
│   │   └── dataAttributes.ts           ← data-dmeta-* attribute helpers
│   ├── state/
│   │   ├── DeliContext.tsx             ← React context + provider
│   │   ├── deliReducer.ts             ← Main reducer (menu, cart, customizer, tracker)
│   │   ├── types.ts                   ← State shape types
│   │   └── actions.ts                 ← Action type definitions
│   ├── data/
│   │   ├── menuData.ts                ← MENU array from prototype
│   │   ├── substitutionRules.ts       ← SUBSTITUTIONS map from prototype
│   │   └── configOptions.ts           ← CONFIG_OPTIONS from prototype
│   ├── engine/
│   │   └── substitutionEngine.ts      ← resolveSubKey, filterByDietary, etc.
│   ├── view-models/
│   │   ├── menuViewModel.ts           ← MenuItemViewModel, MenuCategoryViewModel
│   │   ├── ingredientViewModel.ts     ← IngredientViewModel, IngredientRole
│   │   ├── substitutionViewModel.ts   ← SubstitutionCandidateViewModel
│   │   ├── cartViewModel.ts           ← OrderItemViewModel, OrderTotalsViewModel
│   │   ├── trackingViewModel.ts       ← OrderTrackingViewModel, TrackerStep
│   │   └── customizationViewModel.ts  ← CustomizationDraftViewModel
│   ├── widgets/
│   │   ├── StreetDeliMenuBrowser/
│   │   ├── StreetDeliCompositionCard/
│   │   ├── StreetDeliCompositionCustomizer/
│   │   ├── StreetDeliIngredientRow/
│   │   ├── StreetDeliSubstitutionChip/
│   │   ├── StreetDeliOrderCart/
│   │   ├── StreetDeliOrderTracker/
│   │   └── StreetDeliRoleTag/
│   ├── surfaces/
│   │   ├── DietaryFilterBar.tsx        ← Sticky dietary chip bar
│   │   ├── BottomSheet.tsx             ← Reusable bottom sheet primitive
│   │   ├── CartFab.tsx                 ← Floating cart button
│   │   └── ScreenHeader.tsx            ← Back button + title header
│   └── screens/
│       ├── MenuScreen.tsx              ← Menu browsing screen
│       ├── CartScreen.tsx              ← Cart review screen
│       └── TrackerScreen.tsx          ← Order tracker screen
├── .storybook/
│   ├── main.ts
│   └── preview.ts
└── README.md
```

### Key architectural decisions

1. **Screen routing**: Simple state-based rendering (no React Router needed — the prototype has only 3 screens with linear transitions). The `App.tsx` renders the active screen based on `state.activeScreen: 'menu' | 'cart' | 'tracker'`.

2. **State management**: React context + useReducer. The state shape mirrors the prototype's `state` object:

```typescript
// Pseudocode for state shape
type DeliState = {
  activeDietary: Set<string>;
  activeCategory: string;
  cart: CartItem[];
  customizing: CustomizationDraft | null;
  activeScreen: 'menu' | 'cart' | 'tracker';
  placedOrder: PlacedOrder | null;
  nextOrderNum: number;
};
```

3. **Widget boundaries**: Each widget receives typed props and emits typed callbacks. Widgets do NOT access the global state directly. The screen components wire widgets to the state.

4. **Data attributes**: Every rendered presentation carries `data-dmeta-*` attributes for testing and action routing. Use the generated `dataAttributes.ts` helper to construct them.

---

## Widget-by-Widget Implementation Guide {#widget-by-widget-implementation-guide}

### 1. StreetDeliRoleTag (molecule, no adapter TODO)

**What it renders**: An ultra-compact role tag pill like `PROTEIN`, `RICHNESS`, `CRUNCH`.

**Prototype reference**: `.role-tag` in CSS, rendered inside ingredient rows and substitution cards.

**Semantic context**: No archetype/capability context beyond being a visual rendering of an ingredient role label.

**Props** (replace `unknown`):

```typescript
type StreetDeliRoleTagProps = {
  role: IngredientRole;  // 'structural' | 'protein' | 'richness' | 'moisture' | ...
  className?: string;
};
```

**Implementation**:
- Look up the role color from the role color map.
- Render a `<span>` with `role-tag {role}` CSS class, the role name in uppercase.
- Use the design token for role tag typography (10–12px, 600–700 weight, uppercase, 0.06–0.1em tracking).

### 2. StreetDeliIngredientRow (molecule, no adapter TODO)

**What it renders**: One ingredient row in the customizer with remove button, name, role tags, dietary badges.

**Prototype reference**: `.ingredient-row` in CSS, `renderIngredientList()` in JS.

**Semantic context**: Ingredient → Resource; capabilities: identifiable, labelable, dietary.

**Projection hints**: `dietary.dietary_tags` (recommended), `identifiable.id`, `labelable.label`.

**Props**:

```typescript
type StreetDeliIngredientRowProps = {
  ingredient: IngredientViewModel;
  removed: boolean;
  substitution: SubstitutionCandidateViewModel | null;
  onRemove: (ingredientId: string) => void;
  onUndo: (ingredientId: string) => void;
  onShowSubstitutions: (ingredientId: string) => void;
};
```

**Implementation**:
- If `removed` and no `substitution`: strikethrough, grayed out, "+" undo button.
- If `substitution`: show replacement name, "was X" in muted text, substituted styling (green name), undo button (↶).
- If normal: "−" remove button, ingredient name, role tags (using StreetDeliRoleTag), dietary badges.
- Row min-height: 44px (touch target).

### 3. StreetDeliSubstitutionChip (molecule, adapter TODO)

**What it renders**: An inline substitution suggestion card showing `original → replacement` with role tags and price delta.

**Prototype reference**: `.sub-card` in CSS, rendered in `renderSubstitutionZone()`.

**Semantic context**: SubstitutionSuggestion → Substitution; capabilities: role_preserving_substitutable, dietary_substitutable, price_aware_substitutable.

**Projection hints**: `role_preserving_substitutable.replaces`, `substitutable.replacement_candidates` (recommended); `role_preserving_substitutable.role_overlap_score`, `dietary.allergen_contains` (optional).

**Props**:

```typescript
type StreetDeliSubstitutionChipProps = {
  originalName: string;
  candidate: SubstitutionCandidateViewModel;
  autoSuggest: boolean;
  applied: boolean;
  onApply: () => void;
};
```

**Implementation**:
- Show original name (strikethrough), arrow (→), replacement name (bold).
- Show role tags (compact), price delta ("+$1.50" in warning color or "no extra" in success).
- `autoSuggest` → green border; `applied` → green background.
- Min-height 44px.

### 4. StreetDeliCompositionCard (molecule, adapter TODO)

**What it renders**: A menu item card in the browsing list.

**Prototype reference**: `.menu-card` in CSS, rendered in `renderMenu()`.

**Semantic context**: ProductComposition; capabilities: ingredient_composable, dietary, measurable, available.

**Projection hints**: `labelable.label`, `measurable.value`, `ingredient_composable.parts`, `dietary.dietary_tags` (recommended); `available.availability_state` (optional).

**Props**:

```typescript
type StreetDeliCompositionCardProps = {
  item: MenuItemViewModel;
  onCustomize: (itemId: string) => void;
};
```

**Implementation**:
- Render name + price (flex row, space-between).
- Description (secondary text).
- Ingredient names (comma-separated, muted).
- Dietary badges (V, VG, GF, DF, NF pills).
- If unavailable: opacity 0.45, pointer-events none.
- Active press feedback: scale(0.98) transform.
- `data-dmeta-widget="deli.composition_card"`.

### 5. StreetDeliCompositionCustomizer (organism, adapter TODO)

**What it renders**: The full bottom-sheet customization surface.

**Prototype reference**: `#customizer-sheet` in HTML, `renderCustomizer()` in JS.

**Semantic context**: ProductComposition; capabilities: ingredient_composable, role_preserving_substitutable, configurable, dietary.

**Projection hints**: `ingredient_composable.parts`, `ingredient_composable.ingredient_roles`, `configurable.config_options`, `dietary.dietary_tags`, `substitutable.replacement_candidates` (recommended); `role_preserving_substitutable.role_overlap_score`, `dietary.allergen_contains` (optional).

**Props**:

```typescript
type StreetDeliCompositionCustomizerProps = {
  item: MenuItemViewModel;
  draft: CustomizationDraftViewModel;
  onRemoveIngredient: (ingredientId: string) => void;
  onUndoIngredient: (ingredientId: string) => void;
  onApplySubstitution: (ingredientId: string, candidateIndex: number) => void;
  onShowAllSubstitutions: (ingredientId: string) => void;
  onChangeConfig: (key: string, value: string) => void;
  onAddToOrder: () => void;
  onClose: () => void;
};
```

**Implementation**: This is the most complex widget. It composes:
- Header: item name + current price
- Ingredient list: using StreetDeliIngredientRow
- Substitution zone: using StreetDeliSubstitutionChip (when ingredient removed)
- Config options: segmented controls per category
- Dietary summary: aggregated badges
- Allergen warning: danger-toned bar
- Add-to-order button: "Add to Order — $X.XX"

### 6. StreetDeliMenuBrowser (organism, no adapter TODO)

**What it renders**: The entire menu browsing surface — category tabs + menu card list.

**Prototype reference**: `#menu-screen` in HTML, `renderMenu()` + `initCategoryTabs()` in JS.

**Semantic context**: Composition, Resource; capabilities: dietary, filter_source.

**Props**:

```typescript
type StreetDeliMenuBrowserProps = {
  categories: MenuCategoryViewModel[];
  activeCategory: string;
  activeDietary: Set<string>;
  onSelectCategory: (category: string) => void;
  onToggleDietary: (tag: string) => void;
  onSelectItem: (itemId: string) => void;
};
```

**Implementation**:
- DietaryFilterBar at top (sticky).
- Category tabs (horizontal scroll).
- Vertical card list using StreetDeliCompositionCard.
- Filter logic: show items matching ANY active dietary tag, filtered by active category.

### 7. StreetDeliOrderCart (organism, adapter TODO)

**What it renders**: The cart review screen.

**Prototype reference**: `#cart-screen` in HTML, `renderCart()` in JS.

**Semantic context**: WorkItem + ProductComposition; capabilities: measurable, stateful.

**Props**:

```typescript
type StreetDeliOrderCartProps = {
  items: OrderItemViewModel[];
  totals: OrderTotalsViewModel;
  onRemoveItem: (cartItemId: string) => void;
  onSubmitOrder: () => void;
  onBack: () => void;
};
```

**Implementation**:
- ScreenHeader with back button.
- Vertical list of cart items (name, config, substitutions, price, remove button).
- Footer with total + "Place Order" button.

### 8. StreetDeliOrderTracker (organism, adapter TODO)

**What it renders**: The order status tracker with step indicators.

**Prototype reference**: `#tracker-screen` in HTML, `placeOrder()` in JS.

**Semantic context**: WorkItem + TimelineSpan; capabilities: stateful, temporal, relatable.

**Props**:

```typescript
type StreetDeliOrderTrackerProps = {
  orderNumber: number;
  currentStep: 'received' | 'preparing' | 'ready' | 'picked_up';
  onBack: () => void;
};
```

**Implementation**:
- Step indicator: 4 dots connected by a line, completed steps filled green with ✓, active step pulsing.
- Status text.
- Back-to-menu button.

---

## State Management {#state-management}

### State shape

```typescript
type DeliState = {
  activeScreen: 'menu' | 'cart' | 'tracker';
  activeDietary: Set<string>;
  activeCategory: string;           // 'all' | 'bagels' | 'sandwiches' | 'breakfast'
  cart: CartItem[];
  customizing: CustomizationDraftViewModel | null;
  placedOrder: PlacedOrder | null;
  nextOrderNum: number;
  showSubDetail: string | null;     // ingredientId when substitution detail sheet is open
};

type CartItem = {
  id: number;
  menuItem: MenuItemViewModel;
  composition: IngredientState[];
  config: Record<string, string>;
  totalPriceCents: number;
};

type IngredientState = {
  id: string;
  name: string;
  roles: string[];
  required: boolean;
  dietary: string[];
  removed: boolean;
  substitution: SubstitutionCandidateViewModel | null;
};

type PlacedOrder = {
  orderNumber: number;
  currentStep: string;
  placedAt: number;
};
```

### Actions

```typescript
type DeliAction =
  | { type: 'SET_ACTIVE_CATEGORY'; category: string }
  | { type: 'TOGGLE_DIETARY'; tag: string }
  | { type: 'OPEN_CUSTOMIZER'; itemId: string }
  | { type: 'CLOSE_CUSTOMIZER' }
  | { type: 'REMOVE_INGREDIENT'; ingredientId: string }
  | { type: 'UNDO_INGREDIENT'; ingredientId: string }
  | { type: 'APPLY_SUBSTITUTION'; ingredientId: string; candidateIndex: number }
  | { type: 'CHANGE_CONFIG'; key: string; value: string }
  | { type: 'ADD_TO_ORDER' }
  | { type: 'REMOVE_CART_ITEM'; cartItemId: number }
  | { type: 'SHOW_CART' }
  | { type: 'BACK_TO_MENU' }
  | { type: 'PLACE_ORDER' }
  | { type: 'SHOW_SUB_DETAIL'; ingredientId: string }
  | { type: 'CLOSE_SUB_DETAIL' }
  | { type: 'ADVANCE_TRACKER_STEP' };
```

### Reducer pseudocode

```
function deliReducer(state, action):
  switch action.type:
    case 'TOGGLE_DIETARY':
      if tag in state.activeDietary:
        remove it
      else:
        add it
      return state

    case 'REMOVE_INGREDIENT':
      find ingredient in customizing.composition
      set removed = true, substitution = null
      recalculate price
      return state

    case 'APPLY_SUBSTITUTION':
      find ingredient in customizing.composition
      look up candidate from substitution engine
      set substitution = candidate
      recalculate price
      return state

    case 'ADD_TO_ORDER':
      push customizing draft to cart
      close customizer
      return state

    case 'PLACE_ORDER':
      assign order number
      switch to tracker screen
      start step advancement timer
      return state
```

---

## Design Tokens and Styling {#design-tokens-and-styling}

### Extracting tokens from the prototype CSS

The prototype uses CSS custom properties. The React app should use TypeScript constants plus CSS custom properties (or Tailwind theme extension) for runtime access.

```typescript
// tokens.ts (pseudocode)
export const colors = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  textPrimary: '#2C2520',
  textSecondary: '#7A7067',
  textMuted: '#A69E94',
  divider: '#E8E2DA',
  dividerStrong: '#D4CBC0',
  accent: '#5B8C3E',
  accentLight: '#EAF2E3',
  info: '#3B7DD8',
  success: '#3A8A5C',
  warning: '#C4860B',
  danger: '#C43B3B',
  pending: '#8A8A8A',
  active: '#2B6CB0',
} as const;

export const roleColors: Record<string, { bg: string; text: string }> = {
  structural: { bg: '#FEF3CD', text: '#92650A' },
  protein:   { bg: '#F5E6D8', text: '#6B3E20' },
  richness:  { bg: '#EAF2E3', text: '#3D6B2E' },
  moisture:  { bg: '#DBEAFE', text: '#1E5BA8' },
  acidity:   { bg: '#ECFCD4', text: '#4D7A0A' },
  crunch:    { bg: '#DCFCE7', text: '#15803D' },
  heat:      { bg: '#FEE2E2', text: '#B91C1C' },
  umami:     { bg: '#F5E6D8', text: '#7A5A3E' },
  garnish:   { bg: '#DCFCE7', text: '#3B7A4A' },
  freshness: { bg: '#ECFDF5', text: '#166534' },
  binding:   { bg: '#E0E7FF', text: '#4338CA' },
};

export const spacing = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 20,
  s6: 24, s8: 32, s10: 40,
} as const;

export const radius = { sm: 6, md: 10, lg: 14, full: 100 } as const;

export const touchTarget = { min: 44 } as const;
```

### Styling approach

Use **CSS Modules** with CSS custom properties from the design tokens. This keeps the styling close to the component while maintaining the token system for consistency. Alternatively, extend a Tailwind config — but ensure the design-language lint rules can still catch violations.

### Data attributes

```typescript
// dataAttributes.ts (pseudocode)
export function dmetaAttrs(opts: {
  widget?: string;
  domainType?: string;
  archetypes?: string[];
  capabilities?: string[];
  presentation?: string;
}): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (opts.widget) attrs['data-dmeta-widget'] = opts.widget;
  if (opts.domainType) attrs['data-dmeta-domain-type'] = opts.domainType;
  if (opts.archetypes) attrs['data-dmeta-archetypes'] = opts.archetypes.join(' ');
  if (opts.capabilities) attrs['data-dmeta-capabilities'] = opts.capabilities.join(' ');
  if (opts.presentation) attrs['data-dmeta-presentation'] = opts.presentation;
  return attrs;
}
```

---

## Validation Commands {#validation-commands}

### Validate the IR package

```bash
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
```

This checks:
- All archetype/capability references are valid
- No domain type maps to an abstract archetype directly
- Required projections are mapped
- Presentation requirements resolve

### Plan the instance

```bash
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

This shows:
- Selected templates with variants and reasons
- Excluded templates with reasons
- Any warnings or findings

### Re-scaffold the instance (when templates change)

```bash
go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

⚠️ **Never run `scaffold-instance --force` on promoted widgets** — it will overwrite real implementation. Use `--dry-run` first, then selectively regenerate only scaffold-stage widgets.

---

## File Layout {#file-layout}

### Where to put the React app

```
examples/street-deli-ordering/www/mobile-react/
```

This keeps it alongside the static prototype (`www/mobile/`) for easy comparison.

### Where promoted widgets live

Two options:

**Option A**: Work directly in `generated/widgets/` — promote scaffolds in place.

**Option B** (recommended): Copy scaffold files to `www/mobile-react/src/widgets/` — this keeps the generated directory as a clean reference and the React app as the promoted implementation.

Under either option, the `.metadata.ts` files travel with the widget to preserve the audit trail.

### Where new/updated templates go

If a widget doesn't fit an existing template:

1. Add a new template entry to the appropriate `widget-templates/*.yaml` file.
2. Include `semantic_context`, `projection_hints`, and `generation` sections.
3. Re-run `validate-ir` and `plan-instance` to confirm the new template is recognized.
4. Re-run `scaffold-instance --dry-run` to see what would be generated.
5. Only then scaffold the new widget.

---

## Implementation Sequence {#implementation-sequence}

### Step 0: Project setup

- [ ] Initialize Vite + React + TypeScript project in `www/mobile-react/`
- [ ] Install dev dependencies: Storybook, testing-library, vitest
- [ ] Create `design-tokens/` module with tokens, typography, density, data attributes
- [ ] Verify: `npm run dev` shows a blank app

### Step 1: View models and data

- [ ] Port `MENU` data from `app.js` to `data/menuData.ts`
- [ ] Port `SUBSTITUTIONS` from `app.js` to `data/substitutionRules.ts`
- [ ] Port `CONFIG_OPTIONS` from `app.js` to `data/configOptions.ts`
- [ ] Port `resolveSubKey` and substitution filtering to `engine/substitutionEngine.ts`
- [ ] Define view model types in `view-models/`
- [ ] Verify: unit tests for substitution engine pass

### Step 2: State management

- [ ] Implement `DeliContext`, `deliReducer`, actions
- [ ] Wire reducer to App component
- [ ] Verify: can toggle dietary filters, switch categories (with empty UI)

### Step 3: Atom-level widgets

- [ ] Implement `StreetDeliRoleTag` (simplest widget)
- [ ] Add Storybook story
- [ ] Implement `StreetDeliIngredientRow` (uses RoleTag)
- [ ] Add Storybook story

### Step 4: Molecule-level widgets

- [ ] Implement `StreetDeliSubstitutionChip`
- [ ] Implement `StreetDeliCompositionCard`
- [ ] Add Storybook stories for both

### Step 5: Organism-level widgets

- [ ] Implement `StreetDeliCompositionCustomizer` (most complex)
- [ ] Implement `StreetDeliMenuBrowser`
- [ ] Implement `StreetDeliOrderCart`
- [ ] Implement `StreetDeliOrderTracker`
- [ ] Add Storybook stories for all four

### Step 6: Screen assembly

- [ ] Implement `MenuScreen` (DietaryFilterBar + MenuBrowser)
- [ ] Implement `CartScreen` (OrderCart)
- [ ] Implement `TrackerScreen` (OrderTracker)
- [ ] Implement `BottomSheet` primitive
- [ ] Implement `CartFab`
- [ ] Wire screens into `App.tsx` with state-based routing

### Step 7: Integration testing

- [ ] Full flow: browse → customize → substitute → add to cart → review → place order → track
- [ ] Dietary filtering works correctly
- [ ] Allergen warnings appear when substitutions introduce new allergens
- [ ] Touch targets meet 44px minimum
- [ ] Dietary information is always visible (never hidden behind taps)

### Step 8: Validation and lint

- [ ] Run `validate-ir` and `plan-instance` — must show no errors
- [ ] Check design-language lint rules manually (no raw colors, authorized type roles, etc.)
- [ ] Verify all `data-dmeta-*` attributes are present on rendered presentations

---

## Testing Strategy {#testing-strategy}

### Unit tests (Vitest + React Testing Library)

For each widget:
- Renders without crashing
- Renders with different states (normal, removed, substituted, unavailable)
- Callbacks fire correctly on user interaction
- Dietary badges are always visible
- Touch targets meet minimum size

### Substitution engine tests

- `resolveSubKey` resolves aliases correctly
- Candidate filtering by dietary tags works
- Price delta calculation is correct
- Allergen detection on substitution works

### Integration tests

- Full ordering flow: browse → customize → add to cart → place order → track
- Dietary filter reduces menu correctly
- Category tab switches menu correctly
- Substitution flow: remove → see suggestions → apply → verify price update

### Visual regression (optional)

- Screenshot comparison with static prototype for each screen

---

## Review Checklist {#review-checklist}

Before marking a widget as promoted:

- [ ] Replaces `<pre>{JSON.stringify(props)}</pre>` with real semantic markup
- [ ] Props use concrete view-model types, not `unknown`
- [ ] Callbacks emit typed presentation/action/filter requests
- [ ] Storybook stories cover selected variant and edge states
- [ ] No direct backend calls inside the widget
- [ ] `.metadata.ts` still records template provenance
- [ ] `data-dmeta-*` attributes are present on rendered presentations
- [ ] Touch targets meet 44px minimum
- [ ] Dietary information is always visible
- [ ] No raw color literals — using design tokens
- [ ] Typography uses named roles
- [ ] Component matches static prototype visually

---

## Appendix: Data Flow Diagrams {#appendix-data-flow-diagrams}

### Menu browsing flow

```
MENU data ─→ filter by category ─→ filter by dietary ─→ MenuItemViewModel[]
                                                           │
                                                    StreetDeliCompositionCard
                                                           │
                                                     onCustomize(itemId)
                                                           │
                                                           ▼
                                                OPEN_CUSTOMIZER action
                                                           │
                                                           ▼
                                              CustomizationDraftViewModel
```

### Substitution flow

```
User taps "−" on ingredient row
        │
        ▼
REMOVE_INGREDIENT action
        │
        ▼
composition[i].removed = true
        │
        ▼
Substitution zone renders
        │
        ▼
Look up SUBSTITUTIONS[ingredientId]
        │
        ▼
Show top 2 candidates as StreetDeliSubstitutionChip
        │
        ├── "See all N options" → opens sub detail sheet
        │
        ▼
User taps a candidate
        │
        ▼
APPLY_SUBSTITUTION action
        │
        ▼
composition[i].substitution = candidate
        │
        ▼
Recalculate price, dietary summary, allergen warnings
```

### Cart flow

```
User taps "Add to Order"
        │
        ▼
ADD_TO_ORDER action
        │
        ▼
Push customizing draft to state.cart
        │
        ▼
Close customizer
        │
        ▼
CartFab appears with count + total
        │
        ▼
User taps CartFab → SHOW_CART
        │
        ▼
CartScreen renders StreetDeliOrderCart
        │
        ▼
User taps "Place Order" → PLACE_ORDER
        │
        ▼
Switch to TrackerScreen
        │
        ▼
Animate tracker steps
```

---

## Appendix: CLI Reference {#appendix-cli-reference}

### validate-ir

```bash
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
```

Checks the DMETA IR package at the given root. `--include-info` shows info-level findings. `--output table` renders as a table.

### plan-instance

```bash
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

Shows which templates are selected and excluded for the given instance manifest.

### scaffold-instance

```bash
# Dry run (don't write files)
go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table

# Write scaffold files (safe for new/unpromoted widgets)
go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table

# Force overwrite (DANGEROUS — will overwrite promoted widgets)
go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --force --output table
```

---

## Appendix: Key File Reference {#appendix-file-reference}

| File | Purpose |
|---|---|
| `www/mobile/index.html` | Static prototype HTML structure |
| `www/mobile/styles.css` | Full CSS with design tokens and component styles |
| `www/mobile/app.js` | Full application logic, menu data, substitution engine |
| `instantiations/street-deli-ordering.yaml` | Instance manifest (selected/excluded templates) |
| `widget-templates/item-cards.yaml` | Composition card, simple item, variant item, bundle, special templates |
| `widget-templates/menu-browsing.yaml` | Menu browser template |
| `widget-templates/customization.yaml` | Composition customizer template |
| `widget-templates/substitutions.yaml` | Ingredient row, substitution chip templates |
| `widget-templates/ordering.yaml` | Order cart template |
| `widget-templates/tracking.yaml` | Order tracker template |
| `generated/widgets/*/Xxx.metadata.ts` | Metadata sidecar with resolved semantic context |
| `generated/widgets/*/Xxx.adapter.todo.ts` | Adapter TODO scaffold |
| `generated/widgets/*/Xxx.types.ts` | Type stubs (unknown aliases) |
| `generated/widgets/*/Xxx.tsx` | Component scaffold (JSON placeholder) |
| `generated/widgets/*/Xxx.stories.tsx` | Storybook seed |
| `core-model/street-deli-ordering.yaml` | Domain type → archetype/capability mappings |
| `02-design-language.yaml` | Typography, color, density, lint rules |
| `design-docs/07-generated-instance-widget-review-guide.md` | Promotion and review rules |
| `ttmp/.../01-reflection-first-widget-scaffold-implementation-guide.md` | Reflection-first philosophy and YAML model |
| `playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md` | Core layer model and presentation-based UI playbook |
| `playbooks/02-dmeta-design-system-factory-runthrough-playbook.md` | Phase-by-phase factory playbook |
