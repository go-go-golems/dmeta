---
Title: Diary
Ticket: STREET-DELI-001
Status: active
Topics:
    - design-system
    - dsl
    - presentation-based-ui
    - food-ordering
    - intelligent-replacement
    - mobile
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ../design/01-street-deli-mobile-ordering-meta-design-system.md
      Note: Main design document that this diary tracks
    - Path: ../../../examples/street-deli-ordering/00-index.yaml
      Note: IR package manifest
    - Path: ../../../examples/street-deli-ordering/01-core-model.yaml
      Note: Core model package index
    - Path: ../../../examples/street-deli-ordering/core-model/core-model.yaml
      Note: Core model metadata
    - Path: ../../../examples/street-deli-ordering/core-model/archetypes.yaml
      Note: Extended archetypes
    - Path: ../../../examples/street-deli-ordering/core-model/capabilities.yaml
      Note: Extended capabilities
    - Path: ../../../examples/street-deli-ordering/core-model/presentations.yaml
      Note: Extended presentations and actions
    - Path: ../../../examples/street-deli-ordering/core-model/street-deli-ordering.yaml
      Note: Domain example with replacement scenarios
    - Path: ../../../examples/street-deli-ordering/02-design-language.yaml
      Note: Design language
    - Path: ../../../examples/street-deli-ordering/03-widgets.yaml
      Note: Widget inventory
ExternalSources: []
Summary: "Implementation diary for the Street Deli Mobile Ordering Meta Design System."
LastUpdated: 2026-05-20T08:00:00-04:00
WhatFor: "Chronological record of what was done, what worked, and what should be done next."
WhenToUse: "Read before resuming work on STREET-DELI-001 to understand prior decisions and context."
---

# Diary

## Goal

Record the implementation journey of creating a full meta design system for a mobile ordering app for a street deli, built on DMETA v0, with an intelligent ingredient replacement system.

## Step 1: Map Street Deli Domain to DMETA Archetypes and Capabilities

Mapped concrete deli domain objects to the DMETA v0 archetype/capability vocabulary. The key insight was that the intelligent replacement system requires two new archetypes (Composition, Substitution) and four new capabilities (composable, substitutable, configurable, dietary) that do not exist in the base model. The replacement engine reasons about ingredient *roles* (richness, protein, structural) rather than food categories, which is why `ingredient_role` is a first-class logical type.

### Prompt Context

**User prompt (verbatim):** "Create a docmgr to create a meta design for a mobile ordering app for a street deli. Create a document for a full meta design system for a mobile ordering app for a street deli, with an intelligent replacement system where ingredients like no cheese -> avocado. Use @dmeta/playbooks/ to create the core-model/*.yaml for the meta design system, store the doc and the yamls in dmeta/examples/street-deli-ordering. Keep a diary."

**Assistant interpretation:** Create a full DMETA meta design system for a street deli mobile ordering app, with YAML core-model files following the established DMETA format, including an intelligent ingredient substitution system.

**Inferred user intent:** Produce a concrete instance of the DMETA design-system factory for a novel domain (food ordering), with the intelligent replacement system as the key differentiator. All artifacts should follow the established YAML conventions and be stored in the specified location.

### What I did
- Read all base DMETA design docs, core-model YAML files, and playbook to understand the format
- Created docmgr ticket STREET-DELI-001 with tasks and diary
- Mapped deli domain objects to base DMETA archetypes (Customer→Actor, Order→WorkItem, MenuItem→Composition+ActionSpec, etc.)
- Identified that two new archetypes (Composition, Substitution) and four new capabilities (composable, substitutable, configurable, dietary) are needed
- Designed `ingredient_role` as a first-class logical type with 14 values (structural, richness, moisture, acidity, heat, crunch, umami, sweetness, bitterness, freshness, binding, garnish, protein, base)
- Designed `dietary_tag` as a first-class logical type with 11 values
- Designed `flavor_profile` as a first-class logical type with 12 values

### Why
The base DMETA model was designed for dense operational monitoring (agent workflows, retail logistics). The deli domain has fundamentally different interaction patterns—mobile touch-first, composition-centric, substitution-intelligent. The base model cannot express "remove cheese → suggest avocado" without the composable and substitutable capabilities.

### What worked
- Mapping deli objects to existing archetypes worked cleanly for Customer (Actor), Order (WorkItem), and PrepEvent (Event)
- The base model's separation of capabilities from archetypes made it natural to add composable/substitutable as cross-cutting capabilities
- The ingredient role system (richness, protein, structural) provides a principled way to reason about replacements rather than ad-hoc pairing

