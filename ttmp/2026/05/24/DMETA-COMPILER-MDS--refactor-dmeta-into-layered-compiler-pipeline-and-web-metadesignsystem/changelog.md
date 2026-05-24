# Changelog

## 2026-05-24

- Initial workspace created


## 2026-05-24

Created intern-ready layered compiler pipeline and Web MetaDesignSystem refactor guide, diary, file relationships, validation, and reMarkable upload.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md — Primary design/implementation guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/reference/01-diary.md — Chronological diary and delivery evidence


## 2026-05-24

Expanded ticket tasks into detailed phased implementation checklist covering compatibility fields, Interaction IR, Web MetaDesignSystem, React target, Street Deli migration, promoted React metadata, validation, and CLIM handoff.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md — Detailed phase/task checklist


## 2026-05-24

Reframed implementation strategy as a hard top-down cutover: move widgets under meta-design-systems/web, delete old widget-template paths, remove compatibility/wrapper tasks, and treat React as a Web target.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/design-doc/01-layered-compiler-pipeline-and-web-metadesignsystem-refactor-guide.md — Updated hard-cut design policy and phases
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-COMPILER-MDS--refactor-dmeta-into-layered-compiler-pipeline-and-web-metadesignsystem/tasks.md — Updated hard-cut phased task list


## 2026-05-24

Phase 1 partial hard cutover: moved global and Street Deli widget templates under meta-design-systems/web, removed old 03-widgets.yaml files, updated indexes/manifests/loaders for dmeta_meta_design_system + dmeta_web_widget_templates, and verified validate/plan/scaffold dry-run.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/web/meta-design-system.yaml — New Street Deli Web MetaDesignSystem extension entrypoint
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/load.go — Loads Web MetaDesignSystem instead of top-level 03-widgets.yaml
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/validate.go — Validates web_meta_design_system index artifact type
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml — New global Web MetaDesignSystem package entrypoint


## 2026-05-24

Phase 2 seed: added top-level Interaction IR package with initial modality-neutral actions, representations, and semantic-to-interaction elaboration rules; added interactions to global IR index and validated YAML parsing.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/interactions/actions.yaml — Initial modality-neutral action catalog
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/interactions/elaboration-rules.yaml — Initial rules mapping semantic facts to interaction obligations
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/interactions/representations.yaml — Initial modality-neutral representation catalog


## 2026-05-24

Added first Go Interaction IR loader/validator and validate-interactions command. Validation now checks roots, extends, cycles, supported actions, and elaboration rule emissions.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/validate_interactions.go — validate-interactions command
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/load.go — Interaction IR package loader
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/model.go — Interaction IR Go model
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/validate.go — Interaction IR validator


## 2026-05-24

Added semantic-to-interaction elaboration command and fixed split core-model loading for singular domain examples. Street Deli now validates domain mappings and emits modality-neutral action/representation obligations.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/core-model/street-deli-ordering.yaml — Updated domain mappings to concrete archetypes/capabilities
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/elaborate_interactions.go — CLI command for interaction elaboration
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/elaborate.go — Semantic-to-interaction elaboration implementation
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/validator/load.go — Split core-model loader now reads files.domain_example


## 2026-05-24

Added Web MetaDesignSystem lowering catalogs and lower-web command. Interaction obligations can now lower to Web widget template, slot, visual-state, and event-binding obligations for global Web and Street Deli local Web packages.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/web/lowering-rules.yaml — Street Deli Web lowering catalog
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/lower_web.go — lower-web CLI command
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/web/lower.go — Interaction-to-Web lowering pass
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/lowering-rules.yaml — Global Web lowering catalog


## 2026-05-24

Added React target scaffold planning under the Web MetaDesignSystem. plan-scaffold --target react now consumes Web obligations and emits component/file plans with Web/React provenance for all eight selected Street Deli widgets.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/plan_scaffold.go — plan-scaffold CLI command
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/model.go — React scaffold plan model
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/plan.go — React target planning from Web obligations
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/targets/react.yaml — React target metadata and file-kind catalog


## 2026-05-24

Added React metadata sidecar rendering and a focused provenance test. The renderer emits JSON sidecars with metaDesignSystem, codegenTarget, realized representations/actions, Web slots/states/events, React files, and source pass provenance.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/model.go — GeneratedFile and scaffold plan structures used by renderer
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go — React metadata sidecar renderer
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render_test.go — Metadata sidecar provenance test


## 2026-05-24

Added scaffold-react writer and full React target renderers. The new command renders component, types, metadata, stories, CSS module, barrel, adapter TODO, README, and package index files from Web obligations with dry-run/force/metadata-only modes.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go — Register scaffold-react command
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_react.go — scaffold-react CLI command
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go — React target renderer for components
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/write.go — React target write/dry-run support


## 2026-05-24

Hard-cut instance manifests and CLI away from generic widget scaffolding. Street Deli manifests now use semantic_root, interactions_root, meta_design_systems.web, and targets.react; scaffold-instance and legacy generic widget renderer/writer files were removed.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/cmd/dmeta/main.go — Removed scaffold-instance from CLI surface
- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/instantiations/street-deli-coffee-counter.yaml — Coffee counter manifest migrated to explicit Web/React targets
- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/instantiations/street-deli-ordering.yaml — Main Street Deli manifest migrated to explicit Web/React targets
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/widgets/model.go — Instance manifest schema hard-cut to semantic_root/interactions_root/meta_design_systems/targets

