---
Title: Diary
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
    - dmeta
    - design-system
    - compiler-ir
    - metadesignsystem
    - pbui
    - clim
    - react
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: cmd/dmeta/main.go
      Note: |-
        Registers validate-pbui-profile
        Registers instantiate-pbui
        Registers plan-pbui-react-app
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
      Note: PBUI presentation type to concrete renderer binding profile
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
      Note: Concrete PBUI profile package entrypoint
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
      Note: Street Deli CLIM visual style profile
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
      Note: Concrete CLIM shell and surface profile
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
      Note: Concrete PBUI React app target metadata
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
      Note: Concrete menu/detail/substitution/cart/help/tracker view model profile
    - Path: examples/street-deli-ordering/www/clim-react/src/App.tsx
      Note: Scaffolded concrete Street Deli CLIM React app entry point
    - Path: examples/street-deli-ordering/www/clim-react/src/components/storybook/ClimStoryShell.tsx
      Note: Shared Storybook shell for CLIM stories
    - Path: examples/street-deli-ordering/www/clim-react/src/fixtures/presentationFixtures.ts
      Note: Deterministic Storybook fixtures for generated stories
    - Path: pkg/dmeta/cmds/instantiate_pbui.go
      Note: CLI command for producing concrete PBUI presentation plans
    - Path: pkg/dmeta/cmds/plan_pbui_react_app.go
      Note: CLI command for planning the concrete React CLIM app target
    - Path: pkg/dmeta/cmds/scaffold_pbui_react_app.go
      Note: Storybook-aware concrete React CLIM app scaffold command
    - Path: pkg/dmeta/cmds/validate_pbui_profile.go
      Note: CLI command for validating concrete PBUI profiles
    - Path: pkg/dmeta/metadesign/pbui/profile/instantiate.go
      Note: Concrete PBUI profile instantiation model and grouping pass
    - Path: pkg/dmeta/metadesign/pbui/profile/instantiate_test.go
      Note: Street Deli concrete presentation plan test
    - Path: pkg/dmeta/metadesign/pbui/profile/load.go
      Note: Concrete PBUI profile loader
    - Path: pkg/dmeta/metadesign/pbui/profile/load_validate_test.go
      Note: Street Deli concrete profile validation tests
    - Path: pkg/dmeta/metadesign/pbui/profile/model.go
      Note: Concrete PBUI profile data model
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_plan.go
      Note: Concrete PBUI React app planner
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_plan_test.go
      Note: Street Deli React app plan tests
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_render.go
      Note: Renderer for generated React app and Storybook files
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_write.go
      Note: Writer/copy support for React app scaffold files and fonts
    - Path: pkg/dmeta/metadesign/pbui/profile/validate.go
      Note: Concrete PBUI profile validator
    - Path: ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/analysis/01-pbui-metadesignsystem-implementation-report.md
      Note: Step 8 exhaustive PBUI implementation report
    - Path: ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/design-doc/01-concrete-pbui-presentation-profile-pass-guide.md
      Note: Primary guide produced in Step 1
    - Path: ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/tasks.md
      Note: Phased implementation plan for the new profile pass
ExternalSources: []
Summary: Chronological diary for designing and implementing the concrete PBUI presentation-system profile pass.
LastUpdated: 2026-05-24T17:58:00-04:00
WhatFor: Record ticket setup, evidence gathering, design decisions, implementation steps, failures, validation, and handoff notes for the PBUI concrete presentation profile pass.
WhenToUse: Read before resuming work on DMETA-PBUI-PRESENTATION-PROFILE or implementing profile schemas, validators, instantiation, or the Street Deli clim-react app.
---








# Diary

## Goal

Capture the design and implementation trail for adding a concrete PBUI presentation-system profile pass between abstract PBUI lowering and React app generation. The diary records how the design was grounded in the current PBUI compiler, the Street Deli `prototype-clim` visual reference, and the Readwise Viewer CLIM browser runtime reference.

## Step 1: Create the ticket and write the concrete presentation profile guide

This step created a new ticket for the missing concrete PBUI presentation-system profile pass and wrote the primary intern-facing design guide. The guide explains why the current PBUI compiler path is not enough to produce an actual CLIM-looking React app: it can generate abstract PBUI React scaffold files, but it does not yet model the concrete graphical shell, view structure, style tokens, presentation bindings, or runtime interaction grammar.

The main design decision is to add a new explicit pass between PBUI lowering and React app generation. For Street Deli, this pass should instantiate abstract PBUI obligations using `prototype-clim` as the visual/interaction reference and the Readwise Viewer CLIM browser as the runtime architecture reference. The pass should be modeled as data and Go tooling, not hidden inside React components.

### Prompt Context

**User prompt (verbatim):** "Alright, create a new ticket to impleemnt that new pass. Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable.


Keep a diary as you work."

**Assistant interpretation:** Create a new docmgr ticket for the concrete PBUI presentation-profile pass, write a detailed intern-facing design and implementation guide, keep a diary, and upload the resulting bundle to reMarkable.

**Inferred user intent:** Turn the newly identified architectural gap into a durable implementation plan that a new engineer can follow, grounded in the existing PBUI code, the static CLIM prototype, and the Readwise runtime reference.

**Commit (code):** N/A

