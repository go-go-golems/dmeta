---
Title: Repository Cleanup Assessment for Latest PBUI MetaDesignSystem Setup
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
    - dmeta
    - design-system
    - compiler-ir
    - metadesignsystem
    - pbui
    - clim
    - react
DocType: analysis
Intent: long-term
Owners: []
RelatedFiles:
    - Path: cmd/dmeta/main.go
      Note: Needs CLI cleanup if legacy Web commands are removed
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
      Note: Current concrete PBUI profile to keep
    - Path: examples/street-deli-ordering/www/clim-react/package.json
      Note: Current PBUI React app scaffold to keep
    - Path: examples/street-deli-ordering/www/clim/index.html
      Note: Recommended canonical CLIM static prototype to keep
    - Path: examples/street-deli-ordering/www/mobile/index.html
      Note: Recommended canonical mobile static prototype to keep
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_write.go
      Note: Needs prototype font-source update if prototype-clim is removed
    - Path: sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
      Note: Current global PBUI MetaDesignSystem to keep
ExternalSources: []
Summary: Assessment of which dmeta files should be kept, removed, or migrated to retain only the latest PBUI MetaDesignSystem setup plus the two reference prototypes.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use this before deleting old experiments, scaffold outputs, legacy Web MetaDesignSystem paths, and obsolete React/generated artifacts from the dmeta repository.
WhenToUse: Read before performing repository cleanup so the retained PBUI + React architecture remains coherent and reproducible.
---


# Repository Cleanup Assessment for the Latest PBUI MetaDesignSystem Setup

## Purpose

This assessment records what is currently in the `dmeta` repository and which parts should remain if the repository is reduced to the latest PBUI MetaDesignSystem setup. The requested target state is small and explicit:

- keep the two static prototypes for A/B comparison;
- keep the current PBUI MetaDesignSystem implementation;
- keep the current PBUI-driven React app scaffold path;
- remove older experiments, previous generated widget scaffolds, old Web MetaDesignSystem work, and obsolete React prototypes that no longer represent the current direction.

This document does not delete files. It is the cleanup map to use before deletion. It separates files into four categories:

1. **Keep**: required for the current PBUI compiler path or explicitly requested as reference material.
2. **Keep for now, then migrate**: still referenced by current code or docs, but should be moved or simplified during cleanup.
3. **Remove**: old experiments or generated artifacts that should not remain in the cleaned repository.
4. **Regenerate instead of commit**: outputs that are useful for validation but should not be the source of truth.

The main conclusion is that the repository currently contains at least three generations of work:

1. The original static prototypes and old `www` deployment layout.
2. The Web/widget/visual React migration path, including `mobile-react`, generated widgets, Web MetaDesignSystem YAML, and Web React generator code.
3. The current PBUI path, including global PBUI IR, concrete Street Deli PBUI profile, PBUI Go tooling, and `www/clim-react` scaffold.

Only the third generation should remain as active implementation. The two static prototypes should remain as reference/A-B artifacts.

## Current repository surface area

Ignoring `.git`, `node_modules`, `dist`, `storybook-static`, and `.idea`, the major file counts are:

| Area | Count | Main file types |
| --- | ---: | --- |
| `examples/street-deli-ordering` | 309 | YAML, TS/TSX, JS, CSS, HTML, fonts, JSON |
| `sources/dmeta-ir` | 32 | YAML |
| `pkg/dmeta` | 69 | Go, golden JSON |
| `generated` | 7 | generated TypeScript core files |
| `design-docs` | 7 | Markdown |
| `playbooks` | 2 | Markdown |
| `ttmp` | 141 | ticket docs, screenshots, scripts, YAML |

The cleanup should focus on `examples/street-deli-ordering`, `sources/dmeta-ir`, `pkg/dmeta`, `generated`, and top-level docs. The `ttmp` ticket workspace can remain as historical documentation unless the goal is to strip the repository down to runtime/code only.

## Desired final shape

The cleaned repository should make the current architecture obvious from the file tree. A reader should not have to decide whether old generated widgets, old mobile React, old Web MetaDesignSystem, and new PBUI scaffolding are competing active paths.

