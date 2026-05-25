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