### What I did
- Created ticket `DMETA-PBUI-PRESENTATION-PROFILE`.
- Created the primary design document:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/design-doc/01-concrete-pbui-presentation-profile-pass-guide.md`
- Replaced the placeholder task list with phased tasks:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/tasks.md`
- Replaced the placeholder diary with this implementation diary.
- Inspected the current PBUI compiler/scaffold work and the two primary reference systems:
  - `examples/street-deli-ordering/prototype-clim/`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/`

### Why
- The current generated PBUI scaffold is buildable, but it is generic. It does not yet model the actual look and runtime behavior of the Street Deli CLIM interface.
- The concrete visual and interaction profile should be explicit data, not hardcoded into React.
- A new intern needs a guide that explains the architecture boundary before they begin implementing schemas and generators.

### What worked
- The new ticket was created successfully with design and diary documents.
- The design guide now names the missing pass, places it in the compiler pipeline, and gives concrete YAML sketches, Go model sketches, CLI command sketches, pseudocode, file references, and implementation phases.
- The task plan now defines a path from profile authoring to validation, instantiation, React app planning, `www/clim-react` scaffolding, and visual parity review.

### What didn't work
- N/A. This was documentation and ticket setup work; no code was changed for this step.

### What I learned
- The current PBUI scaffold should remain as a generic proof package under `generated/pbui-react/`; it should not be forced to become the polished app.
- The real Street Deli CLIM app needs a separate concrete profile and likely a promoted app under `www/clim-react/`.
- `prototype-clim` should be treated as visual ground truth, while Readwise Viewer should be treated as runtime architecture ground truth.

### What was tricky to build
- The main challenge was drawing the boundary correctly. It would be easy to place visual style directly in PBUI presentation types or in React components, but that would collapse three layers together. The guide separates abstract PBUI concepts, concrete presentation-system profile, and React target implementation.
- Another tricky point is that `prototype-clim` is a static DOM/JS prototype while Readwise is a Redux + manual DOM renderer. The guide needed to extract reusable design patterns from both without claiming either one is the final React implementation.

### What warrants a second pair of eyes
- Review the proposed local profile file set:
  - `presentation-system.yaml`
  - `style-profile.yaml`
  - `surfaces.yaml`
  - `view-models.yaml`
  - `presentation-bindings.yaml`
  - `targets/react-app.yaml`
- Review whether the first profile should live locally under Street Deli or partly under global PBUI.
- Review the proposed command split between `validate-pbui-profile`, `instantiate-pbui`, `plan-pbui-react-app`, and `scaffold-pbui-react-app`.

### What should be done in the future
- Relate the key source files to the guide and diary.
- Run `docmgr doctor`.
- Upload the guide/diary bundle to reMarkable.
- Start Phase 1 by authoring the local Street Deli concrete PBUI profile YAML package.

### Code review instructions
- Start with the guide:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/design-doc/01-concrete-pbui-presentation-profile-pass-guide.md`
- Then compare against the primary references:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/prototype-clim/index.html`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/prototype-clim/styles.css`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/prototype-clim/js/app-main.js`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/types.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/store.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/render.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/app.ts`

### Technical details
- No code was changed in this step.
- Existing uncommitted repository changes from the earlier PBUI dogfooding work were intentionally left untouched while creating this ticket.

## Step 2: Relate source evidence, validate the ticket, and upload the guide bundle

This step completed the documentation delivery loop for the new ticket. I related the design guide to the current PBUI implementation files, the Street Deli `prototype-clim` visual reference, and the Readwise Viewer CLIM runtime reference. I also added missing docmgr vocabulary entries for `pbui` and `clim`, reran ticket validation, and uploaded the guide bundle to reMarkable.

The upload bundle contains the primary guide, this diary, and the task plan. That gives the reMarkable copy both the design argument and the operational checklist needed to implement the new pass.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Finish the ticket/documentation workflow by linking evidence, validating docmgr metadata, and publishing the deliverable to reMarkable.

**Inferred user intent:** Make the design package durable and reviewable outside the chat session.

**Commit (code):** N/A

### What I did
- Related source files to the design guide and diary using `docmgr doc relate`.
- Added docmgr vocabulary topics:
  - `pbui`
  - `clim`
- Ran:
  - `docmgr doctor --ticket DMETA-PBUI-PRESENTATION-PROFILE --stale-after 30`
- Uploaded the bundle with:
  - `remarquee upload bundle ... --name "DMETA PBUI Presentation Profile Guide" --remote-dir "/ai/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE" --toc-depth 2 --non-interactive`
- Updated the task plan to mark Phase 0 delivery items complete.

### Why
- The guide should be traceable to the implementation files and reference prototypes it relies on.
- Docmgr doctor should pass before publishing.
- The user explicitly requested upload to reMarkable.

### What worked
- `docmgr doctor` initially identified missing vocabulary entries for `pbui` and `clim`.
- Adding those vocabulary entries fixed the warning.
- The final doctor run passed cleanly.
- The reMarkable upload succeeded:
  - `OK: uploaded DMETA PBUI Presentation Profile Guide.pdf -> /ai/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE`

### What didn't work
- Initial doctor run warned:
  - `unknown_topics — unknown topics: [clim pbui]`