A good target shape is:

```text
dmeta/
  README.md
  go.mod
  go.sum
  cmd/dmeta/main.go
  pkg/dmeta/
    validator/              # Semantic IR load/validate/inheritance support
    interaction/            # Interaction IR load/validate/elaboration
    metadesign/pbui/         # Current global PBUI MetaDesignSystem compiler
    cmds/                    # Only commands needed by semantic/interaction/PBUI flow
  sources/dmeta-ir/
    core-model/              # Base semantic model, if still used by Street Deli validation
    interactions/            # Interaction IR actions/representations/elaboration rules
    meta-design-systems/pbui/# Global PBUI MetaDesignSystem
  examples/street-deli-ordering/
    00-index.yaml            # Updated to point at PBUI, not Web widgets
    01-core-model.yaml
    core-model/
    meta-design-systems/pbui/
    prototypes/
      mobile/                # static mobile prototype, or keep as www/mobile
      clim/                  # static CLIM prototype, or keep as www/clim
    www/clim-react/          # current PBUI React app scaffold under active work
```

There are two open naming choices:

1. Keep the two prototypes under `examples/street-deli-ordering/www/mobile` and `examples/street-deli-ordering/www/clim`, because `Dockerfile.examples-static` already deploys those paths.
2. Move them to `examples/street-deli-ordering/prototypes/mobile` and `examples/street-deli-ordering/prototypes/clim`, then update references and deployment files.

The lower-risk cleanup is to keep `www/mobile` and `www/clim` as the two canonical prototypes and delete the duplicate `prototype` and `prototype-clim` directories after updating references from the PBUI profile to `../../www/clim`.

## Keep: current PBUI implementation

The following files are the core of the current implementation and should remain.

### Global PBUI IR

Keep:

```text
sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
sources/dmeta-ir/meta-design-systems/pbui/presentation-types.yaml
sources/dmeta-ir/meta-design-systems/pbui/lowering-rules.yaml
sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
```

These files define the global PBUI layer:

- package metadata and file references;
- abstract PBUI presentation types;
- lowering rules from Interaction IR obligations into PBUI obligations;
- generic PBUI React target configuration.

They are active and should be kept.

### Interaction IR

Keep:

```text
sources/dmeta-ir/interactions/00-index.yaml
sources/dmeta-ir/interactions/actions.yaml
sources/dmeta-ir/interactions/representations.yaml
sources/dmeta-ir/interactions/elaboration-rules.yaml
```

PBUI depends on Interaction IR. The PBUI commands validate and load it before lowering.

### Semantic IR support

Keep for now:

```text
sources/dmeta-ir/core-model/
sources/dmeta-ir/01-core-model.yaml
sources/dmeta-ir/00-index.yaml
```

These are needed as the base semantic vocabulary for Street Deli validation and descriptor derivation. The cleanup should eventually update `sources/dmeta-ir/00-index.yaml` so it does not advertise the old Web MetaDesignSystem as an active artifact.

### Street Deli semantic domain package

Keep:

```text
examples/street-deli-ordering/01-core-model.yaml
examples/street-deli-ordering/core-model/archetypes.yaml
examples/street-deli-ordering/core-model/capabilities.yaml
examples/street-deli-ordering/core-model/core-model.yaml
examples/street-deli-ordering/core-model/presentations.yaml
examples/street-deli-ordering/core-model/street-deli-ordering.yaml
```

This is the app's semantic source package. PBUI lowering and concrete profile instantiation start from this semantic model.

### Street Deli concrete PBUI profile

