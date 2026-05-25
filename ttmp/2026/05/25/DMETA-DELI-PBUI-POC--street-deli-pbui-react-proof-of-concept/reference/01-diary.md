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
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml
      Note: Concrete Street Deli CLIM command/action binding catalog
    - Path: pkg/dmeta/interaction/load.go
      Note: Interaction package inheritance/overlay loader
    - Path: pkg/dmeta/metadesign/pbui/profile/load.go
      Note: Profile inheritance merge support implemented during diary Step 1
    - Path: pkg/dmeta/metadesign/pbui/profile/validate.go
      Note: Validation for concrete action bindings against interactions
    - Path: proof-of-concept/deli-pbui-react
      Note: |-
        Standalone proof-of-concept React package.
        Proof-of-concept package created during diary Step 2
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts
      Note: Hand-authored TypeScript mirror of the command/action binding target shape
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts
      Note: Generic command-binding to action-request helper
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

## Step 5: Add concrete Street Deli command/action bindings

This step filled in the first missing PBUI concrete action-binding layer. Interaction IR now defines the semantic action ids, while the Street Deli PBUI profile defines the concrete CLIM command labels, view availability, surfaces, input mappings, confirmation prompt, and handler ids that expose those actions in the application.

The proof-of-concept React package now mirrors that profile layer with a typed `commandBindings.ts` registry. The widget no longer treats action descriptors as command labels directly. It builds action presentations through command bindings, which keeps `submit_order` distinct from the concrete `PLACE-ORDER` command shown to users.

### Prompt Context

**User prompt (verbatim):** "continue. Keep a diary and commit at appropriate intervals. read diary if necessary to remember where we are and coming from"

**Assistant interpretation:** Resume from the diary, continue the next architectural increment, keep the diary current, validate, and commit coherent checkpoints.

**Inferred user intent:** Continue moving from conceptual cleanup toward a concrete, hand-authored PBUI/CLIM React target that can later inform better compiler IR and generation templates.

**Commit (code):** `7853fa0` — "DMETA-DELI-PBUI-POC: add concrete action bindings"

### What I did

- Added the Street Deli concrete action binding profile:
  - `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml`
- Updated the Street Deli PBUI profile index to declare `files.action_bindings` and require action bindings.
- Added local interaction actions needed by the concrete command grammar:
  - `filter_by_category`
  - `describe_subject`
  - `navigate_to_cart`
  - `show_help`
- Extended the PBUI profile Go model/loader/validator to load and validate action bindings:
  - `pkg/dmeta/metadesign/pbui/profile/model.go`
  - `pkg/dmeta/metadesign/pbui/profile/load.go`
  - `pkg/dmeta/metadesign/pbui/profile/validate.go`
- Updated PBUI profile commands to pass the effective interaction package into profile validation.
- Changed the Street Deli-oriented PBUI profile command defaults/examples to use `examples/street-deli-ordering` as the effective interaction package.
- Added profile tests for loading `PLACE-ORDER` and validating action bindings.
- Added proof-of-concept TypeScript command bindings:
  - `proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts`
- Extended generic CLIM types with `CommandBinding` and `ActionPresentation.commandLabel`.
- Updated the proof-of-concept widget so action presentations are derived from command bindings rather than direct action ids.
- Updated the intern-facing guide with a command/action binding section.

### Why

- Interaction IR action ids are semantic ids; they should not be forced to double as concrete user-facing command labels.
- PBUI needs a profile-level layer that explains how actions are exposed in a concrete presentation system.
- View models list default commands; validation should make sure those commands actually exist and are available in those views.
- Future generation needs a clear target shape for `commandBindings.ts` before generating it.

### What worked

The code commit was validated with:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
go run ./cmd/dmeta validate-interactions --root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
go run ./cmd/dmeta plan-pbui-react-app --root ./examples/street-deli-ordering --interactions-root ./examples/street-deli-ordering --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output-dir ./examples/street-deli-ordering/www/clim-react --output table
cd proof-of-concept/deli-pbui-react && npm run build && npm run build-storybook
```

### What didn't work

- No blocking failures occurred in this step.
- Storybook still emits the non-fatal Vite large chunk warning during production build.

### What I learned

- The command/action distinction makes the PBUI layering much clearer:
  - `submit_order` is an Interaction IR action id.
  - `PLACE-ORDER` is a concrete Street Deli CLIM command label.
  - `deli.submitOrder` is the application handler id.
- Validating `view-models.yaml` against `action-bindings.yaml` is a useful guardrail because it prevents view default actions from becoming undocumented strings.

### What was tricky to build

- The profile validator previously did not receive the effective interaction package, so it could not check whether concrete action bindings referenced real actions. I changed `ValidatePackage` to accept the interaction package and updated all command call sites.
- Some view default commands were navigation/help/filter commands that did not yet have Interaction IR actions. I added them to the Street Deli-local interaction package rather than the shared package because they are concrete to this app and profile.

### What warrants a second pair of eyes

- Review whether `navigate_to_cart` and `show_help` should remain Interaction IR actions or become a separate navigation-command category later.
- Review whether command bindings should be part of the PBUI profile package or live under the example interaction package. The current implementation keeps them in the PBUI profile because they describe presentation-system exposure, surfaces, confirmation prompts, and handlers.
- Review whether command labels should remain uppercase ids in YAML or split into stable ids plus display labels.

### What should be done in the future

- Generate `src/domain/deli/commandBindings.ts` from `action-bindings.yaml` once the hand-authored registry stabilizes.
- Add typed action request builders that use `input_mapping` to construct `ActionRequest` values.
- Add normal/select/confirm mode transitions using the command binding confirmation metadata.
- Add stories for cart mode and `PLACE-ORDER` confirmation.

### Code review instructions

- Start with `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml`.
- Review `pkg/dmeta/metadesign/pbui/profile/validate.go`, especially `validateActionBindings`.
- Review `proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts` and `src/widgets/DeliPbuiWorkbench/widget.tsx` to see how the hand-authored target mirrors the YAML.
- Validate with the commands listed above.

### Technical details

The action binding layer is intentionally concrete:

```yaml
PLACE-ORDER:
  action: submit_order
  views: [cart]
  surface: confirm_prompt
  handler: deli.submitOrder
  input_mapping:
    cart_ref: current_cart
  requires_confirmation: true
```

This is the layer that future React generation should use to produce command registries, action request builders, confirmation prompts, and handler stubs.

## Step 6: Add a generic action-request helper and run live verification servers

This step made the command-binding layer executable in the proof-of-concept widget. The generic CLIM runtime now has a helper that turns a command binding, an action descriptor, and a small input context into an `ActionRequest`. The Street Deli widget uses that helper when a command/action presentation is clicked, then echoes the constructed request in the CLIM footer.

I also started live verification servers in tmux so the app and Storybook can be inspected interactively. The running servers are intentionally not committed artifacts; they are review infrastructure for the current proof-of-concept state.

### Prompt Context

**User prompt (verbatim):** "run the storybook and all that, so i can verify. use tmux."

**Assistant interpretation:** Build/check the proof of concept, then start Storybook and the Vite app in a persistent tmux session for manual verification.

**Inferred user intent:** Review the current PBUI React proof of concept visually in a browser while keeping the dev servers running outside the agent turn.

**Commit (code):** `86e3622` — "DMETA-DELI-PBUI-POC: build action requests from command bindings"

### What I did

- Added `proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts`.
- Added `buildActionRequestFromBinding`, `resolveInputSource`, and `summarizeActionRequest`.
- Updated `DeliPbuiWorkbench` so command/action clicks build an action request from command binding metadata.
- Updated the design guide to document the generic command runtime helper.
- Ran production build and Storybook build.
- Started tmux session `dmeta-deli-pbui-poc` with:
  - `storybook` window running Storybook on port `6010`.
  - `vite` window running Vite on port `5173`.

### Why

- The command/action binding layer should not only validate as YAML. It should inform concrete runtime behavior.
- A small generic request builder is the next reusable CLIM/PBUI runtime candidate.
- Live Storybook/Vite servers make the current POC reviewable without requiring the reviewer to run commands manually.

### What worked

Validation/build commands passed:

```bash
cd proof-of-concept/deli-pbui-react
npm run build
npm run build-storybook
```

Live servers are running in tmux:

```bash
tmux attach -t dmeta-deli-pbui-poc
```

Review URLs:

```text
Storybook: http://localhost:6010/
Vite app:  http://localhost:5173/
```

### What didn't work

- I noticed an accidental local typo in `examples/street-deli-ordering/interactions/actions.yaml` (`uchema_version`) before starting the servers and corrected it back to `schema_version`.
- Storybook still emits the non-fatal Vite large chunk warning during production build.

### What I learned

- The command-binding target shape is now testable in the UI: clicking `CUSTOMIZE`, `CART`, `FILTER-DIETARY`, `FILTER-BY-CATEGORY`, or `HELP` builds an action request and displays the command/action mapping in the footer.
- The generic input-source vocabulary is small but useful: `selected_presentation`, `current_draft`, `current_cart`, `selected_removed_part`, and `command_argument:*`.

### What was tricky to build

- The action request helper needs to stay generic without hard-coding Street Deli concepts. I kept Deli-specific values in the widget/context and left the generic helper responsible only for resolving named input sources.
- The current helper is permissive: unknown input sources return `undefined`. This is useful for iteration but should become a validation/runtime diagnostic before generation relies on it.

### What warrants a second pair of eyes

- Review whether `resolveInputSource` should fail loudly for unknown sources.
- Review whether `command_argument:*` should remain stringly typed or become a typed argument schema in `action-bindings.yaml`.
- Review the UI behavior by clicking action labels in Storybook/Vite and checking the footer request summaries.

### What should be done in the future

- Add typed per-action request builders on top of the generic helper.
- Add a real normal/select/confirm state machine using `requiresConfirmation` and confirmation metadata.
- Add Storybook stories for command invocation, cart mode, and confirmation mode.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts`.
- Then review `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Compare the TypeScript command-binding flow with `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml`.
- Validate by opening Storybook at `http://localhost:6010/` and the Vite app at `http://localhost:5173/`.

### Technical details

The generic helper has this shape:

```ts
buildActionRequestFromBinding(binding, descriptor, context)
```

It turns YAML-shaped command binding metadata into a runtime request shape:

```text
CUSTOMIZE -> select_menu_item(item_ref)
FILTER-DIETARY -> filter_by_dietary(dietary_tag)
CART -> navigate_to_cart(no inputs)
```

## Step 7: Add interactive menu/detail/cart/confirm/tracker flow and test with Playwright

This step turned the proof-of-concept widget from a static menu review surface into a small interactive CLIM flow. The widget now supports menu selection, detail view, adding a draft item to the cart, invoking a confirmation-required `PLACE-ORDER` command, confirming it, and landing on a tracker view.

This is not the final PBUI runtime. It is a concrete target sketch for the next compiler pass: command bindings can drive runtime action requests, view transitions, confirmation prompts, and Storybook states.

### Prompt Context

**User prompt (verbatim):** "ok continue. Once you think you are ready, you can use playwright to test the whole thing."

**Assistant interpretation:** Continue extending the POC, then use browser automation to test the live app and Storybook once it is in a reviewable state.

