---
Title: Generic Widget Baseline for Dense Operational Design Systems
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
    - Path: dmeta/sources/dmeta-ir/03-widgets.yaml
      Note: Current DMETA widget IR compared against Hair Booking generic helper widgets
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/03-shell-widgets.yaml
      Note: Source Hair Booking shell widgets compared for reusable dense-workbench frame primitives
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/05-layout-widgets.yaml
      Note: Source Hair Booking layout helpers compared against DMETA baseline gaps
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/06-resource-widgets.yaml
      Note: Source table/cell/bulk/pagination helpers compared to DMETA DenseTable needs
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/07-data-display-widgets.yaml
      Note: Source state/data-display helpers used to identify empty/loading/error/key-value/comparison baseline widgets
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/10-form-widgets.yaml
      Note: Source form widgets used to identify DMETA action-parameter form and field grouping baseline
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/10a-form-field-widgets.yaml
      Note: Source concrete field widgets used to define baseline input controls and optional domain-specific fields
    - Path: hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/11-surface-widgets.yaml
      Note: Source overlay and confirmation widgets used to identify required action/detail surfaces
ExternalSources: []
Summary: Compares the Hair Booking Admin DSL widget IR against the DMETA v0 widget IR and proposes a reusable baseline of widgets that should exist in most dense operational/log/agent/workflow/table design systems.
LastUpdated: 2026-05-19T23:05:00-04:00
WhatFor: Use this document when deciding which generic helper widgets belong in the default DMETA widget catalog rather than in a domain-specific package.
WhenToUse: Use before expanding dmeta/sources/dmeta-ir/03-widgets.yaml, scaffolding a widget library, or reviewing whether a new design system has enough shell/layout/action/state/form primitives.
---



# Generic Widget Baseline for Dense Operational Design Systems

## Executive Summary

The Hair Booking Admin DSL widget IR contains a broad set of generic helper widgets that are not actually hair-booking-specific. Many of them are reusable primitives for any dense operational UI: shells, page headers, panels, toolbars, split panes, tabs, filters, search, action buttons, tables, cell renderers, detail surfaces, empty/loading/error states, and confirmation dialogs.

DMETA's current widget IR is more semantically ambitious but much narrower. It already defines dense-operational semantic widgets such as `PresentationToken`, `DenseTable`, `RecordStream`, `DetailDrawer`, and `ActionPalette`. What it does not yet define is the ordinary but essential scaffolding around those widgets: the app/workbench shell, panel surfaces, page-level headers, filter/search controls, pagination, bulk actions, empty/loading/error states, form controls, and confirmation surfaces.

The recommended baseline is therefore a two-layer catalog:

1. **Semantic dense-operational widgets** that DMETA already started: presentation tokens, compact references, metric cells, record streams, dense tables, detail drawers, and action palettes.
2. **Always-present helper widgets** derived from Hair Booking: shell/layout/action/data-state/form/surface primitives that every generated design system should have, even when the domain is logs, agents, workflows, events, or tables rather than salon administration.

These helper widgets should be neutral, low-chrome, texture-free, and adapter-boundary-safe. They should not parse source DSL JSON directly. They should receive normalized view models and emit typed callbacks. The design-system factory should treat them as the boring infrastructure that lets the semantic widgets operate consistently.

## Problem Statement

DMETA currently knows how to talk about semantic presentations and actions, but a usable dense application also needs generic UI infrastructure. Without a baseline helper catalog, each generated design system will rediscover the same components:

- a workbench shell;
- page and panel surfaces;
- toolbars and action groups;
- search, filters, tabs, and split panes;
- dense table support such as cells, bulk bars, and pagination;
- empty/loading/error states;
- confirmation and overlay surfaces;
- forms for action parameters, filters, and object editing.

The Hair Booking Admin DSL IR accidentally provides a useful inventory of these generic pieces. Although it was extracted from a concrete admin app, many widgets are domain-neutral. The question is which of those widgets should graduate into DMETA as an always-available starter kit for dense operational/log/agent/workflow/event/table design systems.

## Comparison Snapshot

