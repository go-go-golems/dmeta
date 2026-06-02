---
Title: Semantic Archetype and Capability Model
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
    - Path: 2026-05-19--log-presentation-based-ui/app/src/features/logs/model/types.ts
      Note: Working proof of semantic types and presentation token model
    - Path: 2026-05-19--log-presentation-based-ui/app/src/features/logs/operations/commandTypes.ts
      Note: Working proof of presentation references and typed action argument collection
    - Path: 2026-05-19--log-presentation-based-ui/app/src/features/logs/operations/operationRegistry.ts
      Note: Working proof of action registry keyed by semantic type
ExternalSources: []
Summary: "Intermediate semantic model for reusable archetypes, capabilities, projections, and the boundary to interaction representations/actions."
LastUpdated: 2026-05-28T00:00:00-04:00
WhatFor: "Use to derive concrete archetypes.yaml, capabilities.yaml, domain-mapping.yaml, and Interaction IR representation/action schemas without pushing target-specific fields into the semantic layer."
WhenToUse: "Read when refining the domain side of the design-system factory or pressure-testing it against concrete domains."
---


# Semantic Archetype and Capability Model

## Executive Summary

This document refines the semantic model for the design-system factory. The factory should not start from one concrete domain model such as `Agent`, `Session`, `ToolCall`, and `LogEvent`. Instead, it should define reusable **semantic archetypes** and **capabilities** that concrete applications map their own domain objects onto.

The target applications are dense operational systems: agent workflow dashboards, retail logistics pipelines, agricultural sensor logs, ecommerce backends, build systems, monitoring dashboards, incident queues, and similar tools. Their concrete nouns differ, but their interaction structures are often congruent: users inspect actors, track work items, follow events, filter states, compare metrics, traverse relations, and act on selected semantic objects.

The key model is:

```text
Application domain type
  -> one or more semantic archetypes
  -> capability bundle
  -> named projections
  -> Interaction IR representations/actions
  -> target-specific MDS widgets and runtime actions
```

Archetypes now use explicit semantic inheritance. `Archetype` is the abstract root class; reusable parents such as `Entity`, `WorkItem`, `Resource`, and `Relation` contribute inherited default capabilities, examples, and generated ancestry metadata. A concrete type may map to more than one concrete archetype, but it should not map directly to abstract taxonomy nodes. Presentation and action decisions are derived in the Interaction IR and target MDS layers rather than stored as formal forward references on archetypes.

Capabilities use the same explicit inheritance model rooted at the abstract `Capability` class. Parent capabilities contribute projections to descendants. Presentation applicability, available actions, and filter behavior are derived from Interaction IR representations/actions, target lowering rules, and widget contracts instead of being duplicated on every capability. Validators and generators consume the effective inherited model, so inherited required projections must be mapped by domain examples and generated TypeScript can answer `isArchetypeA(child, ancestor)` / `isCapabilityA(child, ancestor)`.

## Problem Statement

A concrete agent dashboard and a concrete retail logistics dashboard do not share the same domain ontology. One has `Agent`, `ToolCall`, and `Session`; the other has `Order`, `Shipment`, `Carrier`, `Warehouse`, and `ScanEvent`.

But they do share UI and interaction structures:

- display compact identifiers inline;
- show status badges;
- inspect dense event streams;
- filter by actor, state, time, and relation;
- open details for any selected representation;
- schedule or execute actions;
- navigate from a row to related entities;
- compare metrics over time;
- distinguish definitions/signatures from concrete executions and emitted events.

If the DSL is too domain-specific, it cannot generate more than one family of apps. If it is too generic, it becomes vague and cannot drive widgets, validation, or code generation. The solution is to model reusable semantic **archetypes** and **capabilities** with enough precision to support projection validation and downstream interaction elaboration, while leaving formal presentation/action routing to later layers.

## Core Concepts

### Domain type

A concrete application type such as:

- `Agent`, `ToolCall`, `Session`, `LogEvent`
- `Order`, `Shipment`, `Carrier`, `Warehouse`, `ScanEvent`
- `Sensor`, `Reading`, `Field`, `Alert`

Domain types belong to a specific app. They are not the reusable vocabulary of the factory.

### Archetype

A reusable functional role that appears across multiple applications.

Examples:

- `Actor`
- `WorkItem`
- `Event`
- `Resource`
- `TimelineSpan`
- `Metric`
- `Relation`
- `ActionSpec`
- `ActionInvocation`
- `Annotation`