**Inferred user intent:** Move beyond static generated-looking code and prove that the concrete Street Deli PBUI React target can execute a basic ordering flow in the browser.

**Commit (code):** `a50f38c` — "DMETA-DELI-PBUI-POC: add interactive CLIM flow stories"

### What I did

- Extended `DeliPbuiWorkbench` with local proof-of-concept state:
  - current view id;
  - selected menu item;
  - cart items;
  - pending confirmation binding/request;
  - CLIM footer result line.
- Added concrete view rendering for:
  - menu;
  - detail/composition draft;
  - cart;
  - help;
  - tracker.
- Added `ConfirmPrompt` to the generic CLIM component layer.
- Extended POC view models to include `substitution`, `help`, and `tracker` in addition to `menu`, `detail`, and `cart`.
- Added Storybook stories:
  - `MenuMode`
  - `DetailMode`
  - `CartMode`
  - `HelpMode`
- Ran production build and Storybook build.
- Restarted the tmux Storybook/Vite servers.
- Tested the live app and Storybook with Playwright.

### Why

- The previous POC proved the file boundaries but only rendered a menu.
- The next useful target shape is a small runtime loop: command binding -> action request -> transition/confirmation -> new view.
- Playwright testing gives evidence that the browser-visible behavior matches the intended CLIM flow.

### What worked

Production checks passed:

```bash
cd proof-of-concept/deli-pbui-react
npm run build
npm run build-storybook
```

Live app Playwright flow passed:

```text
http://localhost:5173/
CUSTOMIZE -> detail view
ADD-TO-ORDER -> cart view
PLACE-ORDER -> confirm prompt
CONFIRM PLACE-ORDER -> tracker view
```

Storybook Playwright check passed for:

```text
http://localhost:6010/?path=/story/poc-deli-pbui-workbench--cart-mode
```

The Storybook iframe contained the expected cart text:

```text
HUDSON STREET DELI
CART
<Order> 1 item / $12.50
PLACE-ORDER MENU HELP
```

### What didn't work

- The first TypeScript build failed because JSX treated `->` in the help view as an invalid token. I escaped it as `-&gt;`.
- The next TypeScript build failed because `ActionRequest<string>` was too broad for `ActionRequest<DeliActionId>`. I tightened the widget helper types and cast the generic `ActionPresentation` callback value back to `ActionPresentation<DeliActionId>` at the component boundary.
- The Vite app still logs a favicon 404 in the browser console. This is harmless but should be fixed by adding a favicon or removing the request path if console cleanliness matters.
- Storybook still logs the non-fatal Storybook 11 `PopoverProvider ariaLabel` warning.

### What I learned

- Even a small interactive flow makes the target architecture much clearer than static components alone.
- The POC now demonstrates which parts are generic (`ConfirmPrompt`, request construction, CLIM shell) and which are app-specific (view transitions, cart state, Deli item projections).
- The action-presentation callback boundary is currently a little too generic; future reusable components may need generic type parameters or a stronger command/action presenter abstraction.

### What was tricky to build

- The widget has to remain a proof-of-concept rather than a full app. I kept state local to avoid prematurely designing Redux slices, while still making the flow concrete enough for generator design.
- The `initialCart` story prop had to synthesize a cart item without writing it into state during render. I used a memoized effective cart list so stories can present cart state without side effects.
- The generic `ActionHintBar` accepts generic actions, but Street Deli needs typed action ids. The temporary cast in `handleInvoke` is acceptable for the POC but should be improved before extraction.

### What warrants a second pair of eyes

- Review whether local component state is still the right place for this phase or whether the next increment should introduce a session reducer.
- Review whether `ConfirmPrompt` belongs in generic CLIM components or should be split into a lower-level surface plus app-specific copy.
- Review whether the command/action callback should be typed more strongly before any code generation targets it.

### What should be done in the future

- Add select mode for compatible target picking, especially `REMOVE-INGREDIENT`.
- Add a standalone confirm-prompt Storybook story or a story play function that clicks `PLACE-ORDER`.
- Move cart/draft/session state into explicit reducers after the flow stabilizes.
- Add a favicon or configure Vite to avoid the browser console 404.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Review `proof-of-concept/deli-pbui-react/src/generic/clim/components/` for `ConfirmPrompt`.
- Review `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.stories.tsx` for the added review states.
- Validate with:
  - `cd proof-of-concept/deli-pbui-react && npm run build && npm run build-storybook`
  - Playwright against `http://localhost:5173/` and Storybook cart mode.

### Technical details

The tested flow is:

```text
menu / normal
  click CUSTOMIZE

detail / normal
  click ADD-TO-ORDER

cart / normal
  click PLACE-ORDER

cart / confirm
  click CONFIRM PLACE-ORDER

tracker / normal
```

## Step 8: Clean up the app document shell and rerun browser verification

This step cleaned up the standalone Vite app document shell and reran browser verification after restarting the tmux servers. The immediate fix was small: `index.html` now has a normal HTML document structure, title, viewport metadata, and an inline favicon so the Vite app no longer emits a favicon 404 during Playwright checks.

After that cleanup, I reran the full browser flow with Playwright and also checked Storybook through its preview iframe. The POC is now ready for manual verification through the running tmux servers.

### Prompt Context

**User prompt (verbatim):** (see Step 7)

**Assistant interpretation:** After extending the POC, use Playwright to test the live app and Storybook and clean up issues discovered during browser verification.

**Inferred user intent:** Ensure the running prototype is not only buildable but also browser-verifiable and ready for hands-on review.

**Commit (code):** `91bdd6a` — "DMETA-DELI-PBUI-POC: add app document shell"

### What I did

- Rewrote `proof-of-concept/deli-pbui-react/index.html` as a complete HTML document.
- Added an inline SVG favicon to avoid the browser console favicon 404.
- Rebuilt the app and Storybook.
- Restarted tmux session `dmeta-deli-pbui-poc` so both live servers serve the latest code.
- Ran Playwright against:
  - Vite app: `http://localhost:5173/`
  - Storybook help-mode story: `http://localhost:6010/?path=/story/poc-deli-pbui-workbench--help-mode`

### Why

- The live app should be clean enough for review. A favicon 404 is not a functional bug, but it creates noise when checking console health.
- The final check should exercise both the app runtime flow and the Storybook review surface.

### What worked

The Vite app Playwright flow returned `ok: true` for:

```text
CUSTOMIZE -> detail
ADD-TO-ORDER -> cart
PLACE-ORDER -> confirm prompt
CONFIRM PLACE-ORDER -> tracker
```

The final body text included:

```text
tracker / TRACKER
Confirmed action request: PLACE-ORDER -> submit_order(cart_ref)
```

The Storybook iframe check returned `ok: true` for Help mode and found the expected command/action text, including `PLACE-ORDER` and `submit_order`.

### What didn't work

- Storybook still emits the non-fatal Storybook 11 `PopoverProvider ariaLabel` warning from Storybook internals.
- Vite app console warning/error noise was resolved after adding the favicon/document shell.

### What I learned

- Playwright is useful here not as a committed test suite yet, but as an acceptance check for the target behavior the generator should eventually preserve.
- The Storybook preview iframe is the correct surface for checking story content programmatically.

### What was tricky to build

- Storybook wraps the actual widget in a manager UI and iframe, so Playwright checks need to address the `storybook-preview-iframe` frame rather than the top-level page body.
- The Vite app and Storybook are both served through tmux; after code changes, the safest review workflow is to restart the tmux session so both servers reload from a clean process state.

### What warrants a second pair of eyes

- Review whether the current stories are enough or whether we should add a story play function for the `PLACE-ORDER` confirmation path.
- Review whether the app should get a real favicon asset later instead of an inline data URL.

### What should be done in the future

- Convert the Playwright flows into committed tests once the POC stabilizes.
- Add Storybook interaction/play tests for the full order path.
- Continue with select mode for ingredient removal.

### Code review instructions

- Open `http://localhost:5173/` and run the order flow manually.
- Open `http://localhost:6010/?path=/story/poc-deli-pbui-workbench--help-mode` and inspect the command/action registry story.
- Attach to tmux with `tmux attach -t dmeta-deli-pbui-poc` if server output is needed.

### Technical details

Current live verification servers:

```text
tmux session: dmeta-deli-pbui-poc
storybook: http://localhost:6010/
vite app:  http://localhost:5173/
```

## Step 9: Fix clickable affordances, compatible presentation clicks, and editable command input

This step responded to hands-on review feedback. The previous POC had functional action buttons, but their cursor/hover affordance did not make clickability obvious. It also rendered ingredient rows as presentation references without letting the current action set make those rows clickable. Finally, the footer looked like a command REPL but was only a passive command echo/result area.

I converted those issues into explicit ticket tasks, completed them, and validated the result with builds plus Playwright. Clickable actions and presentation refs now show pointer/hover/focus affordances. Presentation refs become clickable through a generic command-binding mechanism: if a command available in the current view maps an input from `selected_presentation`, the presentation can invoke that command. The footer is now an editable command input that resolves commands through the current view's command bindings.

### Prompt Context

**User prompt (verbatim):** "action cursor is not fixed. clickable presentation refs based on the current actions should be a generic mechanism. Add the updated tasks, then work on them one by one, keeping a detailed diary."

**Assistant interpretation:** Add concrete tasks for the UX/interaction gaps, then implement them systematically with diary and validation.

**Inferred user intent:** Make the POC behave more like a CLIM-style interaction system rather than a static UI: visible click affordances, current-action-driven presentation clickability, and a real command input.

**Commit (code):** `2898103` — "DMETA-DELI-PBUI-POC: wire clickable presentations and command input"

### What I did

- Added and completed ticket tasks for:
  - action/presentation hover and cursor affordances;
  - generic compatible-presentation click mechanism;
  - Street Deli `REMOVE-INGREDIENT` binding and ingredient clicks;
  - editable footer command input.
- Updated `ActionPresentationInline`, `PresentationRefLine`, and `ConfirmPrompt` with pointer cursors, hover states, and focus rings.
- Changed `ClimShell` footer from passive command text to an editable input with `aria-label="Action command"`.
- Added generic runtime helpers:
  - `bindingUsesInputSource`
  - `compatibleBindingsForPresentation`
- Added Street Deli `REMOVE-INGREDIENT` command binding in YAML and TypeScript.
- Updated detail view defaults to include `REMOVE-INGREDIENT`.
- Updated `DeliPbuiWorkbench` so:
  - menu presentations can invoke `CUSTOMIZE` through the generic compatible-binding path;
  - removable ingredient presentations can invoke `REMOVE-INGREDIENT` through the same mechanism;
  - removed ingredients display `(removed)`;
  - typed footer commands such as `CART` resolve through current view command bindings.
- Updated the intern-facing guide to describe the new state of the POC.

### Why

- Cursor/hover affordance is a basic usability requirement for review.
- Presentation clickability should not be hard-coded per component; it should derive from the concrete command/action bindings available in the current view.
- The footer must either be a real command input or be visually demoted to a status line. Since this is a CLIM-like POC, making it editable is the right direction.

### What worked

Validation/build commands passed:

```bash
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright checks passed:

```text
CUSTOMIZE cursor: pointer
Hudson Classic presentation cursor: pointer
turkey ingredient cursor: pointer
click turkey -> REMOVE-INGREDIENT -> remove_part(composition_ref, part_ref)
type CART in Action command input -> cart / CART
```

The full order path still passes:

```text
Market Greens click -> detail
avocado click -> REMOVE-INGREDIENT
ADD-TO-ORDER -> cart
PLACE-ORDER -> confirm
CONFIRM PLACE-ORDER -> tracker
```

Storybook detail-mode iframe check passed for clickable ingredient behavior.

### What didn't work

- The first Playwright result showed that input values do not appear in `innerText`, so command-input state should be checked through element values or resulting view transitions, not body text.
- The current generic compatibility rule is intentionally simple: it looks for command bindings that use `selected_presentation`. It does not yet evaluate full semantic action subject/input constraints.

### What I learned

- The command-binding layer is enough to drive a first generic clickable-presentation mechanism.
- A small convention such as `selected_presentation` already provides useful behavior across menu items and ingredients.
- The next level of correctness requires evaluating Semantic IR/Interaction IR constraints, not only command-binding input source names.

### What was tricky to build

- The mechanism needed to be generic while still respecting obvious Deli facts such as non-removable bread not being clickable for `REMOVE-INGREDIENT`. The POC uses the generic binding mechanism and applies the existing `ingredient.removable` domain fact at the presentation render point.
- The footer command line needed to stay controlled by React state while still allowing clicked actions to update the command buffer and typed commands to dispatch through command bindings.

### What warrants a second pair of eyes

- Review whether `compatibleBindingsForPresentation` should remain purely input-source-based or begin accepting semantic compatibility predicates.
- Review whether the footer command input should parse arguments with a schema from `action-bindings.yaml` rather than the current simple first-argument mapping.
- Review the action bar now that some commands require a selected presentation; the current behavior uses the active selection where possible.

### What should be done in the future

- Add explicit select mode for actions that need a compatible target instead of only direct-click invocation.
- Add typed command argument schemas to `action-bindings.yaml`.
- Promote the Playwright checks into committed tests once the POC stabilizes.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/components/` for cursor/input affordances.
- Review `proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts` for generic compatible-binding helpers.
- Review `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml` and `proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts` for `REMOVE-INGREDIENT`.
- Review `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx` for the click and REPL dispatch paths.
- Validate manually in the running Vite app and Storybook.

### Technical details

Current generic click rule:

```text
current view command bindings
  -> filter bindings whose input_mapping uses selected_presentation
  -> order by current view default_actions
  -> first compatible binding handles the presentation click
```

Current command input behavior:

```text
CART + Enter -> commandBindingsForView(currentView).CART -> navigate_to_cart
FILTER-DIETARY vegetarian + Enter -> filter_by_dietary(dietary_tag)
```

## Step 10: Lighten CLIM visual affordances to use underlines and color, not boxes

This step responded to visual review feedback after the clickable interaction pass. The previous fix made targets clickable, but it still used bordered/background boxes in places where the intended CLIM visual language should be lighter. The reviewer specifically called out `VIEW MODEL` and `COMPOSITION DRAFT` as too visually heavy.

I removed the remaining local card/box treatments from the proof-of-concept widget and kept clickable affordance on underlines, color changes, and cursor changes. This preserves the ability to discover clickable targets without making the screen feel like a set of heavy panels.

### Prompt Context

**User prompt (verbatim):** "Stick with underlins / color changes for things, not border boxes (including for thing like VIEW MODEL and COMPOSITION DRAFT. Border boxes are havy visually"

**Assistant interpretation:** Adjust the visual styling so clickable and structural elements use text treatment rather than bordered boxes.

**Inferred user intent:** Keep the CLIM UI dense and typographic; avoid card-like visual weight that distracts from command/presentation semantics.

**Commit (code):** `83e29dd` — "DMETA-DELI-PBUI-POC: lighten clickable presentation styling"

### What I did

- Removed bordered/background box treatments from the local POC view sections:
  - View model summary.
  - Composition draft summary.
  - Cart item rows.
  - Help rows.
  - Tracker/lifecycle summary.
- Changed clickable presentation refs to use:
  - pointer cursor;
  - text color change;
  - underline on hover/focus/selection.
- Changed action affordances to use underline/color changes rather than hover backgrounds.
- Removed the action bar border line and focus-ring box effects.
- Kept shell-level header/footer separators intact because those are structural terminal/shell boundaries rather than per-object boxes.

### Why

- The presentation system should feel text-first and command-oriented.
- Heavy boxes make every section compete visually with actual selectable presentations.
- Underline/color affordances better match the current desired CLIM-like style.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react
npm run build
npm run build-storybook
```

Playwright verified:

```text
VIEW MODEL border width: 0px
COMPOSITION DRAFT border width: 0px
CUSTOMIZE cursor: pointer
CUSTOMIZE text decoration: underline
turkey ingredient cursor: pointer
turkey click still builds REMOVE-INGREDIENT -> remove_part(composition_ref, part_ref)
```

### What didn't work

- My first Playwright assertion checked `borderTopStyle`, but Tailwind preflight reports `solid` even when border width is `0px`. I corrected the assertion to check `borderTopWidth`.

### What I learned

- Tailwind preflight can make computed `border-style` misleading; `border-width` is the right check for whether a visible border exists.
- The typography-only treatment still provides enough affordance when combined with `cursor: pointer`, hover color, and underline.

### What was tricky to build

- Some border styles were not in obvious component boxes anymore; the remaining visual weight came from local section wrappers and action-bar separators. I removed those without touching shell-level header/footer structure.

### What warrants a second pair of eyes

- Review whether shell header/footer separators should also become typographic only, or whether they are useful structural boundaries.
- Review whether selected presentation underline is sufficient for low-vision accessibility or should get an additional text marker.

### What should be done in the future

- Consider adding a small textual marker for current selection, such as `*` or `SELECTED`, instead of a box.
- Apply the same no-box rule to generated `www/clim-react` once the POC style stabilizes.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/components/` for generic clickable styling.
- Then review `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx` for local section wrapper styling.
- Validate visually in Vite/Storybook and with Playwright cursor/border checks.

### Technical details

Current visual rule:

```text
clickable presentation/action -> pointer + underline + color change
section metadata -> plain text with underlined label
avoid per-section border/background boxes
```

## Step 11: Encode visual rules in the PBUI style profile and design the reusable engine

This step converted several review observations into durable profile data and a new design document. The Street Deli style profile now explicitly says that ordinary PBUI views should avoid local border boxes, that clickability uses dotted underlines and color changes, that only selectable reference labels turn red, that technical reference text such as `<Ingredient>` and ids remains muted, that removed rows become faint across the whole row, and that BACK/URL routing are presentation-system expectations rather than ad hoc widget details.

The same work also produced the design guide for the reusable PBUI core action/presentation/ref/navigation/select engine. The guide explains why the current POC behavior should move out of `DeliPbuiWorkbench` and into a shared runtime engine that computes compatible actions, fills action slots, handles command input, manages select/confirm modes, derives visual state, disables unavailable actions, and synchronizes routes.

### Prompt Context

**User prompt (verbatim):** "Update the style-profile.yaml to encode the visual rules
- no boxes
- underline .... signals clickability and validity
- refs turn red when selectable (in addition to ....)
- no underline on titles or so.
- BACK is available pretty much everywhere + url routing as in most react apps

That way we can keep things consistent as we add more interactions.

---

Then create a design doc for the core action/presentation/ref/navigation/select engine that is going to be the engine of all PBUI applications. Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable."

**Assistant interpretation:** Persist the reviewed visual and navigation rules in the PBUI profile, then write an intern-facing design/implementation guide for a reusable PBUI interaction engine and upload it to reMarkable.

**Inferred user intent:** Stop accumulating one-off widget fixes; make the rules explicit in profile data and design the reusable engine before adding more interactions.

**Follow-up prompts:** "use dotted underline, like with the actions." / "also the ingredient name should only be read when selectable." / "<Ingredient> should be dark grey as well, as all \"techno babble\""

**Assistant interpretation of follow-ups:** Clickable references should use dotted underline. Only the domain label should turn red when selectable; technical prefix/id/capability text stays muted.

### What I did

- Rewrote `examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml` to encode:
  - no local/card boxes;
  - dotted underline as clickability/validity signal;
  - red only for selectable reference labels and dangerous actions;
  - no underline on titles/section labels;
  - muted technical text for `<Type>`, ids, and capabilities;
  - faint whole-row treatment for removed items;
  - BACK availability expectations;
  - URL routing expectations for normal React apps.
- Updated Street Deli PBUI command/view profile data so BACK is available in cart/help/tracker as well as detail/substitution.
- Adjusted the POC component styling so:
  - presentation labels get dotted red underline only when selectable;
  - `<Ingredient>` and other type prefixes are muted;
  - non-selectable ingredient names are not red;
  - confirm/action controls use dotted underline;
  - section titles remain plain, not underlined.
- Created the engine design document:
  - `ttmp/2026/05/25/DMETA-DELI-PBUI-POC--street-deli-pbui-react-proof-of-concept/design-doc/02-pbui-core-action-presentation-ref-navigation-select-engine.md`
- Related the new document to the profile, POC runtime, POC components, and POC widget files.

### Why

- Style rules need to live in the PBUI profile so generated and hand-authored targets stay visually consistent.
- The POC exposed a real architecture gap: clickable refs, command bindings, selection, slot filling, disabled reasons, BACK, routing, and confirmation are generic PBUI runtime concerns.
- A new intern should be able to read one document and understand the engine to build before we continue pushing behavior into templates.

### What worked

Validation/build checks passed:

