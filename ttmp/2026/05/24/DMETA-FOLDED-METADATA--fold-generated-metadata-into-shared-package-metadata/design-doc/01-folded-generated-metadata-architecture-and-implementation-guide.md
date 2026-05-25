---
Title: Folded Generated Metadata Architecture and Implementation Guide
Ticket: DMETA-FOLDED-METADATA
Status: active
Topics:
    - dmeta
    - code-generation
    - react
    - pbui
    - metadesignsystem
    - documentation
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: examples/street-deli-ordering/www/clim-react/src/generated/concretePresentationPlan.metadata.json
      Note: |-
        Current committed concrete target metadata sidecar; candidate home for folded package-level metadata.
        Current committed metadata sidecar showing repeated package-level metadata
    - Path: pkg/dmeta/generator/metadata/model.go
      Note: |-
        Current shared generated metadata envelope that should be split into package-level and file-level forms.
        Current full metadata envelope to split into package and file fragment metadata
    - Path: pkg/dmeta/generator/metadata/render.go
      Note: |-
        Current TypeScript/JSON render helpers to extend with folded metadata output.
        Current full TypeScript prelude renderer to extend with folded render helpers
    - Path: pkg/dmeta/generator/react/render.go
      Note: |-
        Web React renderer that emits repeated metadata into promotable widget scaffold files.
        Web React renderer whose promotable scaffold files should use folded metadata
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_render.go
      Note: |-
        Concrete PBUI/CLIM React app renderer that emits repeated metadata into promotable app files.
        Concrete PBUI/CLIM React renderer whose committed promotable files should use folded metadata
    - Path: pkg/dmeta/metadesign/pbui/react_render.go
      Note: Generic PBUI React renderer; useful reference, but lower priority because its output is ignored/regenerable.
ExternalSources: []
Summary: Design for folding repeated generated metadata in promotable React target files into shared package-level metadata plus small file-local metadata.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use when implementing metadata folding for promotable generated React files so LLMs see context without rereading the same large object in every file.
WhenToUse: Before changing generated metadata renderers, metadata schemas, Web React scaffold output, or concrete PBUI/CLIM React app output.
---


# Folded Generated Metadata Architecture and Implementation Guide

## Executive summary

DMETA now emits rich generated metadata into TypeScript and TSX files. That was the correct first step: every generated file can explain where it came from, what command produced it, which source roots matter, what Semantic IR or PBUI concepts it realizes, and how a promoted file should be edited. The problem is that the same large metadata object is repeated in many files. In a React package with dozens of generated files, an LLM reading the repository sees the same command, source roots, pipeline, source-reference prose, profile guidance, and promotion instructions over and over.

This ticket designs a folded metadata layout for promotable target files. The central idea is simple: move package-level facts into one generated module and leave each promotable file with only the facts that are specific to that file. The file still exports `dmetaGeneratedMetadata`, but it builds that object by importing shared package metadata and combining it with a small file-local fragment.

The design is mostly relevant for promotable React target files: Web React widget scaffolds and the concrete PBUI/CLIM React app. Generic ignored proof output can adopt the same pattern later, but it is not the primary driver because it is not meant to be read and edited as maintained application code.

## 1. The problem this ticket solves

The previous ticket, `DMETA-GENERATED-METADATA`, made metadata explicit. It added a shared `GeneratedFileMetadata` schema and renderer support so generated TypeScript files can export metadata like this:

```ts
export const dmetaGeneratedMetadata = {
  schemaVersion: 1,
  generated: {
    at: "2026-05-25T03:34:10Z",
    by: "dmeta scaffold-pbui-react-app",
    command: "...long command...",
    workingDirectory: "/home/manuel/code/wesen/go-go-golems/dmeta",
    gitCommit: "450d078..."
  },
  artifact: {
    path: "examples/street-deli-ordering/www/clim-react/src/views/MenuView.tsx",
    kind: "view_component",
    language: "tsx",
    symbol: "MenuView",
    promotable: true
  },
  pipeline: {
    semanticRoot: "./examples/street-deli-ordering",
    interactionsRoot: "./sources/dmeta-ir",
    metaDesignSystem: "pbui",
    profileRoot: "./examples/street-deli-ordering/meta-design-systems/pbui",
    target: "react_app",
    passes: ["semantic-ir", "interaction-elaboration", "pbui-lowering", "pbui-presentation-profile-instantiation", "pbui-react-app-planning"]
  },
  sources: [...],
  pbui: {...},
  react: {...},
  guidance: {...},
  promotion: {...}
} as const;
```

