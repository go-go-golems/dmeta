---
Title: DMETA YAML Viewer — React + Go app for browsing dmeta-ir/core-model YAML files
Ticket: DMETA-VIEWER-001
Status: active
Topics:
    - dmeta
    - yaml-viewer
    - react
    - go
    - swiss-typography
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: 2026-05-19--dmeta-viewer/frontend/src/features/viewer/CapabilityCard.jsx
      Note: Custom capability widget with projection rows and middle-dot separators
    - Path: 2026-05-19--dmeta-viewer/frontend/src/features/viewer/PresentationCard.jsx
      Note: Custom presentation widget with layer/role/density summary row
    - Path: 2026-05-19--dmeta-viewer/frontend/src/features/viewer/YamlViewer.jsx
      Note: Core viewer component
    - Path: 2026-05-19--dmeta-viewer/frontend/src/styles/programme.css
      Note: |-
        Swiss typography system (Programme № 1)
        Programme № 2 — 13px only
    - Path: 2026-05-19--dmeta-viewer/internal/scanner/scanner.go
      Note: YAML directory scanner and index builder
    - Path: 2026-05-19--dmeta-viewer/main.go
      Note: Go entry point with go:embed and CLI flags
    - Path: 2026-05-19--image-collector/app/src/api/apiSlice.js
      Note: RTK Query pattern reference
    - Path: 2026-05-19--image-collector/app/src/styles/programme.css
      Note: Swiss typography system reference
    - Path: dmeta/sources/dmeta-ir/core-model/archetypes.yaml
      Note: Primary source YAML - archetype definitions
    - Path: dmeta/sources/dmeta-ir/core-model/capabilities.yaml
      Note: Primary source YAML - capability definitions
ExternalSources: []
Summary: ""
LastUpdated: 2026-05-19T21:46:30.328614083-04:00
WhatFor: ""
WhenToUse: ""
---












# DMETA YAML Viewer — React + Go app for browsing dmeta-ir/core-model YAML files

## Overview

<!-- Provide a brief overview of the ticket, its goals, and current status -->

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- dmeta
- yaml-viewer
- react
- go
- swiss-typography

## Tasks

See [tasks.md](./tasks.md) for the current task list.

## Changelog

See [changelog.md](./changelog.md) for recent changes and decisions.

## Structure

- design/ - Architecture and design documents
- reference/ - Prompt packs, API contracts, context summaries
- playbooks/ - Command sequences and test procedures
- scripts/ - Temporary code and tooling
- various/ - Working notes and research
- archive/ - Deprecated or reference-only artifacts
