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

## Phase 1: Add compatibility fields to widget templates

Goal: make the current widget-template layer able to express abstract/concrete status and interaction realization without changing generator output yet.

- [ ] Add `Abstract bool \`yaml:"abstract"\`` to `validator.Widget`.
- [ ] Add `Selectable *bool \`yaml:"selectable"\`` to `validator.Widget`.
- [ ] Add `Extends []string \`yaml:"extends"\`` to `validator.Widget`.
- [ ] Add `MetaDesignSystem string \`yaml:"meta_design_system"\`` to `validator.Widget`.
- [ ] Add `CodegenTargets []string \`yaml:"codegen_targets"\`` to `validator.Widget`.
- [ ] Add `Realizes Realizes \`yaml:"realizes"\`` to `validator.Widget`.
- [ ] Add `Realizes` struct with `Representations []string` and `Actions []string`.
- [ ] Add `Widget.IsSelectable()` helper that defaults to `!Abstract` when `selectable` is omitted.
- [ ] Update widget model tests or add new tests for parsing the new fields.
- [ ] Update `ValidateInstanceAgainstCatalog` to reject selected templates with `abstract: true`.
- [ ] Update `ValidateInstanceAgainstCatalog` to reject selected templates with `selectable: false`.
- [ ] Add planner warnings for selected templates without `realizes` when strict MetaDesignSystem validation is enabled.
- [ ] Keep legacy templates valid when the new fields are omitted.
- [ ] Add one minimal test fixture for an abstract template selected by mistake.
- [ ] Add one minimal test fixture for a non-selectable template selected by mistake.
- [ ] Verify existing Street Deli `plan-instance` output remains compatible.

Validation gate:

- [ ] `go test ./pkg/dmeta/... -count=1`
- [ ] `go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table`

## Phase 2: Introduce Interaction IR catalogs

Goal: create first-class modality-neutral Actions and Representations while leaving current `presentations` fields in place for compatibility.

- [ ] Create `sources/dmeta-ir/interactions/00-index.yaml`.
- [ ] Create `sources/dmeta-ir/interactions/actions.yaml`.
- [ ] Create `sources/dmeta-ir/interactions/representations.yaml`.
- [ ] Create `sources/dmeta-ir/interactions/elaboration-rules.yaml`.
- [ ] Add `pkg/dmeta/interaction/model.go`.
- [ ] Define `InteractionCatalog` model.
- [ ] Define `InteractionAction` model.
- [ ] Define `Representation` model.
- [ ] Define `SemanticSelector` with explicit `all_*` and `any_*` fields.
- [ ] Define `RepresentationExposes` with required/recommended/optional projection lists.
- [ ] Define `ActionEffects`, `ActionSafety`, and action input models.
- [ ] Add `pkg/dmeta/interaction/load.go` for loading global and local interaction catalogs.
- [ ] Add parser tests for minimal action and representation files.
- [ ] Seed root abstract definitions `Action` and `Representation`.
- [ ] Seed initial shared representations: `compact_reference`, `state_indicator`, `inspection_entrypoint`, `composition_summary`, `composition_breakdown`, `ingredient_composition_row`, `role_label`, `dietary_summary`, `configuration_summary`, `substitution_candidate`, `substitution_price_delta`, `order_lifecycle_progress`, `cart_summary`.
- [ ] Seed initial shared actions: `inspect_subject`, `copy_reference`, `select_subject`, `select_menu_item`, `filter_by_state`, `filter_by_dietary`, `remove_part`, `undo_remove_part`, `add_part`, `change_config`, `apply_substitution`, `reject_substitution`, `see_alternatives`, `add_to_order`, `remove_cart_item`, `submit_order`, `return_to_menu`.
- [ ] Document which current `core-model/presentations.yaml` entries map to the new representations.

Validation gate:

- [ ] Interaction catalogs parse without errors.
- [ ] New tests pass with `go test ./pkg/dmeta/interaction/... -count=1`.

## Phase 3: Validate and resolve Interaction IR inheritance

