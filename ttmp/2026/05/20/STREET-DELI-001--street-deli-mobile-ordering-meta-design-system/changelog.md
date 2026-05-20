# Changelog

## 2026-05-20

- Initial workspace created


## 2026-05-20

Created full meta design system: core-model YAML (archetypes, capabilities, presentations, domain example), design-language, widget inventory, design doc, and diary. Key addition: intelligent ingredient replacement system with Composition and Substitution archetypes, composable and substitutable capabilities, 4 concrete replacement examples (no cheese→avocado, no bacon→smoked tofu, no bread→lettuce wrap, no mayo→hummus).

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/00-index.yaml — IR package manifest
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/01-core-model.yaml — Core model package index
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/02-design-language.yaml — Mobile deli design language
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/03-widgets.yaml — 5 atoms
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/core-model/archetypes.yaml — Composition and Substitution archetypes
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/core-model/capabilities.yaml — composable
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/core-model/core-model.yaml — Core model metadata with dietary tags
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/core-model/presentations.yaml — Deli presentations and actions
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/core-model/street-deli-ordering.yaml — Domain example with 4 replacement scenarios


## 2026-05-20

Step 3: Built HTML/CSS/JS prototype (3 files) for Hudson Street Deli with full ordering flow and intelligent replacement engine. 11 menu items, 20+ substitution rules, mobile-first design, tested end-to-end.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype/app.js — Menu data
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype/index.html — Prototype HTML structure
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype/styles.css — Mobile-first design language with role colors


## 2026-05-20

Step 4: Built CLIM-style monochrome prototype (3 files + fonts). 24-action registry, presentation selection with type-appropriate action discovery, right-click context menus, HELP command listing all actions with argument types. Berkeley Mono, black/white, single font size.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/app.js — CLIM app with action registry and context menus
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/index.html — CLIM prototype HTML
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/styles.css — Monochrome CLIM styles


## 2026-05-20

Step 6: Fixed CLIM action/select-mode semantics, split CLIM app.js into module entrypoint + js/data.js + js/app-main.js, added white action-result area above Command, changed select mode to red foreground without persistent underline, synced www/clim, and served both prototypes from tmux session street-deli-prototypes on port 8770.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/app.js — Module entrypoint
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/index.html — Module script and result area
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/js/app-main.js — CLIM state machine
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/js/data.js — Menu and substitution data module
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/styles.css — Select-mode and result-area styles
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/www/clim/js/app-main.js — Served CLIM app module


## 2026-05-20

Step 7: Fixed CLIM ES module inline-handler regression by exposing inline handler functions on window before renderMenu; synced served www/clim copy.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/js/app-main.js — Exposes inline handlers for module-loaded CLIM app
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/www/clim/js/app-main.js — Served copy of inline handler fix


## 2026-05-20

Step 8: Re-ran CLIM prototype in browser, verified presentation-first and command-first DESCRIBE flows with no console errors, and wrote Obsidian technical report for go-go-parc.

### Related Files

- /home/manuel/code/wesen/go-go-golems/go-go-parc/Projects/2026/05/20/ARTICLE - DMETA Presentation UI - CLIM Street Deli Prototype.md — Obsidian technical report
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/js/app-main.js — CLIM app behavior tested


## 2026-05-20

Step 9: Added CLIM article screenshots and fixed substitution candidates so they are real .pres presentations selectable by APPLY mode.

### Related Files

- /home/manuel/code/wesen/go-go-golems/go-go-parc/Projects/2026/05/20/ARTICLE - DMETA Presentation UI - CLIM Street Deli Prototype.md — Article now embeds CLIM screenshots
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/js/app-main.js — Substitution candidates now carry pres class
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/www/clim/js/app-main.js — Served copy of substitution selectable fix

