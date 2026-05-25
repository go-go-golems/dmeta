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

## Executive summary

DMETA is a design-system compiler. It does not start by generating a finished component library. It starts by recording application meaning as source IR, then lowers that meaning through target-specific MetaDesignSystems into concrete UI plans and scaffolds.

The current system has one shared front half and two active target lines:

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

The static reference prototypes are intentionally separate from generated/promoted React apps:

```text
examples/street-deli-ordering/www/mobile/  # canonical mobile static prototype
examples/street-deli-ordering/www/clim/    # canonical CLIM static prototype
```

## Current layer responsibilities

| Layer | Owns | Does not own |
| --- | --- | --- |
| Semantic IR | archetypes, capabilities, presentations/actions as domain meaning, domain examples/mappings | React components, CSS classes, command-line shell behavior |
| Interaction IR | modality-neutral actions, representations, elaboration rules | widget templates, PBUI presentation types, visual style |
| Web MetaDesignSystem | browser/web widgets, slots, visual states, event bindings, Web lowering rules | abstract semantic taxonomy, CLIM runtime states |
| Web React target | React scaffold plan, components, types, CSS modules, metadata, Storybook seeds | domain semantics, PBUI presentation-system concepts |
| PBUI MetaDesignSystem | abstract presentation-system obligations: presentation refs, action presentations, inspectors, action choosers, lifecycle/status presentations | concrete look, concrete shell layout, Web/mobile card widgets |
| Concrete PBUI profile | shell regions, views, style profile, renderer bindings, concrete presentation-system decisions | shared semantic archetypes, shared Interaction IR action definitions |
| PBUI/CLIM React target | CLIM app scaffold, runtime placeholder modules, components, CSS, Storybook stories | abstract PBUI definitions or source domain facts |

The system is intentionally layered so the same appointment, deli, clinic, or workflow domain can feed more than one UI family.

## Source package layout

Current global sources:

```text
sources/dmeta-ir/
  00-index.yaml
  01-core-model.yaml
  02-design-language.yaml
  core-model/
    core-model.yaml
    archetypes.yaml
    capabilities.yaml
    presentations.yaml
    examples/
      agent-workflow.yaml
      retail-logistics.yaml
  interactions/
    00-index.yaml
    actions.yaml
    representations.yaml
    elaboration-rules.yaml
  meta-design-systems/
    web/
      meta-design-system.yaml
      lowering-rules.yaml
    pbui/
      meta-design-system.yaml
      presentation-types.yaml
      lowering-rules.yaml
      targets/react.yaml
```

Street Deli example sources:

```text
examples/street-deli-ordering/
  00-index.yaml
  01-core-model.yaml
  core-model/
  instantiations/street-deli-ordering.yaml
  meta-design-systems/
    web/
      meta-design-system.yaml
      lowering-rules.yaml
      widgets/*.yaml
    pbui/
      presentation-system.yaml
      style-profile.yaml
      surfaces.yaml
      view-models.yaml
      presentation-bindings.yaml
      targets/react-app.yaml
  www/
    mobile/
    clim/
    mobile-react/
    clim-react/
  generated/pbui-react/
```

Removed legacy paths such as `examples/street-deli-ordering/generated/widgets/`, `generated/coffee-counter-widgets/`, duplicate prototype directories, and committed `generated/dmeta-core/` are no longer active system outputs.

## Go package layout

Shared/compiler packages:

```text
pkg/dmeta/validator/          # Semantic IR load/validate/inheritance
pkg/dmeta/interaction/        # Interaction IR load/validate/elaboration
pkg/dmeta/instance/           # instance manifest loading for Web/React planning
pkg/dmeta/generator/core/     # optional TypeScript core registry generation
```

Web target packages:

```text
pkg/dmeta/metadesign/web/     # Web package loading, validation, lowering
pkg/dmeta/generator/react/    # Web React target plan/render/write
```

PBUI target packages:

```text
pkg/dmeta/metadesign/pbui/           # global PBUI load/validate/lower/descriptors/generic React
pkg/dmeta/metadesign/pbui/profile/   # concrete profile load/validate/instantiate/React app target
```

CLI command wrappers live in `pkg/dmeta/cmds/` and are registered from `cmd/dmeta/main.go`.

## Active command surface

Shared commands:

```bash
dmeta validate-ir
dmeta generate-core
dmeta validate-interactions
dmeta elaborate-interactions
```

Web React commands:

```bash
dmeta lower-web
dmeta plan-instance
dmeta plan-scaffold --target react
dmeta scaffold-react
```

PBUI/CLIM commands:

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

## Compiler flow: Web React

```text
Semantic IR
  -> resolved archetypes/capabilities/domain mappings
  -> Interaction IR elaboration
  -> Web lowering rules
  -> Web obligations
  -> React scaffold plan
  -> rendered React files / metadata / stories
  -> promoted mobile React app
```

Primary review commands:

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

The promoted Web app is:

```text
examples/street-deli-ordering/www/mobile-react/
```

It should be reviewed and built as maintained app code, not blindly overwritten by scaffolding.

## Compiler flow: PBUI/CLIM React

PBUI has two related outputs.

First, the generic proof package:

```text
Semantic IR
  -> Interaction IR
  -> PBUI obligations
  -> generic PBUI React target
  -> examples/street-deli-ordering/generated/pbui-react/
```

Second, the concrete app:

```text
Semantic IR
  -> Interaction IR
  -> PBUI obligations
  -> concrete PBUI presentation profile
  -> concrete presentation plan
  -> CLIM React app target
  -> examples/street-deli-ordering/www/clim-react/
```

The concrete profile exists because abstract PBUI should not know about Berkeley Mono, black backgrounds, command-line footer placement, or the exact Street Deli CLIM view set. Those belong to the local profile.

Primary review commands:

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
```

## Generated versus promoted artifacts

DMETA distinguishes generated scaffold output from promoted application code.

- Generated output is reproducible and carries metadata/provenance.
- Promoted output is maintained code that may keep metadata but should not be blindly overwritten.
- Storybook is a review surface, not merely a demo gallery.

Current retained outputs:

```text
examples/street-deli-ordering/generated/pbui-react/   # generic PBUI React proof package
examples/street-deli-ordering/www/mobile-react/       # promoted Web/pure React app
examples/street-deli-ordering/www/clim-react/         # concrete PBUI/CLIM React scaffold/app
```

## Validation baseline

Before committing compiler or IR changes, run the relevant subset of:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1

go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table

go run ./cmd/dmeta lower-web --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --web-root ./examples/street-deli-ordering/meta-design-systems/web --output table
go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output table

go run ./cmd/dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
```

React app validation:

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

## Design rule

When adding a new application family, do not start by copying a React widget. Start by asking:

1. What domain objects exist?
2. Which archetypes and capabilities do they map to?
3. What actions can users take on those objects?
4. Which representations should exist independent of UI modality?
5. Which target line should realize them: Web React, PBUI/CLIM React, or both?

That is the compiler discipline that keeps DMETA reusable.