### What didn't work
- Initially considered making Ingredient a separate archetype, but it maps cleanly to Resource with dietary capability—no new archetype needed
- Considered making "SubstitutionEngine" an archetype but realized the engine is a runtime component, not a semantic subject. The SubstitutionRule is the archetype; the engine is the implementation.

### What I learned
- The DMETA archetype/capability model is flexible enough to handle food ordering if you add the right capabilities
- Role-based reasoning is more powerful than category-based reasoning for intelligent replacement
- Dietary safety must be enforced at the design-system level, not left to application code

### What was tricky to build
- Getting the right granularity for ingredient roles: too few and the replacement engine can't distinguish between cheese (richness) and mayo (moisture); too many and the system becomes unwieldy. Settled on 14 roles that cover the functional spectrum of sandwich/bowl/platter construction.
- Deciding whether Substitution should be an archetype or just a capability on Ingredient: it needs to be an archetype because a substitution rule is a first-class semantic subject with identity, lifecycle (suggested → applied → dismissed), and presentation requirements (badge, pair, detail sheet).

### What warrants a second pair of eyes
- The substitutable capability's `replacement_candidates` projection is a list of strings—should it be a richer structure with inline role/dietary/flavor metadata?
- The composition_card presentation inherits from base summary_card but adds price and dietary badges—should this be a base presentation extension or a pure domain addition?
- The 14 ingredient roles may need adjustment after testing against a real menu with 50+ items

### What should be done in the future
- Build a replacement engine prototype that reads substitution rules and produces ranked candidates
- Test the model against a full real-world deli menu
- Implement the CompositionCustomizer widget as a React component
- Add cascading substitution support (removing bread triggers wrap substitution, which itself changes condiment compatibility)
- Add station wait time awareness to the ordering flow

### Code review instructions
- Start with `core-model/capabilities.yaml` — the composable and substitutable capabilities are the core design decision
- Check that `street-deli-ordering.yaml` replacement examples map correctly to the capability projections
- Validate that all presentations reference known capabilities and archetypes
- Verify dietary tags and ingredient roles are consistent between core-model.yaml and the domain example

### Technical details
- All YAML files follow schema_version: 0, matching the base DMETA v0 format
- The model explicitly inherits from base and only defines additions (inherited_from_base section)
- Dietary tags: dairy_free, gluten_free, nut_free, vegan, vegetarian, halal, kosher, low_carb, keto, sugar_free, soy_free, egg_free
- Ingredient roles: structural, richness, moisture, acidity, heat, crunch, umami, sweetness, bitterness, freshness, binding, garnish, protein, base
- 4 concrete replacement examples in domain example: no cheese→avocado, no bacon→smoked tofu, no bread→lettuce wrap, no mayo→hummus

## Step 2: Design Language and Widget Inventory

Extended the design language for mobile-first touch interaction and defined the widget inventory for the full ordering flow. The key mobile adaptations: swipe gestures replace keyboard shortcuts, bottom sheets replace modals, ingredient rows are swipeable, and substitution chips are the primary replacement affordance.

### What I did
- Wrote 02-design-language.yaml with mobile-specific theme axes (warm_white neutral, rounded_sans type, ingredient_color accent strategy)
- Added ingredient_role_colors to the color system (amber for structural, warm_brown for protein, avocado_green for richness, etc.)
- Added mobile-specific interaction states (pressed, swipe_reveal)
- Defined mobile layout primitives (menu_browser, composition_customizer, order_cart, order_tracker)
- Wrote 03-widgets.yaml with 5 atoms, 3 molecules, and 6 organisms
- Added deli-specific lint rules (touch_target_minimum, dietary_always_visible, no_hidden_substitution_costs, substitution_not_upsell, allergen_warning_visible, ingredient_role_tagged)
- Wrote the meta design system document (01-street-deli-mobile-ordering-meta-design-system.md)
- Relate all 9 YAML files to the docmgr document

### Why
The base DMETA design language is desktop-keyboard-first. A mobile deli app needs touch-first interaction, thumb-zone-aware layout, and visual affordances for the substitution flow that don't exist in the base model.

### What worked
- The base design language's structure (theme axes, typography, color, layout primitives, presentation recipes, lint rules) adapted cleanly to mobile
- Ingredient role colors provide an intuitive visual language for the replacement system
- The widget inventory maps cleanly to the ordering flow: browse → customize → add → order → track

### What didn't work
- N/A — no significant failures in this step

### What I learned
- The base DMETA model's separation of concerns makes domain instantiation straightforward: add archetypes/capabilities, extend presentations, adapt design language, define widgets
- The lint rule "substitution_not_upsell" is important for trust—the replacement engine must be perceived as helpful, not as a sales tactic

