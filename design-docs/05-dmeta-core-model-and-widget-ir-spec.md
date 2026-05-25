---
Title: DMETA Core Model and Widget IR Spec
Ticket: DMETA-001
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
    - Path: ./02-semantic-archetype-and-capability-model.md
      Note: Conceptual source for archetypes, capabilities, projections, presentations, and actions
    - Path: ./04-concrete-dmeta-system-spec.md
      Note: Defines the v0 artifact layout and Markdown/YAML split
    - Path: ../sources/dmeta-ir/01-core-model.yaml
      Note: Future concrete source artifact described by this spec
    - Path: ../sources/dmeta-ir/03-widgets.yaml
      Note: Future widget IR source artifact described by this spec
ExternalSources: []
Summary: "Concrete v0 specification for the split DMETA core model package and widget IR YAML."
LastUpdated: 2026-05-23T00:00:00-04:00
WhatFor: "Use to draft or validate dmeta/sources/dmeta-ir/01-core-model.yaml, core-model/*.yaml, and 03-widgets.yaml."
WhenToUse: "Read before editing the semantic model, presentation/action definitions, domain mappings, or generic dense-operational widget inventory."
---

# DMETA Core Model and Widget IR Spec

> **Current status (2026-05-25):** The core-model sections remain useful shared Semantic IR reference material. The widget IR sections are historical or Web-specific and should be superseded by a Web MetaDesignSystem spec. Active Web generation now uses `lower-web`, `plan-scaffold`, and `scaffold-react`; active PBUI generation uses the PBUI/CLIM commands described in the current playbooks.

## Executive Summary

This document specifies two concrete DMETA v0 source artifacts:

```text
dmeta/sources/dmeta-ir/01-core-model.yaml
dmeta/sources/dmeta-ir/core-model/core-model.yaml
dmeta/sources/dmeta-ir/core-model/archetypes.yaml
dmeta/sources/dmeta-ir/core-model/capabilities.yaml
dmeta/sources/dmeta-ir/core-model/presentations.yaml
dmeta/sources/dmeta-ir/core-model/examples/*.yaml
dmeta/sources/dmeta-ir/03-widgets.yaml
```

`01-core-model.yaml` is the semantic package index. It carries the package summary, long-form summary, references to the design docs, validation policy, and paths to split subfiles.

The `core-model/` subdirectory contains the semantic source of truth:

- `core-model.yaml` — shared logical types and package authoring guidance;
- `archetypes.yaml` — archetypes with short and long prose descriptions;
- `capabilities.yaml` — capabilities with short and long prose descriptions;
- `presentations.yaml` — presentation contracts and actions;
- `examples/*.yaml` — one pressure-test domain per file.

`03-widgets.yaml` is the component-class source of truth. It defines generic dense-operational widgets that consume the core model's presentations and emit typed actions/callbacks.

The purpose of this split is deliberate: archetypes and capabilities need enough prose context to be useful for interns, reviewers, generated documentation, and LLM-assisted workflows. Keeping them in one monolithic YAML file would make the model too hard to review.

## Design Principles

1. **Archetypes inherit explicitly.** `Archetype` is an abstract root, non-root archetypes declare `extends`, and validators/generators operate on effective inherited capabilities and presentations.
2. **Capabilities inherit explicitly.** `Capability` is an abstract root, non-root capabilities declare `extends`, and descendants inherit projections, presentations, actions, and filters.
3. **Domain mappings target concrete semantics.** A domain type can map to more than one concrete archetype/capability, but not to abstract taxonomy nodes.
4. **Domain mappings are examples in v0.** They pressure-test the model but do not yet need to be a separate production artifact.
5. **Presentations are display contracts.** They specify required projections and interaction affordances, not only visual components.
6. **Actions are typed semantic operations.** They can accept capabilities, archetypes, presentations, or concrete domain types.
7. **Widgets consume presentations.** Widgets should not need to know arbitrary raw domain structures.
8. **The adapter boundary remains explicit.** Runtime wire data becomes typed props and `PresentationRef`s before reaching widgets.

## `01-core-model.yaml` and split `core-model/` package

### Top-level package index shape

