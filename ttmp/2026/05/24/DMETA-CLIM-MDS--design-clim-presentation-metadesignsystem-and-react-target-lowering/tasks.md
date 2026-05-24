# Tasks

## Phase 0: Ticket planning, source evidence, and implementation boundaries

Goal: turn the research ticket into an executable implementation plan before adding PBUI/CLIM code. Preserve the core boundary: Semantic IR owns object facts, Interaction IR owns action/representation obligations, PBUI owns presentation-system concepts, and React remains a target.

- [x] Create ticket workspace `DMETA-CLIM-MDS`.
- [x] Import the original PBUI thesis into ticket sources.
- [x] Normalize imported source naming/frontmatter so `docmgr doctor` passes.
- [x] Create and maintain the ticket diary.
- [x] Analyze thesis concepts relevant to DMETA:
  - application database;
  - presentation database;
  - presenters;
  - recognizers;
  - command/action objects;
  - type descriptions as objects;
  - interfaces to presenter/recognizer state.
- [x] Analyze the Readwise Viewer CLIM prototype as a first-pass implementation reference.
- [x] Write the intern-facing CLIM/PBUI architecture and implementation guide.
- [x] Upload the guide bundle to reMarkable.
- [x] Create this phased task plan.
- [ ] Keep each implementation phase documented in the diary with prompt context, failures, validation, and review notes.

Validation gate:

- [x] `docmgr doctor --ticket DMETA-CLIM-MDS --stale-after 30`

## Phase 1: Author the minimal PBUI MetaDesignSystem source package and validator

Goal: add the smallest useful authored PBUI/CLIM MetaDesignSystem package. Do not author a large thesis-complete object/action/presenter/recognizer schema yet. The authored layer should define presentation types and PBUI lowering rules with rich natural-language intent fields.

- [x] Create `sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml`.
- [x] Create `sources/dmeta-ir/meta-design-systems/pbui/presentation-types.yaml`.
- [x] Create `sources/dmeta-ir/meta-design-systems/pbui/lowering-rules.yaml`.
- [x] Create `sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml`.
- [x] Include substantial `summary`, `long_summary`, `intent`, `description`, `notes`, and rationale-style fields in the PBUI YAML catalogs.
- [x] Seed presentation types for the first pass:
  - object reference / presentation reference;
  - action presentation;
  - inspector presentation;
  - action chooser / command palette style presentation;
  - lifecycle/status presentation;
  - composition-style presentation if useful for Street Deli validation.
- [x] Add `pkg/dmeta/metadesign/pbui/model.go`.
- [x] Add `pkg/dmeta/metadesign/pbui/load.go`.
- [x] Add `pkg/dmeta/metadesign/pbui/validate.go`.
- [x] Register `dmeta validate-pbui` in `cmd/dmeta/main.go`.
- [x] Validate:
  - package artifact type;
  - known presentation type ids;
  - duplicate presentation type ids;
  - duplicate lowering rule ids;
  - known Interaction IR representation references;
  - known Interaction IR action references;
  - no abstract actions/representations in concrete presentation realization lists;
  - lowering rules emit known presentation type ids.

Validation gate:

- [x] `go test ./pkg/dmeta/metadesign/pbui/... ./pkg/dmeta/interaction/... -count=1`
- [x] `go run ./cmd/dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table`

## Phase 2: Lower Interaction IR obligations into PBUI presentation obligations

Goal: prove that PBUI presentation obligations can be derived from semantic facts plus Interaction IR obligations, just as Web obligations are currently derived for the Web MetaDesignSystem.

- [x] Add `pkg/dmeta/metadesign/pbui/lower.go`.
- [x] Define PBUI presentation obligation output fields:
  - example id;
  - domain type id;
  - presentation type id;
  - source lowering rule id;
  - source representations;
  - source actions;
  - presenter intent;
  - recognizer intent;
  - rationale/description.
- [x] Implement rule matching by domain type, representation id, and action id.
- [x] Keep lowering deterministic and stable-sorted.
- [x] Add `pkg/dmeta/cmds/lower_pbui.go`.
- [x] Register `dmeta lower-pbui` in `cmd/dmeta/main.go`.
- [x] Ensure table output includes natural-language explanation columns, not only ids.
- [x] Run against `examples/street-deli-ordering` and global PBUI root.

Validation gate:

- [x] `go run ./cmd/dmeta lower-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --output table`

## Phase 3: Derive object and action descriptors for PBUI React targets

Goal: make object types and actions first-class target objects without duplicating upstream IR. Object descriptors should derive from Semantic IR; action descriptors should derive from Interaction IR.

- [x] Add a PBUI descriptor derivation model or target planning model.
- [x] Derive object/type descriptors from resolved Semantic IR domain types, archetypes, and capabilities.
- [x] Derive action descriptors from Interaction IR actions and their inheritance/effects/safety/input metadata.
- [x] Preserve natural-language fields in descriptors:
  - intent;
  - description;
  - long description;
  - notes;
  - source provenance.
- [x] Add tests proving derived descriptors contain enough metadata to power introspection UI.
- [x] Decide whether descriptor derivation belongs under `pkg/dmeta/metadesign/pbui` or `pkg/dmeta/generator/react`.

Validation gate:

- [x] Unit tests for descriptor derivation pass.

## Phase 4: Plan PBUI React target artifacts

Goal: compile PBUI presentation obligations into a React target plan. Do not render a full app yet; first create an inspectable plan with file kinds and provenance.

- [x] Extend or add React planning code for PBUI obligations.
- [x] Plan generated registries:
  - object type registry;
  - action descriptor registry;
  - presentation type registry.