### What was tricky to build
- Balancing information density with touch target size: mobile needs larger targets but still needs to show role tags, dietary badges, and price on each ingredient row
- The SubstitutionChip widget needs to show a lot of information (original, replacement, roles, price delta) in a very compact inline format

### What warrants a second pair of eyes
- The widget inventory may be missing a "customer dietary profile" configuration widget
- The order_cart widget should probably show a per-item allergen summary, not just aggregate
- The lint rules need concrete enforcement thresholds (e.g., exact minimum touch target in pt)

### What should be done in the future
- Implement the widget inventory as React components
- Build the replacement engine as a TypeScript module that reads SubstitutionRule data
- Add integration tests that verify the full flow: browse → customize → substitute → add → order
- Consider adding a "recommended substitutions" surface that proactively suggests changes based on customer dietary profile

### Code review instructions
- Start with `03-widgets.yaml` — the SubstitutionChip and CompositionCustomizer are the most complex widgets
- Check `02-design-language.yaml` lint rules for enforceability
- Verify that all widget consumes reference known capabilities/presentations
- Validate that presentation recipes map to actual widget rendering behavior

## Step 3: Build HTML/CSS/JS Prototype for Hudson Street Deli

Built a self-contained 3-file prototype (index.html, styles.css, app.js) at `dmeta/examples/street-deli-ordering/prototype/` implementing the full ordering flow for Hudson Street Deli, a bagels + sandwiches + breakfast sandwiches American-style deli. The prototype exercises the intelligent replacement system end-to-end with 11 menu items and substitution rules for 20+ ingredients.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Build a working HTML/CSS/JS prototype of the meta design system, focused on Hudson Street Deli (bagels, sandwiches, breakfast sandwiches, American style).

**Inferred user intent:** Validate the meta design system with a tangible, interactive prototype that proves the replacement engine works in practice.

### What I did
- Created `prototype/index.html` — semantic structure with dietary filter bar, menu screen, customizer bottom sheet, substitution detail sheet, cart FAB, cart screen, and order tracker
- Created `prototype/styles.css` — mobile-first design language with warm white neutrals, ingredient role colors (amber for structural, warm brown for protein, avocado green for richness, etc.), touch-friendly 44px minimum targets, bottom sheet patterns, substitution card styles
- Created `prototype/app.js` — 11 menu items across 3 categories, 20+ substitution rules with reasoning, full replacement engine with alias resolution, cart system, order tracker with animated progress
- Tested full flow: menu browsing → dietary filtering → item customization → ingredient removal → smart substitution suggestions → substitution application → add to order → cart review → place order → tracker
- Fixed CSS pointer-events issue (role tags intercepting overlay clicks) by adding `pointer-events: none`
- Fixed substituted ingredient row rendering: substituted rows now show replacement name, undo button (↶), replacement roles, and dietary tags instead of original data

### Why
The YAML meta design system is abstract. A concrete prototype proves the replacement engine works in practice and provides a tangible reference for implementing the React widget inventory.

### What worked
- The role-based replacement engine produces relevant, useful suggestions (no cheese → avocado, no bacon → smoked tofu, no bread → lettuce wrap, no mayo → hummus)
- Bottom sheet pattern works well for the customizer and substitution detail
- Ingredient role color coding provides immediate visual language for understanding composition
- The dietary filter correctly highlights items with matching dietary tags

### What didn't work
- Cart FAB was initially positioned off-screen on desktop viewport — fixed with `max-width` and `margin: 0 auto`
- Role tag spans intercepted pointer events on the overlay — fixed with `pointer-events: none`
- Substituted ingredient rows initially kept `removed` class alongside `substituted`, causing strikethrough — fixed by only applying `removed` class when there is no substitution

### What I learned
- The 14 ingredient roles from the YAML model translate well to a real UI — users can immediately see why avocado replaces cheese (both have "richness")
- The substitution reasoning text is crucial for trust — showing "Avocado provides similar richness and creaminess" makes the suggestion feel intelligent rather than random
- Mobile bottom sheets are the right pattern for substitution flows — they preserve context while giving enough space for candidate comparison

### What was tricky to build
- Substitution alias resolution: many ingredients share the same substitution rules (bacon, bacon-2, bacon-3 all map to the same rule set). The `resolveSubKey()` function handles this by stripping numeric suffixes and falling back to name matching.
- Substituted ingredient row rendering: the row needs to show the replacement's roles, dietary tags, and name while preserving the original name as context. This required a separate rendering branch in the ingredient list.
- Cart item serialization: the `{ ...ing }` spread operator for cart items must preserve the substitution object reference so the cart can display substitution lines.

### What warrants a second pair of eyes
- The substitution rules data is embedded in app.js — for production it should be loaded from the YAML files or an API
- The allergen warning only checks for new allergens introduced by substitutions, not for removed allergens that would make the item safer
- The order tracker animation is simulated with `setTimeout` — no real backend

