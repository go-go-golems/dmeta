---
Title: Diary
Ticket: DMETA-DELI-PBUI-POC
Status: active
Topics:
    - dmeta
    - pbui
    - clim
    - react
    - code-generation
    - documentation
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ../../../../../../../go-go-parc/Projects/2026/05/25/ARTICLE - DMETA PBUI Street Deli CLIM React Research Report - From Conceptual Cleanup to Concrete Target.md
      Note: Obsidian research report for parc
    - Path: examples/street-deli-ordering/interactions/00-index.yaml
      Note: Street Deli interaction package inherits shared generic interactions
    - Path: examples/street-deli-ordering/interactions/actions.yaml
      Note: Street Deli-local interaction actions moved out of shared sources
    - Path: examples/street-deli-ordering/interactions/elaboration-rules.yaml
      Note: Street Deli-local elaboration rules moved out of shared sources
    - Path: examples/street-deli-ordering/interactions/representations.yaml
      Note: Street Deli-local interaction representations moved out of shared sources
    - Path: examples/street-deli-ordering/meta-design-systems/pbui
      Note: Street Deli PBUI profile now inherits reusable CLIM surfaces/bindings and keeps local overrides.
    - Path: pkg/dmeta/interaction/load.go
      Note: Interaction package inheritance/overlay loader
    - Path: pkg/dmeta/metadesign/pbui/profile/load.go
      Note: Profile inheritance merge support implemented during diary Step 1
    - Path: proof-of-concept/deli-pbui-react
      Note: |-
        Standalone proof-of-concept React package.
        Proof-of-concept package created during diary Step 2
    - Path: sources/dmeta-ir/meta-design-systems/pbui/profiles/clim
      Note: Reusable CLIM PBUI profile extracted before creating the proof of concept.
    - Path: ttmp/2026/05/25/DMETA-DELI-PBUI-POC--street-deli-pbui-react-proof-of-concept/design-doc/01-street-deli-pbui-react-proof-of-concept-architecture-and-implementation-guide.md
      Note: Primary guide for this ticket.
ExternalSources: []
Summary: Chronological diary for extracting reusable PBUI CLIM profile pieces and creating the Street Deli PBUI React proof-of-concept package.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Record implementation decisions, validation, failures, and review instructions for the proof-of-concept setup.
WhenToUse: Read before extending proof-of-concept/deli-pbui-react or converting it back into DMETA generation templates.
---



# Diary

## Goal

Capture the work to separate reusable CLIM/PBUI concepts from Street Deli-specific profile data, then create a standalone hand-authored Street Deli PBUI React proof of concept that can become the future generation target.

## Step 1: Extract reusable CLIM PBUI profile pieces from Street Deli

This step moved common CLIM surface and presentation-binding ideas out of the Street Deli profile and into a reusable PBUI CLIM profile under `sources/dmeta-ir`. The Street Deli profile now inherits those common definitions and keeps local overrides for prototype source references and the deli-specific composition presentation binding.

This was necessary because `surfaces.yaml` and much of `presentation-bindings.yaml` describe a CLIM browser idiom, not sandwiches or carts. Keeping those concepts only under `examples/street-deli-ordering` made the example look more app-specific than it really was.

### Prompt Context

**User prompt (verbatim):** "ok, here is what i wnat you to do: move the deli specific stuff out of sources/dmeta-ir/meta-design-systems/pbui and into the examples pbui section. 
then, we are going to create a proof of concept pbui react app for the deli, mostly by hand, using the readwise and the existing deli app as inspiration, in order to create a solid baseline in react that we can then convert back into templates and code generation. Starting from code generation and trying to get it right up front when we don't even know the right target is tricky.

However, feel free to reuse some of the knowledge gathered with your work so far. 

Use vite storybook rtk-query tailwind and a widget.tsx + widget.stories.tsx. This proof-of-concept is standalone. And should be built with code generation in mind and a clear separation between domain code and more generic (but potentially templatable) code.

Create a new ticket for this proof of concept work, and creat ethe proof of concept in dmeta/proof-of-concept/deli-pbui-react as a standalone package.

Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable.

Keep a diary as you work.

So: 

first, extract deli stuff out of sources/dmeta-ir and into the examples/street-deli-ordering folder (and respective subdirectories). Move generic stuff out of the examples/street-deli-ordering/meta-design-systems/pbui back into sources/dmeta-ir/meta-design-systems/pbui .

Then, create the ticket + guide + upload to remarkable."

**Assistant interpretation:** First separate reusable PBUI/CLIM profile data from Street Deli-specific data, then create a standalone hand-authored Deli PBUI React proof-of-concept package, ticket, guide, diary, and reMarkable upload.

