#!/usr/bin/env python3
"""Update long-term DMETA docs for widget templates and instance manifests."""
from pathlib import Path
root = Path(__file__).resolve().parents[6]

p = root / 'design-docs/04-concrete-dmeta-system-spec.md'
s = p.read_text()
s = s.replace('''  dmeta/sources/dmeta-ir/02-design-language.yaml
  dmeta/sources/dmeta-ir/03-widgets.yaml
```''','''  dmeta/sources/dmeta-ir/02-design-language.yaml
  dmeta/sources/dmeta-ir/03-widgets.yaml
  dmeta/sources/dmeta-ir/widget-templates/*.yaml

Concrete instance artifacts:
  dmeta/examples/<instance>/instantiations/*.yaml
  dmeta/examples/<instance>/widget-templates/*.yaml   # optional local templates
  dmeta/examples/<instance>/generated/<package>/      # selected generated scaffolds
```''')
s = s.replace('- `03-widgets.yaml` covers generic dense-operational widget classes and contracts.','- `03-widgets.yaml` is now a widget-template package index. The selectable/adaptable template records live in `widget-templates/*.yaml`.')
s = s.replace('''  03-widgets.yaml
```''','''  03-widgets.yaml            # widget-template package index
  widget-templates/          # selectable/adaptable widget templates
    00-index.yaml
    presentations.yaml
    streams.yaml
    tables.yaml
    surfaces.yaml
    actions.yaml
    filters.yaml
    layout.yaml
    dashboards.yaml
    forms.yaml
    states.yaml
    data-display.yaml
```''')
s = s.replace('''### Future tooling

```text
dmeta/scripts/
  01-validate-dmeta-ir.ts
  02-generate-presentation-registry.ts
  03-generate-action-registry.ts
  04-generate-design-language.ts
  05-scaffold-dmeta-widgets.ts
  06-lint-dmeta-design-system.ts
  07-validate-widget-promotion.ts
```''','''### Current and future tooling

```text
cmd/dmeta/main.go
  validate-ir          # validate the global DMETA IR package
  generate-core        # generate TypeScript core registries
  plan-instance        # validate and summarize a concrete instance manifest
  scaffold-instance    # generate selected widget scaffolds for an instance

Future tooling:
  generate-design-language
  lint-dmeta-design-system
  validate-widget-promotion
```

Ticket scripts that perform one-off migrations or reproducible editing passes should live under the relevant `ttmp/.../scripts/` directory, not under `/tmp`.''')
s = s.replace('''### `03-widgets.yaml`

Purpose:

- define generic dense-operational widget classes;
- define widget contracts;
- define presentation slots;
- define action slots;
- define generated outputs;
- define Storybook requirements;
- define adapter boundary expectations.

This adapts the HAIR-041 Widget IR style to presentation-based UI.''','''### `03-widgets.yaml` and `widget-templates/`

Purpose:

- define the global widget-template package index;
- split selectable/adaptable templates by category under `widget-templates/`;
- define template contracts, consumed presentations/capabilities/archetypes, action slots, generated outputs, variants, and adaptation points;
- provide selection guidance so templates do not become accidental mandatory baseline widgets.

A widget template is available to concrete instances, but it is not generated until an instance manifest selects it. This is the key difference from a fixed component catalog.

### Instance manifests and local templates

Concrete design-system instances live next to examples or product packages. They may provide their own local templates in addition to the global template catalog:

```text
examples/street-deli-ordering/
  03-widgets.yaml
  widget-templates/*.yaml
  instantiations/street-deli-ordering.yaml
  instantiations/street-deli-coffee-counter.yaml
  generated/widgets/
  generated/coffee-counter-widgets/
```

An instance manifest declares `selected_templates` and `excluded_templates`. Selection includes the template id, concrete component name, variant, optional adaptations, and the reason the widget belongs in that design-system instance. Exclusions record why plausible templates were intentionally not generated.''')
s = s.replace('''  -> generated registries/helpers/scaffolds
  -> manually promoted React widgets''','''  -> generated registries/helpers
  -> instance manifests
  -> selected widget scaffolds
  -> manually promoted React widgets''')
