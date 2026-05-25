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

