---
Title: Dense Operational UI Graphic Design and UX Archetype
Ticket: DMETA-001
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
    - Path: 2026-05-19--image-collector/app/src/styles
      Note: Existing working programme/minimal typography reference implementation
    - Path: 2026-05-19--log-presentation-based-ui/app/src/styles
      Note: Existing working typographic/token reference implementation
    - Path: dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/sources/images/01-dense-typographic-reference.png
      Note: User-provided visual reference for sober dense operational UI archetype
    - Path: dmeta/ttmp/2026/05/19/DMETA-001--design-system-factory-first-runthrough-of-presentation-based-ui-dsl-for-high-volume-data-applications/sources/images/02-dense-typographic-reference.png
      Note: User-provided visual reference for sober dense operational UI archetype
ExternalSources: []
Summary: "Intermediate graphic design and UX archetype for sober dense operational UIs."
LastUpdated: 2026-05-19T17:36:00-04:00
WhatFor: "Use to derive concrete design-language.yaml, hard visual rules, generated helpers, lint checks, and UI playbooks."
WhenToUse: "Read when refining the visual/UX side of the design-system factory or instantiating a concrete domain-specific design system."
---


# Dense Operational UI Graphic Design and UX Archetype

## Executive Summary

This document defines the graphic design and UX archetype for the design-system factory. It is not a fixed visual theme. It is a set of reusable constraints and ranges for generating sober, dense, low-chrome, typographic applications that remain readable under high information load.

The source references are:

- `sources/images/01-dense-typographic-reference.png`
- `sources/images/02-dense-typographic-reference.png`
- `2026-05-19--log-presentation-based-ui`
- `2026-05-19--image-collector`

The target archetype is: **calm operational typography**. It favors alignment, spacing, text hierarchy, low-contrast structure, semantic color, keyboard-first interaction, and progressive disclosure over decorative chrome.

This document is intentionally intermediate. It should later be compiled into:

1. a concrete design-language IR;
2. hard design rules;
3. generated token/helper code;
4. lint checks;
5. widget implementation playbooks.


## Current Target Consumption Note

This document defines the shared visual/UX archetype. The current compiler consumes that archetype through target-specific layers:

- Web React uses it as guidance for browser widgets, promoted app CSS, and Storybook review.
- PBUI/CLIM React uses it through concrete presentation profiles such as `style-profile.yaml`, `surfaces.yaml`, and `presentation-bindings.yaml`.

Do not place concrete Web component rules or CLIM shell rules directly in the shared design-language layer unless they are genuinely reusable across targets.

## Problem Statement

Dense operational applications must show many related facts at once: records, events, state changes, identifiers, actors, timestamps, metrics, relations, commands, and details. If the UI uses conventional marketing/product visual language — large cards, high-radius surfaces, bright accents, oversized typography, heavy shadows — it becomes visually expensive and reduces scanability.

The desired UI must instead:

- let users scan many rows without fatigue;
- preserve exact identifiers and timestamps;
- reveal actions without cluttering the resting state;
- express state and priority semantically, not decoratively;
- support both mouse/context-menu interaction and keyboard-first operation;
- provide dense summary and rich detail without changing semantic identity;
- adapt to multiple domains while preserving information-design discipline.

## Design Archetype

### Name

**Sober Dense Operational UI**

Alternative names:

- Calm Operational Typography
- Typographic Control Surface
- Dense Information Workbench
- Low-Chrome Operational Console

### Definition

A Sober Dense Operational UI is a high-information application interface where the primary visual material is text, alignment, keylines, compact components, semantic status color, and controlled spacing. It is designed for sustained expert use rather than first-impression delight.

### Core qualities

1. **Information first** — data and actions are the content; chrome recedes.
2. **Typographic hierarchy** — hierarchy comes from size, weight, case, tracking, alignment, and rhythm.
3. **Low visual taxation** — neutral surfaces, modest contrast, few accents, no gratuitous motion.
4. **Dense but breathable** — compact spacing, but enough line-height and grouping to avoid blur.
5. **Semantic color** — color means state, category, selection, or risk; color is not decoration.
6. **Operational affordance** — copy, inspect, filter, open, compare, and act are always available, often revealed progressively.
7. **Keyboard and context fluency** — command palette, table navigation, right-click menus, and typed argument filling are first-class.

## Foundational Design Ranges

These are ranges for the archetype, not yet hard values. A concrete design system should choose exact values and then lint against them.

