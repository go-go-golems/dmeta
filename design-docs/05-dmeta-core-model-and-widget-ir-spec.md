---
Title: DMETA Core Model and Widget IR Spec
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
Summary: "Concrete v0 specification for the consolidated DMETA core model YAML and widget IR YAML."
LastUpdated: 2026-05-19T18:35:00-04:00
WhatFor: "Use to draft or validate dmeta/sources/dmeta-ir/01-core-model.yaml and 03-widgets.yaml."
WhenToUse: "Read before editing the semantic model, presentation/action definitions, domain mappings, or generic dense-operational widget inventory."
---

# DMETA Core Model and Widget IR Spec

## Executive Summary

This document specifies two concrete DMETA v0 source artifacts:

```text
dmeta/sources/dmeta-ir/01-core-model.yaml
dmeta/sources/dmeta-ir/03-widgets.yaml
```

`01-core-model.yaml` is the semantic and interaction source of truth. It consolidates, for v0, the concepts that might later be split into separate files: archetypes, capabilities, presentations, actions, and domain examples.

`03-widgets.yaml` is the component-class source of truth. It defines generic dense-operational widgets that consume the core model's presentations and emit typed actions/callbacks.

The purpose of this consolidation is deliberate: v0 should keep cross-layer relationships visible while the model is still stabilizing. Splitting too early would make the system look more formal than it is.

## Design Principles

1. **Archetypes are composable.** A domain type can map to more than one archetype.
2. **Capabilities carry reusable affordances.** Presentations and actions often attach to capabilities rather than whole archetypes.
3. **Domain mappings are examples in v0.** They pressure-test the model but do not yet need to be a separate production artifact.
4. **Presentations are display contracts.** They specify required projections and interaction affordances, not only visual components.
5. **Actions are typed semantic operations.** They can accept capabilities, archetypes, presentations, or concrete domain types.
6. **Widgets consume presentations.** Widgets should not need to know arbitrary raw domain structures.
7. **The adapter boundary remains explicit.** Runtime wire data becomes typed props and `PresentationRef`s before reaching widgets.

## `01-core-model.yaml`

### Top-level shape

```yaml
schema_version: 0
artifact_type: dmeta_core_model
summary: Consolidated semantic archetype, capability, presentation, action, and domain example model for DMETA v0.

archetypes: {}
capabilities: {}
presentations: {}
actions: {}
domain_examples: {}
validation: {}
```

### `schema_version`

Integer schema version. v0 uses `0` until the structure is proven by generators/validators.

### `artifact_type`

Must be:

```yaml
artifact_type: dmeta_core_model
```

Validators should reject any other artifact type for this file.

## Archetypes

Archetypes are reusable operational roles.

### Shape

```yaml
archetypes:
  WorkItem:
    description: A unit of work that can be tracked, progressed, completed, failed, retried, or inspected.
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
| `description` | string | Human-readable semantic definition. |
| `default_capabilities` | string[] | Capabilities normally expected for this archetype. |

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

Capabilities define reusable affordances and projections.

### Shape

```yaml
capabilities:
  stateful:
    description: Object has a state/status that can be displayed, filtered, and used for actions.
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
| `description` | string | Human-readable meaning. |
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

`domain_examples` is intentionally in the core model for v0. It pressure-tests the generic vocabulary without yet becoming a production domain mapping system.

### Shape

```yaml
domain_examples:
  agent_workflow:
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

## Open Questions

1. Should `domain_examples` stay in `01-core-model.yaml`, or move to `examples/*.yaml` after v0?
2. Should `PresentationRef` use `semanticId` as globally unique, or include a separate `sourcePath` for local selection identity?
3. Should widget `consumes` reference presentations only, or also capabilities/archetypes for validation clarity?
4. How much Storybook coverage should live in `03-widgets.yaml` vs a later `storybook-coverage.yaml`?
5. Should generated metadata sidecars include full YAML fragments or only normalized summaries?