```yaml
schema_version: 0
artifact_type: dmeta_core_model
summary: Consolidated semantic archetype, capability, presentation, action, and domain example model for DMETA v0.
long_summary: >
  Longer prose explanation of what the core model package is, who should read it,
  and which design docs explain the concepts.
references:
  semantic_model_design_doc: ../../design-docs/02-semantic-archetype-and-capability-model.md
  core_model_widget_ir_spec: ../../design-docs/05-dmeta-core-model-and-widget-ir-spec.md
files:
  core_model: ./core-model/core-model.yaml
  archetypes: ./core-model/archetypes.yaml
  capabilities: ./core-model/capabilities.yaml
  presentations: ./core-model/presentations.yaml
  examples_dir: ./core-model/examples
  examples:
    - ./core-model/examples/agent-workflow.yaml
    - ./core-model/examples/retail-logistics.yaml
validation: {}
```

The package index does not contain the full semantic model. It points to focused subfiles.

### `schema_version`

Integer schema version. v0 uses `0` until the structure is proven by generators/validators.

### `artifact_type`

Must be:

```yaml
artifact_type: dmeta_core_model
```

Validators should reject any other artifact type for this file.

## Archetypes

Archetypes are reusable operational roles. They live in `core-model/archetypes.yaml`.

### Shape

```yaml
schema_version: 0
artifact_type: dmeta_archetypes
summary: Reusable operational archetypes for the DMETA core model.
long_summary: >
  File-level prose explaining how to understand archetypes and when to edit them.
references:
  design_doc: ../../../design-docs/02-semantic-archetype-and-capability-model.md
  spec: ../../../design-docs/05-dmeta-core-model-and-widget-ir-spec.md
archetypes:
  Archetype:
    abstract: true
    description: Root semantic role class.
    extends: []
    default_capabilities: []
    recommended_presentations: []
    examples: []
    long_description: >
      Every semantic archetype inherits from Archetype. The root is abstract and
      exists so validation, generated TypeScript, and documentation can reason
      about the complete hierarchy explicitly.
  Entity:
    abstract: true
    extends:
      - Archetype
    description: Base semantic thing with identity, labels, inspection, and relation affordances.
    default_capabilities:
      - identifiable
      - labelable
      - inspectable
      - relatable
    recommended_presentations:
      - compact_ref
      - detail_panel
    examples: []
    long_description: >
      Entity is the shared parent for semantic subjects that appear in operational UIs.
  WorkItem:
    extends:
      - Entity
    description: A unit of work that can be tracked, progressed, completed, failed, retried, or inspected.
    long_description: >
      Longer prose paragraph explaining what WorkItem means, what it is not,
      examples across domains, and UI implications for dense operational apps.
    default_capabilities:
      - identifiable
      - labelable
      - stateful
      - temporal
      - actionable
      - inspectable
      - relatable
    recommended_presentations:
      - compact_ref
      - dense_row
      - summary_card
      - detail_panel
    examples:
      - ToolRun
      - Shipment
      - Order
      - BuildJob
```

### Required fields

| Field | Type | Purpose |
| --- | --- | --- |
| `description` | string | Short human-readable semantic definition. |
| `long_description` | string | Longer prose context for interns, generated docs, review, and LLM-assisted workflows. |
| `extends` | string[] | Parent archetypes. Required for every non-root archetype; empty only on `Archetype`. |
| `abstract` | boolean | Whether this archetype is a taxonomy/helper node that domain examples must not map directly. |
| `default_capabilities` | string[] | Capabilities normally expected for this archetype before inheritance; validators/generators also expose effective inherited capabilities. |

### Optional fields

| Field | Type | Purpose |
| --- | --- | --- |
| `recommended_presentations` | string[] | Presentation ids commonly useful for this archetype. |
| `examples` | string[] | Concrete domain examples. |
| `notes` | string | Human context. |

### Initial archetype inventory

DMETA v0 should start with:

- `Actor`
- `WorkItem`
- `Event`
- `Resource`
- `Relation`
- `Metric`
- `TimelineSpan`
- `ActionSpec`
- `ActionInvocation`
- `Annotation`

### Validation rules

- Archetype ids are unique.
- Every `default_capabilities` entry references a known capability.
- Every `recommended_presentations` entry references a known presentation.

