---
Title: DMETA Design Docs and Playbooks Cleanup Plan
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
  - design-system
  - documentation
  - metadesignsystem
  - web
  - pbui
  - clim
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
  - Path: ../playbooks/01-dmeta-shared-compiler-playbook.md
    Note: New shared compiler playbook.
  - Path: ../playbooks/02-dmeta-web-react-metadesignsystem-playbook.md
    Note: New Web React MetaDesignSystem playbook.
  - Path: ../playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md
    Note: New PBUI/CLIM MetaDesignSystem playbook.
  - Path: ./01-design-system-factory-vision-and-scope.md
    Note: Foundation document to keep, but update to mention two active target lines.
  - Path: ./02-semantic-archetype-and-capability-model.md
    Note: Shared semantic model to keep.
  - Path: ./03-dense-operational-ui-graphic-design-and-ux-archetype.md
    Note: Shared visual archetype to keep.
ExternalSources: []
Summary: Document inventory and cleanup decision matrix for DMETA design docs and playbooks after the Web React + PBUI React split.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use before deleting, archiving, or rewriting old DMETA design docs and playbooks.
WhenToUse: Read when deciding whether a document is current guidance, historical background, or superseded by the new Web/PBUI split.
---

# DMETA Design Docs and Playbooks Cleanup Plan

## Purpose

This document records which `design-docs/` and `playbooks/` documents should be kept, updated, archived, or removed now that DMETA has two active target lines:

1. **Web React**: shared Semantic/Interaction IR -> Web MetaDesignSystem -> React target -> `www/mobile-react`.
2. **PBUI/CLIM React**: shared Semantic/Interaction IR -> PBUI MetaDesignSystem -> concrete PBUI profile -> CLIM React target -> `www/clim-react`.

The old documentation assumed a simpler widget-IR-first v0. That history is useful, but current playbooks must describe the layered compiler setup.

## Current playbook decision

The previous two playbooks were replaced because they described the early collaborative schema-design process and single runthrough workflow. The active playbooks are now split by responsibility:

| New playbook | Decision | Reason |
| --- | --- | --- |
| `playbooks/01-dmeta-shared-compiler-playbook.md` | keep | Covers shared Semantic IR, Interaction IR, validation, and cross-target compatibility. |
| `playbooks/02-dmeta-web-react-metadesignsystem-playbook.md` | keep | Covers Web MetaDesignSystem, Web lowering, React scaffold planning, and `www/mobile-react`. |
| `playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md` | keep | Covers PBUI MetaDesignSystem, concrete profile, generic PBUI proof package, and `www/clim-react`. |

Replaced playbooks:

| Old playbook | Decision | Replacement |
| --- | --- | --- |
| `playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md` | remove from active tree | `01-dmeta-shared-compiler-playbook.md` plus the foundation design docs. |
| `playbooks/02-dmeta-design-system-factory-runthrough-playbook.md` | remove from active tree | The new shared/Web/PBUI playbook split. |

If the old playbooks are needed later for historical context, recover them from Git history or move them into an explicit archive directory. They should not remain in active `playbooks/` because their phase model makes the old widget-IR path look like the only current path.

## Design-doc decision matrix

