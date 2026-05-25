---
Title: Shared Semantic and Interaction IR Spec
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - dmeta
  - design-system
  - semantic-ir
  - interaction-ir
  - compiler-ir
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../sources/dmeta-ir/01-core-model.yaml
    Note: Shared core-model package index.
  - Path: ../sources/dmeta-ir/core-model/archetypes.yaml
    Note: Shared archetype catalog.
  - Path: ../sources/dmeta-ir/core-model/capabilities.yaml
    Note: Shared capability catalog.
  - Path: ../sources/dmeta-ir/core-model/presentations.yaml
    Note: Shared semantic presentations and actions.
  - Path: ../sources/dmeta-ir/interactions/00-index.yaml
    Note: Shared Interaction IR package index.
  - Path: ../sources/dmeta-ir/interactions/actions.yaml
    Note: Modality-neutral action catalog.
  - Path: ../sources/dmeta-ir/interactions/representations.yaml
    Note: Modality-neutral representation catalog.
  - Path: ../sources/dmeta-ir/interactions/elaboration-rules.yaml
    Note: Rules that derive interaction obligations from semantic facts.
ExternalSources: []
Summary: Current specification for the shared DMETA Semantic IR and Interaction IR used by both Web React and PBUI/CLIM React target lines.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use before editing archetypes, capabilities, semantic presentations/actions, domain mappings, Interaction IR actions/representations, or elaboration rules.
WhenToUse: Read when designing a new domain package or changing shared compiler behavior that should feed both Web and PBUI targets.
---

# Shared Semantic and Interaction IR Spec

## Executive summary

This document specifies the shared front half of DMETA. These layers are target-neutral and feed both active MetaDesignSystems:

```text
Semantic IR
  -> Interaction IR
  -> Web MetaDesignSystem
  -> PBUI MetaDesignSystem
```

The shared layers answer domain and interaction questions before any specific UI target chooses cards, tables, presentation refs, command lines, or React components.

## Semantic IR purpose

Semantic IR describes what the application domain means.

It defines:

- reusable archetypes;
- reusable capabilities;
- projections required by capabilities;
- semantic presentation/action concepts;
- domain examples and mappings;
- inheritance relationships among archetypes and capabilities.

It should not define:

- Web widget templates;
- PBUI presentation types;
- React component names;
- CSS classes;
- target-specific file paths.

## Semantic package layout

Global semantic package:

```text
sources/dmeta-ir/01-core-model.yaml
sources/dmeta-ir/core-model/core-model.yaml
sources/dmeta-ir/core-model/archetypes.yaml
sources/dmeta-ir/core-model/capabilities.yaml
sources/dmeta-ir/core-model/presentations.yaml
sources/dmeta-ir/core-model/examples/*.yaml
```

Example semantic package:

```text
examples/street-deli-ordering/01-core-model.yaml
examples/street-deli-ordering/core-model/*.yaml
```

`01-core-model.yaml` is a package index. It should not contain the whole model. It points to focused subfiles so the semantic model stays reviewable.

## Archetypes

Archetypes are reusable operational roles. They are not domain nouns.

Examples:

- `Actor`
- `WorkItem`
- `Event`
- `Resource`
- `Relation`
- `Metric`
- `TimelineSpan`
- `ActionSpec`
- `ActionInvocation`

Rules:

- `Archetype` is the abstract root.
- Every non-root archetype declares `extends`.
- Use `abstract: true` for taxonomy/helper nodes that domain mappings should not target directly.
- Domain types map to concrete archetypes.
- Multiple inheritance is allowed when it represents a real semantic intersection.

For an appointment system:

- `Client` maps to `Actor`.
- `Practitioner` maps to `Actor` and may have schedulable/assignable capabilities.
- `Appointment` maps to `WorkItem` and `TimelineSpan`.
- `Room` or `Chair` maps to `Resource`.
- `AvailabilityBlock` maps to `TimelineSpan`.
- `NoShow` or `Cancellation` maps to `Event`.

## Capabilities

Capabilities are reusable affordances or semantic properties.

Examples:

- `identifiable`
- `labelable`
- `stateful`
- `temporal`
- `inspectable`
- `relatable`
- `actionable`
- `schedulable`
- `measurable`
- `available`

Rules:

- `Capability` is the abstract root.
- Every non-root capability declares `extends`.
- Capabilities should contribute projections, presentations, actions, filters, validation rules, or generation metadata.
- A capability should not be a vague tag.
- Required projections, including inherited required projections, must be satisfied by domain examples that claim the capability.

For an appointment system, likely capabilities include:

- `schedulable`: start/end/duration/timezone.
- `bookable`: can be reserved by a client.
- `assignable`: can be assigned to staff or resources.
- `cancelable`: can be canceled with policy/reason.
- `reschedulable`: can move between slots.
- `remindable`: has reminder channels/status.
- `billable`: price/payment/insurance state.
- `availability_constrained`: depends on staff, room, equipment, or policy.

