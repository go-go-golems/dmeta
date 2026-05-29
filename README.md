# DMETA Long-Term Documentation

This repository contains durable design-system factory documents, IR sources, compiler commands, and Street Deli example targets.

The current setup keeps two active React target lines over shared Semantic IR and Interaction IR:

1. **Web React** — Web MetaDesignSystem -> React target -> `examples/street-deli-ordering/www/mobile-react/`.
2. **PBUI/CLIM React** — PBUI MetaDesignSystem -> concrete PBUI profile -> CLIM React target -> `examples/street-deli-ordering/www/clim-react/`.

The two static A/B prototypes remain under:

- `examples/street-deli-ordering/www/mobile/`
- `examples/street-deli-ordering/www/clim/`

## Current playbooks

- `playbooks/01-dmeta-shared-compiler-playbook.md` — shared Semantic IR, Interaction IR, validation, and cross-target workflow.
- `playbooks/02-dmeta-web-react-metadesignsystem-playbook.md` — Web MetaDesignSystem, Web lowering, React scaffold planning, and `www/mobile-react` workflow.
- `playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md` — PBUI MetaDesignSystem, concrete PBUI profile, generic PBUI proof package, and `www/clim-react` workflow.
- `docs/npm-publishing-playbook.md` — tokenless npm Trusted Publishing workflow for `@go-go-golems/pbui`.

Start with the shared playbook, then run the Web or PBUI playbook depending on the target being changed.

## Design docs

- `design-docs/00-document-map-and-cleanup-plan.md` — current decision matrix for which docs to keep, update, archive, or remove.
- `design-docs/01-design-system-factory-vision-and-scope.md` — overall factory vision and scope.
- `design-docs/02-semantic-archetype-and-capability-model.md` — reusable semantic archetypes, capabilities, projections, and the boundary to Interaction IR representations/actions.
- `design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md` — sober dense operational UI graphic design and UX archetype.
- `design-docs/04-concrete-dmeta-system-spec.md` — current layered compiler system spec.
- `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` — current shared Semantic and Interaction IR spec.
- `design-docs/06-dmeta-design-language-and-tooling-spec.md` — current Web/PBUI MetaDesignSystem target and tooling spec.
- `docs/archive/legacy-widget-ir-v0/07-generated-instance-widget-review-guide.md` — archived generated widget review guide; current review guidance lives in the Web and PBUI playbooks.

## Current semantic model note

The core semantic model uses explicit multi-level inheritance. `Archetype` and `Capability` are abstract roots, every non-root archetype/capability declares `extends`, validators resolve inherited capabilities/projections before checking domain examples, and generated TypeScript exposes `isArchetypeA(...)`, `isCapabilityA(...)`, and effective inherited fields. Treat older flat archetype/capability examples as historical sketches unless they have been updated with `extends`.

## Source IR

Shared sources:

- `sources/dmeta-ir/00-index.yaml` — shared IR package manifest.
- `sources/dmeta-ir/01-core-model.yaml` — split core-model package index.
- `sources/dmeta-ir/02-design-language.yaml` — sober dense operational UI design-language ranges, recipes, states, and lint rules.
- `sources/dmeta-ir/core-model/` — archetypes, capabilities, presentations, and examples.
- `sources/dmeta-ir/interactions/` — shared actions, representations, and elaboration rules.

Target sources:

- `sources/dmeta-ir/meta-design-systems/web/` — global Web MetaDesignSystem.
- `examples/street-deli-ordering/meta-design-systems/web/` — Street Deli Web MetaDesignSystem.
- `sources/dmeta-ir/meta-design-systems/pbui/` — global PBUI MetaDesignSystem.
- `examples/street-deli-ordering/meta-design-systems/pbui/` — Street Deli concrete PBUI/CLIM profile.

## Core commands

Run shared validation first:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1

go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
```

Generate shared TypeScript core registries when needed. `generated/dmeta-core/` is not kept as a committed source-of-truth directory after cleanup; generate it intentionally when a consumer needs it:

```bash
go run ./cmd/dmeta generate-core \
  --root ./sources/dmeta-ir \
  --out ./generated/dmeta-core \
  --dry-run \
  --output table
```

## Web React commands

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

Build the promoted Web app:

```bash
cd examples/street-deli-ordering/www/mobile-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## PBUI/CLIM React commands

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

go run ./cmd/dmeta plan-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --output table
```

Build the concrete CLIM app:

```bash
cd examples/street-deli-ordering/www/clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

## Ticket history

Important ticket workspaces remain under `ttmp/`, especially:

- `ttmp/2026/05/24/DMETA-COMPILER-MDS--*`
- `ttmp/2026/05/24/DMETA-CLIM-MDS--*`
- `ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--*`

Use the current playbooks for operational work; use ticket docs for implementation history and deeper design rationale.
