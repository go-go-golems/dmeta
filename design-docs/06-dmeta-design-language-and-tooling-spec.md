---
Title: DMETA MetaDesignSystem Targets and Tooling Spec
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - dmeta
  - design-system
  - metadesignsystem
  - web
  - pbui
  - clim
  - react
  - tooling
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../sources/dmeta-ir/02-design-language.yaml
    Note: Shared dense operational design-language source.
  - Path: ../sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml
    Note: Global Web MetaDesignSystem package.
  - Path: ../examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml
    Note: Street Deli Web MetaDesignSystem package.
  - Path: ../sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
    Note: Global PBUI MetaDesignSystem package.
  - Path: ../examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
    Note: Street Deli concrete PBUI/CLIM profile entrypoint.
  - Path: ../examples/street-deli-ordering/www/mobile-react/package.json
    Note: Promoted Web React app.
  - Path: ../examples/street-deli-ordering/generated/pbui-react/package.json
    Note: Generic PBUI React proof package.
  - Path: ../examples/street-deli-ordering/www/clim-react/package.json
    Note: Concrete PBUI/CLIM React app.
ExternalSources: []
Summary: Current specification for DMETA target-specific MetaDesignSystems, design-language consumption, React tooling, Storybook review, and validation commands.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use before changing Web lowering, PBUI lowering, concrete PBUI profiles, React target planning/rendering, Storybook output, or app validation workflows.
WhenToUse: Read after the shared Semantic/Interaction IR spec when deciding how a target should realize shared obligations.
---

# DMETA MetaDesignSystem Targets and Tooling Spec

## 1. What this document teaches

This document explains the target half of DMETA. The shared compiler layers describe domain meaning and interaction obligations. A MetaDesignSystem decides how an interface family realizes those obligations. Target tooling then turns those decisions into files, metadata, stories, and buildable packages.

The current repository has two active target lines:

```text
Web MetaDesignSystem
  -> Web React target
  -> examples/street-deli-ordering/www/mobile-react

PBUI MetaDesignSystem
  -> generic PBUI React proof package
  -> concrete PBUI profile
  -> CLIM React app target
  -> examples/street-deli-ordering/www/clim-react
```

A new developer should understand this distinction before editing any target code. Web React and PBUI/CLIM React share Semantic IR and Interaction IR, but they are different interface systems. A Web widget should not be forced into PBUI, and a CLIM presentation-system concept should not be forced into Web.

## 2. Design language in a target-specific compiler

DMETA has a shared design-language source at:

```text
sources/dmeta-ir/02-design-language.yaml
```

This file records dense operational UI guidance: typography, spacing, density, semantic color, state styling, data attributes, and lintable constraints. It is shared because both current targets need disciplined information design. It is not a universal stylesheet.

The Web path consumes design language as browser UI guidance. It may inform CSS modules, card density, button states, table row rhythm, filter layout, and Storybook review criteria.

The PBUI/CLIM path consumes design language through a concrete presentation profile. For Street Deli, exact style decisions live in `style-profile.yaml`, `surfaces.yaml`, and `presentation-bindings.yaml`. Those files say which shell regions exist, which classes mean selected or compatible, where the command line lives, and how abstract PBUI presentation types become concrete renderer components.

This boundary matters because design language should not become a dumping ground for every target detail. If a rule names `AppointmentBlock`, it probably belongs in Web. If a rule names `PresentationRefLine` or a command-line footer, it probably belongs in a PBUI profile. If a rule says dense operational interfaces should preserve readable identifiers, stable alignment, and restrained state color, it may belong in the shared design language.

## 3. The Web MetaDesignSystem

The Web MetaDesignSystem is the target family for conventional browser interfaces. It owns widgets, slots, visual states, event bindings, and Web-specific lowering rules. It is the right target for mobile ordering flows, appointment admin panels, calendars, forms, detail drawers, filters, tables, cards, and normal React component libraries.

The global Web package lives here:

```text
sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml
sources/dmeta-ir/meta-design-systems/web/lowering-rules.yaml
```

The Street Deli Web package lives here:

```text
examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml
examples/street-deli-ordering/meta-design-systems/web/lowering-rules.yaml
examples/street-deli-ordering/meta-design-systems/web/widgets/*.yaml
```

A Web lowering rule receives interaction obligations and produces Web obligations. For example, a representation such as `composition_summary` can become a menu card obligation. In an appointment system, `appointment_calendar_block` might become an `AppointmentBlock`, `slot_candidate` might become a `SlotPickerOption`, and `conflict_warning` might become a `ConflictInspector` row.

The Web layer should keep enough prose to explain why each widget exists. Generated metadata is most useful when it records not only the component name, but the representation, action, domain type, and lowering rule that produced it.

## 4. Web React tooling

The Web React target is implemented by:

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

The normal review sequence is:

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

`lower-web` answers the first question: did the shared obligations become the Web obligations we expected? `plan-scaffold` answers the second question: which files would the React target create or update?

Use `scaffold-react` carefully:

```bash
go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --dry-run \
  --output table
```

A dry run should be the default habit. Once a Web app is promoted, generated code is no longer disposable. The current promoted Web app is:

```text
examples/street-deli-ordering/www/mobile-react/
```

Build it with:

```bash
cd examples/street-deli-ordering/www/mobile-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## 5. Web review principles

Web React review should focus on the path from obligation to implementation. A component exists because a representation or action obligation required a Web realization. Its props should eventually become concrete view-model types. Its Storybook stories should prove the states that matter for that obligation.

For an appointment admin backend, a Web review might ask:

- Does `AppointmentBlock` preserve appointment identity, time range, state, practitioner, service, and client reference?
- Does `SlotPicker` expose selectable slots as action arguments for rescheduling or booking?
- Does `ConflictInspector` make conflicts inspectable and actionable?
- Does `PractitionerColumn` preserve the relationship between practitioner availability and appointments?
- Does Storybook cover booked, available, canceled, late, no-show, conflict, and payment-pending states?

The review should not ask the Web component to invent domain meaning that was absent from Semantic IR. If a component needs appointment state and no such projection exists, the fix belongs upstream.

## 6. The PBUI MetaDesignSystem

PBUI stands for presentation-based UI in this repository. It is a MetaDesignSystem for interfaces where visible objects are typed presentations and actions can operate on those presentations.

The global PBUI package lives here:

```text
sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
sources/dmeta-ir/meta-design-systems/pbui/presentation-types.yaml
sources/dmeta-ir/meta-design-systems/pbui/lowering-rules.yaml
sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
```

PBUI owns abstract presentation types such as:

```text
pbui.presentation_ref
pbui.action_presentation
pbui.inspector_panel
pbui.action_chooser
pbui.lifecycle_status
pbui.composition_presentation
```

These are not Web widgets. They are presentation-system obligations. A `presentation_ref` says there is a typed visible object. An `action_presentation` says an action itself can be visible and selectable. An `inspector_panel` says selected objects can be explained. An `action_chooser` says compatible actions can be surfaced from context.

For an appointment system, PBUI might produce presentations such as:

```text
<Appointment> Tue 10:30 Jane Doe / Maya / Color Consult #apt_102
<Client> Jane Doe #client_22
<Practitioner> Maya #staff_8
<TimeSlot> Tue 14:30-15:15 Room 2 #slot_883
<Action> RESCHEDULE accepts Appointment needs TimeSlot
```

The exact text form above belongs to a concrete profile, but the typed presentation obligation belongs to PBUI.

## 7. Generic PBUI React proof target

The generic PBUI React proof package is:

```text
examples/street-deli-ordering/generated/pbui-react/
```

It proves that abstract PBUI obligations can become buildable React-oriented files: registries, descriptors, metadata, hooks, components, stories, and support modules. It is not the final CLIM app. It is useful because it tests the global PBUI layer without requiring a concrete visual profile.

Use these commands to inspect the generic path:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table

go run ./cmd/dmeta lower-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table

go run ./cmd/dmeta plan-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/generated/pbui-react \
  --output table
```