- Fix:
  - `docmgr vocab add --category topics --slug pbui --description "Presentation-based UI / PBUI architecture and implementation topics"`
  - `docmgr vocab add --category topics --slug clim --description "CLIM-style command and presentation based interface topics"`

### What I learned
- This repo's docmgr vocabulary already had `presentation-based-ui`, but not the shorter implementation-oriented terms `pbui` and `clim`. Since these are now active architectural terms in tickets and docs, adding them was appropriate.

### What was tricky to build
- The main care point was not touching or staging unrelated in-progress code changes from the previous PBUI dogfooding work while creating and validating this documentation ticket.

### What warrants a second pair of eyes
- Review whether the new vocabulary entries are acceptable long-term or whether future docs should normalize on `presentation-based-ui` instead of `pbui`.

### What should be done in the future
- Commit the new ticket documentation separately from any unrelated code/dogfooding changes.
- Begin Phase 1 implementation: author the local Street Deli concrete PBUI profile YAML package.

### Code review instructions
- Review the uploaded bundle source files:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/design-doc/01-concrete-pbui-presentation-profile-pass-guide.md`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/reference/01-diary.md`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/tasks.md`
- Validate with:
  - `docmgr doctor --ticket DMETA-PBUI-PRESENTATION-PROFILE --stale-after 30`

### Technical details
- reMarkable destination:
  - `/ai/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE`

## Step 3: Author the Street Deli concrete PBUI profile YAML package

This step implemented Phase 1 of the new ticket by creating the local Street Deli concrete PBUI presentation-system profile package. The package lives under `examples/street-deli-ordering/meta-design-systems/pbui/` and turns the earlier design guide into actual machine-readable catalogs: a package entrypoint, style profile, shell/surface layout, view models, presentation bindings, and React app target metadata.

The catalogs intentionally include substantial prose fields. This profile is not just a list of component names; it records why the Street Deli CLIM app should look like `prototype-clim`, how Readwise's browser CLIM runtime informs interaction semantics, and where each abstract PBUI presentation type should appear in a concrete graphical shell.

### Prompt Context

**User prompt (verbatim):** "now add phases and tasks to the ticket, and work on them step by step, committinga t appropriate intervals, and keeping a detailed diary."

**Assistant interpretation:** Start executing the `DMETA-PBUI-PRESENTATION-PROFILE` plan phase by phase, with diary updates and commits at reviewable intervals.

**Inferred user intent:** Move from design documentation to actual implementation of the concrete PBUI presentation-profile pass while preserving a clear audit trail.

**Commit (code):** c582d94a80018adc32cadb88a82674fa8a0adab4 — "DMETA-PBUI-PRESENTATION-PROFILE: author Street Deli profile"

### What I did
- Created the local Street Deli PBUI profile directory:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/`
- Added profile package entrypoint:
  - `presentation-system.yaml`
- Added visual style profile from `prototype-clim/styles.css`:
  - `style-profile.yaml`
- Added shell and surface profile from `prototype-clim/index.html`:
  - `surfaces.yaml`
- Added concrete view models from `prototype-clim/js/app-main.js`:
  - `view-models.yaml`
- Added abstract-PBUI-to-concrete-renderer bindings:
  - `presentation-bindings.yaml`
- Added React app target metadata:
  - `targets/react-app.yaml`
- Parsed all new YAML files with Python/PyYAML to catch syntax errors.
- Updated the Phase 1 task checklist.

### Why
- The new compiler pass needs a concrete source package before Go model/load/validate code can be implemented.
- The profile data should be explicit so the concrete graphical design is not hidden inside future React components.
- Street Deli needs a local profile because `prototype-clim` is a specific monochrome command-oriented app, not a universal PBUI design.

### What worked
- All six YAML files parse successfully.
- The profile now references both primary evidence sources:
  - `../../prototype-clim`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim`
- The profile catalogs preserve human-readable intent, rationale, source references, component vocabulary, style class semantics, and runtime expectations.

### What didn't work
- N/A. This was the first authored YAML pass and did not hit technical blockers.

### What I learned
- The concrete profile naturally splits into style, surfaces, views, and bindings. Trying to combine them into one YAML file would make it harder to review and harder for future validators to report precise errors.
- The `presentation-bindings.yaml` file is the central bridge: it is where abstract PBUI types become concrete renderer components such as `PresentationRefLine`, `ActionPresentationInline`, and `CompositionPresentationBlock`.

### What was tricky to build
- The main challenge was staying concrete without becoming React-only. For example, `ClimShell` and `PresentationRefLine` are component names, but the catalogs still describe shell regions, presentation placement, and style class semantics in target-neutral terms.
- Another subtlety was capturing prototype CSS class names directly. This is intentional for visual parity, even though a later React implementation may wrap them in CSS modules or generated class maps.

### What warrants a second pair of eyes
- Review whether `style-profile.yaml` should preserve prototype class names exactly or introduce a cleaner canonical naming layer.
- Review whether `presentation-bindings.yaml` has the right renderer vocabulary for the first `www/clim-react` app.
- Review whether `targets/react-app.yaml` should live in the local profile package or under the global PBUI target catalog.

### What should be done in the future
- Implement Phase 2: Go model/load/validate support and `dmeta validate-pbui-profile`.
- Add validation that view models and bindings reference known global PBUI presentation types.

### Code review instructions
- Start with:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml`
- Then review the data split:
  - `style-profile.yaml` for visual tokens/classes.
  - `surfaces.yaml` for shell regions.
  - `view-models.yaml` for app view organization.
  - `presentation-bindings.yaml` for abstract-to-concrete renderer mapping.
  - `targets/react-app.yaml` for future app target file kinds and runtime contract.
