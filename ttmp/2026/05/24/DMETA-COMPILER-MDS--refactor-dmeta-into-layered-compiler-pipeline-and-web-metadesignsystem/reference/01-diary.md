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

**Commit (code):** pending at time of diary entry — Interaction IR seed changes.

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