This is useful, but in the committed CLIM React app, most of the object is identical in every file. The `generated`, `pipeline`, `sources`, high-level `guidance`, React package name, and common promotion instructions repeat. The only facts that usually change are:

- the artifact path, kind, symbol, language, and promotable flag;
- for PBUI/CLIM files, the view id, presentation type, surface id, or component binding;
- for Web React files, the widget template id, slots, visual states, event bindings, and source rules;
- the file-specific promotion changelog, if a scaffold is promoted and edited.

Repeated metadata has three costs:

1. **LLM reading cost.** A model consumes context reading the same package facts in every file before reaching the code that matters.
2. **Human review cost.** Diffs become noisy because regenerating a package can change the same timestamp or command in many files.
3. **Maintenance cost.** If common metadata text changes, every generated target file changes even when no file-specific semantics changed.

The goal of folded metadata is to keep metadata visible and parseable without forcing every file to carry a full copy of the package context.

## 2. Definitions

This design uses four metadata levels.

| Level | Meaning | Example owner | Should it repeat in every file? |
|---|---|---|---|
| Package metadata | Facts common to a generated package or target tree. | `src/generated/dmetaPackageMetadata.ts` | No. |
| File metadata | Facts specific to one file. | `MenuView.tsx` | Yes. |
| Effective metadata | The result of merging package metadata and file metadata. | `dmetaGeneratedMetadata` export | Yes, but produced by a helper/import, not repeated literally. |
| Promotion metadata | Instructions and changelog for a promotable file. | File-local block or object | Yes, because it changes as the file is edited. |

The distinction matters because not all metadata has the same lifecycle. Package metadata is regenerated with the package. File metadata is regenerated with the file. Promotion metadata may become human-maintained after the file is promoted.

## 3. Target scope

The first implementation should focus on promotable target files.

### In scope

- Web React generated scaffold files under the Web React target path.
- Concrete PBUI/CLIM React app files under `examples/street-deli-ordering/www/clim-react/`.
- TypeScript and TSX files that currently export a full `dmetaGeneratedMetadata` object.
- JSON sidecars that describe the target package or concrete plan.
- Promotion guidance and changelog placement for files that are intended to become maintained source.

### Lower priority

- Generic PBUI proof output under `examples/street-deli-ordering/generated/pbui-react/`.
- Non-promotable package files such as `package.json`, `tsconfig.json`, and `index.html`.
- CSS files, except for a short header pointing to the shared metadata module.

The generic PBUI proof output can use the same infrastructure later, but it is ignored/regenerable. The immediate pain is in committed promotable code where humans and LLMs will read many files.

## 4. Current architecture

The metadata system currently has one envelope type:

```go
// pkg/dmeta/generator/metadata/model.go
type GeneratedFileMetadata struct {
    SchemaVersion int               `json:"schemaVersion"`
    Generated     GeneratedInfo     `json:"generated"`
    Artifact      ArtifactInfo      `json:"artifact"`
    Pipeline      PipelineInfo      `json:"pipeline"`
    Sources       []SourceReference `json:"sources,omitempty"`
    Semantics     *SemanticGuidance `json:"semantics,omitempty"`
    Web           *WebGuidance      `json:"web,omitempty"`
    PBUI          *PBUIGuidance     `json:"pbui,omitempty"`
    React         *ReactGuidance    `json:"react,omitempty"`
    Guidance      *HumanGuidance    `json:"guidance,omitempty"`
    Promotion     *PromotionInfo    `json:"promotion,omitempty"`
}
```

Renderers call `RenderTypeScriptPrelude(meta)` and get:

1. a generated header;
2. a full `export const dmetaGeneratedMetadata = {...} as const;` object;
3. a promotion comment.

The Web React renderer builds metadata in `webGeneratedMetadata`:

```go
// pkg/dmeta/generator/react/render.go
func webGeneratedMetadata(plan ScaffoldPlan, component ComponentPlan, file PlannedFile) genmeta.GeneratedFileMetadata
```

The concrete PBUI/CLIM app renderer builds metadata in `reactAppGeneratedMetadata`:

```go
// pkg/dmeta/metadesign/pbui/profile/react_app_render.go
func reactAppGeneratedMetadata(plan ReactAppPlan, file ReactAppPlannedFile) genmeta.GeneratedFileMetadata
```

Both functions create a complete envelope for every file. That is why the output repeats.

## 5. Proposed architecture: folded metadata

Folded metadata splits the current single envelope into three generated artifacts:

```text
src/generated/dmetaPackageMetadata.ts
  shared package-level metadata

src/generated/dmetaMetadata.ts
  merge helper and types for effective metadata

any promotable file, for example src/views/MenuView.tsx
  imports shared package metadata
  defines small file-local metadata
  exports effective dmetaGeneratedMetadata
```

The generated file should look like this:

```ts
import {
  dmetaPackageMetadata,
  defineDmetaGeneratedMetadata,
} from '../generated/dmetaMetadata';

export const dmetaGeneratedMetadata = defineDmetaGeneratedMetadata(
  dmetaPackageMetadata,
  {
    artifact: {
      path: 'src/views/MenuView.tsx',
      kind: 'view_component',
      language: 'tsx',
      symbol: 'MenuView',
      promotable: true,
    },
    pbui: {
      viewId: 'menu',
      surfaceId: 'view',
      bindingComponent: 'MenuView',
    },
    promotion: {
      promotable: true,
      status: 'scaffold',
      changelog: [
        '2026-05-25T03:34:10Z: Generated by dmeta scaffold-pbui-react-app. Initial scaffold.',
      ],
    },
  },
);
```

The shared package module should look like this:

```ts
export const dmetaPackageMetadata = {
  schemaVersion: 1,
  generated: {
    at: '2026-05-25T03:34:10Z',
    by: 'dmeta scaffold-pbui-react-app',
    command: 'dmeta scaffold-pbui-react-app ...',
    workingDirectory: '/home/manuel/code/wesen/go-go-golems/dmeta',
    gitCommit: '450d078...'
  },
  pipeline: {
    semanticRoot: './examples/street-deli-ordering',
    interactionsRoot: './sources/dmeta-ir',
    metaDesignSystem: 'pbui',
    profileRoot: './examples/street-deli-ordering/meta-design-systems/pbui',
    target: 'react_app',
    passes: [
      'semantic-ir',
      'interaction-elaboration',
      'pbui-lowering',
      'pbui-presentation-profile-instantiation',
      'pbui-react-app-planning',
    ],
  },
  sources: [
    {
      path: './examples/street-deli-ordering',
      role: 'semantic package',
      why: 'Provides Street Deli domain types, archetypes, capabilities, and examples.',
    },
    {
      path: './sources/dmeta-ir',
      role: 'interaction package',
      why: 'Provides actions and representations used by PBUI lowering.',
    },
    {
      path: './sources/dmeta-ir/meta-design-systems/pbui',
      role: 'PBUI MetaDesignSystem',
      why: 'Provides abstract PBUI presentation types and lowering rules.',
    },
    {
      path: './examples/street-deli-ordering/meta-design-systems/pbui',
      role: 'concrete PBUI profile',
      why: 'Provides presentation-system, style, surface, view-model, and presentation-binding guidance.',
    },
  ],
  react: {
    packageName: 'street-deli-clim-react',
  },
  guidance: {
    summary: 'Generated concrete PBUI/CLIM React app artifact...',
    implementationNotes: [...],
  },
  promotionDefaults: {
    promotable: true,
    instructions: [...],
  },
} as const;
```

The helper should be deliberately small:

```ts
export function defineDmetaGeneratedMetadata(
  packageMetadata: DmetaPackageMetadata,
  fileMetadata: DmetaFileMetadata,
) {
  return {
    schemaVersion: packageMetadata.schemaVersion,
    generated: packageMetadata.generated,
    artifact: fileMetadata.artifact,
    pipeline: packageMetadata.pipeline,
    sources: packageMetadata.sources,
    semantics: fileMetadata.semantics,
    web: fileMetadata.web,
    pbui: fileMetadata.pbui,
    react: packageMetadata.react,
    guidance: fileMetadata.guidance ?? packageMetadata.guidance,
    promotion: fileMetadata.promotion ?? packageMetadata.promotionDefaults,
  } as const;
}
```