### What should be done in the future
- Add ingredient quantity controls (extra bacon, double cheese)
- Add "recommended substitutions" that proactively suggest changes based on customer dietary profile
- Replace the embedded substitution data with a YAML-driven data source
- Build the React widget inventory based on the prototype's proven patterns
- Add station wait time and availability display

### Code review instructions
- Start with `app.js` — the MENU array, SUBSTITUTIONS object, and `applySubstitution()` function are the core logic
- Check that the CSS `pointer-events: none` on role tags doesn't break accessibility
- Verify that the cart correctly deep-clones composition state when adding to order
- Test the full flow on a real mobile device (375px viewport)

### Technical details
- 3 files: index.html (5.7KB), styles.css (20.5KB), app.js (49KB)
- 11 menu items: 3 bagels, 4 sandwiches, 4 breakfast sandwiches
- 20+ substitution rule sets with 50+ candidate replacements
- Full flow: browse → filter → customize → remove → substitute → add → cart → order → track
- Key interactions: tap (select), remove button (−), undo remove (+), substitution card (apply), see all options (detail sheet), add to order, place order
- Browser-tested at 390×844 mobile viewport

## Step 4: Build CLIM-style Monochrome Prototype

Built a second 3-file prototype (index.html, styles.css, app.js) at `prototype-clim/` implementing a CLIM/OpenGenera presentation-based UI approach: monochrome black-and-white, Berkeley Mono font at single size, everything is a typed presentation with clickable actions. Added an action registry, presentation selection with context-appropriate action discovery, right-click context menus, and a HELP command listing all actions with argument types.

### Prompt Context

**User prompt (verbatim):** "Now make a second prototype which is in a very minimalistic monochrome black and white single font size (berkeley mono in ~/code/wesen/fonts) that adopts the opengenera / CLIM presentation based UI approach, with mostly text representation that can be clicked based on action. Same html + js + css."

**Assistant interpretation:** Build a CLIM-style monochrome text prototype where all UI elements are typed presentations (like `<MenuItem>`, `<Ingredient>`, `<Substitution>`) and clicking them reveals type-appropriate actions.

**Inferred user intent:** Validate the meta design system with a fundamentally different UI paradigm — pure text CLIM interaction — proving the replacement engine works regardless of visual presentation style.

**Follow-up prompt (verbatim):** "make a list of actions I can chose from the presentation selection interaction (for example if I chose the action 'ADD TO MENU') (also right click on items). Also add the HELP command that lists currently available actions (and their argument types)"

### What I did
- Created `prototype-clim/` with 3 files + Berkeley Mono font files
- Implemented CLIM presentation model: all objects are typed `<PresentationType>` text blocks
- Built a 24-action registry covering: Navigation (4), MenuItem (4), Ingredient (5), Substitution (2), Cart (4), Dietary (1)
- Click on a presentation → selects it → shows applicable actions in action bar based on type
- Right-click on a presentation → context menu at cursor with all applicable actions + descriptions
- HELP command: lists all actions grouped by category, with argument types and descriptions, plus presentation type reference
- Keyboard command line: type action name + Enter to execute; type item name to open; type HELP/M/C/H shortcuts
- All actions are type-aware: REMOVE-INGREDIENT only appears for `<Ingredient>`, APPLY only for `<Substitution>`, etc.

### Why
The CLIM interaction model is fundamentally different from touch/mobile: objects are presentations with identity, and actions are discovered by type rather than by position. This proves the meta design system's action/presentation model works across radically different UI paradigms.

### What worked
- The action registry pattern maps perfectly to the DMETA action/capability model: each presentation type corresponds to an archetype/capability, and actions are the commands that accept those types as arguments
- Right-click context menus feel natural in a CLIM interface — they are the keyboard-first equivalent of CLIM's pointer-click action menus
- HELP command as a scrollable text reference fits the monochrome aesthetic perfectly
- Selecting a presentation and seeing only applicable actions (e.g., REMOVE-INGREDIENT, SHOW-SUBSTITUTIONS for `<Ingredient>` but not for `<MenuItem>`) makes the interface self-documenting

### What didn't work
- Initial HELP view reused the wrong container (detail view was hidden) — fixed by adding a dedicated `view-help` HTML element
- Context menu positioning needs bounds checking for edge-of-screen clicks (not fixed yet, low priority for prototype)