### Typography

Recommended type choices:

- UI sans: Inter, IBM Plex Sans, system UI, or similarly neutral sans.
- UI mono: Berkeley Mono, IBM Plex Mono, JetBrains Mono, SF Mono, or similar high-legibility mono.
- A mono-only theme is acceptable when the product wants a console/workbench feel.
- A sans+mono pairing is acceptable when the product needs more conventional business readability.

Recommended type scale:

| Role | Range | Weight | Notes |
| --- | --- | --- | --- |
| Micro / metadata | 11-12px | 400-500 | IDs, timestamps, keyboard hints, secondary labels |
| Body / row text | 12-14px | 400 | Main dense reading size |
| Emphasis / section | 13-16px | 500-600 | Section titles, row primary labels |
| Page title / display | 16-20px | 500-600 | Rare; avoid oversized dashboard titles |
| Numeric / code | 11-13px mono | 400-500 | Tabular figures, exact values |

Line-height:

- dense rows: 1.25-1.35;
- normal body: 1.35-1.5;
- titles: 1.15-1.25.

Case and tracking:

- Use uppercase micro labels sparingly for table headers, rails, category labels, and badges.
- Tracking range for uppercase micro labels: `0.04em` to `0.08em`.
- Body text should use normal tracking.

Hard-rule candidates for later:

- No more than 5-7 typography roles in a concrete design system.
- Every typography role must have a named semantic purpose.
- IDs, timestamps, code, and numeric columns use tabular figures, preferably mono.

### Spacing and rhythm

Base spacing:

- 2px micro-grid for optical alignment.
- Primary spacing tokens: 2, 4, 8, 12, 16, 24, 32.
- Dense mode uses smaller tokens and tighter row heights, but not collapsed line-height.

Recommended row heights:

| Surface | Dense | Regular |
| --- | --- | --- |
| Log/event row | 22-26px | 28-32px |
| Table row | 24-30px | 32-40px |
| Command item | 28-34px | 36-44px |
| Detail field row | 22-28px | 30-36px |

Grouping rules:

- Use spacing to show section grouping before adding boxes.
- Prefer hairline dividers and alignment over filled cards.
- Allow occasional negative/compact grouping in streams, but detail panels need more breathing room.

### Shape, borders, and elevation

- Border width: 1px hairline by default; 0.5px acceptable on high-DPI targets.
- Radius: 0-4px. Avoid large pill/card radii unless the specific theme requires it.
- Elevation: none by default. Use subtle shadows only for floating surfaces: menus, popovers, command palette.
- Surface separation should come from keylines, tint shifts, and spacing before shadows.

Hard-rule candidates for later:

- No heavy drop shadows on static panels.
- No decorative border gradients.
- Floating surfaces may use shadow; persistent content surfaces should usually not.

### Color

Base palette:

- Neutral background: subtle cool grey, neutral grey, white panel, or muted light surface. No decorative background noise.
- Primary text: near-black or high-contrast dark gray.
- Secondary text: 60-75% perceived intensity of primary text.
- Muted metadata: 45-60% perceived intensity.
- Dividers/keylines: 8-16% black or equivalent neutral contrast.

Semantic color:

- Use color for state, category, selection, risk, and attention.
- Prefer desaturated accessible accents.
- Pair color with text labels/icons; never rely on color alone.

Recommended semantic roles:

- `neutral`
- `info`
- `success`
- `warning`
- `danger`
- `pending`
- `muted`
- `selected`
- `active`

Color usage rules:

- Resting UI should be mostly neutral.
- A dense table should not look like a heatmap unless the explicit task is heatmap analysis.
- Status color belongs inside badges, small markers, left borders, or token text, not broad backgrounds.
- Selection may use a low-chroma fill plus text/icon change.

### Density modes

The factory should support density as a tokenized axis.

```yaml
density_modes:
  compact:
    row_height: 24
    cell_x: 6
    cell_y: 3
    font_body: 12
  regular:
    row_height: 32
    cell_x: 8
    cell_y: 5
    font_body: 13
  spacious:
    row_height: 40
    cell_x: 12
    cell_y: 8
    font_body: 14
```

Density should not be ad hoc per widget. It should be a design-language input consumed by all row, table, token, menu, and panel primitives.

## Layout Archetypes

### 1. App frame

Default structure:

```text
left rail / top toolbar / main work area / optional right detail drawer / status footer
```