An archetype is best understood as a named bundle of capabilities that tends to recur in roughly similar form. In YAML it must either be the abstract root `Archetype` with `extends: []` or it must declare one or more parents in `extends`. Use `abstract: true` for intermediate taxonomy nodes that explain the semantic hierarchy but should not be assigned directly to domain types.

### Capability

A reusable semantic affordance or behavior. Capabilities define structured projections and semantic affordances that later layers can present, filter, act on, or validate.

Examples:

- `identifiable`
- `labelable`
- `stateful`
- `temporal`
- `actionable`
- `streamable`
- `inspectable`
- `relatable`
- `aggregatable`
- `spatial`
- `schedulable`
- `executable`
- `append_only`

Capabilities are the correct level for reusable projection requirements. For example, `stateful` contributes state projections and `temporal` contributes timestamp/interval projections. The fact that a target eventually renders a status badge or timestamp cell belongs to Interaction IR / target lowering / widget contracts, not to formal fields on the capability itself. In YAML every non-root capability declares `extends`; inherited projections are part of the effective capability contract seen by validators and generators.

### Projection

A named value exposed by a domain type, archetype, or capability.

Examples:

- `id`
- `label`
- `state`
- `timestamp`
- `duration`
- `actor_ref`
- `resource_ref`
- `metric_value`

Interaction representations declare which projections they expose after semantic meaning has been elaborated. Core-model prose may mention likely display forms, but formal display/action routing belongs downstream.

### Interaction representation

A named, modality-neutral visible form derived from archetypes, capabilities, and domain mappings.

Examples:

- `compact_reference`
- `state_indicator`
- `appointment_summary`
- `product_match_grid`
- `care_steps`
- `photo_upload_prompt`

Representations are not React components. They define what information becomes visible to the user and which downstream target obligations can be derived.

### Interaction action

A typed operation that can be invoked from selected representations or filled by selecting matching on-screen representations.

Important distinction:

- `ActionSpec` / signature: the definition of an available operation.
- `ActionInvocation`: a concrete scheduled/running/completed execution of that operation.
- `Event`: an observation emitted during or because of an invocation.

This distinction matters for tool calls, jobs, shipments, workflows, and backend operations.

## Proposed Model

### 1. Archetypes are composable

A concrete domain type can map to multiple archetypes.

Example:

```yaml
domain_types:
  ToolCall:
    archetypes: [ActionInvocation, WorkItem, EventSource]
    capabilities:
      - identifiable
      - labelable
      - stateful
      - temporal
      - executable
      - inspectable
      - relatable

  Shipment:
    archetypes: [WorkItem, TimelineSpan]
    capabilities:
      - identifiable
      - labelable
      - stateful
      - temporal
      - spatial
      - relatable
      - inspectable
```

This is not classical inheritance. It is semantic tagging plus capability composition. The factory should validate whether required projections exist for each selected archetype/capability, but it should not force every app into a strict taxonomy.

### 2. Archetypes are bundles of capabilities

A first draft of the archetype inventory might look like this:

```yaml
archetypes:
  Actor:
    description: "An entity that can perform, own, receive, or be assigned work."
    default_capabilities:
      - identifiable
      - labelable
      - actionable
      - relatable
      - inspectable

  WorkItem:
    description: "A unit of work that can be tracked, scheduled, progressed, completed, failed, or inspected."
    default_capabilities:
      - identifiable
      - labelable
      - stateful
      - temporal
      - actionable
      - inspectable
      - relatable

  Event:
    description: "A timestamped observation, state transition, log entry, scan, or lifecycle update."
    default_capabilities:
      - identifiable
      - temporal
      - append_only
      - inspectable
      - relatable

  Resource:
    description: "A thing used, moved, consumed, stored, or referenced by work."
    default_capabilities:
      - identifiable
      - labelable
      - relatable
      - inspectable

  TimelineSpan:
    description: "A bounded interval such as a session, route, workflow run, incident window, or execution phase."
    default_capabilities:
      - identifiable
      - labelable
      - temporal
      - stateful
      - aggregatable
      - inspectable

  Metric:
    description: "A quantitative value used for comparison, monitoring, sorting, or aggregation."
    default_capabilities:
      - measurable
      - aggregatable
      - temporal_optional
      - inspectable

  ActionSpec:
    description: "A definition/signature of an operation that may be invoked or scheduled."
    default_capabilities:
      - identifiable
      - labelable
      - actionable
      - parameterized
      - inspectable

  ActionInvocation:
    description: "A concrete execution of an operation."
    default_capabilities:
      - identifiable
      - labelable
      - stateful
      - temporal
      - executable
      - schedulable
      - inspectable
      - relatable
```