Goal: give Actions and Representations the same abstract/concrete and inheritance quality as archetypes/capabilities.

- [ ] Add `pkg/dmeta/interaction/inheritance.go`.
- [ ] Resolve `Representation` inheritance.
- [ ] Resolve `Action` inheritance.
- [ ] Validate root definitions exist and are abstract.
- [ ] Validate non-root definitions declare `extends`.
- [ ] Validate unknown parent references.
- [ ] Validate inheritance cycles.
- [ ] Merge inherited `supports_actions` for representations.
- [ ] Merge inherited `subjects` or define an explicit no-merge rule and document it.
- [ ] Merge inherited `exposes` fields with deterministic stable ordering.
- [ ] Merge inherited action inputs/effects/safety or define explicit override semantics.
- [ ] Add tests for inherited representation fields.
- [ ] Add tests for inherited action fields.
- [ ] Add tests for abstract representation emission errors.
- [ ] Add tests for abstract action emission errors.
- [ ] Add `validate-interactions` command or add an interaction-validation mode to `validate-ir`.

Validation gate:

- [ ] `go test ./pkg/dmeta/interaction/... -count=1`
- [ ] `go run ./cmd/dmeta validate-interactions --root ./examples/street-deli-ordering --output table` or equivalent command.

## Phase 4: Build semantic-to-interaction elaboration

Goal: derive explicit interaction obligations from resolved semantic facts without choosing web widgets yet.

- [ ] Define `ElaborationRule` model.
- [ ] Define `ElaboratedInteractionIR` model.
- [ ] Define `DomainInteractionObligation` model.
- [ ] Implement `BuildDomainFacts` from resolved archetype/capability/domain mappings.
- [ ] Implement `SemanticSelector.Matches(facts)`.
- [ ] Implement rule matching for `all_capabilities`.
- [ ] Implement rule matching for `any_capabilities`.
- [ ] Implement rule matching for `all_archetypes`.
- [ ] Implement rule matching for `any_archetypes`.
- [ ] Implement projection availability checks for emitted representations.
- [ ] Reject rules that emit abstract representations.
- [ ] Reject rules that emit abstract actions.
- [ ] Emit stable, sorted elaborated interaction output.
- [ ] Add `dmeta elaborate-interactions` command.
- [ ] Support `--output table` with domain type, representation, action, and source rule columns.
- [ ] Support `--output yaml` for inspectable generated IR.
- [ ] Add Street Deli golden output for initial elaboration.
- [ ] Confirm `MenuItem`, `Ingredient`, `SubstitutionRule`, `Order`, and `OrderItem` produce expected obligations.

Validation gate:

- [ ] `go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --output table`
- [ ] Golden test for Street Deli elaboration passes.

## Phase 5: Define the Web MetaDesignSystem package

Goal: formalize current web-style widget templates as target-family artifacts under a `web-ui` MetaDesignSystem.

- [ ] Create `sources/dmeta-ir/meta-design-systems/web-ui/meta-design-system.yaml`.
- [ ] Create `sources/dmeta-ir/meta-design-systems/web-ui/widgets/00-index.yaml`.
- [ ] Create `sources/dmeta-ir/meta-design-systems/web-ui/lowering-rules.yaml`.
- [ ] Create `sources/dmeta-ir/meta-design-systems/web-ui/targets/react.yaml`.
- [ ] Create `sources/dmeta-ir/meta-design-systems/web-ui/schemas/` directory.
- [ ] Define Web MetaDesignSystem primitive concepts: component levels, surfaces, interaction events, state bindings.
- [ ] Define validation settings: require `realizes`, reject abstract selected templates, require action bindings when actions are realized.
- [ ] Add `pkg/dmeta/metadesign/model.go`.
- [ ] Add `pkg/dmeta/metadesign/load.go`.
- [ ] Add `pkg/dmeta/metadesign/validate.go`.
- [ ] Add parser tests for `dmeta_meta_design_system`.
- [ ] Add parser tests for `dmeta_react_codegen_target`.
- [ ] Decide whether existing `sources/dmeta-ir/widget-templates/*.yaml` are imported by web-ui or copied into web-ui during the first migration.

