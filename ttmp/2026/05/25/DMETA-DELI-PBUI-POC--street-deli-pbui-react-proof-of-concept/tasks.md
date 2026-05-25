# Tasks

## TODO

- [x] Fix action/presentation affordances: cursor, hover, focus states for clickable action presentations and presentation refs
- [x] Implement generic compatible-presentation click mechanism driven by current view command bindings
- [x] Add Street Deli REMOVE-INGREDIENT command binding and wire detail ingredient clicks through the generic mechanism
- [x] Replace footer command echo with an editable command REPL backed by command bindings
- [x] Extract generic PBUI engine types for views, availability, visual state, and registries
- [x] Extract generic PBUI compatibility/action derivation helpers and use them in the Deli POC
- [x] Add generic availability policy wiring and disable PLACE-ORDER for empty carts
- [x] Add generic PBUI browser route adapter helpers
- [x] Wire Street Deli POC view changes to URL routes and popstate
- [x] Make BACK use browser history with menu fallback
- [x] Add generic reducer-based PBUI session/mode machine
- [x] Refactor Deli POC confirm, command, result, and selected-ref state onto the mode machine
- [x] Validate reducer-backed confirm/order and route flows
- [x] Extend PBUI session reducer with explicit select mode events
- [x] Wire Deli action invocation to enter select mode when a compatible presentation target is required
- [x] Validate action-bar REMOVE-INGREDIENT select-mode target selection
- [x] Add generic PBUI command handler registry helper
- [x] Move Street Deli command execution switch into domain handler registry
- [x] Validate handler-registry backed order, navigation, and select flows
- [x] Later: wrap the generic PBUI session reducer in a Redux slice for composable app integration
- [x] Replace local PBUI session useReducer with a Redux Toolkit slice
- [x] Add app store factory and typed Redux hooks for PBUI Storybook isolation
- [x] Set up per-story mock Redux stores for Deli PBUI Storybook stories
- [x] Move Deli workbench view, selection, removed ingredients, and cart state into a Redux slice
- [x] Refactor Deli handlers and workbench to dispatch Deli slice actions instead of local state setters
- [x] Validate Deli domain-slice backed Storybook and app flows
- [x] Add PBUI compatibility rule metadata for Street Deli selected-presentation targets
- [x] Add generic PBUI compatibility-rule evaluator and Deli compatibility registry
- [x] Replace Deli workbench hard-coded canUsePresentation branches with metadata-derived rules
