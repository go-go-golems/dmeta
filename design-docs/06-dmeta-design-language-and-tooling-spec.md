---
Title: DMETA Design Language and Tooling Spec
Status: active
Topics:
    - design-system
    - dsl
    - presentation-based-ui
    - code-generation
    - react
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ./03-dense-operational-ui-graphic-design-and-ux-archetype.md
      Note: Conceptual source for the sober dense operational UI design archetype
    - Path: ./04-concrete-dmeta-system-spec.md
      Note: Defines v0 artifact layout and implementation lifecycle
    - Path: ../sources/dmeta-ir/02-design-language.yaml
      Note: Future concrete source artifact described by this spec
ExternalSources: []
Summary: "Concrete v0 specification for DMETA design-language YAML, generated helpers, lint rules, validators, generators, and promotion tooling."
LastUpdated: 2026-05-19T18:50:00-04:00
WhatFor: "Use to draft 02-design-language.yaml and plan the first DMETA validation/generation/lint tooling."
WhenToUse: "Read before changing DMETA design tokens, density rules, generated design helpers, lint checks, or codegen scripts."
---

# DMETA Design Language and Tooling Spec

## Executive Summary

This document specifies the concrete v0 design-language source artifact and the first computational tooling plan for DMETA:

```text
dmeta/sources/dmeta-ir/02-design-language.yaml
```

It also defines the intended tooling sequence:

```text
validate IR
  -> generate core registries
  -> generate design helpers
  -> scaffold widgets
  -> lint promoted code
  -> validate widget promotion
```

The design-language source should encode the **Sober Dense Operational UI** archetype in a way that can become concrete enough for generators and linting, while still allowing v0 to use ranges where a concrete domain design system has not yet chosen exact values.

The tooling should follow the HAIR-041 lesson: generate structure and shared helpers, then require manual promotion and audit for finished UI.

## Design-Language Goals

The design-language IR should express:

1. typography roles;
2. density modes;
3. spacing and rhythm;
4. neutral and semantic color roles;
5. border/radius/elevation constraints;
6. presentation style recipes;
7. interaction states;
8. layout primitives;
9. data-attribute conventions;
10. lintable constraints.

It should not attempt to encode every final CSS rule for every widget.

## `02-design-language.yaml`

### Top-level shape

```yaml
schema_version: 0
artifact_type: dmeta_design_language
summary: Range-based and optionally hardened design-language rules for sober dense operational UIs.

mode: archetype_range

theme_axes: {}
typography: {}
density: {}
spacing: {}
color: {}
borders: {}
elevation: {}
layout: {}
presentation_recipes: {}
interaction_states: {}
data_attributes: {}
lint_rules: {}
```

### `mode`

Initial values:

- `archetype_range` — generic ranges and constraints.
- `concrete_instance` — exact values chosen for a domain-specific design system.

v0 may start with `archetype_range`. A concrete design-system instance can later either switch to `concrete_instance` or provide an override file.

## Theme Axes

Theme axes define controlled variation.

```yaml
theme_axes:
  density:
    values: [compact, regular, spacious]
    default: regular
  neutral_tone:
    values: [warm_paper, cool_gray, white_panel, dark_console]
    default: warm_paper
  type_mode:
    values: [mono_only, sans_with_mono, sans_only_with_tabular]
    default: sans_with_mono
  radius:
    values: [square, slight]
    default: slight
  row_treatment:
    values: [plain, striped, ruled, banded]
    default: ruled
  surface_separation:
    values: [spacing, keyline, tint, subtle_shadow]
    default: keyline
  accent_strategy:
    values: [single_primary, semantic_status_only, category_palette]
    default: semantic_status_only
```

Validation rules:

- Each axis has unique values.
- Defaults are included in values.
- Widgets may reference only declared axes/values.

## Typography

### Range-based form

