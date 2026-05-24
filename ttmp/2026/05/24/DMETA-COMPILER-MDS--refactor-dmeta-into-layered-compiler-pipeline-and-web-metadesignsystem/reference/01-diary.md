---
Title: Diary
Ticket: DMETA-COMPILER-MDS
Status: active
Topics:
    - dmeta
    - design-system
    - compiler-ir
    - metadesignsystem
    - react
    - code-generation
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/dmeta/cmds/plan_instance.go
      Note: Current planner command referenced by Step 1 validation and future implementation plan
    - Path: pkg/dmeta/generator/widgets/render.go
      Note: Current scaffold generator inspected while writing Step 1
    - Path: ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md
      Note: Primary design guide created during Step 1
    - Path: ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md
      Note: Expanded phased implementation checklist recorded in Step 2
ExternalSources: []
Summary: Chronological implementation diary for the layered compiler pipeline and Web MetaDesignSystem refactor design ticket.
LastUpdated: 2026-05-24T18:25:00-04:00
WhatFor: Use to resume or review the DMETA-COMPILER-MDS design/documentation work, including commands run, evidence gathered, and delivery status.
WhenToUse: Read before continuing implementation planning or starting code changes for the compiler pipeline refactor.
---



# Diary

## Goal

This diary records the setup, investigation, documentation, validation, and delivery work for ticket `DMETA-COMPILER-MDS`. The ticket captures the plan to refactor DMETA into a layered design-system compiler with Interaction IR, a Web MetaDesignSystem, and a React code-generation target.

## Step 1: Create the ticket, gather evidence, and write the implementation guide

The first step created a new docmgr ticket and turned the previous architecture discussion into an implementation-oriented design guide. The guide is intended for a new intern, so it starts from the current DMETA repository structure, explains the existing validator/planner/generator flow, and then introduces the target compiler pipeline with concrete YAML schemas, Go API sketches, pseudocode, diagrams, validation rules, and migration phases.

The important decision in this step was to keep the current working Street Deli React path as the acceptance test. The guide does not propose replacing the existing generator in one large rewrite. Instead, it proposes adding compatibility fields first, then introducing Interaction IR, then defining the Web MetaDesignSystem, then splitting React scaffold generation into a plan/render sequence.

### Prompt Context

**User prompt (verbatim):** "Ok, ltet's create a new docmgr ticket and indeed create a design doc to transform what we currently have into this new framework, from the tools to the existing templates / yaml files, to the concrete deli representation, creating a MetaDesignSystem for web style UIs, and a concrete react targeting set of tools. We will build a dedicated CLIM style MetaDesignSystem (which then targets a final React CLIM framework concrete representation) in a separate ticket.

Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable.

Keep a diary as you work."

**Assistant interpretation:** Create a new structured docmgr ticket for the DMETA compiler-pipeline refactor, write a long intern-ready design and implementation guide, keep a chronological diary, validate ticket hygiene, and upload the resulting documentation to reMarkable.

**Inferred user intent:** Establish a durable implementation reference before changing DMETA code, so future work on Interaction IR, Web MetaDesignSystem schemas, React targeting, and Street Deli migration has a precise shared vocabulary and file-level roadmap.

**Commit (code):** N/A — this step created ticket documentation only; no source code was changed.

### What I did

- Created ticket `DMETA-COMPILER-MDS`:
  - Title: `Refactor DMETA into layered compiler pipeline and web MetaDesignSystem`
  - Topics: `dmeta`, `design-system`, `compiler-ir`, `metadesignsystem`, `react`, `code-generation`
- Created the primary design document:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md`
- Created this diary:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/reference/01-diary.md`
- Added ticket tasks for architecture mapping, writing, relating files, validation, and reMarkable upload.
- Gathered current-state evidence from the repository with line references, including:
  - `cmd/dmeta/main.go`
  - `pkg/dmeta/validator/model.go`
  - `pkg/dmeta/validator/inheritance.go`
  - `pkg/dmeta/validator/validate.go`
  - `pkg/dmeta/generator/widgets/model.go`
  - `pkg/dmeta/generator/widgets/load.go`
  - `pkg/dmeta/generator/widgets/render.go`
  - `pkg/dmeta/cmds/plan_instance.go`
  - `sources/dmeta-ir/03-widgets.yaml`
  - `sources/dmeta-ir/widget-templates/presentations.yaml`
  - `examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`
  - `examples/street-deli-ordering/core-model/street-deli-ordering.yaml`
  - `examples/street-deli-ordering/core-model/archetypes.yaml`
  - `examples/street-deli-ordering/core-model/capabilities.yaml`
  - `examples/street-deli-ordering/widget-templates/customization.yaml`
  - `examples/street-deli-ordering/widget-templates/substitutions.yaml`
  - generated and promoted Street Deli React files.
- Ran current validation commands to confirm the baseline still passes:
  - `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table`
  - `go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table`
- Related seven key source files to the design doc using `docmgr doc relate` with absolute file paths.
- Ran `docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30`.
- Added missing vocabulary entries for `compiler-ir` and `metadesignsystem` after doctor reported unknown topics.
- Re-ran doctor and confirmed all checks passed.
- Uploaded the design-guide/diary bundle to reMarkable at `/ai/2026/05/24/DMETA-COMPILER-MDS`.

### Why

- The requested refactor is broad enough that implementation should not start from scattered chat context or a single high-level article. It needs a ticket-local design document that can serve as the implementation contract.
- The current repository already contains several working pieces of the compiler pipeline. The design guide needed to explain those pieces before proposing new schemas and commands.
- The Street Deli example is the best acceptance test because it exercises semantic inheritance, local widget templates, instance planning, generated metadata, promoted React components, Storybook stories, and runtime data attributes.

### What worked

- `docmgr ticket create-ticket` created the ticket workspace cleanly.
- `docmgr doc add` created both the design doc and diary with the expected frontmatter.
- The current DMETA validation commands passed:
  - `validate-ir` returned `validation_ok`.
  - `plan-instance` returned the expected eight selected Street Deli templates and six exclusions.
- The existing repository structure had enough line-referenced evidence to make the guide concrete rather than speculative.
- `docmgr doc relate` successfully attached seven key source files to the design doc.
- `docmgr vocab add` resolved the only doctor warning.
- `docmgr doctor` passed after vocabulary updates.
- `remarquee upload bundle` returned `OK: uploaded DMETA COMPILER MDS Refactor Guide.pdf -> /ai/2026/05/24/DMETA-COMPILER-MDS`.

### What didn't work

- Initial `docmgr doctor` reported unknown topics:

```text
1) [warning] Unknown vocabulary value for Topics
File: /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/index.md
Field: Topics
Value: "compiler-ir,metadesignsystem"
Known values: chat, backend, websocket, design-system, dsl, presentation-based-ui, code-generation, react, deployment, kubernetes, static-sites, dmeta
```

- The fix was to add the two missing vocabulary entries:

```bash
docmgr vocab add --category topics --slug compiler-ir --description "Compiler-style intermediate representation, passes, lowering, elaboration, and code generation architecture"
docmgr vocab add --category topics --slug metadesignsystem --description "DMETA target-family layer that realizes interaction representations/actions into concrete UI/tooling IRs"
```

### What I learned

- The current model already has enough compiler structure to support this refactor incrementally. `validate-ir`, `plan-instance`, and `scaffold-instance` map cleanly onto validation/planning/generation passes.
- The strongest existing source-map mechanism is generated widget metadata. It already carries resolved archetype/capability context and should be extended rather than replaced.
- The current abstract/concrete distinction is implemented only for archetypes and capabilities. Widget templates need the same rule before abstract Web MetaDesignSystem base templates can be introduced safely.
- The current `presentation` field appears in capabilities, widgets, generated metadata, and runtime data attributes, so migration should be staged and compatibility-preserving.

### What was tricky to build