### What I learned
- The CLIM "click presentation → see type-appropriate actions" pattern is exactly the DMETA action discovery model: `<Ingredient>` corresponds to the `composable` capability, `<Substitution>` corresponds to the `substitutable` capability, and actions like REMOVE-INGREDIENT and APPLY correspond to the actions defined in the presentations YAML
- Berkeley Mono at 13px on a black background is extremely readable and feels like a professional terminal/CLIM interface
- Single font size constraint forces all information hierarchy through type annotations, role tags, and indentation — no visual weight crutches

### What was tricky to build
- The action registry needs to filter by both presentation type and current view — REMOVE-INGREDIENT only makes sense in the detail view when an `<Ingredient>` is selected, not in the menu view
- Right-click context menu: needed `event.preventDefault()` and `event.pageX/pageY` positioning, plus click-outside-to-close handling
- Action argument binding: when typing a command like "REMOVE-INGREDIENT" in the command line, the system must check if a compatible presentation is selected and use it as the argument, or prompt the user to select one

### What warrants a second pair of eyes
- The disabled action styling (grey, no underline) may not be distinguishable enough from regular dim text
- The context menu doesn't handle edge-of-viewport positioning
- The action bar may overflow with too many actions for some presentation types

### What should be done in the future
- Add keyboard shortcuts for common actions (R for remove, S for substitute, etc.)
- Add command composition: type "REMOVE-INGREDIENT" then click the target ingredient
- Add presentation history / undo stack
- Add a DESCRIBE output panel that shows persistent description text rather than just the hint line

### Code review instructions
- Start with the ACTIONS array — it is the core of the CLIM command table
- Check `getActionsForType()` and `canExecuteAction()` for correct type/view filtering
- Verify context menu `showContextMenu()` / `closeContextMenu()` lifecycle
- Test the full flow: select MenuItem → CUSTOMIZE → select Ingredient → REMOVE-INGREDIENT → select Substitution → APPLY → ADD-TO-ORDER → CART → PLACE-ORDER

### Technical details
- 4 files: index.html, styles.css, app.js, fonts/ (3 Berkeley Mono woff2 files)
- 24 registered actions across 6 groups
- 8 presentation types documented in HELP
- Interaction model: click=select+show actions, right-click=context menu, type+Enter=command, ESC=back/deselect
- Action arguments: no-arg actions execute immediately; single-arg actions use the currently selected presentation as argument

## Step 5: CLIM Select-Mode Iteration and Single Server Packaging

This step records the first CLIM select-mode iteration before the next cleanup pass. I changed the CLIM prototype from “click immediately performs the default action” toward a two-mode interaction: normal mode selects a presentation and shows actions, while typed commands such as `DESCRIBE` enter a presentation-selection mode where compatible targets are intended to become red. I also packaged the polished mobile prototype and the CLIM prototype under a shared `www/` directory so one static server can expose both.

### Prompt Context

**User prompt (verbatim):** "When in presentation select mode, selectable widgets should be in red, and the normal click shouldn't do anything."

**Assistant interpretation:** Change CLIM behavior so ordinary clicking selects only and does not execute a semantic action, while typed action commands enter an argument-selection mode with compatible presentations highlighted red.

**Inferred user intent:** Make the CLIM prototype closer to real presentation-based command interaction: command first, then typed argument selection; or presentation first, then explicit action selection.

**Follow-up prompt (verbatim):** "the interaction is: 

select an ACTION (say type DESCRIBE in the console)
switch into select mode: all menu items turn red
click a menu item X: execute DESCRIBE X

click on X (in normal mode)
show actions that take a menu item
click DESCRIBE: execute DESCRIBE X"

### What I did
- Reworked `prototype-clim/app.js` around explicit `normal` and `select` modes.
- Added `state.mode`, `state.pendingAction`, `enterSelectMode()`, `exitSelectMode()`, and red selectable presentation styling hooks.
- Changed command execution so typed actions with arguments enter select mode instead of requiring an already-selected presentation.
- Changed normal presentation clicks to select presentations and show applicable actions rather than immediately running the old default operation.
- Added red `.pres.selectable` and dim `.pres.select-disabled` CSS states.
- Created `examples/street-deli-ordering/www/` with `/mobile/` and `/clim/` subdirectories and a landing page so both prototypes can be served by one static server.
- Started a single static server rooted at `examples/street-deli-ordering/www` on port 8770.

### Why
The previous CLIM prototype had the right visual style but still behaved too much like a direct-manipulation prototype: clicking an ingredient could perform the default action. A CLIM-style interface should make the command/argument relationship visible: the user either selects a presentation then picks a command, or picks a command then supplies a compatible presentation.

### What worked
- The code now has an explicit mode concept and a clear state variable for the action awaiting an argument.
- The CSS has dedicated red selectable target styling for select mode.
- The shared `www/` tree gives one place to serve both prototypes.

