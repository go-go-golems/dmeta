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
RelatedFiles:
    - Path: dmeta/design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md
      Note: Source design archetype used to identify missing YAML guidance
    - Path: dmeta/sources/dmeta-ir/02-design-language.yaml
      Note: Enriched design-language IR with source guidance and rules from the graphic design archetype
ExternalSources: []
Summary: Chronological investigation diary for DMETA-001.
LastUpdated: 2026-05-19T17:36:00-04:00
WhatFor: Use to resume the ticket with context about source imports, scope corrections, design decisions, and open questions.
WhenToUse: Read before continuing DMETA-001 work or writing follow-up specs/playbooks.
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

## 2026-05-19 — Presentations and design-language prose expansion

### What changed
The user pointed out that presentations and the design-language YAML were still too terse for human readers. They need the same contextual treatment as archetypes and capabilities so interns, reviewers, generated documentation, and LLM-assisted workflows have enough semantic and design rationale.

### Files updated
- `dmeta/sources/dmeta-ir/core-model/presentations.yaml`
- `dmeta/sources/dmeta-ir/02-design-language.yaml`
- `dmeta/playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md`
- `dmeta/playbooks/02-dmeta-design-system-factory-runthrough-playbook.md`
- `dmeta/pkg/dmeta/validator/model.go`
- `dmeta/pkg/dmeta/validator/validate.go`

### Presentation/action expansion
Added `long_description` to every presentation and every action. The descriptions explain:

- when to use the presentation/action;
- what it means semantically;
- what UI behavior it implies;
- what boundaries it should respect;
- how it should behave across domains.

### Design-language expansion
Added explanatory context throughout `02-design-language.yaml`, including:

- document-level `long_summary`;
- `references` to design docs and core presentations;
- theme-axis descriptions;
- typography `long_summary` and role-level `long_purpose`;
- density descriptions;
- spacing/color/border/elevation/layout explanatory summaries;
- presentation recipe descriptions;
- interaction-state descriptions;
- data-attribute and lint-rule explanatory context.

### Playbook update
Updated the playbooks to require richer prose in formal YAML:

- formal presentations and actions should include `description` and `long_description`;
- design-language sections should include human-facing `long_summary`, `description`, `long_purpose`, or `long_description` where useful.

### Validator update
Updated validator model structs to load the new fields and added warnings for missing `long_description` on presentations and actions.

### Validation
Ran:

```bash
GOWORK=off gofmt -w pkg/dmeta/validator/*.go
GOWORK=off go test ./...
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

All tests passed and the validator emitted `validation_ok`.

## Step 7: Hair Booking Widget Baseline Comparison

This step returned to the HAIR-041 Admin DSL widget IR and compared its widget catalog against the much smaller DMETA v0 widget IR. The goal was not to copy the Hair Booking admin catalog wholesale, but to identify which helper widgets are actually domain-neutral infrastructure for dense operational systems.

The output is a new DMETA-001 design document that proposes an always-present widget baseline for log, agent, workflow, event, and table-oriented design systems. It separates DMETA's semantic widgets from generic helper widgets such as shells, page headers, panels, toolbars, filters, search, result controls, state displays, forms, overlays, and confirmations.

### Prompt Context

**User prompt (verbatim):** "so  let's go back to @hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/03-shell-widgets.yaml and @hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/05-layout-widgets.yaml and all the other widgets and compare that to ours. There's a significant of "generic" helper widgets in hair booking, and like, which ones would apply to all the log/dense/agent/workflow/events/table kind of design systems we are targeting? Which widgets should kind of always be present.

Write this up as a design-doc in DMETA-001 and upload to remarkable.

Keep a diary as you work (see skill)"

**Assistant interpretation:** Compare the Hair Booking widget IR against the DMETA widget IR, identify reusable generic helper widgets for dense operational design systems, document the recommendations under DMETA-001, upload the result to reMarkable, and keep the ticket diary updated.

**Inferred user intent:** Establish a practical baseline widget catalog for future DMETA-generated design systems so the project does not focus only on semantic presentation widgets while missing the ordinary UI infrastructure required by real applications.

**Commit (code):** N/A — documentation-only step at diary-writing time.

### What I did
- Read the Hair Booking widget IR files, especially shell/layout widgets and the rest of the widget catalog.
- Read the current DMETA widget IR at `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/03-widgets.yaml`.
- Used `docmgr doc add` to create `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/02-generic-widget-baseline-for-dense-operational-design-systems.md`.
- Wrote the design document with a tiered recommendation: semantic widgets already in DMETA, helper widgets that should become always-present, and optional/domain-specific packs.
- Related the new document to the Hair Booking source YAML files and the current DMETA widget IR with `docmgr doc relate`.

### Why
- DMETA's current widget IR has a strong semantic core, but it lacks common helper infrastructure that generated dense apps need.
- The Hair Booking IR provides a useful inventory of shell, layout, action, table, state, form, field, and surface widgets that are mostly not hair-booking-specific.
- A written baseline recommendation will guide the next expansion of `03-widgets.yaml` or a split widget package.

### What worked
- The Hair Booking widget catalog cleanly separated into generic baseline candidates and optional domain packs.
- The new design doc identifies always-present widgets such as `WorkbenchShell`, `PageHeader`, `Panel`, `Toolbar`, `ActionButton`, `ActionGroup`, `ContextMenuTrigger`, `FilterBar`, `SearchBox`, `PresentationCell`, `BulkActionBar`, `ResultWindowControls`, `EmptyState`, `LoadingState`, `InlineError`, `KeyValueList`, `OverlaySurface`, `ConfirmDialog`, and a narrowed `ActionParameterForm` field set.
- `docmgr doc relate` successfully updated the new design document's related file metadata.

### What didn't work
- N/A so far. The reMarkable upload is still pending at this point in the diary sequence.

### What I learned
- Hair Booking's media, calendar, image, and money widgets should be optional packs, not DMETA baseline widgets.
- Hair Booking's `ResourceTable` maps to DMETA's existing `DenseTable`, but `ResourceTableCell`, `BulkActionBar`, and `PaginationBar` reveal missing helper pieces around `DenseTable`.
- Hair Booking's `ActivityFeed` overlaps with DMETA's `RecordStream`; DMETA should avoid adding a second feed abstraction unless it is just a light wrapper.

### What was tricky to build
- The main tricky part was drawing a boundary between "generic helper" and "domain-specific carryover." Calendar, media, and money fields are reusable in some domains, but they are not universal for logs, agents, workflows, events, and dense tables. The solution was to classify widgets into always-present baseline, useful optional/dashboard-adjacent widgets, and domain packs.
- Another tricky part was preserving DMETA's semantic emphasis. The recommendation does not replace `PresentationToken`, `RecordStream`, `DenseTable`, `DetailDrawer`, or `ActionPalette`; it adds the boring infrastructure those widgets need to live in generated applications.

### What warrants a second pair of eyes
- Whether `ComparisonTable` belongs in Tier 1 baseline or should remain optional until comparison flows are implemented.
- Whether `OverlaySurface` should be public widget IR or internal infrastructure behind `DetailDrawer`, `ConfirmDialog`, and action parameter forms.
- Whether `DateField` and `TimeField` should remain separate or become one `DateTimeField` in DMETA.

### What should be done in the future
- Split `dmeta/sources/dmeta-ir/03-widgets.yaml` into a widget package similar to the split core model.
- Add baseline helper widgets as draft IR entries with rich prose.
- Update the validator to load split widget packages and warn on missing descriptive fields.
- Keep optional packs separate: dashboard, markdown/preview, calendar, media, finance/commerce.

### Code review instructions
- Start with the new design doc: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/02-generic-widget-baseline-for-dense-operational-design-systems.md`.
- Compare the mapping table against Hair Booking source files under `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/`.
- Validate doc metadata with `docmgr doctor --ticket DMETA-001 --stale-after 30`.