- Validate YAML with:
  - `python3 - <<'PY' ... yaml.safe_load(...) ... PY`

### Technical details
- YAML validation command used:
  - `python3 - <<'PY'` with `yaml.safe_load` over `examples/street-deli-ordering/meta-design-systems/pbui/**/*.yaml`.

## Step 4: Load and validate concrete PBUI profiles from Go

This step made the Street Deli concrete PBUI profile compiler-visible. I added a new Go package under `pkg/dmeta/metadesign/pbui/profile` that loads the profile entrypoint and all referenced catalogs, validates them against the abstract PBUI MetaDesignSystem, and exposes a new CLI command: `dmeta validate-pbui-profile`.

This is intentionally a validation-only phase. It does not yet instantiate PBUI obligations into a concrete presentation plan. The important milestone is that the authored YAML from Phase 1 is no longer just documentation data; it now participates in the compiler toolchain and can fail fast when a view or binding references an unknown PBUI presentation type.

### Prompt Context

**User prompt (verbatim):** (same as Step 3)

**Assistant interpretation:** Continue through the ticket phases by implementing Phase 2 after authoring the YAML profile package.

**Inferred user intent:** Turn the concrete profile into a validated compiler input before attempting instantiation or React app generation.

**Commit (code):** 3d8dd2d636b4317cbe927d9f78f3da4790d0b968 — "DMETA-PBUI-PRESENTATION-PROFILE: validate concrete PBUI profiles"

### What I did
- Added Go model structs for concrete PBUI profile packages:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/model.go`
- Added loader support for `presentation-system.yaml` and referenced files:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/load.go`
- Added profile validation:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/validate.go`
- Added unit/fixture tests:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/load_validate_test.go`
- Added CLI command:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/validate_pbui_profile.go`
- Registered the CLI command in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Updated Phase 2 tasks and validation gates.

### Why
- The concrete profile must be validated before later passes can instantiate it against PBUI obligations.
- Validation should catch unknown presentation type ids in view models and renderer bindings while the data is still easy to fix.
- The CLI command gives future contributors a simple checkpoint before they work on `instantiate-pbui` or `plan-pbui-react-app`.

### What worked
- `go test ./pkg/dmeta/metadesign/pbui/... ./cmd/dmeta -count=1` passed.
- `go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table` emitted a `validation_ok` info row.
- The negative unit test verifies that an unknown binding id produces an `unknown_presentation_type` error under `pbui_presentation_bindings`.

### What didn't work
- N/A. The first implementation compiled and validated after `gofmt`.

### What I learned
- The profile validator should validate against the abstract PBUI package, not directly against Interaction IR. Interaction IR validation remains upstream through `validate-pbui`; the profile only needs to know which PBUI presentation types are legal concrete inputs.
- The YAML profile split made the loader straightforward: `presentation-system.yaml` is the entrypoint and `files.*` points at the rest.

### What was tricky to build
- The subtle boundary was avoiding duplicate validation responsibilities. `validate-pbui-profile` loads and checks Interaction IR and PBUI first, but the concrete profile validator itself only validates profile-specific structure and PBUI presentation type references.
- Another small care point was preserving a flexible YAML shape for tokens/display/placement fields. These are intentionally partially open maps because the profile is still experimental and later phases may refine exact schemas.

### What warrants a second pair of eyes
- Review whether `model.go` should keep `map[string]any` escape hatches for token/display fields or enforce a stricter schema immediately.
- Review whether warnings for missing prose should become errors once the schema stabilizes.
- Review whether `validate-pbui-profile` should emit upstream PBUI warnings too, or keep them behind separate `validate-pbui` runs.

### What should be done in the future
- Implement Phase 3: instantiate the concrete profile against lowered PBUI obligations to produce a `ConcretePresentationPlan`.
- Add golden output for profile validation if the table output becomes a stable review artifact.

### Code review instructions
- Start with the package API:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/model.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/load.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/validate.go`
- Then review the CLI command and registration:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/validate_pbui_profile.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Validate with:
  - `go test ./pkg/dmeta/metadesign/pbui/... ./cmd/dmeta -count=1`
  - `go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table`

### Technical details
- The loader expects these artifact types:
  - `dmeta_pbui_presentation_system`
  - `dmeta_pbui_style_profile`
  - `dmeta_pbui_surfaces`
  - `dmeta_pbui_view_models`
  - `dmeta_pbui_presentation_bindings`
  - `dmeta_pbui_react_app_target`
- The validator checks:
  - profile id, prose, inherited MetaDesignSystem, and file references;
  - required token groups and style classes;
  - required shell/view/command-line surfaces;
  - view mode labels and PBUI presentation type references;
  - binding component names, classes, and PBUI presentation type references;
  - React app target output directory, provenance, and normal/select/confirm runtime states.

## Step 5: Instantiate the concrete PBUI profile into a presentation plan

