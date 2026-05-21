# Tasks

## TODO

- [ ] Add tasks here

- [ ] Phase 1: Elicit semantic archetype model — define reusable functional roles for dense operational apps
- [ ] Phase 2: Elicit presentation model — define presentation variants per archetype and per domain mapping
- [ ] Phase 3: Define generic widget classes for PBUI dense operational applications
- [ ] Phase 4: Define design-language archetype — sober typographic dense-information UI as formal IR
- [ ] Phase 5: Draft example YAML and pressure-test schemas across at least two domains
- [ ] Phase 6: Formalize schema — required fields, validation rules, generation targets
- [ ] Build scaffold generator adapted for PBUI archetypes + presentations
- [ ] Build design helper generator for the sober typographic information design archetype
- [ ] Promote pilot generic widgets (RecordStream, DenseTable, ProcessPanel, ActionPalette, DetailDrawer)
- [ ] Build lint + validation tooling for the new schema layers
- [x] Create concrete DMETA system spec at dmeta/design-docs/04-concrete-dmeta-system-spec.md
- [x] Create core model and widget IR spec at dmeta/design-docs/05-dmeta-core-model-and-widget-ir-spec.md
- [x] Create design language and tooling spec at dmeta/design-docs/06-dmeta-design-language-and-tooling-spec.md
- [x] Create minimal DMETA IR source directory dmeta/sources/dmeta-ir with 00-index.yaml
- [x] Draft dmeta/sources/dmeta-ir/01-core-model.yaml consolidating archetypes, capabilities, presentations, actions, and domain examples
- [x] Draft dmeta/sources/dmeta-ir/02-design-language.yaml with range-based visual/design constraints for v0
- [x] Draft dmeta/sources/dmeta-ir/03-widgets.yaml with the first generic dense-operational widget classes
- [x] Validate docmgr hygiene, update diary/changelog, and commit work at logical intervals
- [x] Phase 1: Cleanly cut over widget IR to a split widget-templates package (no backwards-compatibility wrapper).
- [x] Phase 2: Add an instantiations directory model and create the street-deli-ordering instance manifest under examples/street-deli-ordering/.
- [x] Phase 3: Implement/adjust generator support for selected widget templates and generate street-deli-ordering code under the example directory.
- [x] Phase 4: Validate IR/generated code, update diary/changelog, and commit at logical boundaries.


## Widget Template Cutover and Expansion Plan

- [x] Phase 1: Clean widget-template package cutover
  - [x] Replace monolithic `sources/dmeta-ir/03-widgets.yaml` with a widget-template package index.
  - [x] Create `sources/dmeta-ir/widget-templates/00-index.yaml`.
  - [x] Move existing generic widgets into split template category files.
  - [x] Update `sources/dmeta-ir/00-index.yaml` artifact metadata.
  - [x] Update validator model/loader to require the split template package without compatibility fallback.
  - [x] Run `dmeta validate-ir` and commit.

- [x] Phase 2: Street Deli instance manifest and local templates
  - [x] Create `examples/street-deli-ordering/widget-templates/` for local app-specific templates.
  - [x] Replace example `03-widgets.yaml` with a local template-package index.
  - [x] Create `examples/street-deli-ordering/instantiations/street-deli-ordering.yaml`.
  - [x] Select only ordering-flow widgets needed by the mobile street-deli app.
  - [x] Explicitly exclude irrelevant global dense/table/stream/action-palette templates with reasons.

- [x] Phase 3: Instance scaffolding generator
  - [x] Add `dmeta scaffold-instance` CLI command.
  - [x] Load global widget templates from `sources/dmeta-ir`.
  - [x] Merge local template files declared by the instance manifest.
  - [x] Resolve `selected_templates` to concrete component names and variants.
  - [x] Generate component/type/story/metadata/barrel files only for selected templates.
  - [x] Write generated files under `examples/street-deli-ordering/generated/widgets/`.
  - [x] Preserve generated metadata with template id, instance id, variant, and selection reason.

- [x] Phase 4: Validation and bookkeeping
  - [x] Run `dmeta validate-ir`.
  - [x] Run `go test ./...`.
  - [x] Run `docmgr doctor --ticket DMETA-001`.
  - [x] Update diary and changelog.
  - [x] Commit and push each logical phase.

- [x] Phase 5: Expand global widget-template catalog
  - [x] Add missing template category files: `filters.yaml`, `layout.yaml`, `dashboards.yaml`, `forms.yaml`, `states.yaml`, and `data-display.yaml`.
  - [x] Extend existing `actions.yaml` with `ActionButton`, `ActionGroup`, and `ContextMenuTrigger` templates.
  - [x] Extend existing `tables.yaml` with `PresentationCell`, `BulkActionBar`, and `ResultWindowControls` templates.
  - [x] Ensure every new template includes selection guidance, adaptation points, common variants, and avoid-when notes.
  - [x] Keep rare templates such as `KeyValueList` and `ComparisonTable` marked optional/rare, not baseline.
  - [x] Update `sources/dmeta-ir/03-widgets.yaml` and `widget-templates/00-index.yaml` file maps.
  - [x] Validate references against core-model presentations/capabilities/archetypes.

- [ ] Phase 6: Instance planning and validation hardening
  - [x] Add `dmeta plan-instance` before further scaffolding work.
  - [x] Add validator support for `dmeta_instance` manifests.
  - [x] Validate selected template ids, duplicate `as` names, local template files, declared variants, and selection/exclusion reasons.
  - [ ] Add formal required adaptation-point schemas and validate missing required adaptations.
  - [x] Validate exclusions reference known templates.
  - [x] Report selected, excluded, auto-included, and missing-decision templates.

- [ ] Phase 7: Documentation/spec follow-up
  - [ ] Update `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` to describe widget-template packages and instance manifests.
  - [ ] Update `design-docs/04-concrete-dmeta-system-spec.md` artifact layout.
  - [ ] Update README command examples for `validate-ir`, `scaffold-instance`, and future `plan-instance`.
  - [ ] Add a short generated-code review guide for promoted instance widgets.

- [x] Phase 8: Generalize Street Deli local templates into menu-ordering template families
  - [x] Split `examples/street-deli-ordering/widget-templates/ordering-flow.yaml` into focused family files.
  - [x] Add templates for simple items, variants, modifier groups, bundles, build-your-own flows, availability, and tracking.
  - [x] Update `examples/street-deli-ordering/03-widgets.yaml` and local `widget-templates/00-index.yaml` file maps.
  - [x] Update the current `street-deli-ordering` instance manifest to select the sandwich/composition subset from the family files.
  - [x] Add at least one alternate Street Deli instantiation to prove optionality/flexibility.
  - [x] Run `plan-instance` for all Street Deli instantiations.
  - [x] Regenerate selected widget scaffolds under `examples/street-deli-ordering/generated/`.
  - [x] Validate IR, run Go tests, update diary/changelog, and commit.

