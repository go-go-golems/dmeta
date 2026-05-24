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