### Current DMETA widget IR

`dmeta/sources/dmeta-ir/03-widgets.yaml` currently defines eight draft widgets:

- `PresentationToken` — inline selectable semantic presentation.
- `StatusBadge` — compact state presentation.
- `CompactReference` — compact id/label/reference renderer.
- `MetricCell` — numeric/unit value renderer.
- `RecordStream` — virtualizable ordered events/work items/action invocations.
- `DenseTable` — presentation-aware dense table.
- `DetailDrawer` — inspection surface for a selected semantic subject.
- `ActionPalette` — typed action discovery and argument collection.

This is a strong semantic core. It maps well to logs, events, agent runs, workflow tasks, resources, metrics, and operational tables. It does not yet define the surrounding application frame and generic support widgets.

### Hair Booking Admin DSL widget categories

The Hair Booking IR defines these categories:

- Shell widgets: `WorkbenchShell`, `DefaultAdminShell`.
- Action widgets: `ActionButton`, `ActionGroup`, `OverflowActionButton`.
- Layout widgets: `PageHeader`, `DashboardGrid`, `Panel`, `Toolbar`, `SplitPane`, `Tabs`, `FilterBar`, `SearchBox`.
- Resource widgets: `ResourceTable`, `ResourceTableCell`, `BulkActionBar`, `PaginationBar`.
- Data display widgets: `MetricCard`, `StatusText`, `ComparisonTable`, `KeyValueList`, `ActivityFeed`, `MarkdownBlock`, `EmptyState`, `LoadingState`, `InlineError`.
- Media widgets: `PreviewFrame`, `ImageGrid`, `ImageGallery`.
- Calendar widgets: `MonthCalendar`, `CalendarWeek`, `CalendarEventBlock`.
- Form widgets: `AdminForm`, `FieldGroup`, `SaveBar`.
- Field widgets: `FieldShell`, `TextField`, `TextareaField`, `SelectField`, `SwitchField`, `DateField`, `TimeField`, `MoneyField`, `DurationField`, `ImageField`.
- Surface widgets: `OverlaySurface`, `ConfirmDialog`.

The generic value is concentrated in shell, action, layout, resource/table, data-state, form, field, and surface categories. Media and calendar widgets are useful optional domain packs, not mandatory baseline widgets for every dense operational design system.

## Proposed Solution

DMETA should define an **Always-Present Dense Operations Widget Baseline**. These widgets should be available in every generated dense operational design system, even if the first application only uses a subset. They are the stable contract that lets generated pages, generated Storybook stories, and app adapters compose consistent UIs.

### Tier 0: Already in DMETA and should remain always-present

These are the semantic atoms/organisms that make DMETA distinct from a generic admin kit:

1. **PresentationToken**
   - Required because every dense UI needs inline semantic references in logs, tables, timelines, command outputs, and action arguments.
   - Hair Booking analogue: `StatusText`, `ResourceTableCell`, and small inline value renderers, but DMETA's version is more semantic.

2. **StatusBadge**
   - Required for work item state, action invocation state, event severity, queue status, retry/cancel state, and workflow state.
   - Hair Booking analogue: `StatusText`.

3. **CompactReference**
   - Required for actors, resources, work items, tool runs, trace ids, shipment ids, task ids, and related objects.
   - Hair Booking analogue: table/reference cells.

4. **MetricCell**
   - Required for duration, latency, count, rate, cost, queue depth, and comparison-oriented operational values.
   - Hair Booking analogue: `MetricCard` and table metric cells.

5. **RecordStream**
   - Required for logs, events, traces, action histories, tool runs, audit feeds, and workflow step streams.
   - Hair Booking analogue: `ActivityFeed`, but DMETA should keep it more virtualizable and presentation-aware.

6. **DenseTable**
   - Required for resources, work items, actors, runs, metrics, queues, incidents, and event summaries.
   - Hair Booking analogue: `ResourceTable`.

7. **DetailDrawer**
   - Required because dense UIs should preserve list/table context while inspecting a selected object.
   - Hair Booking analogue: `OverlaySurface`, `Panel`, and detail panel branches.