### 3. Capabilities define projections and reusable presentation hooks

Example capability schema sketch:

```yaml
capabilities:
  identifiable:
    projections:
      id:
        type: string
        required: true
    presentations:
      compact_id:
        requires: [id]
        role: compact_reference

  labelable:
    projections:
      label:
        type: string
        required: true
      subtitle:
        type: string
        required: false
    presentations:
      display_label:
        requires: [label]
        role: inline_text

  stateful:
    projections:
      state:
        type: StateValue
        required: true
      state_label:
        type: string
        required: false
      state_tone:
        type: Tone
        required: false
    presentations:
      status_badge:
        requires: [state]
        role: badge
      state_cell:
        requires: [state]
        role: table_cell

  temporal:
    projections:
      timestamp:
        type: datetime
        required: false
      start_time:
        type: datetime
        required: false
      end_time:
        type: datetime
        required: false
      duration_ms:
        type: integer
        required: false
    presentations:
      timestamp_inline:
        requires_any: [timestamp, start_time]
        role: inline_mono
      duration_cell:
        requires: [duration_ms]
        role: metric_cell
```

This answers the `status-badge` question: a status badge is the representation of the `stateful` capability. A `State` archetype is only necessary when a state itself becomes a first-class object, for example a state-machine node, transition target, or workflow state definition.

### 4. Domain mappings bind concrete fields to archetype projections

Example: agentic workflow dashboard.

```yaml
domain_types:
  Agent:
    archetypes: [Actor]
    capabilities:
      identifiable:
        id: agent_id
      labelable:
        label: display_name
        subtitle: model_name
      stateful:
        state: status
      temporal:
        timestamp: last_seen_at

  ToolCallDefinition:
    archetypes: [ActionSpec]
    capabilities:
      identifiable:
        id: tool_name
      labelable:
        label: title
      parameterized:
        parameters: input_schema

  ToolCallRun:
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

  ToolCallEvent:
    archetypes: [Event]
    capabilities:
      identifiable:
        id: event_id
      temporal:
        timestamp: timestamp
      relatable:
        work_item_ref: call_id
```

Example: retail logistics dashboard.

```yaml
domain_types:
  Carrier:
    archetypes: [Actor]
    capabilities:
      identifiable:
        id: carrier_id
      labelable:
        label: carrier_name
      stateful:
        state: availability

  Shipment:
    archetypes: [WorkItem, TimelineSpan]
    capabilities:
      identifiable:
        id: shipment_id
      labelable:
        label: tracking_number
        subtitle: destination
      stateful:
        state: shipment_status
      temporal:
        start_time: created_at
        end_time: delivered_at
      spatial:
        origin: origin_facility
        destination: destination_address
      relatable:
        actor_ref: carrier_id
        resource_ref: order_id

  ScanEvent:
    archetypes: [Event]
    capabilities:
      identifiable:
        id: scan_id
      temporal:
        timestamp: scanned_at
      stateful:
        state: scan_type
      spatial:
        location: facility_id
      relatable:
        work_item_ref: shipment_id
```

## Presentation Attachment Rules

### Capability-level presentations

Use when a visual pattern represents one reusable affordance.

Examples:

- `status_badge` → `stateful`
- `timestamp_inline` → `temporal`
- `metric_cell` → `measurable`
- `compact_ref` → `identifiable + labelable`
- `copyable_id` → `identifiable`
- `relation_link` → `relatable`

### Archetype-level presentations

Use when a visual pattern composes multiple capabilities into a recognizable domain-agnostic object representation.

Examples:

- `actor_chip` → `Actor` (`identifiable + labelable + stateful?`)
- `work_item_row` → `WorkItem` (`labelable + stateful + temporal + relatable`)
- `event_row` → `Event` (`temporal + append_only + inspectable`)
- `timeline_span_card` → `TimelineSpan` (`temporal + stateful + aggregatable`)

### Domain-level presentations

Use when an application needs a specialized rendering that cannot be captured by the generic archetype without becoming too broad.

Examples:

- `shipment_route_map_marker`
- `tool_call_payload_diff`
- `sensor_calibration_strip`

Domain-level presentations should still declare which archetype/capability projections they consume.

## Action Model

The presentation-based action model should work over archetypes, capabilities, and concrete domain types.

```yaml
actions:
  inspect:
    accepts:
      - capability: inspectable
    arguments:
      subject:
        type: selected_subject

  filter_by_state:
    accepts:
      - capability: stateful
    arguments:
      state:
        projection: state

  retry_work_item:
    accepts:
      - archetype: WorkItem
        requires_capabilities: [stateful, actionable]
    arguments:
      work_item:
        type: selected_subject

  schedule_action:
    accepts:
      - archetype: ActionSpec
    arguments:
      action_spec:
        type: selected_subject
      parameters:
        type: parameter_form
```

This allows the same action concept to operate across multiple domains:

- `filter_by_state` works for agent statuses, shipment statuses, order statuses, sensor alert states.
- `inspect` works for anything with `inspectable`.
- `retry_work_item` works for failed jobs, failed tool calls, failed shipment processing tasks, failed imports.

## Tool Call Clarification

A tool call is not one semantic thing. It can participate in several layers:

1. **Tool definition / signature** — an `ActionSpec`.
   - It has a name, description, input schema, output schema, and invocation constraints.
   - It can be presented as a callable command or catalog entry.

2. **Scheduled or running execution** — an `ActionInvocation` and often a `WorkItem`.
   - It has state, timestamps, progress, actor, arguments, and result.
   - It can be scheduled, retried, canceled, inspected.

3. **Observed event** — an `Event`.
   - A log record such as `tool_call_started`, `tool_call_completed`, or `tool_call_failed`.
   - It is append-only and timestamped.

The DSL should allow the same concrete backend object to expose multiple semantic facets, but the cleanest domain model may separate these as `ToolSpec`, `ToolRun`, and `ToolEvent`.

## Shipment Clarification

A shipment is a good example of composition rather than meta-layering:

- As a `WorkItem`, it is tracked through a lifecycle.
- As a `TimelineSpan`, it has a start, end, expected delivery, and phases.
- As a `Resource` relation, it refers to packages, order lines, facilities, and carriers.
- Its scan records are `Event`s.
- Its carrier/warehouse/customer are `Actor`s.

The generic UI should not know it is a shipment. It should know it can render a dense row for a WorkItem, show a state badge for `stateful`, draw a timeline span for `temporal`, and open related Actor/Resource references.

## First Concrete Schema Deliverables

This intermediate model should feed these concrete DSL artifacts:

1. `archetypes.yaml`
   - archetype ids, descriptions, default capabilities, and prose examples.

2. `capabilities.yaml`
   - capability ids, inherited projections, required/optional projection flags, and validation-relevant semantics.

3. `domain-mapping.yaml` / domain examples
   - application-specific domain type mappings to archetypes/capabilities/projections.

4. `presentations.yaml`
   - thin shared presentation vocabulary, applicability, projection requirements, fallbacks, and prose intent; no formal density, interaction affordance, style recipe, or target widget routing.

5. `interactions/actions.yaml`
   - typed action signatures with accepted archetypes/capabilities/domain types.

6. `interactions/representations.yaml`
   - modality-neutral visible forms and exposed projections.

7. target `widgets.yaml` / Web widget template files
   - component classes that consume presentations and emit typed callbacks.

## Implementation Plan

1. Draft `archetypes.yaml` and `capabilities.yaml` from this document.
2. Pressure-test the model against at least two domains:
   - agent workflow dashboard;
   - retail logistics pipeline.
3. Write example `domain-mapping.yaml` for both domains.
4. Define reusable presentation variants for the shared capabilities.
5. Identify where domain-level presentations are truly necessary.
6. Convert accepted examples into formal schema fields and validation invariants.
7. Feed the result into widget IR and generator design.

## Open Questions

1. Should `State` remain an archetype, or should it usually be a value type owned by `stateful`?
2. Is `ActionSpec` the right name, or should the schema call this `Command`, `Operation`, or `ActionSignature`?
3. Should capabilities be additive only, or can they parameterize each other (for example, `temporal.mode = instant | span | interval_set`)?
4. How much of the action model belongs in `actions.yaml` vs. `presentations.yaml`?
5. What is the minimum archetype/capability set for the first concrete generator?