**Inferred user intent:** Stop overfitting generation too early; establish a real React baseline that distinguishes reusable CLIM architecture from app/domain code before resuming template/code-generation work.

**Commit (code):** `b78fcb2` — "DMETA: split reusable CLIM PBUI profile from Street Deli overrides"

### What I did

- Created reusable CLIM profile files:
  - `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/surfaces.yaml`
  - `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/presentation-bindings.yaml`
- Reduced Street Deli `surfaces.yaml` to local source/context overrides.
- Reduced Street Deli `presentation-bindings.yaml` to the deli-specific composition binding override.
- Updated `presentation-system.yaml` to inherit reusable CLIM surfaces and presentation bindings.
- Updated `pkg/dmeta/metadesign/pbui/profile/load.go` to merge inherited surfaces and presentation bindings with local overrides.
- Removed Street Deli-specific wording from global PBUI presentation/lowering descriptions where the concept was meant to be generic.
- Updated PBUI golden fixtures after renaming the composition lowering rule to a generic id.

### Why

- CLIM shell surfaces are reusable across PBUI React apps.
- Generic presentation refs, action presentations, action choosers, inspectors, lifecycle status, and generic composition presentation bindings should not be trapped in the Street Deli example.
- Street Deli should keep view models, style, prototype references, and domain composition details.

### What worked

- Profile inheritance/merge is small and targeted.
- `validate-pbui-profile` passes after merging inherited surfaces and bindings.
- Full Go tests passed after updating goldens.

### What didn't work

- The first test run failed because the golden PBUI lowering fixture still expected `pbui.composition_for_editable_deli_item`. The rule was renamed to `pbui.composition_for_editable_subject`, so the golden fixtures were regenerated.

### What I learned

- The profile package already had an `inherits` map, so inheritance could be added without changing the YAML schema shape substantially.
- Surface and binding inheritance is enough for this extraction; style and view models should remain local for now.

### What was tricky to build

- Moving the reusable binding definitions out of Street Deli would have broken profile validation unless the loader merged inherited bindings before validation. The solution was to load base files from `inherits.surfaces` and `inherits.presentation_bindings`, then overlay local maps.

### What warrants a second pair of eyes

- Review whether `pbui.composition_presentation` is generic enough to remain in the global PBUI presentation type catalog.
- Review whether `style-profile.yaml` should later inherit from a reusable mono CLIM style profile.

### What should be done in the future

- Add inheritance metadata to validation output so readers can see which bindings are inherited vs local.
- Consider adding local PBUI extension files for truly app-specific presentation types if composition becomes too domain-specific.

### Code review instructions

- Start with `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/`.
- Review `examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml` inheritance.
- Review `pkg/dmeta/metadesign/pbui/profile/load.go` merge behavior.
- Validate with:
  - `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
  - `go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table`

### Technical details

Merge policy:

- inherited surfaces load first;
- local surfaces override by id;
- inherited presentation bindings load first;
- local presentation bindings override by presentation type id;
- local summary/intent/source/notes are kept for documentation context.

## Step 2: Create the standalone Deli PBUI React proof of concept

This step created `proof-of-concept/deli-pbui-react` as a hand-authored standalone package. It uses Vite, React, Tailwind, RTK Query, Storybook, and a `widget.tsx` / `widget.stories.tsx` entrypoint.

The package is intentionally small. It is not the final app. It is a baseline for discovering the right React architecture before converting patterns back into templates and code generation.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Create a standalone package that proves the desired generic/domain split in code and gives Storybook a reviewable widget surface.

**Inferred user intent:** Build a concrete React target by hand so future generation has a real app architecture to reproduce.

### What I did

- Created `proof-of-concept/deli-pbui-react`.
- Added Vite/React/TypeScript config.
- Added Storybook 10.4 config.
- Added Tailwind via `@tailwindcss/postcss`.
- Added RTK Query fixture API.
- Added generic CLIM/PBUI runtime types and components under `src/generic/clim`.
- Added Street Deli domain types, fixtures, action descriptors, view model definitions, and API under `src/domain/deli`.
- Added `src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Added `src/widgets/DeliPbuiWorkbench/widget.stories.tsx`.
- Added README.

### Why

- The generated CLIM app did not yet scaffold the right domain/action/view-model architecture.
- Hand-authored code can reveal the target shape faster than trying to generate the correct shape up front.

### What worked

- `npm install --no-audit --no-fund` succeeded.
- `npm run build` succeeded.
- `npm run build-storybook` succeeded.

### What didn't work

- No build failures occurred in this step.
- Storybook emitted the usual non-fatal Vite chunk-size warning.

### What I learned