```yaml
typography:
  families:
    ui_sans:
      role: interface
      examples: [Inter, IBM Plex Sans, system-ui]
    ui_mono:
      role: identifiers_and_numbers
      examples: [Berkeley Mono, IBM Plex Mono, JetBrains Mono, SF Mono]
  roles:
    body:
      family: ui_sans
      size_range: [12, 14]
      weight_range: [400, 500]
      line_height_range: [1.35, 1.5]
      purpose: Main dense reading text.
    metadata:
      family: ui_mono
      size_range: [11, 12]
      weight_range: [400, 500]
      line_height_range: [1.25, 1.4]
      purpose: Timestamps, ids, keyboard hints, secondary facts.
    label:
      family: ui_sans
      size_range: [11, 12]
      weight_range: [500, 600]
      transform: uppercase
      tracking_range: [0.04em, 0.08em]
      purpose: Table headers, rails, badges, section micro-labels.
    title:
      family: ui_sans
      size_range: [16, 20]
      weight_range: [500, 600]
      line_height_range: [1.15, 1.25]
      purpose: Page or panel titles; use sparingly.
    code:
      family: ui_mono
      size_range: [11, 13]
      weight_range: [400, 500]
      numeric: tabular
      purpose: Codes, identifiers, exact values.
```

### Concrete form

```yaml
typography:
  roles:
    body:
      family: ui_sans
      size: 13
      weight: 400
      line_height: 1.4
    label:
      family: ui_sans
      size: 11
      weight: 600
      transform: uppercase
      tracking: 0.06em
```

Validation rules:

- Role ids are unique.
- Concrete values must fall inside archetype ranges when both exist.
- Widgets must reference named roles, not raw font sizes.
- IDs, timestamps, and code-like values should use a mono or tabular numeric role.

## Density and Spacing

```yaml
density:
  modes:
    compact:
      row_height_range: [22, 28]
      cell_padding_x_range: [4, 8]
      cell_padding_y_range: [2, 4]
      font_body_range: [12, 13]
    regular:
      row_height_range: [28, 36]
      cell_padding_x_range: [6, 10]
      cell_padding_y_range: [4, 6]
      font_body_range: [13, 14]
    spacious:
      row_height_range: [36, 44]
      cell_padding_x_range: [10, 14]
      cell_padding_y_range: [6, 10]
      font_body_range: [14, 15]

spacing:
  base_grid: 2
  tokens: [2, 4, 8, 12, 16, 24, 32]
  rules:
    - Use spacing to group before adding boxes.
    - Detail panels may use more spacing than streams/tables.
    - Avoid per-widget local spacing constants once helpers exist.
```

Validation rules:

- Density mode ids are unique.
- Concrete density values use declared spacing tokens where possible.
- Widgets reference density tokens rather than raw row heights once tooling exists.

## Color

```yaml
color:
  neutral_roles:
    background:
      range: [warm_off_white, cool_gray, white]
      purpose: Main application surface.
    surface:
      purpose: Panels, drawers, cards, floating surfaces.
    text_primary:
      contrast: body_text
    text_secondary:
      contrast: secondary_text
    text_muted:
      contrast: metadata
    divider:
      opacity_range: [0.08, 0.16]
  semantic_roles:
    neutral:
      purpose: Default non-emphatic state.
    info:
      purpose: Informational state or category.
    success:
      purpose: Completed/healthy/positive state.
    warning:
      purpose: Delayed/risky/degraded state.
    danger:
      purpose: Failed/destructive/error state.
    pending:
      purpose: Waiting/scheduled/unknown-progress state.
    selected:
      purpose: User-selected semantic representation or row.
    active:
      purpose: Current running/focused operational context.
```

Rules:

- Color is semantic, not decorative.
- Status color must be paired with text/icon labels.
- Broad backgrounds should remain neutral unless the surface itself is a semantic alert.
- Dense rows should not become colorful unless the task is specifically heatmap/category scanning.

Lint candidates:

- no raw hex/HSL literals in promoted widgets;
- no status color outside registered semantic contexts;
- no unregistered category palettes;
- no color-only status indication.

## Borders, Radius, and Elevation

```yaml
borders:
  width_range: [1, 1]
  high_dpi_width_optional: 0.5
  divider_style: hairline
  radius_range: [0, 4]

elevation:
  static_surfaces: none
  floating_surfaces:
    allowed: [menu, popover, command_palette, tooltip]
    shadow: subtle
```

Rules:

- Persistent panels use keylines, spacing, or tint before shadows.
- Floating surfaces may use subtle shadow.
- Avoid large radii for dense operational UI.

Lint candidates:

- no heavy box shadows on static surfaces;
- no large border radii outside explicit theme override;
- no decorative gradients.

## Layout Primitives

