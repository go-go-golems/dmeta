# Generated DMETA widgets for Street Deli Coffee Counter

Alternate DMETA instantiation proving the menu-ordering templates can support a variant/modifier/simple-item counter flow without sandwich substitutions.

## Selected templates

- `CoffeeCounterMenuBrowser` from `deli.menu_browser` variant `dense_list`: Coffee counter still needs category browsing for coffee, tea, pastries, and bottled drinks.
- `CoffeeCounterSimpleItemCard` from `deli.simple_menu_item_card` variant `compact_tile`: Many counter items are fixed grab-and-go products that do not need composition customization.
- `CoffeeCounterVariantItemCard` from `deli.variant_menu_item_card` variant `inline_variants`: Coffee and soup items primarily vary by size or similar variant choices.
- `CoffeeCounterVariantSelector` from `deli.variant_selector` variant `segmented`: Size and hot/iced choices should be selected quickly inline.
- `CoffeeCounterModifierGroup` from `deli.modifier_group` variant `chip_group`: Milk, sweetener, espresso-shot, and temperature modifiers are option groups rather than ingredient substitutions.
- `CoffeeCounterQuantitySelector` from `deli.quantity_selector` variant `single_item`: Simple counter items need quantity adjustment.
- `CoffeeCounterOrderCart` from `deli.order_cart` variant `mobile_bottom_sheet`: Counter orders still need cart review and submit behavior.
- `CoffeeCounterAvailabilityBadge` from `deli.availability_badge` variant `scheduled`: Breakfast, soup, and special items may have availability windows.

## Explicitly excluded templates

- `deli.composition_customizer`: Coffee counter variant/modifier flow does not expose sandwich ingredient editing.
- `deli.ingredient_row`: Ingredient rows are not shown for simple drinks and pastries.
- `deli.substitution_chip`: Coffee modifiers are explicit choices rather than intelligent ingredient substitutions.
- `deli.bundle_menu_item_card`: Combo/bundle support is deferred for the coffee counter flow.
- `dmeta.dense_table`: Customer-facing counter ordering is not table oriented.

These files are scaffolds. Promote and edit concrete widgets intentionally; do not blindly regenerate over promoted work.