Validation gate:

- [ ] Web MetaDesignSystem YAML parses.
- [ ] `go test ./pkg/dmeta/metadesign/... -count=1`.

## Phase 6: Lower Interaction IR into Web UI widget IR

Goal: map elaborated representations/actions to concrete web widget templates.

- [ ] Add `pkg/dmeta/metadesign/webui/model.go`.
- [ ] Add `pkg/dmeta/metadesign/webui/lower.go`.
- [ ] Define `WebWidgetIR` or reuse extended `validator.Widget` with target context.
- [ ] Define `WebLoweringRule` model.
- [ ] Implement lowering rule matching by representation id.
- [ ] Implement lowering rule matching by action id.
- [ ] Implement lowering rule matching by target context such as density or surface preference.
- [ ] Emit selected/lowered widget candidates with rationale.
- [ ] Connect lowering output to instance manifest selections.
- [ ] Report missing selected widgets for elaborated required representations.
- [ ] Report selected widgets that do not realize any elaborated obligation.
- [ ] Add `dmeta lower-metadesign --target web-ui` command.
- [ ] Add table output showing representation/action -> web template -> concrete component.
- [ ] Add YAML output for generated web widget IR.
- [ ] Add Street Deli lowering rules for `substitution_candidate -> substitution_chip`.
- [ ] Add Street Deli lowering rules for `composition_breakdown -> composition_customizer`.
- [ ] Add Street Deli lowering rules for `composition_summary -> composition_card`.
- [ ] Add Street Deli lowering rules for `order_lifecycle_progress -> order_tracker`.

Validation gate:

- [ ] `go run ./cmd/dmeta lower-metadesign --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target web-ui --output table`
- [ ] Street Deli lowering output accounts for all eight selected widgets.

## Phase 7: Create the React target and scaffold plan

Goal: split current widget generation into an inspectable React scaffold plan followed by rendering/writing files.

- [ ] Add `pkg/dmeta/generator/react/model.go`.
- [ ] Define `ReactScaffoldPlan`.
- [ ] Define `PlannedFile` with path, kind, symbol, and provenance.
- [ ] Define React file kinds: component, types, metadata, stories, barrel, adapter TODO, README, package index.
- [ ] Add `pkg/dmeta/generator/react/plan.go`.
- [ ] Implement Web UI widget IR -> React scaffold plan.
- [ ] Add `pkg/dmeta/generator/react/render.go`.
- [ ] Move or wrap current render functions from `pkg/dmeta/generator/widgets/render.go`.
- [ ] Add `pkg/dmeta/generator/react/write.go` or reuse current writer.
- [ ] Add `dmeta plan-scaffold --target react` command.
- [ ] Update `scaffold-instance` to call the new React scaffold planner internally.
- [ ] Keep current `scaffold-instance` behavior compatible for legacy manifests.
- [ ] Add generated metadata fields: `metaDesignSystem`, `codegenTarget`, `realizes.representations`, `realizes.actions`, pass versions.
- [ ] Add generated component data attributes for MetaDesignSystem and representation ids.
- [ ] Add Storybook docs text that names representations/actions, not only presentations.
- [ ] Add golden tests for React scaffold plan.
- [ ] Add golden tests for one rendered metadata sidecar.

Validation gate:

- [ ] `go test ./pkg/dmeta/generator/react/... -count=1`
- [ ] `go run ./cmd/dmeta plan-scaffold --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target react --output yaml`
- [ ] `go run ./cmd/dmeta scaffold-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`

## Phase 8: Migrate Street Deli templates and instance metadata

Goal: migrate the concrete deli representation to the new Web MetaDesignSystem/React target path while preserving the same user-visible app.

