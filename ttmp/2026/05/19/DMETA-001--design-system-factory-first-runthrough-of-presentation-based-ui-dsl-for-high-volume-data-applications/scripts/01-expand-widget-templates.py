#!/usr/bin/env python3
"""Expand the global DMETA widget-template catalog.

This script is intentionally stored in the DMETA-001 ticket workspace because it
captures a traceable migration/editing step for the ticket. It rewrites the split
widget-template package with additional selectable/adaptable template categories.
"""

from __future__ import annotations

import yaml
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[6]
TEMPLATE_DIR = ROOT / "sources/dmeta-ir/widget-templates"


def template_meta(
    category: str,
    selection: str = "optional",
    importance: str = "common",
    variants: list[str] | None = None,
    points: list[str] | None = None,
    avoid: list[str] | None = None,
    questions: list[str] | None = None,
    maturity: str = "draft",
) -> dict[str, Any]:
    return {
        "category": category,
        "selection": selection,
        "maturity": maturity,
        "default_importance": importance,
        "selection_questions": questions
        or [
            "Does this concrete instance need this widget behavior, or is it better represented by a domain-specific local template?",
            "Which selected presentations/actions should this template expose?",
        ],
        "adaptation_points": points
        or [
            "component_name",
            "props",
            "stories",
            "presentation_mapping",
            "action_slots",
            "density",
            "empty_state",
        ],
        "common_variants": variants or ["default"],
        "avoid_when": avoid
        or [
            "The instance has no workflow matching this template role.",
            "A more specific local template better expresses the product interaction.",
        ],
    }


def widget(
    id_: str,
    name: str,
    category: str,
    level: str,
    role: str,
    purpose: str,
    consumes: dict[str, Any] | None = None,
    props: dict[str, Any] | None = None,
    slots: dict[str, Any] | None = None,
    stories: list[str] | None = None,
    selection: str = "optional",
    importance: str = "common",
    variants: list[str] | None = None,
    points: list[str] | None = None,
    avoid: list[str] | None = None,
    questions: list[str] | None = None,
) -> dict[str, Any]:
    contract: dict[str, Any] = {
        "props": {
            f"{name}Props": {
                "fields": props or {"subject": {"type": "PresentationRef", "required": True}}
            }
        }
    }
    if slots:
        contract["action_slots"] = slots
    return {
        "id": id_,
        "name": name,
        "status": "template",
        "classification": {"level": level, "role": role},
        "intent": {
            "purpose": purpose,
            "adapter_boundary": "Receives normalized view models and typed semantic refs; emits typed callbacks; does not parse raw backend JSON or own trusted side effects.",
        },
        "template": template_meta(category, selection, importance, variants, points, avoid, questions),
        "consumes": consumes or {},
        "contract": contract,
        "stories": stories or ["default", "selected", "empty"],
        "outputs": {
            "component": f"src/dmeta/widgets/{name}/{name}.tsx",
            "types": f"src/dmeta/widgets/{name}/{name}.types.ts",
            "metadata": f"src/dmeta/widgets/{name}/{name}.metadata.ts",
            "stories": f"src/dmeta/widgets/{name}/{name}.stories.tsx",
            "barrel": f"src/dmeta/widgets/{name}/index.ts",
        },
    }


def write_template_file(filename: str, category: str, summary: str, templates: list[dict[str, Any]]) -> None:
    doc = {
        "schema_version": 0,
        "artifact_type": "dmeta_widget_templates",
        "category": category,
        "summary": summary,
        "long_summary": f"Templates in this file are selectable/adaptable {category} starting points for concrete DMETA instances. They are not mandatory baseline widgets; instance manifests select, rename, specialize, or exclude them.",
        "templates": templates,
    }
    (TEMPLATE_DIR / filename).write_text(yaml.safe_dump(doc, sort_keys=False, width=120))


def load_yaml(path: Path) -> dict[str, Any]:
    return yaml.safe_load(path.read_text())


def save_yaml(path: Path, data: dict[str, Any]) -> None:
    path.write_text(yaml.safe_dump(data, sort_keys=False, width=120))


