# Generic DMETA IR Sources

This directory contains the generic DMETA source package. It is the reusable reference package for the compiler, not an application-specific product model. Application packages, such as Street Deli or the Tree Center Garden Assistant, can reuse, extend, or specialize the concepts defined here.

The package teaches the main DMETA separation of concerns:

```text
Semantic IR
  -> Interaction IR
  -> target-specific MetaDesignSystems
  -> target planners and generators
```

Semantic IR describes domain meaning. Interaction IR describes what a user can perceive or do in target-neutral terms. MetaDesignSystems describe how a target family realizes those obligations. A React generator, PBUI generator, or future target generator should be downstream of those layers.

## Directory map

```text
sources/dmeta-ir/
  00-index.yaml
  01-core-model.yaml
  02-design-language.yaml
  core-model/
  interactions/
  meta-design-systems/
    web/
    pbui/
```

| Path | Purpose |
| --- | --- |
| `00-index.yaml` | Top-level package index. It names the generic core model, design language, Interaction IR package, Web MDS package, and PBUI MDS package. |
| `01-core-model.yaml` | Core-model package index for generic archetypes, capabilities, presentations, and examples. |
| `02-design-language.yaml` | Shared design-language guidance for dense operational interfaces. Target systems may consume this differently. |
| `core-model/` | Generic semantic vocabulary. This is where reusable archetypes, capabilities, presentations, and examples live. |
| `interactions/` | Generic Interaction IR: modality-neutral representations, actions, and elaboration rules. |
| `meta-design-systems/web/` | Generic Web MetaDesignSystem. It owns reusable browser UI templates, Web lowering rules, and React target inputs. |
| `meta-design-systems/pbui/` | Generic PBUI MetaDesignSystem. It owns presentation-system types and PBUI lowering rules. |

## What this package is for

Use this package when you need to understand or improve the reusable DMETA system itself.

Examples:

- Add a generic semantic capability that multiple applications can use.
- Add a generic Interaction IR representation or action.
- Add a generic Web widget template such as a section header, panel, action group, data table, or card grid.
- Add a generic PBUI presentation type such as an object reference, action presentation, inspector, or lifecycle status.
- Improve validation rules that protect all downstream application packages.
- Improve target planning for Web React or PBUI React.

Do not put application-specific product language here unless it is intentionally being promoted into reusable DMETA vocabulary. For example, `Appointment`, `PlantRecommendationSet`, or `CoffeeOrder` usually belong in an application package. Generic roles such as `WorkItem`, `Resource`, `ResultSet`, `ActionSpec`, `composition_summary`, or `action_group` can belong here.

## Main commands

Run these commands from the `dmeta/` repository root.

Validate the generic package:

```bash
go run ./cmd/dmeta validate-ir \
  --root ./sources/dmeta-ir \
  --output table
```

Validate generic Interaction IR:

```bash
go run ./cmd/dmeta validate-interactions \
  --root ./sources/dmeta-ir \
  --output table
```

Inspect generic interaction elaboration against examples in this package:

```bash
go run ./cmd/dmeta elaborate-interactions \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

Validate generic PBUI:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

Inspect generic Web components:

```bash
go run ./cmd/dmeta list-components \
  --root ./sources/dmeta-ir \
  --output table
```

## Editing rules

- Put reusable semantic meaning in `core-model/`.
- Put target-neutral user-visible forms and operations in `interactions/`.
- Put reusable browser UI realization rules in `meta-design-systems/web/`.
- Put presentation-system realization rules in `meta-design-systems/pbui/`.
- Keep application-specific specializations in application packages unless the concept is deliberately generic.
- Prefer adding prose `summary`, `long_summary`, `intent`, `description`, and rationale fields when introducing new reusable concepts. Generic IR needs to be understandable without the author present.

## Where to read more

Durable docs:

```text
../../README.md
../../design-docs/04-concrete-dmeta-system-spec.md
../../design-docs/05-dmeta-core-model-and-widget-ir-spec.md
../../design-docs/06-dmeta-design-language-and-tooling-spec.md
../../playbooks/01-dmeta-shared-compiler-playbook.md
../../playbooks/02-dmeta-web-react-metadesignsystem-playbook.md
../../playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md
```

Layer-local guides:

```text
core-model/README.md
interactions/README.md
meta-design-systems/README.md
meta-design-systems/web/README.md
meta-design-systems/pbui/README.md
```