8. **ActionPalette**
   - Required because DMETA has typed actions and presentation-based argument selection.
   - Hair Booking analogue: `ActionGroup`, `ActionButton`, `OverflowActionButton`, and command-like admin actions.

### Tier 1: Must add to DMETA baseline

These widgets should become first-class DMETA widget IR entries because almost every dense operational design system needs them.

#### 1. WorkbenchShell

Derived from Hair Booking `WorkbenchShell`.

Purpose in DMETA: provide the global app/workbench frame for dense tools: sidebar or rail navigation, topbar, workspace title, optional user/session indicator, main content region, and responsive behavior.

Why always-present:

- Logs, agents, workflows, tables, and operational consoles all need a frame.
- Generated page examples need somewhere to live.
- It gives design systems a consistent density/background/content-width policy.

DMETA-specific adaptation:

- Rename from `AdminShell` to `WorkbenchShell` or `DenseWorkbenchShell`.
- Keep it domain-neutral: no admin-specific vocabulary.
- Support quiet navigation, global action palette affordance, current workspace/environment, and optional connection/status indicators.

#### 2. PageHeader

Derived from Hair Booking `PageHeader`.

Purpose in DMETA: own page title, subtitle/description, breadcrumbs or context path, primary actions, and high-level status.

Why always-present:

- Every generated screen needs a title and high-level action location.
- It prevents ad hoc header layout from leaking into each page.
- It gives generated docs and stories a consistent entry point.

DMETA-specific adaptation:

- Add optional semantic context refs: current resource, current workflow, current actor, current environment.
- Primary actions should be `ActionDefinition`/`ActionViewModel`-driven.

#### 3. Panel

Derived from Hair Booking `Panel`.

Purpose in DMETA: the basic bounded content surface for dense sections: table panels, stream panels, summary panels, detail sections, inspector sections, and parameter forms.

Why always-present:

- Dense apps need repeated, quiet grouping without decorative chrome.
- Panel standardizes header/body/footer density, padding, dividers, and action placement.
- It is the common container for tables, charts, logs, key-value lists, and forms.

DMETA-specific adaptation:

- Low-chrome cool-neutral surface.
- Density modes: compact, normal, relaxed.
- Optional header actions and status slots.

#### 4. Toolbar / ActionGroup / ActionButton

Derived from Hair Booking `Toolbar`, `ActionGroup`, and `ActionButton`.

Purpose in DMETA: render context-appropriate actions in page headers, panels, rows, filters, bulk bars, and detail surfaces.

Why always-present:

- Typed actions need visual affordances outside the command palette.
- Every table and detail surface needs consistent action placement.
- Primary/danger/subtle/loading/disabled treatments must be uniform.

DMETA-specific adaptation:

- Keep `ActionButton` as the leaf.
- Use `ActionGroup` for a list of actions in a known slot.
- Use `Toolbar` for layout plus optional search/filter/action composition.
- Wire actions to generated `ActionDefinition` metadata where possible.

#### 5. OverflowActionButton / ContextMenuTrigger

Derived from Hair Booking `OverflowActionButton`.

Purpose in DMETA: expose secondary row/cell/token actions without increasing table or stream noise.

Why always-present:

- Dense rows cannot show every action inline.
- Presentation tokens and compact references need context menus.
- Agent/workflow UIs often have inspect/copy/retry/cancel/open-related actions per object.

DMETA-specific adaptation:

- Rename to `ContextMenuTrigger` or `OverflowActionTrigger`.
- The trigger should accept a `PresentationRef` and candidate actions.
- It should integrate with action matching helpers generated by `dmeta generate-core`.

#### 6. SplitPane

Derived from Hair Booking `SplitPane`.

Purpose in DMETA: master/detail, stream/detail, table/inspector, timeline/detail, and compare layouts.

Why always-present:

- Dense operational UIs often require simultaneous context and inspection.
- It supports the primary list-table-stream plus detail surface pattern.
- It avoids ad hoc CSS grid definitions in generated screens.

