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
