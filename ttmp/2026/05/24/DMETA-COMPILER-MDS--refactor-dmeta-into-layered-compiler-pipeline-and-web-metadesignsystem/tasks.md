# Tasks

## Phase 0: Ticket setup and baseline evidence

- [x] Create ticket workspace `DMETA-COMPILER-MDS`.
- [x] Create primary design doc for the layered compiler pipeline and Web MetaDesignSystem refactor.
- [x] Create investigation/implementation diary.
- [x] Map current CLI entry points in `cmd/dmeta/main.go`.
- [x] Map current semantic model structs in `pkg/dmeta/validator/model.go`.
- [x] Map current inheritance resolver in `pkg/dmeta/validator/inheritance.go`.
- [x] Map current validation rules in `pkg/dmeta/validator/validate.go`.
- [x] Map current instance planner in `pkg/dmeta/cmds/plan_instance.go` and `pkg/dmeta/generator/widgets/load.go`.
- [x] Map current scaffold generator in `pkg/dmeta/generator/widgets/render.go`.
- [x] Map current Street Deli instance manifest and local templates.
- [x] Run baseline `validate-ir` for `examples/street-deli-ordering`.
- [x] Run baseline `plan-instance` for `street-deli-ordering.yaml`.
- [x] Relate key source files to the design doc.
- [x] Validate ticket with `docmgr doctor`.
- [x] Upload design bundle to reMarkable.

## Phase 1: Hard-cut target layout and vocabulary reset

Goal: stop treating widgets as universal DMETA concepts. Move web/visual widget templates under a Web MetaDesignSystem package and delete the old top-level widget-template layout.

- [ ] Create `sources/dmeta-ir/meta-design-systems/web/` as the canonical Web MetaDesignSystem root.
- [ ] Create `sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml`.
- [ ] Create `sources/dmeta-ir/meta-design-systems/web/widgets/`.
- [ ] Move all files from `sources/dmeta-ir/widget-templates/` into `sources/dmeta-ir/meta-design-systems/web/widgets/`.
- [ ] Delete the old `sources/dmeta-ir/widget-templates/` directory after the move.
- [ ] Replace `sources/dmeta-ir/03-widgets.yaml` with a Web MetaDesignSystem entrypoint or remove it if the root index no longer needs a widget package.
- [ ] Update `sources/dmeta-ir/00-index.yaml` or equivalent package index to point at `meta-design-systems/web/meta-design-system.yaml` instead of top-level widgets.
- [ ] Rename top-level docs/labels from “widget template package” to “Web MetaDesignSystem widget templates”.
- [ ] Decide canonical id prefix: use `web.*` for generic web widgets and `deli.web.*` for Street Deli web widgets.
- [ ] Update global template ids if needed to use the new prefix.
- [ ] Remove any plan for compatibility aliases or wrapper loaders.
- [ ] Update design docs to state the hard-cut rule: old paths are invalid after this phase.

Validation gate:

- [ ] `rg "sources/dmeta-ir/widget-templates|widget-template package|compatibility alias|legacy widget" sources examples pkg ttmp/2026/05/24/DMETA-COMPILER-MDS*` returns no unintended references.

## Phase 2: Define the top-level compiler source packages

Goal: define the new high-level IR layout before writing loaders. This is a top-down schema pass.

- [ ] Create `sources/dmeta-ir/semantic/` or decide to keep `core-model/` as the semantic source root.
- [ ] Create `sources/dmeta-ir/interactions/00-index.yaml`.
- [ ] Create `sources/dmeta-ir/interactions/actions.yaml`.
- [ ] Create `sources/dmeta-ir/interactions/representations.yaml`.
- [ ] Create `sources/dmeta-ir/interactions/elaboration-rules.yaml`.
- [ ] Remove `presentations` as a universal semantic-layer requirement from future-facing docs.
- [ ] Decide whether current `core-model/presentations.yaml` is deleted, moved under `meta-design-systems/web/`, or split into interaction representations plus web presentations.
- [ ] Seed root abstract definitions `Action` and `Representation`.
- [ ] Seed initial shared representations: `compact_reference`, `state_indicator`, `inspection_entrypoint`, `composition_summary`, `composition_breakdown`, `ingredient_composition_row`, `role_label`, `dietary_summary`, `configuration_summary`, `substitution_candidate`, `substitution_price_delta`, `order_lifecycle_progress`, `cart_summary`.
- [ ] Seed initial shared actions: `inspect_subject`, `copy_reference`, `select_subject`, `select_menu_item`, `filter_by_state`, `filter_by_dietary`, `remove_part`, `undo_remove_part`, `add_part`, `change_config`, `apply_substitution`, `reject_substitution`, `see_alternatives`, `add_to_order`, `remove_cart_item`, `submit_order`, `return_to_menu`.
- [ ] Write a short README for the new compiler-source layout.