- [ ] Add `abstract: false` and `selectable: true` to all eight selected Street Deli local templates.
- [ ] Add `meta_design_system: web-ui` to all selected Street Deli local templates.
- [ ] Add `codegen_targets: [react]` to all selected Street Deli local templates.
- [ ] Add `realizes.representations/actions` to `deli.menu_browser`.
- [ ] Add `realizes.representations/actions` to `deli.composition_card`.
- [ ] Add `realizes.representations/actions` to `deli.composition_customizer`.
- [ ] Add `realizes.representations/actions` to `deli.ingredient_row`.
- [ ] Add `realizes.representations/actions` to `deli.substitution_chip`.
- [ ] Add `realizes.representations/actions` to `deli.order_cart`.
- [ ] Add `realizes.representations/actions` to `deli.order_tracker`.
- [ ] Add `realizes.representations/actions` to `deli.role_tag`.
- [ ] Add optional `targets` block to `examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`.
- [ ] Keep legacy `generation` block during transition.
- [ ] Regenerate scaffold output under `examples/street-deli-ordering/generated/widgets`.
- [ ] Verify generated metadata includes new provenance fields.
- [ ] Verify promoted React implementation remains untouched by generation.
- [ ] Update generated README to mention Web MetaDesignSystem and React target.
- [ ] Update design docs if any template ids are renamed.

Validation gate:

- [ ] `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table`
- [ ] `go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table`
- [ ] `go run ./cmd/dmeta elaborate-interactions --root ./examples/street-deli-ordering --output table`
- [ ] `go run ./cmd/dmeta lower-metadesign --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --target web-ui --output table`

## Phase 9: Align promoted React app metadata and stories

Goal: update maintained React code to expose the new provenance terms without changing app behavior.

- [ ] Update `src/design-tokens/dataAttributes.ts` with `metaDesignSystem`, `codegenTarget`, and `representation` fields.
- [ ] Keep `presentation` as a legacy/target-specific field.
- [ ] Add representation/action data attributes to `StreetDeliCompositionCard` where useful.
- [ ] Add representation/action data attributes to `StreetDeliCompositionCustomizer` where useful.
- [ ] Add representation/action data attributes to `StreetDeliIngredientRow` where useful.
- [ ] Add representation/action data attributes to `StreetDeliSubstitutionChip` where useful.
- [ ] Add representation/action data attributes to `StreetDeliMenuBrowser` where useful.
- [ ] Add representation/action data attributes to `StreetDeliOrderCart` where useful.
- [ ] Add representation/action data attributes to `StreetDeliOrderTracker` where useful.
- [ ] Add representation metadata to Storybook docs descriptions for all eight widgets.
- [ ] Add a Storybook docs page or story section explaining semantic -> representation -> web widget provenance.
- [ ] Ensure React reducer actions are documented as target action bindings, not upstream Interaction IR definitions.
- [ ] Verify `npm run build` still passes.
- [ ] Verify `npm run build-storybook` still passes.

Validation gate:

- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build`
- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build-storybook`

## Phase 10: Documentation, changelog, and CLIM handoff

Goal: close the Web/React refactor cleanly and prepare the separate CLIM ticket.

- [ ] Update the design guide if implementation deviates from the proposed package layout.
- [ ] Add an implementation diary entry for each completed phase.
- [ ] Update ticket changelog after each phase with commit hashes.
- [ ] Relate any new source files to the design doc and diary.
- [ ] Add a concise `README` section for `sources/dmeta-ir/interactions/`.
- [ ] Add a concise `README` section for `sources/dmeta-ir/meta-design-systems/web-ui/`.
- [ ] Add a migration note for legacy `presentations` terminology.
- [ ] Add a short follow-up design note for the CLIM ticket boundary.
- [ ] Run full Go test suite.
- [ ] Run all DMETA CLI smoke tests.
- [ ] Run React app build and Storybook build.
- [ ] Run `docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30`.
- [ ] Upload final updated bundle to reMarkable.
- [ ] Create or propose a follow-up ticket for the CLIM MetaDesignSystem.

Final validation gate:

- [ ] `go test ./... -count=1`
- [ ] `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table`
- [ ] `go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table`
- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build`
- [ ] `cd examples/street-deli-ordering/www/mobile-react && npm run build-storybook`
- [ ] `docmgr doctor --ticket DMETA-COMPILER-MDS --stale-after 30`
