# Changelog

## 2026-05-22

- Initial workspace created


## 2026-05-22

Created IR imports and extension composition implementation guide and diary; specified dmeta compose/flatten workflow, schema extensions, merge semantics, provenance, tests, and CLI integration.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go — CLI integration point for new command
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/load.go — Current loader constraint motivating feature
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/01-ir-imports-and-extension-composition-implementation-guide.md — Primary implementation guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/reference/01-diary.md — Investigation diary


## 2026-05-22

Validated DMETA-IR-COMPOSITION and uploaded the guide bundle to reMarkable at /ai/2026/05/22/DMETA-IR-COMPOSITION.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/01-ir-imports-and-extension-composition-implementation-guide.md — Uploaded in reMarkable bundle
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/reference/01-diary.md — Updated with validation and upload result


## 2026-05-22

Updated composition guide after widget-template split commit 5177344: v1 compose now focuses on core-model/design-language IR, while 03-widgets.yaml and widget-templates/* are copy-through/inherited whole-package scope until a separate widget-template composition design exists.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/load.go — Current loadWidgetTemplates behavior
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/03-widgets.yaml — Widget-template package entrypoint
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/01-ir-imports-and-extension-composition-implementation-guide.md — Updated scope and implementation guidance
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/reference/01-diary.md — Added Step 3 scope-correction diary entry


## 2026-05-22

Re-uploaded updated DMETA IR Composition Guide PDF to reMarkable after widget-template scope correction.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/01-ir-imports-and-extension-composition-implementation-guide.md — Updated and re-uploaded guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/reference/01-diary.md — Updated diary with reMarkable re-upload result


## 2026-05-23

Added new archetype/capability inheritance overhaul guide: explicit Archetype and Capability roots, required multi-level extends, inheritance resolver, validation/generator changes, and Street Deli example tree; updated diary with no-backwards-compatibility clarification.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/core-model/street-deli-ordering.yaml — Deli pressure-test example
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/model.go — Model structs to overhaul
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/02-archetype-and-capability-inheritance-implementation-guide.md — New primary design guide for semantic inheritance overhaul
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/reference/01-diary.md — Added Step 4 diary entry


## 2026-05-23

Uploaded DMETA Archetype Capability Inheritance Guide PDF to reMarkable at /ai/2026/05/22/DMETA-IR-COMPOSITION and updated diary with upload result.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/02-archetype-and-capability-inheritance-implementation-guide.md — Uploaded inheritance design guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/reference/01-diary.md — Updated diary with upload result


## 2026-05-23

Implemented explicit semantic inheritance resolver, validation integration, generator output, base YAML roots, and generated TypeScript registries (commits 8e92cc2, 06715ab, 37a9de9, 5479a43).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/core/render.go — Generator integration
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/inheritance.go — Core inheritance resolver
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/validate.go — Validation integration


## 2026-05-23

Updated durable docs/playbooks for explicit Archetype/Capability inheritance and wrote/uploaded the implemented inheritance intern guide (commit 6e6e0da; reMarkable upload OK).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md — Durable spec updated for extends/abstract
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/design-doc/03-implemented-inheritance-system-intern-guide.md — New implementation guide


## 2026-05-23

Rewrote Street Deli as a standalone inherited semantic model, validated it end to end, regenerated widget scaffolds, and surfaced inheritance metadata in the mobile prototype for screenshots (commits b60b9d6, fed32a1).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/core-model/archetypes.yaml — Inherited deli archetype hierarchy
- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/core-model/capabilities.yaml — Inherited deli capability hierarchy
- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/mobile/app.js — Prototype semantic markers and screenshots


## 2026-05-23

Wrote and pushed Obsidian deep-dive technical article with inherited-system diagrams and refactored deli screenshots (vault commit 81c2e1c).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/22/DMETA-IR-COMPOSITION--ir-imports-and-extension-composition/assets/screenshots/deli-refactored-menu.png — Article screenshot source
- /home/manuel/code/wesen/go-go-golems/go-go-parc/Projects/2026/05/23/ARTICLE - DMETA Semantic Inheritance - From Flat Tags to Deli Ordering.md — Published Obsidian article

