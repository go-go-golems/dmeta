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
- Review `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx` for `ConfirmPrompt`.
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

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx` for cursor/input affordances.
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

- Start with `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx` for generic clickable styling.
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
  - `proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx`
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
