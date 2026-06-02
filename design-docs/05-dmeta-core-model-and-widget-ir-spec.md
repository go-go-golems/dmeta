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
LastUpdated: 2026-05-28T00:00:00-04:00
WhatFor: Use before editing archetypes, capabilities, domain mappings, Interaction IR actions/representations, or elaboration rules.
WhenToUse: Read when designing a new domain package or changing shared compiler behavior that should feed both Web and PBUI targets.
---

# Shared Semantic and Interaction IR Spec

## 1. What this document teaches

This document explains the shared front half of DMETA: Semantic IR and Interaction IR. These layers are the foundation of every target. Web React, PBUI/CLIM React, and any future target all depend on the same discipline: first describe what the application means, then describe what users can perceive and do, and only then lower that material into target-specific UI.

A new developer should read this document before editing archetypes, capabilities, domain examples, actions, representations, or elaboration rules. The goal is not only to learn file names. The goal is to understand where concepts belong and why the boundary matters.

The shared pipeline is:

```text
Semantic IR
  -> Interaction IR
  -> target-specific MetaDesignSystem
```

Semantic IR answers: what is this domain made of? Interaction IR answers: what can a user see, select, inspect, or do with those things? MetaDesignSystems answer later: how should this interface family realize those obligations?

## 2. Why shared IR exists

An application domain contains facts that should not be trapped inside one UI. A scheduling system may show appointments in a Web calendar, a mobile list, a command-oriented operator console, and an audit timeline. All of those targets need to agree that an appointment has identity, time, state, participants, services, resources, and possible actions. If those facts live only in React props, each target must rediscover them.

Semantic IR and Interaction IR prevent that duplication. They record the shared domain and interaction structure once, then allow each target to lower it differently. This is why DMETA can keep a Web React path and a PBUI/CLIM React path without making one depend on the other's component model.

## 3. Semantic IR

Semantic IR describes application meaning in reusable terms. It is not a database schema, although it may reference fields that come from one. It is not a UI schema, although it eventually feeds UI. It is a semantic model that tells the compiler how concrete domain objects participate in reusable operational patterns.

The global Semantic IR package lives here:

```text
sources/dmeta-ir/01-core-model.yaml
sources/dmeta-ir/core-model/core-model.yaml
sources/dmeta-ir/core-model/archetypes.yaml
sources/dmeta-ir/core-model/capabilities.yaml
sources/dmeta-ir/core-model/examples/*.yaml
```

An application can also provide a local semantic package. Street Deli does this under:

```text
examples/street-deli-ordering/01-core-model.yaml
examples/street-deli-ordering/core-model/*.yaml
```

The package index file points to the focused subfiles. The subfiles contain the actual model. This split keeps each file reviewable and gives authors enough room to write prose that explains intent.

## 4. Archetypes

An archetype is a reusable operational role. It describes what kind of thing a domain object is from the perspective of dense operational software.

Common archetypes include:

- `Actor`, for people, organizations, agents, or systems that participate in work.
- `WorkItem`, for something tracked through a process.
- `Event`, for an observation or occurrence.
- `Resource`, for something allocated, consumed, or scheduled.
- `TimelineSpan`, for something that occupies time.
- `Metric`, for a measurable value.
- `Relation`, for a typed connection between objects.
- `ActionSpec`, for the definition of an operation.
- `ActionInvocation`, for a concrete execution of an operation.

Archetypes form an inheritance structure. `Archetype` is the abstract root. Non-root archetypes declare `extends`. Abstract helper nodes can exist, but domain mappings should target concrete semantic roles. This lets validation catch vague mappings such as assigning a domain object directly to a root or helper type.

For appointment management, useful mappings are straightforward:

```text
Client        -> Actor
Practitioner  -> Actor
Appointment   -> WorkItem + TimelineSpan
TimeSlot      -> TimelineSpan
Room          -> Resource
Chair         -> Resource
Cancellation  -> Event
NoShow        -> Event
Payment       -> WorkItem or Event, depending on the system
```

These mappings do not dictate the UI. They tell every target what kind of operational object it is receiving.

## 5. Capabilities

A capability is a reusable affordance or property that can be attached to an archetype or domain type. Capabilities should be concrete enough to drive projection validation, interaction elaboration, or generated metadata.

A good capability says what semantic data it contributes. For example, `stateful` contributes state projections. `temporal` contributes timestamps or intervals. `schedulable` contributes start/end/duration/timezone semantics. `inspectable` contributes the semantic fact that downstream Interaction IR can elaborate into inspectable representations/actions.

Common capabilities include:

- `identifiable`, for stable ids.
- `labelable`, for human-readable names.
- `stateful`, for lifecycle or status.
- `temporal`, for time points and intervals.
- `inspectable`, for detail views and inspectors.
- `relatable`, for navigable relationships.
- `actionable`, for objects that accept operations.
- `schedulable`, for objects placed on a schedule.
- `available`, for resources or slots with availability state.
- `billable`, for money, invoices, copays, or payments.

Capabilities also use inheritance. `Capability` is the abstract root. Non-root capabilities declare `extends`. Required projections inherited from parent capabilities must be satisfied by domain examples that claim the capability.

For an appointment system, `Appointment` might claim:

```text
identifiable
labelable
stateful
temporal
schedulable
assignable
actionable
relatable
billable
remindable
```