DMETA-specific adaptation:

- Support resizable/collapsible secondary pane as a later enhancement.
- Provide responsive stacking behavior.

#### 7. Tabs / SegmentedControl

Derived from Hair Booking `Tabs`.

Purpose in DMETA: switch between related views, slices, severity groups, event categories, execution phases, or detail sections.

Why always-present:

- Workflows and logs frequently need compact view switching.
- Detail panels often have tabs for summary, payload, related, history, and actions.
- Filter bars and tabs should be distinct contracts.

DMETA-specific adaptation:

- Keep `Tabs` for navigation among surfaces.
- Add or derive `SegmentedControl` for small mutually-exclusive mode selection.

#### 8. FilterBar

Derived from Hair Booking `FilterBar`.

Purpose in DMETA: display and change active filters as chips/pills/toggles.

Why always-present:

- Logs, tables, workflow queues, and event streams are unusable without filters.
- State, actor, resource, severity, time window, and source filters are central operational interactions.
- Filter controls should be semantically different from tabs and actions.

DMETA-specific adaptation:

- Filters should be typed around capabilities and presentations when possible.
- It should support active filter chips and quick filter groups.

#### 9. SearchBox

Derived from Hair Booking `SearchBox`.

Purpose in DMETA: query records, resources, events, and visible surfaces.

Why always-present:

- Dense operational systems need quick text narrowing.
- Search is often colocated with filter and toolbar controls.
- It should have consistent keyboard and submit behavior.

DMETA-specific adaptation:

- Support query scope labels: current table, current stream, all events, selected workflow.
- Support command-palette handoff later, but keep search separate from action discovery.

#### 10. ResourceTableCell / PresentationCell

Derived from Hair Booking `ResourceTableCell`.

Purpose in DMETA: localize cell-kind rendering so `DenseTable` does not become a pile of conditional JSX.

Why always-present:

- Dense tables need specialized cells: compact ref, status, metric, timestamp, relation, action, text, boolean, severity.
- Cell rendering is a registry problem, not table layout logic.
- It is the bridge between core presentations and a table component.

DMETA-specific adaptation:

- Rename to `PresentationCell` or `DenseTableCell`.
- Consume `PresentationRef` and `PresentationId`.
- Delegate to `PresentationToken`, `StatusBadge`, `MetricCell`, and `CompactReference`.

#### 11. BulkActionBar

Derived from Hair Booking `BulkActionBar`.

Purpose in DMETA: expose selected/visible row actions in tables and streams.

Why always-present:

- Operational users often act on selected work items, events, resources, or runs.
- Bulk action UI needs a consistent hierarchy and confirmation path.
- It prevents bulk controls from being mixed into row action logic.

DMETA-specific adaptation:

- Accept selected `PresentationRef[]` and matching bulk `ActionDefinition[]`.
- Show count, scope, and destructive-action confirmations.

#### 12. PaginationBar / ResultWindowControls

Derived from Hair Booking `PaginationBar`.

Purpose in DMETA: control paginated, cursor, or windowed result sets.

Why always-present:

- Tables and event queries often require paging/windowing even when streams are virtualized.
- Backend APIs may expose cursor windows rather than complete lists.
- It standardizes result count, cursor state, and next/previous affordances.

DMETA-specific adaptation:

- Generalize from page numbers to `ResultWindowControls` supporting page, cursor, and live-tail modes.

#### 13. EmptyState, LoadingState, InlineError

Derived from Hair Booking `EmptyState`, `LoadingState`, and `InlineError`.

Purpose in DMETA: standardize non-happy-path states inside panels, tables, streams, drawers, and forms.

Why always-present:

- Generated apps otherwise handle loading/error/empty states inconsistently.
- Dense UIs need quiet but clear status when no events match filters, backend calls fail, or data is loading.
- These states are part of the design language, not incidental page code.

DMETA-specific adaptation:

- Include variants for no data, no filtered results, permission denied, disconnected, stale data, and backend error.
- Keep the styling sober: no decorative illustrations by default.

#### 14. KeyValueList