This preserves the existing `dmetaGeneratedMetadata` export contract. Tooling that imports a file and reads `dmetaGeneratedMetadata` still works. Tooling that statically scans files can also find the small local fragment and the shared package module.

## 6. Why the export should remain in each promotable file

It may be tempting to remove `dmetaGeneratedMetadata` from individual files and keep only a shared lookup table. That would reduce repetition further, but it would make promotable files less self-explanatory. A developer or LLM opening `MenuView.tsx` should immediately see that the file is generated, promotable, and tied to a specific view or presentation binding.

The file-local export is therefore part of the design. It should remain small, but it should exist. The reader should not have to search the repository to discover that a view component came from PBUI profile bindings.

The rule is:

- package-level facts live once;
- file-level facts live with the file;
- the effective metadata export remains named `dmetaGeneratedMetadata`;
- promotion changelog remains file-local because it changes after promotion.

## 7. Schema design

Add two new Go structs next to the existing envelope. The existing `GeneratedFileMetadata` remains useful as the effective merged shape.

```go
type GeneratedPackageMetadata struct {
    SchemaVersion     int               `json:"schemaVersion"`
    Generated         GeneratedInfo     `json:"generated"`
    Pipeline          PipelineInfo      `json:"pipeline"`
    Sources           []SourceReference `json:"sources,omitempty"`
    React             *ReactGuidance    `json:"react,omitempty"`
    Guidance          *HumanGuidance    `json:"guidance,omitempty"`
    PromotionDefaults *PromotionInfo    `json:"promotionDefaults,omitempty"`
}

type GeneratedFileMetadataFragment struct {
    Artifact  ArtifactInfo      `json:"artifact"`
    Semantics *SemanticGuidance `json:"semantics,omitempty"`
    Web       *WebGuidance      `json:"web,omitempty"`
    PBUI      *PBUIGuidance     `json:"pbui,omitempty"`
    Guidance  *HumanGuidance    `json:"guidance,omitempty"`
    Promotion *PromotionInfo    `json:"promotion,omitempty"`
}
```

Add a merge function in Go for tests and JSON sidecar generation:

```go
func MergeGeneratedMetadata(pkg GeneratedPackageMetadata, file GeneratedFileMetadataFragment) GeneratedFileMetadata {
    return GeneratedFileMetadata{
        SchemaVersion: pkg.SchemaVersion,
        Generated:     pkg.Generated,
        Artifact:      file.Artifact,
        Pipeline:      pkg.Pipeline,
        Sources:       pkg.Sources,
        Semantics:     file.Semantics,
        Web:           file.Web,
        PBUI:          file.PBUI,
        React:         pkg.React,
        Guidance:      firstNonNil(file.Guidance, pkg.Guidance),
        Promotion:     firstNonNil(file.Promotion, pkg.PromotionDefaults),
    }
}
```

Add a TypeScript helper renderer that mirrors this merge. The TypeScript helper does not need to be clever. It should be explicit, readable, and stable.

## 8. Generated files for a folded package

Each generated/promotable React package should get a small metadata runtime under `src/generated/` or an equivalent target-owned generated directory.

For the concrete PBUI/CLIM React app:

```text
examples/street-deli-ordering/www/clim-react/src/generated/
  dmetaPackageMetadata.ts
  dmetaMetadata.ts
  concretePresentationPlan.metadata.json
  pbuiRegistries.ts
```

For Web React scaffold output:

```text
examples/street-deli-ordering/generated/react/
  dmetaPackageMetadata.ts
  dmetaMetadata.ts
  StreetDeliCompositionCard/
    StreetDeliCompositionCard.tsx
    StreetDeliCompositionCard.types.ts
    StreetDeliCompositionCard.stories.tsx
    StreetDeliCompositionCard.metadata.json
```

The directory name is less important than the invariant: each promotable TS/TSX file can import the package metadata helper using a deterministic relative path.

## 9. Import path strategy

The renderer must compute the relative import path from each file to the shared metadata helper.

Pseudocode:

```go
func metadataImportPath(fromFile string, helperFile string) string {
    fromDir := filepath.Dir(fromFile)
    rel, err := filepath.Rel(fromDir, helperFile)
    if err != nil { panic(err) }
    rel = filepath.ToSlash(rel)
    rel = strings.TrimSuffix(rel, ".ts")
    if !strings.HasPrefix(rel, ".") {
        rel = "./" + rel
    }
    return rel
}
```