### Technical details
- Main DMETA source compared: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/03-widgets.yaml`.
- Main Hair Booking sources compared: `03-shell-widgets.yaml`, `04-action-widgets.yaml`, `05-layout-widgets.yaml`, `06-resource-widgets.yaml`, `07-data-display-widgets.yaml`, `10-form-widgets.yaml`, `10a-form-field-widgets.yaml`, and `11-surface-widgets.yaml`.

### Upload completion
Uploaded the new design document to reMarkable:

```text
OK: uploaded DMETA_001_Generic_Widget_Baseline.pdf -> /ai/2026/05/19/DMETA-001
```

## Step 8: Enrich Design-Language YAML from the Graphic Design Archetype

This step revisited `02-design-language.yaml` in light of the dense operational UI graphic design and UX archetype document. The YAML already had some machine-oriented ranges, but it did not put the backlink and human-language design intent in a visible enough place, and it was missing several rules from the Markdown source.

The update makes the design-language IR more useful as a source of truth for humans as well as future generators: it now names the archetype, lists aliases/core qualities/anti-goals, encodes layout/component archetypes, adds missing interaction rules, expands lint guidance, and explicitly links to the Markdown design document near the top of the file.

### Prompt Context

**User prompt (verbatim):** "the @dmeta/sources/dmeta-ir/02-design-language.yaml is missing a link back to @dmeta/design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md and i think we can ecode more of the rules and other guidance to the yaml itself. Can you examine the yaml in light of the md document, and amend with all you feel is missing. It doesn't need to be in formal form, often the human language part is very helpful."

**Assistant interpretation:** Compare the design-language YAML against the Markdown graphic-design archetype, add a clear source-document reference, and enrich the YAML with human-readable rules/guidance from the doc even where not yet formalized.

**Inferred user intent:** Make the YAML a richer shared design-language source that can guide interns, generated docs, LLM workflows, validators, and future tooling rather than acting only as a sparse machine token file.

**Commit (code):** N/A — pending commit at diary-writing time.

### What I did
- Read `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/02-design-language.yaml`.
- Read `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md`.
- Moved/expanded the design-document reference into a prominent top-level `references` block.
- Added `source_guidance` with archetype name, aliases, authoring note, core qualities, and anti-goals.
- Added missing typography, density, spacing, color, border/elevation, layout, component, presentation recipe, interaction, data-attribute, lint, and hardening guidance.
- Ran `GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table`.

### Why
- The Markdown doc contains important design constraints that future authors should not have to rediscover manually.
- The YAML is both generator input and human review material; prose belongs there when it explains intent and prevents visual drift.
- Making the backlink prominent reduces the chance that `02-design-language.yaml` becomes detached from its source rationale.

### What worked
- The enriched YAML still validates successfully with `validation_ok`.
- Added concrete missing guidance around core qualities, anti-goals, typography hard rules, per-surface density recommendations, app frame/master-detail/table/stream/process/command-palette layout rules, component archetypes, keyboard-first behavior, typed action guidance, runtime presentation attributes, and expanded lint rules.

### What didn't work
- N/A.

### What I learned
- The existing YAML already had a link at the bottom, but it was easy to miss and used a less explicit key. Moving the reference near the top and naming it after the dense operational UI document makes the provenance much clearer.
- Several important design rules were present only in prose Markdown: no marketing/product-page visual language, no texture/noise, no chip-for-every-token behavior, context-menu and keyboard parity, progressive disclosure for long payloads, and richer layout/component archetype rules.

### What was tricky to build
- The tricky part was deciding what belongs in formal typed sections versus what should remain human-language guidance. The solution was to add prose-rich sections such as `source_guidance`, `component_archetypes`, `hardening_guidance`, and `concrete_outputs` while keeping existing validated sections intact.
- Another subtle point was adding new presentation recipes and typography roles without breaking validator checks. I added a `section_heading` typography role before referencing it from the `section_heading` recipe.

### What warrants a second pair of eyes
- Whether the new top-level prose sections should eventually become part of the formal Go validator model or remain ignored-by-validator authoring guidance for now.
- Whether `data_attributes.required_for_presentations` should distinguish always-required runtime attributes from optional/recommended attributes such as `source-path`.
- Whether the new lint rules should remain warnings/errors as written once generated helpers exist.

### What should be done in the future
- Consider updating the validator model to preserve/validate selected prose sections like `source_guidance`, `component_archetypes`, and `hardening_guidance`.
- If a design-language generator is added, emit docs/helpers from the enriched human-language sections, not only token values.
- Add tests around design-language style recipe references if the file continues to grow.

### Code review instructions
- Start with `sources/dmeta-ir/02-design-language.yaml` and compare it against `design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md`.
- Confirm the prominent `references.dense_operational_ui_graphic_design_and_ux_archetype` path is correct from `sources/dmeta-ir`.
- Validate with `GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table`.

### Technical details
- Validation output included `validation_ok` and no error-severity findings.
- Also ran `GOWORK=off go test ./...`; all packages passed.

## Step 9: Filter Semantics Reflection for Event-Oriented DMETA Applications

This step returned to the core DMETA semantic model and examined a missing axis: filtering. The existing archetypes and capabilities already mention filter operators, but they do not yet distinguish the surface being filtered, the object used as a filter value, and pure filter objects such as active criteria, facets, and presets.

The output is a new DMETA-001 design document intended for an intern or future implementer. It explains the current model, identifies the gap, proposes new archetypes and capabilities, sketches runtime APIs, and gives implementation steps for adding filtering to high-density event-oriented DMETA applications.

### Prompt Context

**User prompt (verbatim):** "Ok, let's go back to @dmeta/design-docs/ and @dmeta/sources/dmeta-ir/core-model/archetypes.yaml and @dmeta/sources/dmeta-ir/core-model/capabilities.yaml . Let's reflect, within the context of DMETA-001 (docmgr ticket) what our archetypes are, and how things could potentially be improved or dapted. I think one big thing we forgot is filtering. Some things are pure filters. Some objects can be used as filter (for example, filtering by agent session by client on a session id), some objects can be filtered (event streams). 

Create a document where we reflect on that and how this impacts our current meta design system for high density / event oriented applications.

Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable.

Keep a diary as you work."

**Assistant interpretation:** Re-examine the current DMETA archetype/capability model through the lens of filtering, write a detailed intern-facing DMETA-001 design guide, relate it to the relevant source files, upload it to reMarkable, and record the work in the ticket diary.

**Inferred user intent:** Make filtering a first-class part of the meta design system before implementation work hardens the current model around only objects, presentations, and actions.

**Commit (code):** N/A — documentation-only step at diary-writing time.

### What I did
- Read the current semantic/model files:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/design-docs/02-semantic-archetype-and-capability-model.md`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/design-docs/04-concrete-dmeta-system-spec.md`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/archetypes.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/capabilities.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/presentations.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/03-widgets.yaml`
- Created a new DMETA-001 design document:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/03-filter-semantics-for-high-density-event-oriented-dmeta-applications.md`
- Proposed a filtering model that distinguishes filter targets, filter dimensions, filter value sources, filter expressions, filter criteria, and filter presets.
- Proposed possible additions: `ResultSet`, `FilterCriterion`, optional `FilterSpec`/`FilterPreset`, `filterable`, `filter_source`, `searchable`, `facetable`, `sortable`, and `windowable`.
- Added pseudocode, Mermaid diagrams, TypeScript-style API references, YAML sketches, implementation phases, and concrete examples for agent sessions and event streams.
- Related the new document to the relevant source and design files via `docmgr doc relate`.
- Validated frontmatter and ran `docmgr doctor` for DMETA-001.
- Uploaded the document to reMarkable:
  - `OK: uploaded DMETA 001 Filter Semantics.pdf -> /ai/2026/05/20/DMETA-001`

### Why
- Filtering is central to dense operational and event-oriented applications; users navigate these systems by narrowing streams, tables, queues, and result sets.
- The existing model listed filter operators on capabilities, but did not model the filter target/source/criterion distinction.
- Without a formal filter model, filtering would likely become ad hoc widget state instead of a semantic presentation/action capability.

### What worked
- The existing capability model already had useful filter operator hints, which made it easy to show continuity rather than redesigning from scratch.
- The distinction between `filterable` and `filter_source` cleanly captured the user's examples: event streams can be filtered, while sessions/clients/statuses can be used as filters.
- The previous generic widget baseline document provided a good bridge to `FilterBar`, `SearchBox`, and `ResultWindowControls`.
- `docmgr validate frontmatter` and `docmgr doctor` passed after using the correct doc path.
- reMarkable upload succeeded in one command.

### What didn't work
- I first ran `docmgr validate frontmatter` with a `ttmp/...` path from the repo root, which docmgr interpreted as `ttmp/ttmp/...` and failed:

```text
Error: open /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/03-filter-semantics-for-high-density-event-oriented-dmeta-applications.md: no such file or directory
```

- Re-running with the path relative to the docs root fixed it:

```text
docmgr validate frontmatter --doc 2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/03-filter-semantics-for-high-density-event-oriented-dmeta-applications.md --suggest-fixes
```

### What I learned
- The current DMETA model is strong for individual semantic subjects but needs a collection/query layer for event streams, tables, queues, and result windows.
- `streamable` currently means a subject can appear in an ordered stream; it does not mean the stream itself is a semantic filter target.
- Active filters should be treated as semantic presentations, not just UI decoration.

### What was tricky to build
- The main tricky point was avoiding an overlarge taxonomy. Filtering could justify many new concepts, but the practical starting point is smaller: `ResultSet`, `FilterCriterion`, `filterable`, and `filter_source`.
- Another subtle point was naming. `filter_source` describes a semantic object that can derive a filter expression better than `filter_value`, because many sources are full objects or relation refs rather than scalar values.

### What warrants a second pair of eyes
- Whether `ResultSet` should become a formal archetype or remain widget/adapter state.
- Whether `FilterCriterion` should be an archetype or a presentation-only runtime object.
- Whether `filter_source` is the right capability name.
- Whether `EventStream` should remain represented as `ResultSet + stream/window capabilities` or become a first-class archetype.

### What should be done in the future
- Implement the minimal IR additions in `archetypes.yaml`, `capabilities.yaml`, and `presentations.yaml` if the proposed direction is accepted.
- Update the widget IR with `FilterBar`, `SearchBox`, and `ResultWindowControls` contracts.
- Add validator rules for filter dimensions/operators once those are formalized.
- Pressure-test the model in `agent-workflow.yaml` and `retail-logistics.yaml`.

### Code review instructions
- Start with the new design doc listed above.
- Compare the proposed additions against:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/archetypes.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/capabilities.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/presentations.yaml`
- Validate ticket hygiene with:

```bash
docmgr doctor --ticket DMETA-001 --stale-after 30
```

### Technical details
- New document path: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/03-filter-semantics-for-high-density-event-oriented-dmeta-applications.md`
- reMarkable destination: `/ai/2026/05/20/DMETA-001`

## Step 10: Accept and Implement Filter Semantics in the Core Model IR

This step accepted the filter-semantics proposal from Step 9 and moved the minimum useful parts into the formal DMETA core-model YAML. The update keeps the model conservative: it adds first-class filter/result concepts and examples, but does not yet change generator output, widget IR, or backend adapter code.

The core semantic distinction is now present in the IR: `ResultSet` is the filter target, `filter_source` subjects can derive constraints, and `FilterCriterion` represents active filters as semantic objects. This gives future widgets and generators a stable vocabulary for FilterBar, SearchBox, RecordStream, DenseTable, and ResultWindowControls work.

### Prompt Context

**User prompt (verbatim):** "Yes, accept, update the core-model in the dmeta-ir.

Keep a diary, and commit at appropriate intervals.

After updating the YAML, what will you do? Stop and answer."

**Assistant interpretation:** Implement the accepted filtering model in the formal DMETA core-model YAML files, record the work, commit it, and then stop to report what was done and what would come next instead of continuing into widget/tooling implementation.

**Inferred user intent:** Promote the filter design from analysis into the IR source of truth while keeping the work bounded to YAML and documentation bookkeeping for this turn.

**Commit (code):** N/A — pending commit at diary-writing time.

### What I did
- Updated `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/archetypes.yaml` with:
  - `ResultSet`
  - `FilterCriterion`
  - `FilterSpec`
  - `FilterPreset`
- Updated `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/capabilities.yaml` with:
  - `filterable`
  - `filter_source`
  - `searchable`
  - `facetable`
  - `sortable`
  - `windowable`
- Updated `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/presentations.yaml` with filter presentations:
  - `filter_chip`
  - `filter_dimension_label`
  - `filter_value_token`
  - `filter_summary`
  - `search_summary`
  - `facet_bucket`
- Added filter actions in `presentations.yaml`:
  - `apply_filter`
  - `remove_filter`
  - `clear_filters`
  - `replace_filter`
  - `filter_by_relation`
  - `apply_search`
  - `clear_search`
  - `apply_facet_filter`
- Updated domain examples:
  - `agent-workflow.yaml` now includes `Client`, filter-source mappings for `Agent`/`Session`, and `AgentEventResultSet`.
  - `retail-logistics.yaml` now includes filter-source mappings for `Carrier`/`ScanEvent` and `ScanEventResultSet`.
- Ran YAML parse validation and the DMETA IR validator.
- Ran Go tests.

### Why
- The accepted design needs to be represented in the tool-consumed IR before widgets, generators, or adapters can depend on it.
- Formalizing the terms prevents filtering from becoming local widget state in `FilterBar`, `DenseTable`, or `RecordStream`.
- The domain examples make the model concrete for agent/session/client filtering and logistics scan-event filtering.

### What worked
- The new archetypes/capabilities/presentations fit into the split core-model package without changing the loader.
- The existing validator successfully checked references after the new entries were added.
- Validation passed:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

Output included:

```text
validation_ok | package | DMETA IR package has no error-severity findings
```

- Tests passed:

```bash
GOWORK=off go test ./...
```

### What didn't work
- The first YAML parse/validation run failed because two newly added prose `long_description` values contained an unquoted colon in a wrapped plain scalar:

```text
yaml.scanner.ScannerError: mapping values are not allowed here
  in "sources/dmeta-ir/core-model/presentations.yaml", line 440, column 24