```bash
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified:

```text
sourdough row cursor: default
sourdough label: not red
<Ingredient> type prefix: muted gray
turkey row cursor: pointer
turkey label: red dotted underline
click turkey -> REMOVE-INGREDIENT -> remove_part(composition_ref, part_ref)
```

### What didn't work

- The profile validator accepts the new `visual_rules` and `navigation_rules` data because the style profile model stores `Tokens` but does not yet structurally validate those new sections. That is acceptable for documentation/profile encoding now, but follow-up validation should make these rules typed.

### What I learned

- Visual consistency needs to be represented as profile data before it can become reliable generation output.
- The distinction between domain label and technical reference metadata is important: only the user-relevant label should take the red selectable treatment.
- The engine design should treat styling as derived visual state, not component-local CSS decisions.

### What was tricky to build

- The current Go profile model does not have typed fields for `visual_rules` and `navigation_rules`. YAML can carry those fields, but validation does not inspect them yet. I documented the rules first rather than blocking on schema expansion.
- The component needed to apply color only to the label span while leaving type/id/capability spans muted. This required making the reference line markup more explicit.

### What warrants a second pair of eyes

- Review whether `style-profile.yaml` should get typed Go fields and validation for `visual_rules` and `navigation_rules` in the next pass.
- Review the proposed engine API before implementation, especially route adapter shape and action slot compatibility.
- Review whether selected refs need a textual marker now that red underline is reserved for selectable refs.

### What should be done in the future

- Upload the new engine guide to reMarkable.
- Implement the engine in phases starting with typed engine state and compatibility derivation.
- Extend the generator to emit CSS/classes from typed style profile rules rather than local target assumptions.

### Code review instructions

- Start with `examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml`.
- Then read `design-doc/02-pbui-core-action-presentation-ref-navigation-select-engine.md`.
- Compare the design against current POC code in:
  - `proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts`
  - `proof-of-concept/deli-pbui-react/src/generic/clim/components/`
  - `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`

### Technical details

The core profile rule now reads as data:

```text
clickable ref label -> red + dotted underline + pointer
techno-babble (<Type>, #id, capabilities) -> muted gray
section title -> plain uppercase/muted text, no underline
removed row -> whole-row dimming
```

The engine design decomposes runtime behavior into:

```text
registries + domain context + route adapter
  -> engine state
  -> derived compatible actions/ref visual states
  -> renderer events
  -> action request / navigation / confirm transitions
```

## Step 12: Extract PBUI React component primitives and normalize dotted underline rendering

This step started splitting the generic CLIM renderer out of the old monolithic `components/` file. The goal is to give future PBUI generators stable semantic React targets: presentation refs, action presentations, command lines, section labels, and confirmation prompts should be emitted as components with semantic props, not as repeated local Tailwind class strings.

The immediate styling fix was the dotted underline. Actions and selectable reference labels now share one `PbuiClickableText` primitive. That primitive sets `text-decoration-skip-ink: auto`, dotted underline style, one-pixel thickness, and a fixed `2.5px` underline offset. The fixed pixel offset is deliberate because `em` offsets made uppercase action labels and lowercase ingredient labels compute different pixel positions.

### Prompt Context

**User prompt (verbatim):** "Use  text-decoration-skip-ink: auto; and properly adjust the underline offset so that the ACTION     
dotter underline matches the selectable ref underline, even if ingredients uses lowercase letters    
with descenders. Update the style guide too.    

then continue"

**Assistant interpretation:** Continue the component extraction and ensure the shared clickable underline implementation gives actions and selectable refs identical dotted underline geometry.

**Inferred user intent:** Stop styling PBUI affordances with duplicated CSS/Tailwind fragments and establish reusable React primitives that preserve the style profile rules.

### What I did

- Created per-widget directories under `proof-of-concept/deli-pbui-react/src/generic/clim/components/`:
  - `PbuiText`
  - `PbuiClickableText`
  - `PbuiSectionLabel`
  - `PbuiPresentationRef`
  - `PbuiAction`
  - `PbuiActionBar`
  - `PbuiCommandLine`
  - `PbuiConfirmPrompt`
  - `PbuiShell`
- Added `*.tsx`, `*.stories.tsx`, `index.ts`, and `types.ts` files for the extracted widgets.
- Removed the old `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx` compatibility barrel and updated the POC widget to import explicit per-widget component directories.
- Centralized dotted underline behavior in `PbuiClickableText`:
  - `textDecorationLine: underline`
  - `textDecorationStyle: dotted`
  - `textDecorationSkipInk: auto`
  - `textUnderlineOffset: 2.5px`
  - `textDecorationThickness: 1px`
- Updated `style-profile.yaml` to encode the shared dotted underline geometry.
- Updated the engine design guide with a component kit baseline section.

### Why

- The old component file made it too easy to spread one-off class strings across renderers.
- A generator should output semantic components such as `PbuiPresentationRef` and `PbuiAction`, not styling decisions.
- The underline offset must be common for actions and selectable refs even when their glyph shapes differ.

### What worked

Validation/build checks passed:

```bash
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified that `CUSTOMIZE` and selectable `turkey [protein]` both use:

```text
text-decoration-skip-ink: auto
text-underline-offset: 2.5px
text-decoration-style: dotted
cursor: pointer
```

It also confirmed that the `<Ingredient>` prefix remains muted gray while the selectable ingredient label turns red.

### What didn't work

- The first underline-offset check failed because `0.18em` produced different computed pixel offsets for uppercase action text and lowercase ingredient labels. I changed the shared primitive and style profile to use `2.5px`.
- Storybook's stricter `StoryObj` typing required `args` for stories whose components have required props. I added minimal args to the component stories.

### What I learned

- `text-decoration-skip-ink: auto` solves glyph ink overlap, but it does not make underline offset consistent if the offset is relative to font metrics. A fixed pixel offset is more reliable for this UI.
- The component kit is a natural bridge between the engine design and future code generation.

### What was tricky to build

- `PbuiPresentationRef` must render a single semantic ref while applying different visual rules to its parts: type/id/capability text is muted, while only the domain label becomes selectable/red/dotted-underlined.
- The old compatibility import path was removed; the POC widget now imports `PbuiActionBar`, `PbuiConfirmPrompt`, `PbuiPresentationRef`, and `PbuiShell` from their per-widget directories.

### What warrants a second pair of eyes

- Review whether `2.5px` is the right fixed underline offset across browser/font combinations.
- Review whether the aggregate `components/index.ts` package export is useful long-term, while keeping the old `components.tsx` compatibility shim removed.
- Review whether `PbuiShell` should take brand/title as props before it becomes reusable across non-Deli PBUI apps.

### What should be done in the future

- Replace POC imports with explicit component-kit imports.
- Add visual regression checks for the underline geometry.
- Continue extracting engine-aware components once `PresentationVisualState` exists.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiClickableText/PbuiClickableText.tsx`.
- Then review `PbuiPresentationRef` and `PbuiAction` to see how both reuse the same clickable primitive.
- Review the new Storybook stories under each component directory.
- Compare the style constants against `examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml`.

### Technical details

The shared underline style is:

```ts
const clickableDecorationStyle = {
  textDecorationLine: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationSkipInk: 'auto',
  textUnderlineOffset: '2.5px',
  textDecorationThickness: '1px',
};
```

### Upload note

After committing Step 12, I re-uploaded the updated engine guide to reMarkable:

```text
OK: uploaded DMETA PBUI Core Engine Guide.pdf -> /ai/2026/05/25/DMETA-DELI-PBUI-POC
```

## Step 13: Remove the old component compatibility barrel

This step removed the temporary `components.tsx` compatibility shim after the PBUI component-kit extraction. The proof-of-concept widget now imports the specific component directories it uses, which makes the new per-widget structure the real baseline instead of hiding it behind the old monolithic filename.

The change is intentionally small but important for future generation. If generators are going to target `PbuiPresentationRef`, `PbuiActionBar`, `PbuiCommandLine`, and related widgets, the application code should demonstrate those imports directly.

### Prompt Context

**User prompt (verbatim):** "remove compatibility barrel. continue"

**Assistant interpretation:** Delete the old compatibility layer, move the POC widget onto explicit component-kit imports, and continue validating the extracted component baseline.

**Inferred user intent:** Make the extracted component structure authoritative and avoid carrying a backwards-compatibility shim that would encourage new code to keep depending on the old monolithic `components.tsx` shape.

### What I did

- Deleted `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx`.
- Updated `DeliPbuiWorkbench` to import directly from per-widget component directories:
  - `components/PbuiActionBar`
  - `components/PbuiConfirmPrompt`
  - `components/PbuiPresentationRef`
  - `components/PbuiShell`
- Updated current design docs/diary references so the new component directory is the documented baseline.
- Rebuilt the app and Storybook.
- Restarted the tmux review servers.
- Ran a Playwright check against the live app.

### Why

- The compatibility barrel was useful for one commit while splitting the file, but keeping it would obscure the new structure.
- New generated or hand-authored PBUI code should import semantic widgets directly.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified the live app still works after the import change:

```text
turkey selectable label skip-ink: auto
turkey selectable label underline offset: 2.5px
turkey selectable label decoration style: dotted
click turkey -> REMOVE-INGREDIENT -> remove_part(composition_ref, part_ref)
```

### What didn't work

- N/A. The build and browser check passed after replacing the imports.

### What I learned

- The component extraction is now visible at the call site. `DeliPbuiWorkbench` reads more like a client of a PBUI component kit rather than a consumer of a legacy components file.

### What was tricky to build

- The only sharp edge was documentation drift: some active guide text still mentioned `components.tsx`. I updated the active design docs and diary references where they described the current target shape. Historical changelog entries still mention the old path because they describe earlier commits.

### What warrants a second pair of eyes

- Review whether the aggregate `components/index.ts` export should remain. It is a package convenience export, not the removed compatibility shim, but generated code may prefer explicit per-widget imports.

### What should be done in the future

- Continue moving engine-aware behavior into reusable modules under `generic/clim`.
- Decide whether generated code should import from each widget directory or from the aggregate `components/index.ts`.

### Code review instructions

- Confirm `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx` is gone.
- Review `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx` imports.
- Validate with build, Storybook build, and the live Playwright click check.

### Technical details

Current preferred import style:

```ts
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiPresentationRef } from '../../generic/clim/components/PbuiPresentationRef';
```

## Step 14: Extract first generic engine types and compatibility helpers

This step started implementing the engine described in the new design guide. The goal was not to finish the full reducer, routing, and select-mode engine in one pass. The goal was to remove another set of generic rules from `DeliPbuiWorkbench`: view/action typing, compatible binding derivation, presentation visual-state derivation, action-presentation derivation, and availability handling.

The Street Deli widget now consumes generic PBUI helper functions for compatible presentation refs and action bar derivation. It still owns domain handlers and local proof-of-concept state, but the logic that answers “which bindings can use this ref?” and “which actions should be enabled or disabled?” has moved into reusable `generic/clim` modules.

### Prompt Context

**User prompt (verbatim):** "continue."

**Assistant interpretation:** Continue the next documented PBUI engine implementation phase after removing the component compatibility barrel.

**Inferred user intent:** Keep turning the proof-of-concept from local widget behavior into reusable PBUI runtime structure that future generators can target.

### What I did

- Added engine task entries for:
  - generic engine types;
  - compatibility/action derivation helpers;
  - availability policy wiring and empty-order prevention.
- Added `proof-of-concept/deli-pbui-react/src/generic/clim/engineTypes.ts` with:
  - view model type;
  - presentation visual state;
  - availability result;
  - engine registries/state sketches;
  - derivation contexts.
- Added `proof-of-concept/deli-pbui-react/src/generic/clim/compatibility.ts` with:
  - `bindingUsesInputSource`;
  - `sortBindingsByCommandOrder`;
  - `compatibleBindingsForPresentation`;
  - `actionPresentationForBinding`;
  - `actionPresentationsForBindings`;
  - `presentationVisualState`.
- Removed duplicated compatibility helpers from `runtime.ts` so runtime stays focused on request construction.
- Updated `DeliPbuiWorkbench` to use generic helpers for:
  - action bar derivation;
  - compatible presentation derivation;
  - presentation visual state;
  - PLACE-ORDER disabled reason when cart is empty.

### Why

- The widget should not be the owner of generic PBUI compatibility logic.
- `PLACE-ORDER` on an empty cart is a concrete example of the generic availability layer the engine needs.
- Presentation refs should render from derived visual state rather than ad hoc booleans computed inline.

### What worked

Build and Storybook passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

The live tmux servers were restarted and Playwright verified:

```text
click Hudson Classic -> detail
click turkey -> REMOVE-INGREDIENT request
ADD-TO-ORDER -> cart
PLACE-ORDER -> confirm
CONFIRM PLACE-ORDER -> tracker
empty cart PLACE-ORDER is disabled
submitting PLACE-ORDER in command input on empty cart reports "Cart is empty."
```

### What didn't work

- My first Playwright empty-order check tried to click the disabled `PLACE-ORDER` button. Playwright correctly waited for the disabled button to become enabled and timed out. I changed the check to assert that the button is disabled, then submitted `PLACE-ORDER` through the command input to verify the disabled reason.

### What I learned

- Availability must be checked in both UI click paths and command-line submission paths.
- The generic compatibility layer can be extracted incrementally without forcing the whole widget into a reducer immediately.
- Disabled actions are still useful in the action bar because they teach the user which action exists and why it is unavailable.

### What was tricky to build

- The generic compatibility helper still needs application-specific predicates. For example, `REMOVE-INGREDIENT` should accept only removable, not-yet-removed ingredient refs. The helper accepts `canUsePresentation` so the generic engine can call back into domain/profile constraints until those constraints are generated.
- The POC action descriptors and command bindings use concrete Deli ids, so the generic helper types had to preserve command/action generics without making the widget unreadable.

### What warrants a second pair of eyes

- Review whether `canUsePresentation` should be replaced by generated action input constraints in the next pass.
- Review whether `AvailabilityResult` should include a severity or visibility flag in addition to enabled/reason.
- Review whether disabled action presentations should stay in the action bar by default for all PBUI apps.

### What should be done in the future

- Add route adapter and URL synchronization.
- Move mode transitions into a reducer-based engine.
- Replace the POC widget's remaining command execution switch with domain handler registration.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/engineTypes.ts`.
- Then review `proof-of-concept/deli-pbui-react/src/generic/clim/compatibility.ts`.
- Finally review `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx` to see which logic moved out of the widget.
- Validate with build, Storybook build, and Playwright checks described above.

