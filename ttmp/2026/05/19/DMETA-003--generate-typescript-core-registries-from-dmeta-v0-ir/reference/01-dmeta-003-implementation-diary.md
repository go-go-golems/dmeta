---
Title: DMETA-003 Implementation Diary
Ticket: DMETA-003
Status: active
Topics:
    - design-system
    - dsl
    - code-generation
    - react
DocType: reference
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Chronological diary for DMETA-003 TypeScript core registry generator design and implementation."
LastUpdated: 2026-05-19T20:10:00-04:00
WhatFor: "Use to resume DMETA-003 with context about guide drafting, review status, and implementation constraints."
WhenToUse: "Read before implementing or modifying the core registry generator."
---

# DMETA-003 Implementation Diary

## 2026-05-19 — Ticket creation and guide drafting

### What happened
Created ticket `DMETA-003` for the next DMETA-001 step: generating TypeScript core registries from the validated DMETA v0 IR.

Created the intern-facing guide:

- `design-doc/01-dmeta-typescript-core-registry-generator-intern-guide.md`

### Scope constraint
The user explicitly requested **not to start implementing yet**. This ticket currently contains analysis/design/planning only. The guide is intended for review before implementation begins.

### Related files
Related the ticket to:

- `dmeta/sources/dmeta-ir/01-core-model.yaml`
- `dmeta/pkg/dmeta/validator`
- `dmeta/pkg/dmeta/cmds/validate_ir.go`
- `dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md`
- `DMETA-002` validator intern guide

### Guide contents
The guide explains:

- DMETA system context;
- why the core registry generator is the next step after validation;
- source IR structure;
- target generated TypeScript files;
- desired `dmeta generate-core` command shape;
- proposed Go package layout;
- deterministic rendering rules;
- TypeScript output patterns;
- validation-before-generation behavior;
- action matching pseudocode;
- testing/golden strategy;
- design decisions and open review questions.

### Next
Upload the guide to reMarkable for review, update changelog/tasks, and stop before implementation.

## 2026-05-19 — Uploaded guide to reMarkable

### Command

```bash
remarquee upload bundle "/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-003--generate-typescript-core-registries-from-dmeta-v0-ir/design-doc/01-dmeta-typescript-core-registry-generator-intern-guide.md" \
  --name "DMETA 003 TypeScript Core Registry Generator Guide" \
  --remote-dir "/ai/2026/05/19/DMETA-003" \
  --toc-depth 2 \
  --non-interactive
```

### Result
Upload succeeded:

```text
OK: uploaded DMETA 003 TypeScript Core Registry Generator Guide.pdf -> /ai/2026/05/19/DMETA-003
```

### Current status
Tasks for writing and uploading the guide are complete. Implementation tasks remain intentionally open pending review.

## 2026-05-19 — Guide updated for split core-model package

### What changed
The core model IR was split into a package index plus subfiles:

```text
sources/dmeta-ir/01-core-model.yaml
sources/dmeta-ir/core-model/core-model.yaml
sources/dmeta-ir/core-model/archetypes.yaml
sources/dmeta-ir/core-model/capabilities.yaml
sources/dmeta-ir/core-model/presentations.yaml
sources/dmeta-ir/core-model/examples/*.yaml
```

Updated the DMETA-003 guide so the future `generate-core` implementation knows not to assume a monolithic `01-core-model.yaml`. The guide now says to call the existing validator loader, which merges the split package into a single `validator.CoreModelFile` for consumers.

### Re-upload
Re-uploaded the updated guide to reMarkable using `--force`:

```text
OK: uploaded DMETA 003 TypeScript Core Registry Generator Guide.pdf -> /ai/2026/05/19/DMETA-003
```
