# Generated DMETA widgets for Street Deli Ordering

Concrete DMETA instantiation for the Hudson Street Deli sandwich/composition mobile ordering flow.

## Selected templates

- `StreetDeliMenuBrowser` from `deli.menu_browser` variant `mobile_cards`: Primary mobile ordering entrypoint needs category browsing and menu-item cards.
  - Resolved context: 2 resolved archetypes, 2 resolved capabilities, 2 resolved presentations
- `StreetDeliCompositionCard` from `deli.composition_card` variant `mobile_default`: Sandwiches and bowls need compact composition summaries with dietary and price data.
  - Semantic context: archetypes:ProductComposition, capabilities:ingredient_composable, capabilities:dietary, capabilities:measurable, capabilities:available, presentations:composition_card
  - Projection hints: 4 recommended, 3 optional, 1 documentation-only, 2 adapter TODOs
  - Resolved context: 1 resolved archetypes, 4 resolved capabilities, 1 resolved presentations
  - Adapter TODO scaffold: `StreetDeliCompositionCard.adapter.todo.ts`
- `StreetDeliCompositionCustomizer` from `deli.composition_customizer` variant `bottom_sheet`: Ingredient removal and intelligent substitutions are the core sandwich customization workflow.
  - Semantic context: archetypes:ProductComposition, capabilities:ingredient_composable, capabilities:role_preserving_substitutable, capabilities:configurable, capabilities:dietary, presentations:composition_detail, presentations:ingredient_list, presentations:substitution_badge
  - Projection hints: 5 recommended, 2 optional, 2 adapter TODOs
  - Resolved context: 1 resolved archetypes, 4 resolved capabilities, 3 resolved presentations
  - Adapter TODO scaffold: `StreetDeliCompositionCustomizer.adapter.todo.ts`
- `StreetDeliIngredientRow` from `deli.ingredient_row` variant `mobile_default`: Customizer needs explicit ingredient rows with remove/substitute actions.
  - Resolved context: 2 resolved capabilities, 2 resolved presentations
- `StreetDeliSubstitutionChip` from `deli.substitution_chip` variant `mobile_default`: Replacement suggestions need a compact reusable action presentation.
  - Semantic context: archetypes:Substitution, capabilities:role_preserving_substitutable, capabilities:dietary_substitutable, capabilities:price_aware_substitutable, presentations:substitution_badge, presentations:substitution_pair
  - Projection hints: 3 recommended, 3 optional, 2 adapter TODOs
  - Resolved context: 1 resolved archetypes, 3 resolved capabilities, 2 resolved presentations
  - Adapter TODO scaffold: `StreetDeliSubstitutionChip.adapter.todo.ts`
- `StreetDeliOrderCart` from `deli.order_cart` variant `mobile_bottom_sheet`: Ordering flow needs cart review, totals, and submit actions.
  - Semantic context: archetypes:OrderItem, archetypes:WorkItem, archetypes:ProductComposition, capabilities:ingredient_composable, capabilities:configurable, capabilities:measurable, capabilities:stateful, presentations:order_item_row, presentations:compact_ref
  - Projection hints: 4 recommended, 2 optional, 2 adapter TODOs
  - Resolved context: 3 resolved archetypes, 4 resolved capabilities, 2 resolved presentations
  - Adapter TODO scaffold: `StreetDeliOrderCart.adapter.todo.ts`
- `StreetDeliOrderTracker` from `deli.order_tracker` variant `compact_status`: After order submission, users need preparation status and pickup state.
  - Semantic context: archetypes:Order, archetypes:WorkItem, archetypes:TimelineSpan, capabilities:stateful, capabilities:temporal, capabilities:relatable, presentations:prep_status_indicator, presentations:timeline_marker, presentations:dense_row
  - Projection hints: 3 recommended, 3 optional, 1 adapter TODOs
  - Resolved context: 3 resolved archetypes, 3 resolved capabilities, 3 resolved presentations
  - Adapter TODO scaffold: `StreetDeliOrderTracker.adapter.todo.ts`
- `StreetDeliRoleTag` from `deli.role_tag` variant `compact_mode`: Ingredient roles are central to explaining substitutions and composition structure.

## Explicitly excluded templates

- `dmeta.detail_drawer`: The mobile ordering flow uses bottom-sheet/full-screen surfaces instead of desktop detail drawers.
- `dmeta.dense_table`: The street-deli flow is card/customizer/cart oriented, not table oriented.
- `dmeta.record_stream`: The customer app does not expose high-volume event streams.
- `dmeta.action_palette`: The mobile app uses explicit tap actions rather than a command palette.
- `deli.simple_menu_item_card`: The sandwich instance uses composition cards for its primary items; simple fixed items are deferred.
- `deli.bundle_menu_item_card`: Bundles/catering are not part of this initial sandwich ordering flow.

These files are scaffolds. Promote and edit concrete widgets intentionally; do not blindly regenerate over promoted work.
