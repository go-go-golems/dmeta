---
Title: DMETA PBUI/CLIM MetaDesignSystem Playbook
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - design-system
  - metadesignsystem
  - pbui
  - clim
  - react
  - storybook
DocType: playbook
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
    Note: Global abstract PBUI MetaDesignSystem package.
  - Path: ../examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
    Note: Concrete Street Deli PBUI presentation-system profile.
  - Path: ../pkg/dmeta/metadesign/pbui
    Note: PBUI lowering, descriptor, generic React planning, and rendering package.
  - Path: ../pkg/dmeta/metadesign/pbui/profile
    Note: Concrete PBUI profile validation, instantiation, and React app planning/rendering package.
  - Path: ../examples/street-deli-ordering/www/clim-react/package.json
    Note: Concrete CLIM React app scaffold.
ExternalSources: []
Summary: Runbook for maintaining the PBUI/CLIM MetaDesignSystem and the concrete CLIM React app target line.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use when editing PBUI presentation types, PBUI lowering rules, a concrete PBUI profile, or the CLIM React app scaffold.
WhenToUse: Use after the shared compiler playbook passes and the desired target is presentation-system/CLIM React.
---

# DMETA PBUI/CLIM MetaDesignSystem Playbook

## Purpose

This playbook covers the **PBUI/CLIM React** target line. This path keeps presentation-based UI explicit. It lowers semantic/interaction obligations into abstract PBUI presentation obligations, instantiates those obligations with a concrete Street Deli CLIM-like presentation profile, and renders a React app scaffold.

```text
Semantic IR
  -> Interaction IR
  -> PBUI MetaDesignSystem obligations
  -> concrete PBUI presentation profile
  -> CLIM React app plan/scaffold
  -> promoted CLIM React app
```

Current Street Deli app output:

```text
examples/street-deli-ordering/www/clim-react/
```

Static CLIM reference prototype:

```text
examples/street-deli-ordering/www/clim/
```

Generic PBUI React proof package:

```text
examples/street-deli-ordering/generated/pbui-react/
```

## What belongs in the PBUI/CLIM path

The PBUI path owns:

- abstract PBUI presentation types;
- PBUI lowering rules from Interaction IR;
- PBUI object and action descriptors;
- generic PBUI React proof scaffold;
- concrete presentation-system profile files;
- concrete CLIM surfaces, views, renderer bindings, and style profile;
- CLIM React app shell and Storybook scaffolding.

It does **not** own:

- Web/mobile widget templates;
- pure Web React component promotion;
- source-of-truth semantic archetype definitions;
- modality-neutral action semantics that should live in Interaction IR.

## Keep these files and packages

```text
sources/dmeta-ir/meta-design-systems/pbui/
examples/street-deli-ordering/meta-design-systems/pbui/
pkg/dmeta/metadesign/pbui/
pkg/dmeta/metadesign/pbui/profile/
pkg/dmeta/cmds/validate_pbui.go
pkg/dmeta/cmds/lower_pbui.go
pkg/dmeta/cmds/plan_pbui_react.go
pkg/dmeta/cmds/scaffold_pbui_react.go
pkg/dmeta/cmds/validate_pbui_profile.go
pkg/dmeta/cmds/instantiate_pbui.go
pkg/dmeta/cmds/plan_pbui_react_app.go
pkg/dmeta/cmds/scaffold_pbui_react_app.go
examples/street-deli-ordering/generated/pbui-react/
examples/street-deli-ordering/www/clim-react/
```

Do not remove the generic PBUI React scaffold during cleanup. It is useful proof output for the abstract PBUI target. Do not remove `www/clim-react`; it is the concrete profile-applied app scaffold.

## Remove or retarget around this path

The duplicate prototype should be removed only after references are retargeted:

```text
examples/street-deli-ordering/prototype-clim/
```

Retarget references from `../../prototype-clim` to `../../www/clim` in:

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
pkg/dmeta/metadesign/pbui/profile/react_app_write.go
```

## PBUI authoring workflow

### 1. Start with shared validation

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1

go run ./cmd/dmeta validate-ir \
  --root ./examples/street-deli-ordering \
  --include-info \
  --output table

go run ./cmd/dmeta validate-interactions \
  --root ./sources/dmeta-ir \
  --include-info \
  --output table
```

### 2. Validate the abstract PBUI MetaDesignSystem

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

If this fails, fix the global PBUI package before editing concrete profile files.

### 3. Lower semantic/interaction obligations into PBUI obligations

```bash
go run ./cmd/dmeta lower-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

Review output for expected presentation types such as presentation refs, action presentations, composition presentations, lifecycle/status presentations, inspector panels, and command affordances.

### 4. Maintain the generic PBUI React proof package

Plan:

```bash
go run ./cmd/dmeta plan-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/generated/pbui-react \
  --output table
```

Dry-run scaffold:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/generated/pbui-react \
  --dry-run \
  --output table
```

Write only when intentionally refreshing the proof package:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/generated/pbui-react \
  --dry-run=false \
  --force \
  --output table
```

### 5. Validate the concrete Street Deli PBUI profile

```bash
go run ./cmd/dmeta validate-pbui-profile \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

Concrete profile files answer questions the abstract PBUI layer must not answer:

| File | Owns |
| --- | --- |
| `presentation-system.yaml` | profile identity and package structure |
| `style-profile.yaml` | exact CLIM look and style classes |
| `surfaces.yaml` | app shell regions and layout surfaces |
| `view-models.yaml` | concrete view data contracts |
| `presentation-bindings.yaml` | mapping PBUI presentation types to renderer components |
| `targets/react-app.yaml` | concrete React app file kinds and output paths |

### 6. Instantiate PBUI with the concrete profile

```bash
go run ./cmd/dmeta instantiate-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output table
```

This is the target-neutral concrete presentation plan. Review it before rendering React app files.

### 7. Plan and scaffold the concrete CLIM React app

Plan:

```bash
go run ./cmd/dmeta plan-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --output table
```

Dry run:

```bash
go run ./cmd/dmeta scaffold-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --dry-run \
  --output table
```

Write only intentionally:

```bash
go run ./cmd/dmeta scaffold-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --force \
  --output table
```

### 8. Build and Storybook-check

```bash
cd examples/street-deli-ordering/www/clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

If `generated/pbui-react` is refreshed, check it too:

```bash
cd examples/street-deli-ordering/generated/pbui-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## CLIM/PBUI review checklist

- Do abstract PBUI presentation types remain concrete-look agnostic?
- Does `lower-pbui` produce obligations for the expected Interaction IR representations/actions?
- Does the concrete profile provide surfaces, view models, bindings, and style classes for all required obligations?
- Does `instantiate-pbui` show the intended concrete views and renderer components?
- Does `plan-pbui-react-app` point at `www/clim-react`, not the generic proof package?
- Does the generated app include Storybook coverage for shell, commands, presentations, action presentations, and views?
- Are CLIM-specific runtime states kept in the profile/app target rather than in shared Interaction IR?
- Did the change avoid breaking the Web React playbook?

## Relationship to Web React

PBUI/CLIM React and Web React are sibling targets over shared semantics.

- PBUI/CLIM React should not absorb mobile card/list widget concerns from the Web path.
- Web React should not absorb CLIM presentation-system runtime concepts.
- Shared semantic or interaction improvements should flow to both target lines through explicit lowering rules.