Derived from Hair Booking `KeyValueList`.

Purpose in DMETA: display structured properties in detail drawers, panels, inspectors, and comparison views.

Why always-present:

- Every resource/work item/run/event has attributes.
- Detail views need a compact key-value primitive.
- It can render values through `PresentationToken`/`PresentationCell` rather than plain strings.

DMETA-specific adaptation:

- Support grouped sections and copyable values.
- Support semantic value renderers.

#### 15. ComparisonTable

Derived from Hair Booking `ComparisonTable`.

Purpose in DMETA: compare metrics, resources, candidates, runs, versions, or before/after states.

Why usually baseline:

- Dense operational work often involves comparison.
- DMETA already has a `compare_metrics` action.
- The widget is generic if it is value/presentation-driven.

DMETA-specific adaptation:

- It can be Tier 1 or Tier 2 depending on implementation capacity.
- It should support metric and key-value comparison first, not arbitrary rich diffing.

#### 16. OverlaySurface and ConfirmDialog

Derived from Hair Booking `OverlaySurface` and `ConfirmDialog`.

Purpose in DMETA: modal/drawer/sheet host surfaces and confirmation flows.

Why always-present:

- Action execution, destructive operations, retries, cancellations, and parameter forms need confirmation or overlay containment.
- Details may appear as drawers; focused forms may appear as dialogs.
- The action system needs a safe place to collect arguments and confirmations.

DMETA-specific adaptation:

- `DetailDrawer` remains the semantic inspector; `OverlaySurface` is the lower-level surface primitive.
- `ConfirmDialog` should accept generated action metadata and typed consequences.

#### 17. ActionParameterForm / Form / FieldGroup / FieldShell / Basic Fields

Derived from Hair Booking `AdminForm`, `FieldGroup`, `SaveBar`, `FieldShell`, and field widgets.

Purpose in DMETA: collect typed action arguments, filter parameters, schedule parameters, and object-edit data.

Why always-present, but scoped:

- Agent/workflow UIs need typed action invocation, not only display.
- `ActionPalette` needs a way to collect parameters.
- Filters often need text/select/date/time/duration fields.

DMETA-specific adaptation:

- Do not frame this as a full CRUD form system initially.
- Define a smaller baseline: `ActionParameterForm`, `FieldGroup`, `FieldShell`, `TextField`, `TextareaField`, `SelectField`, `SwitchField`, `DateTimeField`, `DurationField`, `NumberField`.
- Keep `MoneyField` and `ImageField` out of the default baseline unless a domain needs them.

### Tier 2: Useful but not mandatory in every baseline

These Hair Booking widgets should be optional packs or later additions.

#### DashboardGrid / SummaryGrid

Useful for dashboards and overview pages, but not essential for every log/event/table-first design system. If added, rename or generalize it to `SummaryGrid` or `ResponsiveGrid`.

#### MetricCard

Useful for dashboards and summary panels. DMETA already has `MetricCell`; a larger `MetricCard` should be optional or Tier 2 unless overview dashboards are a first-class target.

#### MarkdownBlock

Useful for documentation, explanations, runbooks, and AI/tool outputs. It is generic, but it introduces markdown rendering and sanitization concerns. It should be a baseline-adjacent utility, not required for the first widget scaffold.

#### ActivityFeed

Hair Booking `ActivityFeed` overlaps with DMETA `RecordStream`. DMETA should not add a second feed primitive unless it is just a lighter wrapper around `RecordStream`.

#### PreviewFrame

Useful for rendered artifacts, documents, external previews, screenshots, or web previews. It applies to agent/tooling systems, but not every dense operational UI needs it.

#### Calendar widgets

`MonthCalendar`, `CalendarWeek`, and `CalendarEventBlock` are domain-specific optional packs. They matter for scheduling systems, not generic log/agent/workflow/event/table systems.

#### Media widgets

`ImageGrid`, `ImageGallery`, and `ImageField` are optional media/domain packs. They should not be part of the always-present dense operations baseline.

#### MoneyField

Domain-specific numeric field. It belongs in a commerce/finance pack, not the core baseline.