def build_filters() -> list[dict[str, Any]]:
    return [
        widget(
            "dmeta.filter_bar",
            "FilterBar",
            "filters",
            "molecule",
            "filter_state_control",
            "Render active filter criteria, quick filters, and clear/remove controls for a filterable target.",
            {"archetypes": ["ResultSet", "FilterCriterion"], "capabilities": ["filterable"], "presentations": ["filter_chip", "filter_summary"]},
            {"target": {"type": "FilterTargetRef", "required": True}, "activeFilters": {"type": "FilterExpression[]", "required": True}, "density": {"type": "DensityMode", "required": False}},
            {"onApplyFilter": {"accepts": "FilterActionRequest"}, "onRemoveFilter": {"accepts": "FilterExpression"}, "onClearFilters": {"accepts": "FilterTargetRef"}},
            ["no_filters", "several_filters", "collapsed_many_filters", "keyboard_remove"],
            "common",
            "common",
            ["chip_row", "collapsed_summary", "quick_filters"],
            ["filter_dimensions", "chip_format", "scope", "collapse_behavior", "keyboard_behavior"],
            ["The app has no user-controlled result narrowing."],
        ),
        widget(
            "dmeta.search_box",
            "SearchBox",
            "filters",
            "molecule",
            "search_control",
            "Render scoped text search or autocomplete search for a searchable result target.",
            {"capabilities": ["searchable"], "presentations": ["search_summary", "compact_ref", "inline_token"]},
            {"target": {"type": "FilterTargetRef", "required": True}, "query": {"type": "string", "required": False}, "placeholder": {"type": "string", "required": False}, "suggestions": {"type": "SearchSuggestion[]", "required": False}},
            {"onSearch": {"accepts": "SearchExpression"}, "onChooseSuggestion": {"accepts": "PresentationRef"}, "onClearSearch": {"accepts": "FilterTargetRef"}},
            ["simple_text_query", "autocomplete_suggestions", "scoped_search", "no_results"],
            "optional",
            "common",
            ["simple_text_search", "scoped_search", "autocomplete_entity_search"],
            ["autocomplete_sources", "suggestion_grouping", "query_syntax", "scope_labels", "keyboard_behavior"],
            ["Search is not a primary workflow or fixed filters are sufficient."],
        ),
        widget(
            "dmeta.facet_panel",
            "FacetPanel",
            "filters",
            "molecule",
            "facet_bucket_browser",
            "Render counted facet buckets for a facetable result set and emit facet-filter actions.",
            {"archetypes": ["ResultSet"], "capabilities": ["facetable", "filterable"], "presentations": ["facet_bucket", "filter_summary"]},
            {"target": {"type": "FilterTargetRef", "required": True}, "facets": {"type": "FacetGroup[]", "required": True}},
            {"onApplyFacet": {"accepts": "FilterActionRequest"}},
            ["state_buckets", "actor_buckets", "empty_facets"],
            "optional",
            "common",
            ["side_panel", "inline_group", "compact_counts"],
            ["facet_dimensions", "count_format", "bucket_sorting", "empty_bucket_policy"],
            ["The backend cannot provide facet buckets/counts."],
        ),
        widget(
            "dmeta.result_summary",
            "ResultSummary",
            "filters",
            "atom",
            "result_state_summary",
            "Render result count, active filter/search/window state, and live-tail status for a ResultSet.",
            {"archetypes": ["ResultSet"], "capabilities": ["filterable", "searchable", "windowable"], "presentations": ["filter_summary", "search_summary"]},
            {"target": {"type": "FilterTargetRef", "required": True}, "resultCount": {"type": "number", "required": False}, "live": {"type": "boolean", "required": False}},
            {"onInspectResultSet": {"accepts": "PresentationRef"}, "onClearFilters": {"accepts": "FilterTargetRef"}},
            ["unfiltered", "with_filters", "live_tail", "search_active"],
            "common",
        ),
        widget(
            "dmeta.saved_filter_menu",
            "SavedFilterMenu",
            "filters",
            "molecule",
            "filter_preset_selector",
            "Render saved filter presets and apply them to compatible filterable targets.",
            {"archetypes": ["FilterPreset", "ResultSet"], "capabilities": ["filterable", "actionable"], "presentations": ["compact_ref", "summary_card"]},
            {"target": {"type": "FilterTargetRef", "required": True}, "presets": {"type": "FilterPresetViewModel[]", "required": True}},
            {"onApplyPreset": {"accepts": "PresentationActionRequest"}, "onSavePreset": {"accepts": "FilterTargetRef"}},
            ["preset_list", "empty_presets", "save_current"],
            "rare",
            "optional",
            ["dropdown", "panel"],
            ["preset_scope", "permissions", "save_behavior"],
            ["Users do not need reusable query states."],
        ),
        widget(
            "dmeta.result_window_controls",
            "ResultWindowControls",
            "filters",
            "molecule",
            "result_window_navigation",
            "Render page/cursor/live-tail controls for windowable result sets.",
            {"archetypes": ["ResultSet"], "capabilities": ["windowable", "filterable"]},
            {"target": {"type": "FilterTargetRef", "required": True}, "window": {"type": "ResultWindow", "required": True}},
            {"onChangeWindow": {"accepts": "ResultWindowRequest"}, "onToggleLiveTail": {"accepts": "FilterTargetRef"}},
            ["cursor_next_prev", "page_numbers", "live_tail"],
            "common",
            "common",
            ["cursor", "pagination", "live_tail"],
            ["cursor_strategy", "page_size_options", "live_tail_behavior"],
            ["The result set is small and loaded fully in memory."],
        ),
    ]