### What didn't work
- The user reported that actions did not appear to execute correctly after this change. This likely means the action-bar and select-mode execution paths need a focused cleanup pass.
- Select-mode hover still used the same underline treatment as normal presentation hover. The next pass should remove underlines in select mode and use color only.
- Action results still appear in the grey hint line. The next pass should add a dedicated white result line above `Command:`.

### What I learned
- The two-mode CLIM model needs to be implemented as a first-class state machine rather than as incremental tweaks around click handlers.
- The command line, action bar, context menu, and presentation click path must all call the same action dispatch function to avoid divergence.

### What was tricky to build
- Separating selection from execution without breaking the action-bar path: normal mode must select only, but action-bar clicks must execute against the selected presentation. Typed command select mode must execute only after clicking a compatible target.
- Keeping red target styling local to select mode while preserving the monochrome/black-white aesthetic everywhere else.

### What warrants a second pair of eyes
- The current monolithic `prototype-clim/app.js` is too large and should be split into smaller modules/components before more behavior is added.
- The select-mode execution path needs manual testing after cleanup.
- `www/` currently duplicates prototype files for serving convenience; decide whether that should remain committed or be generated by a small script later.

### What should be done in the future
- Fix action execution after select-mode refactor.
- Remove select-mode underlines; use red foreground only with normal hover behavior otherwise.
- Add a visible white action result area above the command line.
- Split `app.js` into focused modules: data, actions, state, renderers, command line, context menu.

### Code review instructions
- Start with `prototype-clim/app.js` mode handling (`enterSelectMode`, `executeCommand`, `handlePresentationClick`).
- Verify the exact desired flows:
  - Type `DESCRIBE`, press Enter, menu items turn red, click Classic BLTA, result appears.
  - Click Classic BLTA, action bar shows `DESCRIBE`, click `DESCRIBE`, result appears.
  - Type `REMOVE-INGREDIENT` in detail view, ingredients turn red, click Cheddar, it is removed and substitutions appear.
- Check `prototype-clim/styles.css` for `.pres.selectable` and `.pres.select-disabled` behavior.

## Step 6: Fix CLIM Command Selection Semantics and Split Modules

Cleaned up the CLIM prototype interaction model after the user clarified the intended behavior. The resulting model is: typing an action name such as `DESCRIBE` enters select mode and colors compatible presentations red; clicking a red presentation executes the pending action. In normal mode, clicking a presentation only selects it and shows compatible actions; clicking an action executes it with the selected presentation. I also moved CLIM data and app logic into modules and added a white action-result area above the command prompt.

### Prompt Context

**User prompt (verbatim):** "Ok, I don't think the actions get executed now. Also, no underline when in select mode, just change color, and the underlin hover is the same as normal model. 

Split app.js into smaller subcomponents. also show the results of an action in white visible, instead of the grey, and show it above the line above Command:"

**Assistant interpretation:** Fix the CLIM dispatch paths, refine select-mode styling, modularize the JavaScript, and make action output visibly distinct from low-priority command hints.

**Inferred user intent:** Make the CLIM prototype usable and closer to OpenGenera/CLIM conventions: command-first argument selection should be explicit and visually obvious, while action results should be prominent and not confused with help text.

### What I did
- Split `prototype-clim/app.js` into a 3-line module entrypoint plus:
  - `prototype-clim/js/data.js` for menu data, substitution rules, and `resolveSubKey()`.
  - `prototype-clim/js/app-main.js` for state, action dispatch, rendering, command line, context menu, and action implementations.
- Updated `prototype-clim/index.html` to load `app.js` as `type="module"`.
- Added `#action-result` above the command input in the footer.
- Added `setResult()` and moved action outputs such as `DESCRIBE`, `REMOVE-INGREDIENT`, `APPLY`, `ADD-TO-ORDER`, `INSPECT`, and `PLACE-ORDER` into the white result area.
- Kept `setHint()` as grey guidance/status text below the command prompt.
- Fixed `ADD-TO-ORDER <MenuItem>` so it can add a default menu item from menu view, not only the current customizer state.
- Changed select-mode styling so compatible presentations turn red without an always-on underline; hover uses the normal underline behavior.
- Synchronized the updated CLIM prototype into `www/clim/` for the single-server view.
- Served both prototypes from one tmux session named `street-deli-prototypes` rooted at `examples/street-deli-ordering/www` on port 8770.

### Why
The previous select-mode iteration had the right concepts but weak execution feedback. Results were hard to see because they appeared in grey hint text, and the action execution paths needed to be consolidated around the two intended flows:

1. Action first: type `DESCRIBE`, compatible presentations turn red, click a red presentation, execute `DESCRIBE`.
2. Presentation first: click a presentation, see actions, click `DESCRIBE`, execute `DESCRIBE`.

