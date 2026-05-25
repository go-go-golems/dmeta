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

## Executive summary

DMETA currently keeps two active MetaDesignSystem target lines:

1. **Web React**: browser/mobile visual widgets and normal React app ergonomics.
2. **PBUI/CLIM React**: presentation-based UI with explicit presentation refs, action presentations, command/selection semantics, and a concrete CLIM-like app profile.

Both target lines consume shared Semantic IR and Interaction IR. Neither target line should redefine the shared domain model.

## Shared design-language role

`source/dmeta-ir/02-design-language.yaml` describes shared dense operational UI guidance: typography, density, spacing, semantic color, borders, interaction states, data attributes, and lintable constraints.

The design-language file is shared guidance, not a universal CSS file.

- Web consumes it as widget/app styling guidance.
- PBUI consumes it through concrete profile/style-profile choices.
- React targets may render CSS, CSS modules, tokens, metadata, or Storybook defaults.

Target-specific details belong downstream:

- mobile card CSS belongs to Web React;
- Berkeley Mono font copying belongs to the concrete PBUI/CLIM app target;
- CLIM command-line footer layout belongs to the PBUI concrete profile;
- Storybook file kinds belong to React targets.

## Web MetaDesignSystem

The Web MetaDesignSystem owns browser-native visual UI obligations.

Global Web package:

```text
sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml
sources/dmeta-ir/meta-design-systems/web/lowering-rules.yaml
```

Street Deli Web package:

```text
examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml
examples/street-deli-ordering/meta-design-systems/web/lowering-rules.yaml
examples/street-deli-ordering/meta-design-systems/web/widgets/*.yaml
```

The Web package owns:

- widget template ids;
- slots;
- visual states;
- event-binding obligations;
- Web-specific lowering rules;
- React target planning inputs.

It does not own:

- abstract semantic archetype definitions;
- modality-neutral Interaction IR actions;
- PBUI presentation types;
- CLIM shell state machines.

### Web React target

The Web React target is implemented by:

```text
pkg/dmeta/metadesign/web/
pkg/dmeta/generator/react/
pkg/dmeta/cmds/lower_web.go
pkg/dmeta/cmds/plan_scaffold.go
pkg/dmeta/cmds/scaffold_react.go
```

It plans and renders:

- component files;
- prop/type files;
- CSS modules;
- metadata sidecars;
- Storybook stories;
- README/context files;
- adapter TODOs where useful.

The promoted Web app is:

```text
examples/street-deli-ordering/www/mobile-react/
```

Generated Web scaffolds are migration aids. Once code is promoted into `www/mobile-react`, do not blindly overwrite it.

### Web command workflow

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

go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --dry-run \
  --output table
```

Write scaffold output only when intentional:

```bash
go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --force \
  --output table
```

### Web review checklist

- Does `lower-web` produce the expected widget obligations?
- Does the React plan point at intended output paths?
- Are generated metadata sidecars accurate?
- Has promoted app code kept useful provenance without depending on deleted scaffolds?
- Does Storybook cover important states?
- Does `www/mobile-react` build?

## PBUI MetaDesignSystem

PBUI is not Web. PBUI is a presentation-system layer inspired by CLIM-style typed presentations and action recognition.

Global PBUI package:

```text
sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
sources/dmeta-ir/meta-design-systems/pbui/presentation-types.yaml
sources/dmeta-ir/meta-design-systems/pbui/lowering-rules.yaml
sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
```

PBUI owns abstract presentation-system obligations such as:

- `pbui.presentation_ref`
- `pbui.action_presentation`
- `pbui.inspector_panel`
- `pbui.action_chooser`
- `pbui.lifecycle_status`
- `pbui.composition_presentation`

It does not own:

- mobile cards;
- table rows;
- CSS tokens;
- concrete shell regions;
- exact app views;
- React component filenames for a concrete product.

### Generic PBUI React proof target

The generic PBUI React proof package is:

```text
examples/street-deli-ordering/generated/pbui-react/
```

It proves the abstract PBUI target can emit buildable TypeScript/React scaffolding, registries, descriptors, metadata, and stories. It is intentionally distinct from the concrete CLIM app.

Generic PBUI commands:

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

## Concrete PBUI/CLIM profile

The concrete profile turns abstract PBUI obligations into one real presentation system.

Street Deli profile files:

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
```

The concrete profile owns:

- visual idiom;
- shell regions;
- command-line placement;
- view list;
- renderer bindings;
- style classes;
- concrete target file kinds;
- relationship to static prototype/reference app.

For Street Deli, the canonical static CLIM reference is:

```text
examples/street-deli-ordering/www/clim/
```

### Concrete PBUI/CLIM React target

The concrete CLIM React app is:

```text
examples/street-deli-ordering/www/clim-react/
```

It is implemented by:

```text
pkg/dmeta/metadesign/pbui/profile/
pkg/dmeta/cmds/validate_pbui_profile.go
pkg/dmeta/cmds/instantiate_pbui.go
pkg/dmeta/cmds/plan_pbui_react_app.go
pkg/dmeta/cmds/scaffold_pbui_react_app.go
```

Workflow:

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

go run ./cmd/dmeta scaffold-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --dry-run \
  --output table
```

## Storybook as review surface

Storybook is target-owned. It is not a shared Semantic IR concept and not an abstract PBUI concept.

Use Storybook to review:

- Web widget states;
- promoted Web components;
- CLIM shell components;
- PBUI presentation components;
- action presentation states;
- command bars and context menus;
- app view fixtures.

Build commands:

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

## Tooling status

Current tooling validates and plans the compiler layers, but not every future invariant is enforced.

Known limitations:

- PBUI lowering rules use relatively simple matching.
- The generic PBUI React package is a proof scaffold, not a polished runtime.
- The concrete CLIM React app is buildable but still has placeholder runtime behavior.
- Older design-doc language may remain in archived docs, but current playbooks and this spec are authoritative.

## Target authoring rule

When a target needs a new UI concept, ask where it belongs:

- If it is a domain meaning, put it in Semantic IR.
- If it is an action or representation independent of modality, put it in Interaction IR.
- If it is a browser widget, put it in Web MetaDesignSystem.
- If it is a presentation-system obligation, put it in PBUI.
- If it is a concrete shell/style/view binding, put it in a concrete PBUI profile.
- If it is a React file kind, Storybook story, or build artifact, put it in the React target.