def build_layout() -> list[dict[str, Any]]:
    return [
        widget("dmeta.workbench_shell", "WorkbenchShell", "layout", "organism", "workspace_frame", "Render a global workbench frame with navigation, workspace status, command/search affordances, and main content slots.", {}, {"navigation": {"type": "NavigationItem[]", "required": False}, "children": {"type": "ReactNode", "required": True}}, None, ["single_workspace", "with_sidebar", "with_topbar"], "optional", "common", ["sidebar", "topbar", "single_panel"], ["navigation_model", "global_actions", "responsive_behavior"], ["The instance is a single embedded widget or one fixed dashboard without app chrome."]),
        widget("dmeta.page_header", "PageHeader", "layout", "molecule", "page_identity", "Render page title, subtitle, breadcrumbs/context refs, primary actions, and status summary.", {"presentations": ["compact_ref", "status_badge"]}, {"title": {"type": "string", "required": True}, "subtitle": {"type": "string", "required": False}, "actions": {"type": "ActionDefinition[]", "required": False}}, {"onAction": {"accepts": "PresentationActionRequest"}}, ["with_actions", "with_context_ref", "minimal"], "common"),
        widget("dmeta.panel", "Panel", "layout", "molecule", "bounded_content_surface", "Render a low-chrome content surface with optional header, body, footer, density, and action slots.", {}, {"title": {"type": "string", "required": False}, "children": {"type": "ReactNode", "required": True}, "density": {"type": "DensityMode", "required": False}}, None, ["plain", "with_header_actions", "dense"], "common"),
        widget("dmeta.toolbar", "Toolbar", "layout", "molecule", "control_row", "Render a compact row for search, filters, view toggles, and actions.", {}, {"left": {"type": "ReactNode", "required": False}, "right": {"type": "ReactNode", "required": False}, "density": {"type": "DensityMode", "required": False}}, None, ["actions_only", "search_filter_actions", "dense"], "common"),
        widget("dmeta.split_pane", "SplitPane", "layout", "organism", "master_detail_layout", "Render a resizable or fixed split between primary context and secondary detail/inspector content.", {}, {"primary": {"type": "ReactNode", "required": True}, "secondary": {"type": "ReactNode", "required": True}, "orientation": {"type": '"horizontal" | "vertical"', "required": False}}, None, ["master_detail", "collapsed_secondary", "vertical"], "optional", "common", ["fixed", "resizable", "collapsible"], ["collapse_behavior", "initial_ratio", "responsive_stacking"], ["The instance does not need simultaneous context and inspection."]),
        widget("dmeta.tabs", "Tabs", "layout", "molecule", "view_switcher", "Render tabbed navigation among sibling views or detail sections.", {}, {"tabs": {"type": "TabItem[]", "required": True}, "activeId": {"type": "string", "required": True}}, {"onChangeTab": {"accepts": "string"}}, ["two_tabs", "many_tabs", "keyboard_navigation"], "optional", "common", ["line_tabs", "segmented", "dense"], ["tab_model", "routing", "keyboard_behavior"], ["The information architecture is a single fixed view or uses routes instead of tabs."]),
    ]