Keep:

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
```

This is the newest local profile and should remain. It is the current answer to the concrete presentation-system problem.

### PBUI Go packages

Keep:

```text
pkg/dmeta/metadesign/pbui/model.go
pkg/dmeta/metadesign/pbui/load.go
pkg/dmeta/metadesign/pbui/validate.go
pkg/dmeta/metadesign/pbui/lower.go
pkg/dmeta/metadesign/pbui/descriptors.go
pkg/dmeta/metadesign/pbui/react_plan.go
pkg/dmeta/metadesign/pbui/react_render.go
pkg/dmeta/metadesign/pbui/react_write.go
pkg/dmeta/metadesign/pbui/*_test.go
pkg/dmeta/metadesign/pbui/testdata/*.golden.json
```

These implement the global PBUI package: loading, validation, lowering, descriptor derivation, generic React planning/rendering/writing, and tests.

Keep:

```text
pkg/dmeta/metadesign/pbui/profile/model.go
pkg/dmeta/metadesign/pbui/profile/load.go
pkg/dmeta/metadesign/pbui/profile/validate.go
pkg/dmeta/metadesign/pbui/profile/instantiate.go
pkg/dmeta/metadesign/pbui/profile/react_app_plan.go
pkg/dmeta/metadesign/pbui/profile/react_app_render.go
pkg/dmeta/metadesign/pbui/profile/react_app_write.go
pkg/dmeta/metadesign/pbui/profile/*_test.go
```

These implement the concrete profile path.

### Current PBUI CLI commands

Keep:

```text
pkg/dmeta/cmds/validate_ir.go
pkg/dmeta/cmds/validate_interactions.go
pkg/dmeta/cmds/elaborate_interactions.go
pkg/dmeta/cmds/validate_pbui.go
pkg/dmeta/cmds/lower_pbui.go
pkg/dmeta/cmds/plan_pbui_react.go
pkg/dmeta/cmds/scaffold_pbui_react.go
pkg/dmeta/cmds/validate_pbui_profile.go
pkg/dmeta/cmds/instantiate_pbui.go
pkg/dmeta/cmds/plan_pbui_react_app.go
pkg/dmeta/cmds/scaffold_pbui_react_app.go
cmd/dmeta/main.go
```

These are the active command surface for semantic validation, interaction elaboration, PBUI lowering, generic PBUI React scaffolding, profile validation, profile instantiation, and concrete app scaffolding.

### Current concrete app scaffold

Keep as active work-in-progress:

```text
examples/street-deli-ordering/www/clim-react/
```

This is the newest React target output. It is a scaffold, but it is the scaffold we are about to work on. Keep it because the user explicitly wants to assess the current situation around the new PBUI + React path.

The app currently contains:

- Vite/React/TypeScript package files;
- Storybook config;
- Berkeley Mono fonts;
- CLIM CSS;
- placeholder runtime modules;
- generated concrete presentation metadata;
- generated fixture/stories/components/views.

It should remain, but its generated nature should be obvious in docs. The next implementation stage should replace placeholders with real runtime behavior.

## Keep: two prototypes for A/B

The user wants to keep two prototypes for A/B comparison. The repository currently has duplicates:

```text
examples/street-deli-ordering/prototype/
examples/street-deli-ordering/prototype-clim/
examples/street-deli-ordering/www/mobile/
examples/street-deli-ordering/www/clim/
```

`www/clim` and `prototype-clim` are identical by `diff -qr`. `www/mobile` and `prototype` differ slightly. The visible difference in `www/mobile/index.html` includes an extra `cust-semantic` element that is not present in `prototype/index.html`, so `www/mobile` appears to be the richer deployed/mobile reference.

Recommended canonical keep set:

```text
examples/street-deli-ordering/www/mobile/
examples/street-deli-ordering/www/clim/
examples/street-deli-ordering/www/index.html
```

Rationale:

- `Dockerfile.examples-static` already expects `www/mobile` and `www/clim`.
- `www/index.html` already links the two prototypes for A/B viewing.
- `www/mobile` appears newer than `prototype`.
- `www/clim` is identical to `prototype-clim` and is already the deployed path.

Recommended cleanup:

- Delete `examples/street-deli-ordering/prototype/` after confirming no unique changes are needed.
- Delete `examples/street-deli-ordering/prototype-clim/` after updating PBUI profile references to `../../www/clim`.

Profile references to update before deleting `prototype-clim`:

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
pkg/dmeta/metadesign/pbui/profile/react_app_write.go
```

`react_app_write.go` currently copies font assets from:

```go
filepath.Join(pkg.Root, "..", "..", "prototype-clim", "fonts", fontName)
```

If `prototype-clim` is removed, this should become:

```go
filepath.Join(pkg.Root, "..", "..", "www", "clim", "fonts", fontName)
```

## Remove: old Web MetaDesignSystem and widget path

The old Web MetaDesignSystem was useful during the hard-cut compiler refactor, but it is not part of the requested final shape if the goal is only PBUI + React. It currently exists in both global and local forms.

Recommended remove:

```text
sources/dmeta-ir/meta-design-systems/web/
examples/street-deli-ordering/meta-design-systems/web/
```

This removes:

- global Web widget catalogs;
- local Street Deli Web widget templates;
- Web lowering rules;
- Web React target config.

Before removing, update index/manifest files that currently reference Web:

```text
sources/dmeta-ir/00-index.yaml
examples/street-deli-ordering/00-index.yaml
examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml
```

The current `examples/street-deli-ordering/00-index.yaml` includes:

```yaml
web_meta_design_system:
  path: ./meta-design-systems/web/meta-design-system.yaml
```

That should be replaced with a PBUI artifact entry or removed if the index is not used by current commands.

## Remove: old Web React generator and commands

The old Web/React generator path is no longer part of the requested current setup. It includes Go packages and commands for Web obligations, instance planning, and scaffold-react output.

Recommended remove after adjusting `cmd/dmeta/main.go`:

```text
pkg/dmeta/metadesign/web/
pkg/dmeta/generator/react/
pkg/dmeta/instance/
pkg/dmeta/cmds/lower_web.go
pkg/dmeta/cmds/plan_instance.go
pkg/dmeta/cmds/plan_scaffold.go
pkg/dmeta/cmds/scaffold_react.go
```

Then remove command registrations from:

```text
cmd/dmeta/main.go
```

Specifically remove registration for:

```text
lower-web
plan-instance
plan-scaffold
scaffold-react
```

Runtime implication: this will intentionally break old Web widget and old React scaffold commands. That is consistent with the cleanup goal.

Potential dependency check:

- `pkg/dmeta/generator/react/plan.go` imports `pkg/dmeta/metadesign/web`.
- `pkg/dmeta/cmds/scaffold_react.go` imports `pkg/dmeta/generator/react`.
- `pkg/dmeta/cmds/plan_scaffold.go` imports `pkg/dmeta/generator/react`.
- Removing these together should keep Go builds coherent.

After removal, run:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
```

## Remove or archive: old promoted mobile React app

Recommended remove if the target is strictly “two prototypes plus PBUI React”:

```text
examples/street-deli-ordering/www/mobile-react/
```

This app belongs to the earlier Web/widget/mobile React migration. It is useful historical work and has good promoted widgets, but it is not the latest PBUI direction. Keeping it makes the repo look as though there are two active React apps:

- `www/mobile-react` — old promoted mobile widget app.
- `www/clim-react` — new PBUI concrete profile app.

If the cleanup goal is clarity, `www/mobile-react` should be removed. If there is concern about losing implementation details, keep it only until its useful data/state/substitution code is ported into `www/clim-react`, then remove it.

Suggested staged approach:

1. Mark `www/mobile-react` as remove-candidate.
2. Before deletion, copy any useful domain data or substitution logic into `www/clim-react/src/data/` or into a shared example data module.
3. Delete `www/mobile-react` once `www/clim-react` has its own real data and runtime.

If deleting immediately, also remove references in old docs or update them to point at the static prototype and new CLIM React app.

## Remove: old generated widget scaffolds

Recommended remove:

```text
examples/street-deli-ordering/generated/widgets/
examples/street-deli-ordering/generated/coffee-counter-widgets/
```

These are old generated Web widget artifacts. They are not part of PBUI. They are also generated outputs, not source-of-truth IR.

The current `mobile-react` app still has comments referencing `generated/widgets`, for example in `src/view-models/types.ts` and component JSDoc. If `mobile-react` is removed, these references go away. If `mobile-react` is kept temporarily, those comments can remain until the app is removed.

## Remove or regenerate: generic PBUI generated scaffold

The generic PBUI generated scaffold is:

```text
examples/street-deli-ordering/generated/pbui-react/
```

This path is newer than the old Web widgets, but it is still generated output. There are two possible policies:

### Policy A: keep it for now

Keep `generated/pbui-react` while PBUI compiler tooling is still being debugged. It provides a committed artifact that shows what the generic PBUI React target emits.

### Policy B: remove it from Git and regenerate on demand

Remove `generated/pbui-react` and rely on:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --dry-run=false \
  --force \
  --output table
```

This policy is cleaner if the goal is to eliminate scaffolds and experiments. It makes `sources/dmeta-ir/meta-design-systems/pbui` and `pkg/dmeta/metadesign/pbui` the source of truth.

Recommended policy for the user's stated goal: **remove `generated/pbui-react` from the final clean repository**, but keep the generator code and tests. The concrete `www/clim-react` app is the active React result; the generic generated package should be reproducible, not committed.

## Remove: coffee-counter instance and generated outputs

Recommended remove:

```text
examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml
examples/street-deli-ordering/generated/coffee-counter-widgets/
```

The coffee counter was useful as an earlier instance/generator exercise. It is not part of the current PBUI Street Deli CLIM path. Keeping it adds extra concepts and stale Web references.

Also remove coffee-counter references from docs if the docs are kept as active instructions.

## Remove or update: old instance manifest fields

The current instance manifests still include Web target data:

```text
examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml
```

For a PBUI-only cleanup, `street-deli-coffee-counter.yaml` should be removed. `street-deli-ordering.yaml` should be simplified to only active roots/targets:

```yaml
schema_version: 0
artifact_type: dmeta_instance
id: street_deli_ordering
name: Street Deli Ordering
summary: Concrete DMETA instantiation for the Hudson Street Deli PBUI CLIM ordering flow.
semantic_root: ..
interactions_root: ../../../sources/dmeta-ir
meta_design_systems:
  pbui:
    root: ../../../sources/dmeta-ir/meta-design-systems/pbui
    profile_root: ../meta-design-systems/pbui
targets:
  pbui_react:
    target_file: ../../../sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
    output_dir: ../generated/pbui-react
    package_name: dmeta-pbui-react
  pbui_react_app:
    target_file: ../meta-design-systems/pbui/targets/react-app.yaml
    output_dir: ../www/clim-react
    package_name: street-deli-clim-react
```

The current commands do not yet consume `profile_root` from the manifest. This is a possible follow-up: either teach `plan-pbui-react-app` and `scaffold-pbui-react-app` to read instance manifests, or keep profile-root CLI flags as the canonical workflow.

## Remove: top-level generated core package

Recommended remove or regenerate-on-demand:

```text
generated/dmeta-core/
```

This appears to be an older generated TypeScript core output. It is not used by current PBUI Go code or `www/clim-react`. If a core TS registry is still needed later, generate it through a current command and place it under the relevant app or package output.

## Remove or archive: old design docs and playbooks

The top-level docs describe earlier states of DMETA, including widget IR and Web MetaDesignSystem work. They are useful historical material but not the clean current setup.

Current docs:

```text
design-docs/*.md
playbooks/*.md
README.md
```

Recommendation:

- If the repository is meant to retain historical design evolution, keep them but add a clear `docs/archive/` split.
- If the repository is meant to show only the current PBUI implementation, move old widget/Web docs to `docs/archive/legacy-web-widget/` or delete them after ensuring the PBUI implementation report remains.
- Keep or create one current README that points to PBUI, not widget IR.

Files that mention old widget/generated paths include:

```text
design-docs/05-dmeta-core-model-and-widget-ir-spec.md
design-docs/04-concrete-dmeta-system-spec.md
```

Those should not remain as primary docs if the repo is PBUI-first.

## Remove: deployment config if prototypes no longer deploy the same way

Current deployment files:

```text
Dockerfile.examples-static
.github/workflows/publish-examples-static.yaml
deploy/gitops-targets.json
```

`Dockerfile.examples-static` currently expects:

```text
examples/street-deli-ordering/www/index.html
examples/street-deli-ordering/www/mobile/index.html
examples/street-deli-ordering/www/clim/index.html
```

If the cleanup keeps `www/mobile` and `www/clim`, this Dockerfile can remain. If prototypes move to `prototypes/mobile` and `prototypes/clim`, update or remove deployment.

Given the user's request to keep two prototypes for A/B, the lower-risk choice is to keep the deployment files and keep the prototypes under `www`.

## Remove: ignored local artifacts

Ignored local artifacts should not be committed and can be deleted from the working tree at any time:

```text
.idea/
**/node_modules/
**/dist/
**/storybook-static/
*.log
*.tsbuildinfo
```

The root `.gitignore` now covers these categories. `examples/street-deli-ordering/www/mobile-react/debug-storybook.log` is ignored and should be deleted during cleanup if `mobile-react` remains temporarily.

## Recommended deletion set

The first cleanup commit should remove the obvious stale artifacts and keep current PBUI tests passing.

Recommended first deletion set:

```text
examples/street-deli-ordering/generated/widgets/
examples/street-deli-ordering/generated/coffee-counter-widgets/
examples/street-deli-ordering/generated/pbui-react/          # optional but recommended for clean source tree
examples/street-deli-ordering/prototype/
examples/street-deli-ordering/prototype-clim/                # after reference updates
examples/street-deli-ordering/www/mobile-react/              # if no longer considered active
examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml
generated/dmeta-core/
```

Recommended second deletion set, after updating command registrations and tests:

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
```