### What worked
- The module split is small but useful: data is now separate from behavior, and `app.js` is only an entrypoint.
- `node --check` passed for `app.js`, `js/data.js`, and `js/app-main.js`.
- The static server responds for `/`, `/mobile/index.html`, `/clim/index.html`, and `/clim/js/app-main.js`.
- The tmux session `street-deli-prototypes` is running the shared server.

### What didn't work
- I did not run Playwright because the user explicitly asked not to; validation was limited to syntax checks and HTTP HEAD checks.
- The module split is pragmatic rather than fully componentized: renderers, command dispatch, and action implementations still live together in `js/app-main.js`. A deeper split can follow if needed.

### What I learned
- Action results need their own presentation area in CLIM-style UIs. A grey hint line is good for guidance but not for command output.
- Select mode should visually mark target compatibility without changing the basic text interaction language too much; red foreground is enough.

### What was tricky to build
- `ADD-TO-ORDER` needed two meanings depending on context: add the current customizer state when editing, or add a default menu item when invoked on a `<MenuItem>` from menu view. The function now accepts an optional `menuItemId` and falls back to current customization only when present.
- Maintaining both source (`prototype-clim/`) and served copy (`www/clim/`) requires explicit synchronization after edits.

### What warrants a second pair of eyes
- Whether `www/` should remain checked in or be replaced by a script that assembles the served tree.
- Whether `js/app-main.js` should be split further into renderers, action implementations, command-line controller, and context menu controller.
- Manual browser testing of the exact action-first and presentation-first flows.

### What should be done in the future
- If the prototype grows, split `js/app-main.js` further.
- Add command composition history and visible transcript lines.
- Add tests or a small smoke script that exercises command dispatch without Playwright.

### Code review instructions
- Start at `prototype-clim/app.js` and follow imports into `js/data.js` and `js/app-main.js`.
- Check the state machine: `state.mode`, `enterSelectMode()`, `exitSelectMode()`, `executeCommand()`, `handlePresentationClick()`, and `executeActionFromBar()`.
- Review `styles.css` for `.pres.selectable` and `.action-result` behavior.
- Validate manually at `http://localhost:8770/clim/`:
  - Type `DESCRIBE`, press Enter, menu items turn red, click a menu item, result appears above Command.
  - Click a menu item, click `DESCRIBE`, result appears above Command.

## Step 7: Fix ES Module Inline Handler Regression

Fixed the immediate browser regression reported by the user after the CLIM module split. The issue was caused by changing `app.js` to `type="module"` while keeping inline HTML event attributes (`onclick="handlePresentationClick(...)"`). ES module top-level functions are not globals, so inline handlers could not resolve them.

### Prompt Context

**User prompt (verbatim):** "Uncaught ReferenceError: handlePresentationClick is not defined
    onclick http://localhost:8770/clim/index.html:1
index.html:1:1

is this  normal? did you test it?"

**Assistant interpretation:** The served CLIM prototype throws a real browser runtime error on click because module-scoped functions are not available to inline handlers.

**Inferred user intent:** Fix the regression immediately and be transparent about what testing was and was not done.

### What I did
- Added `exposeInlineHandlers()` in `prototype-clim/js/app-main.js`.
- Exposed the functions referenced from inline handlers onto `window`:
  - `handlePresentationClick`
  - `handlePresentationContext`
  - `executeActionFromBar`
  - `closeContextMenu`
  - `renderMenu`
  - `renderCart`
  - `renderHelp`
  - `filterDietary`
  - `filterCategory`
  - `addToCart`
  - `placeOrder`
- Called `exposeInlineHandlers()` from `init()` before `renderMenu()`.
- Synced the fix to `www/clim/js/app-main.js`.
- Re-ran `node --check` on source and served CLIM modules.

### Why
Inline event attributes are evaluated against the global object. ES modules do not publish top-level function declarations to `window`. This mismatch caused `handlePresentationClick is not defined`.

### What worked
- Syntax checks pass for both source and served module copies.
- The fix is small and keeps the current inline-handler rendering approach intact.

### What didn't work
- I had not browser-tested after the module split; I only did syntax and HTTP availability checks. That missed the runtime/global-scope issue.

### What I learned
- If the prototype keeps inline event handlers, module code must explicitly export handlers to `window`, or the renderer must move to `addEventListener` delegation.

### What was tricky to build
- The fastest safe fix was to expose only the functions that are already used by inline handlers, rather than reverting the module split or rewriting all rendering to delegated events.

### What warrants a second pair of eyes
- A future cleanup should replace inline `onclick` strings with delegated event listeners to avoid this module/global mismatch entirely.

