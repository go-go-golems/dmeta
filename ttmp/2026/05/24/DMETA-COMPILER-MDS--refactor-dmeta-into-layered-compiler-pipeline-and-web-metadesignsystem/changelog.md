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

