---
Title: DMETA-001 Investigation Diary
Ticket: DMETA-001
Status: active
Topics:
    - design-system
    - dsl
    - presentation-based-ui
    - code-generation
    - react
DocType: reference
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Chronological investigation diary for DMETA-001."
LastUpdated: 2026-05-19T17:36:00-04:00
WhatFor: "Use to resume the ticket with context about source imports, scope corrections, design decisions, and open questions."
WhenToUse: "Read before continuing DMETA-001 work or writing follow-up specs/playbooks."
---

# DMETA-001 Investigation Diary

## 2026-05-19 — Ticket creation and source import

### What happened
Created DMETA-001 ticket and imported all source artifacts from HAIR-041 and the Obsidian vault:

**Playbooks imported:**
- Collaborative Schema Design Sessions for Presentation-Based UI
- Widget IR to Finished Widget Playbook
- Admin DSL Widget Design System Review Playbook
- Widget Playbook Compliance Audit Guide
- Intern Widget Compliance Review Kickoff

**Specifications imported:**
- Design System DSL Data Structures and Toolchain (full technical spec)

**Sources imported:**
- Article: A DSL for Creating Design Systems
- Widget IR source catalog (08-*.md)
- Widget IR YAML format spec (09-*.md)
- All HAIR-041 YAML source artifacts (pass model, shared types, widget categories, design language, storybook manifest)

**Live code references related:**
- log-presentation-based-ui app (React + Vite + RTK + Tailwind, PBUI pattern)
- image-collector app (minimal typography aesthetic)

### Key observations from reading the source material

1. **The HAIR-041 pipeline is genuinely reusable.** The pass model (renderer inventory → IR formalization → scaffold generation → manual promotion → adapter → story hardening → lint → audit) is solid. The key insight is that each pass has explicit input and output artifacts, not just steps.

2. **The presentation-based UI pattern already works in practice.** The log-presentation-based-ui app has a working implementation of:
   - Semantic types (`SemanticType` union: `time-instant`, `log-level`, `agent-id`, `session-id`, etc.)
   - Presentation tokens (each rendered element knows its `kind`, `semanticType`, `tone`)
   - Operation registry with `startsFrom: SemanticType[]` — operations declare which semantic types they accept
   - Candidate presentations — arguments filled by selecting on-screen values of the matching type
   - Command state machine: idle → menu-open → awaiting-argument → showing-result