## 8. Concrete PBUI profiles

Abstract PBUI intentionally avoids concrete look and layout decisions. A concrete PBUI profile supplies those decisions for one presentation system.

For Street Deli, the profile lives here:

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
```

Each file has a distinct responsibility.

`presentation-system.yaml` names the profile and points to the catalogs. `style-profile.yaml` records concrete visual decisions. `surfaces.yaml` defines shell regions. `view-models.yaml` names the app views. `presentation-bindings.yaml` maps abstract PBUI presentation types to concrete renderer components. `targets/react-app.yaml` describes the React app target file kinds.

For another domain, such as appointment management, a concrete PBUI profile might define views such as day schedule, week schedule, client detail, appointment detail, conflicts, waitlist, staff availability, and billing queue. It might bind `pbui.presentation_ref` to a schedule presentation line and `pbui.action_presentation` to a command/action row. Those decisions should live in the profile, not in global PBUI.

## 9. Concrete PBUI/CLIM React tooling

The concrete PBUI profile tooling is implemented by:

```text
pkg/dmeta/metadesign/pbui/profile/
pkg/dmeta/cmds/validate_pbui_profile.go
pkg/dmeta/cmds/instantiate_pbui.go
pkg/dmeta/cmds/plan_pbui_react_app.go
pkg/dmeta/cmds/scaffold_pbui_react_app.go
```

The normal workflow is:

```bash
go run ./cmd/dmeta validate-pbui-profile \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table

go run ./cmd/dmeta instantiate-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output table

go run ./cmd/dmeta plan-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --output table
```

`validate-pbui-profile` checks that the concrete profile is coherent. `instantiate-pbui` applies the profile to abstract PBUI obligations and produces a target-neutral concrete presentation plan. `plan-pbui-react-app` turns that plan into React app files. `scaffold-pbui-react-app` writes those files when requested.

The concrete app is:

```text
examples/street-deli-ordering/www/clim-react/
```

Build it with:

```bash
cd examples/street-deli-ordering/www/clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## 10. Storybook and target review

Storybook is part of target review. It is not part of shared semantics. The shared layers should not know which Storybook files exist.

The Web target uses Storybook to review widgets and promoted components. The PBUI/CLIM target uses Storybook to review shell components, command bars, presentation renderers, action presentations, inspector panels, and app views.

Good Storybook stories show meaningful states. A scheduling `AppointmentBlock` should show states such as booked, checked-in, canceled, no-show, payment pending, conflict, and selected. A PBUI `PresentationRefLine` should show normal, selected, compatible target, incompatible target, and disabled states. Stories that only show the happy path are not enough for a design-system compiler.

## 11. How targets should evolve

When adding target behavior, first identify the layer:

- If the concept is a domain role, add it to Semantic IR.
- If the concept is an action or representation independent of modality, add it to Interaction IR.
- If the concept is a browser widget, add it to Web MetaDesignSystem.
- If the concept is an abstract presentation-system obligation, add it to PBUI.
- If the concept is a concrete shell, view, style, or renderer decision, add it to a PBUI profile.
- If the concept is a file, story, component skeleton, or package artifact, add it to target planning/rendering.

This rule prevents the target layers from becoming semantic dumping grounds. It also prevents the shared layers from becoming overloaded with React-specific or CLIM-specific details.

## 12. Key points

- Web MetaDesignSystem and PBUI MetaDesignSystem are separate target-family layers.
- Shared design language informs targets, but target-specific style and shell decisions belong downstream.
- Web React produces conventional browser UI scaffolds and promoted app components.
- PBUI produces typed presentation-system obligations and can feed both generic proof output and concrete CLIM app output.
- Concrete PBUI profiles are the correct place for app-specific presentation-system style, shell, view, and renderer choices.
- Storybook is a target-owned review surface.
- Generated files should be reviewed through their provenance and promoted intentionally.
