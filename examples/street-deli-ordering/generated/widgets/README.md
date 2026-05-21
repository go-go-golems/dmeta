# Generated DMETA widgets for Street Deli Ordering

Concrete DMETA instantiation for the Hudson Street Deli mobile ordering design system.

## Selected templates

- `StreetDeliMenuBrowser` from `deli.menu_browser` variant `mobile_cards`: Primary mobile ordering entrypoint needs category browsing and menu-item cards.
- `StreetDeliCompositionCard` from `deli.composition_card` variant `mobile_default`: Menu items need compact composition summaries with dietary and price data.
- `StreetDeliCompositionCustomizer` from `deli.composition_customizer` variant `bottom_sheet`: Ingredient removal and intelligent substitutions are the core customization workflow.
- `StreetDeliIngredientRow` from `deli.ingredient_row` variant `mobile_default`: Customizer needs explicit ingredient rows with remove/substitute actions.
- `StreetDeliSubstitutionChip` from `deli.substitution_chip` variant `mobile_default`: Replacement suggestions need a compact reusable action presentation.
- `StreetDeliOrderCart` from `deli.order_cart` variant `mobile_bottom_sheet`: Ordering flow needs cart review, totals, and submit actions.
- `StreetDeliOrderTracker` from `deli.order_tracker` variant `compact_status`: After order submission, users need preparation status and pickup state.
- `StreetDeliRoleTag` from `deli.role_tag` variant `compact_mode`: Ingredient roles are central to explaining substitutions and composition structure.

## Explicitly excluded templates

- `dmeta.detail_drawer`: The mobile ordering flow uses bottom-sheet/full-screen surfaces instead of desktop detail drawers.
- `dmeta.dense_table`: The street-deli flow is card/customizer/cart oriented, not table oriented.
- `dmeta.record_stream`: The customer app does not expose high-volume event streams.
- `dmeta.action_palette`: The mobile app uses explicit tap actions rather than a command palette.

These files are scaffolds. Promote and edit concrete widgets intentionally; do not blindly regenerate over promoted work.
