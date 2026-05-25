---
Title: Repository Cleanup Assessment for Latest Web React and PBUI MetaDesignSystem Setup
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
      Note: Keep both Web React and PBUI React command registrations
    - Path: examples/street-deli-ordering/generated/pbui-react/package.json
      Note: Generic PBUI React proof package to keep
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
      Note: Current concrete PBUI profile to keep
    - Path: examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml
      Note: Current Street Deli Web MetaDesignSystem to keep
    - Path: examples/street-deli-ordering/www/clim-react/package.json
      Note: Current PBUI React app scaffold to keep
    - Path: examples/street-deli-ordering/www/clim/index.html
      Note: Recommended canonical CLIM static prototype to keep
    - Path: examples/street-deli-ordering/www/mobile-react/package.json
      Note: Current Web/pure React app to keep
    - Path: examples/street-deli-ordering/www/mobile/index.html
      Note: Recommended canonical mobile static prototype to keep
    - Path: pkg/dmeta/generator/react/plan.go
      Note: Current Web React generator package to keep
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_write.go
      Note: Needs prototype font-source update if prototype-clim is removed
    - Path: pkg/dmeta/metadesign/web/load.go
      Note: Current Web MetaDesignSystem Go package to keep
    - Path: sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
      Note: Current global PBUI MetaDesignSystem to keep
    - Path: sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml
      Note: Current global Web MetaDesignSystem to keep
ExternalSources: []
Summary: Assessment of which dmeta files should be kept, removed, or migrated to retain the latest Web React and PBUI React MetaDesignSystem setup plus the two reference prototypes.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use this before deleting old experiments, stale scaffold outputs, duplicate prototypes, and obsolete generated artifacts from the dmeta repository while keeping both Web React and PBUI React paths.
WhenToUse: Read before performing repository cleanup so the retained Web React and PBUI React architectures remain coherent and reproducible.
---



# Repository Cleanup Assessment for the Latest Web React and PBUI MetaDesignSystem Setup

## Purpose

This assessment records what is currently in the `dmeta` repository and which parts should remain if the repository is reduced to the latest two MetaDesignSystem target lines: Web React and PBUI React. The requested target state is small and explicit, with one correction from follow-up review: keep both current MetaDesignSystem branches, not PBUI only. The repository should retain:

- the two static prototypes for A/B comparison;
- the current PBUI MetaDesignSystem implementation and concrete PBUI React app scaffold;
- the current Web MetaDesignSystem implementation and the pure/mobile React app derived from it;
- remove older experiments, duplicate prototype directories, obsolete generated widget scaffolds, coffee-counter experiments, and stale generated artifacts that are not part of either current Web React or current PBUI React.

This document does not delete files. It is the cleanup map to use before deletion. It separates files into four categories:

1. **Keep**: required for the current Web React or PBUI compiler paths, or explicitly requested as reference material.
2. **Keep for now, then migrate**: still referenced by current code or docs, but should be moved or simplified during cleanup.
3. **Remove**: old experiments or generated artifacts that should not remain in the cleaned repository.
4. **Regenerate instead of commit**: outputs that are useful for validation but should not be the source of truth.

The main conclusion is that the repository currently contains at least three generations of work:

1. The original static prototypes and old `www` deployment layout.
2. The Web/widget/visual React migration path, including `mobile-react`, generated Web React planning/scaffolding, and Web MetaDesignSystem YAML.
3. The current PBUI path, including global PBUI IR, concrete Street Deli PBUI profile, PBUI Go tooling, and `www/clim-react` scaffold.

The active implementation should keep both generation 2 and generation 3 where they represent the latest two target lines: Web React and PBUI React. Older generated widget experiments, duplicate prototypes, coffee-counter artifacts, and one-off scaffold outputs can still be removed.

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

