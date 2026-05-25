---
Title: Current DMETA Compiler System Spec
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - dmeta
  - design-system
  - compiler-ir
  - metadesignsystem
  - web
  - pbui
  - clim
  - react
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../playbooks/01-dmeta-shared-compiler-playbook.md
    Note: Operational workflow for shared Semantic IR and Interaction IR changes.
  - Path: ../playbooks/02-dmeta-web-react-metadesignsystem-playbook.md
    Note: Operational workflow for the Web React target line.
  - Path: ../playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md
    Note: Operational workflow for the PBUI/CLIM React target line.
  - Path: ../sources/dmeta-ir/00-index.yaml
    Note: Global source package index for shared and target-specific IR roots.
  - Path: ../examples/street-deli-ordering/00-index.yaml
    Note: Street Deli example package index naming active Web and PBUI consumers.
ExternalSources: []
Summary: Current architecture of DMETA as a layered design-system compiler with shared Semantic/Interaction IR and two active MetaDesignSystem target lines: Web React and PBUI/CLIM React.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use as the top-level system spec before changing compiler layers, IR schemas, MetaDesignSystems, target generators, or example apps.
WhenToUse: Read after the foundation vision docs and before editing source IR, Go compiler packages, or generated/promoted React targets.
---

# Current DMETA Compiler System Spec

## 1. What this document teaches

This document explains the current DMETA architecture as a system of compiler passes. A new developer should finish this document with a clear answer to four questions: what DMETA is, what each layer owns, how the current Web and PBUI target lines differ, and how to validate a change without relying on guesswork.

DMETA is a design-system compiler. Its input is not a Figma file and not a finished React component. Its input is structured application meaning: domain objects, reusable archetypes, capabilities, action definitions, representations, target-specific UI obligations, and concrete presentation profiles. Its output is a set of validated plans and scaffolded code that humans can promote into maintained application code.

The project currently has one shared front half and two active target lines:

```text
Semantic IR
  -> Interaction IR
  -> Web MetaDesignSystem
     -> React target
     -> examples/street-deli-ordering/www/mobile-react

Semantic IR
  -> Interaction IR
  -> PBUI MetaDesignSystem
     -> generic PBUI React proof package
     -> Concrete PBUI presentation profile
     -> CLIM React app target
     -> examples/street-deli-ordering/www/clim-react
```

The important design decision is that Web React and PBUI/CLIM React are siblings. They share semantic and interaction facts, but they realize those facts in different interface systems. Web React produces conventional browser components: cards, rows, filters, forms, and app pages. PBUI/CLIM React produces a presentation-system-oriented interface: typed visible objects, action presentations, command affordances, selectors, inspectors, and CLIM-style view structure.

## 2. The problem DMETA solves

A design system for an application family has two kinds of knowledge. One kind describes the domain: what an appointment is, what a practitioner is, what it means for a time slot to be bookable, what actions a staff member can take on a booking. The other kind describes an interface: where a calendar block appears, how a cancellation badge looks, what happens when the user selects an object, and which Storybook stories should exist.

When those two kinds of knowledge are mixed together, each new app becomes a separate hand-built UI. A clinic scheduler, a barber shop scheduler, and a salon scheduler may all contain clients, practitioners, services, slots, appointments, reminders, payments, and no-shows, but their React components often hide those shared structures inside local prop names and local event handlers. DMETA keeps the shared structures visible.

The compiler pipeline gives every concept a correct place:

- Domain meaning belongs in Semantic IR.
- User actions and visible representation obligations belong in Interaction IR.
- Browser widget decisions belong in the Web MetaDesignSystem.
- Presentation-system decisions belong in PBUI.
- Concrete shell, style, and renderer choices belong in a concrete PBUI profile.
- React files and Storybook stories belong in target tooling.

This separation is what makes a design system reusable. If an `Appointment` is modeled as a schedulable, stateful work item, both a calendar grid and a command-oriented operator console can use that fact. Neither target needs to rediscover the domain model.

## 3. The compiler layers

### 3.1 Semantic IR

Semantic IR is the source of domain meaning. It defines reusable archetypes such as `Actor`, `WorkItem`, `Resource`, `Event`, and `TimelineSpan`. It defines capabilities such as `identifiable`, `labelable`, `stateful`, `temporal`, `inspectable`, `relatable`, and `schedulable`. It also records domain examples that map concrete objects onto those reusable meanings.

