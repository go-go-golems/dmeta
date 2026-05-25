# Changelog

## 2026-05-24

- Initial workspace created


## 2026-05-24

Created generated-file metadata ticket, removed committed PBUI proof output in favor of regeneration, wrote intern-facing implementation guide and diary, restored required shared core-model examples, and validated Go tests plus PBUI React planning.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/.gitignore — Regenerable PBUI output ignore rule
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-GENERATED-METADATA--generated-file-metadata-and-promotion-guidance/design-doc/01-generated-file-metadata-and-promotion-guidance-implementation-guide.md — Primary generated metadata guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-GENERATED-METADATA--generated-file-metadata-and-promotion-guidance/reference/01-diary.md — Implementation diary


## 2026-05-24

Phase 1: Added shared generated metadata model/render helpers and tests.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/metadata/model.go — Shared generated metadata schema
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/metadata/render.go — Header
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/metadata/render_test.go — Tests for generated metadata rendering


## 2026-05-24

Phase 2: Threaded shared metadata into generic PBUI React renderer and validated ignored proof package regeneration/build.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_pbui_react.go — CLI fills generation command/time/source roots
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/react_plan.go — PBUI React plan carries generation/source-root context
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/react_render.go — PBUI React renderer now emits shared metadata in TS/TSX and JSON sidecars
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/testdata/composition_metadata.golden.json — Golden fixture for shared generated metadata envelope


## 2026-05-24

Phase 3: Added shared metadata exports, sidecars, and promotion guidance to Web React scaffolds.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_react.go — CLI fills generation context
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/model.go — Scaffold plan carries generation and source-root context
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/render.go — Web React renderer now emits shared generated metadata

