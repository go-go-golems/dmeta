---
Title: Generate TypeScript Core Registries from DMETA v0 IR
Ticket: DMETA-003
Status: active
Topics:
    - design-system
    - dsl
    - code-generation
    - react
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md
      Note: Specification for the core model and expected generated TypeScript registries
    - Path: dmeta/pkg/dmeta/cmds/validate_ir.go
      Note: Existing Glazed command pattern to follow for generate-core
    - Path: dmeta/pkg/dmeta/validator
      Note: Existing validator package and loaded model types to reuse before generation
    - Path: dmeta/sources/dmeta-ir/01-core-model.yaml
      Note: Primary source IR for archetypes
    - Path: dmeta/ttmp/2026/05/19/DMETA-002--build-glazed-cli-validator-for-dmeta-v0-ir/design-doc/01-dmeta-ir-validator-intern-design-and-implementation-guide.md
      Note: Preceding validator guide; explains model loading
ExternalSources: []
Summary: ""
LastUpdated: 2026-05-19T20:30:01.818362954-04:00
WhatFor: ""
WhenToUse: ""
---


# Generate TypeScript Core Registries from DMETA v0 IR

## Overview

<!-- Provide a brief overview of the ticket, its goals, and current status -->

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- design-system
- dsl
- code-generation
- react

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