## Capabilities

Capabilities define reusable affordances and projections. They live in `core-model/capabilities.yaml`.

### Shape

```yaml
schema_version: 0
artifact_type: dmeta_capabilities
summary: Reusable semantic capabilities, projections, filters, presentations, and action affordances for DMETA.
long_summary: >
  File-level prose explaining why capabilities are the reusable layer for many
  presentation and action rules.
references:
  design_doc: ../../../design-docs/02-semantic-archetype-and-capability-model.md
  spec: ../../../design-docs/05-dmeta-core-model-and-widget-ir-spec.md
capabilities:
  stateful:
    description: Object has a state/status that can be displayed, filtered, and used for actions.
    long_description: >
      Longer prose paragraph explaining what stateful means, examples across
      domains, how state differs from a State archetype, and UI implications.
    projections:
      state:
        type: string
        required: true
        description: Canonical state value.
      state_label:
        type: string
        required: false
        description: Human-readable state label.
      state_tone:
        type: tone
        required: false
        description: Optional semantic tone override.
    presentations:
      - status_badge
      - state_cell
    actions:
      - filter_by_state
    filters:
      - equals
      - not_equals
      - in
```

### Required fields

| Field | Type | Purpose |
| --- | --- | --- |
| `description` | string | Short human-readable meaning. |
| `long_description` | string | Longer prose context for interns, generated docs, review, and LLM-assisted workflows. |
| `projections` | map | Named values contributed or expected by the capability. |

### Projection fields

| Field | Type | Purpose |
| --- | --- | --- |
| `type` | string | Logical type name, not necessarily TypeScript syntax. |
| `required` | boolean | Whether a domain mapping must provide it. |
| `description` | string | Human-readable explanation. |

### Optional capability fields

| Field | Type | Purpose |
| --- | --- | --- |
| `presentations` | string[] | Capability-level presentation ids. |
| `actions` | string[] | Actions commonly enabled by this capability. |
| `filters` | string[] | Filter operators commonly enabled by this capability. |
| `notes` | string | Human context. |

### Initial capability inventory

DMETA v0 should start with:

- `identifiable`
- `labelable`
- `stateful`
- `temporal`
- `inspectable`
- `relatable`
- `actionable`
- `streamable`
- `append_only`
- `measurable`
- `aggregatable`
- `schedulable`
- `executable`
- `spatial`
- `parameterized`

### Validation rules

- Capability ids are unique.
- Projection names within a capability are unique.
- Projection `type` values come from known primitive/logical types.
- Capability presentation references resolve.
- Capability action references resolve.

## Presentations

Presentations are named display contracts.

### Shape

```yaml
presentations:
  status_badge:
    description: Compact semantic state indicator.
    layer: capability
    applies_to:
      capabilities: [stateful]
    requires:
      - state
    optional:
      - state_label
      - state_tone
    role: badge
    density: compact
    interaction:
      selectable: true
      context_menu: true
      copy: false
    style_recipe: state_badge
```

### Required fields

| Field | Type | Purpose |
| --- | --- | --- |
| `description` | string | Human-readable display contract. |
| `layer` | enum | `capability`, `archetype`, or `domain`. |
| `applies_to` | map | Which capabilities/archetypes/domain types can use it. |
| `requires` | string[] | Required projections. |
| `role` | string | Presentation role for widgets/design language. |

### Optional fields

| Field | Type | Purpose |
| --- | --- | --- |
| `optional` | string[] | Optional projections. |
| `density` | enum | `compact`, `regular`, `spacious`, or `any`. |
| `interaction` | map | Select/copy/context/action behavior. |
| `style_recipe` | string | Link to design-language recipe. |
| `fallbacks` | string[] | Ordered fallback presentations. |

### Initial presentation inventory

Capability-level:

- `compact_id`
- `display_label`
- `status_badge`
- `state_cell`
- `timestamp_inline`
- `duration_cell`
- `metric_cell`
- `relation_link`

Archetype-level:

- `compact_ref`
- `inline_token`
- `dense_row`
- `summary_card`
- `detail_panel`
- `timeline_marker`

### Validation rules