Error: load split core model: load capabilities: yaml: line 368: mapping values are not allowed in this context
```

- I fixed this by converting the affected descriptions to folded block scalars (`long_description: >`).

### What I learned
- The current split YAML model can absorb new semantic vocabulary cleanly when every cross-reference is added together: archetypes first, capabilities second, presentations/actions third, examples last.
- Long human-readable YAML descriptions should use folded scalars whenever they contain colons, semicolons, or punctuation-heavy prose.
- The existing validator checks references but does not yet validate filter operator compatibility, filter dimensions, or action argument semantics beyond known modes and selectors.

### What was tricky to build
- The main tricky part was keeping the implementation bounded. The accepted design includes runtime APIs, widget contracts, validator rules, and generator targets, but this step intentionally only updated core-model YAML. That prevents a large cross-cutting implementation from happening before the vocabulary is reviewed.
- Another tricky point was avoiding unknown style recipes. New filter presentations were added without style recipes for now, so the core model remains valid until the design-language YAML gains formal filter recipes.

### What warrants a second pair of eyes
- Whether `FilterSpec` and `FilterPreset` should remain formal archetypes now, or whether they should be deferred until generators use them.
- Whether `sortable` and `windowable` belong in core capabilities now or should wait for ResultWindowControls implementation.
- Whether the new actions should eventually introduce validator-supported modes such as `current_filter_target` and `inferred_or_choice` instead of using current generic modes like `choice`.

### What should be done in the future
- Add filter-specific style recipes to `02-design-language.yaml`.
- Add FilterBar/SearchBox/ResultWindowControls widget IR entries.
- Add generator/runtime types such as `FilterTargetRef`, `FilterDimension`, and `FilterExpression`.
- Add validator checks for filter dimensions, operator compatibility, and filter-source/target matching.

### Code review instructions
- Start with the diff in:
  - `sources/dmeta-ir/core-model/archetypes.yaml`
  - `sources/dmeta-ir/core-model/capabilities.yaml`
  - `sources/dmeta-ir/core-model/presentations.yaml`
  - `sources/dmeta-ir/core-model/examples/agent-workflow.yaml`
  - `sources/dmeta-ir/core-model/examples/retail-logistics.yaml`
- Validate with:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
GOWORK=off go test ./...
```

### Technical details
- No Go source changed in this step.
- Validation currently ensures references resolve and known argument modes are used; deeper filter semantics are future validator work.

## Step 11: Reframe Widgets as Selectable Templates for Concrete DMETA Instances

This step corrected the widget direction for DMETA as a meta design-system factory. The earlier "baseline widgets" framing was useful as an inventory, but too strong as a commitment: concrete systems should select and adapt widget templates rather than receive one fixed catalog of generated components.