### Technical details

The current engine extraction is deliberately derivation-first:

```text
bindings + actions + selected ref + availability policy
  -> action presentations

bindings + presentation ref + command order + compatibility predicate
  -> compatible bindings

presentation ref + selected ref + compatible bindings + removed flag
  -> visual state
```

## Step 15: Add browser route adapter and wire POC view state to URLs

This step implemented the first route adapter slice of the PBUI engine design. The proof-of-concept no longer keeps the current view only in local React state. It now maps view transitions to normal browser paths such as `/menu`, `/detail/salad.market-greens`, `/cart`, `/help`, and `/tracker/current`, listens to `popstate`, and uses browser history for BACK with a menu fallback.

This is still a lightweight POC route adapter, not a full React Router integration. The important part is that PBUI view state now has a generic route abstraction and the Street Deli widget proves it with actual browser URLs.

### Prompt Context

**User prompt (verbatim):** "continue."

**Assistant interpretation:** Continue the next documented PBUI engine phase after extracting compatibility helpers; route/view synchronization and BACK behavior were the next architectural gaps.

**Inferred user intent:** Keep replacing ad hoc widget behavior with reusable PBUI engine modules, especially for navigation and URL state.

### What I did

- Added `proof-of-concept/deli-pbui-react/src/generic/clim/routing.ts` with:
  - `RouteSnapshot`
  - `RouteCodec`
  - `currentRoute`
  - `pushRoute`
  - `replaceRoute`
  - `backOrFallback`
  - `listenToRouteChanges`
- Added Street Deli route codec functions in `DeliPbuiWorkbench` for:
  - `/menu`
  - `/detail/:itemId`
  - `/substitution/:draftId`
  - `/cart`
  - `/help`
  - `/tracker/current`
- Changed widget navigation to push routes instead of only calling `setViewId`.
- Added popstate handling so browser back updates the PBUI view.
- Changed `BACK` to use `backOrFallback` rather than hard-coding menu navigation.

### Why

- URL routing is part of the core PBUI interaction contract for React applications.
- BACK is not the same as MENU. BACK should use browser/app history where possible and only fall back to MENU when no app route is available.
- Future generators need a route adapter target rather than view transitions hidden inside widget switch statements.

### What worked

Build and Storybook passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified:

```text
/ redirects/replaces to /menu
click Market Greens -> /detail/salad.market-greens
BACK -> /menu
open /detail/sandwich.hudson-classic directly -> detail view for Hudson Classic
CART -> /cart
```

### What didn't work

- N/A for this slice. The lightweight route adapter passed the browser checks.

### What I learned

- A small route codec is enough to prove the engine boundary before introducing a full router dependency.
- Browser URL tests are now a better acceptance check than checking only visible text.

### What was tricky to build

- Direct routes can arrive before menu data is loaded. The POC stores the route item id immediately and lets the existing menu lookup resolve it once RTK Query fixture data is available.
- `BACK` uses browser history, so the visible result depends on prior navigation. The POC fallback still needs more robust app-history tracking later.

### What warrants a second pair of eyes

- Review whether the reusable route adapter should stay history-API based or target React Router/TanStack Router directly.
- Review whether route parsing should live in generated Deli code rather than the hand-authored widget.
- Review whether `/tracker/current` should eventually be `/tracker/:orderId` once order ids exist.

### What should be done in the future

- Move the Deli route codec into generated/domain code.
- Add
 committed route interaction tests for direct links and BACK.
- Track app-local history depth if browser history fallback behavior proves too broad.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/routing.ts`.
- Then review the route codec and `navigateToView` / `navigateBack` wiring in `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Validate by opening `/`, clicking a menu item, using BACK, opening `/detail/sandwich.hudson-classic` directly, and navigating to CART.

### Technical details

The route adapter shape is:

```text
RouteCodec.parse(pathname) -> RouteSnapshot
RouteCodec.format(snapshot) -> pathname
pushRoute(codec, snapshot) -> history.pushState
listenToRouteChanges(codec, handler) -> popstate bridge
```

## Step 16: Move session mode, confirmation, command buffer, result line, and selected ref onto a generic reducer

This step extracted the first reducer-based PBUI mode machine. The POC still has Deli-specific application state for cart contents, removed ingredients, and selected menu item, but the CLIM/PBUI session state is now handled by a reusable reducer: normal/confirm mode, selected presentation ref, pending command/request, command buffer, and result line.

This is an architectural cleanup more than a visual change. The existing confirm/order, command input, clickable ref, disabled action, and URL route flows should behave the same, but their state transitions now go through explicit generic events instead of scattered `useState` setters.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the next PBUI engine implementation phase after compatibility and route extraction.

**Inferred user intent:** Keep moving local widget behavior into reusable PBUI engine modules while preserving the Street Deli proof-of-concept behavior.

### What I did

- Added `proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts` with:
  - `PbuiSessionState`
  - `PbuiSessionEvent`
  - `initialPbuiSessionState`
  - `pbuiSessionReducer`
- Refactored `DeliPbuiWorkbench` to replace local `useState` for:
  - selected presentation ref;
  - pending command binding;
  - pending action request;
  - command buffer;
  - result line.
- Kept Deli-specific state local for now:
  - selected menu item id;
  - removed ingredient ids;
  - cart items;
  - current view id.
- Fixed Storybook route initialization so Storybook iframe paths such as `/iframe.html` do not override explicit story args like `initialView: 'detail'`.

### Why

- PBUI mode transitions should be explicit events, not implicit coordination across several local state setters.
- Confirmation mode is part of the reusable PBUI engine contract.
- The widget should eventually compose engine state and domain handlers rather than owning the PBUI session state model itself.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified the reducer-backed app flow:

```text
/ -> /menu
Hudson Classic -> /detail/sandwich.hudson-classic
turkey click -> REMOVE-INGREDIENT request
ADD-TO-ORDER -> /cart
PLACE-ORDER -> confirm prompt
CONFIRM PLACE-ORDER -> /tracker/current
/cart with empty cart disables PLACE-ORDER
command input PLACE-ORDER on empty cart reports "Cart is empty."
/detail/salad.market-greens direct route renders Market Greens
```

Playwright also verified Storybook args still work after route initialization changes:

```text
DetailMode story -> detail view for Hudson Classic
CartMode story -> cart view with one Hudson Classic item
```

### What didn't work

- No build/runtime blocker in this step.
- I noticed that route initialization needed to distinguish application routes from Storybook iframe routes. Without that distinction, story args could be silently overridden by parsing `/iframe.html` as an unknown route and falling back to menu.

### What I learned

- The session reducer boundary is small and useful: confirmation state, command text, selected ref, and result/status text are generic enough to move now.
- Cart mutation and route mutation still belong outside this reducer until the domain handler registry exists.
- Storybook is an important guardrail for route-aware widgets because it runs the component under a non-application pathname.

### What was tricky to build

- `confirmPending` needs to snapshot the pending command/request before dispatching `confirm-completed`, otherwise the values are conceptually cleared before composing the result text. The code now stores `confirmedCommand` and `confirmedRequest` first.
- The route-aware initial state must support two modes: app/direct-link paths should seed view state from the URL, while Storybook/non-app host paths should honor component props.

### What warrants a second pair of eyes

- Review whether `route-changed` should clear `selectedRef` by default instead of preserving it.
- Review whether view id should also move into the generic reducer now, or remain route/domain-owned until the handler registry is extracted.
- Review whether `PbuiSessionEvent` names are stable enough for generated code to target.

### What should be done in the future

- Add explicit select mode for actions that need a compatible target but have no selected presentation.
- Extract domain handler registration so `executeBinding` is not a local switch statement.
- Add committed interaction/play tests for the reducer-backed confirmation and BACK flows.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts`.
- Then review the `useReducer` wiring in `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Check that the only remaining local state is Deli/domain state or route/view state.
- Validate with `npm run build`, `npm run build-storybook`, and the Playwright flow listed above.

### Technical details

The reducer now owns this subset of PBUI state:

```text
mode: normal | select | confirm
selectedRef?: PresentationRef
pendingCommand?: CommandBinding
pendingRequest?: ActionRequest
commandBuffer: string
resultLine?: string
```

The widget dispatches explicit events such as:

```text
select-ref
set-command-buffer
set-result
enter-confirm
confirm-completed
confirm-cancelled
route-changed
```

## Step 17: Add explicit select mode for action-bar target selection

This step made select mode concrete. Before this change, ingredient rows could be clicked directly because compatible-presentation derivation already made them selectable. However, invoking `REMOVE-INGREDIENT` from the action bar without first selecting an ingredient was ambiguous and could accidentally use the default selected menu item as the action subject. The PBUI session reducer now supports an explicit `select` mode, and the Deli POC enters that mode when an action needs a `selected_presentation` input but the current selected ref is not compatible.

The result is closer to the CLIM/PBUI model: commands can ask the user to select a compatible presentation target, the UI mode changes to `SELECT`, and the next compatible presentation click completes the action.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the remaining PBUI core engine behavior after reducer extraction, especially explicit select mode.

**Inferred user intent:** Make action invocation work through reusable PBUI interaction states instead of depending only on direct presentation clicks.

### What I did

- Extended `proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts` with select-mode events:
  - `enter-select`
  - `select-completed`
  - `select-cancelled`
- Updated `DeliPbuiWorkbench` so action invocation checks whether a binding that uses `selected_presentation` has a compatible selected subject.
- If no compatible subject exists, the widget dispatches `enter-select` and shows:
  - mode label `SELECT`
  - result text `Select a compatible target for REMOVE-INGREDIENT.`