The cleaned repository should make the current architecture obvious from the file tree. A reader should be able to see that there are intentionally two active React target lines--Web React and PBUI React--and should not confuse them with old generated widget experiments, duplicate prototypes, or stale scaffold outputs.

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
    metadesign/web/          # Current Web MetaDesignSystem compiler path
    generator/react/         # Current pure/Web React planner/renderer/writer
    metadesign/pbui/         # Current global PBUI MetaDesignSystem compiler
    cmds/                    # Commands needed by semantic/interaction/Web/PBUI flows
  sources/dmeta-ir/
    core-model/              # Base semantic model, if still used by Street Deli validation
    interactions/            # Interaction IR actions/representations/elaboration rules
    meta-design-systems/web/ # Global Web MetaDesignSystem
    meta-design-systems/pbui/# Global PBUI MetaDesignSystem
  examples/street-deli-ordering/
    00-index.yaml            # Updated to point at both Web and PBUI current systems
    01-core-model.yaml
    core-model/
    meta-design-systems/web/
    meta-design-systems/pbui/
    prototypes/
      mobile/                # static mobile prototype, or keep as www/mobile
      clim/                  # static CLIM prototype, or keep as www/clim
    www/mobile-react/        # current Web/pure React app derived from Web MetaDesignSystem direction
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

These are needed as the base semantic vocabulary for Street Deli validation and descriptor derivation. The cleanup should keep `sources/dmeta-ir/00-index.yaml` aligned with both active downstream systems: Web and PBUI.

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

This is the newest PBUI React app target output. It is a scaffold, but it is the scaffold we are about to work on. Keep it because the user explicitly wants to assess the current situation around the new PBUI React path.

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

## Keep: current Web MetaDesignSystem and pure React path

Correction: the Web MetaDesignSystem should be kept. It is still the source of the pure/Web React target line, including the promoted `mobile-react` app. The cleanup target is not PBUI-only; it should retain the last two active target lines:

1. **Web React**: the visual Web MetaDesignSystem path that supports the pure/mobile React implementation.
2. **PBUI React**: the presentation-based UI path that supports the concrete CLIM React scaffold.

Keep:

```text
sources/dmeta-ir/meta-design-systems/web/
examples/street-deli-ordering/meta-design-systems/web/
pkg/dmeta/metadesign/web/
pkg/dmeta/generator/react/
pkg/dmeta/cmds/lower_web.go
pkg/dmeta/cmds/plan_scaffold.go
pkg/dmeta/cmds/scaffold_react.go
```

Also keep the Web-related references in:

```text
sources/dmeta-ir/00-index.yaml
examples/street-deli-ordering/00-index.yaml
examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
cmd/dmeta/main.go
```

The cleanup should still remove stale generated widget outputs and the coffee-counter experiment, but it should not remove the Web MetaDesignSystem itself or the pure React app it supports.

## Keep: Web React generator and commands

Because the Web MetaDesignSystem remains active, the Web React generator and commands should also remain active. They are the current path from Web obligations to pure React scaffold/promotion work. Keep:

```text
pkg/dmeta/metadesign/web/
pkg/dmeta/generator/react/
pkg/dmeta/instance/
pkg/dmeta/cmds/lower_web.go
pkg/dmeta/cmds/plan_instance.go
pkg/dmeta/cmds/plan_scaffold.go
pkg/dmeta/cmds/scaffold_react.go
```

Keep command registrations in `cmd/dmeta/main.go` for:

```text
lower-web
plan-instance
plan-scaffold
scaffold-react
```

The cleanup should instead focus on generated outputs that are no longer source-of-truth, duplicate prototypes, and obsolete experiment directories.

## Keep: promoted Web/mobile React app

Correction: keep the promoted mobile React app. It is the current pure/Web React result and remains useful alongside the PBUI React result. The two active React outputs are:

- `examples/street-deli-ordering/www/mobile-react/` — the Web/pure React app derived from the Web MetaDesignSystem and mobile prototype direction.
- `examples/street-deli-ordering/www/clim-react/` — the PBUI concrete CLIM React app scaffold.

This means the repository intentionally has two active React apps. That is acceptable because they answer different assessment questions:

- `mobile-react` shows the conventional visual React/mobile ordering interface.
- `clim-react` shows the PBUI/CLIM presentation-system interface.

The cleanup should keep `mobile-react`, its Storybook setup, and its package files. The cleanup can still remove old generated widget scaffolds that originally informed it, as long as any useful implementation has already been promoted into `mobile-react`.

## Remove: old generated widget scaffolds

Recommended remove:

```text
examples/street-deli-ordering/generated/widgets/
examples/street-deli-ordering/generated/coffee-counter-widgets/
```

These are older generated Web widget artifacts. They may have informed the promoted `mobile-react` implementation, but they are not the current source of truth. The current source path is the Web MetaDesignSystem plus Web React generator/promotion flow.

The current `mobile-react` app still has comments referencing `generated/widgets`, for example in `src/view-models/types.ts` and component JSDoc. Since `mobile-react` is now a keep item, those comments should eventually be rewritten as provenance notes that point to the Web MetaDesignSystem rather than to deleted generated scaffolds.

## Keep: generic PBUI React generated scaffold

The generic PBUI React generated scaffold is:

```text
examples/street-deli-ordering/generated/pbui-react/
```

Correction: keep this path for now. The requested cleanup keeps the last two React target lines: Web React and PBUI React. `generated/pbui-react` is the generic PBUI React proof package, while `www/clim-react` is the concrete profile-applied PBUI/CLIM app scaffold. They serve different review purposes:

- `generated/pbui-react` shows what the abstract PBUI target can emit directly from PBUI obligations.
- `www/clim-react` shows what a concrete Street Deli PBUI presentation profile emits as an app-shaped CLIM interface.

Keep the generator command as well:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --dry-run=false \
  --force \
  --output table
```

This path can still be regenerated for validation, but it should not be deleted as part of this cleanup because it is one of the two retained React target lines.

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

For the current Web React + PBUI React cleanup, `street-deli-coffee-counter.yaml` should be removed. `street-deli-ordering.yaml` should be simplified to only active roots/targets and should keep both Web and PBUI entries:

```yaml
schema_version: 0
artifact_type: dmeta_instance
id: street_deli_ordering
name: Street Deli Ordering
summary: Concrete DMETA instantiation for the Hudson Street Deli PBUI CLIM ordering flow.
semantic_root: ..
interactions_root: ../../../sources/dmeta-ir
meta_design_systems:
  web:
    root: ../meta-design-systems/web
  pbui:
    root: ../../../sources/dmeta-ir/meta-design-systems/pbui
    profile_root: ../meta-design-systems/pbui
targets:
  react:
    target_file: ../meta-design-systems/web/targets/react.yaml
    output_dir: ../www/mobile-react
    package_name: street-deli-mobile-react
  pbui_react:
    target_file: ../../../sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
    output_dir: ../generated/pbui-react
    package_name: dmeta-pbui-react
  pbui_react_app:
    target_file: ../meta-design-systems/pbui/targets/react-app.yaml
    output_dir: ../www/clim-react
    package_name: street-deli-clim-react