The output is a new intern-facing design document that explains how `03-widgets.yaml` should evolve into a `widget-templates/` package, how concrete instance manifests should select/adapt templates, and how code generation changes from "scaffold everything" to "resolve and scaffold selected templates only."

### Prompt Context

**User prompt (verbatim):** "So we actually want to work on the widgets. I think because we are building a meta design-system, we shouldn't nail down widgets all too quickly. Instead we should provide a set of widget templates, and a concrete instantiation of the meta design system can then chose a selection of those widgets and modify them to fit. 

For example, if we decide to create a book OCR application at scale, and want a dashboard for that, but only need one big dashboard display, we don't need to have Tabs / Drawers / Splitpanes, for example, and the search bar would need to be adjusted to autocomplete different types of information and display that, or some other stuff. Similarly KeyValue and ComparisonTable really are rare items to use. etc...

See @dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/02-generic-widget-baseline-for-dense-operational-design-systems.md which imo are all widgets that need to be selected and also adapted to concrete cases. The same is true already (although to a lesser degree, since they are all relevant to event/dense applications in general) to @dmeta/sources/dmeta-ir/03-widgets.yaml .

We should, next to core-model/, have a folder widget-templates/ with a whole set of files for different types of widgets "templates" (we can keep the current format).

How would that influence our code generation, and analyze the situation in detail. 

Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable."

**Assistant interpretation:** Write a DMETA-001 design guide that reframes widgets as selectable/adaptable templates, proposes a `widget-templates/` package beside `core-model/`, and explains the resulting changes to code generation, validation, instance manifests, and promotion workflow.

**Inferred user intent:** Prevent DMETA from hardening too early into one fixed dense UI kit, and keep it flexible enough to generate specialized concrete design systems such as book OCR dashboards, agent consoles, and logistics workbenches.

**Commit (code):** N/A — documentation-only step at diary-writing time.