Validation gate:

- [ ] New YAML files parse with `yq` or a minimal Go loader test.
- [ ] No new schema mentions widgets outside the Web MetaDesignSystem.

## Phase 3: Replace generic widget models with Web MetaDesignSystem models

Goal: update Go types to match the new architecture instead of extending the old generic widget model.

- [ ] Create `pkg/dmeta/metadesign/model.go` for MetaDesignSystem definitions.
- [ ] Create `pkg/dmeta/metadesign/web/model.go` for Web-specific widgets, surfaces, slots, layouts, state bindings, and event bindings.
- [ ] Move or replace `validator.Widget` with `web.WidgetTemplate` or equivalent target-specific type.
- [ ] Remove generic `WidgetTemplatesFile` from the validator package if it is only web-specific.
- [ ] Replace `Consumes.Presentations` with `Realizes.Representations` and `Realizes.Actions` in the Web widget model.
- [ ] Add `Abstract`, `Selectable`, and `Extends` to Web widget templates.
- [ ] Add `TargetContracts` or `ReactContract` fields only under the React target layer, not the universal semantic layer.
- [ ] Remove `WidgetGenerationPolicy` from the universal validator model; move React generation policy under the React target package.
- [ ] Update tests to parse the new Web widget schema from `meta-design-systems/web/widgets/`.
- [ ] Delete or rewrite tests that assume top-level generic widget templates.

Validation gate:

- [ ] `go test ./pkg/dmeta/validator ./pkg/dmeta/metadesign/... -count=1`

## Phase 4: Implement Interaction IR models, validation, and inheritance

Goal: make Actions and Representations first-class validated IRs.

- [ ] Add `pkg/dmeta/interaction/model.go`.
- [ ] Define `InteractionCatalog`.
- [ ] Define `InteractionAction`.
- [ ] Define `Representation`.
- [ ] Define `SemanticSelector` with explicit `all_*` and `any_*` fields.
- [ ] Define `RepresentationExposes` with required/recommended/optional projection lists.
- [ ] Define `ActionEffects`, `ActionSafety`, and action input models.
- [ ] Add `pkg/dmeta/interaction/load.go`.
- [ ] Add `pkg/dmeta/interaction/validate.go`.
- [ ] Add `pkg/dmeta/interaction/inheritance.go`.
- [ ] Validate root definitions exist and are abstract.
- [ ] Validate non-root definitions declare `extends`.
- [ ] Validate unknown parent references.
- [ ] Validate inheritance cycles.
- [ ] Merge inherited fields deterministically.
- [ ] Reject abstract actions/representations when emitted as concrete obligations.
- [ ] Add parser tests for minimal action and representation files.
- [ ] Add inheritance tests for action and representation definitions.
- [ ] Add `dmeta validate-interactions` or integrate interaction validation into the new top-level validator.

Validation gate:

- [ ] `go test ./pkg/dmeta/interaction/... -count=1`
- [ ] `go run ./cmd/dmeta validate-interactions --root ./examples/street-deli-ordering --output table` or equivalent.

## Phase 5: Implement semantic-to-interaction elaboration

Goal: derive modality-neutral interaction obligations from the semantic model before any Web lowering occurs.

