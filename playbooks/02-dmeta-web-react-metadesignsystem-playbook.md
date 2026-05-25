---
Title: DMETA Web React MetaDesignSystem Playbook
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - design-system
  - metadesignsystem
  - web
  - react
  - widgets
  - storybook
DocType: playbook
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml
    Note: Global Web MetaDesignSystem package to keep.
  - Path: ../examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml
    Note: Street Deli Web MetaDesignSystem package.
  - Path: ../pkg/dmeta/metadesign/web
    Note: Web MetaDesignSystem loader/lowering package.
  - Path: ../pkg/dmeta/generator/react
    Note: React target planner/renderer for Web obligations.
  - Path: ../examples/street-deli-ordering/www/mobile-react/package.json
    Note: Promoted Web/pure React app.
ExternalSources: []
Summary: Runbook for maintaining the Web MetaDesignSystem and the pure/mobile React target line.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use when editing Web lowering rules, Web widget templates, React scaffold planning/rendering, or the promoted mobile React app.
WhenToUse: Use after the shared compiler playbook passes and the desired target is the Web/pure React app.
---

# DMETA Web React MetaDesignSystem Playbook

## Purpose

This playbook covers the **Web React** target line. This path remains active. It is where the pure React/mobile ordering interface is derived from.

```text
Semantic IR
  -> Interaction IR
  -> Web MetaDesignSystem obligations
  -> React target plan/scaffold
  -> promoted Web React app
```

Current Street Deli app output:

```text
examples/street-deli-ordering/www/mobile-react/
```

Static reference prototype:

```text
examples/street-deli-ordering/www/mobile/
```

## What belongs in the Web path

The Web MetaDesignSystem owns visual browser UI concepts:

- widget template catalogs;
- slots and visual states;
- mobile/web layout obligations;
- event-binding obligations;
- React target file planning;
- metadata sidecars for Web React scaffolds;
- Storybook review for promoted Web widgets.

It does **not** own:

- abstract semantic archetype definitions;
- modality-neutral action semantics;
- PBUI presentation types;
- CLIM shell state machines;
- concrete PBUI profile view bindings.

## Keep these files and packages

```text
sources/dmeta-ir/meta-design-systems/web/
examples/street-deli-ordering/meta-design-systems/web/
pkg/dmeta/metadesign/web/
pkg/dmeta/generator/react/
pkg/dmeta/instance/
pkg/dmeta/cmds/lower_web.go
pkg/dmeta/cmds/plan_instance.go
pkg/dmeta/cmds/plan_scaffold.go
pkg/dmeta/cmds/scaffold_react.go
examples/street-deli-ordering/www/mobile-react/
```

Do not remove these during cleanup. The repository intentionally keeps this Web React line alongside the PBUI/CLIM React line.

## Remove or archive around this path

These may be removed after confirming their useful content has been promoted:

```text
examples/street-deli-ordering/generated/widgets/
examples/street-deli-ordering/generated/coffee-counter-widgets/
examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml
```

`generated/widgets` and `generated/coffee-counter-widgets` are scaffold artifacts and experiments. They are not the current source of truth. The source of truth is the Web MetaDesignSystem plus the promoted `www/mobile-react` implementation.

## Web authoring workflow

### 1. Start with shared validation

Run the shared playbook first. At minimum:

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

### 2. Edit the correct Web artifact

| Desired change | Edit |
| --- | --- |
| Global browser/widget vocabulary | `sources/dmeta-ir/meta-design-systems/web/*` |
| Street Deli-specific widget/lowering behavior | `examples/street-deli-ordering/meta-design-systems/web/*` |
| Web obligation loader/lowerer | `pkg/dmeta/metadesign/web/*` |
| React target planning/rendering | `pkg/dmeta/generator/react/*` |
| Promoted app implementation | `examples/street-deli-ordering/www/mobile-react/src/*` |
| Storybook review states | `examples/street-deli-ordering/www/mobile-react/src/**/*.stories.tsx` |

### 3. Lower to Web obligations

```bash
go run ./cmd/dmeta lower-web \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --web-root ./examples/street-deli-ordering/meta-design-systems/web \
  --output table
```

Use this output to verify that the intended semantic/interaction obligations became Web widget obligations. If an obligation is missing, fix the Web lowering rules before editing React.

### 4. Plan React scaffold files

```bash
go run ./cmd/dmeta plan-scaffold \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --target react \
  --output table
```

Review planned file paths and provenance before writing.

### 5. Scaffold only when you mean to overwrite scaffold files

Dry run first:

```bash
go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --dry-run \
  --output table
```

Write only intentionally:

```bash
go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --force \
  --output table
```

Do not blindly overwrite promoted `mobile-react` implementation files. Generated output is a migration aid once a widget/app has been promoted.

### 6. Promote or update the mobile React app

The promoted app lives here:

```text
examples/street-deli-ordering/www/mobile-react/
```

Promotion rules:

- keep the static `www/mobile` prototype as UX reference;
- preserve metadata/provenance where generated files shaped the component;
- convert placeholder props into concrete view-model types;
- keep data/state/substitution logic local or shared intentionally;
- add or update Storybook stories for each promoted widget state;
- avoid direct backend calls inside presentational widgets.

### 7. Build and Storybook-check

```bash
cd examples/street-deli-ordering/www/mobile-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## Web review checklist

- Does `lower-web` show the expected widget-template and event-binding obligations?
- Does the React plan point at the intended output directory?
- Are generated sidecars still accurate after promotion?
- Are static prototype behaviors preserved where they are intended UX ground truth?
- Does Storybook cover default, edge, loading, selected, unavailable, and error-like states?
- Are Web-only details kept out of Semantic IR and Interaction IR?
- Did the change avoid breaking the PBUI/CLIM playbook?

## Relationship to PBUI/CLIM

Web React and PBUI/CLIM React are siblings, not replacements for one another.

- Web React answers: “What is the polished conventional mobile/web React ordering app?”
- PBUI/CLIM React answers: “What is the presentation-system-driven CLIM-like ordering app?”

A shared semantic or interaction change must be validated through both playbooks.