```yaml
layout:
  primitives:
    app_frame:
      regions: [nav, toolbar, main, detail_drawer, status_footer]
    master_detail:
      main_ratio_range: [0.6, 0.75]
      detail_ratio_range: [0.25, 0.4]
    dense_stream:
      required_affordances: [virtualization_ready, keyboard_navigation, hover_actions]
    dense_table:
      required_affordances: [sortable, filterable, resizable_columns]
    process_panel:
      required_affordances: [collapsed_summary, expanded_steps]
    command_palette:
      required_affordances: [keyboard_first, filtering, argument_collection]
```

These primitives are not necessarily generated components. They provide shared vocabulary for widgets, stories, and review.

## Presentation Recipes

Presentation recipes bridge `01-core-model.yaml` presentations to visual design helpers.

```yaml
presentation_recipes:
  compact_ref:
    typography: code
    density: compact
    affordances: [hover_underline, copy_on_menu, context_menu]
    states: [rest, hover, focus, selected, candidate, disabled]
  status_badge:
    typography: label
    color_source: state_tone
    shape: slight_radius
    affordances: [context_menu_optional]
    states: [rest, hover, focus, selected]
  dense_row:
    typography: body
    density: compact_or_regular
    row_treatment: ruled
    affordances: [selection, hover_actions, context_menu, keyboard_focus]
  metric_cell:
    typography: code
    alignment: right
    numeric: tabular
    affordances: [copy_optional, compare_optional]
```

Validation rules:

- Every referenced typography role exists.
- Every referenced state exists.
- Every recipe referenced by a presentation exists.
- Every recipe affordance uses a known affordance id.

## Interaction States

```yaml
interaction_states:
  states:
    rest:
      purpose: Default non-interacting state.
    hover:
      purpose: Pointer hover; may reveal utilities.
    focus:
      purpose: Keyboard focus; must be visible.
    selected:
      purpose: User-selected item or presentation.
    candidate:
      purpose: Valid action argument candidate during argument collection.
    active:
      purpose: Currently running/current context.
    disabled:
      purpose: Unavailable action/presentation.
    error:
      purpose: Invalid/destructive/failed state.
  rules:
    - Focus must be visible.
    - Hover-only utilities must also be keyboard reachable.
    - Critical state cannot be hover-only.
    - Candidate state must be distinguishable from ordinary selection.
```

## Data Attributes

Data attributes support testing, auditing, and presentation-based action routing.

```yaml
data_attributes:
  prefix: data-dmeta
  required_for_presentations:
    - semantic-id
    - domain-type
    - archetypes
    - capabilities
    - presentation-id
  required_for_widgets:
    - widget-id
    - widget-level
  required_for_actions:
    - action-id
    - action-category
```

Generated helpers should produce these safely, rather than requiring widgets to hand-write string literals.

## Lint Rules

Initial lint rule inventory:

```yaml
lint_rules:
  no_raw_colors:
    severity: warning
    description: Promoted widgets should use generated color helpers/tokens.
  no_unauthorized_type_roles:
    severity: warning
    description: Widgets should use named typography roles.
  no_local_status_badges:
    severity: warning
    description: Status badges should use registered presentation/design recipe.
  no_local_density_constants:
    severity: warning
    description: Row heights and cell padding should use density helpers.
  no_heavy_static_shadows:
    severity: warning
    description: Static surfaces should not use heavy elevation.
  no_manual_dmeta_data_attributes:
    severity: warning
    description: Widgets should use generated data attribute helpers.
  hover_controls_keyboard_accessible:
    severity: error
    description: Hover-revealed controls must be reachable by keyboard.
```

Rules can start report-only and later become failing checks.

## Tooling Plan

### `01-validate-dmeta-ir.ts`

Inputs:

- `00-index.yaml`
- `01-core-model.yaml`
- `02-design-language.yaml`
- `03-widgets.yaml`

Responsibilities:

- load YAML;
- validate artifact types and schema versions;
- validate references across files;
- validate core model references;
- validate widget references;
- validate design-language references;
- print structured errors.

### `02-generate-presentation-registry.ts`

Inputs:

- `01-core-model.yaml`
- optionally `02-design-language.yaml`

Outputs:

- `src/dmeta/core/presentations.ts`
- `src/dmeta/core/PresentationRef.ts`
- `src/dmeta/core/presentationMatching.ts`

Responsibilities:

- generate presentation id unions;
- generate presentation metadata;
- generate helper functions for matching presentations to archetypes/capabilities;
- generate `PresentationRef` type.