- [ ] Define `ElaborationRule` model.
- [ ] Define `ElaboratedInteractionIR` model.
- [ ] Define `DomainInteractionObligation` model.
- [ ] Implement `BuildDomainFacts` from resolved archetype/capability/domain mappings.
- [ ] Implement `SemanticSelector.Matches(facts)`.
- [ ] Implement rule matching for `all_capabilities`, `any_capabilities`, `all_archetypes`, and `any_archetypes`.
- [ ] Implement projection availability checks for emitted representations.
- [ ] Reject rules that emit abstract representations.
- [ ] Reject rules that emit abstract actions.
- [ ] Emit stable YAML and table output.
- [ ] Add `dmeta elaborate-interactions` command.
- [ ] Add Street Deli golden output for initial elaboration.
- [ ] Confirm `MenuItem`, `Ingredient`, `SubstitutionRule`, `Order`, and `OrderItem` produce expected obligations.

Validation gate:

- [ ] `go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --output table`
- [ ] Street Deli elaboration golden test passes.

## Phase 6: Implement Web MetaDesignSystem loading, validation, and lowering

Goal: lower Interaction IR into Web-specific widget/surface IR using the new canonical Web MetaDesignSystem package.

- [ ] Add `pkg/dmeta/metadesign/web/load.go`.
- [ ] Add `pkg/dmeta/metadesign/web/validate.go`.
- [ ] Add `pkg/dmeta/metadesign/web/lower.go`.
- [ ] Define `WebLoweringRule` model.
- [ ] Load `sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml`.
- [ ] Load web widget templates from `sources/dmeta-ir/meta-design-systems/web/widgets/` only.
- [ ] Validate selected Web templates are not abstract and are selectable.
- [ ] Validate Web templates realize known representations/actions.
- [ ] Validate Web widgets use target-specific presentation terms only inside Web IR.
- [ ] Implement lowering rule matching by representation id.
- [ ] Implement lowering rule matching by action id.
- [ ] Implement lowering rule matching by target context such as density or surface preference.
- [ ] Emit selected/lowered Web widget candidates with rationale.
- [ ] Add `dmeta lower-metadesign --target web` command.
- [ ] Add table output showing representation/action -> web template -> concrete component.
- [ ] Add YAML output for generated Web widget IR.

Validation gate:

- [ ] `go run ./cmd/dmeta lower-metadesign --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target web --output table`

## Phase 7: Define the React target under Web and replace generic scaffold generation

Goal: React becomes a concrete codegen target of the Web MetaDesignSystem, not the meaning of DMETA widgets.

- [ ] Create `sources/dmeta-ir/meta-design-systems/web/targets/react.yaml`.
- [ ] Add `pkg/dmeta/generator/react/model.go`.
- [ ] Define `ReactScaffoldPlan`.
- [ ] Define `PlannedFile` with path, kind, symbol, and provenance.
- [ ] Define React file kinds: component, types, metadata, stories, barrel, adapter TODO, README, package index.
- [ ] Add `pkg/dmeta/generator/react/plan.go`.
- [ ] Implement Web widget IR -> React scaffold plan.
- [ ] Add `pkg/dmeta/generator/react/render.go`.
- [ ] Move useful rendering logic out of `pkg/dmeta/generator/widgets/render.go` into React-specific rendering.
- [ ] Delete generic widget scaffold rendering once React rendering is in place.
- [ ] Add `dmeta plan-scaffold --target react` command.
- [ ] Rewrite `scaffold-instance` to call the React target path or replace it with a clearer command name.
- [ ] Add metadata fields: `metaDesignSystem`, `codegenTarget`, `realizes.representations`, `realizes.actions`, pass versions.
- [ ] Add generated component data attributes for MetaDesignSystem and representation ids.
- [ ] Add Storybook docs text that names representations/actions.
- [ ] Add golden tests for React scaffold plan and one rendered metadata sidecar.

Validation gate:

- [ ] `go test ./pkg/dmeta/generator/react/... -count=1`
- [ ] `go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml`

## Phase 8: Move and rewrite Street Deli Web templates and instance metadata

Goal: hard-cut the concrete deli representation to the new Web MetaDesignSystem layout.

