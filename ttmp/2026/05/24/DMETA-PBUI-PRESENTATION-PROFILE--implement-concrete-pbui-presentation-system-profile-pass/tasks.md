# Tasks

## Phase 0: Ticket setup and source evidence

- [x] Create ticket workspace `DMETA-PBUI-PRESENTATION-PROFILE`.
- [x] Create primary intern-facing design/implementation guide.
- [x] Create diary.
- [x] Inspect current PBUI compiler/scaffold files.
- [x] Inspect Street Deli `prototype-clim` visual and interaction reference.
- [x] Inspect Readwise Viewer CLIM runtime reference.
- [x] Relate key source files to the guide and diary.
- [x] Upload guide bundle to reMarkable.
- [x] Run `docmgr doctor --ticket DMETA-PBUI-PRESENTATION-PROFILE --stale-after 30`.

## Phase 1: Author Street Deli concrete PBUI profile YAML

Goal: create an explicit local profile package that captures the Street Deli CLIM look and interaction grammar.

- [x] Create `examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml`.
- [x] Create `examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml` from `prototype-clim/styles.css`.
- [x] Create `examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml` from `prototype-clim/index.html` shell regions.
- [x] Create `examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml` for menu/detail/substitution/cart/help/tracker.
- [x] Create `examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml` mapping PBUI presentation types to concrete CLIM renderer components.
- [x] Create `examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml`.
- [x] Include rich `summary`, `intent`, `description`, `rationale`, and reference fields in every profile catalog.

Validation gate:

- [x] YAML files parse.
- [x] Profile references the global PBUI MetaDesignSystem and local prototype/runtime references.

## Phase 2: Load and validate concrete PBUI profile packages

Goal: make the concrete profile compiler-visible before generating any app code.

- [x] Add Go model for presentation-system profiles.
- [x] Add loader for `presentation-system.yaml` and referenced files.
- [x] Add validator for artifact types, required prose fields, view ids, surface ids, binding ids, and style classes.
- [x] Validate presentation bindings reference known PBUI presentation types.
- [x] Validate view models reference known PBUI presentation types.
- [x] Add `dmeta validate-pbui-profile`.
- [x] Add unit tests and a Street Deli profile fixture test.

Validation gate:

- [x] `go test ./pkg/dmeta/metadesign/pbui/... -count=1`
- [x] `go run ./cmd/dmeta validate-pbui-profile --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --interactions-root ./sources/dmeta-ir --include-info --output table`

## Phase 3: Instantiate profile against PBUI obligations

Goal: apply the concrete presentation profile to abstract PBUI obligations and produce a target-neutral concrete presentation plan.

- [x] Define `ConcretePresentationPlan`.
- [x] Define view plan, surface plan, component binding plan, style plan, runtime mode plan.
- [x] Implement `InstantiateProfile` from PBUI obligations + descriptors + profile package.
- [x] Add `dmeta instantiate-pbui`.
- [x] Output table columns: view, surface, presentation type, component, domain types, actions, representations, presenter intent, recognizer intent, style profile.
- [x] Add golden test for Street Deli concrete instantiation.

Validation gate:

- [x] `go run ./cmd/dmeta instantiate-pbui --root ./examples/street-deli-ordering --interactions-root ./sources/dmeta-ir --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui --output table`

## Phase 4: Plan React CLIM app target

Goal: plan a real app target, not just generic PBUI scaffold files.

- [x] Add React app planning model.
- [x] Plan Vite/React package files.
- [x] Plan CSS/font files from style profile.
- [x] Plan `ClimShell`, `ClimHeader`, `ClimCommandBar`, `ClimCommandLine`, `Presentation`, `ActionPresentation`, `ContextMenu`, and `ConfirmPrompt`.
- [x] Plan runtime files inspired by Readwise: `types.ts`, `store.ts`, `actions.ts`, `commands.ts`, `selectors.ts`, `runtime.ts`.
- [x] Plan view files for menu/detail/substitution/cart/help/tracker.
- [x] Plan generated registry imports or copies.
- [x] Add `dmeta plan-pbui-react-app`.

Validation gate:

- [x] Planning command emits stable table/YAML output for the Street Deli CLIM React app.

## Phase 5: Scaffold or promote `www/clim-react`

Goal: create the actual React CLIM app that visually follows `prototype-clim` and architecturally follows Readwise.

- [ ] Create `examples/street-deli-ordering/www/clim-react/`.
- [ ] Port Berkeley Mono fonts.
- [ ] Port `prototype-clim` CSS into tokenized React app CSS.
- [ ] Implement CLIM runtime state machine.
- [ ] Implement presentation selection, select mode, confirm mode, command buffer, command history, context menu, and action result line.
- [ ] Implement menu/detail/substitution/cart/help/tracker views.
- [ ] Consume generated PBUI registries/metadata.
- [ ] Add Storybook or screenshot review if practical.

Validation gate:

- [ ] `cd examples/street-deli-ordering/www/clim-react && npm run build`
- [ ] Existing app still builds: `cd examples/street-deli-ordering/www/mobile-react && npm run build`

## Phase 6: Visual and interaction parity review

Goal: compare the new React CLIM app against `prototype-clim` and record remaining gaps.

- [ ] Run prototype and React app side by side.
- [ ] Capture screenshots of menu, detail, substitution, cart, help, and tracker.
- [ ] Verify presentation text/object styling.
- [ ] Verify selected presentation styling.
- [ ] Verify select-mode compatible/disabled styling.
- [ ] Verify command line behavior.
- [ ] Verify action presentations and context menu behavior.
- [ ] Write a parity review doc in the ticket.

Validation gate:

- [ ] Parity review document stored in ticket.
- [ ] Gaps converted into follow-up tasks rather than hidden in code comments.

## Phase 7: Update docs and upload refresh

- [ ] Update the guide if implementation changes schema names.
- [ ] Update diary after each phase.
- [ ] Run `docmgr doctor --ticket DMETA-PBUI-PRESENTATION-PROFILE --stale-after 30`.
- [ ] Upload updated guide/diary bundle to reMarkable after first working profile validation.