## Semantic presentations and actions

A semantic presentation is a display contract, not a React component. It names a way semantic facts may be represented before a MetaDesignSystem chooses a target-specific realization.

Examples:

- `compact_ref`
- `inline_token`
- `status_badge`
- `timeline_marker`
- `detail_panel`
- `calendar_block`
- `schedule_row`

A semantic action is an operation described at the domain meaning level. It should not be a UI callback.

Examples for appointment management:

- `book_appointment`
- `reschedule_appointment`
- `cancel_appointment`
- `check_in_client`
- `mark_no_show`
- `assign_practitioner`
- `assign_room`
- `collect_payment`
- `send_reminder`
- `resolve_conflict`

## Interaction IR purpose

Interaction IR is the bridge between semantic facts and target-specific UI obligations.

It defines:

- modality-neutral actions;
- modality-neutral representations;
- elaboration rules that derive interaction obligations from Semantic IR.

It should not define:

- Web cards or tables;
- CLIM text styling;
- React components;
- CSS;
- app shell layouts.

## Interaction package layout

```text
sources/dmeta-ir/interactions/00-index.yaml
sources/dmeta-ir/interactions/actions.yaml
sources/dmeta-ir/interactions/representations.yaml
sources/dmeta-ir/interactions/elaboration-rules.yaml
```

## Interaction actions

Interaction actions are typed operations that can be triggered, selected, or filled from visible representations.

They should record:

- id;
- summary/intent;
- accepted semantic archetypes/capabilities/domain types;
- required argument types;
- confirmation or danger semantics if needed;
- whether the action is navigation, selection, mutation, or inspection oriented.

For appointment systems, representative Interaction IR actions are:

```text
inspect_subject
copy_reference
filter_by_state
filter_by_practitioner
filter_by_service
book_appointment
reschedule_appointment
cancel_appointment
assign_practitioner
assign_resource
check_in_client
mark_arrived
mark_no_show
collect_payment
send_reminder
open_intake_form
resolve_conflict
```

## Interaction representations

Representations are things the user can see, inspect, select, copy, filter by, or use as action arguments.

Appointment-system examples:

```text
appointment_summary
appointment_calendar_block
appointment_timeline_span
client_reference
practitioner_reference
service_summary
slot_candidate
availability_indicator
conflict_warning
payment_status
intake_status
reminder_status
room_resource_reference
waitlist_entry_summary
```

A representation remains target-neutral. Web may lower `appointment_calendar_block` into a visual calendar item. PBUI may lower it into a `PresentationRef` line or action-compatible typed object.

## Elaboration rules

Elaboration rules make implicit semantic consequences explicit.

Example rule shape in prose:

- If a domain type is `schedulable` and `stateful`, derive an appointment/status representation.
- If a domain type is `temporal` and `bookable`, derive a slot-candidate representation.
- If a domain type is `actionable` and `cancelable`, derive a cancel action obligation.
- If a domain type is `assignable`, derive assignment action obligations.

Elaboration rules are the right place to encode repeatable semantic-to-interaction consequences. They are not the right place to pick a calendar widget, command-line string, or CSS class.

## Validation invariants

Shared validation should ensure:

- all referenced archetypes exist;
- all referenced capabilities exist;
- inheritance roots are valid;
- domain examples do not target abstract archetypes/capabilities directly;
- required inherited projections are mapped;
- semantic presentations/actions reference known concepts;
- interaction actions reference known archetypes/capabilities/representations;
- elaboration rules reference known semantic and interaction ids;
- no target-specific concept leaks into the shared layers.

## Current commands

```bash
go run ./cmd/dmeta validate-ir \
  --root ./sources/dmeta-ir \
  --include-info \
  --output table

go run ./cmd/dmeta validate-ir \
  --root ./examples/street-deli-ordering \
  --include-info \
  --output table

go run ./cmd/dmeta validate-interactions \
  --root ./sources/dmeta-ir \
  --include-info \
  --output table

go run ./cmd/dmeta elaborate-interactions \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

## Authoring workflow for a new domain

For a new appointment-management backend:

1. List concrete domain objects.
2. Map each object to reusable archetypes and capabilities.
3. Add domain projections for required capabilities.
4. Add or reuse semantic presentations/actions.
5. Add or reuse Interaction IR actions and representations.
6. Add elaboration rules only when the mapping is repeatable.
7. Validate shared layers.
8. Lower into Web and/or PBUI targets.

## Boundary rule

If a concept would make sense in both a calendar grid and a command-line presentation interface, it probably belongs in Semantic IR or Interaction IR.

If a concept only makes sense as a card, drawer, React component, CLIM shell region, CSS class, or Storybook file kind, it belongs downstream in a MetaDesignSystem or target.