- [x] Plan session state artifacts:
  - PBUI session slice;
  - interaction state model;
  - command buffer/history model.
- [x] Plan presenter artifacts:
  - selectors;
  - projection functions;
  - `useSelector`-style hooks.
- [x] Plan recognizer artifacts:
  - event adapters;
  - action request builders;
  - command parser stubs.
- [x] Plan presentation widgets:
  - object presentation component;
  - action presentation component;
  - inspector component;
  - action chooser component.
- [x] Plan metadata sidecars with PBUI provenance.
- [x] Add CLI surface for PBUI React planning or extend `plan-scaffold` with a clear target name.

Validation gate:

- [x] Planning command emits stable YAML/table output for PBUI React target files.

## Phase 5: Render a minimal PBUI React target scaffold

Goal: render a small but coherent target scaffold that demonstrates the thesis-aligned model in React terms.

- [ ] Render TypeScript registry files.
- [ ] Render PBUI session slice skeleton.
- [ ] Render selector/hook skeletons for presenter projections.
- [ ] Render event adapter skeletons for recognizer behavior.
- [ ] Render presentational React components.
- [ ] Render metadata sidecars with source passes and intent text.
- [ ] Render Storybook stories or docs blocks that explain the presentation/action/type provenance.
- [ ] Add dry-run and metadata-only behavior where applicable.

Validation gate:

- [ ] Scaffold command dry-run succeeds.
- [ ] Rendered files compile or pass TypeScript syntax checks if a package is emitted.

## Phase 6: Add a focused example and golden tests

Goal: make the PBUI path reviewable by producing a small deterministic example, preferably against Street Deli first because it already has Semantic and Interaction obligations.

- [ ] Add golden output for PBUI validation.
- [ ] Add golden output for `lower-pbui` against Street Deli.
- [ ] Add a small rendered metadata sidecar golden test.
- [ ] Verify the example demonstrates object presentations and action presentations.
- [ ] Verify the example demonstrates presenter/recognizer intent without adding heavyweight runtime presenter objects.

Validation gate:

- [ ] `go test ./pkg/dmeta/... ./cmd/dmeta -count=1`
- [ ] `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table`
- [ ] `go run ./cmd/dmeta validate-interactions --root ./sources/dmeta-ir --include-info --output table`
- [ ] `go run ./cmd/dmeta validate-pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table`
- [ ] `go run ./cmd/dmeta lower-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --output table`


## Phase 7: Port and dogfood Street Deli through the PBUI/CLIM path

Goal: use Street Deli as the concrete end-to-end proving ground for the new PBUI/CLIM MetaDesignSystem. The existing promoted Street Deli React app remains maintained code, but we should also generate/rescaffold a PBUI/CLIM-flavored target from DMETA and rebuild it to verify that the new design system is not just schema-valid but usable.

- [ ] Decide the Street Deli PBUI output location, keeping it separate from the existing promoted Web/React app and existing Web React scaffold output.
  - Candidate: `examples/street-deli-ordering/generated/pbui-react/`.
  - Candidate: `examples/street-deli-ordering/www/mobile-clim-react/` if it becomes a runnable promoted experiment.
- [ ] Add or extend the Street Deli instance manifest so it can opt into the PBUI/CLIM React target without reintroducing generic widget generation.
- [ ] Add Street Deli PBUI lowering coverage for the important domain flows:
  - menu item compact/object presentation;
  - menu item action choices;
  - composition/card presentation;
  - ingredient/part presentation;
  - substitution candidate/action presentation;
  - cart/order summary presentation;
  - order lifecycle/status presentation;
  - inspector/details presentation.
- [ ] Ensure generated PBUI metadata sidecars explain, in natural language, which Semantic IR facts and Interaction IR obligations caused each presentation/component to exist.
- [ ] Regenerate/rescaffold the Street Deli PBUI React target from the new PBUI MetaDesignSystem.
- [ ] Compare generated PBUI React artifacts against the existing promoted Street Deli mobile React widgets to identify missing presenter/recognizer concepts.
- [ ] If a runnable Street Deli CLIM/PBUI app is created, wire it into a separate package so it can be built without disturbing `www/mobile-react/`.
- [ ] Rebuild the generated or promoted Street Deli PBUI React target.
- [ ] Add Storybook or documentation examples for generated PBUI presentation widgets where practical.
- [ ] Record any gaps as follow-up schema tasks rather than patching around them in the target.

Validation gate:

- [ ] `go run ./cmd/dmeta lower-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --output table`
- [ ] PBUI React scaffold command dry-run emits Street Deli files.
- [ ] PBUI React scaffold command writes files to the chosen Street Deli output path.
- [ ] If generated under a buildable package: run the relevant `npm run build` command.
- [ ] Existing promoted app still builds: `cd examples/street-deli-ordering/www/mobile-react && npm run build`.

## Phase 8: Documentation, reMarkable refresh, and handoff

Goal: keep the human-facing explanation synchronized with the implementation.

- [ ] Update the intern guide with any schema changes discovered during implementation.
- [ ] Add a concise PBUI schema reference document if the implementation grows beyond the guide.
- [ ] Update the diary after each major phase.
- [ ] Run `docmgr doctor --ticket DMETA-CLIM-MDS --stale-after 30`.
- [ ] Upload the updated guide/diary bundle to reMarkable after the first working PBUI lowering pass.
- [ ] Commit documentation separately from code when the diff is large enough to deserve a separate review.

Validation gate:

- [ ] `docmgr doctor --ticket DMETA-CLIM-MDS --stale-after 30`