- [ ] Create `examples/street-deli-ordering/meta-design-systems/web/widgets/`.
- [ ] Move all files from `examples/street-deli-ordering/widget-templates/` into `examples/street-deli-ordering/meta-design-systems/web/widgets/`.
- [ ] Delete the old `examples/street-deli-ordering/widget-templates/` directory.
- [ ] Rename selected template ids to `deli.web.*` or another final chosen prefix.
- [ ] Add `abstract: false` and `selectable: true` to all eight selected Street Deli Web templates.
- [ ] Add `meta_design_system: web` to all selected Street Deli Web templates.
- [ ] Add `realizes.representations/actions` to `deli.web.menu_browser`.
- [ ] Add `realizes.representations/actions` to `deli.web.composition_card`.
- [ ] Add `realizes.representations/actions` to `deli.web.composition_customizer`.
- [ ] Add `realizes.representations/actions` to `deli.web.ingredient_row`.
- [ ] Add `realizes.representations/actions` to `deli.web.substitution_chip`.
- [ ] Add `realizes.representations/actions` to `deli.web.order_cart`.
- [ ] Add `realizes.representations/actions` to `deli.web.order_tracker`.
- [ ] Add `realizes.representations/actions` to `deli.web.role_tag`.
- [ ] Replace `generation` in `examples/street-deli-ordering/instantiations/street-deli-ordering.yaml` with explicit `targets`.
- [ ] Replace `template_sources.local_template_files` with Web MetaDesignSystem local source references.
- [ ] Regenerate scaffold output under the new React target output path.
- [ ] Verify promoted React implementation remains separate from generated output.

Validation gate:

- [ ] `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table`
- [ ] `go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --output table`
- [ ] `go run ./cmd/dmeta lower-metadesign --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target web --output table`
- [ ] `go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output table`

## Phase 9: Align promoted React app metadata and stories

Goal: update maintained React code to expose the new provenance terms without preserving old presentation compatibility.

- [ ] Update `src/design-tokens/dataAttributes.ts` with `metaDesignSystem`, `codegenTarget`, and `representation` fields.
- [ ] Remove or rename generic `presentation` data attribute if it no longer has a Web-specific meaning.
- [ ] Add representation/action data attributes to `StreetDeliCompositionCard` where useful.
- [ ] Add representation/action data attributes to `StreetDeliCompositionCustomizer` where useful.
- [ ] Add representation/action data attributes to `StreetDeliIngredientRow` where useful.
- [ ] Add representation/action data attributes to `StreetDeliSubstitutionChip` where useful.
- [ ] Add representation/action data attributes to `StreetDeliMenuBrowser` where useful.
- [ ] Add representation/action data attributes to `StreetDeliOrderCart` where useful.
- [ ] Add representation/action data attributes to `StreetDeliOrderTracker` where useful.
- [ ] Add representation metadata to Storybook docs descriptions for all eight widgets.
- [ ] Add a Storybook docs page or story section explaining semantic -> representation -> Web widget -> React component provenance.
- [ ] Document React reducer actions as target action bindings, not upstream Interaction IR definitions.

Validation gate:

- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build`
- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build-storybook`

## Phase 10: Delete obsolete paths and docs, then prepare CLIM handoff

Goal: finish the hard cutover by removing old names and documenting the clean target architecture.

- [ ] Delete obsolete generic widget generator package files or move their useful code into Web/React packages.
- [ ] Delete obsolete top-level widget template docs.
- [ ] Remove references to `sources/dmeta-ir/widget-templates/` from docs, tests, and examples.
- [ ] Remove references to `examples/street-deli-ordering/widget-templates/` from docs, tests, and examples.
- [ ] Update the design guide to match final implementation if naming changed.
- [ ] Add an implementation diary entry for each completed phase.
- [ ] Update ticket changelog after each phase with commit hashes.
- [ ] Relate any new source files to the design doc and diary.
- [ ] Add a concise README for `sources/dmeta-ir/interactions/`.
- [ ] Add a concise README for `sources/dmeta-ir/meta-design-systems/web/`.
- [ ] Add a short follow-up design note for the CLIM ticket boundary.
- [ ] Create or propose a follow-up ticket for the CLIM MetaDesignSystem.
- [ ] Upload final updated bundle to reMarkable.

Final validation gate:

- [ ] `go test ./... -count=1`
- [ ] `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table`
- [ ] `go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --output table`
- [ ] `go run ./cmd/dmeta lower-metadesign --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target web --output table`
- [ ] `go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output table`
- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build`
- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build-storybook`
- [ ] `docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30`
