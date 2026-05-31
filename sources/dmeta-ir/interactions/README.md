# Generic DMETA Interaction IR

This directory contains the generic Interaction IR package. It defines target-neutral actions, representations, and elaboration rules that sit between Semantic IR and target-specific MetaDesignSystems.

Interaction IR answers a specific question: after the semantic model identifies domain objects and projections, what can a user perceive or do with them? The answer should not depend on Web, PBUI, React, CSS, or a particular application shell.

## Files

| File | Purpose |
| --- | --- |
| `00-index.yaml` | Interaction package index. |
| `actions.yaml` | Generic action catalog. Actions describe meaningful operations and accepted object types. |
| `representations.yaml` | Generic representation catalog. Representations describe visible semantic forms. |
| `elaboration-rules.yaml` | Rules that derive interaction obligations from semantic facts. |

## What belongs here

Put a concept here when it is a target-neutral thing that users can perceive or do.

Good candidates:

- `inspect_subject`
- `select_subject`
- `filter_results`
- `apply_action`
- `composition_summary`
- `status_indicator`
- `detail_panel`
- `result_collection`

Poor candidates:

- `click_button`
- `open_react_modal`
- `render_card_grid`
- `show_blue_badge`
- `clim_command_line_row`

Those poor candidates mention target realization. Target realization belongs to Web MDS, PBUI MDS, or a concrete target profile.

## How elaboration works

Elaboration rules turn semantic facts into interaction obligations.

```text
Semantic IR says:
  This domain object is identifiable, labelable, stateful, inspectable, and actionable.

Interaction elaboration can emit:
  representation: compact_ref
  representation: status_badge
  representation: detail_panel
  action: inspect_subject
  action: apply_action
```

The emitted obligations are still not Web or PBUI. Web may lower them to widgets. PBUI may lower them to typed presentation objects.

## Commands

Run from the `dmeta/` repository root.

Validate the generic Interaction IR package:

```bash
go run ./cmd/dmeta validate-interactions \
  --root ./sources/dmeta-ir \
  --output table
```

Elaborate interactions for the generic package examples:

```bash
go run ./cmd/dmeta elaborate-interactions \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

Show a reduced output while developing rules:

```bash
go run ./cmd/dmeta elaborate-interactions \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --fields kind,id,domain_type,source_rule_id \
  --output table
```

After changing interactions, test at least one target lowering path. For Web:

```bash
go run ./cmd/dmeta lower-web \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --web-root ./sources/dmeta-ir/meta-design-systems/web \
  --output table
```

For PBUI:

```bash
go run ./cmd/dmeta lower-pbui \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

## Editing checklist

Before editing:

- Confirm that the semantic concept exists in `../core-model/` or an application package.
- Decide whether the new thing is an action, a representation, or an elaboration rule.
- Use modality-neutral names.
- Add prose intent and rationale so target authors know why the obligation exists.

After editing:

- Run `validate-interactions`.
- Run `elaborate-interactions`.
- Run at least one target lowering command if the change should affect Web or PBUI.

## Where to read more

```text
../README.md
../../../design-docs/05-dmeta-core-model-and-widget-ir-spec.md
../../../playbooks/01-dmeta-shared-compiler-playbook.md
```