def build_dashboards() -> list[dict[str, Any]]:
    return [
        widget("dmeta.operational_dashboard", "OperationalDashboard", "dashboards", "organism", "dashboard_frame", "Render a fixed or responsive dashboard composed of named operational regions.", {"archetypes": ["ResultSet", "Metric", "WorkItem"], "capabilities": ["aggregatable", "stateful", "measurable"]}, {"regions": {"type": "DashboardRegionViewModel[]", "required": True}, "density": {"type": "DensityMode", "required": False}}, None, ["wallboard", "operator_dashboard", "single_screen"], "optional", "common", ["single_screen", "responsive_grid", "wallboard"], ["region_layout", "refresh_policy", "alert_priority"], ["The instance is primarily table/stream/detail workflow rather than dashboard-first."]),
        widget("dmeta.dashboard_region", "DashboardRegion", "dashboards", "molecule", "dashboard_region", "Render one named dashboard region with title, status, content, and optional action hooks.", {}, {"title": {"type": "string", "required": True}, "children": {"type": "ReactNode", "required": True}, "status": {"type": "PresentationRef", "required": False}}, {"onRegionAction": {"accepts": "PresentationActionRequest"}}, ["metric_region", "queue_region", "event_region"], "optional"),
        widget("dmeta.metric_summary_strip", "MetricSummaryStrip", "dashboards", "molecule", "metric_summary", "Render a compact strip of comparable metrics and status indicators.", {"archetypes": ["Metric"], "capabilities": ["measurable", "aggregatable"], "presentations": ["metric_cell", "duration_cell", "status_badge"]}, {"metrics": {"type": "MetricSummaryViewModel[]", "required": True}}, {"onSelectMetric": {"accepts": "PresentationRef"}}, ["latency_cost_count", "with_status", "comparison_candidates"], "optional"),
        widget("dmeta.queue_health_panel", "QueueHealthPanel", "dashboards", "molecule", "queue_health_summary", "Render queue depth, throughput, failure, and freshness status for operational work queues.", {"archetypes": ["WorkItem", "Metric", "ResultSet"], "capabilities": ["stateful", "measurable", "filterable"]}, {"queue": {"type": "QueueHealthViewModel", "required": True}}, {"onOpenQueue": {"accepts": "PresentationRef"}, "onFilterQueue": {"accepts": "FilterActionRequest"}}, ["healthy", "backlogged", "failing"], "optional"),
    ]


