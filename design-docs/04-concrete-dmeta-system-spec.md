---
Title: Concrete DMETA System Spec
Status: active
Topics:
    - design-system
    - dsl
    - presentation-based-ui
    - code-generation
    - react
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ./01-design-system-factory-vision-and-scope.md
      Note: Foundation vision for the design-system factory
    - Path: ./02-semantic-archetype-and-capability-model.md
      Note: Semantic archetype/capability model refined into the concrete artifact layout
    - Path: ./03-dense-operational-ui-graphic-design-and-ux-archetype.md
      Note: Visual/UX archetype refined into concrete design-language artifacts
    - Path: ../playbooks/02-dmeta-design-system-factory-runthrough-playbook.md
      Note: Process playbook that this concrete spec operationalizes
ExternalSources: []
Summary: "Concrete v0 system architecture for DMETA: artifact layout, Markdown/YAML split, source IR files, generators, validation, and implementation lifecycle."
LastUpdated: 2026-05-19T18:20:00-04:00
WhatFor: "Use as the top-level concrete system spec before writing or changing DMETA IR schemas, generators, lint tools, or domain-specific design-system instances."
WhenToUse: "Read after the general foundation docs and before working on dmeta/sources/dmeta-ir or implementation tooling."
---

# Concrete DMETA System Spec

## Executive Summary

DMETA v0 is a small, concrete authoring system for producing dense operational React design systems. It keeps the successful HAIR-041 pattern — Markdown for reasoning/process, YAML for tooling-consumed source artifacts, deterministic generators, manual promotion, Storybook, lint, and audit — but adapts it to presentation-based UI and semantic archetypes.

The first concrete system should **not** start with a large normalized compiler architecture. It should start with:

```text
Markdown specs:
  dmeta/design-docs/04-concrete-dmeta-system-spec.md
  dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md
  dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md

YAML source artifacts:
  dmeta/sources/dmeta-ir/00-index.yaml
  dmeta/sources/dmeta-ir/01-core-model.yaml
  dmeta/sources/dmeta-ir/02-design-language.yaml
  dmeta/sources/dmeta-ir/03-widgets.yaml
```

This is the minimum useful split:

- `01-core-model.yaml` covers archetypes, capabilities, presentations, actions, and domain examples.
- `02-design-language.yaml` covers concrete/range-based design rules for typography, density, color, borders, interaction states, and semantic presentation styling.
- `03-widgets.yaml` covers generic dense-operational widget classes and contracts.
- Markdown explains why the schemas exist, how to evolve them, what is formal vs informal, and how to implement the toolchain.

## Goals

DMETA v0 should produce a concrete, reviewable path from design-system intent to implementation:

```text
intent + examples + design references
  -> Markdown specs
  -> compact YAML IR
  -> validation
  -> generated registries/helpers/scaffolds
  -> manually promoted React widgets
  -> Storybook coverage
  -> lint/audit
  -> concrete domain-specific design system
```

The system must support:

1. **Semantic archetypes and capabilities** rather than one fixed domain model.
2. **Presentation-based UI** where rendered values carry typed semantic metadata.
3. **Typed actions** discoverable from on-screen semantic presentations.
4. **Dense operational visual design** with sober typography, low chrome, density modes, and semantic color.
5. **Conservative code generation**: generate structure and helpers, not final implementation judgment.
6. **Manual promotion and audit**: preserve the HAIR-041 scaffold -> promote -> harden -> lint -> audit workflow.

## Non-Goals for v0

DMETA v0 should avoid:

- a fully generalized compiler framework;
- separate YAML files for every concept;
- a runtime plugin architecture;
- automatic generation of finished complex widgets;
- locking the generic design archetype to one exact visual skin;
- making agent-dashboard concepts universal.

The first implementation should be small enough that humans can inspect the whole system.

## Artifact Layout

### Long-term documentation

```text
dmeta/
  README.md
  playbooks/
    01-collaborative-schema-design-sessions-for-presentation-based-ui.md
    02-dmeta-design-system-factory-runthrough-playbook.md
  design-docs/
    01-design-system-factory-vision-and-scope.md
    02-semantic-archetype-and-capability-model.md
    03-dense-operational-ui-graphic-design-and-ux-archetype.md
    04-concrete-dmeta-system-spec.md
    05-dmeta-core-model-and-widget-ir-spec.md
    06-dmeta-design-language-and-tooling-spec.md
```