s = s.replace('''9. Build a validator.
10. Build generators in small passes.
11. Promote first widgets.
12. Instantiate first concrete domain.''','''9. Build a validator.
10. Build generators in small passes.
11. Create instance manifests and run `plan-instance` before scaffolding.
12. Generate only selected widget templates with `scaffold-instance`.
13. Promote first widgets.
14. Instantiate first concrete domain.''')
p.write_text(s)

p = root / 'design-docs/05-dmeta-core-model-and-widget-ir-spec.md'
s = p.read_text()
append = '''
## 2026-05 Widget Template and Instance Manifest Update

The original version of this document described `03-widgets.yaml` as a monolithic widget IR. That model has been replaced. DMETA now treats widgets as **selectable templates**. The global `03-widgets.yaml` file is a package index with `artifact_type: dmeta_widget_template_package`, and concrete template records live in split files under `sources/dmeta-ir/widget-templates/`.

The current global layout is:

```text
sources/dmeta-ir/
  03-widgets.yaml
  widget-templates/
    00-index.yaml
    actions.yaml
    dashboards.yaml
    data-display.yaml
    filters.yaml
    forms.yaml
    layout.yaml
    presentations.yaml
    states.yaml
    streams.yaml
    surfaces.yaml
    tables.yaml
```

A template record keeps the earlier widget contract fields, but it also includes selection metadata:

```yaml
template:
  category: filters
  selection: optional
  maturity: draft
  default_importance: common
  selection_questions:
    - Does this concrete instance need this widget behavior?
  adaptation_points:
    autocomplete_sources:
      type: list
      required_for_variants: [autocomplete_entity_search]
      description: Suggestion sources exposed by the instance adapter.
  common_variants:
    - simple_text_search
    - autocomplete_entity_search
  avoid_when:
    - Search is not a primary workflow or fixed filters are sufficient.
```

Concrete instances select templates from the global catalog and from optional local template files. A manifest lives under an `instantiations/` directory:

```yaml
schema_version: 0
artifact_type: dmeta_instance
id: street_deli_ordering
name: Street Deli Ordering
template_sources:
  global_ir_root: ../../../sources/dmeta-ir
  local_template_files:
    - ../widget-templates/menu-browsing.yaml
    - ../widget-templates/item-cards.yaml
generation:
  output_dir: ../generated/widgets
selected_templates:
  - template: deli.composition_customizer
    as: StreetDeliCompositionCustomizer
    variant: bottom_sheet
    reason: Ingredient removal and intelligent substitutions are the core sandwich customization workflow.
excluded_templates:
  - template: dmeta.dense_table
    reason: The street-deli flow is card/customizer/cart oriented, not table oriented.
```

The generator path is now:

```text
widget templates + instance manifest
  -> dmeta plan-instance
  -> dmeta scaffold-instance
  -> generated selected widget scaffolds
  -> manual promotion
```

`plan-instance` validates selected template ids, excluded template ids, duplicate concrete component names, selection/exclusion reasons, declared variants, and required adaptation points. `scaffold-instance` reuses that validation path before writing files.

The key invariant is: a template being present in the catalog does not mean it should be generated. Generation is controlled by instance manifests.
'''
if '## 2026-05 Widget Template and Instance Manifest Update' not in s:
    s = s.replace('## Open Questions', append + '\n## Open Questions')
p.write_text(s)