## Recommended DMETA Baseline Catalog

The next DMETA widget IR expansion should group widgets into packages instead of keeping a single flat file. A recommended structure:

```text
sources/dmeta-ir/widgets/
  shell.yaml
  layout.yaml
  actions.yaml
  presentations.yaml
  tables.yaml
  streams.yaml
  surfaces.yaml
  forms.yaml
  states.yaml
  optional-dashboard.yaml
  optional-markdown-preview.yaml
```

### Baseline widgets to define

#### Shell

- `dmeta.shell.workbench` / `WorkbenchShell`

#### Layout

- `dmeta.layout.page_header` / `PageHeader`
- `dmeta.layout.panel` / `Panel`
- `dmeta.layout.toolbar` / `Toolbar`
- `dmeta.layout.split_pane` / `SplitPane`
- `dmeta.layout.tabs` / `Tabs`
- `dmeta.layout.filter_bar` / `FilterBar`
- `dmeta.layout.search_box` / `SearchBox`

#### Actions

- `dmeta.action.action_button` / `ActionButton`
- `dmeta.action.action_group` / `ActionGroup`
- `dmeta.action.context_menu_trigger` / `ContextMenuTrigger`
- Existing `dmeta.action_palette` / `ActionPalette`

#### Semantic presentations

- Existing `dmeta.presentation_token` / `PresentationToken`
- Existing `dmeta.status_badge` / `StatusBadge`
- Existing `dmeta.compact_reference` / `CompactReference`
- Existing `dmeta.metric_cell` / `MetricCell`
- Add `dmeta.presentation_cell` / `PresentationCell`
- Add `dmeta.timestamp_cell` / `TimestampCell` or keep as a `PresentationCell` variant

#### Tables and result sets

- Existing `dmeta.dense_table` / `DenseTable`
- Add `dmeta.table.bulk_action_bar` / `BulkActionBar`
- Add `dmeta.table.result_window_controls` / `ResultWindowControls`

#### Streams and timelines

- Existing `dmeta.record_stream` / `RecordStream`
- Optional later: `TimelineLane`, `TimelineSpanBlock` if workflow/timeline layouts become first-class.

#### Detail and surfaces

- Existing `dmeta.detail_drawer` / `DetailDrawer`
- Add `dmeta.surface.overlay_surface` / `OverlaySurface`
- Add `dmeta.surface.confirm_dialog` / `ConfirmDialog`

#### Data display and states

- Add `dmeta.data.key_value_list` / `KeyValueList`
- Add `dmeta.data.comparison_table` / `ComparisonTable`
- Add `dmeta.state.empty_state` / `EmptyState`
- Add `dmeta.state.loading_state` / `LoadingState`
- Add `dmeta.state.inline_error` / `InlineError`

#### Forms

- Add `dmeta.form.action_parameter_form` / `ActionParameterForm`
- Add `dmeta.form.field_group` / `FieldGroup`
- Add `dmeta.form.field_shell` / `FieldShell`
- Add `dmeta.form.text_field` / `TextField`
- Add `dmeta.form.textarea_field` / `TextareaField`
- Add `dmeta.form.select_field` / `SelectField`
- Add `dmeta.form.switch_field` / `SwitchField`
- Add `dmeta.form.datetime_field` / `DateTimeField`
- Add `dmeta.form.duration_field` / `DurationField`
- Add `dmeta.form.number_field` / `NumberField`

## Mapping Table

