---
Title: DMETA Shared Compiler Playbook
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - design-system
  - compiler-ir
  - metadesignsystem
  - semantic-ir
  - interaction-ir
  - code-generation
DocType: playbook
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../sources/dmeta-ir/00-index.yaml
    Note: Shared source package index for Semantic IR, design language, Web, and PBUI roots.
  - Path: ../sources/dmeta-ir/01-core-model.yaml
    Note: Shared semantic package index consumed by both Web and PBUI target lines.
  - Path: ../sources/dmeta-ir/interactions/00-index.yaml
    Note: Shared Interaction IR package index used before target-specific lowering.
  - Path: ../pkg/dmeta/validator/findings.go
    Note: Shared validation finding shape used by compiler commands.
  - Path: ../pkg/dmeta/interaction
    Note: Shared Interaction IR loading, validation, and elaboration package.
ExternalSources: []
Summary: Shared runbook for maintaining the common DMETA compiler layers before choosing Web React or PBUI/CLIM React as the target.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use when editing semantic archetypes, capabilities, presentations, domain mappings, Interaction IR actions/representations, or shared compiler validation.
WhenToUse: Start here before running the Web React or PBUI/CLIM React playbooks.
---

# DMETA Shared Compiler Playbook

## Purpose

This playbook covers the shared DMETA layers that feed both active target lines:

1. **Web React**: Semantic IR -> Interaction IR -> Web MetaDesignSystem -> React scaffold/promotion -> `examples/street-deli-ordering/www/mobile-react/`.
2. **PBUI/CLIM React**: Semantic IR -> Interaction IR -> PBUI MetaDesignSystem -> concrete PBUI profile -> CLIM React app -> `examples/street-deli-ordering/www/clim-react/`.

Use this playbook before editing target-specific Web or CLIM artifacts. The shared layers are not visual components. They define the domain facts, reusable operational semantics, interaction obligations, and validation rules that downstream MetaDesignSystems consume.

## Current shared layer model

```text
Application/domain package
  -> Semantic IR
     - archetypes
     - capabilities
     - presentations/actions
     - domain examples and mappings
  -> Interaction IR
     - actions
     - representations
     - elaboration rules
  -> target-specific MetaDesignSystem
     - Web React path
     - PBUI/CLIM React path
```

The important rule is separation of responsibility:

| Layer | Owns | Must not own |
| --- | --- | --- |
| Semantic IR | reusable domain meaning, archetypes, capabilities, projection obligations | React components, CLIM shell behavior, CSS files |
| Interaction IR | modality-neutral actions and representations | widget templates, concrete renderer components, Berkeley Mono, mobile layout |
| MetaDesignSystem | target-specific lowering vocabulary | source-of-truth domain semantics |
| Target app | promoted runtime code and manually refined UX | generic semantic taxonomy decisions |

## Shared source files to keep current

```text
sources/dmeta-ir/00-index.yaml
sources/dmeta-ir/01-core-model.yaml
sources/dmeta-ir/02-design-language.yaml
sources/dmeta-ir/core-model/core-model.yaml
sources/dmeta-ir/core-model/archetypes.yaml
sources/dmeta-ir/core-model/capabilities.yaml
sources/dmeta-ir/core-model/presentations.yaml
sources/dmeta-ir/core-model/examples/*.yaml
sources/dmeta-ir/interactions/00-index.yaml
sources/dmeta-ir/interactions/actions.yaml
sources/dmeta-ir/interactions/representations.yaml
sources/dmeta-ir/interactions/elaboration-rules.yaml
examples/street-deli-ordering/00-index.yaml
examples/street-deli-ordering/01-core-model.yaml
examples/street-deli-ordering/core-model/*.yaml
examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
```

## Authoring rules

### Semantic IR

- Keep `Archetype` and `Capability` as abstract roots.
- Every non-root archetype and capability must declare `extends`.
- Mark taxonomy/helper nodes with `abstract: true` when domain mappings must not target them directly.
- Domain types should map to concrete archetypes/capabilities, not abstract helper parents.
- Required projections inherited from capabilities must be mapped by domain examples.
- Presentations are display contracts, not React components.
- Actions are typed semantic operations, not UI event handlers.

### Interaction IR

- Add interaction actions only when they are modality-neutral enough for both Web and PBUI to reason about.
- Add representations when there is a meaningful semantic thing a user can see, select, inspect, copy, filter by, or act on.
- Use elaboration rules to make implicit consequences explicit. Do not hide target-specific behavior in semantic examples.
- Keep action names stable; downstream Web/PBUI lowering rules depend on them.

### Design-language IR

`02-design-language.yaml` remains a shared source of dense operational design constraints. Concrete target lines may consume it differently:

- Web React uses visual widget/layout constraints and promoted CSS/module styling.
- PBUI/CLIM React uses a concrete PBUI style profile and CLIM shell styling.

Do not put Berkeley Mono font copying, CLIM runtime states, or mobile widget file names into the shared design-language file.

## Shared validation sequence

Run from repo root:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1

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

If shared validation fails, do not continue into Web or PBUI target passes. Fix the shared semantics first.

## Shared change workflow

1. Identify whether the change is semantic, interaction-level, Web-specific, or PBUI-specific.
2. If semantic, edit the shared core-model files or the Street Deli semantic package.
3. If interaction-level, edit `sources/dmeta-ir/interactions/*`.
4. Run the shared validation sequence.
5. Run both target playbooks far enough to prove neither target line broke.
6. Update any affected design docs or the document map.
7. Commit shared changes separately from target-specific scaffolding when possible.

## Cross-target compatibility checklist

Before merging a shared change, answer:

- Does Web lowering still produce the expected widget obligations?
- Does PBUI lowering still produce expected presentation obligations?
- Did any action or representation id change?
- Did any domain mapping start targeting an abstract archetype/capability?
- Did a presentation move from shared semantics into a target layer or vice versa?
- Do both `mobile-react` and `clim-react` still build if their generated/promoted artifacts were touched?

## Handoff to target playbooks

After this playbook passes:

- use `02-dmeta-web-react-metadesignsystem-playbook.md` for the pure Web/mobile React path;
- use `03-dmeta-pbui-clim-metadesignsystem-playbook.md` for the PBUI/CLIM React path.