- The generic/domain split is straightforward in React when kept explicit:
  - `src/generic/clim` owns presentation-system abstractions.
  - `src/domain/deli` owns Deli data, actions, fixtures, and views.
  - the widget composes both.
- RTK Query can be introduced even with fixture data using `fakeBaseQuery`, which keeps the package API-shaped without needing a backend.

### What was tricky to build

- The proof of concept had to stay small while still demonstrating future generation boundaries. I avoided building a full reducer/state machine yet and focused on the smallest useful vertical slice: menu data, presentation refs, action hints, shell, and Storybook.

### What warrants a second pair of eyes

- Review whether the generic CLIM types are too small, especially `ActionDescriptor` and `ClimSessionState`.
- Review whether `DeliActionId` should mirror Interaction IR ids exactly or introduce command aliases separately.

### What should be done in the future

- Add command/action binding definitions.
- Add a selection/confirmation state machine.
- Add cart/composition draft state.
- Add more Storybook states for detail/cart/select/confirm flows.
- Convert stable generic pieces into reusable package candidates.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/types.ts`.
- Then read `src/domain/deli/actions.ts` and `src/domain/deli/viewModels.ts`.
- Finally read `src/widgets/DeliPbuiWorkbench/widget.tsx` to see how the layers compose.
- Validate with:
  - `cd proof-of-concept/deli-pbui-react && npm run build && npm run build-storybook`

### Technical details

The key projection function is:

```ts
function menuItemPresentation(item: MenuItem): PresentationRef<'MenuItem'> {
  return {
    type: 'MenuItem',
    id: item.id,
    label: `${item.name} $${item.price.toFixed(2)}`,
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
  };
}
```

This is the kind of domain-to-presentation projection that future generation can scaffold from Semantic IR and PBUI bindings.

## Step 3: Create the ticket guide and upload it

This step created the `DMETA-DELI-PBUI-POC` docmgr ticket, wrote the intern-facing guide, related files, updated the changelog, and uploaded the bundle to reMarkable.

The guide explains the extraction, the proof-of-concept architecture, the generic/domain split, the role of RTK Query and Storybook, and the next implementation phases.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Document the proof-of-concept work clearly enough that an intern can extend it and later convert stable patterns back into generation templates.

**Inferred user intent:** Preserve the rationale for this deliberate hand-authored detour and make the work reviewable outside the chat.

### What I did

- Created ticket `DMETA-DELI-PBUI-POC`.
- Wrote:
  - `design-doc/01-street-deli-pbui-react-proof-of-concept-architecture-and-implementation-guide.md`
- Wrote this diary.
- Related code and guide files to the doc.
- Uploaded the guide bundle to reMarkable.

### Why

- This work changes direction from generator-first to hand-authored-baseline-first. That decision needs durable documentation.

### What worked

- The guide was created under the ticket workspace.
- The upload succeeded.

### What didn't work

- N/A

### What I learned

- The proof-of-concept package provides a clearer vocabulary for future generation than the generated CLIM scaffold alone.

### What was tricky to build

- The guide had to explain both the repository cleanup/extraction and the proof-of-concept app architecture without conflating them. The extraction is about source ownership; the proof-of-concept is about discovering target code shape.

### What warrants a second pair of eyes

- Review whether the acceptance criteria are too broad for one ticket or should be split into follow-up tickets after this baseline.

### What should be done in the future

- Implement command/action binding IR and use the proof-of-concept package to test it by hand first.

### Code review instructions

- Read the guide first.
- Then review the proof-of-concept package.
- Then review the reusable CLIM profile extraction commit.

### Technical details

reMarkable destination:

```text
/ai/2026/05/25/DMETA-DELI-PBUI-POC/DMETA Deli PBUI React POC Guide.pdf
```

## Step 4: Move Street Deli interaction vocabulary into the example package

This step answered the follow-up question about actions and other Street Deli interaction concepts. The shared `sources/dmeta-ir/interactions` package still contained many concrete Deli/cart/composition/substitution concepts. I split that layer so the shared package keeps only generic interaction vocabulary, while `examples/street-deli-ordering/interactions` owns the Deli-specific actions, representations, and elaboration rules.

The important structural change is that interaction packages can now inherit from another interaction package. Street Deli inherits the shared generic package and overlays local action, representation, and elaboration-rule files. This keeps generic concepts reusable while making it clear that actions such as `submit_order`, `apply_substitution`, and `select_menu_item` belong to the Street Deli proof case.

### Prompt Context

**User prompt (verbatim):** "Ok, do it. Keep a diary as you work. THen write a project report on the progress so far, both in clearing up the conceptual barriers and structure, and also targetting a concrete street deli ordering clim react version to be used as a concrete example before goin g back up the compiler passes chain and using code generation and better refining our intermediate representations. Store as detailed project report for our research parc in the obsidian vault for the parc. Use a textbook writing style (but no analogies, see skill)."

**Assistant interpretation:** Implement the interaction split, continue the diary, then write a long-form Obsidian project report summarizing the conceptual cleanup and the concrete Deli PBUI React proof-of-concept direction.

**Inferred user intent:** Make the repository structure match the emerging theory: shared IR should stay genuinely reusable, example-specific interaction vocabulary should live with the example, and concrete React work should lead future compiler design.

### What I did

- Added inheritance support to the interaction package loader:
  - `pkg/dmeta/interaction/model.go`
  - `pkg/dmeta/interaction/load.go`
- Reduced `sources/dmeta-ir/interactions` to generic actions, representations, and rules:
  - `Action`, `inspect_subject`, `copy_reference`, `select_subject`, `filter_by_state`
  - `Representation`, `object_reference`, `compact_reference`, `state_indicator`, `inspection_entrypoint`
  - generic elaboration rules for identifiable/inspectable/stateful subjects.
- Added Street Deli-local interaction package:
  - `examples/street-deli-ordering/interactions/00-index.yaml`
  - `examples/street-deli-ordering/interactions/actions.yaml`
  - `examples/street-deli-ordering/interactions/representations.yaml`
  - `examples/street-deli-ordering/interactions/elaboration-rules.yaml`
- Updated `examples/street-deli-ordering/00-index.yaml` to list the interaction package.
- Updated the Street Deli instance manifest to use `interactions_root: ..`.
- Updated PBUI/PBUI profile tests to load the effective Street Deli interaction package where Street Deli PBUI behavior is under test.
- Ran validation and build checks.

### Why

- The global Interaction IR was becoming a mixture of reusable vocabulary and Street Deli dogfooding vocabulary.
- Keeping concrete action names in the shared layer made it harder to see which concepts are universal and which are only proven by the Deli example.
- Local interaction packages are the right place to define domain/application actions before PBUI turns them into command bindings and action presentations.

### What worked

The following commands passed:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table
go run ./cmd/dmeta validate-interactions --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta plan-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./examples/street-deli-ordering --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output-dir ./examples/street-deli-ordering/www/clim-react --output table
cd proof-of-concept/deli-pbui-react && npm run build && npm run build-storybook
```