- Presentation ids are unique.
- `layer` is valid.
- `applies_to.capabilities` references known capabilities.
- `applies_to.archetypes` references known archetypes.
- Required/optional projections are available through the applicable capabilities or explicitly documented domain mappings.
- Fallback chains are acyclic.

## Actions

Actions are typed operations that can be launched from presentations or filled by selecting presentations.

### Shape

```yaml
actions:
  inspect:
    description: Open detail view for any inspectable subject.
    category: inspect
    accepts:
      - capability: inspectable
    arguments:
      subject:
        mode: selected_presentation
        required: true
        accepts:
          - capability: inspectable
    result:
      kind: open_detail
```

### Required fields

| Field | Type | Purpose |
| --- | --- | --- |
| `description` | string | Human-readable operation meaning. |
| `category` | string | Grouping for menus/palettes. |
| `accepts` | list | What can launch the action. |
| `arguments` | map | Argument definitions. |

### Accepted target selectors

An action may accept:

```yaml
accepts:
  - capability: stateful
  - archetype: WorkItem
  - presentation: compact_ref
  - domain_type: ToolRun
```

Use the least specific selector that correctly expresses the action.

### Argument modes

Initial modes:

- `selected_presentation`
- `presentation_candidate`
- `free_text`
- `number_input`
- `choice`
- `confirmation`
- `parameter_form`

### Initial action inventory

- `inspect`
- `copy_reference`
- `filter_by_value`
- `filter_by_state`
- `open_related`
- `retry_work_item`
- `cancel_work_item`
- `schedule_action`
- `compare_metrics`

### Validation rules

- Action ids are unique.
- Accepted capabilities/archetypes/presentations resolve.
- Argument selectors resolve.
- Argument modes are known.
- Result kinds are known or explicitly marked app-specific.

## Domain Examples

Domain examples live under `core-model/examples/`, one file per domain. They pressure-test the generic vocabulary without yet becoming a production domain mapping system.

### Shape

```yaml
schema_version: 0
artifact_type: dmeta_domain_example
id: agent_workflow
summary: AI agent workflow dashboard.
long_summary: >
  Prose explanation of what this example pressure-tests and why it exists.
domain_example:
  description: AI agent workflow dashboard.
  domain_types:
      ToolRun:
        description: Concrete execution of a tool call.
        archetypes: [ActionInvocation, WorkItem]
        capabilities:
          identifiable:
            id: call_id
          labelable:
            label: tool_name
          stateful:
            state: status
          temporal:
            start_time: started_at
            end_time: finished_at
            duration_ms: duration_ms
          relatable:
            actor_ref: agent_id
```

### Required example domains for v0

- `agent_workflow`
- `retail_logistics`

### Validation rules

- Domain example ids are unique.
- Domain type ids are unique within an example.
- Domain type archetypes resolve.
- Domain type capabilities resolve.
- Required capability projections are mapped.

## Runtime Types Generated from Core Model

A future generator should derive at least:

```ts
export type ArchetypeId =
  | "Actor"
  | "WorkItem"
  | "Event"
  | "Resource"
  | "Relation"
  | "Metric"
  | "TimelineSpan"
  | "ActionSpec"
  | "ActionInvocation"
  | "Annotation";

export type CapabilityId =
  | "identifiable"
  | "labelable"
  | "stateful"
  | "temporal"
  | "inspectable";

export type PresentationId =
  | "compact_ref"
  | "status_badge"
  | "dense_row";

export type ActionId =
  | "inspect"
  | "copy_reference"
  | "filter_by_state";
```

And runtime helper structures:

```ts
export type PresentationRef = {
  semanticId: string;
  domainType: string;
  archetypes: ArchetypeId[];
  capabilities: CapabilityId[];
  presentationId: PresentationId;
  label: string;
  value?: unknown;
  copyValue?: string;
  sourceSurface: string;
  sourcePath?: string;
};
```

## `03-widgets.yaml`

### Top-level shape

```yaml
schema_version: 0
artifact_type: dmeta_widget_ir
summary: Generic dense-operational widget classes for DMETA v0.

widgets: []
validation: {}
```

## Widget Object Shape