### Formal source artifacts

```text
dmeta/sources/dmeta-ir/
  00-index.yaml
  01-core-model.yaml
  02-design-language.yaml
  03-widgets.yaml
```

### Future tooling

```text
dmeta/scripts/
  01-validate-dmeta-ir.ts
  02-generate-presentation-registry.ts
  03-generate-action-registry.ts
  04-generate-design-language.ts
  05-scaffold-dmeta-widgets.ts
  06-lint-dmeta-design-system.ts
  07-validate-widget-promotion.ts
```

The tooling names are provisional. The important rule is that each tool has explicit inputs, outputs, and validation responsibilities.

## Markdown vs YAML Policy

Use Markdown for:

- rationale;
- concept definitions;
- alternatives considered;
- examples and walkthroughs;
- playbooks;
- audit reports;
- diary entries;
- implementation notes;
- human judgment and design intent.

Use YAML only when tooling needs the data:

- generator input;
- validator input;
- runtime registry input;
- lint source of truth;
- synchronized manifest;
- widget scaffold source.

A field should not enter YAML until at least one consumer exists or is explicitly planned.

### Consumer test for YAML fields

Every YAML field must answer at least one of these:

1. Which generator reads this?
2. Which validator checks this?
3. Which runtime registry uses this?
4. Which lint rule depends on this?
5. Which Storybook/audit manifest consumes this?
6. Which adapter or widget contract requires this?

If no answer exists, keep the information in Markdown.

## The Four v0 YAML Files

### `00-index.yaml`

Purpose:

- declare the DMETA IR package;
- list artifact files;
- record schema version;
- provide short descriptions and expected consumers.

This is a manifest, not a full package manager.

### `01-core-model.yaml`

Purpose:

- define semantic archetypes;
- define capabilities and their projections;
- define reusable presentations;
- define typed actions;
- include pressure-test domain examples.

This consolidates what could later be split into:

- `archetypes.yaml`;
- `capabilities.yaml`;
- `presentations.yaml`;
- `actions.yaml`;
- `domain-mapping.yaml`.

For v0, consolidation is better because it keeps cross-layer relationships visible.

### `02-design-language.yaml`

Purpose:

- define design-language rules and ranges;
- define typography roles;
- define density modes;
- define semantic color roles;
- define border/radius/elevation constraints;
- define component/presentation style recipes;
- define lintable visual constraints.

This file may start range-based. Concrete domain-specific design-system instances can later harden it to exact values.

### `03-widgets.yaml`

Purpose:

- define generic dense-operational widget classes;
- define widget contracts;
- define presentation slots;
- define action slots;
- define generated outputs;
- define Storybook requirements;
- define adapter boundary expectations.

This adapts the HAIR-041 Widget IR style to presentation-based UI.

## System Lifecycle

### 1. Author/refine Markdown specs

Humans and agents use long-form Markdown to clarify intent, concepts, tradeoffs, and examples.

Output:

- stable vocabulary;
- schema decisions;
- examples;
- open questions;
- implementation sequence.

### 2. Draft compact YAML IR

Write only the minimum YAML facts needed by tools.

Output:

- `00-index.yaml`;
- `01-core-model.yaml`;
- `02-design-language.yaml`;
- `03-widgets.yaml`.

### 3. Validate IR

Initial validation can be a script or a documented checklist. Later it becomes executable.

Required checks:

- referenced archetypes exist;
- referenced capabilities exist;
- capability projections are defined;
- presentations require known projections;
- actions accept known archetypes/capabilities/presentations;
- widgets consume known presentations and emit known action callbacks;
- design roles and tokens are internally consistent.

### 4. Generate support code

Generators should produce:

- TypeScript semantic metadata;
- presentation registry;
- action registry helpers;
- design token/helper modules;
- widget scaffolds;
- metadata sidecars;
- story scaffolds.

Generators should not produce the final nuanced implementation of complex widgets.

### 5. Manually promote widgets

Promoted widgets implement real HTML, accessibility, keyboard behavior, layout, and visual details.

Rules:

- preserve metadata sidecars;
- keep adapter boundary explicit;
- keep presentation metadata available for action routing;
- harden Storybook stories beyond scaffold defaults;
- do not overwrite hand-promoted widgets with generated scaffolds unless explicitly rebuilding.

### 6. Validate, lint, and audit

The system should eventually validate:

- schema correctness;
- generated file freshness;
- design-language rule compliance;
- Storybook coverage;
- widget promotion completeness;
- action/presentation runtime behavior.

## Runtime Architecture

DMETA keeps a clear runtime boundary:

```text
runtime wire format
  -> adapter
  -> typed widget props / presentation refs
  -> React widgets
  -> typed callbacks / action requests
  -> adapter/backend dispatch
```

Rules:

- Runtime data is JSON-safe.
- Widgets do not parse arbitrary runtime JSON.
- Widgets receive typed props and presentation refs.
- Widgets emit typed callbacks.
- Adapter/backend dispatch owns trusted side effects.
- Rendered semantic presentations carry enough metadata for action discovery and argument collection.

## Presentation Runtime Metadata

Every selectable semantic presentation should be able to produce a `PresentationRef`-like object:

```ts
export type PresentationRef = {
  semanticId: string;
  domainType: string;
  archetypes: string[];
  capabilities: string[];
  presentationId: string;
  label: string;
  value?: unknown;
  copyValue?: string;
  sourceSurface: string;
  sourcePath?: string;
};
```

This is the runtime bridge between presentation and action systems.

## Concrete v0 Widget Families

The first widget families should be generic dense-operational structures:

- `PresentationToken`
- `CompactReference`
- `StatusBadge`
- `MetricCell`
- `RecordStream`
- `DenseTable`
- `ProcessPanel`
- `DetailDrawer`
- `FilterBar`
- `ActionPalette`
- `ContextMenu`

These should be enough to instantiate both:

- AI agent workflow dashboards;
- retail logistics/order pipeline dashboards.

## Concrete v0 Domain Pressure Tests

The schema must be tested against at least two domains.

### AI agent workflow

Concrete domain types:

- `Agent`
- `Session`
- `ToolSpec`
- `ToolRun`
- `ToolEvent`
- `LogEvent`

Expected mappings:

- `Agent` -> `Actor`
- `ToolSpec` -> `ActionSpec`
- `ToolRun` -> `ActionInvocation`, `WorkItem`
- `ToolEvent` -> `Event`
- `Session` -> `TimelineSpan`

### Retail logistics/order pipeline

Concrete domain types:

- `Order`
- `Shipment`
- `Carrier`
- `Warehouse`
- `Package`
- `ScanEvent`
- `DelayReason`

Expected mappings:

- `Carrier`, `Warehouse` -> `Actor` / `Resource`
- `Order`, `Shipment` -> `WorkItem`
- `Shipment` -> `TimelineSpan`
- `ScanEvent` -> `Event`
- `Package` -> `Resource`

If the same core model cannot describe both domains, the abstraction is either too specific or too vague.

## Relationship to HAIR-041

DMETA keeps these HAIR-041 lessons:

- Use Markdown for design reasoning and process.
- Use YAML for tooling-consumed IR.
- Generate scaffolds/helpers, not final complex UI judgment.
- Preserve metadata sidecars.
- Keep adapter boundaries explicit.
- Treat Storybook as coverage/audit, not just demos.
- Add lint and compliance checks as the system matures.

DMETA changes these parts:

- Adds semantic archetypes/capabilities before widget IR.
- Adds presentation registry before widgets.
- Adds typed action discovery and argument collection from presentations.
- Targets dense operational systems rather than CRUD/admin alone.
- Treats design language as a sober dense-information archetype that later hardens into concrete token values.

## Implementation Order

Recommended order:

1. Write this concrete system spec.
2. Write the core model and widget IR spec.
3. Write the design-language and tooling spec.
4. Draft `00-index.yaml`.
5. Draft `01-core-model.yaml`.
6. Draft `02-design-language.yaml`.
7. Draft `03-widgets.yaml`.
8. Validate examples manually.
9. Build a validator.
10. Build generators in small passes.
11. Promote first widgets.
12. Instantiate first concrete domain.

## Open Questions

1. Should `01-core-model.yaml` remain consolidated after v0, or split once tooling stabilizes?
2. Should range-based design-language values live in the same file as hard concrete values, or should concrete instances override them?
3. How much runtime wire format should be specified now vs after widget/presentation examples exist?
4. Should initial tooling be TypeScript (closer to React) or Python (closer to HAIR-041 scripts)?
5. Should domain examples remain embedded in `01-core-model.yaml`, or move to a separate examples folder after validation exists?