Recommended index/manifest updates:

```text
sources/dmeta-ir/00-index.yaml
examples/street-deli-ordering/00-index.yaml
examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
cmd/dmeta/main.go
Dockerfile.examples-static             # only if prototype paths change
```

## Proposed cleanup sequence

Do not delete everything in one commit. The safest sequence is:

### Commit 1: canonicalize prototypes

1. Decide that `www/mobile` and `www/clim` are canonical.
2. Update PBUI profile references from `../../prototype-clim` to `../../www/clim`.
3. Update `react_app_write.go` font copy source to `www/clim/fonts`.
4. Delete `prototype/` and `prototype-clim/`.
5. Run:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
```

### Commit 2: remove generated and old React outputs

1. Delete old generated Web widget outputs.
2. Delete coffee-counter generated outputs.
3. Delete `generated/pbui-react` if adopting regenerate-on-demand policy.
4. Delete `generated/dmeta-core`.
5. Delete `www/mobile-react` if the team accepts that the static mobile prototype plus new `www/clim-react` are enough.
6. Run Go tests and `www/clim-react` build.

### Commit 3: remove Web MetaDesignSystem code path

1. Delete global/local Web MetaDesignSystem YAML.
2. Delete Web Go package and Web React generator.
3. Delete Web commands and remove their registrations from `cmd/dmeta/main.go`.
4. Simplify instance manifests and indexes.
5. Run:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
```