### `03-generate-action-registry.ts`

Inputs:

- `01-core-model.yaml`

Outputs:

- `src/dmeta/core/actions.ts`
- `src/dmeta/core/actionMatching.ts`
- `src/dmeta/core/actionArguments.ts`

Responsibilities:

- generate action id unions;
- generate action metadata;
- generate helpers to discover actions for a `PresentationRef`;
- generate argument collection mode types.

### `04-generate-design-language.ts`

Inputs:

- `02-design-language.yaml`

Outputs:

- `src/dmeta/design/tokens.ts`
- `src/dmeta/design/typography.ts`
- `src/dmeta/design/density.ts`
- `src/dmeta/design/colors.ts`
- `src/dmeta/design/presentationStyles.ts`
- `src/dmeta/design/dataAttributes.ts`
- `src/dmeta/design/index.ts`

Responsibilities:

- generate typed token helpers;
- generate typography role helpers;
- generate density helpers;
- generate presentation recipe helpers;
- generate data attribute helpers.

### `05-scaffold-dmeta-widgets.ts`

Inputs:

- `03-widgets.yaml`
- `01-core-model.yaml`
- `02-design-language.yaml`

Outputs:

- component scaffold;
- type file;
- metadata sidecar;
- story scaffold;
- index barrel.

Responsibilities:

- normalize widget contracts;
- infer output paths;
- write provenance headers;
- preserve hand-promoted widgets unless forced.

### `06-lint-dmeta-design-system.ts`

Inputs:

- promoted widget source tree;
- `02-design-language.yaml`;
- generated helper inventory.

Responsibilities:

- find raw colors;
- find unauthorized font sizes/weights;
- find local status badge implementations;
- find local density constants;
- find manual `data-dmeta-*` attributes;
- find heavy static shadows;
- flag hover-only controls without keyboard access where statically detectable.

### `07-validate-widget-promotion.ts`

Inputs:

- widget source tree;
- `03-widgets.yaml`;
- Storybook stories;
- lint results.

Responsibilities:

- verify generated files exist;
- verify metadata sidecars exist;
- verify promoted widgets preserve contracts;
- verify required stories exist;
- run lint bundle;
- optionally run TypeScript/tests/Storybook build.

## Implementation Order for Tooling

1. Write YAML artifacts manually.
2. Write `01-validate-dmeta-ir.ts`.
3. Generate TypeScript unions/metadata from `01-core-model.yaml`.
4. Generate design helpers from `02-design-language.yaml`.
5. Scaffold one atom (`PresentationToken`).
6. Promote it manually.
7. Add lint checks for raw colors/type roles/data attributes.
8. Scaffold and promote `StatusBadge`, `CompactReference`, and `RecordStream`.
9. Add Storybook coverage checks.

## Generated Code Rules

Generated code should:

- include provenance headers;
- be deterministic;
- be formatted consistently;
- not overwrite promoted implementations unless explicitly forced;
- keep generated helpers separate from hand-promoted widgets;
- avoid runtime reflection when static metadata is enough.

## Manual Promotion Rules

Promoted widgets must:

- keep metadata sidecars;
- use generated design helpers;
- use generated data attribute helpers;
- consume typed `PresentationRef`s and props;
- emit typed callbacks;
- preserve accessibility and keyboard affordances;
- harden Storybook stories beyond generated defaults.

## Validation and Lint Staging

v0 should allow report-only checks at first.

Suggested stages:

1. **Report-only:** find issues without failing.
2. **Warn:** fail only on schema invalidity; design lint warns.
3. **Strict:** fail on raw colors, missing metadata, invalid presentation refs, missing required stories.
4. **Audit:** produce compliance report and remediation tasks.

This mirrors HAIR-041's successful gradual tightening.

## Open Questions

1. Should concrete design-system instances override `02-design-language.yaml` or copy/fork it?
2. Should generated design helpers emit Tailwind class strings, CSS variables, TypeScript style objects, or a mix?
3. Should validators/tooling be written in TypeScript first, since the target stack is React/TS, or Python first, following HAIR-041 precedent?
4. Should lint target source text only at first, or use AST parsing?
5. Should data attributes encode arrays (`archetypes`, `capabilities`) as JSON, space-separated tokens, or repeated attributes?
6. Should design lint allow local exceptions declared in widget metadata sidecars?