Rules:

- Navigation chrome should be narrow and quiet.
- Primary work area receives most horizontal space.
- Right detail drawer can pin, resize, or collapse.
- Global status/connection/activity indicators belong in a compact footer or top utility strip.

### 2. Master-detail

Default for operational systems.

```text
Dense list/table/stream (60-75%) + detail drawer/panel (25-40%)
```

Rules:

- Selecting any row/presentation can open details without losing list context.
- Detail panels use more spacing than streams.
- Details should preserve copyable identifiers, state history, related links, and action surfaces.

### 3. Dense stream

For logs, events, scans, lifecycle updates, sensor records.

Rules:

- Use stable columns for timestamp, type/level/state, source/actor, message/summary, and optional details.
- Inline semantic tokens must be selectable and action-aware.
- Rows should be virtualizable.
- Hover reveals row-local actions.
- Selection and focus must be visually distinct but not loud.

### 4. Dense table

For work items, orders, jobs, inventory, processes.

Rules:

- Headers are compact, often uppercase micro-labels.
- Numeric/time/code columns use monospace and tabular alignment.
- Status uses badges or compact state cells.
- Inline references use compact reference presentations.
- Column resize/reorder/sort/filter are expected for advanced apps.

### 5. Process/timeline panel

For workflows, routes, execution phases, incident windows.

Rules:

- Show ordered state/step progression.
- Use a compact visual grammar: line, dot, tick, badge, timestamp.
- Avoid illustrative timeline art; keep it operational.
- Support collapsed summary and expanded step detail.

### 6. Command/action palette

For keyboard-first action discovery.

Rules:

- Text-heavy, fast filtering, keyboard hints right-aligned.
- Shows action name, accepted type/archetype, short description.
- Can begin with no selection or with current selected presentation as context.
- Supports argument collection by selecting matching on-screen presentations.

## Component Archetypes

### Presentation token

Compact inline rendering of a semantic object, projection, relation, state, or metric.

Rules:

- Small, text-first, low padding.
- Can be clickable/selectable when semantic type/capability supports actions.
- Carries data attributes for archetype/capability/domain type.
- Supports hover/copy/context menu affordances.

### Compact reference

Used for Actor, WorkItem, Resource, Relation endpoints.

Rules:

- Shows label and/or id.
- Uses middle truncation for long identifiers.
- Exposes copy and inspect actions.
- May include tiny status marker if `stateful`.

### Status badge

Presentation of `stateful` capability.

Rules:

- Text label is mandatory.
- Color reinforces the label.
- Shape is compact, low-radius, no glossy styling.
- Badge tone is derived from state mapping.

### Dense row

Presentation of Event, WorkItem, Resource, or domain-specific record.

Rules:

- Row must expose stable identity and inspect action.
- Row content is tokenized where possible.
- Row supports hover actions but does not display all actions at rest.
- Row supports focus and keyboard activation.

### Detail panel

Expanded inspection surface.

Rules:

- Uses sections separated by spacing/keylines.
- Presents key-value fields with copy affordances.
- Shows related objects as compact references.
- Shows actions in a predictable toolbar/footer.
- Does not become a modal unless blocking decision is required.

### Filter chip

Persistent representation of query state.

Rules:

- Includes field, operator, value.
- Compact, removable, keyboard focusable.
- Values are rendered using the same presentation registry when possible.

### Metric cell

Presentation of measurable/aggregatable values.

Rules:

- Right-align comparable numbers.
- Use units explicitly.
- Align decimals.
- Use tiny trend/sparkline only when useful, not decorative.

## Interaction Affordances

### Keyboard-first behavior

Required interaction patterns for concrete systems:

- Global command palette: `Ctrl/Cmd+K`.
- Table/list navigation: arrow keys, PageUp/PageDown, Home/End.
- Copy current token/row id: single shortcut where possible.
- Open detail: Enter or dedicated shortcut.
- Context action menu: keyboard accessible.
- Escape closes transient surfaces in predictable order.

### Context menus and typed actions

Rules:

- Right-click/keyboard context menu opens actions valid for the selected presentation's domain type, archetypes, and capabilities.
- Action labels start with verbs.
- If an action requires arguments, the UI should prefer selecting on-screen matching presentations before free-form input.
- The current source selection should be visually marked while collecting arguments.

### Hover reveal

Rules:

- Utility controls (copy, inspect, filter, open) may appear on hover/focus.
- Never hide critical state or identity information behind hover.
- Hover controls must also be keyboard reachable.

### Progressive disclosure

Rules:

- Dense rows show summary; detail panels show complete content.
- Payloads, JSON, stack traces, long notes, and histories default collapsed with size/count indicators.
- Expansion should preserve scroll and selection context.

### Selection and focus

Rules:

- Focus is always visible.
- Selection should be calmer than error/alert state.
- Multi-selection supports bulk action surfaces.
- Active context for action argument collection should be distinct from ordinary selection.

## Presentation-Based UI Implications

The design archetype must make semantic representations visible but not noisy.

Every selectable presentation should carry:

```yaml
presentation_runtime_attributes:
  domain_type: string
  archetypes: string[]
  capabilities: string[]
  presentation_id: string
  semantic_id: string
  label: string
  copy_value: string optional
```

Visual rules:

- Not every semantic object needs a border/chip. Inline text can still be a presentation.
- Clickability can be indicated by underline-on-hover, cursor, subtle weight, or context availability.
- Dense views should avoid turning every token into a colorful pill.
- Selected or argument-candidate tokens may temporarily gain stronger background/contrast.

## Theming Knobs for the Factory

A concrete design system should instantiate these knobs:

```yaml
theme_axes:
  density:
    values: [compact, regular, spacious]
  neutral_tone:
    values: [subtle_cool_gray, neutral_gray, white_panel, dark_console]
  type_mode:
    values: [mono_only, sans_with_mono, sans_only_with_tabular]
  radius:
    values: [square, slight]
  row_treatment:
    values: [plain, striped, ruled, banded]
  surface_separation:
    values: [spacing, keyline, tint, subtle_shadow]
  accent_strategy:
    values: [single_primary, semantic_status_only, category_palette]
```

The factory should allow variation along these axes while preserving the archetype constraints.

## From Ranges to Hard Rules

This document deliberately uses ranges. A concrete design system generated from it must choose hard values.

Example concrete hardening step:

```yaml
typography:
  roles:
    body:
      font: ui-sans
      size: 13
      weight: 400
      line_height: 1.4
    code:
      font: ui-mono
      size: 12
      weight: 400
      line_height: 1.35
    label:
      font: ui-sans
      size: 11
      weight: 600
      transform: uppercase
      tracking: 0.06em
    title:
      font: ui-sans
      size: 16
      weight: 600
      line_height: 1.2

density:
  compact:
    row_height: 24
    cell_padding_x: 6
    cell_padding_y: 3

borders:
  default_width: 1
  radius: 2

color:
  background: "#f7f7f4"
  text_primary: "#171717"
  text_secondary: "#5f5f5a"
  divider: "rgba(0,0,0,0.12)"
```

Once hard values exist, linting can check:

- unauthorized font sizes;
- unauthorized font weights;
- raw colors not mapped to design tokens;
- status colors used outside semantic state/category contexts;
- unapproved border radii/shadows;
- widgets that use local spacing instead of density tokens.

## Concrete Outputs This Document Should Produce

1. `design-language.yaml`
   - typography roles;
   - density modes;
   - color semantics;
   - spacing scale;
   - border/radius/elevation rules;
   - presentation-state styles;
   - interaction-state styles.

2. Generated helpers
   - `typography.ts`
   - `density.ts`
   - `tokens.ts`
   - `presentationStyles.ts`
   - `actionStyles.ts`
   - `dataAttributes.ts`

3. Lint rules
   - no raw color literals;
   - no unauthorized type roles;
   - no ad hoc status badges;
   - no local density constants;
   - no heavy shadows on static surfaces;
   - no hidden hover-only critical actions.

4. Playbook rules
   - how to instantiate the design archetype for a concrete domain;
   - how to choose hard tokens from the ranges;
   - how to promote generated widget scaffolds without violating the design archetype;
   - how to audit visual drift.

## Open Questions

1. Should the default concrete instance be mono-only or sans+mono?
2. Should dark mode be a first-class archetype variant or a later theme?
3. How subtle should the neutral background contrast/temperature be before it starts competing with dense operational content?
4. Which components require minimum hit targets that conflict with dense row heights, and how should the design reconcile them?
5. Should row striping be a theme knob or a data-density requirement?
6. How strict should presentation token affordances be: underline-on-hover, background-on-hover, explicit chip, or configurable by density/theme?