Examples:

| From file | Helper file | Import path |
|---|---|---|
| `src/views/MenuView.tsx` | `src/generated/dmetaMetadata.ts` | `../generated/dmetaMetadata` |
| `src/components/shell/ClimShell.tsx` | `src/generated/dmetaMetadata.ts` | `../../generated/dmetaMetadata` |
| `StreetDeliCompositionCard/StreetDeliCompositionCard.tsx` | `dmetaMetadata.ts` | `../dmetaMetadata` |

Do not hardcode `../generated` in render functions. Compute it from paths.

## 10. Promotion changelog design

Promotion changelogs should remain file-local. A package-level changelog tells the reader when the generator ran, but it cannot explain why a human changed `MenuView.tsx` after promotion.

A promotable file should include:

```ts
const dmetaFileMetadata = {
  artifact: {...},
  pbui: {...},
  promotion: {
    promotable: true,
    status: 'scaffold',
    changelog: [
      '2026-05-25T03:34:10Z: Generated by dmeta scaffold-pbui-react-app. Initial scaffold.',
      // Add human-maintained entries above or below according to project convention.
    ],
  },
} as const;
```

The comment above this block should be short:

```ts
// File-local DMETA metadata. Keep this close to the promoted file so reviewers
// can see which presentation/view/binding this code implements.
```

Avoid placing the full promotion instruction text in every file. Put the shared instructions in package metadata. The file-local block should carry only the changelog and file-specific status.

## 11. LLM reading pattern

Folded metadata should help an LLM read code in two passes.

```text
First file in package:
  read src/generated/dmetaPackageMetadata.ts
  learn source roots, pipeline, profile, package guidance

Any specific file:
  read file-local dmetaFileMetadata
  understand artifact, view/presentation/template details, promotion status
  inspect code
```

The file should contain a pointer to the shared package module in plain language:

```ts
// Shared package-level DMETA context is in ../generated/dmetaPackageMetadata.
// This file keeps only artifact-specific and promotion metadata local.
```

That comment matters. It tells the reader that the missing context is intentionally folded, not accidentally omitted.

## 12. Implementation plan

### Phase 1: Extend the metadata package

Add package/file fragment structs and merge helpers in `pkg/dmeta/generator/metadata`.

Files:

- `pkg/dmeta/generator/metadata/model.go`
- `pkg/dmeta/generator/metadata/render.go`
- new tests in `pkg/dmeta/generator/metadata/render_test.go`

Acceptance criteria:

- Go tests prove package metadata plus file fragment merges into the same effective `GeneratedFileMetadata` shape.
- TypeScript helper rendering produces stable, parseable code.
- Existing `RenderTypeScriptPrelude` remains available so older targets can migrate incrementally.

### Phase 2: Add folded render helpers

Add helpers that render:

- `dmetaPackageMetadata.ts`;
- `dmetaMetadata.ts` with `defineDmetaGeneratedMetadata`;
- file-local metadata prelude for TS/TSX files.

Pseudocode:

```go
func RenderFoldedPackageMetadata(meta GeneratedPackageMetadata) (string, error)
func RenderFoldedMetadataHelper() string
func RenderFoldedTypeScriptPrelude(opts FoldedPreludeOptions) (string, error)
```

`FoldedPreludeOptions` should include:

```go
type FoldedPreludeOptions struct {
    PackageImportPath string
    FileFragment      GeneratedFileMetadataFragment
    FragmentConstName string // default dmetaFileMetadata
    ExportConstName   string // default dmetaGeneratedMetadata
}
```

Acceptance criteria:

- A generated file imports `defineDmetaGeneratedMetadata` and `dmetaPackageMetadata`.
- The local object excludes package-level repeated fields.
- The exported `dmetaGeneratedMetadata` remains available.

### Phase 3: Apply to concrete PBUI/CLIM React app

Start with `www/clim-react` because it is the committed promotable target where repetition hurts most.

Files:

- `pkg/dmeta/metadesign/pbui/profile/react_app_plan.go`
- `pkg/dmeta/metadesign/pbui/profile/react_app_render.go`
- `pkg/dmeta/metadesign/pbui/profile/react_app_write.go` if write filtering needs awareness of new generated metadata files.
- `examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml` if new file kinds are target-declared.