This step implemented Phase 3: the concrete profile is now applied to abstract PBUI obligations to produce a target-neutral `ConcretePresentationPlan`. The new plan is the missing compiler object between `lower-pbui` and future React CLIM app planning. It does not render files yet; it says which concrete Street Deli views host which PBUI presentation types, which surface and renderer component each presentation uses, which domain types/actions/representations caused it, and which style profile governs it.

I also added the `dmeta instantiate-pbui` command. This command runs the upstream semantic → interaction → PBUI lowering chain, validates the concrete profile, instantiates the profile, and emits a table with the view/surface/component mapping. The output is intentionally reviewable before any app scaffolding is attempted.

### Prompt Context

**User prompt (verbatim):** "continue"

**Additional user prompt (verbatim):** "Read the diary if necessary to get past context."

**Assistant interpretation:** Continue implementing the ticket phases after Phase 2, using the diary to keep context and preserve the step-by-step record.

**Inferred user intent:** Keep progressing through the concrete PBUI profile implementation without losing architectural context from earlier steps.

**Commit (code):** e04e465a2483fca0752d477d446571fe9a8980f6 — "DMETA-PBUI-PRESENTATION-PROFILE: instantiate PBUI profile plans"

### What I did
- Read the ticket diary and task list before continuing.
- Added concrete profile instantiation support:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/instantiate.go`
- Added a Street Deli instantiation test:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/instantiate_test.go`
- Added CLI command:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/instantiate_pbui.go`
- Registered the CLI command in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Ran validation:
  - `go test ./pkg/dmeta/metadesign/pbui/... ./cmd/dmeta -count=1`
  - `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
  - `go run ./cmd/dmeta instantiate-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table`
- Updated Phase 3 tasks and validation gates.

### Why
- PBUI lowering creates abstract presentation obligations, but a real app needs a concrete view/surface/component interpretation.
- The concrete profile should be reviewable as a target-neutral plan before React app file planning begins.
- Future React app planning should consume this concrete plan rather than rediscovering view placement and component bindings from YAML directly.

### What worked
- The new `ConcretePresentationPlan` groups PBUI obligations into Street Deli views according to `view-models.yaml`.
- Renderer components come from `presentation-bindings.yaml`, for example:
  - `pbui.presentation_ref` → `PresentationRefLine`
  - `pbui.action_presentation` → `ActionPresentationInline`
  - `pbui.composition_presentation` → `CompositionPresentationBlock`
- Surface resolution maps profile placement hints such as `active_view`, `action_bar`, and `tracker_view` to the concrete `view` surface for v1.
- `instantiate-pbui` emitted a stable table containing the required review columns.

### What didn't work
- Initial command output used multi-paragraph presenter/recognizer intent strings directly, which made table output hard to read because embedded newlines expanded rows visually.
- Fix:
  - kept rich intent text in the in-memory plan;
  - normalized intent fields to one line only in the CLI table output with `oneLineIntent`.

### What I learned
- Profile instantiation is naturally a grouping pass: it groups obligations by view and presentation type, then enriches them with binding, surface, component, and style data.
- It is still too early to decide exact React file layout here. This pass should remain target-neutral and let Phase 4 own React app planning.

### What was tricky to build
- The tricky boundary was avoiding direct React planning in `InstantiateProfile`. Component names appear in the concrete profile because they are part of the presentation-system vocabulary, but file paths, Vite package shape, runtime modules, and generated registries belong to Phase 4.
- Another subtlety was surface resolution. The profile uses semantic placement hints like `active_view` and `action_bar`, while the surface catalog has concrete surfaces like `view` and `command_line`. The v1 resolver maps those hints into stable concrete surface ids rather than requiring every binding to repeat shell structure.

### What warrants a second pair of eyes
- Review whether grouping by view + presentation type is sufficient or whether Phase 4 needs finer-grained rows per source rule/domain type.
- Review whether `resolveSurfaceID` should become data-driven inside `surfaces.yaml` instead of hardcoded in Go.
- Review whether `ConcretePresentationPlan` should include object/action descriptors now or wait for React app planning.

### What should be done in the future
- Implement Phase 4: plan the React CLIM app target from `ConcretePresentationPlan`.
- Consider adding a golden output fixture for `instantiate-pbui` if the table/YAML output becomes part of review workflows.

### Code review instructions
- Start with:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/instantiate.go`
- Then review command wiring:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/instantiate_pbui.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Validate with:
  - `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
  - `go run ./cmd/dmeta instantiate-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table`

### Technical details
- `ConcretePresentationPlan` contains:
  - profile id/name;
  - style profile id;
  - React target id;
  - runtime states;
  - view plans;
  - concrete presentation instances.
- `ConcretePresentationInstance` contains:
  - view and mode label;
  - surface id and surface component;
  - PBUI presentation type;
  - concrete component;
  - domain types;
  - source rules;
  - source representations/actions;
  - presenter and recognizer intent;
  - style profile id.

## Step 6: Plan the concrete React CLIM app target

This step implemented Phase 4 by turning the target-neutral `ConcretePresentationPlan` into a React app file plan. The new planner is intentionally separate from the earlier generic `plan-pbui-react` path: it plans an actual Street Deli CLIM app shape with app shell files, Readwise-inspired runtime modules, CSS/font assets, command surface components, presentation components, generated registry integration, metadata, and concrete menu/detail/substitution/cart/help/tracker view components.