### What should be done in the future
- Add a tiny browser smoke check or migrate off inline handlers.

### Code review instructions
- Review `prototype-clim/js/app-main.js` at `exposeInlineHandlers()` and `init()`.
- Confirm the same change exists in `www/clim/js/app-main.js`.

## Step 8: Re-run CLIM Prototype and Write Obsidian Technical Report

Re-ran the served CLIM prototype after the module-handler fix and verified the two defining presentation-based interaction flows: presentation-first action dispatch and command-first select mode. Then wrote a durable Obsidian article in the `go-go-parc` vault that explains how the CLIM prototype derives from the same DMETA street-deli core model as the mobile prototype, with emphasis on typed presentations, the command table, action arguments, select mode, and implementation errors encountered during development.

### Prompt Context

**User prompt (verbatim):** "Run it again. Then, write a detailed project report for our obsidian vault go-go-parc, see an article a colleague has been writing about the mobile version: /home/manuel/code/wesen/go-go-golems/go-go-parc/Projects/2026/05/20/ARTICLE - DMETA Meta Design System - Street Deli Core Model and Mobile Ordering App.md

Write it up as a deep technical dive blog post into the implementation of the presentation UI based CLIM based version, again with how the core model was derived and then the actual app was derived, focusing on the presentation based UI aspect, and also the early errings and the development process.

Use a textbook writing style (no analogies, see skill). Commit and push when done"

**Assistant interpretation:** Browser-test the CLIM app again, then create a new Obsidian article in the same dated folder/style as the existing mobile article. The article should teach the CLIM/presentation-based implementation, connect it back to the core model, and document the development path including mistakes.

**Inferred user intent:** Preserve the CLIM prototype work as durable technical knowledge in the project vault, not only as code and ticket notes.

### What I did
- Restarted/confirmed the static server for `examples/street-deli-ordering/www` on port 8770.
- Browser-tested `http://127.0.0.1:8770/clim/`.
- Verified presentation-first flow:
  - click `<MenuItem Classic BLTA>`;
  - action bar shows `CUSTOMIZE`, `ADD-TO-ORDER`, `DESCRIBE`, etc.;
  - click `DESCRIBE`;
  - white action-result line shows the Classic BLTA description;
  - console reports no errors.
- Verified command-first flow:
  - type `DESCRIBE` and press Enter;
  - mode label changes to `MENU ▸ DESCRIBE`;
  - 11 menu items become `.selectable`;
  - click `<MenuItem Grilled Cheese>`;
  - select mode exits;
  - white action-result line shows the Grilled Cheese description;
  - console reports no errors.
- Read the existing mobile-version Obsidian article to match frontmatter shape, tone, and section style.
- Wrote a new Obsidian article:
  - `/home/manuel/code/wesen/go-go-golems/go-go-parc/Projects/2026/05/20/ARTICLE - DMETA Presentation UI - CLIM Street Deli Prototype.md`.

### Why
The previous module-handler regression showed that syntax and HTTP checks were not enough. A browser run was necessary because the failure was caused by browser module scoping and inline event handlers. The Obsidian report captures that class of failure and the broader presentation-based UI model for future readers.

### What worked
- The CLIM app now runs without console errors in the tested flows.
- Both interaction modes work as intended:
  - object first, then action;
  - action first, then red compatible object selection.
- The new article connects the implementation to the core model rather than treating the CLIM app as an isolated prototype.

### What didn't work
- There remain unrelated untracked/stale files in the repo (`ttmp/2026/05/19/DMETA-VIEWER-001--...`) that were intentionally left untouched.

### What I learned
- The `action-result` vs `cmd-hint` separation makes the interface much easier to explain in writing. It also mirrors the implementation distinction between command output and guidance text.
- The CLIM prototype is the clearest demonstration that DMETA presentations are not widgets: the same semantic subject can be rendered as a mobile card or as typed monochrome text.

### What was tricky to build
- The Obsidian article needed to explain both the model derivation and the implementation derivation without repeating the mobile article. The chosen structure treats the mobile article as the core-model/background companion and focuses this article on presentation-based command dispatch.

### What warrants a second pair of eyes
- Whether the article should include screenshots later. It currently focuses on code, diagrams, and prose rather than embedded images.
- Whether the CLIM report should be linked from the existing mobile article.

### What should be done in the future
- Consider adding a small browser smoke test script so the module-inline-handler regression cannot recur.
- Consider replacing inline `onclick` strings with delegated listeners, then update the report if the architecture changes.

### Code review instructions
- Read the new Obsidian article next to the existing mobile article.
- Validate the two tested CLIM flows at `http://localhost:8770/clim/`.
- Confirm that the article does not overwrite the existing mobile article and lives as a separate durable report.