Add file kinds:

```yaml
file_kinds:
  - dmeta_package_metadata
  - dmeta_metadata_helper
```

Generated paths:

```text
src/generated/dmetaPackageMetadata.ts
src/generated/dmetaMetadata.ts
```

Acceptance criteria:

- `src/generated/dmetaPackageMetadata.ts` contains shared package facts.
- `src/generated/dmetaMetadata.ts` contains the merge helper.
- Promotable TS/TSX files import the helper and contain only file-local metadata.
- `npm run build` and `npm run build-storybook` pass in `www/clim-react`.

### Phase 4: Apply to Web React scaffold output

After the concrete app path works, apply the same folding to the Web React scaffold renderer.

Files:

- `pkg/dmeta/generator/react/model.go`
- `pkg/dmeta/generator/react/plan.go`
- `pkg/dmeta/generator/react/render.go`
- `pkg/dmeta/generator/react/render_test.go`

Acceptance criteria:

- Web scaffold dry-run includes shared metadata helper files.
- Web component TS/TSX files import the shared helper.
- Web sidecar metadata remains parseable and can be produced as effective merged metadata.

### Phase 5: Preserve tooling compatibility

Some tools will want the effective metadata object. Others will want compact local fragments. Support both.

Compatibility requirements:

- `dmetaGeneratedMetadata` remains exported from each promotable file.
- JSON sidecars can remain full effective metadata for easy non-TypeScript tooling.
- Package-level metadata has a stable export name: `dmetaPackageMetadata`.
- File-local metadata has a stable export name or internal const name: `dmetaFileMetadata`.

Add tests that assert:

```text
file contains "export const dmetaGeneratedMetadata"
file contains "defineDmetaGeneratedMetadata"
file does not contain repeated source-root why text
package metadata file contains source-root why text once
```

### Phase 6: Update docs and validation

Update the generated metadata guide or add a short addendum that explains folded metadata.

Validation commands:

```bash
go test ./pkg/dmeta/generator/metadata ./pkg/dmeta/generator/react ./pkg/dmeta/metadesign/pbui/profile ./pkg/dmeta/cmds -count=1

go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --dry-run \
  --force \
  --output table

go run ./cmd/dmeta scaffold-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --force \
  --output table

cd examples/street-deli-ordering/www/clim-react && npm run build && npm run build-storybook
```

## 13. API reference for the intern

### Existing Go API

| API | Location | Purpose |
|---|---|---|
| `GeneratedFileMetadata` | `pkg/dmeta/generator/metadata/model.go` | Effective full metadata envelope currently emitted into each file. |
| `RenderTypeScriptPrelude` | `pkg/dmeta/generator/metadata/render.go` | Renders full metadata inline into TS/TSX files. |
| `RenderJSON` | `pkg/dmeta/generator/metadata/render.go` | Renders metadata sidecars. |
| `webGeneratedMetadata` | `pkg/dmeta/generator/react/render.go` | Builds full Web React metadata today. |
| `reactAppGeneratedMetadata` | `pkg/dmeta/metadesign/pbui/profile/react_app_render.go` | Builds full concrete PBUI/CLIM metadata today. |

### New Go API to add

| API | Location | Purpose |
|---|---|---|
| `GeneratedPackageMetadata` | `pkg/dmeta/generator/metadata/model.go` | Package-level shared metadata. |
| `GeneratedFileMetadataFragment` | `pkg/dmeta/generator/metadata/model.go` | File-local metadata fragment. |
| `MergeGeneratedMetadata` | `pkg/dmeta/generator/metadata/render.go` or new `fold.go` | Produces effective metadata from package + file. |
| `RenderFoldedPackageMetadataTS` | `pkg/dmeta/generator/metadata/render.go` or new `fold_render.go` | Renders `dmetaPackageMetadata.ts`. |
| `RenderFoldedMetadataHelperTS` | same | Renders `dmetaMetadata.ts`. |
| `RenderFoldedTypeScriptPrelude` | same | Renders compact file-local prelude. |

### New TypeScript API to generate

