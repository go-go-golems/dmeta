---
Title: Build Glazed CLI Validator for DMETA v0 IR
Ticket: DMETA-002
Status: complete
Topics:
    - design-system
    - dsl
    - code-generation
    - react
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: dmeta/cmd/dmeta/main.go
      Note: CLI entry point registering the Glazed validate-ir command
    - Path: dmeta/design-docs/04-concrete-dmeta-system-spec.md
      Note: Concrete v0 system architecture and validator context
    - Path: dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md
      Note: Core model and widget IR validation rules
    - Path: dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md
      Note: Design-language and tooling validation rules
    - Path: dmeta/pkg/dmeta/cmds/validate_ir.go
      Note: Glazed command implementation for structured validation output
    - Path: dmeta/pkg/dmeta/validator
      Note: Validator package with YAML models
    - Path: dmeta/sources/dmeta-ir
      Note: DMETA v0 YAML IR package that the validator must load and validate
    - Path: glazed
      Note: Local Glazed framework module used by the CLI
ExternalSources: []
Summary: ""
LastUpdated: 2026-05-19T20:01:48.830214302-04:00
WhatFor: ""
WhenToUse: ""
---




# Build Glazed CLI Validator for DMETA v0 IR

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
