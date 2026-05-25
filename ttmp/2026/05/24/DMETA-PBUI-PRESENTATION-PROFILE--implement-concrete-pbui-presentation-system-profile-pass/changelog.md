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


## 2026-05-24

Implemented Phase 4 by adding React CLIM app planning and the plan-pbui-react-app CLI command (commit eded683261a579beab822b6cb60d45ed8dda485c).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/plan_pbui_react_app.go — Exposes concrete React CLIM app planning as dmeta plan-pbui-react-app
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/pbui/profile/react_app_plan.go — Plans app shell


## 2026-05-24

Added Storybook-first scaffold guidance, implemented scaffold-pbui-react-app, and generated a buildable Street Deli www/clim-react app with Storybook stories (commit 454db4f1023b06477f57c5d8b99ddde05bf396f5).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/clim-react/package.json — Generated app package with build and Storybook scripts
- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/clim-react/src/components/storybook/ClimStoryShell.tsx — Storybook harness
- /home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/cmds/scaffold_pbui_react_app.go — New scaffold command


## 2026-05-24

Wrote an exhaustive PBUI MetaDesignSystem implementation report covering IRs, schemas, Go packages, commands, generated outputs, application author responsibilities, workflow, and current scaffold limitations (commit 0785f2585d4f8ed3160922ebbd4f0eb3ff2fd746).

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/analysis/01-pbui-metadesignsystem-implementation-report.md — Implementation report


## 2026-05-24

Added repository cleanup assessment for reducing dmeta to the latest PBUI MetaDesignSystem setup plus two prototypes, and uploaded it to reMarkable.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/analysis/02-repository-cleanup-assessment-for-latest-pbui-metadesignsystem-setup.md — Cleanup assessment and recommendations


## 2026-05-24

Updated repository cleanup assessment to keep both active target lines: Web React/mobile-react and PBUI React, including the Web MetaDesignSystem and generic PBUI React proof package.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/mobile-react/package.json — Web React app is now explicitly kept
- /home/manuel/code/wesen/go-go-golems/dmeta/sources/dmeta-ir/meta-design-systems/web/meta-design-system.yaml — Web MetaDesignSystem is now explicitly kept
- /home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-PBUI-PRESENTATION-PROFILE--implement-concrete-pbui-presentation-system-profile-pass/analysis/02-repository-cleanup-assessment-for-latest-pbui-metadesignsystem-setup.md — Updated cleanup assessment


## 2026-05-24

Replaced stale DMETA playbooks with shared, Web React, and PBUI/CLIM playbooks; added design-doc cleanup matrix and refreshed README pointers.

### Related Files

- /home/manuel/code/wesen/go-go-golems/dmeta/design-docs/00-document-map-and-cleanup-plan.md — Design-doc keep/update/archive matrix
- /home/manuel/code/wesen/go-go-golems/dmeta/playbooks/01-dmeta-shared-compiler-playbook.md — Shared compiler workflow
- /home/manuel/code/wesen/go-go-golems/dmeta/playbooks/02-dmeta-web-react-metadesignsystem-playbook.md — Web React MetaDesignSystem workflow
- /home/manuel/code/wesen/go-go-golems/dmeta/playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md — PBUI/CLIM MetaDesignSystem workflow