### Commit 4: refresh docs

1. Replace top-level README with current PBUI-first overview.
2. Move old design docs to archive or remove them.
3. Keep the implementation report and cleanup assessment as current references.
4. Update command examples to PBUI-only workflow.

## What should remain after cleanup

A minimal active repository after cleanup should still support these commands:

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

The remaining app should build:

```bash
cd examples/street-deli-ordering/www/clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

The remaining prototypes should be directly viewable:

```text
examples/street-deli-ordering/www/mobile/index.html
examples/street-deli-ordering/www/clim/index.html
```

## Final recommendation

The cleanup should be decisive. Keep the current PBUI compiler and the concrete `www/clim-react` app scaffold. Keep the two static prototypes under `www/mobile` and `www/clim` for A/B reference. Remove old generated widget outputs, the coffee-counter experiment, the old promoted `mobile-react` app, duplicate prototype directories, old Web MetaDesignSystem YAML, old Web React generator code, and old commands that make the CLI surface look like multiple architectures are still active.

The only caution is ordering. Delete duplicate prototypes only after updating profile references. Delete Web code only after removing command registrations and instance manifest references. Delete generated outputs only after confirming the scaffold commands can recreate what is still useful. If cleanup is done in those stages, the repository will become much easier to assess: Semantic IR, Interaction IR, PBUI, Street Deli PBUI profile, and the current React CLIM app will be the only active path.
