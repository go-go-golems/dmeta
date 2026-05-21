#!/usr/bin/env python3
"""Generalize Street Deli local templates into menu-ordering families.

This script belongs to DMETA-001 because it records the concrete migration from
one street-deli ordering-flow template file to a family-oriented local template
catalog with multiple instantiations.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any
import yaml

ROOT = Path(__file__).resolve().parents[6]
EXAMPLE = ROOT / "examples/street-deli-ordering"
WT = EXAMPLE / "widget-templates"
INST = EXAMPLE / "instantiations"


def meta(category: str, selection="optional", variants=None, points=None, avoid=None, questions=None):
    return {
        "category": category,
        "selection": selection,
        "maturity": "draft",
        "default_importance": "common" if selection != "rare" else "optional",
        "selection_questions": questions or [
            "Which menu archetypes in this concrete ordering system require this widget?",
            "Should this be generated from the shared menu-ordering template or replaced with a more specific local template?",
        ],
        "adaptation_points": points or [
            "component_name",
            "mobile_layout",
            "presentation_mapping",
            "copy_and_labels",
            "action_slots",
            "story_examples",
        ],
        "common_variants": variants or ["mobile_default"],
        "avoid_when": avoid or [
            "The menu type does not expose this interaction.",
            "A simpler selected template covers the flow without extra UI surface.",
        ],
    }


def widget(id_: str, name: str, cat: str, level: str, role: str, purpose: str,
           consumes=None, props=None, slots=None, stories=None, selection="optional", variants=None, points=None, avoid=None):
    contract: dict[str, Any] = {
        "props": {f"{name}Props": {"fields": props or {"subject": {"type": "PresentationRef", "required": True}}}}
    }
    if slots:
        contract["action_slots"] = slots
    return {
        "id": id_,
        "name": name,
        "status": "template",
        "classification": {"level": level, "role": role},
        "intent": {
            "purpose": purpose,
            "adapter_boundary": "Receives normalized menu-ordering view models and emits typed presentation/action callbacks; does not parse raw source YAML or own trusted side effects.",
        },
        "template": meta(cat, selection, variants, points, avoid),
        "consumes": consumes or {},
        "contract": contract,
        "stories": stories or ["default", "empty", "selected"],
        "outputs": {
            "component": f"src/street-deli/widgets/{name}/{name}.tsx",
            "types": f"src/street-deli/widgets/{name}/{name}.types.ts",
            "metadata": f"src/street-deli/widgets/{name}/{name}.metadata.ts",
            "stories": f"src/street-deli/widgets/{name}/{name}.stories.tsx",
            "barrel": f"src/street-deli/widgets/{name}/index.ts",
        },
    }


def write_file(name: str, category: str, summary: str, templates: list[dict[str, Any]]):
    doc = {
        "schema_version": 0,
        "artifact_type": "dmeta_widget_templates",
        "category": category,
        "summary": summary,
        "long_summary": f"Street Deli local {category} templates. These are selectable menu-ordering templates; concrete instantiations choose only the families they need.",
        "templates": templates,
    }
    (WT / name).write_text(yaml.safe_dump(doc, sort_keys=False, width=120))


def main():
    WT.mkdir(parents=True, exist_ok=True)
    INST.mkdir(parents=True, exist_ok=True)
    legacy = WT / "ordering-flow.yaml"
    if legacy.exists():
        legacy.unlink()

    files = [
        "menu-browsing.yaml",
        "item-cards.yaml",
        "customization.yaml",
        "modifiers.yaml",
        "substitutions.yaml",
        "ordering.yaml",
        "availability.yaml",
        "tracking.yaml",
    ]

    write_file("menu-browsing.yaml", "menu_browsing", "Menu discovery, navigation, filtering, and search templates.", [
        widget("deli.menu_browser", "MenuBrowser", "menu_browsing", "organism", "menu_browsing", "Render grouped menu categories and selectable item cards for a concrete ordering entrypoint.", {"archetypes": ["Composition", "Resource"], "presentations": ["composition_card", "compact_ref"], "capabilities": ["dietary", "filter_source"]}, {"categories": {"type": "MenuCategoryViewModel[]", "required": True}, "selectedItemId": {"type": "string", "required": False}}, {"onSelectItem": {"accepts": "PresentationRef"}, "onFilterDietary": {"accepts": "PresentationRef"}}, ["categories", "dietary_filter", "sold_out_items"], "common", ["mobile_cards", "dense_list", "dashboard_grid"]),
        widget("deli.menu_section", "MenuSection", "menu_browsing", "molecule", "menu_section", "Render one section of a menu such as sandwiches, drinks, coffee, sides, specials, or catering trays.", {}, {"section": {"type": "MenuSectionViewModel", "required": True}}, {"onSelectItem": {"accepts": "PresentationRef"}}, ["sandwiches", "drinks", "specials"], "optional"),
        widget("deli.menu_category_nav", "MenuCategoryNav", "menu_browsing", "molecule", "category_navigation", "Render compact category navigation for long or mixed menus.", {}, {"categories": {"type": "MenuCategoryRef[]", "required": True}, "activeCategoryId": {"type": "string", "required": False}}, {"onSelectCategory": {"accepts": "PresentationRef"}}, ["horizontal", "sticky", "many_categories"], "optional", ["horizontal_tabs", "sticky_rail"]),
        widget("deli.menu_search_box", "MenuSearchBox", "menu_browsing", "molecule", "menu_search", "Render menu-specific text/autocomplete search across item names, ingredients, dietary tags, categories, and specials.", {"capabilities": ["searchable", "filter_source"]}, {"query": {"type": "string", "required": False}, "suggestions": {"type": "MenuSearchSuggestion[]", "required": False}}, {"onSearch": {"accepts": "SearchExpression"}, "onChooseSuggestion": {"accepts": "PresentationRef"}}, ["ingredient_autocomplete", "category_suggestions", "no_results"], "optional", ["simple_text", "autocomplete_by_type"]),
        widget("deli.dietary_filter_bar", "DietaryFilterBar", "menu_browsing", "molecule", "dietary_filter_bar", "Render dietary and allergen quick filters for menu browsing.", {"capabilities": ["dietary", "filter_source"], "presentations": ["filter_chip"]}, {"filters": {"type": "DietaryFilter[]", "required": True}}, {"onToggleFilter": {"accepts": "FilterActionRequest"}}, ["vegetarian", "gluten_free", "allergen_warning"], "optional"),
    ])

    write_file("item-cards.yaml", "item_cards", "Menu item card templates for different menu archetypes.", [
        widget("deli.composition_card", "CompositionCard", "item_cards", "molecule", "composition_summary", "Render a composed menu item such as a sandwich, bowl, wrap, salad, or plate with ingredients, dietary tags, and price.", {"archetypes": ["Composition"], "presentations": ["composition_card"], "capabilities": ["composable", "dietary", "measurable"]}, {"item": {"type": "MenuItemViewModel", "required": True}, "selected": {"type": "boolean", "required": False}}, {"onCustomize": {"accepts": "PresentationRef"}, "onAddQuick": {"accepts": "PresentationActionRequest"}}, ["sandwich_card", "bowl_card", "dietary_badges"], "common", ["mobile_default", "dense_list", "image_card"]),
        widget("deli.simple_menu_item_card", "SimpleMenuItemCard", "item_cards", "molecule", "simple_item_summary", "Render a fixed item such as a bottled drink, chips, cookie, side, or grab-and-go item with quantity/add controls and no customizer.", {"archetypes": ["Resource"], "capabilities": ["measurable", "dietary", "available"]}, {"item": {"type": "SimpleMenuItemViewModel", "required": True}, "quantity": {"type": "number", "required": False}}, {"onAdd": {"accepts": "PresentationActionRequest"}, "onChangeQuantity": {"accepts": "number"}}, ["drink", "chips", "cookie", "sold_out"], "optional", ["compact_tile", "list_row", "large_touch_target"]),
        widget("deli.variant_menu_item_card", "VariantMenuItemCard", "item_cards", "molecule", "variant_item_summary", "Render an item whose primary choice is a variant such as size, soup cup/bowl, coffee size, or slice type.", {"capabilities": ["configurable", "measurable"]}, {"item": {"type": "VariantMenuItemViewModel", "required": True}, "selectedVariantId": {"type": "string", "required": False}}, {"onSelectVariant": {"accepts": "PresentationRef"}, "onAdd": {"accepts": "PresentationActionRequest"}}, ["coffee_sizes", "soup_sizes", "pizza_slice"], "optional", ["inline_variants", "variant_sheet"]),
        widget("deli.bundle_menu_item_card", "BundleMenuItemCard", "item_cards", "molecule", "bundle_summary", "Render a combo/bundle such as sandwich plus drink/chips, lunch special, boxed lunch, or catering bundle.", {"archetypes": ["Composition"], "capabilities": ["configurable", "measurable", "composable"]}, {"bundle": {"type": "BundleMenuItemViewModel", "required": True}}, {"onConfigureBundle": {"accepts": "PresentationRef"}}, ["lunch_combo", "boxed_lunch", "family_bundle"], "rare", ["combo_card", "catering_card"]),
        widget("deli.special_menu_item_card", "SpecialMenuItemCard", "item_cards", "molecule", "special_item_summary", "Render rotating specials, soup of the day, limited-time items, or featured menu entries.", {"capabilities": ["available", "temporal", "measurable"]}, {"special": {"type": "SpecialMenuItemViewModel", "required": True}}, {"onSelectSpecial": {"accepts": "PresentationRef"}}, ["soup_of_day", "breakfast_special", "sold_out"], "optional"),
    ])

    write_file("customization.yaml", "customization", "Customization and build-your-own templates.", [
        widget("deli.composition_customizer", "CompositionCustomizer", "customization", "organism", "item_customizer", "Render the menu-item customization surface with ingredients, substitutions, configuration controls, dietary summary, and add-to-order action.", {"archetypes": ["Composition"], "presentations": ["composition_detail", "ingredient_list", "substitution_badge"], "capabilities": ["composable", "substitutable", "configurable", "dietary"]}, {"item": {"type": "MenuItemDetailViewModel", "required": True}, "draft": {"type": "CustomizationDraft", "required": True}}, {"onRemoveIngredient": {"accepts": "PresentationRef"}, "onApplySubstitution": {"accepts": "PresentationActionRequest"}, "onAddToOrder": {"accepts": "PresentationActionRequest"}}, ["default", "substitution_candidates", "applied_substitution"], "common", ["bottom_sheet", "full_screen_mobile", "inline_dashboard"]),
        widget("deli.build_your_own_customizer", "BuildYourOwnCustomizer", "customization", "organism", "build_your_own_flow", "Render a stepwise build-your-own sandwich/bowl/salad flow starting from base choices rather than editing an existing composition.", {"capabilities": ["configurable", "composable", "dietary", "measurable"]}, {"steps": {"type": "BuilderStepViewModel[]", "required": True}, "draft": {"type": "BuildYourOwnDraft", "required": True}}, {"onChooseOption": {"accepts": "PresentationRef"}, "onCompleteBuild": {"accepts": "PresentationActionRequest"}}, ["choose_base", "choose_protein", "choose_toppings"], "optional", ["stepper", "single_screen_sections"]),
        widget("deli.customizer_summary", "CustomizerSummary", "customization", "molecule", "customization_summary", "Render a compact summary of selected options, removed ingredients, substitutions, price delta, and dietary/allergen state.", {"capabilities": ["measurable", "dietary", "substitutable"]}, {"draft": {"type": "CustomizationDraft", "required": True}}, {"onEditSection": {"accepts": "PresentationRef"}}, ["no_changes", "with_substitutions", "with_conflict"], "optional"),
        widget("deli.choice_constraint_hint", "ChoiceConstraintHint", "customization", "atom", "choice_constraint_hint", "Render constraints such as choose one, choose up to three, required, extra charge, or incompatible options.", {"capabilities": ["configurable"]}, {"constraint": {"type": "ChoiceConstraintViewModel", "required": True}}, None, ["choose_one", "choose_up_to", "required_missing"], "optional"),
    ])

    write_file("modifiers.yaml", "modifiers", "Variant, modifier, option, and quantity templates.", [
        widget("deli.modifier_group", "ModifierGroup", "modifiers", "molecule", "modifier_group", "Render a group of related choices such as bread, cheese, toppings, dressing, milk, sweetener, or side choice.", {"capabilities": ["configurable"]}, {"group": {"type": "ModifierGroupViewModel", "required": True}}, {"onChooseOption": {"accepts": "PresentationRef"}}, ["single_choice", "multi_choice", "required"], "optional", ["radio_group", "checkbox_group", "chip_group"]),
        widget("deli.modifier_option", "ModifierOption", "modifiers", "atom", "modifier_option", "Render one selectable option inside a modifier group, including price delta and dietary/allergen notes.", {"capabilities": ["measurable", "dietary"]}, {"option": {"type": "ModifierOptionViewModel", "required": True}, "selected": {"type": "boolean", "required": False}}, {"onSelect": {"accepts": "PresentationRef"}}, ["free_option", "price_delta", "allergen"], "optional"),
        widget("deli.variant_selector", "VariantSelector", "modifiers", "molecule", "variant_selector", "Render mutually exclusive variants such as size, soup cup/bowl, bread type, or temperature.", {"capabilities": ["configurable", "measurable"]}, {"variants": {"type": "MenuVariantViewModel[]", "required": True}, "selectedVariantId": {"type": "string", "required": False}}, {"onSelectVariant": {"accepts": "PresentationRef"}}, ["size_selector", "soup_size", "coffee_size"], "optional", ["segmented", "list", "chips"]),
        widget("deli.quantity_selector", "QuantitySelector", "modifiers", "atom", "quantity_selector", "Render plus/minus or stepper quantity controls for simple items, cart lines, and catering quantities.", {"capabilities": ["measurable"]}, {"quantity": {"type": "number", "required": True}, "min": {"type": "number", "required": False}, "max": {"type": "number", "required": False}}, {"onChangeQuantity": {"accepts": "number"}}, ["single_item", "cart_line", "bulk_quantity"], "optional", ["single_item", "cart_line", "bulk_quantity"]),
        widget("deli.price_delta_text", "PriceDeltaText", "modifiers", "atom", "price_delta", "Render price deltas and total adjustments for variants, modifiers, substitutions, and quantities.", {"capabilities": ["measurable"]}, {"deltaCents": {"type": "number", "required": True}, "showZero": {"type": "boolean", "required": False}}, None, ["free", "extra", "discount"], "optional"),
    ])

    write_file("substitutions.yaml", "substitutions", "Ingredient and substitution templates.", [
        widget("deli.ingredient_row", "IngredientRow", "substitutions", "molecule", "ingredient_composition_row", "Render one ingredient in a composition with role labels, required/optional status, dietary/allergen hints, and remove/substitute actions.", {"presentations": ["ingredient_list", "compact_ref"], "capabilities": ["dietary", "substitutable"]}, {"ingredient": {"type": "IngredientViewModel", "required": True}, "removable": {"type": "boolean", "required": False}}, {"onRemove": {"accepts": "PresentationRef"}, "onShowSubstitutions": {"accepts": "PresentationRef"}}, ["required_ingredient", "optional_ingredient", "removed_state"], "common"),
        widget("deli.substitution_chip", "SubstitutionChip", "substitutions", "atom", "substitution_suggestion", "Render an inline replacement suggestion showing original to replacement, dietary compatibility, role fit, and price delta.", {"presentations": ["substitution_badge", "substitution_pair"], "capabilities": ["substitutable", "dietary", "measurable"]}, {"suggestion": {"type": "SubstitutionSuggestionViewModel", "required": True}, "state": {"type": '"suggested" | "applied" | "dismissed"', "required": False}}, {"onApply": {"accepts": "PresentationActionRequest"}, "onReject": {"accepts": "PresentationActionRequest"}}, ["no_cheese_to_avocado", "applied_state", "allergen_warning"], "common"),
        widget("deli.substitution_detail_sheet", "SubstitutionDetailSheet", "substitutions", "organism", "substitution_detail_sheet", "Render all replacement candidates for a removed ingredient with comparison, compatibility, and apply actions.", {"capabilities": ["substitutable", "dietary", "measurable"]}, {"removed": {"type": "IngredientViewModel", "required": True}, "candidates": {"type": "SubstitutionSuggestionViewModel[]", "required": True}}, {"onApply": {"accepts": "PresentationActionRequest"}}, ["multiple_candidates", "no_candidates", "allergen_conflicts"], "optional", ["bottom_sheet", "inline_panel"]),
        widget("deli.dietary_conflict_notice", "DietaryConflictNotice", "substitutions", "molecule", "dietary_conflict_notice", "Render warning text when a selected ingredient/modifier/substitution conflicts with dietary or allergen constraints.", {"capabilities": ["dietary"]}, {"conflicts": {"type": "DietaryConflict[]", "required": True}}, {"onResolveConflict": {"accepts": "PresentationActionRequest"}}, ["allergen", "dietary_preference", "resolved"], "optional"),
        widget("deli.role_tag", "RoleTag", "substitutions", "atom", "ingredient_role_label", "Render an ultra-compact ingredient role label such as protein, crunch, richness, heat, freshness, or structure.", {}, {"role": {"type": "ingredient_role", "required": True}, "size": {"type": '"compact" | "regular"', "required": False}}, None, ["all_roles", "compact_mode"], "optional", ["compact_mode", "regular"]),
    ])

    write_file("ordering.yaml", "ordering", "Cart, checkout, pickup, and order-summary templates.", [
        widget("deli.order_cart", "OrderCart", "ordering", "organism", "cart_management", "Render cart line items, item customizations, totals, fulfillment details, and checkout/submit actions.", {"archetypes": ["WorkItem", "Composition"], "presentations": ["order_item_row", "compact_ref"], "capabilities": ["measurable", "stateful"]}, {"items": {"type": "OrderItemViewModel[]", "required": True}, "totals": {"type": "OrderTotalsViewModel", "required": True}}, {"onRemoveItem": {"accepts": "PresentationRef"}, "onSubmitOrder": {"accepts": "PresentationActionRequest"}}, ["empty_cart", "multiple_items", "checkout_ready"], "common", ["mobile_bottom_sheet", "full_page"]),
        widget("deli.cart_line_item", "CartLineItem", "ordering", "molecule", "cart_line_item", "Render one cart line with quantity, selected modifiers/substitutions, price, and edit/remove actions.", {"presentations": ["order_item_row", "compact_ref"], "capabilities": ["measurable"]}, {"item": {"type": "OrderItemViewModel", "required": True}}, {"onEdit": {"accepts": "PresentationRef"}, "onRemove": {"accepts": "PresentationRef"}}, ["simple_item", "customized_item", "quantity"], "optional"),
        widget("deli.checkout_summary", "CheckoutSummary", "ordering", "molecule", "checkout_summary", "Render subtotal, tax, tips, fees, pickup time, customer note summary, and submit affordance.", {"capabilities": ["measurable", "temporal"]}, {"totals": {"type": "OrderTotalsViewModel", "required": True}}, {"onSubmit": {"accepts": "PresentationActionRequest"}}, ["pickup", "with_tip", "validation_error"], "optional"),
        widget("deli.pickup_selector", "PickupSelector", "ordering", "molecule", "pickup_selector", "Render pickup ASAP/scheduled choices and time-window constraints.", {"capabilities": ["temporal", "schedulable"]}, {"options": {"type": "PickupOption[]", "required": True}}, {"onChoosePickup": {"accepts": "PresentationRef"}}, ["asap", "scheduled", "closed"], "optional"),
        widget("deli.customer_note_field", "CustomerNoteField", "ordering", "atom", "customer_note_field", "Render optional customer notes for item or order preparation instructions.", {}, {"value": {"type": "string", "required": False}, "maxLength": {"type": "number", "required": False}}, {"onChange": {"accepts": "string"}}, ["empty", "with_text", "too_long"], "optional"),
    ])

    write_file("availability.yaml", "availability", "Availability, specials, sold-out, and schedule templates.", [
        widget("deli.availability_badge", "AvailabilityBadge", "availability", "atom", "availability_badge", "Render availability state such as available, sold out, limited, breakfast only, or unavailable until time.", {"capabilities": ["stateful", "temporal", "available"]}, {"availability": {"type": "AvailabilityViewModel", "required": True}}, None, ["available", "sold_out", "limited", "scheduled"], "optional", ["available", "sold_out", "limited", "scheduled"]),
        widget("deli.sold_out_state", "SoldOutState", "availability", "molecule", "sold_out_state", "Render sold-out messaging and optional related substitutions/alternatives.", {"capabilities": ["stateful", "relatable"]}, {"item": {"type": "PresentationRef", "required": True}, "alternatives": {"type": "PresentationRef[]", "required": False}}, {"onChooseAlternative": {"accepts": "PresentationRef"}}, ["no_alternatives", "with_alternatives"], "optional"),
        widget("deli.menu_schedule_notice", "MenuScheduleNotice", "availability", "molecule", "menu_schedule_notice", "Render menu availability windows such as breakfast until 11am or specials available weekdays.", {"capabilities": ["temporal", "stateful"]}, {"schedule": {"type": "MenuScheduleViewModel", "required": True}}, None, ["breakfast_until", "closed", "special_window"], "optional"),
        widget("deli.specials_badge", "SpecialsBadge", "availability", "atom", "specials_badge", "Render compact labels for specials, featured items, limited run, or soup of the day.", {"capabilities": ["labelable", "temporal"]}, {"label": {"type": "string", "required": True}}, None, ["soup_of_day", "limited", "featured"], "optional"),
    ])

    write_file("tracking.yaml", "tracking", "Preparation and pickup-tracking templates.", [
        widget("deli.order_tracker", "OrderTracker", "tracking", "organism", "prep_tracking", "Render order preparation status, timeline events, pickup instructions, and related order references.", {"archetypes": ["WorkItem", "TimelineSpan", "Event"], "presentations": ["prep_status_indicator", "timeline_marker", "dense_row"], "capabilities": ["stateful", "temporal", "relatable"]}, {"order": {"type": "OrderTrackingViewModel", "required": True}}, {"onInspectOrder": {"accepts": "PresentationRef"}, "onOpenEvent": {"accepts": "PresentationRef"}}, ["received", "in_prep", "ready_for_pickup"], "optional", ["compact_status", "timeline"]),
        widget("deli.prep_status_badge", "PrepStatusBadge", "tracking", "atom", "prep_status_badge", "Render order preparation status such as received, in prep, ready, delayed, or picked up.", {"capabilities": ["stateful"], "presentations": ["prep_status_indicator"]}, {"status": {"type": "string", "required": True}, "tone": {"type": "tone", "required": False}}, None, ["received", "in_prep", "ready"], "optional"),
        widget("deli.prep_timeline", "PrepTimeline", "tracking", "molecule", "prep_timeline", "Render preparation events and estimated pickup progression.", {"archetypes": ["Event", "TimelineSpan"], "capabilities": ["temporal", "stateful"]}, {"events": {"type": "PrepEventViewModel[]", "required": True}}, {"onSelectEvent": {"accepts": "PresentationRef"}}, ["short", "delayed", "ready"], "optional"),
        widget("deli.pickup_ready_notice", "PickupReadyNotice", "tracking", "molecule", "pickup_ready_notice", "Render prominent pickup-ready state, pickup shelf/location, and order reference.", {"capabilities": ["stateful", "relatable"]}, {"order": {"type": "OrderTrackingViewModel", "required": True}}, {"onConfirmPickup": {"accepts": "PresentationActionRequest"}}, ["ready", "picked_up", "late"], "optional"),
    ])

    index = {
        "schema_version": 0,
        "artifact_type": "dmeta_widget_template_index",
        "summary": "Street Deli local widget templates for flexible menu-ordering design systems.",
        "long_summary": "The local catalog is split into menu-ordering families so concrete Street Deli instantiations can select sandwich/composition, coffee/variant, catering/bundle, or other menu-specific subsets.",
        "files": {f[:-5].replace("-", "_"): "./" + f for f in files},
        "validation": {"require_unique_template_ids": True},
    }
    (WT / "00-index.yaml").write_text(yaml.safe_dump(index, sort_keys=False, width=120))

    package = {
        "schema_version": 0,
        "artifact_type": "dmeta_widget_template_package",
        "summary": "Street Deli local widget-template package index.",
        "long_summary": "Street Deli local templates are split into menu-ordering families and selected by concrete instantiations under examples/street-deli-ordering/instantiations.",
        "status": "draft",
        "files": {"index": "./widget-templates/00-index.yaml"} | {f[:-5].replace("-", "_"): "./widget-templates/" + f for f in files},
        "validation": {"require_unique_template_ids": True},
    }
    (EXAMPLE / "03-widgets.yaml").write_text(yaml.safe_dump(package, sort_keys=False, width=120))

    local_files = ["../widget-templates/" + f for f in files]
    sandwich = {
        "schema_version": 0,
        "artifact_type": "dmeta_instance",
        "id": "street_deli_ordering",
        "name": "Street Deli Ordering",
        "summary": "Concrete DMETA instantiation for the Hudson Street Deli sandwich/composition mobile ordering flow.",
        "instance_root": "..",
        "core_model_root": "../..",
        "template_sources": {"global_ir_root": "../../../sources/dmeta-ir", "local_template_files": local_files},
        "generation": {"output_dir": "../generated/widgets", "package_name": "street-deli-ordering-widgets"},
        "selected_templates": [
            {"template": "deli.menu_browser", "as": "StreetDeliMenuBrowser", "variant": "mobile_cards", "reason": "Primary mobile ordering entrypoint needs category browsing and menu-item cards."},
            {"template": "deli.composition_card", "as": "StreetDeliCompositionCard", "variant": "mobile_default", "reason": "Sandwiches and bowls need compact composition summaries with dietary and price data."},
            {"template": "deli.composition_customizer", "as": "StreetDeliCompositionCustomizer", "variant": "bottom_sheet", "reason": "Ingredient removal and intelligent substitutions are the core sandwich customization workflow."},
            {"template": "deli.ingredient_row", "as": "StreetDeliIngredientRow", "variant": "mobile_default", "reason": "Customizer needs explicit ingredient rows with remove/substitute actions."},
            {"template": "deli.substitution_chip", "as": "StreetDeliSubstitutionChip", "variant": "mobile_default", "reason": "Replacement suggestions need a compact reusable action presentation."},
            {"template": "deli.order_cart", "as": "StreetDeliOrderCart", "variant": "mobile_bottom_sheet", "reason": "Ordering flow needs cart review, totals, and submit actions."},
            {"template": "deli.order_tracker", "as": "StreetDeliOrderTracker", "variant": "compact_status", "reason": "After order submission, users need preparation status and pickup state."},
            {"template": "deli.role_tag", "as": "StreetDeliRoleTag", "variant": "compact_mode", "reason": "Ingredient roles are central to explaining substitutions and composition structure."},
        ],
        "excluded_templates": [
            {"template": "dmeta.detail_drawer", "reason": "The mobile ordering flow uses bottom-sheet/full-screen surfaces instead of desktop detail drawers."},
            {"template": "dmeta.dense_table", "reason": "The street-deli flow is card/customizer/cart oriented, not table oriented."},
            {"template": "dmeta.record_stream", "reason": "The customer app does not expose high-volume event streams."},
            {"template": "dmeta.action_palette", "reason": "The mobile app uses explicit tap actions rather than a command palette."},
            {"template": "deli.simple_menu_item_card", "reason": "The sandwich instance uses composition cards for its primary items; simple fixed items are deferred."},
            {"template": "deli.bundle_menu_item_card", "reason": "Bundles/catering are not part of this initial sandwich ordering flow."},
        ],
    }
    (INST / "street-deli-ordering.yaml").write_text(yaml.safe_dump(sandwich, sort_keys=False, width=120))

    coffee = {
        "schema_version": 0,
        "artifact_type": "dmeta_instance",
        "id": "street_deli_coffee_counter",
        "name": "Street Deli Coffee Counter",
        "summary": "Alternate DMETA instantiation proving the menu-ordering templates can support a variant/modifier/simple-item counter flow without sandwich substitutions.",
        "instance_root": "..",
        "core_model_root": "../..",
        "template_sources": {"global_ir_root": "../../../sources/dmeta-ir", "local_template_files": local_files},
        "generation": {"output_dir": "../generated/coffee-counter-widgets", "package_name": "street-deli-coffee-counter-widgets"},
        "selected_templates": [
            {"template": "deli.menu_browser", "as": "CoffeeCounterMenuBrowser", "variant": "dense_list", "reason": "Coffee counter still needs category browsing for coffee, tea, pastries, and bottled drinks."},
            {"template": "deli.simple_menu_item_card", "as": "CoffeeCounterSimpleItemCard", "variant": "compact_tile", "reason": "Many counter items are fixed grab-and-go products that do not need composition customization."},
            {"template": "deli.variant_menu_item_card", "as": "CoffeeCounterVariantItemCard", "variant": "inline_variants", "reason": "Coffee and soup items primarily vary by size or similar variant choices."},
            {"template": "deli.variant_selector", "as": "CoffeeCounterVariantSelector", "variant": "segmented", "reason": "Size and hot/iced choices should be selected quickly inline."},
            {"template": "deli.modifier_group", "as": "CoffeeCounterModifierGroup", "variant": "chip_group", "reason": "Milk, sweetener, espresso-shot, and temperature modifiers are option groups rather than ingredient substitutions."},
            {"template": "deli.quantity_selector", "as": "CoffeeCounterQuantitySelector", "variant": "single_item", "reason": "Simple counter items need quantity adjustment."},
            {"template": "deli.order_cart", "as": "CoffeeCounterOrderCart", "variant": "mobile_bottom_sheet", "reason": "Counter orders still need cart review and submit behavior."},
            {"template": "deli.availability_badge", "as": "CoffeeCounterAvailabilityBadge", "variant": "scheduled", "reason": "Breakfast, soup, and special items may have availability windows."},
        ],
        "excluded_templates": [
            {"template": "deli.composition_customizer", "reason": "Coffee counter variant/modifier flow does not expose sandwich ingredient editing."},
            {"template": "deli.ingredient_row", "reason": "Ingredient rows are not shown for simple drinks and pastries."},
            {"template": "deli.substitution_chip", "reason": "Coffee modifiers are explicit choices rather than intelligent ingredient substitutions."},
            {"template": "deli.bundle_menu_item_card", "reason": "Combo/bundle support is deferred for the coffee counter flow."},
            {"template": "dmeta.dense_table", "reason": "Customer-facing counter ordering is not table oriented."},
        ],
    }
    (INST / "street-deli-coffee-counter.yaml").write_text(yaml.safe_dump(coffee, sort_keys=False, width=120))


if __name__ == "__main__":
    main()