- The main difficulty was separating the conceptual proposal from the concrete implementation path. It would be easy to write only a high-level layered-compiler description, but the user asked for an intern-ready guide. The guide therefore needed to cite current files, current command behavior, specific Go structs, and exact migration phases.
- Another tricky part was preserving scope. The design needed to account for the future CLIM MetaDesignSystem without designing it in this ticket. The solution was to define shared Semantic IR and Interaction IR as prerequisites, define Web MetaDesignSystem and React targeting in this ticket, and explicitly defer CLIM target IR to a separate ticket.
- The vocabulary warning was minor but important. Ticket topics are validated by docmgr, so new conceptual terms like `compiler-ir` and `metadesignsystem` must be added to the vocabulary before the ticket is considered clean.

### What warrants a second pair of eyes

- The proposed package split (`pkg/dmeta/interaction`, `pkg/dmeta/metadesign`, `pkg/dmeta/metadesign/webui`, `pkg/dmeta/generator/react`) should be reviewed before implementation. It is intentionally explicit, but it may be possible to simplify after the first pass.
- The proposed `SemanticSelector` shape should be reviewed carefully because it will become a central matching API for elaboration and lowering.
- The migration plan keeps legacy `consumes.presentations` while adding `realizes.representations/actions`. A reviewer should check that this does not create two long-lived sources of truth.
- The action/representation catalogs should be reviewed before implementation to avoid overfitting them to Street Deli.

### What should be done in the future

- Implement Phase 1 from the design guide: widget `abstract/selectable/realizes` fields and planner validation.
- Add the first Interaction IR catalogs and a validation command.
- Prototype `elaborate-interactions` on the Street Deli domain mappings.
- Define the `web-ui` MetaDesignSystem package and move one representative template through it.
- Create a separate CLIM MetaDesignSystem ticket after the shared Interaction IR stabilizes.

### Code review instructions

- Start with the design document:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md`
- Review the current model evidence in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/model.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/widgets/load.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/widgets/render.go`
- Validate the ticket with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30
```

- Validate the current DMETA baseline with:

```bash
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

### Technical details

Commands run during this step:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta

docmgr status --summary-only

docmgr ticket create-ticket \
  --ticket DMETA-COMPILER-MDS \
  --title "Refactor DMETA into layered compiler pipeline and web MetaDesignSystem" \
  --topics dmeta,design-system,compiler-ir,metadesignsystem,react,code-generation

docmgr doc add \
  --ticket DMETA-COMPILER-MDS \
  --doc-type design-doc \
  --title "Layered Compiler Pipeline and Web MetaDesignSystem Refactor Guide"

docmgr doc add \
  --ticket DMETA-COMPILER-MDS \
  --doc-type reference \
  --title "Diary"

go run ./cmd/dmeta validate-ir \
  --root ./examples/street-deli-ordering \
  --include-info \
  --output table

go run ./cmd/dmeta plan-instance \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --output table

docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30

docmgr vocab add --category topics --slug compiler-ir \
  --description "Compiler-style intermediate representation, passes, lowering, elaboration, and code generation architecture"

docmgr vocab add --category topics --slug metadesignsystem \
  --description "DMETA target-family layer that realizes interaction representations/actions into concrete UI/tooling IRs"

docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30

remarquee upload bundle \
  ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md \
  ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/reference/01-diary.md \
  --name "DMETA COMPILER MDS Refactor Guide" \
  --remote-dir "/ai/2026/05/24/DMETA-COMPILER-MDS" \
  --toc-depth 2 \
  --non-interactive 2>&1
```

reMarkable upload result:

```text
OK: uploaded DMETA COMPILER MDS Refactor Guide.pdf -> /ai/2026/05/24/DMETA-COMPILER-MDS
```

## Step 2: Expand ticket tasks into implementation phases

This step converted the ticket task list from a short delivery checklist into a detailed phased implementation plan. The goal was to make the ticket directly executable: an intern or future agent should be able to open `tasks.md`, pick the next unchecked item, and understand what part of the compiler-pipeline refactor they are implementing.

The new task list mirrors the design guide: start with compatibility fields, introduce Interaction IR, validate and elaborate interactions, define the Web MetaDesignSystem, lower into Web UI widget IR, add the React scaffold-plan target, migrate Street Deli, update promoted React metadata, and finish with documentation plus CLIM handoff preparation.

### Prompt Context

**User prompt (verbatim):** "Create details phases and tasks in the ticket."

**Assistant interpretation:** Expand the ticket's task list into detailed implementation phases with concrete checkbox tasks and validation gates.

**Inferred user intent:** Make the design ticket operational, not just descriptive, so implementation can proceed phase-by-phase without re-deriving the work breakdown.

**Commit (code):** pending — documentation/task update only.

### What I did

- Rewrote `tasks.md` into ten phases:
  - Phase 0: Ticket setup and baseline evidence.
  - Phase 1: Add compatibility fields to widget templates.
  - Phase 2: Introduce Interaction IR catalogs.
  - Phase 3: Validate and resolve Interaction IR inheritance.
  - Phase 4: Build semantic-to-interaction elaboration.
  - Phase 5: Define the Web MetaDesignSystem package.
  - Phase 6: Lower Interaction IR into Web UI widget IR.
  - Phase 7: Create the React target and scaffold plan.
  - Phase 8: Migrate Street Deli templates and instance metadata.
  - Phase 9: Align promoted React app metadata and stories.
  - Phase 10: Documentation, changelog, and CLIM handoff.
- Added concrete file-level tasks under each phase.
- Added validation gates for Go tests, DMETA CLI commands, React build, Storybook build, and docmgr doctor.
- Updated the ticket changelog to record the task expansion.
- Re-ran `docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30` and confirmed it still passes.

### Why

- The design guide explains the architecture, but implementation needs a checklist with smaller units of work.
- The phases preserve the intended dependency order. For example, planner compatibility fields should land before Interaction IR drives validation, and Interaction IR should exist before Web MetaDesignSystem lowering.
- Validation gates make it clear when a phase is done and reduce the risk of breaking the existing Street Deli path while adding new layers.

### What worked

- The task file can be edited directly as Markdown while remaining understandable to docmgr and humans.
- The resulting structure keeps completed ticket setup in Phase 0 and leaves implementation phases unchecked.
- `docmgr doctor` passed after the task update.

### What didn't work

- N/A. The update was a direct documentation/task edit and did not produce command errors.

### What I learned

- The ticket needs two levels of planning: the long design guide for rationale and schemas, and `tasks.md` for executable sequencing.
- The task breakdown surfaced a useful implementation boundary: `realizes` fields and abstract/selectable validation can be implemented before the full Interaction IR lowerer exists.

### What was tricky to build

- The main challenge was keeping tasks detailed enough to be actionable without making them so granular that the checklist becomes noise. I grouped tasks by compiler stage and added validation gates rather than creating a separate micro-phase for every struct or field.
- Another subtle point was Phase 0. The original ticket tasks were already complete, so I preserved them as completed baseline tasks instead of deleting history.

### What warrants a second pair of eyes

- Review the phase ordering before implementation starts. In particular, check whether the Web MetaDesignSystem package should be introduced before or after the first elaboration command.
- Review the task list for scope creep. Some Phase 9 promoted React metadata tasks may be deferred if the compiler-side metadata is more urgent.

### What should be done in the future

- Start with Phase 1: widget `abstract/selectable/realizes` fields and planner validation.
- Add diary entries and changelog updates as each phase completes.

### Code review instructions

- Review `tasks.md` first:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md`
- Compare the task phases against the implementation phases in the design guide:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md`
- Validate ticket hygiene with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30
```

### Technical details

Commands run during this step:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta

docmgr changelog update --ticket DMETA-COMPILER-MDS \
  --entry "Expanded ticket tasks into detailed phased implementation checklist covering compatibility fields, Interaction IR, Web MetaDesignSystem, React target, Street Deli migration, promoted React metadata, validation, and CLIM handoff." \
  --file-note "/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md:Detailed phase/task checklist"

docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30
```

## Step 3: Reframe the ticket as a hard top-down cutover

This step changed the implementation strategy from compatibility-first migration to hard cutover. The user clarified that DMETA is still WIP experimentation, so the correct goal is not to preserve old paths, wrapper loaders, or compatibility aliases. The correct goal is to remove conceptual complexity and make the target architecture elegant.

The task list and design guide now say that widgets are not universal DMETA concepts. Widgets belong to the Web MetaDesignSystem. The old top-level `sources/dmeta-ir/widget-templates/` path and local `examples/street-deli-ordering/widget-templates/` path should be moved into `meta-design-systems/web/` and then deleted as source-of-truth locations.

### Prompt Context

**User prompt (verbatim):** "go ewe don't need compatibility or wrappers or such. We are doing a hard cutover, the goal is to cut out complexity, and have an elegant target. Everything in the repo is WIP and experimentation.

Rephrase the ticket / tasks to take that into account, we want to work more top down than bottom up, no need for compat"

**Assistant interpretation:** Update the ticket documents so the implementation plan no longer tries to support old and new systems in parallel; make the plan top-down and target-oriented.

**Inferred user intent:** Avoid accumulating transitional complexity in an experimental repository. Use the refactor to define the clean architecture directly.

**Commit (code):** pending — documentation/task update only.

### What I did

- Rewrote `tasks.md` around hard-cut phases.
- Updated Phase 1 to create `sources/dmeta-ir/meta-design-systems/web/`, move global widget templates there, and delete the old top-level widget-template directory.
- Updated Street Deli tasks to move local templates under `examples/street-deli-ordering/meta-design-systems/web/widgets/` and delete the old local template directory.
- Removed compatibility/wrapper/legacy-support tasks from the checklist.
- Updated the design guide with a `Hard-cut implementation policy` section.
- Updated the design guide to say Web widgets belong under the Web MetaDesignSystem, not the universal DMETA IR layer.
- Updated the design guide implementation phases, risks, open questions, and intern checklist to match the hard-cut strategy.
- Updated the ticket changelog.

### Why

- Compatibility layers would preserve accidental complexity from an experimental design rather than clarifying the architecture.
- Widgets are a Web/visual design-system concept, not a universal interaction concept. Moving them under the Web MetaDesignSystem makes that boundary explicit.
- A top-down cutover matches the desired architecture better: define semantic and interaction layers, then define the Web MetaDesignSystem, then define React as a target.

### What worked

- The task list is now aligned with the intended architecture instead of a compatibility migration.
- The design guide now includes an explicit hard-cut policy.
- The canonical folder target is now `meta-design-systems/web/`, matching the user's requested direction.

### What didn't work

- N/A. This was a documentation refactor and did not produce command failures.

### What I learned

- The previous Phase 1 was too bottom-up. It proposed adding compatibility fields to the current widget model before moving the concept into the right layer.
- The better approach is to establish the target package layout first, then update loaders/types/tools to match that layout.

### What was tricky to build

- The tricky part was avoiding half-measures in the documentation. Several sections still talked about compatibility, legacy paths, or wrappers, so the update needed to touch both `tasks.md` and the design guide.
- Another tricky point was naming. The ticket now uses `web` as the canonical MetaDesignSystem id/path rather than `web-ui`, because the user specifically suggested a `meta-design-system/web/` folder.

### What warrants a second pair of eyes

- Review whether `web` is the right final MetaDesignSystem id or whether `visual-web` would be clearer. The current document chooses `web` for simplicity and path clarity.
- Review the hard-delete path for `core-model/presentations.yaml`; some entries may need to be split into Interaction representations before deletion.

### What should be done in the future

- Start implementation by moving global and local widget template files into the Web MetaDesignSystem layout.
- Update Go loaders to read only the new layout rather than supporting both paths.

### Code review instructions

- Review the updated task file:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md`
- Review the hard-cut policy in the design guide:
  - `ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md`
- Search for accidental compatibility language before implementation:

```bash
rg -n "compat|legacy|wrapper|widget-templates" \
  ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem \
  sources examples pkg
```

### Technical details

Commands run during this step:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta

rg -n "compat|legacy|wrapper|Do not move|migration" \
  ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md \
  ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md

docmgr changelog update --ticket DMETA-COMPILER-MDS \
  --entry "Reframed implementation strategy as a hard top-down cutover: move widgets under meta-design-systems/web, delete old widget-template paths, remove compatibility/wrapper tasks, and treat React as a Web target." \
  --file-note "/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md:Updated hard-cut phased task list" \
  --file-note "/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md:Updated hard-cut design policy and phases"
```

## Step 4: Move widget templates under the Web MetaDesignSystem

This step started the hard cutover. The old top-level widget-template package is no longer the source of truth. Global Web widget templates now live under `sources/dmeta-ir/meta-design-systems/web/widgets/`, and Street Deli local Web widget templates now live under `examples/street-deli-ordering/meta-design-systems/web/widgets/`.

The implementation intentionally did not add compatibility aliases for the old paths. Instead, the validator and template catalog loader now read the Web MetaDesignSystem package directly. The old `03-widgets.yaml` files were removed, and both root indexes now point at `web_meta_design_system` artifacts.

### Prompt Context

**User prompt (verbatim):** (same as Step 3)

**Assistant interpretation:** Begin implementing the hard-cutover plan by moving widget templates into the Web MetaDesignSystem layout and updating tools to load the new canonical paths.

**Inferred user intent:** Make the repository architecture match the refined model instead of adding transitional compatibility around the old widget-template package.

**Commit (code):** 7a86716e6f322a4b62141403a9068a2d14db6e83 — "DMETA-COMPILER-MDS: move widgets under web metadesign system"

### What I did

- Created global Web MetaDesignSystem root:
  - `sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml`
  - `sources/dmeta-ir/meta-design-systems/web/widgets/`
- Moved all global template files from:
  - `sources/dmeta-ir/widget-templates/`
  - to `sources/dmeta-ir/meta-design-systems/web/widgets/`
- Created Street Deli Web MetaDesignSystem extension root:
  - `examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml`
  - `examples/street-deli-ordering/meta-design-systems/web/widgets/`
- Moved all Street Deli local template files from:
  - `examples/street-deli-ordering/widget-templates/`
  - to `examples/street-deli-ordering/meta-design-systems/web/widgets/`
- Removed old package entry files:
  - `sources/dmeta-ir/03-widgets.yaml`
  - `examples/street-deli-ordering/03-widgets.yaml`
- Updated root indexes:
  - `sources/dmeta-ir/00-index.yaml`
  - `examples/street-deli-ordering/00-index.yaml`
- Updated instance manifests to point at local Web widget templates:
  - `examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`
  - `examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml`
- Updated template file artifact type from `dmeta_widget_templates` to `dmeta_web_widget_templates`.
- Updated validator loading:
  - `pkg/dmeta/validator/load.go` now loads `meta-design-systems/web/meta-design-system.yaml` instead of `03-widgets.yaml`.
- Updated validator identity/index checks:
  - `pkg/dmeta/validator/validate.go` now validates `web_meta_design_system` with artifact type `dmeta_meta_design_system`.
- Updated local template loading:
  - `pkg/dmeta/generator/widgets/load.go` now expects `dmeta_web_widget_templates` for local Web widget template files.
- Updated `validate-ir` help text to describe loading the Web MetaDesignSystem package.
- Updated `tasks.md` and changelog.

### Why

- Widgets are target-family-specific artifacts. Keeping them in `sources/dmeta-ir/widget-templates/` made them look like universal DMETA concepts.
- The Web MetaDesignSystem should own visual terms such as widgets, cards, chips, tables, sheets, and surfaces.
- A hard cutover avoids wrapper loaders and old/new path support. That is appropriate because this repository is WIP experimentation.

### What worked

- Go package tests passed:

```bash
go test ./pkg/dmeta/... -count=1
```

- Global IR validation passed:

```bash
go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

- Street Deli IR validation passed:

```bash
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
```

- Street Deli instance planning still found the expected eight selected templates and six exclusions:

```bash
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

- Scaffold dry-run still planned expected generated files:

```bash
go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table
```

### What didn't work

- N/A. The first hard-cut path move and loader update passed tests and validation.

### What I learned

- The current `WidgetIRFile` struct can temporarily carry the Web MetaDesignSystem YAML because it already has the file-map shape needed by the loader. This is not the final elegant type shape, but it allowed the path cutover to land before the deeper Go model split.
- The root package index is the important boundary. Once it points at `web_meta_design_system`, the old `03-widgets.yaml` files can be removed without keeping compatibility wrappers.

### What was tricky to build

- The loader previously assumed `03-widgets.yaml` at the root and resolved template paths relative to the root. After the move, template paths are relative to `meta-design-systems/web/`, so the loader needed a `webRoot` and must join template paths against that directory.
- The instance manifest local template paths also had to change. Otherwise `plan-instance` would still try to load files from the deleted `widget-templates/` directory.
- The validation code still stores the loaded Web MetaDesignSystem in `pkg.Widgets`. That naming is now conceptually stale. This is acceptable only as an intermediate implementation detail until the model split phase replaces generic widget structs with Web-specific types.

### What warrants a second pair of eyes

- Review whether `dmeta_web_widget_templates` is the right artifact type name or whether `dmeta_web_widgets` would be cleaner.
- Review whether `sources/dmeta-ir/00-index.yaml` should use key `web_meta_design_system` or a more general `meta_design_systems` collection later.
- Review the temporary use of `Package.Widgets` for the loaded Web MetaDesignSystem. It should not remain long term.

### What should be done in the future

- Replace generic `WidgetIRFile`/`WidgetTemplatesFile` names with Web-specific model structs.
- Move React generation policy out of the universal widget model and into the React target.
- Add `realizes.representations/actions` and abstract/selectable validation for Web templates.

### Code review instructions

Start with these files:

- `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml`
- `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/load.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/validate.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/widgets/load.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/... -count=1
go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table
```

### Technical details

Important commands:

```bash
mkdir -p sources/dmeta-ir/meta-design-systems/web examples/street-deli-ordering/meta-design-systems/web
git mv sources/dmeta-ir/widget-templates sources/dmeta-ir/meta-design-systems/web/widgets
git mv examples/street-deli-ordering/widget-templates examples/street-deli-ordering/meta-design-systems/web/widgets
git rm sources/dmeta-ir/03-widgets.yaml examples/street-deli-ordering/03-widgets.yaml
gofmt -w pkg/dmeta/validator/load.go pkg/dmeta/validator/validate.go pkg/dmeta/generator/widgets/load.go pkg/dmeta/cmds/validate_ir.go
go test ./pkg/dmeta/... -count=1
```

## Step 5: Seed the top-level Interaction IR package

This step added the first top-level Interaction IR source package. The new package defines modality-neutral actions, representations, and elaboration rules. It does not yet have a Go loader or validator, but the YAML now exists in the canonical source tree and can be used as the contract for the next implementation phase.

The important boundary is that these definitions do not mention React components, Web widgets, chips, cards, sheets, or CLIM presentation types. They describe interaction obligations such as `substitution_candidate`, `composition_breakdown`, `apply_substitution`, and `inspect_subject` before any MetaDesignSystem realizes them.

### Prompt Context

**User prompt (verbatim):** (same as Step 3)

**Assistant interpretation:** Continue the hard-cut top-down implementation by defining the universal Interaction IR source package before target-specific lowering.

**Inferred user intent:** Establish the clean upper layer that Web and future CLIM MetaDesignSystems will share.

**Commit (code):** 032c3e7b8464509940e8ecb72faf2b0000fb301f — "DMETA-COMPILER-MDS: seed interaction IR catalogs"

### What I did

- Created `sources/dmeta-ir/interactions/00-index.yaml`.
- Created `sources/dmeta-ir/interactions/actions.yaml`.
- Created `sources/dmeta-ir/interactions/representations.yaml`.
- Created `sources/dmeta-ir/interactions/elaboration-rules.yaml`.
- Added `interactions` to `sources/dmeta-ir/00-index.yaml`.
- Seeded abstract roots:
  - `Action`
  - `Representation`
- Seeded initial shared actions including:
  - `inspect_subject`
  - `copy_reference`
  - `select_subject`
  - `select_menu_item`
  - `filter_by_state`
  - `filter_by_dietary`
  - `remove_part`
  - `undo_remove_part`
  - `add_part`
  - `change_config`
  - `apply_substitution`
  - `reject_substitution`
  - `see_alternatives`
  - `add_to_order`
  - `remove_cart_item`
  - `submit_order`
  - `return_to_menu`
- Seeded initial shared representations including:
  - `compact_reference`
  - `state_indicator`
  - `inspection_entrypoint`
  - `composition_summary`
  - `composition_breakdown`
  - `ingredient_composition_row`
  - `role_label`
  - `dietary_summary`
  - `configuration_summary`
  - `substitution_candidate`
  - `substitution_price_delta`
  - `order_lifecycle_progress`
  - `cart_summary`
- Seeded initial elaboration rules from semantic capability/archetype selectors to interaction obligations.
- Parsed the YAML files with Python/PyYAML.
- Re-ran global `validate-ir` to ensure the new index entry did not break current validation.
- Updated the ticket tasks, changelog, and related files.

### Why

- The Interaction IR is the layer that prevents Web widgets from becoming universal DMETA concepts.
- Actions and representations must exist before Web lowering can be implemented cleanly.
- The initial catalogs give concrete names to concepts that were previously mixed into capabilities and presentations.

### What worked

- All new YAML files parsed successfully with PyYAML.
- `go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table` still passed.
- The Interaction IR names map cleanly onto Street Deli concepts without referencing Web-specific widgets.

### What didn't work

- N/A. This step only added source YAML catalogs and did not yet add Go loading/validation code.

### What I learned

- Many current presentation names have a clean representation-level equivalent. For example, `status_badge` becomes `state_indicator`, and `substitution_badge`/`substitution_pair` become `substitution_candidate` plus target-specific Web realization later.
- Some Street Deli actions are domain-local but still useful in the shared initial catalog because they exercise the system well. These may be split into global vs local catalogs later.

### What was tricky to build

- The main tricky part was keeping representation names modality-neutral. It is easy to slip into Web names such as chip, badge, row, or card. I used names such as `composition_summary`, `composition_breakdown`, and `substitution_candidate` instead.
- Another tricky part was action inheritance. The YAML includes roots and parent action concepts such as `mutate_composition`, but the Go resolver does not exist yet. The next phase must decide exact merge/override semantics.

### What warrants a second pair of eyes

- Review whether `select_menu_item`, `add_to_order`, and `return_to_menu` belong in the shared catalog or should become Street Deli local actions.
- Review whether `ingredient_composition_row` is too Web-shaped because of the word `row`. It may need a more neutral name such as `composition_part_entry`.
- Review the initial elaboration rules before implementing the Go matcher.

### What should be done in the future

- Implement the Go Interaction IR model and parser.
- Implement action/representation inheritance validation.
- Add `validate-interactions`.
- Implement `elaborate-interactions` over Street Deli semantic mappings.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/interactions/actions.yaml`
- `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/interactions/representations.yaml`
- `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/interactions/elaboration-rules.yaml`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
python3 - <<'PY'
from pathlib import Path
import yaml
for p in Path('sources/dmeta-ir/interactions').glob('*.yaml'):
    yaml.safe_load(p.read_text())
    print('ok', p)
PY
go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

### Technical details

Commands run during this step:

```bash
mkdir -p sources/dmeta-ir/interactions
# wrote 00-index.yaml, actions.yaml, representations.yaml, elaboration-rules.yaml
python3 - <<'PY'
from pathlib import Path
import yaml
for p in Path('sources/dmeta-ir/interactions').glob('*.yaml'):
    with p.open() as f:
        yaml.safe_load(f)
    print('ok', p)
PY

go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

## Step 6: Add the first Interaction IR Go loader and validator

This step made the new Interaction IR package executable. The repository now has Go structs for actions, representations, semantic selectors, action effects, representation projection exposure, and elaboration rules. It also has a loader for `sources/dmeta-ir/interactions/` and a `validate-interactions` CLI command.

This is not the full elaboration engine yet. It is the first validation layer: the command checks artifact loading, abstract roots, parent references, inheritance cycles, representation-supported action references, and elaboration rule emissions. This makes the new YAML package safer before it is wired into semantic elaboration or Web lowering.

### Prompt Context

**User prompt (verbatim):** (same as Step 3)

**Assistant interpretation:** Continue implementing the top-down hard-cut plan by adding tool support for the Interaction IR source package.

**Inferred user intent:** Turn the Interaction IR from documentation/YAML into a validated compiler layer.

**Commit (code):** ce60506792d0bd3a478ae6d59e21958d57194f24 — "DMETA-COMPILER-MDS: add interaction IR validation"

### What I did

- Added `pkg/dmeta/interaction/model.go` with:
  - `Package`
  - `IndexFile`
  - `ActionsFile`
  - `RepresentationsFile`
  - `ElaborationRulesFile`
  - `SemanticSelector`
  - `Action`
  - `Representation`
  - `ElaborationRule`
- Added `pkg/dmeta/interaction/load.go` to load:
  - `interactions/00-index.yaml`
  - `actions.yaml`
  - `representations.yaml`
  - `elaboration-rules.yaml`
- Added `pkg/dmeta/interaction/validate.go` to validate:
  - abstract `Action` root;
  - abstract `Representation` root;
  - missing `extends` on non-root definitions;
  - unknown parent references;
  - action inheritance cycles;
  - representation inheritance cycles;
  - representations that support unknown or abstract actions;
  - elaboration rules that emit unknown or abstract actions/representations.
- Added `pkg/dmeta/cmds/validate_interactions.go`.
- Registered `validate-interactions` in `cmd/dmeta/main.go`.
- Ran Go formatting and package tests.
- Ran the new command:

```bash
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
```

### Why

- The Interaction IR should have its own validation boundary before it participates in downstream passes.
- The hard-cut architecture depends on Actions and Representations being real compiler IRs, not only prose in a design guide.
- Validating abstract roots and emissions now sets up the same abstract/concrete discipline that already exists for archetypes and capabilities.

### What worked

- `go test ./pkg/dmeta/... ./cmd/dmeta -count=1` passed.
- `validate-interactions` returned:

```text
DMETA Interaction IR has no error-severity findings
```

- Existing validation and planning still passed:
  - `validate-ir --root ./sources/dmeta-ir`
  - `validate-ir --root ./examples/street-deli-ordering`
  - `plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`

### What didn't work

- N/A. The loader and validator compiled and passed on the seeded catalogs.

### What I learned

- The Interaction IR can use `validator.Finding` without creating an import cycle because `validator` does not import `interaction`.
- A separate `validate-interactions` command is useful even before `validate-ir` orchestrates all layers.
- Cycle detection and abstract emission checks are small but important guardrails for the new layer.

### What was tricky to build

- The current action definitions use inheritance but do not yet have fully defined merge semantics. The validator checks graph shape and emissions, but it does not yet compute resolved effective action/representation definitions.
- The root package is named `interaction.Package` while the YAML package is `dmeta_interaction_package`. This is fine for now, but future code should avoid confusion between Go package and IR package terminology in comments.
- `submit_order` currently has `subjects.any_archetypes: [Order]`, but the global source package does not validate those selectors against a semantic model yet. That cross-layer validation should happen when `validate-interactions` receives or loads a semantic package.

### What warrants a second pair of eyes

- Review whether `Representation.SupportsActions` should allow abstract action parents as documentation, or whether concrete-only is the right rule. I implemented concrete-only because elaborated/realized obligations should not point at abstract actions.
- Review selector shape before elaboration work starts. `SemanticSelector` is likely to become a central API.
- Review whether action inheritance and representation inheritance should merge fields or use explicit override semantics.

### What should be done in the future

- Add a resolver that computes effective inherited action and representation fields.
- Validate semantic selectors against the resolved semantic model.
- Implement `elaborate-interactions` using the rule catalog.
- Add unit tests for invalid cycles, unknown parents, and abstract emissions.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/model.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/load.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/validate.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/validate_interactions.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
```

### Technical details

Commands run during this step:

```bash
gofmt -w pkg/dmeta/interaction/model.go pkg/dmeta/interaction/load.go pkg/dmeta/interaction/validate.go pkg/dmeta/cmds/validate_interactions.go cmd/dmeta/main.go
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
```

## Step 7: Add semantic-to-interaction elaboration

This step connected the Semantic IR to the new Interaction IR. The code now loads a semantic package, resolves archetype/capability inheritance, builds fact sets for each domain type, applies the interaction elaboration rules, and emits modality-neutral action/representation obligations.

A loader gap surfaced during this work: Street Deli declared its example with the singular `files.domain_example` key, but the split core-model loader only loaded the plural `files.examples` list. Fixing that made validation stricter and exposed stale abstract mappings in the Street Deli example, which were then updated to concrete archetypes/capabilities.

### Prompt Context

**User prompt (verbatim):** (same as Step 3)

**Assistant interpretation:** Continue the compiler refactor by implementing the first actual elaboration pass from Semantic IR into Interaction IR.

**Inferred user intent:** Prove that Actions and Representations are usable as a compiler layer before Web widget lowering begins.

**Commit (code):** acc409f66b839f0e7b674aa97a94669e7d742128 — "DMETA-COMPILER-MDS: elaborate semantic facts into interactions"

### What I did

- Added `pkg/dmeta/interaction/elaborate.go` with:
  - `DomainFacts`
  - `Obligation`
  - `ElaborateInteractions`
  - `BuildDomainFacts`
  - `SelectorMatches`
- Added `pkg/dmeta/cmds/elaborate_interactions.go`.
- Registered `elaborate-interactions` in `cmd/dmeta/main.go`.
- Updated `pkg/dmeta/validator/model.go` and `pkg/dmeta/validator/load.go` so split core-model manifests load singular `files.domain_example` entries as well as plural `files.examples` entries.
- Updated `examples/street-deli-ordering/core-model/street-deli-ordering.yaml` so loaded domain examples validate under the existing abstract/concrete rules:
  - `MenuItem` now maps to concrete `MenuItem` and `ingredient_composable`.
  - `OrderItem` now maps to concrete `OrderItem` and `ingredient_composable`.
  - `SubstitutionRule` now maps to `IngredientSubstitutionRule` and `role_preserving_substitutable`.
  - `OrderItem.configurable` now includes the required `config_options` projection.
- Ran:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --output table
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

### Why

- The Interaction IR must be produced from semantic facts, not hand-associated with widgets.
- Web lowering needs a clean input: domain types plus derived action/representation obligations.
- Loading `files.domain_example` makes validation honest for existing example manifests.

### What worked

- Street Deli elaboration now emits expected obligations such as:
  - `composition_summary`, `composition_breakdown`, `remove_part`, `add_part` for composable menu/order items;
  - `substitution_candidate`, `substitution_price_delta`, `apply_substitution`, `reject_substitution`, `see_alternatives` for substitution rules;
  - `state_indicator` and `filter_by_state` for stateful orders/stations/prep events;
  - `dietary_summary` and `filter_by_dietary` for dietary-aware domain types.
- `validate-ir` now passes even after loading the Street Deli domain example.
- Existing instance planning still passes.

### What didn't work

- The first elaboration run produced no rows because the semantic loader had not loaded Street Deli's singular `files.domain_example` entry.
- After fixing the loader, `validate-ir` failed as expected with stale abstract mappings:

```text
abstract_archetype_mapping: domain type "MenuItem" maps abstract archetype "Composition"
abstract_capability_mapping: domain type "MenuItem" maps abstract capability "composable"
abstract_archetype_mapping: domain type "SubstitutionRule" maps abstract archetype "Substitution"
abstract_capability_mapping: domain type "SubstitutionRule" maps abstract capability "substitutable"
abstract_archetype_mapping: domain type "OrderItem" maps abstract archetype "Composition"
abstract_capability_mapping: domain type "OrderItem" maps abstract capability "composable"
missing_required_projection_mapping: domain type "OrderItem" capability "configurable" is missing required projection "config_options"
```

- The fix was to update the Street Deli domain example to concrete descendants and to add the missing required projection mapping.

### What I learned

- The existing validation rules were correct, but part of the Street Deli example was not being loaded by the split package loader.
- Once domain examples are loaded consistently, the abstract/concrete discipline applies cleanly to the Street Deli model.
- Interaction elaboration can stay small at first: inherited archetype/capability facts plus rule selectors are enough to produce a useful obligation table.

### What was tricky to build

- Domain type facts need inherited ancestors, not only direct mappings. A `MenuItem` mapped to concrete `MenuItem` should still satisfy rules that select `Composition`; a concrete `ingredient_composable` should still satisfy rules that select abstract `composable`.
- Capability facts also need inherited capabilities from archetype default capabilities. Otherwise a domain type that relies on archetype defaults would not elaborate correctly.
- The loader fix changed validation coverage. That was intentional, but it meant the domain example had to be cleaned up immediately instead of hiding behind the old loader behavior.

### What warrants a second pair of eyes

- Review `BuildDomainFacts` to confirm it captures the desired inheritance semantics and default capability semantics.
- Review the concrete replacements in `street-deli-ordering.yaml`; `MenuItem`, `OrderItem`, and `IngredientSubstitutionRule` are the intended concrete descendants, but the domain vocabulary may want more precise names later.
- Review whether `elaborate-interactions` should eventually emit grouped obligations per domain type or a structured JSON document rather than only rows.

### What should be done in the future

- Add tests for `files.domain_example` loading.
- Add tests for inherited selector matching.
- Add a stable structured output type for elaboration results so Web lowering can consume it directly.
- Validate semantic selectors in elaboration rules against known archetypes/capabilities/domain types.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/elaborate.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/elaborate_interactions.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/load.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/model.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/core-model/street-deli-ordering.yaml`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --output table
```

### Technical details

The elaboration command output is intentionally still target-neutral. It emits rows with:

- `example`
- `domain_type`
- `kind` (`action` or `representation`)
- `id`
- `source_rule`
- `summary`

It does not mention Web widgets, React components, CSS classes, Storybook stories, slots, surfaces, or visual states.

## Step 8: Lower Interaction IR into Web MetaDesignSystem obligations

This step added the first Web-specific compiler pass. The pass consumes modality-neutral Interaction IR obligations and emits Web-level widget template obligations: slots, visual states, event bindings, and source representation/action provenance.

The important boundary is that this still does not produce React components. React remains a later target under the Web MetaDesignSystem. This step proves the new pipeline shape: Semantic IR produces Interaction IR obligations, then Web owns the visual/widget interpretation of those obligations.

### Prompt Context

**User prompt (verbatim):** "continue keeping your diary and commititng at appropriate intervals."

**Assistant interpretation:** Continue implementation from the Interaction IR work, keep the docmgr diary current, and commit at sensible checkpoints.

**Inferred user intent:** Advance the compiler cutover without losing the chronological implementation record or leaving a large uncommitted working tree.

**Commit (code):** b7b1c94575fe4912146cd8db87745ee1181bd907 — "DMETA-COMPILER-MDS: lower interactions into web obligations"

### What I did

- Added global Web lowering rules:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/lowering-rules.yaml`
- Added Street Deli local Web lowering rules:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/web/lowering-rules.yaml`
- Updated both Web MetaDesignSystem entrypoints to reference `files.lowering_rules`.
- Updated the existing validator widget-template loader to skip `lowering_rules` when loading Web widget template files.
- Added `pkg/dmeta/metadesign/web/` with:
  - `model.go`
  - `load.go`
  - `validate.go`
  - `lower.go`
- Added `pkg/dmeta/cmds/lower_web.go`.
- Registered `lower-web` in `cmd/dmeta/main.go`.
- Updated ticket tasks, changelog, and related file metadata.

### Why

- The Interaction IR should not know about visual widgets, slots, or browser events.
- The Web MetaDesignSystem should own those concepts before React codegen begins.
- A Web lowering command gives reviewers a table that explains why a semantic domain type needs particular Web templates.

### What worked

- `go test ./pkg/dmeta/... ./cmd/dmeta -count=1` passed.
- Global Web lowering worked against Street Deli semantic/interaction obligations.
- Street Deli local Web lowering emitted concrete deli widget obligations such as:
  - `deli.composition_card` for `composition_summary` + `dietary_summary`;
  - `deli.composition_customizer` for `composition_breakdown` + `configuration_summary` + edit actions;
  - `deli.ingredient_row` and `deli.role_tag` for ingredient row obligations;
  - `deli.substitution_chip` for substitution candidate obligations;
  - `deli.order_tracker` for the `Order` state indicator;
  - `deli.order_cart` and `deli.cart_line_item` for `OrderItem` composition/configuration summaries.
- Existing validation still passed:
  - global `validate-ir`;
  - Street Deli `validate-ir`;
  - Street Deli `plan-instance`.

### What didn't work

- Adding `files.lowering_rules` to the Web MetaDesignSystem entrypoints would have caused the existing `validator.loadWidgetTemplates` loop to try parsing `lowering-rules.yaml` as a widget-template file. I fixed this by skipping `lowering_rules` alongside `index`.
- I intentionally did not implement YAML output or a generic `lower-metadesign --target web` command yet. The narrower `lower-web` command is enough to validate the pass before generalizing command shape.

### What I learned

- A very small lowering-rule model is enough for the first useful Web pass: match required representations/actions/domain types, emit widget template IDs plus slots/states/event bindings.
- The local Street Deli Web package is the better demonstration surface than the generic global Web package because it maps directly to the promoted mobile ordering widgets.
- The hard layer boundary remains intact: the new package imports Interaction IR and validator model types, but nothing universal imports Web.

### What was tricky to build

- The same Web MetaDesignSystem metadata file is used by the existing validator as a widget-template package. Adding `lowering_rules` therefore required preserving old widget loading behavior while extending the package format.
- Some event bindings are useful even when the triggering action is not part of the rule's required match set. For example, a `composition_card` can bind `inspect_subject` even though the rule primarily matches representations. The validator checks that emitted bindings refer to known concrete Interaction IR actions.
- The lowering output is grouped by example/domain type. That avoids attaching a widget to a single isolated representation row when the rule actually needs a set such as `composition_breakdown` plus `configuration_summary` plus `remove_part`/`add_part`/`change_config`.

### What warrants a second pair of eyes

- Review whether event bindings should be required to appear in `when.actions`, or whether the looser current model is preferable for optional affordances.
- Review the Street Deli local lowering rules for over-broad matches. For example, `dietary_summary_to_deli_filter_bar` currently applies to every dietary-aware domain type.
- Review whether `deli.order_cart` should be emitted from `OrderItem` obligations, `Order` obligations, or a future aggregate/cart semantic type.

### What should be done in the future

- Add unit tests for Web lowering rule matching and validation failures.
- Add structured YAML/JSON output for Web obligations so React target planning can consume it directly.
- Decide whether to keep `lower-web` or fold it into a later generalized `lower-metadesign --target web` command.
- Add explicit Web template `realizes.representations` / `realizes.actions` metadata so lowering can be cross-checked against template declarations.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/web/model.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/web/load.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/web/validate.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/web/lower.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/lower_web.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/web/lowering-rules.yaml`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta lower-web --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --web-root ./examples/street-deli-ordering/meta-design-systems/web --output table
go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table
```

### Technical details

The new output columns are:

- `example`
- `domain_type`
- `widget_template`
- `source_rule`
- `source_representations`
- `source_actions`
- `slots`
- `visual_states`
- `event_bindings`
- `description`