For example, in an appointment backend, a `Practitioner` might map to `Actor` and carry scheduling and assignment capabilities. An `Appointment` might map to both `WorkItem` and `TimelineSpan` because it has workflow state and occupies time. A `Room` or `Chair` might map to `Resource`. These mappings are target-neutral. They do not say whether an appointment is displayed as a card, row, calendar block, or command-line presentation.

Semantic IR lives under:

```text
sources/dmeta-ir/01-core-model.yaml
sources/dmeta-ir/core-model/
examples/street-deli-ordering/01-core-model.yaml
examples/street-deli-ordering/core-model/
```

### 3.2 Interaction IR

Interaction IR turns domain meaning into modality-neutral interaction obligations. It defines actions and representations before a target chooses a visual form.

A representation is a meaningful thing the user can see or select: `appointment_summary`, `client_reference`, `slot_candidate`, `payment_status`, or `conflict_warning`. An action is a typed operation: `inspect_subject`, `reschedule_appointment`, `assign_practitioner`, `cancel_appointment`, or `collect_payment`.

Interaction IR lives under:

```text
sources/dmeta-ir/interactions/00-index.yaml
sources/dmeta-ir/interactions/actions.yaml
sources/dmeta-ir/interactions/representations.yaml
sources/dmeta-ir/interactions/elaboration-rules.yaml
```

The elaboration rules are important. They are where DMETA makes implicit semantic consequences explicit. If something is schedulable and stateful, there may be a status representation and rescheduling action. If something is labelable and inspectable, there may be a compact reference and an inspect action. These rules let the compiler derive useful obligations instead of asking every app author to repeat them.

### 3.3 MetaDesignSystems

A MetaDesignSystem is the layer that interprets interaction obligations for an interface family. DMETA currently keeps two.

The Web MetaDesignSystem owns browser UI concepts: widgets, slots, visual states, event bindings, and Web lowering rules. It lowers interaction obligations into things a React app can render as ordinary web UI.

The PBUI MetaDesignSystem owns presentation-system concepts: presentation references, action presentations, inspector panels, action choosers, lifecycle status presentations, and composition presentations. It lowers interaction obligations into typed presentation obligations that can later be realized by a concrete presentation profile.

A MetaDesignSystem must not become a second semantic model. It should not redefine `Appointment`, `Client`, or `Practitioner`. It receives those concepts from Semantic IR and Interaction IR, then decides how its interface family should realize them.

### 3.4 Targets

A target turns MetaDesignSystem obligations into files. The current target tooling is React-oriented. It plans components, types, metadata, CSS, Storybook stories, runtime placeholders, and app package files.

Target output is intentionally not the same thing as finished application code. Generated code is a scaffold and review artifact. Promoted code is maintained by humans. The metadata sidecars preserve provenance so reviewers can still understand which source obligations produced a component or story.

## 4. Current repository layout

The global source package is:

```text
sources/dmeta-ir/
  00-index.yaml
  01-core-model.yaml
  02-design-language.yaml
  core-model/
  interactions/
  meta-design-systems/
    web/
    pbui/
```

The Street Deli example package is:

```text
examples/street-deli-ordering/
  00-index.yaml
  01-core-model.yaml
  core-model/
  instantiations/street-deli-ordering.yaml
  meta-design-systems/
    web/
    pbui/
  www/
    mobile/
    clim/
    mobile-react/
    clim-react/
  generated/pbui-react/
```

The static prototypes are canonical references:

```text
examples/street-deli-ordering/www/mobile/
examples/street-deli-ordering/www/clim/
```

The active React outputs are:

```text
examples/street-deli-ordering/www/mobile-react/       # promoted Web React app
examples/street-deli-ordering/generated/pbui-react/   # generic PBUI React proof package
examples/street-deli-ordering/www/clim-react/         # concrete PBUI/CLIM React app
```

The cleanup removed old duplicate and generated paths. If you see historical references to `prototype-clim`, `generated/widgets`, `generated/coffee-counter-widgets`, or committed `generated/dmeta-core`, treat them as old documentation unless a current playbook says otherwise.

## 5. The Web React path

The Web path exists for conventional browser application design. It is the right path for mobile ordering, admin backends, dashboards, calendar screens, data tables, cards, filters, forms, drawers, and Storybook-driven component review.

The Web flow is:

```text
Semantic IR
  -> Interaction IR
  -> Web lowering rules
  -> Web obligations
  -> React scaffold plan
  -> rendered files
  -> promoted React app
```

The active Go packages are:

```text
pkg/dmeta/metadesign/web/
pkg/dmeta/generator/react/
pkg/dmeta/instance/
```

The active commands are:

```bash
dmeta lower-web
dmeta plan-instance
dmeta plan-scaffold --target react
dmeta scaffold-react
```

A developer should use `lower-web` before touching React output. If `lower-web` does not produce the expected obligation, editing a React component is the wrong first step. The missing concept belongs in Semantic IR, Interaction IR, or Web lowering rules.

## 6. The PBUI/CLIM React path

The PBUI path exists for presentation-based user interfaces. In this path, visible objects are typed presentations. Actions are also presentable objects. The runtime can ask which actions are compatible with a selected presentation and can guide the user through selection and confirmation.

The generic PBUI flow is:

```text
Semantic IR
  -> Interaction IR
  -> PBUI lowering rules
  -> PBUI obligations
  -> generic PBUI React plan
  -> examples/street-deli-ordering/generated/pbui-react/
```

The concrete CLIM app flow adds one more authored layer:

```text
PBUI obligations
  -> concrete PBUI presentation profile
  -> concrete presentation plan
  -> CLIM React app plan
  -> examples/street-deli-ordering/www/clim-react/
```

The concrete profile is necessary because abstract PBUI should not know about the exact shell, colors, font files, view names, or component bindings of one application. For Street Deli, those decisions live under:

```text
examples/street-deli-ordering/meta-design-systems/pbui/
  presentation-system.yaml
  style-profile.yaml
  surfaces.yaml
  view-models.yaml
  presentation-bindings.yaml
  targets/react-app.yaml
```

The active Go packages are:

```text
pkg/dmeta/metadesign/pbui/
pkg/dmeta/metadesign/pbui/profile/
```

The active commands are:

```bash
dmeta validate-pbui
dmeta lower-pbui
dmeta plan-pbui-react
dmeta scaffold-pbui-react
dmeta validate-pbui-profile
dmeta instantiate-pbui
dmeta plan-pbui-react-app
dmeta scaffold-pbui-react-app
```

A developer should understand the distinction between `generated/pbui-react` and `www/clim-react`. The first is a generic proof package for abstract PBUI obligations. The second is a concrete app scaffold after applying the Street Deli presentation profile.

## 7. Generated code, promoted code, and review

DMETA generates scaffolds, not final judgment. A scaffold proves that the compiler can derive files, metadata, and stories from IR. A promoted component is maintained product code. Once a file is promoted, regeneration should be treated as a migration aid, not an automatic overwrite.

Metadata sidecars matter because they preserve the reason a file exists. A reviewer should be able to open a component and answer: which domain type caused this component, which representation or presentation it realizes, which action obligations it exposes, and which target generated it.

Storybook matters because it turns generated and promoted UI into a reviewable surface. It should show important states, edge cases, selected states, disabled states, and target-specific presentation behavior. Storybook is target-owned. It is not part of Semantic IR.

## 8. How to validate changes

Use this sequence when changing shared layers:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1

go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
```

Use this sequence for the Web target:

```bash
go run ./cmd/dmeta lower-web \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --web-root ./examples/street-deli-ordering/meta-design-systems/web \
  --output table

go run ./cmd/dmeta plan-scaffold \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --target react \
  --output table
```

Use this sequence for PBUI/CLIM:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table

go run ./cmd/dmeta validate-pbui-profile \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

Build React apps when target output or app code changes:

```bash
cd examples/street-deli-ordering/www/mobile-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook

cd ../clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## 9. How to add a new application family

When adding a new application family, begin with domain meaning. For an appointment-management backend, do not begin with a calendar component. Begin by defining `Client`, `Practitioner`, `Appointment`, `TimeSlot`, `Room`, `Service`, `Payment`, `Reminder`, and `Conflict`. Map them to archetypes and capabilities. Then define actions such as booking, rescheduling, cancellation, assignment, check-in, no-show marking, reminder sending, and payment collection.

Once the shared semantics are clear, decide which target lines are needed. A conventional admin product probably needs the Web path first. An expert operator console may also need the PBUI/CLIM path. Both targets should share the same Semantic IR and Interaction IR.

## 10. Key points

- DMETA is a compiler pipeline for design systems, not a one-step component generator.
- Semantic IR and Interaction IR are shared by all target lines.
- Web React and PBUI/CLIM React are sibling targets, not old and new versions of the same thing.
- MetaDesignSystems own target-family interpretation, not source domain truth.
- Concrete PBUI profiles keep app-specific presentation-system choices out of abstract PBUI.
- Generated code is scaffold output; promoted code is maintained application code.
- A correct change should validate at the layer where the concept belongs before target code is edited.