| Document | Decision | Why | Required follow-up |
| --- | --- | --- | --- |
| `01-design-system-factory-vision-and-scope.md` | **Keep and update** | Still explains the factory motivation, dense operational UI goal, presentation-based UI, and generation/promotion discipline. | Update executive summary and layer diagram to mention two active target lines: Web React and PBUI/CLIM React. |
| `02-semantic-archetype-and-capability-model.md` | **Keep** | Still describes the shared semantic model used by both targets. | Minor future update only if current Semantic IR file names or validation invariants change. |
| `03-dense-operational-ui-graphic-design-and-ux-archetype.md` | **Keep** | Still describes the shared dense operational visual archetype. | Add a note that Web consumes it as widget/app styling while PBUI consumes it through concrete profile/style-profile files. |
| `04-concrete-dmeta-system-spec.md` | **Update or supersede** | It still explains Markdown/YAML split and v0 discipline, but its artifact layout predates Interaction IR, MetaDesignSystems, Web/PBUI split, and concrete PBUI profile pass. | Rewrite as “Current DMETA Compiler System Spec” or replace with a new doc that names Semantic IR, Interaction IR, Web MDS, PBUI MDS, and target apps. |
| `05-dmeta-core-model-and-widget-ir-spec.md` | **Update/split** | The core-model sections are still useful. The widget IR sections now belong to Web MetaDesignSystem, not the shared core model. | Keep semantic/core-model parts; move widget-specific guidance into a Web MetaDesignSystem spec or mark as Web-only. |
| `06-dmeta-design-language-and-tooling-spec.md` | **Update/split** | Shared design-language guidance remains useful, but tooling now includes Web and PBUI commands, not just generate-core/scaffold widgets. | Split shared design-language guidance from target-specific tooling commands. Add PBUI profile/style-profile relationship. |
| `07-generated-instance-widget-review-guide.md` | **Archived** | It reviewed old generated instance widget scaffolds. Current review now happens through the Web playbook and PBUI/CLIM playbook. | Moved to `docs/archive/legacy-widget-ir-v0/07-generated-instance-widget-review-guide.md`. |
| `00-document-map-and-cleanup-plan.md` | **Keep** | Current inventory and cleanup decision map. | Update when docs are rewritten, archived, or deleted. |

## Recommended design-doc cleanup sequence

### Step 1: Keep foundational docs visible

Keep these active immediately:

```text
design-docs/01-design-system-factory-vision-and-scope.md
design-docs/02-semantic-archetype-and-capability-model.md
design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md
design-docs/00-document-map-and-cleanup-plan.md
```

They remain useful to explain why the system exists and what shared concepts mean.

### Step 2: Rewrite the system spec

Replace or substantially update:

```text
design-docs/04-concrete-dmeta-system-spec.md
```

The new version should describe the current compiler layers:

```text
Semantic IR
  -> Interaction IR
  -> Web MetaDesignSystem -> Web React target -> www/mobile-react
  -> PBUI MetaDesignSystem -> concrete PBUI profile -> CLIM React target -> www/clim-react
```

It should also explicitly say that Web React and PBUI/CLIM React are sibling target lines.

### Step 3: Split widget/design/tooling specs

Update or split:

```text
design-docs/05-dmeta-core-model-and-widget-ir-spec.md
design-docs/06-dmeta-design-language-and-tooling-spec.md
```

Recommended future documents:

```text
design-docs/05-shared-semantic-and-interaction-ir-spec.md
design-docs/06-web-metadesignsystem-and-react-target-spec.md
design-docs/07-pbui-clim-metadesignsystem-and-react-target-spec.md
```

This avoids putting widget-template rules, PBUI presentation types, concrete profile surfaces, and shared semantic archetypes into one conceptual bucket.

### Step 4: Archive generated widget review guide

Archived:

```text
docs/archive/legacy-widget-ir-v0/07-generated-instance-widget-review-guide.md
```

The Web playbook now carries the active promotion/review guidance, including the rule that generated Web scaffold output is a migration aid once a promoted app exists.

## Active documentation set after cleanup

The ideal active documentation set should be:

```text
design-docs/00-document-map-and-cleanup-plan.md
design-docs/01-design-system-factory-vision-and-scope.md
design-docs/02-semantic-archetype-and-capability-model.md
design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md
design-docs/04-current-dmeta-compiler-system-spec.md       # future replacement/update
design-docs/05-shared-semantic-and-interaction-ir-spec.md  # future replacement/update
design-docs/06-web-metadesignsystem-and-react-target-spec.md
design-docs/07-pbui-clim-metadesignsystem-and-react-target-spec.md
playbooks/01-dmeta-shared-compiler-playbook.md
playbooks/02-dmeta-web-react-metadesignsystem-playbook.md
playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md
```

Older docs can move to:

```text
docs/archive/legacy-widget-ir-v0/
```

or remain reachable through Git history if the repository should stay lean.

## Immediate result of this pass

This pass updates the playbooks first because they are operational instructions. It does not rewrite all design docs yet. The new playbooks are safe to use with the current repository layout and current command set. The design-doc matrix above records which long-form docs should be rewritten or archived in a later documentation cleanup commit.