This preserves provenance from Interaction IR to Web obligations without introducing React component names yet.

## Step 9: Add React target scaffold planning under Web

This step introduced React as a target under the Web MetaDesignSystem without making React consume universal widget templates directly. The new `plan-scaffold --target react` command starts from the instance's selected component aliases, derives Interaction IR obligations, lowers them through Web lowering rules, and then plans React files with explicit provenance.

No React files are written yet. This is a planning pass only: it proves that React components can be described as target artifacts of Web obligations rather than as the direct output of old generic widget codegen.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the next phase of the DMETA compiler/Web MetaDesignSystem refactor after explaining the generic-widget-codegen boundary.

**Inferred user intent:** Advance the React target work while preserving the new Semantic IR -> Interaction IR -> Web -> React layering.

**Commit (code):** 47c78639a1975d8cd0da16e4b0a38a9d28788b36 — "DMETA-COMPILER-MDS: plan react scaffolds from web obligations"

### What I did

- Added the React target definition:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/targets/react.yaml`
- Added `pkg/dmeta/generator/react/model.go` with:
  - `TargetFile`
  - `ScaffoldPlan`
  - `ComponentPlan`
  - `PlannedFile`
  - `FileProvenance`
- Added `pkg/dmeta/generator/react/plan.go` to build a React scaffold plan from:
  - instance selected templates/component aliases;
  - semantic package loading;
  - Interaction IR elaboration;
  - Web MetaDesignSystem lowering;
  - React target file kinds and provenance settings.
- Added `pkg/dmeta/cmds/plan_scaffold.go`.
- Registered `plan-scaffold` in `cmd/dmeta/main.go`.
- Added a Street Deli Web lowering rule so `MenuItem` obligations lower to `deli.menu_browser`; this gives all eight selected Street Deli widgets React planning provenance.
- Kept the generated output path target-specific: the React target defaults to `generated/react`, not the old generated widget output path.

### Why

- React should be a codegen target below Web, not the thing that defines DMETA widgets.
- A plan command is safer than a renderer at this stage because it makes provenance and file shape reviewable before writing files.
- The command proves that selected Street Deli component names can be combined with Web obligations without routing through the old generic renderer.

### What worked

- `go test ./pkg/dmeta/generator/react/... ./pkg/dmeta/... ./cmd/dmeta -count=1` passed.
- `plan-scaffold --target react --output yaml` produced eight component rows, one for each selected Street Deli widget.
- Each component row includes:
  - `meta_design_system: web`
  - `target: react`
  - source representations;
  - source actions/event bindings;
  - source domain types;
  - source Web lowering rules;
  - slots and visual states.
- Planned file rows include component, types, metadata sidecar, stories, CSS module, barrel, adapter TODO, README, and a package index.

### What didn't work

- Initially the React planner reused the instance manifest's old `generation.output_dir`, which pointed to `generated/widgets`. That would make the new target look like a continuation of the old generic widget scaffold path. I changed the planner to use the React target default (`generated/react`) unless `--output-dir` is explicitly supplied.
- Before adding the `deli.menu_browser` lowering rule, only seven of the eight selected Street Deli widgets had Web obligation provenance. Adding the `menu_item_obligations_to_deli_menu_browser` rule fixed that.

### What I learned

- The Web lowering output already contains enough information to plan target files: widget template ID, slots, visual states, event bindings, representations, actions, domain types, and source rules.
- The instance manifest is still useful for component alias selection, but the target planner must not rely on the old generic renderer or old output naming.
- A package-level `index.ts` belongs to the React plan, not to any one component, so `ScaffoldPlan` needs package-level planned files as well as per-component files.

### What was tricky to build

- Avoiding the old generator while still reusing the existing instance manifest required a narrow boundary. The React planner reads selected aliases from the manifest, but the semantic meaning comes from Interaction/Web obligations.
- Relative path resolution has different roots: the instance manifest is relative to the instantiation directory, the semantic package is the instance root, and target defaults are more naturally relative to the semantic package root.
- The command emits both component rows and file rows. This is verbose, but it makes planned files and provenance visible in `--output yaml` before any renderer exists.

### What warrants a second pair of eyes

- Review whether the React target package should live under `pkg/dmeta/generator/react` or a more explicit Web target path such as `pkg/dmeta/metadesign/web/targets/react`.
- Review the current use of the existing instance manifest for component aliases. Phase 8 should replace `generation` and `template_sources` with explicit Web/React target metadata.
- Review whether package-level planned files should have their own richer provenance model rather than empty template/component fields.

### What should be done in the future

- Add golden tests for the React scaffold plan.
- Add a renderer for at least the metadata sidecar first, then component/type/story files.
- Replace the old `scaffold-instance` path with the React target planner/renderer.
- Migrate the instance manifest to explicit `targets.react` metadata.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/targets/react.yaml`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/model.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/plan.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/plan_scaffold.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/web/lowering-rules.yaml`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/generator/react/... ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml
go run ./cmd/dmeta lower-web --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --web-root ./examples/street-deli-ordering/meta-design-systems/web --output table
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
```

### Technical details

The React plan file kinds are currently:

- `component`
- `types`
- `metadata`
- `stories`
- `style`
- `barrel`
- `adapter_todo`
- `readme`
- `package_index`

The command is intentionally a planner, not a writer. It does not touch promoted React code or generated output directories.

## Step 10: Render React metadata sidecars from scaffold plans

This step added the first React renderer, deliberately starting with metadata sidecars instead of component source. The renderer consumes the React scaffold plan created from Web obligations and emits JSON metadata that records the Web/React boundary and the provenance chain.

The implementation still does not write files to disk or overwrite generated/promoted React code. It is a small renderable artifact that reviewers can validate before we add component, types, Storybook, CSS, or write-path behavior.

### Prompt Context

**User prompt (verbatim):** "go ahead."

**Assistant interpretation:** Continue with the next safe React-target implementation slice after adding the scaffold planner.

**Inferred user intent:** Move from planning toward target rendering while keeping the new compiler layers and diary discipline intact.

**Commit (code):** 6f1f77959466e5c5115fd7b5fc7e880599bcbf69 — "DMETA-COMPILER-MDS: render react metadata sidecars"

### What I did

- Added `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go`.
- Added `GeneratedFile` for React target rendered artifacts.
- Added `MetadataSidecar` and nested metadata structs for:
  - `generatedBy`
  - `metaDesignSystem`
  - `codegenTarget`
  - component/template/variant identity
  - `realizes.representations`
  - `realizes.actions`
  - Web slots, visual states, and event bindings
  - React package/files
  - source domain types, Web lowering rules, and compiler passes
- Added `RenderMetadataSidecar(component ComponentPlan)`.
- Added `GenerateMetadataSidecars(plan ScaffoldPlan)`.
- Added `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render_test.go`.
- Ran:

```bash
go test ./pkg/dmeta/generator/react/... ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta lower-web --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --web-root ./examples/street-deli-ordering/meta-design-systems/web --output table
```

### Why

- Metadata sidecars are the safest first rendered React artifact: they carry architecture/provenance data but do not yet make UI implementation choices.
- The sidecar proves that React rendering consumes Web obligations rather than old universal widget scaffolds.
- A focused JSON test establishes the shape before any writer starts creating files under `generated/react`.

### What worked

- The new renderer produced valid JSON.
- The test verified the key boundary fields:
  - `metaDesignSystem: web`
  - `codegenTarget: react`
  - `realizes.representations`
  - `realizes.actions`
  - Web `slots`, `visualStates`, and `eventBindings`
  - provenance `domainTypes`, `sourceRules`, and `passes`
- Existing package tests still passed.
- `plan-scaffold` still produced eight component plans for Street Deli.

### What didn't work

- N/A. This was intentionally narrow and did not require changing command behavior or writing files.

### What I learned

