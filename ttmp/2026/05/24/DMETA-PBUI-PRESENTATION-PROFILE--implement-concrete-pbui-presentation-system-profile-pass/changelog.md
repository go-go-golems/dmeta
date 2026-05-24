# Changelog

## 2026-05-24

- Initial workspace created


## 2026-05-24

Created the concrete PBUI presentation-system profile ticket, wrote the intern-facing implementation guide, and seeded phased tasks and diary.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/design-doc/01-concrete-pbui-presentation-profile-pass-guide.md — Primary architecture and implementation guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/reference/01-diary.md — Step 1 diary entry


## 2026-05-24

Validated the new PBUI presentation-profile ticket, related source evidence, added pbui/clim vocabulary topics, and uploaded the guide bundle to reMarkable.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/design-doc/01-concrete-pbui-presentation-profile-pass-guide.md — Uploaded primary guide
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/vocabulary.yaml — Added pbui and clim topic vocabulary entries


## 2026-05-24

Implemented Phase 1 by authoring the local Street Deli concrete PBUI profile YAML package with style, surfaces, views, bindings, and React app target metadata.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml — Concrete renderer binding catalog
- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml — Profile package entrypoint


## 2026-05-24

Implemented Phase 2 by adding concrete PBUI profile Go model/load/validate support and the validate-pbui-profile CLI command (commit 3d8dd2d636b4317cbe927d9f78f3da4790d0b968).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/validate_pbui_profile.go — Exposes validation as dmeta validate-pbui-profile
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/validate.go — Validates concrete profile structure and PBUI presentation type references


## 2026-05-24

Implemented Phase 3 by adding ConcretePresentationPlan instantiation and the instantiate-pbui CLI command (commit e04e465a2483fca0752d477d446571fe9a8980f6).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/instantiate_pbui.go — Exposes concrete presentation planning as dmeta instantiate-pbui
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/instantiate.go — Instantiates concrete views