- Updated compatible presentation derivation during select mode so the pending command determines which presentation refs are selectable.
- Updated presentation click handling so selecting a compatible target completes select mode and invokes the pending command with that target.

### Why

- `REMOVE-INGREDIENT` requires an ingredient target, not the currently selected menu item.
- PBUI actions should be able to ask for missing compatible inputs interactively.
- Select mode is a core part of the engine contract described in the PBUI guide.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified:

```text
open /detail/sandwich.hudson-classic
click REMOVE-INGREDIENT action bar item
mode changes to SELECT
result says Select a compatible target for REMOVE-INGREDIENT.
click tomato presentation
tomato becomes removed
result says Built action request: REMOVE-INGREDIENT -> remove_part(composition_ref, part_ref)
ADD-TO-ORDER -> cart
PLACE-ORDER -> confirm
CANCEL -> normal cart state with cancellation result
```

### What didn't work

- No build or runtime blocker in this step.
- The visual language for select mode is still minimal: mode label plus selectable refs. It does not yet add a separate instruction banner or keyboard escape binding.

### What I learned

- Select mode needs the pending command, not just a generic selected state. The pending command is what defines which refs are compatible.
- The existing `canUsePresentation` predicate became more valuable once action-bar invocation needed to distinguish compatible and incompatible selected refs.
- Direct presentation clicks and action-bar-driven selection can share the same compatibility helper once select mode narrows the binding list to the pending command.

### What was tricky to build

- `activeSelected` falls back to the selected menu item so the detail view has a useful default subject for some commands. That fallback is wrong for `REMOVE-INGREDIENT`, so action invocation now calls `bindingHasCompatibleSubject` before building the request.
- Selection completion must dispatch `select-completed` before invoking the binding so the mode returns to normal while the command execution path records the final action request result.

### What warrants a second pair of eyes

- Review whether select mode should suppress unrelated actions in the action bar until selection completes.
- Review whether selecting an incompatible ref should be impossible at the component level or should produce an explicit result-line error.
- Review whether `select-cancelled` should be wired to `BACK`, `ESC`, or a visible cancel action next.

### What should be done in the future

- Add keyboard cancellation for select mode.
- Add Storybook play tests for select mode.
- Move `canUsePresentation` into generated/profile-derived constraints rather than local Deli widget code.

### Code review instructions

- Start with the new select events in `proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts`.
- Then review `handleInvoke`, `compatibleBindingsFor`, and `handlePresentationClick` in `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Validate manually by opening `/detail/sandwich.hudson-classic`, clicking the `REMOVE-INGREDIENT` action bar command, and selecting `tomato`.

### Technical details

Select-mode flow:

```text
invoke action with selected_presentation input
  -> selected subject missing/incompatible
  -> enter-select(pendingCommand)
  -> compatible refs derive from pendingCommand
  -> click compatible ref
  -> select-completed(selectedRef)
  -> invoke pendingCommand with selectedRef
```

## Step 18: Extract generic command handler registry and move Deli execution out of the widget switch

This step continued the engine extraction by removing the local `switch (binding.id)` command execution block from `DeliPbuiWorkbench`. The widget still composes the PBUI shell and owns POC-local state, but command execution now goes through a generic handler-registry helper and a Deli domain registry keyed by concrete binding handler names such as `deli.selectMenuItem`, `deli.removeIngredient`, and `deli.navigateToCart`.

I also recorded the requested future Redux follow-up as an open task. The current plain PBUI reducer remains useful as the pure state-machine core, but the later task captures the direction: wrap it in a Redux slice so generated PBUI apps can compose mode/session state the same way they compose domain slices.

### Prompt Context

**User prompt (verbatim):** "ok, create a later tasks to turn it into a redux slice, so that we have an easily composable setup based on slices.

But then continue with what you were doing."

**Assistant interpretation:** Add a future task to wrap the PBUI session reducer in Redux, then continue the in-progress handler-registry extraction.

**Inferred user intent:** Keep the immediate POC refactor moving, while making sure the architecture converges toward composable Redux slices instead of isolated local reducers.

### What I did

- Added an open follow-up task:
  - `Later: wrap the generic PBUI session reducer in a Redux slice for composable app integration`
- Added `proof-of-concept/deli-pbui-react/src/generic/clim/handlerRegistry.ts` with:
  - `PbuiCommandHandlerContext`
  - `PbuiCommandHandlerResult`
  - `PbuiCommandHandler`
  - `PbuiCommandHandlerRegistry`
  - `runCommandHandler`
- Added `proof-of-concept/deli-pbui-react/src/domain/deli/handlers.ts` with:
  - `DeliCommandHandlerEnvironment`
  - `deliCommandHandlers`
  - `assertDeliHandlerCoverage`
- Replaced the local `executeBinding` switch in `DeliPbuiWorkbench` with `runCommandHandler(...)`.
- Added module-time handler coverage checking against `deliCommandBindings`.
- Updated confirmation completion so confirmed commands also run through the handler registry before navigating to tracker.

### Why

- Command execution should not be hard-coded in the widget.
- Generated PBUI targets should emit or import domain handler registries, then let the generic engine call handlers by binding metadata.
- Handler names already existed in `commandBindings.ts`; using them makes those bindings operational instead of descriptive-only.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified the handler-registry-backed flows:

```text
/ -> /menu
Hudson Classic -> /detail/sandwich.hudson-classic
REMOVE-INGREDIENT action bar -> SELECT mode
tomato click -> tomato removed and remove_part request recorded
ADD-TO-ORDER -> /cart with Hudson Classic and removed tomato
PLACE-ORDER -> confirm prompt
CONFIRM PLACE-ORDER -> /tracker/current with confirmed request
/cart empty -> PLACE-ORDER disabled and command input reports Cart is empty.
/detail/salad.market-greens -> CART -> /cart
```

### What didn't work

- No build/runtime blocker in this step.
- The submit-order handler currently has no domain side effect; confirmation still performs tracker navigation in the widget after invoking the handler. This is acceptable for the POC, but the eventual domain handler should probably create/order-track an actual order id.

### What I learned

- The existing `handler` strings in command bindings are the right seam for moving from local widget behavior to generated domain code.
- A generic handler registry can stay tiny if it only resolves handler names and passes a typed environment.
- Handler coverage checking catches profile/binding drift early without requiring a full test harness.

### What was tricky to build

- Handler functions need controlled access to React state setters without importing React. The compromise is `DeliCommandHandlerEnvironment`: a narrow object of domain state and effects supplied by the widget.
- `ADD-TO-ORDER` needs the current cart item count to generate a stable POC id. That count now comes through the handler environment instead of reading widget state directly.
- Confirmed commands are different from normal commands: the request is already built and stored in session state. `confirmPending` therefore invokes the registry with the pending command/request before completing the confirmation mode.

### What warrants a second pair of eyes

- Review whether the generic registry result should distinguish `handled: false` from handler-thrown errors more explicitly.
- Review whether navigation effects should live in Deli handlers or in a separate route effect registry.
- Review whether handler coverage should throw at module load time or be a development-only assertion.

### What should be done in the future

- Implement the open Redux-slice follow-up task for `pbuiSessionReducer`.
- Add committed tests for handler coverage and handler-registry command execution.
- Move the Deli handler environment into a generated/domain adapter shape.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/handlerRegistry.ts`.
- Then review `proof-of-concept/deli-pbui-react/src/domain/deli/handlers.ts`.
- Finally review `executeBinding` and `confirmPending` in `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`.
- Validate with `npm run build`, `npm run build-storybook`, and the Playwright flow above.

### Technical details

The new execution path is:

```text
CommandBinding.handler
  -> runCommandHandler(registry, binding, request, environment)
  -> domain handler mutates app/domain state or navigates
  -> widget records default or handler-provided result line
```

## Step 19: Replace local PBUI reducer with Redux Toolkit slice and isolate Storybook stores

This step turned the PBUI session state machine into a proper Redux Toolkit slice. The previous plain reducer was useful for discovering the state transitions, but the desired target architecture is slice-based composition: app data, RTK Query cache, PBUI session state, and domain slices should all be composable through the same store setup.

The Deli workbench now reads PBUI session state from Redux and dispatches generated slice actions instead of using React `useReducer`. Storybook stories also get a fresh per-story store, which prevents session state leakage between stories and makes Storybook a better preview of generated app integration.

### Prompt Context

**User prompt (verbatim):** "Replace reducer with a proper redux slice, set up mock store for the storybook"

**Assistant interpretation:** Implement the Redux-slice follow-up now: replace the local PBUI reducer with a Redux slice and make Storybook use an isolated mock/app store.

**Inferred user intent:** Align the POC with a composable Redux-slice architecture instead of keeping local reducer state hidden inside the widget.

### What I did

- Checked the earlier Redux-slice follow-up task and added/checked concrete tasks for:
  - replacing local PBUI `useReducer` state with Redux Toolkit;
  - adding app store factory and typed hooks;
  - setting up per-story mock Redux stores.
- Added `proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts` with:
  - `PbuiSessionState`
  - `pbuiSessionSlice`
  - `pbuiSessionActions`
  - `pbuiSessionReducer`
- Removed `proof-of-concept/deli-pbui-react/src/generic/clim/modeMachine.ts`.
- Updated `proof-of-concept/deli-pbui-react/src/app/store.ts` to use:
  - `combineReducers`
  - `setupStore(preloadedState?)`
  - `pbuiSession` slice reducer
  - RTK Query middleware
- Added typed hooks in `proof-of-concept/deli-pbui-react/src/app/hooks.ts`.
- Updated `DeliPbuiWorkbench` to use:
  - `useAppSelector((state) => state.pbuiSession)`
  - `useAppDispatch()`
  - `pbuiSessionActions.*`
- Updated Storybook stories to render `DeliPbuiWorkbench` inside a fresh `Provider store={setupStore()}` per story.

### Why

- Redux slices are the desired composable target for generated PBUI apps.
- A slice can be combined with RTK Query and future domain slices without creating parallel state-management styles.
- Storybook should not share a global app store across stories when the component mutates interaction/session state.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified the Redux-slice-backed app flow:

```text
/ -> /menu
Hudson Classic -> /detail/sandwich.hudson-classic
REMOVE-INGREDIENT -> SELECT mode
tomato click -> tomato removed
ADD-TO-ORDER -> /cart
PLACE-ORDER -> confirm prompt
CONFIRM PLACE-ORDER -> /tracker/current
/cart empty -> PLACE-ORDER disabled and command input reports Cart is empty.
```

Playwright also verified Storybook store isolation:

```text
DetailMode story enters SELECT after clicking REMOVE-INGREDIENT
CartMode story still renders a clean cart story with one Hudson Classic item
```

### What didn't work

- N/A. Build, Storybook build, app flow, and Storybook checks passed.

### What I learned

- The previously extracted pure reducer mapped cleanly to Redux Toolkit actions.
- The store factory is the right seam for Storybook isolation and later test setup.
- Resetting the PBUI session slice on workbench mount preserves the old initial result/command behavior while allowing the state to live globally.

### What was tricky to build

- The slice is generic PBUI infrastructure, but Redux slices are concrete runtime modules. The slice stores plain `CommandBinding`, `ActionRequest`, and `PresentationRef` objects using broad string-typed generics; the Deli widget casts pending commands back to Deli-specific command/action ids at the few typed domain boundaries.
- Storybook runs under `/iframe.html`, while the app route codec handles `/menu`, `/detail/...`, and other app routes. The existing Storybook-safe route initialization remains necessary so story args are not overridden by the Storybook iframe path.