p = root / 'README.md'
s = p.read_text()
s = s.replace('- `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` — concrete v0 specification for `01-core-model.yaml` and `03-widgets.yaml`.', '- `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` — concrete v0 specification for `01-core-model.yaml`, widget-template packages, and instance manifests.')
s = s.replace('- `sources/dmeta-ir/03-widgets.yaml` — generic dense-operational widget classes and contracts.', '- `sources/dmeta-ir/03-widgets.yaml` — widget-template package index. The selectable/adaptable global templates live in `sources/dmeta-ir/widget-templates/*.yaml`.')
if '## Commands' not in s:
    s += '''

## Commands

Validate the global DMETA IR package:

```bash
GOWORK=off go run ./cmd/dmeta validate-ir --root ./sources/dmeta-ir --include-info --output table
```

Generate TypeScript core registries:

```bash
GOWORK=off go run ./cmd/dmeta generate-core --root ./sources/dmeta-ir --out ./generated/dmeta-core --force --output table
```

Plan a concrete widget-template instantiation before writing files:

```bash
GOWORK=off go run ./cmd/dmeta plan-instance \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --output table
```

Scaffold only the templates selected by an instance manifest:

```bash
GOWORK=off go run ./cmd/dmeta scaffold-instance \
  --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml \
  --force \
  --output table
```

## Instance widget review rule

Generated instance widgets are scaffolds. Review the `.metadata.ts` sidecar first to confirm the template id, instance id, selected variant, selection reason, and adaptations. Do not overwrite promoted widgets casually; regenerate only scaffold-stage files or create an explicit migration patch for promoted implementations.
'''
p.write_text(s)

p = root / 'design-docs/07-generated-instance-widget-review-guide.md'
p.write_text('''---
Title: Generated Instance Widget Review Guide
Status: active
Topics:
    - design-system
    - widget-templates
    - code-generation
    - react
DocType: design-doc
Intent: long-term
Summary: "Short review guide for generated DMETA instance widget scaffolds and promoted widgets."
LastUpdated: 2026-05-20T21:15:00-04:00
WhatFor: "Use when reviewing files produced by dmeta scaffold-instance or deciding whether a scaffold is ready to become a promoted widget implementation."
WhenToUse: "Read before editing generated instance widgets, regenerating scaffolds, or reviewing promotion diffs."
---

# Generated Instance Widget Review Guide

Generated instance widgets are starting points. They are not finished product components. A scaffold proves that an instance manifest can resolve templates, generate typed props, preserve metadata, and create Storybook seed files. Promotion is a separate human step.

## Review order

1. Start with the instance manifest under `instantiations/`. Confirm the widget should exist in this concrete design system.
2. Read the generated `.metadata.ts` sidecar. Confirm `templateId`, `instanceId`, `variant`, `selectedAs`, `reason`, and `adaptations` match the manifest.
3. Read the `.types.ts` file. Replace placeholder `unknown` aliases only when the concrete domain view models exist.
4. Read the component scaffold. Treat it as a structural placeholder until it has real markup, accessibility behavior, keyboard behavior, and design-language styling.
5. Read the `.stories.tsx` file. Add stories for the selected variant and the instance-specific states, not every possible template state.

## Promotion rule

A promoted widget should have:

- real semantic markup rather than a JSON `<pre>` placeholder;
- props backed by concrete view-model types;
- callbacks that emit typed presentation/action/filter requests;
- Storybook coverage for selected variants and edge states;
- no direct backend calls inside the widget;
- metadata that still records the originating template and instance selection reason.

## Regeneration rule

Do not blindly overwrite promoted widgets. Regeneration is safe for scaffold-stage files. Once a widget is promoted, generator output should become a migration aid rather than an automatic replacement.
''')

p = root / 'ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/tasks.md'
s = p.read_text()
for line in [
'Phase 7: Documentation/spec follow-up',
'Update `design-docs/05-dmeta-core-model-and-widget-ir-spec.md` to describe widget-template packages and instance manifests.',
'Update `design-docs/04-concrete-dmeta-system-spec.md` artifact layout.',
'Update README command examples for `validate-ir`, `scaffold-instance`, and future `plan-instance`.',
'Add a short generated-code review guide for promoted instance widgets.',
]:
    s = s.replace(f'- [ ] {line}', f'- [x] {line}')
p.write_text(s)
