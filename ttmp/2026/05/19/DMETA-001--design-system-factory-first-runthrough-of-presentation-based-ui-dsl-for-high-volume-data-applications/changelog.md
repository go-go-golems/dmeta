# Changelog

## 2026-05-19

- Initial workspace created


## 2026-05-19

Ticket created. Imported playbooks (5), specification (1), and sources (1 article + 2 design docs + 10 YAML artifacts) from HAIR-041 and Obsidian vault. Wrote vision/scope document and investigation diary. Related live code projects (log-presentation-based-ui, image-collector). Added 10 tasks covering Phases 1-6 plus tooling.


## 2026-05-19

Captured scope correction: Phase 1 now targets semantic archetypes and reusable functional roles rather than a concrete agentic domain model; graphic design layer reframed as sober typographic dense-information UI archetype rather than one fixed paper/ink theme.


## 2026-05-19

Copied two visual reference images into sources/images. Created intermediate docs: semantic archetype/capability model and dense operational UI graphic design/UX archetype. Incorporated clarifications about composable archetypes, capability-level presentations, ToolCall/Shipment semantics, status badges as stateful capability presentations, and range-based design constraints.


## 2026-05-19

Added playbook/03-dmeta-design-system-factory-runthrough-playbook.md, refining the collaborative schema playbook into a DMETA-specific protocol from discussion/source import through intermediate docs, concrete schemas, hard design rules, generators/lint, and domain instantiation.


## 2026-05-19

Promoted long-term DMETA documents out of the ticket workspace. Updated the collaborative schema design playbook and moved it to dmeta/playbooks/. Moved the DMETA runthrough playbook to dmeta/playbooks/. Moved the vision, semantic archetype/capability, and dense operational UI design docs to dmeta/design-docs/. Added dmeta/README.md and updated the ticket index/diary to point to the promoted docs.


## 2026-05-19

Added concrete v0 tasks after deciding to consolidate DMETA YAML. Planned three concrete Markdown specs and four minimal YAML source artifacts under dmeta/sources/dmeta-ir/. Updated diary with the HAIR-041 organization comparison and rationale for keeping only tooling-consumed facts in YAML.


## 2026-05-19

Created dmeta/design-docs/04-concrete-dmeta-system-spec.md. The spec defines the v0 artifact layout, Markdown-vs-YAML policy, the four minimal YAML source artifacts, system lifecycle, runtime boundary, first widget families, domain pressure tests, HAIR-041 relationship, and implementation order. Updated dmeta/README.md.


## 2026-05-19

Created dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md. The spec defines the consolidated 01-core-model.yaml structure for archetypes/capabilities/presentations/actions/domain examples and the 03-widgets.yaml structure for generic dense-operational widgets. Updated dmeta/README.md.


## 2026-05-19

Created dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md. The spec defines 02-design-language.yaml structure, theme axes, typography/density/color/border/layout/presentation recipes, data attributes, lint rules, and the planned validator/generator/lint/promotion tooling sequence. Updated dmeta/README.md.


## 2026-05-19

Created minimal v0 DMETA IR YAML sources under dmeta/sources/dmeta-ir/: 00-index.yaml, 01-core-model.yaml, 02-design-language.yaml, and 03-widgets.yaml. Validated all four YAML files parse with PyYAML and fixed an initial union-type quoting issue in 03-widgets.yaml. Updated dmeta/README.md.


## 2026-05-19

Completed the concrete v0 documentation/YAML pass with logical commits. Ran docmgr doctor successfully after each major step and kept the diary/changelog current. Commits created: foundation docs, concrete system spec, core/widget spec, design-language/tooling spec, and minimal IR sources.


## 2026-05-19

Updated the design-system visual direction to remove paper/grain/texture references. The target is now explicitly sober, subtle cool-grey/neutral, low-chrome, and texture-free. Updated long-term design docs and dmeta/sources/dmeta-ir/02-design-language.yaml; validator still passes.


## 2026-05-19

Split dmeta/sources/dmeta-ir/01-core-model.yaml into a core-model package with subfiles: core-model/core-model.yaml, archetypes.yaml, capabilities.yaml, presentations.yaml, and examples/*.yaml. Added long_summary and long_description prose context for the package, every archetype, and every capability, plus references to relevant design docs. Updated playbooks and specs to document the split structure. Updated validator loader to merge the split package; validation and tests pass.


## 2026-05-19

Expanded dmeta/sources/dmeta-ir/core-model/presentations.yaml with long_description prose for every presentation and action. Expanded dmeta/sources/dmeta-ir/02-design-language.yaml with long_summary/description/long_purpose/long_description context across theme axes, typography, density, spacing, color, layout, recipes, interaction states, data attributes, and lint rules. Updated playbooks to require richer prose sections for presentations/actions and design-language YAML. Validator now warns on missing presentation/action long_description; tests and validate-ir pass.


## 2026-05-19

Added design doc comparing Hair Booking Admin DSL widget IR to DMETA's current widget IR, identifying always-present generic helper widgets for dense operational/log/agent/workflow/event/table design systems and separating optional domain packs.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/02-generic-widget-baseline-for-dense-operational-design-systems.md — New baseline widget comparison and recommendation document
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/reference/01-dmeta-001-investigation-diary.md — Diary updated for widget baseline comparison work


## 2026-05-19

Uploaded DMETA 001 Generic Widget Baseline design doc to reMarkable at /ai/2026/05/19/DMETA-001.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/02-generic-widget-baseline-for-dense-operational-design-systems.md — Uploaded source design document

