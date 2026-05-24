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
- `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` — concrete v0 specification for `01-core-model.yaml`, widget-template packages, and instance manifests.
- `design-docs/06-dmeta-design-language-and-tooling-spec.md` — concrete v0 specification for `02-design-language.yaml`, generated helpers, validators, generators, lint, and promotion tooling.

## Current semantic model note

The core semantic model now uses explicit multi-level inheritance. `Archetype` and `Capability` are abstract roots, every non-root archetype/capability declares `extends`, validators resolve inherited capabilities/projections/actions before checking domain examples, and generated TypeScript exposes `isArchetypeA(...)`, `isCapabilityA(...)`, and effective inherited fields. Treat older flat archetype/capability examples as historical sketches unless they have been updated with `extends`.

## Source IR

- `sources/dmeta-ir/00-index.yaml` — v0 IR package manifest.
- `sources/dmeta-ir/01-core-model.yaml` — split core-model package index with references to `core-model/archetypes.yaml`, `core-model/capabilities.yaml`, `core-model/presentations.yaml`, and `core-model/examples/*.yaml`.
- `sources/dmeta-ir/02-design-language.yaml` — sober dense operational UI design-language ranges, recipes, states, and lint rules.
- `sources/dmeta-ir/03-widgets.yaml` — widget-template package index. The selectable/adaptable global templates live in `sources/dmeta-ir/widget-templates/*.yaml`.

## Ticket history

The originating docmgr ticket remains under:

`ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/`


## Commands

Validate the global DMETA IR package:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

Generate TypeScript core registries:

```bash
GOWORK=off go run ./cmd/dmeta generate-core --root ./sources/dmeta-ir --out ./generated/dmeta-core --force --output table
```

Plan a concrete widget-template instantiation before writing files:

```bash
GOWORK=off go run ./cmd/dmeta plan-instance   --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml   --output table
```

Scaffold only the templates selected by an instance manifest:

```bash
GOWORK=off go run ./cmd/dmeta scaffold-instance   --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml   --force   --output table
```

## Instance widget review rule

Generated instance widgets are scaffolds. Review the `.metadata.ts` sidecar first to confirm the template id, instance id, selected variant, selection reason, adaptations, and any reflection-first semantic context/projection hints. Archetype/capability inheritance should guide metadata, doc comments, Storybook notes, and adapter TODOs; it should not force one rigid prop surface or layout unless a template explicitly opts into strict projection adapter generation. Do not overwrite promoted widgets casually; regenerate only scaffold-stage files or create an explicit migration patch for promoted implementations.
