# Changelog

## 2026-05-25

- Initial workspace created


## 2026-05-25

Extracted reusable CLIM PBUI profile pieces, created standalone Deli PBUI React proof-of-concept package, validated Vite/Storybook builds, and wrote intern-facing guide plus diary.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react — Standalone proof-of-concept package
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/25/DMETA-DELI-PBUI-POC--street-deli-pbui-react-proof-of-concept/design-doc/01-street-deli-pbui-react-proof-of-concept-architecture-and-implementation-guide.md — Primary design guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/25/DMETA-DELI-PBUI-POC--street-deli-pbui-react-proof-of-concept/reference/01-diary.md — Diary


## 2026-05-25

Moved Street Deli interaction vocabulary into an inherited example interaction package, validated effective generic/example interaction layers, and wrote the Obsidian research report.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/interactions/00-index.yaml — Interaction package inheritance
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/load.go — Interaction package merge support
- /home/manuel/code/wesen/go-go-golems/go-go-parc/Projects/2026/05/25/ARTICLE - DMETA PBUI Street Deli CLIM React Research Report - From Conceptual Cleanup to Concrete Target.md — Research report in Obsidian vault


## 2026-05-25

Added concrete Street Deli command/action bindings and validation; mirrored the target shape in the hand-authored React POC (commit 7853fa0).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml — Concrete command/action binding catalog
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/validate.go — Action binding validation
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts — POC command binding registry


## 2026-05-25

Added a generic command-binding action-request helper and started Storybook/Vite verification servers in tmux (commit 86e3622).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts — Action request helper
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Uses command bindings to build requests


## 2026-05-25

Added interactive menu/detail/cart/confirm/tracker flow, Storybook states, and Playwright verification (commit a50f38c).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx — Generic confirm prompt
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.stories.tsx — Storybook states for the flow
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Interactive CLIM flow


## 2026-05-25

Cleaned up the Vite app document shell, restarted tmux verification servers, and reran Playwright app/Storybook checks (commit 91bdd6a).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/index.html — Complete app document shell and favicon
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Browser-tested interactive order flow


## 2026-05-25

Fixed clickable affordances, added generic command-binding-driven presentation clicks, wired REMOVE-INGREDIENT for ingredients, and made the footer command input editable (commit 2898103).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx — Cursor/hover/focus affordances and editable command input
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts — Generic compatible-presentation binding helpers
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Presentation click and command input dispatch


## 2026-05-25

Lightened the POC CLIM styling so clickable targets and structural labels use underlines/color instead of bordered boxes (commit 83e29dd).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx — Generic underline/color clickable styling
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Removed local section border/background boxes


## 2026-05-25

Encoded reviewed PBUI visual/navigation rules in the style profile and added the core action/ref/navigation/select engine design guide.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml — Reviewed visual rules and navigation expectations
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx — Dotted underline selectable label styling
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/25/DMETA-DELI-PBUI-POC--street-deli-pbui-react-proof-of-concept/design-doc/02-pbui-core-action-presentation-ref-navigation-select-engine.md — Core PBUI engine design guide


## 2026-05-25

Extracted generic PBUI React component primitives and normalized dotted underline rendering with skip-ink and fixed offset.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml — Style guide underline geometry
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiClickableText/PbuiClickableText.tsx — Shared dotted underline primitive
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiPresentationRef/PbuiPresentationRef.tsx — Semantic presentation ref renderer


## 2026-05-25

Removed the old generic/clim/components.tsx compatibility barrel and moved the POC widget to explicit per-widget PBUI component imports.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components — Authoritative per-widget PBUI component kit
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Uses explicit PBUI component-kit imports


## 2026-05-25

Extracted first generic PBUI engine types/compatibility helpers and wired availability so empty carts disable PLACE-ORDER.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/compatibility.ts — Generic compatibility/action derivation helpers
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/engineTypes.ts — Generic PBUI engine state and derivation types
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Consumes engine compatibility helpers and empty-cart availability


## 2026-05-25

Added generic browser route adapter helpers and wired Street Deli PBUI views to URL paths and browser BACK.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/routing.ts — Reusable PBUI route codec/history helpers
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Street Deli route codec and view navigation wiring


## 2026-05-25

Added a generic reducer-based PBUI session mode machine and refactored Deli confirm/command/result/selected-ref state onto it.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts — Reusable PBUI session reducer and events
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Consumes reducer for confirm mode


## 2026-05-25

Added explicit PBUI select mode so action-bar commands requiring a compatible presentation target can ask the user to choose one.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts — Select-mode reducer events
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Action invocation enters select mode and completes through compatible presentation refs


## 2026-05-25

Added generic PBUI command handler registry and moved Street Deli command execution out of the widget switch; recorded Redux-slice follow-up task.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/domain/deli/handlers.ts — Street Deli domain handler registry and coverage assertion
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/handlerRegistry.ts — Generic PBUI handler registry helper
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Uses handler registry for normal and confirmed command execution


## 2026-05-25

Replaced the local PBUI session reducer with a Redux Toolkit slice and set up per-story Storybook stores.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/app/hooks.ts — Typed Redux hooks
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/app/store.ts — Store factory composing RTK Query and PBUI session slice
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts — Redux Toolkit PBUI session slice
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.stories.tsx — Per-story mock Redux store decorator
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Consumes PBUI session slice actions/selectors


## 2026-05-25

Moved Deli view, selection, composition, and cart state into a Redux slice and refactored handlers/workbench to dispatch Deli slice actions.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/app/store.ts — Composes Deli workbench slice with PBUI session and RTK Query
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/domain/deli/deliWorkbenchSlice.ts — Deli workbench Redux slice
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/domain/deli/handlers.ts — Handler environment dispatches domain slice effects
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Consumes Deli workbench slice state/actions


## 2026-05-25

Added profile-shaped compatibility rules and replaced Deli hard-coded canUsePresentation branches with a generic rule evaluator.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml — Compatibility metadata beside selected-presentation command bindings
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/domain/deli/compatibilityRules.ts — Deli rule registry mirroring profile metadata
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/compatibilityRules.ts — Generic PBUI compatibility-rule evaluator
- /home/manuel/code/wesen/go-go-golems/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx — Consumes metadata-derived compatibility and rehydrates selected refs