| Hair Booking widget | DMETA recommendation | Baseline? | Notes |
|---|---|---:|---|
| `WorkbenchShell` | `WorkbenchShell` / `DenseWorkbenchShell` | Yes | Rename away from admin; include action palette/nav/status affordances. |
| `DefaultAdminShell` | Optional `DefaultShell` | No | Less relevant for dense workbench-first systems. |
| `ActionButton` | `ActionButton` | Yes | Leaf action renderer for generated `ActionDefinition`/view models. |
| `ActionGroup` | `ActionGroup` | Yes | Required for page/panel/row/bulk action groups. |
| `OverflowActionButton` | `ContextMenuTrigger` | Yes | Needed for row/token secondary actions. |
| `PageHeader` | `PageHeader` | Yes | Page identity and primary action location. |
| `DashboardGrid` | `SummaryGrid` / `ResponsiveGrid` | Optional | Useful for dashboard overviews, not every workflow/log UI. |
| `Panel` | `Panel` | Yes | Fundamental low-chrome grouping surface. |
| `Toolbar` | `Toolbar` | Yes | Search/filter/action composition. |
| `SplitPane` | `SplitPane` | Yes | Master/detail and table/inspector layouts. |
| `Tabs` | `Tabs` / `SegmentedControl` | Yes | View/detail switching. |
| `FilterBar` | `FilterBar` | Yes | Core to logs/tables/events. |
| `SearchBox` | `SearchBox` | Yes | Core to dense narrowing. |
| `ResourceTable` | Existing `DenseTable` | Yes | DMETA version should stay presentation-aware. |
| `ResourceTableCell` | `PresentationCell` / `DenseTableCell` | Yes | Must keep table rendering modular. |
| `BulkActionBar` | `BulkActionBar` | Yes | Needed for selected presentations. |
| `PaginationBar` | `ResultWindowControls` | Yes | Generalize to cursor/window/live-tail. |
| `MetricCard` | `MetricCard` / `SummaryMetric` | Optional | Keep `MetricCell` baseline; card can be dashboard pack. |
| `StatusText` | Existing `StatusBadge` plus `StatusText` variant | Mostly | Badge is baseline; plain text status can be a variant. |
| `ComparisonTable` | `ComparisonTable` | Yes-ish | Important because DMETA has comparison actions; can be Tier 1.5. |
| `KeyValueList` | `KeyValueList` | Yes | Essential for inspectors/details. |
| `ActivityFeed` | Existing `RecordStream` | No separate widget | Avoid duplicate feed concept. |
| `MarkdownBlock` | `MarkdownBlock` | Optional | Useful for docs/tool output; sanitization concern. |
| `EmptyState` | `EmptyState` | Yes | Required non-happy path state. |
| `LoadingState` | `LoadingState` | Yes | Required async state. |
| `InlineError` | `InlineError` | Yes | Required error state. |
| `PreviewFrame` | `PreviewFrame` | Optional | Useful for agent/tool output previews. |
| `ImageGrid` | Media pack | No | Domain/media-specific. |
| `ImageGallery` | Media pack | No | Domain/media-specific. |
| `MonthCalendar` | Calendar pack | No | Scheduling-specific. |
| `CalendarWeek` | Calendar pack | No | Scheduling-specific. |
| `CalendarEventBlock` | Calendar pack | No | Scheduling-specific. |
| `AdminForm` | `ActionParameterForm` | Yes, narrowed | Focus on typed action/filter parameters first. |
| `FieldGroup` | `FieldGroup` | Yes | Useful in parameter forms/details. |
| `SaveBar` | `FormActionBar` / use `ActionGroup` | Optional | May be action-group slot rather than standalone. |
| `FieldShell` | `FieldShell` | Yes | Required for consistent field label/help/error chrome. |
| `TextField` | `TextField` | Yes | Basic parameter/filter field. |
| `TextareaField` | `TextareaField` | Yes | Longer notes/prompts/payload fragments. |
| `SelectField` | `SelectField` | Yes | Enum and filter choices. |
| `SwitchField` | `SwitchField` | Yes | Boolean parameters. |
| `DateField` / `TimeField` | `DateTimeField` | Yes | Operational time windows and scheduling. |
| `MoneyField` | Domain pack | No | Finance/commerce-specific. |
| `DurationField` | `DurationField` | Yes | Latency, timeout, schedule, SLA, retry windows. |
| `ImageField` | Media pack | No | Domain/media-specific. |
| `OverlaySurface` | `OverlaySurface` | Yes | Base dialog/drawer/sheet primitive. |
| `ConfirmDialog` | `ConfirmDialog` | Yes | Needed for destructive/action execution flows. |