```yaml
widgets:
  - id: dmeta.presentation_token
    name: PresentationToken
    status: draft
    classification:
      level: atom
      role: semantic_presentation
    intent:
      purpose: Render a single presentation ref as inline selectable text/token/chip.
      adapter_boundary: Receives typed PresentationRef; does not parse runtime JSON.
    consumes:
      presentations:
        - compact_id
        - display_label
        - status_badge
        - timestamp_inline
        - compact_ref
    contract:
      props:
        PresentationTokenProps:
          fields:
            subject:
              type: PresentationRef
              required: true
            variant:
              type: PresentationId
              required: true
            selected:
              type: boolean
              required: false
            candidate:
              type: boolean
              required: false
      action_slots:
        onOpenContextMenu:
          accepts: PresentationRef
        onSelectPresentation:
          accepts: PresentationRef
    stories:
      - default
      - selected
      - action_candidate
      - with_status
    outputs:
      component: src/dmeta/widgets/PresentationToken/PresentationToken.tsx
      types: src/dmeta/widgets/PresentationToken/PresentationToken.types.ts
      metadata: src/dmeta/widgets/PresentationToken/PresentationToken.metadata.ts
      stories: src/dmeta/widgets/PresentationToken/PresentationToken.stories.tsx
```

### Required widget fields

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | string | Stable widget id. |
| `name` | string | React component name. |
| `status` | enum | `draft`, `scaffolded`, `promoted`, `deprecated`. |
| `classification` | map | Atom/molecule/organism and semantic role. |
| `intent` | map | Purpose and adapter boundary. |
| `contract` | map | Props and action slots. |
| `outputs` | map | Generated file paths. |

### Optional widget fields

| Field | Type | Purpose |
| --- | --- | --- |
| `consumes` | map | Archetypes/capabilities/presentations consumed. |
| `stories` | list/map | Story requirements. |
| `examples` | map | Example usage. |
| `implementation_todos` | list | Promotion notes. |

## Initial Widget Inventory

### Atoms

- `PresentationToken`
- `StatusBadge`
- `MetricCell`
- `TimestampText`
- `CompactReference`

### Molecules

- `FilterChip`
- `FieldInspectorRow`
- `ActionMenu`
- `ArgumentCollector`
- `RelationList`

### Organisms

- `RecordStream`
- `DenseTable`
- `ProcessPanel`
- `DetailDrawer`
- `FilterBar`
- `ActionPalette`

## Widget Design Rules

### Widgets consume typed props

Widgets must not parse raw runtime JSON. They receive typed props, presentation refs, action definitions, and callbacks.

### Widgets do not own backend dispatch

Widgets emit typed callbacks. The adapter/backend dispatch layer handles effects.

### Widgets render semantic metadata

Selectable presentations should render data attributes or event payloads sufficient to reconstruct a `PresentationRef`.

### Widgets use generated design helpers

Widgets should not hardcode typography, colors, density, or status styles once design helpers exist.

### Widgets preserve metadata sidecars

Generated metadata sidecars keep the YAML intent next to the promoted implementation.

## Widget Validation Rules

- Widget ids are unique.
- Widget names are valid React component identifiers.
- Consumed presentations exist.
- Consumed archetypes/capabilities exist.
- Props reference known generated/shared types or local interfaces.
- Action slots reference known payload types or `PresentationRef`.
- Output paths are deterministic and unique.
- Required stories exist in Storybook coverage manifest once that manifest exists.

## Relationship Between Core Model and Widget IR

The core model defines what exists semantically:

- archetypes;
- capabilities;
- presentations;
- actions;
- domain examples.

The widget IR defines how those things become reusable React component classes:

- which presentations a widget can render;
- which action slots it exposes;
- what typed props it receives;
- what stories prove it;
- what files the generator creates.

The widget IR should not redefine archetypes, capabilities, or actions. It references them.

## Generation Targets

From `01-core-model.yaml`:

- `src/dmeta/core/archetypes.ts`
- `src/dmeta/core/capabilities.ts`
- `src/dmeta/core/presentations.ts`
- `src/dmeta/core/actions.ts`
- `src/dmeta/core/PresentationRef.ts`
- `src/dmeta/core/actionMatching.ts`