def build_forms() -> list[dict[str, Any]]:
    return [
        widget("dmeta.action_parameter_form", "ActionParameterForm", "forms", "organism", "action_argument_form", "Render typed action parameters, confirmation text, and submit/cancel controls for selected actions.", {"archetypes": ["ActionSpec"], "capabilities": ["parameterized", "actionable"]}, {"action": {"type": "ActionDefinition", "required": True}, "parameters": {"type": "ParameterField[]", "required": True}}, {"onSubmit": {"accepts": "PresentationActionRequest"}, "onCancel": {"accepts": "void"}}, ["simple_params", "confirmation", "validation_errors"], "optional", "common", ["inline", "dialog", "drawer"], ["field_set", "validation", "confirmation_copy"], ["The selected instance exposes no parameterized or side-effecting actions."]),
        widget("dmeta.field_group", "FieldGroup", "forms", "molecule", "field_group", "Render a labeled group of fields with description, validation summary, and density rules.", {}, {"title": {"type": "string", "required": False}, "children": {"type": "ReactNode", "required": True}}, None, ["basic", "with_description", "with_error"], "optional"),
        widget("dmeta.field_shell", "FieldShell", "forms", "atom", "field_chrome", "Render consistent label/help/error/required chrome around a form control.", {}, {"label": {"type": "string", "required": False}, "help": {"type": "string", "required": False}, "error": {"type": "string", "required": False}, "children": {"type": "ReactNode", "required": True}}, None, ["label_help", "error", "required"], "optional"),
        widget("dmeta.text_field", "TextField", "forms", "atom", "text_input", "Render a single-line text input for filters, search scopes, and action parameters.", {}, {"value": {"type": "string", "required": False}, "placeholder": {"type": "string", "required": False}}, {"onChange": {"accepts": "string"}}, ["empty", "with_value", "error"], "optional"),
        widget("dmeta.textarea_field", "TextareaField", "forms", "atom", "multiline_text_input", "Render multiline input for notes, prompts, payload fragments, or longer parameters.", {}, {"value": {"type": "string", "required": False}, "rows": {"type": "number", "required": False}}, {"onChange": {"accepts": "string"}}, ["short", "long", "error"], "optional"),
        widget("dmeta.select_field", "SelectField", "forms", "atom", "choice_input", "Render enum or finite-choice parameter selection.", {}, {"value": {"type": "string", "required": False}, "options": {"type": "SelectOption[]", "required": True}}, {"onChange": {"accepts": "string"}}, ["single_select", "many_options", "empty"], "optional"),
        widget("dmeta.switch_field", "SwitchField", "forms", "atom", "boolean_input", "Render a boolean parameter or filter toggle.", {}, {"checked": {"type": "boolean", "required": True}, "label": {"type": "string", "required": False}}, {"onChange": {"accepts": "boolean"}}, ["on", "off", "disabled"], "optional"),
        widget("dmeta.datetime_field", "DateTimeField", "forms", "atom", "datetime_input", "Render date/time input for schedules, time windows, and temporal filters.", {"capabilities": ["temporal"]}, {"value": {"type": "string", "required": False}}, {"onChange": {"accepts": "string"}}, ["date_only", "datetime", "range_start"], "optional"),
        widget("dmeta.duration_field", "DurationField", "forms", "atom", "duration_input", "Render duration, timeout, SLA, or time-window size input.", {"capabilities": ["temporal"]}, {"valueMs": {"type": "number", "required": False}}, {"onChange": {"accepts": "number"}}, ["seconds", "minutes", "custom"], "optional"),
        widget("dmeta.number_field", "NumberField", "forms", "atom", "number_input", "Render numeric input for limits, thresholds, counts, and metric filters.", {"capabilities": ["measurable"]}, {"value": {"type": "number", "required": False}}, {"onChange": {"accepts": "number"}}, ["integer", "decimal", "threshold"], "optional"),
    ]


def build_states() -> list[dict[str, Any]]:
    return [
        widget("dmeta.empty_state", "EmptyState", "states", "atom", "empty_state", "Render a quiet empty/no-results state with optional recovery action.", {}, {"title": {"type": "string", "required": True}, "description": {"type": "string", "required": False}}, {"onAction": {"accepts": "PresentationActionRequest"}}, ["no_data", "no_filtered_results", "no_permission"], "common"),
        widget("dmeta.loading_state", "LoadingState", "states", "atom", "loading_state", "Render loading/progress state for panels, streams, tables, and dashboards.", {}, {"label": {"type": "string", "required": False}, "progress": {"type": "number", "required": False}}, None, ["spinner", "progress", "skeleton"], "common"),
        widget("dmeta.inline_error", "InlineError", "states", "atom", "inline_error", "Render a compact recoverable error state with message, detail, and retry action.", {}, {"message": {"type": "string", "required": True}, "detail": {"type": "string", "required": False}}, {"onRetry": {"accepts": "void"}}, ["validation_error", "backend_error", "retryable"], "common"),
        widget("dmeta.disconnected_state", "DisconnectedState", "states", "molecule", "connection_state", "Render disconnected/reconnecting/stale realtime data state.", {}, {"status": {"type": '"connected" | "reconnecting" | "disconnected"', "required": True}}, {"onReconnect": {"accepts": "void"}}, ["connected", "reconnecting", "disconnected"], "optional"),
        widget("dmeta.stale_data_indicator", "StaleDataIndicator", "states", "atom", "freshness_indicator", "Render last-updated/freshness warning for dashboards and live result surfaces.", {"capabilities": ["temporal"]}, {"lastUpdated": {"type": "string", "required": False}, "stale": {"type": "boolean", "required": True}}, {"onRefresh": {"accepts": "void"}}, ["fresh", "stale", "refreshing"], "optional"),
    ]