```

The current PBUI app commands do not yet consume `profile_root` from the manifest. This is a possible follow-up: either teach `plan-pbui-react-app` and `scaffold-pbui-react-app` to read instance manifests, or keep profile-root CLI flags as the canonical workflow. The Web React commands should keep using their existing manifest/target inputs.

## Remove: top-level generated core package

Recommended remove or regenerate-on-demand:

```text
generated/dmeta-core/
```

This appears to be an older generated TypeScript core output. It is not used by current PBUI Go code or `www/clim-react`. If a core TS registry is still needed later, generate it through a current command and place it under the relevant app or package output.

## Remove or archive: old design docs and playbooks

The top-level docs describe earlier states of DMETA, including widget IR, Web MetaDesignSystem work, and PBUI work. They are useful historical material, but the primary docs should clearly distinguish current Web React, current PBUI React, and archived experiments.

Current docs:

```text
design-docs/*.md
playbooks/*.md
README.md
```

Recommendation:

- If the repository is meant to retain historical design evolution, keep them but add a clear `docs/archive/` split.
- If the repository is meant to show only the current active implementation, move old one-off widget experiments to `docs/archive/legacy-widget-experiments/`, but keep Web MetaDesignSystem documentation that explains the current pure React path.
- Keep or create one current README that points to both Web React and PBUI React, not only one of them.

Files that mention old widget/generated paths include:

```text
design-docs/05-dmeta-core-model-and-widget-ir-spec.md
design-docs/04-concrete-dmeta-system-spec.md
```

Those should not remain as primary docs unless they are updated to describe the current Web MetaDesignSystem path accurately.

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

The root `.gitignore` now covers these categories. `examples/street-deli-ordering/www/mobile-react/debug-storybook.log` is ignored and should be deleted during cleanup, while the `mobile-react` source tree itself should remain.

## Recommended deletion set

The first cleanup commit should remove the obvious stale artifacts while keeping current Web React and PBUI tests passing.

Recommended first deletion set:

```text
examples/street-deli-ordering/generated/widgets/
examples/street-deli-ordering/generated/coffee-counter-widgets/
examples/street-deli-ordering/prototype/
examples/street-deli-ordering/prototype-clim/                # after reference updates
examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml
generated/dmeta-core/
```

Do **not** delete the Web MetaDesignSystem or Web React generator path. The previous recommendation to remove these files is superseded. Keep:

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

### Commit 2: remove generated outputs while keeping both React apps

1. Delete old generated Web widget outputs.
2. Delete coffee-counter generated outputs.
3. Keep `generated/pbui-react` as the generic PBUI React proof package.
4. Delete `generated/dmeta-core`.
5. Keep `www/mobile-react` as the active Web/pure React app.
6. Run Go tests plus both `www/mobile-react` and `www/clim-react` builds.

### Commit 3: prune stale generated artifacts while keeping Web and PBUI code paths

1. Keep global/local Web MetaDesignSystem YAML.
2. Keep Web Go package, instance package, and Web React generator.
3. Keep Web commands and their registrations in `cmd/dmeta/main.go`.
4. Remove only stale generated artifacts and experiments not used by either current React path.
5. Run:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta lower-web --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --web-root ./examples/street-deli-ordering/meta-design-systems/web --output table
go run ./cmd/dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table
```

### Commit 4: refresh docs

1. Replace top-level README with a current two-path overview: Web React and PBUI React.
2. Move old experiment docs to archive or remove them.
3. Keep the implementation report and cleanup assessment as current references.
4. Update command examples to include both Web React and PBUI React workflows.

## What should remain after cleanup

A minimal active repository after cleanup should still support these commands for both Web React and PBUI React:

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

go run ./cmd/dmeta lower-web \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --web-root ./examples/street-deli-ordering/meta-design-systems/web \
  --output table

go run ./cmd/dmeta plan-scaffold \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
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

Both remaining React apps should build:

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

The remaining prototypes should be directly viewable:

```text
examples/street-deli-ordering/www/mobile/index.html
examples/street-deli-ordering/www/clim/index.html
```

## Final recommendation

The cleanup should be decisive. Keep both current compiler/result lines: Web MetaDesignSystem plus `www/mobile-react`, and PBUI MetaDesignSystem plus `www/clim-react`. Keep the two static prototypes under `www/mobile` and `www/clim` for A/B reference. Remove old generated widget outputs, the coffee-counter experiment, duplicate prototype directories, stale generated scaffold outputs other than the retained PBUI React proof package, and old documents/artifacts that make obsolete experiments look active.

The only caution is ordering. Delete duplicate prototypes only after updating profile references. Do not delete Web code, because it remains the source of the pure React path. Delete generated outputs only after confirming they are not part of the retained Web React or PBUI React lines. If cleanup is done in those stages, the repository will become much easier to assess: Semantic IR, Interaction IR, Web MetaDesignSystem, PBUI, Street Deli PBUI profile, mobile React, and the current React CLIM app will be the active paths.