From `03-widgets.yaml`:

- widget component scaffold;
- widget `.types.ts`;
- widget `.metadata.ts`;
- widget `.stories.tsx`;
- widget `index.ts`;
- Storybook coverage seed.

## First Manual Pressure Test

A valid v0 draft should support these flows:

### Agent workflow flow

1. Render a `ToolRun` as a `WorkItem` dense row.
2. Show its `stateful.status_badge`.
3. Right-click the row and discover `inspect`, `retry_work_item`, and `filter_by_state`.
4. Select an `Agent` compact reference as an argument to a relation/filter action.
5. Open a detail drawer with related `ToolEvent`s.

### Retail logistics flow

1. Render a `Shipment` as a `WorkItem` dense row.
2. Show its `stateful.status_badge`.
3. Right-click the row and discover `inspect`, `filter_by_state`, and `open_related`.
4. Select a `Carrier` compact reference as an action/filter argument.
5. Open a detail drawer with related `ScanEvent`s and package resources.

If both flows use the same generic presentations and widgets, the model is on track.


## 2026-05 Widget Template and Instance Manifest Update

The original version of this document described `03-widgets.yaml` as a monolithic widget IR. That model has been replaced. DMETA now treats widgets as **selectable templates**. The global `03-widgets.yaml` file is a package index with `artifact_type: dmeta_widget_template_package`, and concrete template records live in split files under `sources/dmeta-ir/widget-templates/`.

The current global layout is:

```text
sources/dmeta-ir/
  03-widgets.yaml
  widget-templates/
    00-index.yaml
    actions.yaml
    dashboards.yaml
    data-display.yaml
    filters.yaml
    forms.yaml
    layout.yaml
    presentations.yaml
    states.yaml
    streams.yaml
    surfaces.yaml
    tables.yaml
```

A template record keeps the earlier widget contract fields, but it also includes selection metadata:

```yaml
template:
  category: filters
  selection: optional
  maturity: draft
  default_importance: common
  selection_questions:
    - Does this concrete instance need this widget behavior?
  adaptation_points:
    autocomplete_sources:
      type: list
      required_for_variants: [autocomplete_entity_search]
      description: Suggestion sources exposed by the instance adapter.
  common_variants:
    - simple_text_search
    - autocomplete_entity_search
  avoid_when:
    - Search is not a primary workflow or fixed filters are sufficient.
```

Concrete instances select templates from the global catalog and from optional local template files. A manifest lives under an `instantiations/` directory:

```yaml
schema_version: 0
artifact_type: dmeta_instance
id: street_deli_ordering
name: Street Deli Ordering
template_sources:
  global_ir_root: ../../../sources/dmeta-ir
  local_template_files:
    - ../widget-templates/menu-browsing.yaml
    - ../widget-templates/item-cards.yaml
generation:
  output_dir: ../generated/widgets
selected_templates:
  - template: deli.composition_customizer
    as: StreetDeliCompositionCustomizer
    variant: bottom_sheet
    reason: Ingredient removal and intelligent substitutions are the core sandwich customization workflow.
excluded_templates:
  - template: dmeta.dense_table
    reason: The street-deli flow is card/customizer/cart oriented, not table oriented.
```

The generator path is now:

```text
widget templates + instance manifest
  -> dmeta plan-instance
  -> dmeta scaffold-instance
  -> generated selected widget scaffolds
  -> manual promotion
```

`plan-instance` validates selected template ids, excluded template ids, duplicate concrete component names, selection/exclusion reasons, declared variants, and required adaptation points. `scaffold-instance` reuses that validation path before writing files.

The key invariant is: a template being present in the catalog does not mean it should be generated. Generation is controlled by instance manifests.

## Open Questions

1. Should `core-model/examples/*.yaml` become a separate examples package once domain adapters exist?
2. Should `PresentationRef` use `semanticId` as globally unique, or include a separate `sourcePath` for local selection identity?
3. Should widget `consumes` reference presentations only, or also capabilities/archetypes for validation clarity?
4. How much Storybook coverage should live in `03-widgets.yaml` vs a later `storybook-coverage.yaml`?
5. Should generated metadata sidecars include full YAML fragments or only normalized summaries?