def build_data_display() -> list[dict[str, Any]]:
    return [
        widget("dmeta.key_value_list", "KeyValueList", "data-display", "molecule", "property_inspector", "Render compact key-value properties, optionally using presentation-aware value renderers.", {"presentations": ["compact_ref", "status_badge", "metric_cell", "relation_link"]}, {"items": {"type": "KeyValueItem[]", "required": True}, "density": {"type": "DensityMode", "required": False}}, {"onSelectValue": {"accepts": "PresentationRef"}}, ["basic", "semantic_values", "copyable"], "rare", "optional", ["plain", "grouped", "copyable"], ["value_renderers", "grouping", "copy_behavior"], ["The instance has no generic inspector/detail properties."]),
        widget("dmeta.comparison_table", "ComparisonTable", "data-display", "organism", "comparison_table", "Render side-by-side comparison of metrics, candidates, versions, or before/after records.", {"archetypes": ["Metric", "Resource", "WorkItem"], "capabilities": ["measurable"], "presentations": ["metric_cell", "duration_cell", "compact_ref"]}, {"columns": {"type": "ComparisonColumn[]", "required": True}, "rows": {"type": "ComparisonRow[]", "required": True}}, {"onSelectCell": {"accepts": "PresentationRef"}}, ["metrics", "candidates", "before_after"], "rare", "optional", ["metric_comparison", "candidate_comparison", "before_after"], ["comparison_axis", "highlight_rules", "unit_compatibility"], ["Comparison is not a primary user workflow."]),
        widget("dmeta.markdown_block", "MarkdownBlock", "data-display", "molecule", "markdown_content", "Render sanitized markdown documentation, runbooks, notes, or tool output.", {}, {"markdown": {"type": "string", "required": True}}, {"onOpenLink": {"accepts": "string"}}, ["basic", "code_blocks", "empty"], "optional", "optional", ["read_only", "collapsible"], ["sanitization", "allowed_elements", "code_highlighting"], ["The instance does not render rich text or untrusted markdown."]),
        widget("dmeta.preview_frame", "PreviewFrame", "data-display", "organism", "artifact_preview", "Render a preview of an artifact such as a document, image, OCR page, web output, or generated report.", {"archetypes": ["Resource"], "capabilities": ["inspectable"]}, {"resource": {"type": "PresentationRef", "required": True}, "preview": {"type": "PreviewViewModel", "required": True}}, {"onOpenPreview": {"accepts": "PresentationRef"}}, ["image", "document", "html", "unavailable"], "optional", "common", ["image", "document", "html", "text"], ["sandboxing", "preview_kind", "fallback_behavior"], ["The instance has no previewable artifacts."]),
    ]


def append_unique(path: Path, new_templates: list[dict[str, Any]]) -> None:
    doc = load_yaml(path)
    existing = {t["id"]: t for t in doc.get("templates", [])}
    for t in new_templates:
        existing[t["id"]] = t
    doc["templates"] = list(existing.values())
    save_yaml(path, doc)