### What I did
- Created a new DMETA-001 design document:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/04-widget-templates-and-instance-selection-for-dmeta-meta-design-systems.md`
- Reinterpreted the previous generic-widget baseline as a candidate template inventory rather than a mandatory baseline.
- Proposed a new `sources/dmeta-ir/widget-templates/` structure with files for presentations, streams, tables, filters, actions, surfaces, layout, dashboards, forms, states, and optional data-display packs.
- Proposed instance manifests with `selected_templates`, `excluded_templates`, aliases, variants, adaptations, and selection reasons.
- Explained how code generation changes from scaffolding every widget in `03-widgets.yaml` to resolving selected templates from an instance manifest.
- Added diagrams, YAML sketches, TypeScript-style APIs, pseudocode, validation rules, generator commands, implementation phases, and an intern checklist.
- Related the new document to `03-widgets.yaml`, the previous widget baseline doc, the filter semantics doc, core system specs, and presentation/action contracts.
- Validated frontmatter and ticket hygiene.
- Uploaded the document to reMarkable:
  - `OK: uploaded DMETA 001 Widget Templates.pdf -> /ai/2026/05/20/DMETA-001`

### Why
- DMETA is a meta design-system factory; widgets should be available starting points rather than mandatory product commitments.
- Concrete applications vary strongly. A book OCR dashboard, event debugging console, and logistics queue need different selections and adaptations.
- Code generation must avoid unused scaffolds, irrelevant Storybook stories, and premature design commitments.

### What worked
- The existing `03-widgets.yaml` shape remains reusable as a template format; the design only adds selection/adaptation/variant metadata.
- The previous widget baseline document remains valuable after reinterpretation as template inventory.
- The filter semantics document provided a concrete example of why templates like `FilterBar`, `SearchBox`, and `ResultWindowControls` need instance-specific adaptation.
- `docmgr validate frontmatter` and `docmgr doctor` passed.
- reMarkable upload succeeded in one command.

### What didn't work
- My first `docmgr doc relate --doc` used a docs-root-relative path that did not resolve for this subcommand:

```text
Error: expected exactly 1 doc for --doc "2026/05/19/DMETA-001--.../design-doc/04-widget-templates-and-instance-selection-for-dmeta-meta-design-systems.md", got 0
```

- Re-running with the absolute document path fixed the relation update.

### What I learned
- The current widget problem is not only file organization; it is semantic status. A widget entry should mean "template available to be selected," not "component every instance must contain."
- Code generation needs an instance-planning phase before scaffolding. The generator should produce a plan/report that lists selected templates, excluded templates, missing adaptations, dependencies, warnings, and output files.
- Exclusions are useful artifacts. Saying "no Tabs because the OCR dashboard is one fixed display" is part of design intent.

### What was tricky to build
- The tricky part was preserving the value of the prior widget baseline without invalidating it. The solution is to reinterpret its widgets as selectable/adaptable templates, with selection guidance and avoid-when metadata.
- Another tricky point was code-generation scope. The document proposes generator architecture and APIs but deliberately does not implement the split yet, because the next step should be a reviewed IR/package change.

### What warrants a second pair of eyes
- Whether `03-widgets.yaml` should immediately become a pure package index or temporarily remain monolithic for compatibility.
- Which concrete instance should be the first pressure test: book OCR dashboard, agent event console, logistics queue, or another app.
- How formal adaptation-point schemas should be in v0: prose, loose maps, or validator-enforced types.

### What should be done in the future
- Create `sources/dmeta-ir/widget-templates/00-index.yaml` and split the existing widget entries into template files.
- Add selection/adaptation/variant metadata to the initial templates.
- Add an example instance manifest.
- Update the validator and generator to load templates and plan selected instances.

### Code review instructions
- Start with the new design doc listed above.
- Compare its proposal against:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/03-widgets.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/02-generic-widget-baseline-for-dense-operational-design-systems.md`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/design-doc/03-filter-semantics-for-high-density-event-oriented-dmeta-applications.md`
- Validate ticket hygiene with:

```bash
docmgr doctor --ticket DMETA-001 --stale-after 30
```

### Technical details
- reMarkable destination: `/ai/2026/05/20/DMETA-001`
- This step changed only ticket documentation, diary, and changelog.

## Step 12: Phase 1 — Clean Cutover to Split Widget Templates

This step began the implementation of the widget-template model by changing the formal source IR rather than adding a compatibility layer. The former monolithic `03-widgets.yaml` is now a package entrypoint for split files under `sources/dmeta-ir/widget-templates/`, and the validator expects that clean structure.

The key behavior change is semantic: widgets in the source package are now selectable templates for concrete instances, not an implied fixed baseline catalog. The existing base templates were preserved but moved into category files so future template groups can be added without making every instance generate every widget.

### Prompt Context

**User prompt (verbatim):** "- No compabitility / backwards csompatibility / wrappers needed, we can do a clean cutover.
- the instance manifest should be in the instantiations directory.  that instance can come with its own widgets (and maybe templates?) as well.
- create the instance manifest for @dmeta/examples/street-deli-ordering/ and generate the code (under @dmeta/examples/street-deli-ordering/ as well, to keep every in a toplevel directory


- Add tasks and phases to DMETA-001 and go through them one by one, commit at appropriate level, keep a diary as you work"

**Assistant interpretation:** Implement the widget-template cutover without compatibility shims, then create a street-deli instantiation with local templates and generated code under the example directory, while tracking phases as DMETA-001 tasks and committing at logical milestones.

**Inferred user intent:** Move from design discussion to implementation while keeping DMETA's meta-design-system structure clean and instance-oriented.

**Commit (code):** N/A — pending commit at diary-writing time.

### What I did
- Added DMETA-001 tasks for four phases: widget-template cutover, street-deli instantiation manifest, instance code generation, and validation/bookkeeping.
- Created `sources/dmeta-ir/widget-templates/` with split template files:
  - `00-index.yaml`
  - `presentations.yaml`
  - `streams.yaml`
  - `tables.yaml`
  - `surfaces.yaml`
  - `actions.yaml`
- Replaced `sources/dmeta-ir/03-widgets.yaml` with a clean widget-template package index using `artifact_type: dmeta_widget_template_package`.
- Updated `sources/dmeta-ir/00-index.yaml` so the widgets artifact points to `dmeta_widget_template_package`.
- Updated the validator model and loader so `03-widgets.yaml` is loaded as a split widget-template package and each subfile uses `artifact_type: dmeta_widget_templates`.
- Ran validation:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

### Why
- The user explicitly asked for a clean cutover with no backwards-compatibility wrapper.
- A split `widget-templates/` directory matches the existing split `core-model/` design and keeps template categories reviewable.
- Loading templates through the validator ensures future generators consume the same package structure as validation.

### What worked
- The split package validates successfully.
- The existing base widgets fit into category files without changing their core contract shape.
- The validator loader could be kept small because there is no monolithic fallback path.

### What didn't work
- N/A in this phase.

### What I learned
- The existing `Widget` struct was close enough to reuse for templates by adding template metadata fields.
- Clean cutover is simpler than compatibility: the loader can fail fast if `03-widgets.yaml` is not `dmeta_widget_template_package`.

### What was tricky to build
- The main tricky point was preserving current widget data while changing its meaning from concrete catalog to template package. The solution was to move entries into category files and add `template` metadata for selection/adaptation guidance.

### What warrants a second pair of eyes
- Whether the initial category split is granular enough or whether layout/filter/state templates should be added immediately.
- Whether the current template metadata is sufficiently formal for future instance validation.

### What should be done in the future
- Add additional template categories from the design guide: filters, layout, dashboards, forms, states, data-display.
- Tighten validator checks for template selection metadata and adaptation points.

### Code review instructions
- Start with `sources/dmeta-ir/03-widgets.yaml`, then inspect `sources/dmeta-ir/widget-templates/*.yaml`.
- Review `pkg/dmeta/validator/load.go` to confirm there is no monolithic widget fallback.
- Validate with `GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table`.

## Step 13: Phases 2-3 — Street Deli Instantiation Manifest and Selected Widget Scaffolding

This step added the first concrete widget-template instantiation. The Street Deli example now owns a local `widget-templates/` package and an `instantiations/street-deli-ordering.yaml` manifest that selects only the widgets needed for the ordering flow. The generated code is written under `examples/street-deli-ordering/generated/widgets/`, keeping the example self-contained.

The generator now uses the instance manifest as the boundary between the meta design system and a concrete design-system instance. It merges global templates with local instance templates, resolves selected template ids, applies instance aliases/variants in metadata, and scaffolds only the selected components.

### Prompt Context

**User prompt (verbatim):** (same as Step 12)

**Assistant interpretation:** Continue the clean implementation by adding local street-deli templates, creating the instance manifest under an `instantiations/` directory, implementing generator support, and generating the selected scaffolds under the example directory.

**Inferred user intent:** Demonstrate that DMETA can instantiate a concrete app-specific widget set without forcing every global template into the generated output.

**Commit (code):** N/A — pending commit at diary-writing time.

### What I did
- Created local street-deli template package files:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/widget-templates/00-index.yaml`
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/widget-templates/ordering-flow.yaml`
- Replaced the example's `03-widgets.yaml` with a local widget-template package index.
- Created the instance manifest:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`
- Selected concrete widgets including:
  - `StreetDeliMenuBrowser`
  - `StreetDeliCompositionCard`
  - `StreetDeliCompositionCustomizer`
  - `StreetDeliIngredientRow`
  - `StreetDeliSubstitutionChip`
  - `StreetDeliOrderCart`
  - `StreetDeliOrderTracker`
  - `StreetDeliRoleTag`
- Explicitly excluded generic templates such as `dmeta.detail_drawer`, `dmeta.dense_table`, `dmeta.record_stream`, and `dmeta.action_palette` with reasons.
- Added `dmeta scaffold-instance` CLI command.
- Added `pkg/dmeta/generator/widgets/` with instance loading, template resolution, scaffold rendering, and file writing.
- Generated selected widget scaffolds under:
  - `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/generated/widgets/`
- Ran dry-run and actual generation:

```bash
GOWORK=off go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table
GOWORK=off go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --force --output table
```
- Validated and tested:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
GOWORK=off go test ./...
```

### Why
- The user requested the instance manifest under an `instantiations` directory and generated code under the street-deli example directory.
- Street Deli needs app-specific widgets and should not inherit irrelevant dense/table/stream widgets by default.
- A real instantiation proves that the widget-template split is not just documentation.

### What worked
- The instance manifest can point at global DMETA IR and local template files.
- The generator wrote only selected widgets, not excluded or unselected templates.
- The generated metadata preserves template id, instance id, selected alias, variant, and reason.
- The street-deli example remains self-contained: local templates, manifest, and generated code are all under `examples/street-deli-ordering/`.

### What didn't work
- The original example `03-widgets.yaml` could not be parsed as YAML because some prose fields used plain scalars with punctuation-heavy text. Rather than preserve that monolithic file, I replaced it with a clean local template package index and wrote valid local template files.

### What I learned
- Instance manifests need local template sources; otherwise concrete apps like Street Deli have to overload the global catalog with domain-specific widgets.
- A generator planning/dry-run mode is useful before writing dozens of scaffold files.
- Even simple generated scaffolds are enough to test the selection model because they produce component/type/story/metadata files only for chosen templates.

### What was tricky to build
- Path resolution was the main sharp edge. The manifest lives in `examples/street-deli-ordering/instantiations/`, so local template paths and output paths are resolved relative to the manifest directory. The global IR root is also manifest-relative unless passed explicitly by CLI flag.
- Another tricky point was TypeScript type generation. The scaffolder emits placeholder `unknown` aliases for domain view-model types so generated props can reference names like `MenuCategoryViewModel[]` without requiring the domain model to exist yet.

### What warrants a second pair of eyes
- Whether generated widgets should live under `generated/widgets/` or under a more package-like path such as `generated/street-deli-ordering-widgets/`.
- Whether the manifest should have an explicit `local_template_packages` field instead of raw `local_template_files`.
- Whether selected template variants should be validated against formal variant definitions next.

### What should be done in the future
- Add `plan-instance` as a separate command that reports selected/excluded templates and missing adaptations without rendering files.
- Add validator support for `dmeta_instance` manifests.
- Add formal variant/adaptation schemas to widget templates.
- Promote generated street-deli scaffolds into real React widgets only when a concrete package/storybook target exists.

### Code review instructions
- Start with `examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`.
- Review local templates in `examples/street-deli-ordering/widget-templates/ordering-flow.yaml`.
- Review the generator in `pkg/dmeta/generator/widgets/` and CLI wiring in `pkg/dmeta/cmds/scaffold_instance.go` plus `cmd/dmeta/main.go`.
- Regenerate with `GOWORK=off go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --force --output table`.

### Technical details
- Generated files are intentionally scaffolds with metadata sidecars.
- Existing generated files are skipped unless `--force` is passed.
- There is no compatibility loader for monolithic `03-widgets.yaml`; source and example widgets use package-index form.