### What didn't work

- The first `go test ./pkg/dmeta/...` run failed because PBUI tests still loaded `sources/dmeta-ir` as their interaction package while expecting Street Deli-specific actions and representations such as `submit_order`, `cart_summary`, and `composition_summary`.
- The fix was to update PBUI tests that exercise Street Deli behavior to load `examples/street-deli-ordering`, which now inherits the generic interaction package and overlays Deli-specific vocabulary.

### What I learned

- PBUI validation should usually be run against the effective interaction package for the application being lowered, not only against the global generic interaction vocabulary.
- The repository now has three clearer layers: shared generic interactions, Street Deli interaction extensions, and PBUI/profile presentation-system interpretation.

### What was tricky to build

- Some PBUI concepts still reference Deli-proven composition and order representations. The cleanest long-term solution may be local PBUI lowering extensions, but for this pass the key improvement is that the concrete interaction vocabulary now has a proper local home.
- Tests had encoded the old assumption that `sources/dmeta-ir` contained every action and representation used by Street Deli. After the split, tests needed to distinguish generic validation from effective Street Deli validation.

### What warrants a second pair of eyes

- Review whether `filter_by_state` should remain global or move into a more specific package later.
- Review whether PBUI lowering rules should also gain explicit inheritance/overlay support, mirroring interaction packages.
- Review whether `composition_summary` and related concepts should become local PBUI extension concepts rather than remaining referenced by global PBUI presentation types.

### What should be done in the future

- Add `action-bindings.yaml` under the Street Deli PBUI profile to map command labels such as `PLACE-ORDER` to interaction action ids such as `submit_order`.
- Add PBUI lowering-rule inheritance if app-specific presentation obligations continue to grow.
- Generate concrete action descriptors and view-model registries into the proof-of-concept shape once the hand-authored code stabilizes.

### Code review instructions

- Start with `examples/street-deli-ordering/interactions/00-index.yaml` to see inheritance.
- Then review the reduced global files under `sources/dmeta-ir/interactions`.
- Review `pkg/dmeta/interaction/load.go` for merge semantics.
- Validate with the commands listed above.

### Technical details

Interaction package inheritance is a shallow overlay:

```text
base actions + local actions -> effective actions
base representations + local representations -> effective representations
base rules followed by local rules -> effective elaboration rules
```

Local definitions with the same id override base definitions. Rule lists append so generic obligations and domain-specific obligations can both be emitted.