### What warrants a second pair of eyes

- Review whether `pbuiSessionSlice` should store only command ids/request ids instead of full plain command/request objects.
- Review whether resetting the PBUI session on every workbench mount is the right default for generated apps.
- Review whether store factory preloaded state should become the standard Storybook/testing API for all generated PBUI apps.

### What should be done in the future

- Add committed tests for the Redux slice reducers.
- Add a generated slice template for PBUI session state.
- Consider moving remaining Deli-local cart and composition state into a Deli domain slice.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts`.
- Then review `proof-of-concept/deli-pbui-react/src/app/store.ts` and `src/app/hooks.ts`.
- Review the Storybook decorator in `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.stories.tsx`.
- Finally review `DeliPbuiWorkbench` to confirm it no longer uses React `useReducer` for PBUI session state.

### Technical details

The composed Redux store now has this shape:

```text
RootState
  deliApi: RTK Query cache/reducer
  pbuiSession: PBUI session slice
```

The widget dispatches slice actions such as:

```text
pbuiSessionActions.enterSelect(...)
pbuiSessionActions.enterConfirm(...)
pbuiSessionActions.confirmCompleted(...)
pbuiSessionActions.routeChanged(...)
```

## Step 20: Move Deli workbench domain state into a Redux slice

This step continued the slice-based refactor by moving the remaining Street Deli workbench state out of local React state. After the PBUI session moved into `pbuiSession`, the widget still owned view id, selected item id, removed ingredient ids, and cart items. Those are now in a Deli-specific Redux slice so the POC has a more composable app shape: RTK Query for menu data, PBUI session slice for interaction state, and Deli workbench slice for domain/workbench state.

The widget is now closer to a generated shell: it selects state from Redux, derives presentations/actions, and dispatches slice actions or handler-registry commands. Deli command handlers no longer receive React state setters; they receive domain effect functions backed by the Deli slice.

### Prompt Context

**User prompt (verbatim):** "go ahead"

**Assistant interpretation:** Continue with the next proposed step: move remaining Deli cart/composition/workbench state into a domain Redux slice.

**Inferred user intent:** Finish the transition toward a composable Redux-slice setup rather than leaving important application state hidden in component-local state.

### What I did

- Added `proof-of-concept/deli-pbui-react/src/domain/deli/deliWorkbenchSlice.ts` with:
  - `DeliWorkbenchState`
  - `deliWorkbenchSlice`
  - `deliWorkbenchActions`
  - `deliWorkbenchReducer`
- Updated `proof-of-concept/deli-pbui-react/src/app/store.ts` to compose:
  - `deliApi`
  - `pbuiSession`
  - `deliWorkbench`
- Refactored `DeliPbuiWorkbench` to select Deli workbench state from Redux:
  - `viewId`
  - `selectedItemId`
  - `removedIngredientIds`
  - `cartItems`
- Refactored route changes, item selection, ingredient removal, cart insertion, and initial story cart seeding to dispatch Deli slice actions.
- Updated `DeliCommandHandlerEnvironment` so handlers receive `selectItem`, `removeIngredient`, and `addCartItem` domain effects instead of React setters.

### Why

- A generated PBUI app should compose slices, not mix global session state with local domain state.
- Cart/review state and composition draft state are application-domain state, not widget implementation details.
- Storybook and future tests can now preload or inspect both PBUI session state and Deli workbench state from the store factory.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified the domain-slice-backed app flow:

```text
/ -> /menu
Hudson Classic -> /detail/sandwich.hudson-classic
REMOVE-INGREDIENT -> SELECT mode
tomato click -> tomato removed
ADD-TO-ORDER -> /cart
cart contains Hudson Classic with removed tomato
PLACE-ORDER -> confirm prompt
CONFIRM PLACE-ORDER -> /tracker/current
/cart empty -> PLACE-ORDER disabled and command input reports Cart is empty.
```

Playwright also verified Storybook store isolation and domain slice state:

```text
DetailMode story can enter SELECT
CartMode story renders one seeded Hudson Classic cart item
MenuMode story returns to clean menu state and does not leak SELECT mode
```

### What didn't work

- No build/runtime blocker in this step.

### What I learned

- The PBUI session slice and Deli workbench slice have clean separation: session owns interaction mode and pending commands; Deli workbench owns view/domain state.
- Storybook story args still matter because each story resets Deli workbench state on mount before optional `initialCart` seeding.
- The existing handler registry works better once its environment is backed by slice actions rather than component-local setters.

### What was tricky to build

- `initialCart` seeding needs menu fixture data, which arrives through RTK Query. The widget now seeds the cart through a small effect once `selectedItem` is available and the cart is still empty.
- Route initialization and Redux initialization both run on mount. The widget resets the Deli workbench slice from the initial route snapshot, then route popstate handlers keep the slice synchronized with browser navigation.

### What warrants a second pair of eyes

- Review whether `viewId` should remain in `deliWorkbench` or move into a generic PBUI route/view slice later.
- Review whether `DeliCartItem` should store full `MenuItem` objects or only menu item ids plus configuration deltas.
- Review whether the initial Storybook cart seeding should happen through preloaded store state rather than a component effect.

### What should be done in the future

- Add committed reducer tests for `deliWorkbenchSlice`.
- Consider normalizing cart items by id if the POC grows beyond target discovery.
- Move route/view state into a generated route adapter slice if multiple PBUI widgets share navigation.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/domain/deli/deliWorkbenchSlice.ts`.
- Then review `proof-of-concept/deli-pbui-react/src/app/store.ts` for composed reducers.
- Review `DeliPbuiWorkbench` to confirm Deli workbench state now comes from Redux selectors rather than local `useState`.
- Review `proof-of-concept/deli-pbui-react/src/domain/deli/handlers.ts` for the narrower slice-backed handler environment.

### Technical details

Current Redux store shape:

```text
RootState
  deliApi: RTK Query cache/reducer
  pbuiSession: PBUI session and mode state
  deliWorkbench: Deli view/selection/composition/cart state
```

## Step 21: Replace hard-coded Deli compatibility checks with profile-shaped compatibility rules

This step turned another piece of ad hoc Street Deli widget behavior into PBUI design-system metadata plus a generic evaluator. Before this change, `DeliPbuiWorkbench` knew directly that `CUSTOMIZE` only accepts `MenuItem` refs and `REMOVE-INGREDIENT` only accepts removable, not-yet-removed `Ingredient` refs. That made the React widget the owner of PBUI compatibility semantics.

The widget now asks a generic compatibility-rule evaluator. The Deli-specific rule registry is a TypeScript stand-in for generated profile output, and the concrete PBUI profile YAML now carries the same compatibility metadata next to the command bindings. This keeps the POC behavior intact while moving the source of truth toward the PBUI profile.

### Prompt Context

**User prompt (verbatim):** "go ahead, keep a detailed diary."

**Assistant interpretation:** Implement the profile-derived compatibility-rule direction and document the work in the ticket diary.

**Inferred user intent:** Continue converting ad hoc Deli behavior into reusable PBUI design-system/runtime machinery, while preserving reviewable implementation history.

### What I did

- Added compatibility metadata to `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml` for selected-presentation commands:
  - `CUSTOMIZE` accepts `MenuItem` refs with `composable` capability.
  - `REMOVE-INGREDIENT` accepts `Ingredient` refs with `removable` capability and `metadata.removed != "yes"`.
  - `APPLY` accepts `Ingredient` refs with `substitution-candidate` capability.
  - `DESCRIBE` accepts any selected presentation for `subject_ref`.
- Added generic evaluator module:
  - `proof-of-concept/deli-pbui-react/src/generic/clim/compatibilityRules.ts`
- Added Deli rule registry:
  - `proof-of-concept/deli-pbui-react/src/domain/deli/compatibilityRules.ts`
- Updated `DeliPbuiWorkbench` so `canUsePresentation(...)` delegates to `canUsePresentationFromRules(...)` instead of using command-id `if` branches.
- Added compatibility-rule coverage checking for every command binding that uses `selected_presentation`.
- Added selected-ref rehydration in the widget so a selected ingredient ref reflects current removed-state metadata after domain state changes.

### Why

- Compatibility constraints are PBUI profile semantics, not widget implementation details.
- The same rule should drive direct presentation clicks, select mode, action-bar target checking, and visual clickability.
- Removed refs must stop being compatible after domain state changes, even if the session previously selected the old ref object.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./examples/street-deli-ordering --include-info --output table
```

Playwright verified compatibility behavior:

```text
/detail/sandwich.hudson-classic
sourdough cursor is default
removable tomato cursor is pointer
REMOVE-INGREDIENT -> SELECT
sourdough remains non-pointer in SELECT mode
tomato click removes tomato
clicking REMOVE-INGREDIENT again enters SELECT instead of reusing stale removed tomato
```

Playwright also verified the full app flow still works:

```text
menu -> detail -> remove tomato -> add to cart -> confirm order -> tracker
empty cart PLACE-ORDER remains disabled and command input reports Cart is empty.
```

Storybook check passed:

```text
DetailMode SELECT mode uses compatibility rules: sourdough not clickable, tomato clickable
CartMode still renders the seeded cart story
```

### What didn't work

- The first Playwright check used `getByText(/sourdough/)`, which matched both the semantic label and the id text. I changed the check to target the row button by accessible name.
- A second check exposed a stale selected-ref issue: after removing tomato, the session still held the old `PresentationRef` with `metadata.removed = "no"`, so invoking `REMOVE-INGREDIENT` again reused a stale compatible subject. I fixed this by rehydrating the selected ref from current menu/domain state before compatibility checks.

### What I learned

- Metadata-derived compatibility is only correct if presentation refs are current. A selected ref is a pointer into domain state, not a forever-valid snapshot.
- The same evaluator can serve normal mode and select mode; select mode simply narrows the binding list to the pending command.
- Coverage assertions are useful because any selected-presentation command without rules would silently fall back to permissive behavior.

### What was tricky to build

- `DESCRIBE` intentionally accepts any selected presentation, so its rule has only the selected input name and no type/capability predicates. The evaluator treats missing predicates as permissive while still counting the command as covered.
- `APPLY` is represented even though the POC does not render substitution candidates yet. It uses a future-facing `substitution-candidate` capability so the metadata shape can cover the command without special widget code.
- Rehydrating selected refs is domain-aware in this POC. A future generic engine should probably model selected refs as ids plus resolver functions rather than storing presentation snapshots.

### What warrants a second pair of eyes

- Review the compatibility YAML shape before promoting it into Go profile structs and code generation.
- Review whether the evaluator should default to permissive behavior when no rule exists, or fail closed outside development.
- Review whether selected refs should become stable references resolved from Redux/domain selectors instead of copied presentation objects.

### What should be done in the future

- Add typed Go model/validation for `compatibility` sections in action bindings.
- Generate `deliCompatibilityRules` from the PBUI profile instead of hand-authoring the TypeScript registry.
- Add unit tests for metadata constraints such as `notEquals` and required capabilities.

### Code review instructions

- Start with `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml` to see the profile metadata shape.
- Review `proof-of-concept/deli-pbui-react/src/generic/clim/compatibilityRules.ts` for generic evaluator semantics.
- Review `proof-of-concept/deli-pbui-react/src/domain/deli/compatibilityRules.ts` for the hand-authored Deli registry that mirrors profile metadata.
- Review `DeliPbuiWorkbench` changes around `canUsePresentation` and `rehydratePresentationRef`.

### Technical details

Compatibility-rule flow:

```text
CommandBinding.inputMapping contains selected_presentation
  -> rule registry provides accepted type/capability/metadata predicates
  -> generic evaluator checks current PresentationRef
  -> compatibleBindingsForPresentation/select mode/action invocation share result