def main() -> None:
    TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)
    write_template_file("filters.yaml", "filters", "Filter/search/result-state widget templates for DMETA instances.", build_filters())
    write_template_file("layout.yaml", "layout", "Shell, page, panel, toolbar, split-pane, and tab templates.", build_layout())
    write_template_file("dashboards.yaml", "dashboards", "Dashboard-first template options for single-screen and operational overview instances.", build_dashboards())
    write_template_file("forms.yaml", "forms", "Action parameter and basic field templates.", build_forms())
    write_template_file("states.yaml", "states", "Empty/loading/error/connection state templates.", build_states())
    write_template_file("data-display.yaml", "data-display", "Optional property, comparison, markdown, and preview templates.", build_data_display())

    append_unique(TEMPLATE_DIR / "actions.yaml", [
        widget("dmeta.action_button", "ActionButton", "actions", "atom", "action_button", "Render one action with semantic tone, loading/disabled state, and adapter-boundary callback.", {"capabilities": ["actionable"]}, {"action": {"type": "ActionDefinition", "required": True}, "tone": {"type": "SemanticTone", "required": False}}, {"onExecute": {"accepts": "PresentationActionRequest"}}, ["primary", "secondary", "danger", "loading"], "common"),
        widget("dmeta.action_group", "ActionGroup", "actions", "molecule", "action_group", "Render a group of primary/secondary actions for a selected subject, panel, page, or bulk selection.", {"capabilities": ["actionable"]}, {"actions": {"type": "ActionDefinition[]", "required": True}, "subject": {"type": "PresentationRef", "required": False}}, {"onExecute": {"accepts": "PresentationActionRequest"}}, ["row_actions", "panel_actions", "bulk_actions"], "common"),
        widget("dmeta.context_menu_trigger", "ContextMenuTrigger", "actions", "atom", "context_menu_trigger", "Expose secondary presentation actions without adding dense visual noise.", {"presentations": ["compact_ref", "inline_token", "status_badge", "metric_cell"], "capabilities": ["actionable"]}, {"subject": {"type": "PresentationRef", "required": True}, "actions": {"type": "ActionDefinition[]", "required": True}}, {"onOpenMenu": {"accepts": "PresentationRef"}, "onExecute": {"accepts": "PresentationActionRequest"}}, ["token_menu", "row_menu", "disabled"], "common"),
    ])
    append_unique(TEMPLATE_DIR / "tables.yaml", [
        widget("dmeta.presentation_cell", "PresentationCell", "tables", "atom", "presentation_table_cell", "Render one table cell by delegating to presentation-aware value renderers.", {"presentations": ["compact_ref", "status_badge", "state_cell", "metric_cell", "timestamp_inline", "relation_link"]}, {"cell": {"type": "PresentationCellViewModel", "required": True}}, {"onCellAction": {"accepts": "PresentationRef"}}, ["compact_ref", "status", "metric", "relation"], "common"),
        widget("dmeta.bulk_action_bar", "BulkActionBar", "tables", "molecule", "bulk_action_bar", "Render actions for selected rows/presentations with count, scope, and confirmation affordances.", {"capabilities": ["actionable"], "presentations": ["compact_ref"]}, {"selected": {"type": "PresentationRef[]", "required": True}, "actions": {"type": "ActionDefinition[]", "required": True}}, {"onExecuteBulk": {"accepts": "PresentationActionRequest"}, "onClearSelection": {"accepts": "void"}}, ["no_selection", "some_selected", "danger_action"], "optional"),
    ])

    new_files = [
        "presentations.yaml",
        "streams.yaml",
        "tables.yaml",
        "surfaces.yaml",
        "actions.yaml",
        "filters.yaml",
        "layout.yaml",
        "dashboards.yaml",
        "forms.yaml",
        "states.yaml",
        "data-display.yaml",
    ]
    idx = load_yaml(TEMPLATE_DIR / "00-index.yaml")
    idx["files"] = {f[:-5].replace("-", "_"): "./" + f for f in new_files}
    idx["validation"] = {
        "require_unique_template_ids": True,
        "require_known_presentations": True,
        "require_known_archetypes": True,
        "require_known_capabilities": True,
        "require_selection_guidance": True,
    }
    save_yaml(TEMPLATE_DIR / "00-index.yaml", idx)

    pkg_path = ROOT / "sources/dmeta-ir/03-widgets.yaml"
    pkg = load_yaml(pkg_path)
    pkg["files"] = {"index": "./widget-templates/00-index.yaml"} | {
        f[:-5].replace("-", "_"): "./widget-templates/" + f for f in new_files
    }
    pkg["validation"] = idx["validation"]
    save_yaml(pkg_path, pkg)


if __name__ == "__main__":
    main()