The result is still a plan, not scaffolding. That is the right boundary for this phase: we can now review exactly which files `www/clim-react` should contain before Phase 5 creates or promotes the app.

### Prompt Context

**User prompt (verbatim):** (see Step 5)

**Assistant interpretation:** Continue implementing the next phase after concrete profile instantiation: plan the React CLIM app target without writing app files yet.

**Inferred user intent:** Keep moving through the ticket in reviewable commits and preserve a clear diary of the compiler pipeline boundary between profile instantiation and app scaffolding.

**Commit (code):** eded683261a579beab822b6cb60d45ed8dda485c — "DMETA-PBUI-PRESENTATION-PROFILE: plan React CLIM app target"

### What I did
- Added React app planning model and planner:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_plan.go`
- Added Street Deli React app plan tests:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_plan_test.go`
- Added CLI command:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/plan_pbui_react_app.go`
- Registered the CLI command in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Planned these file families from `targets/react-app.yaml` and the concrete plan:
  - package/config/bootstrap files;
  - CLIM runtime modules;
  - style profile CSS;
  - Berkeley Mono font assets;
  - shell and command surface components;
  - concrete presentation components;
  - menu/detail/substitution/cart/help/tracker views;
  - generated registry/metadata files.
- Ran validation:
  - `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
  - `go run ./cmd/dmeta plan-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table`

### Why
- Phase 5 should scaffold a concrete app from a reviewed plan, not invent file layout directly in a writer.
- The planner makes the distinction clear:
  - generic PBUI scaffold remains under `generated/pbui-react`;
  - concrete app target is planned for `www/clim-react`.
- React app planning needs information from the concrete profile, not only from abstract PBUI obligations.

### What worked
- The plan includes the expected default output directory:
  - `../../www/clim-react`
- The plan includes Readwise-inspired runtime files:
  - `src/clim/types.ts`
  - `src/clim/store.ts`
  - `src/clim/actions.ts`
  - `src/clim/commands.ts`
  - `src/clim/selectors.ts`
  - `src/clim/runtime.ts`
- The plan includes prototype-clim style/font artifacts:
  - `src/styles/clim.css`
  - `fonts/BerkeleyMono-Regular.woff2`
  - `fonts/BerkeleyMono-Bold.woff2`
  - `fonts/BerkeleyMono-Oblique.woff2`
- The plan includes concrete view components for all six Street Deli CLIM views.

### What didn't work
- The first planner draft emitted the same `ActionPresentationInline.tsx` path twice: once as a generic presentation component and once as the action-presentation component kind.
- Fix:
  - `presentation_component` planning now skips `pbui.action_presentation` and lets `action_presentation_component` own that file.

### What I learned
- `targets/react-app.yaml` is expressive enough for first-pass app planning: file kinds plus planned component groups can drive a useful file manifest without hardcoding every app file.
- The plan still needs concrete writers in Phase 5; however, its table output already provides a good review artifact for app shape.

### What was tricky to build
- The main challenge was avoiding duplication between component groups and presentation bindings. Some components, such as `ActionHintBar`, appear both as a command surface idea and as the concrete binding for `pbui.action_chooser`. The planner currently permits distinct planned files when they are conceptually different and deduplicates by path/kind.
- Another care point was font planning. The style profile stores font paths as style token values, so the planner extracts those from the open token map rather than a rigid font struct.

### What warrants a second pair of eyes
- Review whether output paths should be normalized now. The profile's default `../../www/clim-react` is relative to the profile root, while the table currently preserves that literal path.
- Review whether component path conventions should separate command-surface components from presentation components more aggressively.
- Review whether the plan should output YAML golden fixtures before scaffolding begins.

### What should be done in the future
- Implement Phase 5: scaffold or promote `examples/street-deli-ordering/www/clim-react` from the React app plan.
- Decide whether the Phase 5 writer should generate minimal buildable placeholders first or immediately port prototype-clim behavior.

### Code review instructions
- Start with:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_plan.go`
- Then review CLI wiring:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/plan_pbui_react_app.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Validate with:
  - `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
  - `go run ./cmd/dmeta plan-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table`

### Technical details
- `ReactAppPlan` contains target id, output dir, package name, profile id, style profile id, and planned files.
- Planned files carry:
  - path;
  - kind;
  - symbol;
  - optional view/component/presentation/surface context;
  - provenance with MetaDesignSystem, presentation system, target, style profile, source passes, and source category.

## Step 7: Scaffold the real React CLIM app with Storybook stories

This step answered the Storybook question by making Storybook a first-class concrete React app target artifact. I extended the implementation guide, added a Storybook-first task phase, expanded the React app target file kinds, implemented `dmeta scaffold-pbui-react-app`, and scaffolded the actual app under `examples/street-deli-ordering/www/clim-react/`.

The scaffold is intentionally a buildable first pass rather than the final polished CLIM runtime. It includes the real package shape, Berkeley Mono fonts, CLIM CSS, runtime placeholder modules, generated profile metadata, deterministic fixtures, shell/command/presentation/view components, and Storybook stories for each component family. This gives us a concrete review surface before deeper runtime behavior is ported from the prototype and Readwise reference.

### Prompt Context

**User prompt (verbatim):** "alright, add an implementation guide section for this, add phase + tasks, then build that, and then scaffold the real app."