## Design Decisions

### Decision 1: DMETA should not copy Hair Booking wholesale

Hair Booking is an admin CRUD/workbench design system. DMETA targets broader dense operational systems. The useful extraction is not the exact names or all widget categories; it is the layered structure and adapter-boundary discipline.

### Decision 2: Baseline widgets should be generic infrastructure, not domain widgets

Always-present widgets should be useful for logs, events, workflows, agents, tables, queues, and resource operations. Calendar, media, money, and image widgets should be optional packs.

### Decision 3: Semantic widgets and helper widgets need separate mental models

`PresentationToken`, `DenseTable`, `RecordStream`, and `ActionPalette` are semantic DMETA widgets. `Panel`, `Toolbar`, `SearchBox`, and `EmptyState` are helper infrastructure. Both are necessary, but they should not be conflated.

### Decision 4: Helper widgets must preserve adapter boundaries

The Hair Booking IR repeatedly states that widgets should not parse raw Admin DSL JSON or call dispatch helpers directly. DMETA should keep that rule. Widgets receive normalized props and emit typed callbacks; adapters perform transport lowering.

### Decision 5: The baseline should be quiet by default

The target visual language remains sober, low-chrome, cool-neutral, and texture-free. Helper widgets should not introduce illustrative empty states, decorative backgrounds, gradients, paper textures, or high-chrome cards by default.

## Alternatives Considered

### Alternative: Keep DMETA widget IR only semantic

Rejected. A semantic-only catalog creates strong core concepts but weak generated applications. Every app would need bespoke page shells, panels, filters, search, forms, state displays, and confirmation surfaces.

### Alternative: Import all Hair Booking widgets into DMETA

Rejected. Calendar, media, money, and image widgets are not universal. Importing everything would make the core look domain-heavy and distract from the dense operational/log/workflow target.

### Alternative: Treat helper widgets as implementation details outside IR

Rejected. The design-system factory needs to scaffold, document, storybook, and validate helper widgets too. If they are absent from IR, they become unreviewed convention rather than generated design-system source facts.

## Implementation Plan

1. Split `dmeta/sources/dmeta-ir/03-widgets.yaml` into a widget package, similar to the split core model.
2. Add baseline widget subfiles for shell, layout, actions, presentations, tables, streams, surfaces, forms, and states.
3. Preserve existing DMETA semantic widgets and add the recommended helper widgets as draft entries with rich prose.
4. Update the validator to load split widget packages and warn on missing purpose/adapter-boundary/long-description fields.
5. Add a future generator command for widget metadata and Storybook scaffolding.
6. Keep optional packs separate: dashboard, markdown/preview, calendar, media, finance/commerce.

## Open Questions

1. Should `ComparisonTable` be Tier 1 baseline or optional until the `compare_metrics` flow is implemented?
2. Should `DateField` and `TimeField` remain separate, or should DMETA start with a single `DateTimeField` plus `DurationField`?
3. Should `Toolbar` own search/filter layout, or should generated pages compose `SearchBox`, `FilterBar`, and `ActionGroup` directly inside `Panel` headers?
4. Should `OverlaySurface` be a generic primitive in the public widget catalog, or an internal implementation detail behind `DetailDrawer`, `ActionParameterForm`, and `ConfirmDialog`?

## References

- Hair Booking Admin DSL shell widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/03-shell-widgets.yaml`
- Hair Booking Admin DSL layout widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/05-layout-widgets.yaml`
- Hair Booking Admin DSL resource widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/06-resource-widgets.yaml`
- Hair Booking Admin DSL data display widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/07-data-display-widgets.yaml`
- Hair Booking Admin DSL form widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/10-form-widgets.yaml`
- Hair Booking Admin DSL field widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/10a-form-field-widgets.yaml`
- Hair Booking Admin DSL surface widgets: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/hair-booking/ttmp/2026/05/15/HAIR-041--real-admin-backend-for-intake-app/sources/admin-dsl-widget-ir/11-surface-widgets.yaml`
- Current DMETA widget IR: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/03-widgets.yaml`