Each capability implies obligations. A `temporal` appointment needs a start and end. A `stateful` appointment needs a state. A `billable` appointment needs payment or charge information if the billing UI uses it.

## 6. Projections

A projection is a named piece of information a capability or Interaction IR representation can rely on. Projections keep generated and promoted UI from guessing which field means what.

For appointment management:

```text
starts_at
ends_at
duration_minutes
timezone
appointment_state
client_label
practitioner_label
service_label
room_label
payment_state
reminder_state
intake_state
```

The exact storage field may differ between verticals. A clinic may store `provider_id`; a salon may store `stylist_id`. The semantic projection can still say this object has an assigned practitioner. The target can then build stable UI around the projection rather than one vertical's database naming.

## 7. Visible obligations belong to Interaction IR

The core-model package no longer carries formal presentation vocabulary. Core semantics stop at archetypes, capabilities, projections, and domain examples. If a concept describes something a user can see, select, inspect, copy, filter by, or act on, it belongs in Interaction IR as a representation and/or action.

The downstream chain is now:

```text
core-model archetypes/capabilities/projections
  -> Interaction IR representations/actions
  -> Web or PBUI MetaDesignSystem lowering rules
  -> widget contracts and generated/promoted components
```

Core-model prose may mention likely user-visible implications, but formal visible obligations, action catalogs, action effects, and action-to-representation relationships belong under `interactions/actions.yaml`, `interactions/representations.yaml`, and `interactions/elaboration-rules.yaml`.

## 8. Interaction IR

Interaction IR sits after semantic meaning and before target realization. It is where DMETA records what the user can perceive and do in modality-neutral terms.

The Interaction IR package lives here:

```text
sources/dmeta-ir/interactions/00-index.yaml
sources/dmeta-ir/interactions/actions.yaml
sources/dmeta-ir/interactions/representations.yaml
sources/dmeta-ir/interactions/elaboration-rules.yaml
```

Interaction IR has three important catalogs.

The action catalog contains operations with typed acceptance rules. It describes actions such as inspection, filtering, copying references, selecting subjects, applying substitutions, or scheduling work.

The representation catalog contains visible semantic forms. A representation is a thing a user can see and potentially use as an action argument. For appointment management, examples include `appointment_summary`, `appointment_calendar_block`, `client_reference`, `practitioner_reference`, `slot_candidate`, `availability_indicator`, `conflict_warning`, `payment_status`, and `waitlist_entry_summary`.

The elaboration rules connect Semantic IR to Interaction IR. They say which interaction obligations should be derived from which semantic facts.

## 9. Elaboration rules

Elaboration rules are one of the most important parts of the shared compiler. They are how DMETA turns a semantic model into useful interaction obligations.

Consider an appointment that is schedulable, stateful, and actionable. From that alone, the compiler can derive several interaction obligations:

```text
appointment_summary
appointment_calendar_block
appointment_lifecycle_status
inspect_appointment
reschedule_appointment
cancel_appointment
filter_by_state
```

Those obligations are still not Web or PBUI. Web may lower `appointment_calendar_block` to an `AppointmentBlock` component. PBUI may lower it to a `PresentationRef` with compatible action presentations. Both targets benefit from the same elaboration.

A useful elaboration rule has a clear source condition and a clear derived obligation. It should not smuggle in target details. If the rule mentions a CSS class or React component, it belongs later.

## 10. Validation invariants

Shared validation protects the whole compiler. A target can only be reliable if its input semantics are coherent.

Validation should ensure that:

- every referenced archetype exists;
- every referenced capability exists;
- inheritance roots are valid;
- abstract helper nodes are not used as concrete domain mappings;
- required inherited projections are mapped;
- interaction actions reference known accepted object types;
- representations have stable ids and prose intent;
- elaboration rules reference known semantic and interaction concepts;
- target-specific concepts do not leak into shared layers.

These checks are not administrative overhead. They keep the compiler honest. If a Web widget expects a schedulable object, and the domain model never supplied the required temporal projections, the error should appear before React code is generated.

## 11. Current commands

Use these commands when working in shared layers:

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

The first command checks the global IR package. The second checks the example application package. The third checks shared Interaction IR. The fourth shows what interaction obligations the compiler derives for an application.

## 12. Designing a new domain package

A new domain package should be written from the domain outward. For an appointment backend, begin with the object inventory:

```text
Client
Practitioner
Appointment
AppointmentRequest
TimeSlot
Schedule
Location
Room
Chair
Service
Payment
Reminder
IntakeForm
WaitlistEntry
Conflict
Cancellation
NoShow
```

Then map each object to archetypes and capabilities. Do not define `Doctor`, `Barber`, and `Stylist` as universal root concepts. They are vertical-specific forms of practitioners or actors. Preserve their domain names locally, but map them to reusable semantic roles.

Next, define interaction actions and representations. Ask what users need to inspect, select, filter, assign, schedule, cancel, or confirm. Only after this is stable should a target decide whether the UI uses a calendar grid, a list, a command line, or a detail drawer.

## 13. Key points

- Semantic IR describes domain meaning before target choice.
- Archetypes describe reusable operational roles.
- Capabilities describe reusable affordances and required projections.
- Interaction IR describes what users can perceive and do in target-neutral terms.
- Elaboration rules derive interaction obligations from semantic facts.
- Web and PBUI targets should consume shared obligations rather than inventing their own domain model.
- A concept belongs in the shared layer only if more than one target can reasonably use it.
