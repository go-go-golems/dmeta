# DMETA Long-Term Documentation

This directory contains durable design-system factory documents promoted out of temporary ticket workspaces.

## Playbooks

- `playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md` — collaborative protocol for moving from intent and examples to semantic archetypes, capabilities, presentations, actions, widget IR, and implementation work.
- `playbooks/02-dmeta-design-system-factory-runthrough-playbook.md` — DMETA-specific runthrough from source import through intermediate docs, concrete schemas, hard design rules, tooling, and concrete domain instantiation.

## Design docs

- `design-docs/01-design-system-factory-vision-and-scope.md` — overall factory vision and scope.
- `design-docs/02-semantic-archetype-and-capability-model.md` — reusable semantic archetypes, capabilities, projections, presentations, and action model.
- `design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md` — sober dense operational UI graphic design and UX archetype.
- `design-docs/04-concrete-dmeta-system-spec.md` — concrete v0 system architecture, Markdown/YAML split, artifact layout, lifecycle, and implementation order.
- `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` — concrete v0 specification for `01-core-model.yaml` and `03-widgets.yaml`.
- `design-docs/06-dmeta-design-language-and-tooling-spec.md` — concrete v0 specification for `02-design-language.yaml`, generated helpers, validators, generators, lint, and promotion tooling.

## Source IR

- `sources/dmeta-ir/00-index.yaml` — v0 IR package manifest.
- `sources/dmeta-ir/01-core-model.yaml` — split core-model package index with references to `core-model/archetypes.yaml`, `core-model/capabilities.yaml`, `core-model/presentations.yaml`, and `core-model/examples/*.yaml`.
- `sources/dmeta-ir/02-design-language.yaml` — sober dense operational UI design-language ranges, recipes, states, and lint rules.
- `sources/dmeta-ir/03-widgets.yaml` — generic dense-operational widget classes and contracts.

## Ticket history

The originating docmgr ticket remains under:

`ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/`