**Assistant interpretation:** Document the Storybook-first scaffolding approach, add task coverage, implement Storybook-aware scaffold tooling, and generate the actual `www/clim-react` app.

**Inferred user intent:** Move from planning to a real buildable app while ensuring component and view stories are generated as part of the target, not bolted on manually later.

**Commit (code):** 454db4f1023b06477f57c5d8b99ddde05bf396f5 — "DMETA-PBUI-PRESENTATION-PROFILE: scaffold React CLIM app with Storybook"

### What I did
- Added a new guide addendum: `Storybook-first concrete React app scaffolding`.
- Added Phase 4.5 Storybook-first planning tasks and marked the completed scaffold validation items.
- Extended `examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml` with Storybook file kinds:
  - `storybook_main`
  - `storybook_preview`
  - `storybook_preview_css`
  - `storybook_story_shell`
  - `storybook_fixtures`
  - `shell_story`
  - `command_line_story`
  - `command_bar_story`
  - `context_menu_story`
  - `confirm_prompt_story`
  - `presentation_story`
  - `action_presentation_story`
  - `view_story`
- Extended React app planning in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_plan.go`
- Added React app rendering/writing support:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_render.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_write.go`
- Added the scaffold command:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_pbui_react_app.go`
- Registered the command in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go`
- Scaffolded the real app at:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/clim-react/`
- Added `.gitignore` entries for `storybook-static/` and `*.tsbuildinfo`.

### Why
- Storybook is the right review surface for a presentation system compiler target.
- Generated stories make visual states explicit: normal, selected, selectable/select-mode, shell modes, command surfaces, presentation renderers, and view compositions.
- The concrete app should be separate from the generic PBUI proof package under `generated/pbui-react/`.

### What worked
- `go test ./pkg/dmeta/... ./cmd/dmeta -count=1` passed.
- `go run ./cmd/dmeta validate-pbui-profile ... --include-info --output table` passed.
- `go run ./cmd/dmeta plan-pbui-react-app ... --output-dir ./examples/street-deli-ordering/www/clim-react --output table` emitted Storybook/app file plans.
- `go run ./cmd/dmeta scaffold-pbui-react-app ... --output-dir examples/street-deli-ordering/www/clim-react --output table` wrote the scaffold.
- `cd examples/street-deli-ordering/www/clim-react && npm install --no-audit --no-fund && npm run build` passed.
- `cd examples/street-deli-ordering/www/clim-react && npm run build-storybook` passed.
- Existing promoted mobile React app still builds with `npm run build`.

### What didn't work
- First dry-run with `--output-dir ./examples/...` resolved the explicit output path relative to the profile root, producing a duplicated path under `meta-design-systems/pbui/examples/...`.
- Fix:
  - default output paths from `targets/react-app.yaml` are still resolved relative to the profile root;
  - explicit `--output-dir` values are now treated as command-working-directory relative paths.
- The first app planner emitted `ActionPresentationInline.tsx` twice, once as a generic presentation component and once as an action-presentation component.
- Fix:
  - `presentation_component` skips `pbui.action_presentation`; `action_presentation_component` owns that file.

### What I learned
- Storybook file kinds belong in `targets/react-app.yaml`; they are concrete React target review artifacts, not abstract PBUI concepts.
- The scaffold command should generate deterministic fixtures immediately. Without fixtures, generated Storybook stories would depend on runtime state that does not exist yet.
- Buildable placeholders are valuable at this stage because they prove the app package, TS config, Storybook config, and file graph before we invest in richer runtime behavior.

### What was tricky to build
- The hardest part was keeping output path semantics clear. The profile default path is relative to the profile root (`../../www/clim-react`), while a CLI override should behave like a normal shell path from the current working directory.
- Story imports also needed care. View stories live in `src/views`, while component stories live under `src/components/*`; their relative import path to `ClimStoryShell` differs.
- Shell components have different props than presentation components, so generated stories cannot blindly attach `selected` or `selectable` args to every component.

### What warrants a second pair of eyes
- Review whether the scaffolded placeholder components are sufficient for Phase 5 or whether we should immediately port more of `prototype-clim/js/app-main.js` behavior.
- Review the duplicated conceptual component name `ActionHintBar`, which appears both as a command-surface component and as the `pbui.action_chooser` presentation binding.
- Review whether generated files under `www/clim-react` should remain committed long term or whether only scaffold tooling should be committed once the target is stable.

### What should be done in the future
- Port richer runtime behavior from Readwise and `prototype-clim` into `www/clim-react`.
- Add visual parity review screenshots for menu/detail/substitution/cart/help/tracker.
- Replace generic placeholder renderers with profile-specific renderer logic as the concrete app matures.

### Code review instructions
- Start with the app target configuration:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml`
- Review planner/render/write implementation:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_plan.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_render.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_write.go`
- Review CLI:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_pbui_react_app.go`
- Review scaffolded app entry points:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/clim-react/src/App.tsx`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/clim-react/src/components/storybook/ClimStoryShell.tsx`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/clim-react/src/fixtures/presentationFixtures.ts`
- Validate with:
  - `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
  - `cd examples/street-deli-ordering/www/clim-react && npm ci --no-audit --no-fund && npm run build && npm run build-storybook`
  - `cd examples/street-deli-ordering/www/mobile-react && npm run build`

### Technical details
- New command:
  - `dmeta scaffold-pbui-react-app`
- Important options:
  - `--dry-run` reports planned writes/copies;
  - `--force` overwrites existing files;
  - `--output-dir` overrides profile target output.
- The generated app currently uses deterministic fixtures and placeholder runtime modules. This is a scaffolded app foundation, not the final fully interactive CLIM runtime.

## Step 8: Write the PBUI MetaDesignSystem implementation report

This step paused feature work and produced a long-form implementation report for the PBUI MetaDesignSystem as it exists now. The report is intended to be a durable onboarding and review artifact: it explains the authored IR files, Go packages, validation and lowering passes, descriptor derivation, generic PBUI React scaffold, concrete Street Deli profile, concrete app planner/scaffolder, generated outputs, command workflow, application-author responsibilities, current limitations, and next implementation work.

The report deliberately uses a textbook style. It starts from the pipeline and the responsibilities of each layer, then grounds the explanation in concrete file paths, YAML snippets, Go types, command invocations, generated row counts, and Street Deli examples. It avoids treating the generated `www/clim-react` app as finished; it identifies it as a buildable scaffold whose runtime and renderers still need to be filled in.

### Prompt Context

**User prompt (verbatim):** "ok, before we get properly into that, we are going to work on the current scaffolding. 

For now, write a detailed project report on the implementation of PBUI MetaDesignSystem so far, exhaustively going through every piece of it: the IRs, the schemas, the parts, how they fgit together, what gets generated from what and how, what go code is involved, which commands get called, what an application user has to fill in (in this case using the deli examples), how the workflow is going from app idea to fully realized PBUI react result, etc... Leave no stone unturned, and explain everything in the greatest detail. This can be a ridiculously large article if necessary. Use a textbook writing style (no analogies, see skill). Commit and push when donne."

**Assistant interpretation:** Create a comprehensive implementation report before continuing runtime work, document all current PBUI layers and generated outputs, then commit and push the report.

**Inferred user intent:** Preserve a complete system understanding of the PBUI compiler path before the scaffold is filled with more application behavior.

**Commit (code):** 0785f2585d4f8ed3160922ebbd4f0eb3ff2fd746 — "DMETA-PBUI-PRESENTATION-PROFILE: add PBUI implementation report"

### What I did
- Loaded the textbook-authoring skill and followed its style guidance.
- Reviewed the global PBUI IR files, concrete Street Deli PBUI profile files, Go PBUI packages, profile packages, and PBUI CLI commands.
- Ran command-output counting checks for:
  - `lower-pbui`
  - `plan-pbui-react`
  - `instantiate-pbui`
  - `plan-pbui-react-app`
- Added the report document:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/analysis/01-pbui-metadesignsystem-implementation-report.md`
- Related the report to the central IR, Go implementation, command, profile, and generated app files.

### Why
- The PBUI implementation now spans several layers and output paths. Without a report, future work on the scaffold would require reconstructing context from commits and tickets.
- The user explicitly asked for an exhaustive report before continuing implementation.
- The report provides a shared vocabulary for the distinction between abstract PBUI, generic PBUI React scaffold, concrete Street Deli profile, and concrete `www/clim-react` app scaffold.

### What worked
- The report now gives a complete end-to-end path from app idea to generated PBUI React results.
- It captures actual row counts from current command outputs:
  - 41 PBUI lowering rows.
  - 41 generic PBUI React plan rows.
  - 15 concrete profile instantiation rows.
  - 63 concrete React app plan rows.
- The report identifies the generated app as a buildable scaffold and lists the missing runtime/data/view work.

### What didn't work
- N/A. This was documentation/report work; no implementation blockers were encountered.

### What I learned
- The system now has two distinct React outputs that must be explained carefully:
  - `generated/pbui-react` as a generic PBUI proof package.
  - `www/clim-react` as the concrete profile-applied app scaffold.
- The report benefits from treating command row counts as evidence, because they show how obligations collapse or expand as they move through lowering, profile instantiation, and app planning.

### What was tricky to build
- The main challenge was covering the full implementation without flattening the layers together. The report had to keep Semantic IR, Interaction IR, PBUI IR, concrete profile data, generic React target, and concrete app target separate while also showing how they connect.
- Another care point was describing generated scaffold status accurately. The `www/clim-react` app builds and has Storybook stories, but it is not the final interactive CLIM runtime.

### What warrants a second pair of eyes
- Review whether the report should be copied into an Obsidian article later for broader project knowledge.
- Review whether the file index and workflow sections should become a shorter README in `pkg/dmeta/metadesign/pbui/`.
- Review whether the report overstates or understates the maturity of the concrete app scaffold.

### What should be done in the future
- Update the report after real runtime behavior is added to `www/clim-react`.
- Consider adding diagrams generated from the actual plan JSON if the report becomes a long-term reference artifact.

### Code review instructions
- Start with the report:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/analysis/01-pbui-metadesignsystem-implementation-report.md`
- Validate ticket metadata with:
  - `docmgr doctor --ticket DMETA-PBUI-PRESENTATION-PROFILE --stale-after 30`

### Technical details
- The report links to the global PBUI IR, concrete Street Deli profile, Go packages, command wrappers, and generated app package.
- It uses the current validated command outputs as factual evidence rather than restating architecture from memory.
