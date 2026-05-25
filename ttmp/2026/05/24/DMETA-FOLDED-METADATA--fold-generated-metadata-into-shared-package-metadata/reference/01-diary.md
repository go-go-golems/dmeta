---
Title: Diary
Ticket: DMETA-FOLDED-METADATA
Status: active
Topics:
    - dmeta
    - code-generation
    - react
    - pbui
    - metadesignsystem
    - documentation
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/05/24/DMETA-FOLDED-METADATA--fold-generated-metadata-into-shared-package-metadata/design-doc/01-folded-generated-metadata-architecture-and-implementation-guide.md
      Note: |-
        Primary design guide created for folded metadata.
        Guide written during Step 1
ExternalSources: []
Summary: Chronological diary for designing folded generated metadata for promotable React target files.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Record why the folded metadata ticket exists, what was inspected, and how the guide was produced.
WhenToUse: Read before implementing folded metadata, metadata helper modules, or compact file-local generated metadata.
---


# Diary

## Goal

Capture the design work for folding repeated generated metadata in promotable React target files. The ticket does not remove metadata from files; it designs a way to keep file-specific metadata local while moving repeated package-level context into shared generated modules.

## Step 1: Create folded metadata design ticket and write the guide

This step created `DMETA-FOLDED-METADATA` and wrote the first design guide. The guide responds to the observation that the previous metadata implementation is useful but verbose: many promotable React files now repeat the same source roots, generation command, pipeline, profile guidance, and promotion instructions.

The design narrows the scope to promotable React target files. The generic PBUI proof package can adopt the same technique later, but the main problem is committed or promoted React code that humans and LLMs will read repeatedly.

### Prompt Context

**User prompt (verbatim):** "reate a new design ticket to \"fold\" the metadata so that we can extract common parts within a package or so, because it is a lot of repeated data right now that an LLM would read over and over, which we could maybe group into a shared file that is then imported to provide the dmetaGeneratedMetadata, and keeping mostly file specific metadta inside the files themselves.

Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable."

**Assistant interpretation:** Create a new docmgr design ticket and write a detailed intern-facing guide for reducing repeated generated metadata by factoring common package-level facts into shared generated files, while preserving file-local metadata for promotable React files.

**Inferred user intent:** Make generated metadata cheaper for LLMs and humans to read repeatedly without losing the per-file context and `dmetaGeneratedMetadata` contract that future tooling depends on.

### What I did

- Created docmgr ticket `DMETA-FOLDED-METADATA`.
- Created a design document and diary under the ticket workspace.
- Inspected the current metadata implementation:
  - `pkg/dmeta/generator/metadata/model.go`
  - `pkg/dmeta/generator/metadata/render.go`
  - `pkg/dmeta/generator/react/render.go`
  - `pkg/dmeta/metadesign/pbui/profile/react_app_render.go`
- Wrote the guide:
  - `ttmp/2026/05/24/DMETA-FOLDED-METADATA--fold-generated-metadata-into-shared-package-metadata/design-doc/01-folded-generated-metadata-architecture-and-implementation-guide.md`

### Why

- The full metadata envelope is currently repeated in many generated TS/TSX files.
- Repetition increases LLM context consumption and diff noise.
- The correct next step is not to remove metadata, but to fold it into package-level and file-level pieces.

### What worked

- The current code already has a shared metadata envelope, so the folded design can extend that instead of replacing it.
- The current renderers have clear metadata construction functions (`webGeneratedMetadata` and `reactAppGeneratedMetadata`) that can be split into package and file fragment builders.

### What didn't work

- No implementation was attempted in this step. This was intentionally design-only.

### What I learned

- The most repeated fields are `generated`, `pipeline`, `sources`, shared `guidance`, React package name, and common promotion instructions.
- The file-specific fields are usually `artifact`, `web`, `pbui`, selected `semantics`, and the promotion changelog.

### What was tricky to build

- The design had to preserve the existing `dmetaGeneratedMetadata` export contract. If individual files stopped exporting metadata, tooling and LLM workflows would become less direct.
- The design also had to keep promotion changelogs file-local, because human edits happen to individual promoted files rather than to the whole generated package.

### What warrants a second pair of eyes

- Review the proposed `GeneratedPackageMetadata` and `GeneratedFileMetadataFragment` schema split.
- Review whether JSON sidecars should remain full effective metadata or switch to folded package/file sidecars.
- Review whether every promotable file should import a helper or whether some tiny files should use direct compact metadata.

### What should be done in the future

- Implement the folded metadata schema and render helpers.
- Apply it first to the committed concrete PBUI/CLIM React app.
- Apply it next to Web React scaffold output.
- Add tests that ensure repeated source-root prose appears in package metadata, not every file.

### Code review instructions

- Start with the design guide's schema and implementation plan sections.
- Compare the proposed split against the current full metadata envelope in `pkg/dmeta/generator/metadata/model.go`.
- Confirm the design focuses first on promotable React targets, as requested.

### Technical details

The central output shape is:

```ts
import { dmetaPackageMetadata, defineDmetaGeneratedMetadata } from '../generated/dmetaMetadata';

const dmetaFileMetadata = {
  artifact: { path, kind, language, symbol, promotable: true },
  pbui: { viewId, surfaceId, bindingComponent },
  promotion: { promotable: true, status: 'scaffold', changelog: [...] },
} as const;

export const dmetaGeneratedMetadata = defineDmetaGeneratedMetadata(
  dmetaPackageMetadata,
  dmetaFileMetadata,
);
```