3. **The minimal typography aesthetic is well-defined.** Both apps converge on:
   - Berkeley Mono, 13px body / 24-28px display
   - Paper (#f8f7f5) + ink (#111111) + muted + status accents
   - Four roles: body, label, caption, display
   - Zero decorative chrome, monospace-first

4. **The gap between HAIR-041 and this project** is primarily:
   - HAIR-041 was CRUD/admin — widgets are form-heavy, resource-table-heavy
   - DMETA needs streaming/virtualized data, keyboard-first, presentation-polymorphic
   - The semantic type layer needs to handle "reference types" (agent-id, session-id) not just "object types"
   - The action model needs to handle real-time streaming contexts

### What's next
Per the Collaborative Schema Design Sessions playbook, Phase 1 is: elicit the domain model. We need to define semantic types for high-volume data applications before anything else.

### Open questions for the human
- What are the 3-5 most important domain objects for the pilot?
- Are reference types (agent-id, session-id) first-class semantic types or projections of their parent objects?
- How many presentation variants per type is realistic for v1?
- Should the design language be identical to HAIR-041's, or start fresh with the minimal typography system?

## 2026-05-19 — Scope correction: domain entities become archetypes

### What changed
The user clarified that the goal is not to define a precise domain model for one agentic workflow app. The goal is to define a more generic design-system factory for apps that are functionally congruent: agent dashboards, retail logistics order pipelines, incident queues, build systems, monitoring streams, and other dense operational information systems.

Therefore Phase 1 should not start with concrete entity types like `Agent`, `Session`, `ToolCall`, and `LogEvent` as if those were the universal model. Those should be treated as examples of broader semantic archetypes.

### Updated interpretation
The semantic layer should define **archetypes** such as:
- Actor — agent, user, customer, warehouse, carrier, service, assignee
- Work Item — order, task, job, shipment, tool call, ticket, process step
- Event — log event, status transition, scan event, lifecycle update, incident update
- State — pending, running, blocked, completed, failed, delayed, escalated
- Resource — file, package, inventory item, machine, endpoint, location
- Relation — depends-on, assigned-to, belongs-to, triggered-by, located-at
- Metric — duration, latency, count, throughput, cost, error rate
- Timeline Span — session, route, workflow run, incident window, execution phase

Application-specific domain entities then map onto these archetypes. Example: `Agent` in an agent dashboard and `Carrier` in a logistics dashboard can both map to Actor for purposes of presentation, filtering, selection, and action dispatch.

The graphic design layer should also be treated as an archetype, not a fixed theme. The target is sober, dense, typographic, low-chrome information UI with subtle cool-grey/neutral texture-free surfaces. Berkeley Mono with a cool neutral palette is one instance, not the universal output.

### Consequence
The first real design session should define:
1. The initial archetype inventory.
2. How app-specific domain types map onto archetypes.
3. Which presentation variants belong to archetypes vs. domain types.
4. Which visual constraints are mandatory vs. theme-level choices.

## 2026-05-19 — Visual references and intermediate document drafting

### What happened
Copied the two user-provided visual reference images into:

- `sources/images/01-dense-typographic-reference.png`
- `sources/images/02-dense-typographic-reference.png`

Asked a vision model to extract reusable design-system principles from the images, focusing on typography, spacing, layout, color, hierarchy, components, and interaction affordances. The interpretation matched the intended direction: sober, typographic, low-chrome, high-density operational UI with strict alignment, compact components, semantic color, keyboard/context affordances, and progressive disclosure.

### User clarifications incorporated
- Archetypes are best understood as collections of capabilities that recur in roughly similar form across concrete domains.
- Archetypes should be composable; a concrete type can map to multiple archetypes.
- A tool call has multiple semantic layers:
  - a definition/signature (`ActionSpec` or similar);
  - a concrete scheduled/running execution (`ActionInvocation` / `WorkItem`);
  - emitted observations (`Event`).
- A shipment is compositional rather than meta-layered: it can be WorkItem + TimelineSpan + related Resource/Actor/Event facets.
- A status badge is the representation of the `stateful` capability; a `State` archetype only exists when state itself is first-class.
- Design constraints should be ranges for now, not hard rules. Hard rules will be produced later when creating a concrete design system instance.

### Documents created
Created two intermediate design documents that sit between this collaboration/playbook phase and the later concrete DSL/tooling phase:

1. `design-doc/03-semantic-archetype-and-capability-model.md`
   - Defines domain types, archetypes, capabilities, projections, presentations, and actions.
   - Explains compositional archetypes and capability-level presentations.
   - Clarifies ToolCall and Shipment as examples.
   - Sketches future `archetypes.yaml`, `capabilities.yaml`, `domain-mapping.yaml`, `presentations.yaml`, and `actions.yaml` artifacts.

2. `design-doc/04-dense-operational-ui-graphic-design-and-ux-archetype.md`
   - Defines the Sober Dense Operational UI archetype.
   - Captures design ranges for typography, spacing, borders, color, density, layout, component archetypes, and interaction affordances.
   - Describes how to later harden ranges into concrete `design-language.yaml`, generated helpers, lint rules, and playbooks.

### Updated pipeline understanding
The intended production path is now:

```text
this discussion + collaborative playbook
  -> intermediate semantic/archetype document
  -> intermediate graphic design/UX archetype document
  -> concrete widget DSL spec
  -> concrete playbooks
  -> computational codegen/linting/tools
  -> hard design guidelines
  -> concrete domain-specific design system instance
```

### Playbook refinement
Created `playbook/03-dmeta-design-system-factory-runthrough-playbook.md`, which turns this pipeline into a repeatable protocol with phases:

1. orientation/source import;
2. intermediate semantic/archetype model;
3. intermediate graphic design/UX archetype;
4. concrete schema design;
5. hard design rules;
6. widget DSL and generator design;
7. tooling/validation;
8. concrete domain instantiation.

## 2026-05-19 — Promoted long-term documents out of the ticket workspace

### What happened
The user asked to establish the emerging playbooks and design docs as long-term DMETA documents rather than keeping them only under the ticket workspace.

Updated the original imported collaborative playbook to reflect the current DMETA model: semantic archetypes, capabilities, capability-level presentations, composable archetypes, range-based graphic design archetype, concrete schema hardening, and the full path from collaboration to concrete domain instantiation.

Moved long-term playbooks to:

- `dmeta/playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md`
- `dmeta/playbooks/02-dmeta-design-system-factory-runthrough-playbook.md`

Moved long-term design docs to:

- `dmeta/design-docs/01-design-system-factory-vision-and-scope.md`
- `dmeta/design-docs/02-semantic-archetype-and-capability-model.md`
- `dmeta/design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md`

### Consequence
The ticket now acts as the historical workspace and source-import context. The root `dmeta/playbooks/` and `dmeta/design-docs/` directories are the durable starting points for future design-system factory work.

## 2026-05-19 — Concrete v0 planning and task creation

### What happened
After reviewing the HAIR-041 organization, we decided not to split the first DMETA concrete system into many YAML files. HAIR-041 used Markdown for reasoning, specification, playbooks, audits, and diary entries; YAML was reserved for source artifacts consumed by generators/validators. DMETA should follow that pattern.

### Decision
For DMETA v0, create three concrete Markdown specs and four minimal YAML sources:

**Markdown specs**
- `dmeta/design-docs/04-concrete-dmeta-system-spec.md`
- `dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md`
- `dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md`

**YAML sources**
- `dmeta/sources/dmeta-ir/00-index.yaml`
- `dmeta/sources/dmeta-ir/01-core-model.yaml`
- `dmeta/sources/dmeta-ir/02-design-language.yaml`
- `dmeta/sources/dmeta-ir/03-widgets.yaml`

### Rationale
YAML is only justified when tooling will consume it: generators, validators, runtime registries, lint rules, or synchronized manifests. Markdown remains the right format for rationale, examples, alternatives, design intent, and process.

### Task update
Added ticket tasks for the three concrete docs, the four minimal YAML artifacts, and the ongoing diary/changelog/commit hygiene work.

## 2026-05-19 — Concrete system spec written

### What happened
Created `dmeta/design-docs/04-concrete-dmeta-system-spec.md` as the top-level concrete v0 system architecture document.

### What the document covers
- The reduced v0 artifact layout.
- Markdown vs YAML policy.
- The four source YAML files and their responsibilities.
- System lifecycle from Markdown specs to YAML IR, validation, generation, manual promotion, Storybook, lint, and audit.
- Runtime adapter boundary and `PresentationRef` shape.
- First generic widget families.
- Domain pressure tests for AI agent workflows and retail logistics/order pipelines.
- Relationship to HAIR-041 and how DMETA extends it.
- Recommended implementation order and open questions.

### Validation
Marked task 12 complete. Updated `dmeta/README.md` to include the new document.

## 2026-05-19 — Core model and widget IR spec written

### What happened
Created `dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md`.

### What the document covers
- Concrete top-level shape for `01-core-model.yaml`.
- Archetype fields and validation rules.
- Capability fields, projections, and validation rules.
- Presentation fields, layer attachment rules, and validation rules.
- Action fields, accepted target selectors, argument modes, and validation rules.
- Domain example structure for agent workflows and retail logistics.
- Concrete top-level shape for `03-widgets.yaml`.
- Widget object shape, required fields, optional fields, initial widget inventory, design rules, validation rules, and generation targets.
- Manual pressure-test flows for both example domains.

### Validation
Marked task 13 complete. Updated `dmeta/README.md` to include the new document.

## 2026-05-19 — Design language and tooling spec written

### What happened
Created `dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md`.

### What the document covers
- Concrete top-level shape for `02-design-language.yaml`.
- Theme axes: density, neutral tone, type mode, radius, row treatment, surface separation, accent strategy.
- Typography roles in range-based and concrete forms.
- Density and spacing scales.
- Neutral and semantic color roles.
- Border/radius/elevation rules.
- Layout primitives.
- Presentation recipes linking core-model presentations to visual behavior.
- Interaction states.
- Data attribute conventions.
- Initial lint rule inventory.
- Tooling plan for validators, presentation/action registry generators, design helper generator, widget scaffold generator, design-system lint, and widget promotion validation.
- Implementation order for tooling and validation/lint staging.

### Validation
Marked task 14 complete. Updated `dmeta/README.md` to include the new document.

## 2026-05-19 — Minimal v0 YAML IR drafted

### What happened
Created the minimal consolidated YAML source artifacts under `dmeta/sources/dmeta-ir/`:

- `00-index.yaml`
- `01-core-model.yaml`
- `02-design-language.yaml`
- `03-widgets.yaml`

### Contents
`00-index.yaml` declares the IR package and points to the three source artifacts.

`01-core-model.yaml` consolidates:
- archetypes;
- capabilities and projections;
- presentation definitions;
- action definitions;
- agent workflow and retail logistics domain pressure-test examples;
- validation intent.

`02-design-language.yaml` captures:
- theme axes;
- typography ranges;
- density and spacing ranges;
- color semantics;
- border/elevation constraints;
- layout primitives;
- presentation recipes;
- interaction states;
- data attributes;
- lint rules.

`03-widgets.yaml` defines the first generic dense-operational widgets:
- `PresentationToken`;
- `StatusBadge`;
- `CompactReference`;
- `MetricCell`;
- `RecordStream`;
- `DenseTable`;
- `DetailDrawer`;
- `ActionPalette`.

### Validation
Ran a small PyYAML parse check over all four YAML files. It initially failed on `03-widgets.yaml` because the TypeScript-style union string `"left" | "right"` used `|`, which YAML interpreted as a block scalar marker. Fixed this by quoting the full union string as a single scalar. After the fix, all four YAML files parsed successfully.

### Task update
Marked tasks 15, 16, 17, and 18 complete.

## 2026-05-19 — Concrete documentation/YAML pass completed

### What happened
Completed the requested concrete documentation pass and committed at logical intervals.

### Commits
- `363c6a2` — Document DMETA design system factory foundations.
- `8e9bf87` — Add concrete DMETA system spec.
- `3796087` — Add DMETA core model and widget IR spec.
- `faef2cd` — Add DMETA design language and tooling spec.
- `2acffbe` — Add minimal DMETA v0 IR sources.

### Validation
Ran `docmgr doctor --ticket DMETA-001 --stale-after 30`; all checks passed. Marked task 19 complete for the diary/changelog/commit hygiene pass.

### Remaining work
The concrete docs and YAML source artifacts are drafts. The next implementation step is to build `01-validate-dmeta-ir.ts` or a small equivalent validator to enforce the references and invariants now described in the specs.

## 2026-05-19 — Visual design correction: no texture/grain

### What changed
The user clarified that the design system should not include paper grain, texture overlays, or any decorative background noise. The intended visual archetype is sober, subtle cool-grey/neutral, low-chrome, and visually quiet — closer to a clean dense operational surface than a textured paper metaphor.

### Files updated
- `dmeta/design-docs/01-design-system-factory-vision-and-scope.md`
- `dmeta/design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md`
- `dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md`
- `dmeta/sources/dmeta-ir/02-design-language.yaml`

### Validation
Searched the long-term docs and DMETA source IR for paper/grain/warm-paper references and removed/replaced them. Ran:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

The validator emitted `validation_ok` with no error-severity findings.

## 2026-05-19 — Core model split and enriched prose context

### What changed
The user clarified that the core-model YAML needs significantly more written context. Short labels are not enough: the documents, archetypes, and capabilities should carry enough prose for interns, reviewers, generated documentation, and LLM-assisted workflows to understand the semantics.

Because adding long descriptions to the existing monolithic `01-core-model.yaml` would make it too large, we split the core model into subfiles.

### New structure

```text
dmeta/sources/dmeta-ir/
  01-core-model.yaml
  core-model/
    core-model.yaml
    archetypes.yaml
    capabilities.yaml
    presentations.yaml
    examples/
      agent-workflow.yaml
      retail-logistics.yaml
```

`01-core-model.yaml` is now a package/index file with summary, long_summary, design-doc references, validation policy, and paths to subfiles.

### Enrichment added
- Added package-level `long_summary`.
- Added file-level `long_summary` sections for core-model subfiles.
- Added `references` pointing to relevant design docs.
- Added `long_description` for every archetype.
- Added `long_description` for every capability.
- Moved domain examples into one file per domain under `core-model/examples/`.

### Documentation updated
Updated the relevant playbooks and concrete specs to document the split structure and the requirement that core-model YAML carry both short and long prose context.

### Validator update
Updated the Go validator loader so `01-core-model.yaml` can act as a split package index. The loader now merges:

- core-model metadata;
- archetypes;
- capabilities;
- presentations/actions;
- domain examples.

### Validation
Ran:

```bash
GOWORK=off gofmt -w pkg/dmeta/validator/*.go
GOWORK=off go test ./...
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

All tests passed and the validator emitted `validation_ok`.