```ts
export const dmetaPackageMetadata = {...} as const;

export type DmetaPackageMetadata = typeof dmetaPackageMetadata;

export function defineDmetaGeneratedMetadata<
  TPackage extends DmetaPackageMetadata,
  TFile extends DmetaFileMetadata,
>(packageMetadata: TPackage, fileMetadata: TFile) {
  return {
    schemaVersion: packageMetadata.schemaVersion,
    generated: packageMetadata.generated,
    artifact: fileMetadata.artifact,
    pipeline: packageMetadata.pipeline,
    sources: packageMetadata.sources,
    semantics: fileMetadata.semantics,
    web: fileMetadata.web,
    pbui: fileMetadata.pbui,
    react: packageMetadata.react,
    guidance: fileMetadata.guidance ?? packageMetadata.guidance,
    promotion: fileMetadata.promotion ?? packageMetadata.promotionDefaults,
  } as const;
}
```

## 14. Diagram: before and after

Before folding:

```text
MenuView.tsx
  generated info
  pipeline
  sources
  guidance
  artifact: MenuView
  pbui: menu view
  promotion
  code

CartView.tsx
  generated info
  pipeline
  sources
  guidance
  artifact: CartView
  pbui: cart view
  promotion
  code
```

After folding:

```text
src/generated/dmetaPackageMetadata.ts
  generated info
  pipeline
  sources
  shared guidance
  React package info
  promotion defaults

MenuView.tsx
  import shared metadata helper
  artifact: MenuView
  pbui: menu view
  file changelog
  export merged dmetaGeneratedMetadata
  code

CartView.tsx
  import shared metadata helper
  artifact: CartView
  pbui: cart view
  file changelog
  export merged dmetaGeneratedMetadata
  code
```

The after shape makes the first file in a package slightly more important. Once the reader has loaded the package metadata module, each individual file becomes much smaller and easier to scan.

## 15. Review checklist

Use this checklist when reviewing the implementation.

- [ ] Every promotable TS/TSX file still exports `dmetaGeneratedMetadata`.
- [ ] Shared package facts appear once in `dmetaPackageMetadata.ts`.
- [ ] File-local metadata contains artifact-specific facts and promotion changelog.
- [ ] File-local metadata does not repeat source-root prose unless there is a file-specific source reference.
- [ ] JSON sidecars remain parseable.
- [ ] Existing build and Storybook commands pass.
- [ ] Import paths are computed, not hardcoded.
- [ ] The folded helper is generated by DMETA and should not become hand-maintained app logic.
- [ ] The design is applied first to promotable React target files, not broad non-promotable outputs.

## 16. Common mistakes

### Mistake 1: Removing file-local metadata entirely

Do not move everything into a shared registry. A file should still tell the reader what it is and how it relates to DMETA.

### Mistake 2: Making the merge helper too dynamic

Avoid runtime discovery, global registries, or complex lookup code. The helper should be a small pure function that combines two objects.

### Mistake 3: Folding the promotion changelog into package metadata

Promotion changelog entries belong near the promoted file. They are about human changes to that file, not about the generated package as a whole.

### Mistake 4: Optimizing ignored proof output before committed targets

The generic PBUI proof package can benefit later, but the first implementation should serve committed promotable React files.

## 17. Suggested first implementation order

A new intern should implement this in the following order:

1. Add schema structs and merge tests in `pkg/dmeta/generator/metadata`.
2. Add TypeScript render helpers in the same package.
3. Apply folding to `www/clim-react` generation.
4. Regenerate `www/clim-react` and prove TypeScript/Storybook builds.
5. Apply folding to Web React scaffolds.
6. Add tests that prove repeated package text moved out of file-local preludes.
7. Update documentation and diary.

This order starts with the shared contract, then validates it in the most important target, and only then expands to the second target.

## 18. Acceptance criteria

The ticket is complete when:

- `pkg/dmeta/generator/metadata` supports package-level metadata, file-local metadata fragments, and effective merge helpers.
- Concrete PBUI/CLIM React app generation emits `src/generated/dmetaPackageMetadata.ts` and `src/generated/dmetaMetadata.ts`.
- Concrete PBUI/CLIM promotable TS/TSX files import the shared helper and contain compact file-local metadata.
- Web React scaffold generation emits equivalent folded metadata helper files.
- `dmetaGeneratedMetadata` remains available from promotable files.
- Full validation passes for Go tests, Web scaffold dry-run, CLIM app regeneration, CLIM app build, and CLIM Storybook build.
- The implementation diary records failures, tradeoffs, and review instructions.