```

## Step 22: Add a working CLIM-style REPL command line

This step addressed the prototype gap that was still visible after the Redux and compatibility work: the footer looked like a REPL, but it behaved more like a thin command submit box. The original Readwise CLIM prototype had a command parser, normalized command lookup, command history, select-mode cancellation, and confirmation through typed commands. I added those mechanics to the Street Deli PBUI POC.

The command line is now a usable CLIM-style REPL surface. It accepts normalized action names such as `customize`, `remove ingredient`, `add to order`, and `place order`; it supports typed `YES` confirmation; it supports `CANCEL`/`ESC`; and it has ArrowUp/ArrowDown command history backed by the PBUI session Redux slice.

### Prompt Context

**User prompt (verbatim):** "we need a working REPL, lke in the original readwise CLIM example, for example. 

Add tasks and implement that, there is still work on the prototype. I also need to validate."

**Assistant interpretation:** Add explicit ticket tasks, then implement a real CLIM-style command-line loop comparable to the Readwise prototype rather than leaving a minimal command field.

**Inferred user intent:** Make the proof-of-concept reviewable as an interaction prototype, with typed command workflows for normal, select, confirm, history, and cancellation behavior.

### What I did

- Added and completed tasks for:
  - generic command parser and command history;
  - Deli REPL wiring for normalized commands, arguments, confirmation, cancellation, and history navigation;
  - app and Storybook validation.
- Added `proof-of-concept/deli-pbui-react/src/generic/clim/commandParser.ts` with:
  - `normalizeCommandKey`
  - `parseCommandLine`
  - parse results for `empty`, `action`, `confirm`, `cancel`, and `unknown`.
- Extended `pbuiSessionSlice` with:
  - `commandHistory`
  - `historyCursor`
  - `pushCommandHistory`
  - `recallPreviousCommand`
  - `recallNextCommand`
  - `clearCommandBuffer`
- Updated `PbuiCommandLine` and `PbuiShell` to support:
  - ArrowUp command history recall;
  - ArrowDown forward recall / clear;
  - Escape cancellation.
- Updated `DeliPbuiWorkbench` so typed REPL commands:
  - normalize space-separated names to command ids (`remove ingredient` -> `REMOVE-INGREDIENT`);
  - execute currently available command bindings;
  - enter select mode when a target is needed;
  - confirm pending actions with `YES`, `Y`, `CONFIRM`, or `OK`;
  - cancel select/confirm with `CANCEL`, `NO`, `ESC`, or Escape key;
  - report unknown commands and view-unavailable commands clearly.
- Fixed confirm/select command input so it remains editable. The previous shell forced the input value to the pending command id during `confirm`/`select`, which prevented typing `yes` in the confirm prompt.

### Why

- A CLIM/PBUI prototype needs a real command loop, not only clickable action presentations.
- Typed commands are part of validating the interaction model: action lookup, argument prompting, target selection, confirmation, and cancellation.
- Command history is a core REPL affordance and mirrors the Readwise CLIM reference behavior.

### What worked

Validation passed:

```bash
cd proof-of-concept/deli-pbui-react && npm run build
cd proof-of-concept/deli-pbui-react && npm run build-storybook
```

Playwright verified app REPL flow:

```text
customize -> detail for Hudson Classic
remove ingredient -> SELECT mode
click tomato -> remove_part request
add to order -> cart
place order -> confirm prompt
yes -> tracker and confirmed submit_order request
back -> cart
ArrowUp recalls back
wat -> Unknown command: wat. Type HELP.
```

Playwright verified Storybook REPL flow:

```text
DetailMode story
remove ingredient -> SELECT mode
Escape -> Cancelled target selection.
remove ingredient again
ArrowUp recalls remove ingredient
```

### What didn't work

- The first app Playwright check assumed `customize` would enter select mode. It did not: because the menu item fallback selection is compatible, `customize` correctly entered detail immediately. I adjusted the check to validate the actual CLIM behavior.
- The first typed confirmation attempt timed out because the shell forced the command input value to `PLACE-ORDER` while in confirm mode. The fix was to keep the input bound to `session.commandBuffer` in all modes so the user can type `yes` or `cancel`.

### What I learned

- Select/confirm mode state is not enough; the command line must remain editable during those modes.
- Normalizing the whole command first allows both `PLACE-ORDER` and `place order`; falling back to normalized first token plus args allows commands like `FILTER-DIETARY vegan`.
- REPL history belongs in `pbuiSession`, not local component state, because it is part of the interaction session.

### What was tricky to build

- Arrow history navigation had to be implemented at the command-line component boundary while the history itself lives in Redux. `PbuiCommandLine` now emits history intents, and `pbuiSessionSlice` owns the cursor and buffer updates.
- `Escape` needs mode-sensitive behavior: in select mode it cancels target selection; in confirm mode it cancels confirmation; in normal mode it reports that there is nothing to cancel.
- Confirmation through typed input uses the already-built pending request. It should not rebuild from the current command buffer after the user types `yes`.

### What warrants a second pair of eyes

- Review whether confirm words (`YES`, `Y`, `CONFIRM`, `OK`) and cancel words (`NO`, `N`, `CANCEL`, `ESC`, `ESCAPE`, `ABORT`) are the right grammar for PBUI generally.
- Review whether command history should include failed/unknown commands. It currently does, like many REPLs.
- Review whether view-unavailable global commands should offer route suggestions or auto-route in future.

### What should be done in the future

- Add committed tests for `parseCommandLine` and `pbuiSessionSlice` history reducers.
- Add Storybook play tests for typed `remove ingredient`, Escape cancel, and typed `yes` confirmation.
- Add richer command completion/help output after the basic REPL stabilizes.

### Code review instructions

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/commandParser.ts`.
- Review history reducers in `proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts`.
- Review keyboard wiring in `PbuiCommandLine` and `PbuiShell`.
- Review `handleCommandSubmit` in `DeliPbuiWorkbench` for mode-sensitive REPL behavior.

### Technical details

The REPL flow is now:

```text
input string
  -> parseCommandLine(command ids)
  -> push command history
  -> empty / cancel / confirm / unknown / action branch
  -> action branch finds current-view binding
  -> availability + compatibility checks
  -> invoke command, enter select, or enter confirm
```

## Step 23: Write minimal PBUI core simplification guide

This step paused implementation and turned the current design discussion into a concrete refactor guide. The proof-of-concept has accumulated enough behavior to reveal which parts are essential and which parts are discovery scaffolding. The new guide explains how to cut the system down to a minimal action/presentation dispatch core centered on typed action arguments, semantic refs, an action invocation slice, and `accepts` lambdas.

The resulting document is meant for a new intern or implementer. It explains the current file layout, why `DeliPbuiWorkbench` is a god component, what current modules are superfluous, what the new core API should look like, how events flow through the engine, and how to implement a hard cutover without preserving legacy compatibility layers.

### Prompt Context

**User prompt (verbatim):** "4. action invocation state sohuld be its own slice yes,.

---

Ok now that we have this core engine, we want to remove any superfluous code, remove all legacy, no backwards compability, this is really about deriving a solid minimal core as a proof of concept. 

Go through the setup and find things to simplify.

Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable."

**Assistant interpretation:** Produce a long-form, intern-ready design/implementation guide for simplifying the PBUI POC into a minimal core, store it in docmgr, and upload it to reMarkable.

**Inferred user intent:** Establish a clear refactor spec before more code changes, so implementation does not preserve accidental complexity from the exploratory POC.

### What I did

- Created a new docmgr design document:
  - `ttmp/2026/05/25/DMETA-DELI-PBUI-POC--street-deli-pbui-react-proof-of-concept/design-doc/03-minimal-pbui-clim-core-simplification-analysis-and-implementation-guide.md`
- Wrote an intern-facing guide covering:
  - current system inventory;
  - superfluous/misplaced modules;
  - proposed minimal action engine;
  - typed `SemanticRef`, `ActionArgSpec`, `ActionSpec`, and `ActionInvocationState` shapes;
  - matching pseudocode;
  - event-flow diagrams;
  - proposed module layout;
  - Deli adapter shape;
  - deletion/replacement table;
  - implementation phases;
  - acceptance criteria;
  - API reference sketch;
  - file reference map.
- Related the most important current POC files to the new guide with docmgr file notes.

### Why

- The current POC proved the behavior but is not the architecture we want to generate.
- A written guide makes the hard cutover explicit: no backwards compatibility, no preservation of stringly `inputMapping`, and no metadata compatibility engine if typed action args plus `accepts` lambdas are enough.
- Interns need prose and pseudocode, not only scattered source files.

### What worked

- `docmgr doc add` created the new design document successfully.
- `docmgr doc relate` linked the current god widget, generic types, compatibility modules, PBUI session slice, and Deli workbench slice to the guide.
- `docmgr validate frontmatter` and `docmgr doctor` passed.
- reMarkable upload succeeded:
  - `OK: uploaded DMETA PBUI Minimal Core Guide.pdf -> /ai/2026/05/25/DMETA-DELI-PBUI-POC`

### What didn't work

- N/A for this writing step so far.

### What I learned

- The next implementation should start in a fresh `generic/clim/core/` path so old compatibility code does not shape the new API by accident.
- The key invariant is simple: a presentation is selectable only when the selected action has an open ref argument slot that accepts it.
- `ActionInvocationState` deserves its own slice and should replace the current session state once the hard cutover starts.

### What was tricky to build

- The guide needed to preserve lessons from the POC without blessing current accidental structures. I handled this by separating “current system inventory” from “what to delete or replace.”
- The design had to keep `presentationType`, `metadata`, and `capabilities` on semantic refs, while still making clear that the core matcher should use object type plus `accepts`, not metadata/capability predicates.

### What warrants a second pair of eyes

- Review whether `ActionSpec.run` should perform domain effects directly or return effect descriptions.
- Review whether command aliases belong on `ActionSpec` or in a separate REPL command registry.
- Review the proposed hard deletion list before implementation begins.

### What should be done in the future

- Implement the hard cutover described in the guide.
- Add reducer/engine tests for the new core.
- Update compiler passes only after the POC runtime proves the simplified model.

### Code review instructions

- Start with the new guide document.
- Then inspect `widget.tsx`, `types.ts`, `compatibility.ts`, and `compatibilityRules.ts` alongside the deletion/replacement table.
- Validate the guide by checking whether every proposed API can express current Deli flows: customize, remove ingredient, filter dietary, add to order, place order.

### Technical details

The proposed minimal invariant is:

```text
selected action + open arg slot + candidate semantic ref
  -> objectType equality
  -> optional accepts(ref, ctx)
  -> fill arg / reject candidate
```