- The planned file provenance already contains enough pass information to populate rendered metadata without consulting the old generic renderer.
- Keeping metadata as JSON instead of a TypeScript module makes it target output rather than runtime code, and it is easy to validate with standard JSON tooling.
- Starting with sidecars keeps the next renderer steps incremental: component/types/story/CSS renderers can reuse the same `ComponentPlan` input.

### What was tricky to build

- The sidecar must represent three concepts separately: Interaction obligations (`realizes`), Web obligations (`web`), and React file outputs (`react`). Mixing those would blur the new layer boundaries.
- Package-level files do not have component-specific provenance. For this step I only render component metadata sidecars; package-level metadata can be added later if needed.
- The renderer derives pass provenance from planned files, because file provenance is already the target-facing provenance record.

### What warrants a second pair of eyes

- Review whether sidecars should include absolute file paths, relative file paths, or both. The current plan stores paths exactly as planned.
- Review whether `generatedBy` should name `plan-scaffold` or a future write command once one exists.
- Review whether metadata sidecars should include target defaults such as style mode and Storybook enablement.

### What should be done in the future

- Add a writer/dry-run path for metadata sidecars.
- Render React types and component shells from the same `ComponentPlan` input.
- Render Storybook docs text that names the source representations/actions.
- Add a golden file fixture once the sidecar schema stabilizes.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render_test.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/model.go`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/generator/react/... ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml
```

### Technical details

The rendered JSON sidecar has this high-level shape:

```json
{
  "generatedBy": "dmeta plan-scaffold --target react",
  "metaDesignSystem": "web",
  "codegenTarget": "react",
  "componentName": "StreetDeliCompositionCard",
  "templateId": "deli.composition_card",
  "realizes": {
    "representations": ["composition_summary", "dietary_summary"],
    "actions": ["inspect_subject"]
  },
  "web": {
    "slots": ["description", "dietary_tags", "price", "title"],
    "visualStates": ["default", "selected", "unavailable"],
    "eventBindings": ["inspect_subject"]
  },
  "react": {
    "packageName": "dmeta-web-react",
    "files": []
  },
  "provenance": {
    "domainTypes": ["MenuItem", "OrderItem"],
    "sourceRules": ["composition_summary_to_deli_card"],
    "passes": ["semantic-ir", "interaction-elaboration", "web-lowering", "react-planning"]
  }
}
```

## Step 11: Add scaffold-react writing and full React target rendering

This step completed both requested follow-ups: a write/dry-run path for React target artifacts and renderer support beyond metadata sidecars. The new `scaffold-react` command follows the hard-cut compiler path: Semantic IR -> Interaction IR -> Web MetaDesignSystem obligations -> React target plan -> rendered React files.

The old generic widget renderer is still present in the repository for the legacy `scaffold-instance` command, but this step does not call it. The React renderer lives in `pkg/dmeta/generator/react` and consumes `ComponentPlan` data produced from Web obligations.

### Prompt Context

**User prompt (verbatim):** "go ahead, do both."

**Assistant interpretation:** Implement both the React write/dry-run path and the React component/types/story rendering path.

**Inferred user intent:** Move from React planning/metadata-only rendering toward a usable target-specific scaffold command while preserving the new layer boundaries.

**Commit (code):** pending at time of diary entry — React scaffold writer/rendering changes.

### What I did

- Extended `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go` to render:
  - package index;
  - component `.tsx`;
  - props/types `.types.ts`;
  - metadata sidecar `.metadata.json`;
  - Storybook `.stories.tsx`;
  - CSS module `.module.css`;
  - component barrel `index.ts`;
  - adapter TODO file;
  - README.
- Added `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/write.go` with force/dry-run behavior matching the existing generator write style.
- Added `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_react.go`.
- Registered `scaffold-react` in `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`.
- Kept `--metadata-only` for the narrow sidecar flow.
- Added generated React component data attributes for:
  - `data-dmeta-meta-design-system="web"`
  - `data-dmeta-codegen-target="react"`
  - `data-dmeta-widget-template`
  - `data-dmeta-representations`
  - `data-dmeta-actions`
  - `data-dmeta-visual-state`
- Added Storybook docs descriptions that name source representations/actions.
- Ran `go mod tidy`; it updated indirect `golang.org/x/net` and `golang.org/x/sys` entries while validating the new command imports.

### Why

- React rendering should now happen through a React target package, not through the old generic widget renderer.
- A dry-run writer lets reviewers inspect planned writes before touching generated output.
- Rendering component/types/story/CSS shells proves the target pipeline can produce practical scaffolds while preserving provenance.

### What worked

- `go test ./pkg/dmeta/generator/react/... ./pkg/dmeta/... ./cmd/dmeta -count=1` passed.
- Full dry-run worked:

```bash
go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --dry-run \
  --output table
```

- Metadata-only dry-run worked and planned eight metadata sidecars:

```bash
go run ./cmd/dmeta scaffold-react \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --metadata-only \
  --dry-run \
  --output table
```

- Actual metadata writing was tested in `/tmp/dmeta-react-scaffold-test`, validated with `python3 -m json.tool`, and then removed.
- Existing validation still passed:
  - global `validate-ir`;
  - Street Deli `validate-ir`;
  - local `lower-web`;
  - `plan-scaffold` still reports eight component rows.

### What didn't work

- The first Go compile failed because raw Go string literals in `render.go` contained Markdown backticks around template IDs. Those backticks prematurely ended the raw string literal. I removed those backticks from generated comments/README text.
- The first TypeScript component renderer would have indexed `slots` with a plain `string` from an inferred string array. I changed the generated JSX to cast the slot list to the generated `ComponentSlotName[]` type and imported that type alongside props.
- `go test ./pkg/dmeta/... ./cmd/dmeta` initially requested `go mod tidy`; after running it, indirect `x/net` and `x/sys` versions were updated.

### What I learned

- The React target can now render useful scaffolds entirely from Web obligations and component aliases.
- The renderer naturally separates Interaction provenance (`realizes`), Web obligations (`slots`, `visualStates`, `eventBindings`), and React file shape.
- The old generic renderer is no longer needed for the new target path, but removing it should wait until `scaffold-instance` is replaced or deprecated.

### What was tricky to build

- Raw Go strings are convenient for TSX templates, but generated comments/README snippets cannot include unescaped backticks inside them.
- Generated TSX needs enough type precision that Storybook/TypeScript users do not immediately hit avoidable errors. The slot-name union and cast are a minimal first pass.
- The command has to provide both safe dry-run behavior and actual file writing without accidentally writing into the promoted React app. The default React target output remains `examples/street-deli-ordering/generated/react`, separate from `www/mobile-react`.

### What warrants a second pair of eyes

- Review generated TypeScript ergonomics, especially whether `slots?: Partial<Record<SlotName, unknown>>` should become `React.ReactNode` once target runtime dependencies are explicit.
- Review whether `@storybook/react-vite` is the right import for generated stories or whether target config should make this selectable.
- Review the `go.mod`/`go.sum` tidy changes; they are indirect dependency updates triggered by validation.

### What should be done in the future

- Add golden tests for one fully rendered component file and story file.
- Wire `scaffold-instance` to point users at `scaffold-react` or replace it with the target-aware path.
- Compile a temporary generated React package with TypeScript once a minimal generated package config exists.
- Migrate the instance manifest away from old `generation`/`template_sources` names and toward explicit `targets.react` metadata.

### Code review instructions

Start with:

- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/write.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_react.go`
- `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`

Validate with:

```bash
cd /home/manuel/code/wesen/go-go-golems/dmeta
go test ./pkg/dmeta/generator/react/... ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta scaffold-react --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --dry-run --output table
go run ./cmd/dmeta scaffold-react --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --metadata-only --dry-run --output table
go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml
go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table
```

### Technical details

`scaffold-react` supports:

- `--dry-run`
- `--force`
- `--metadata-only`
- `--output-dir`
- `--target-file`
- `--interactions-root`
- `--web-root`
- `--semantic-root`

The generated React default output path is target-owned:

```text
examples/street-deli-ordering/generated/react/
```

not the old generic widget output path.
