# Generic Web MetaDesignSystem

This directory contains the generic Web MetaDesignSystem. It is the reusable Web target-family source for DMETA. It defines Web lowering rules, reusable widget templates, and React target inputs that application packages can select, specialize, and promote.

The Web MDS is not the semantic core model and not the Interaction IR. It starts after those layers have produced target-neutral obligations.

```text
Semantic IR
  -> Interaction IR
  -> Web MetaDesignSystem
  -> Web React target planning/generation
```

## Files and directories

| Path | Purpose |
| --- | --- |
| `meta-design-system.yaml` | Web MDS package manifest. It lists lowering rules, component-system policy, widget catalogs, and target files. |
| `lowering-rules.yaml` | Generic rules that map Interaction IR representations/actions to reusable Web widget obligations. |
| `component-system.yaml` | Generic Web component hierarchy, composition rules, lifecycle defaults, and lowering policy for atoms, molecules, organisms, rich widgets, pages, and components. |
| `targets/react.yaml` | React target configuration: generated file kinds, metadata sidecars, and component directory layout. |
| `widgets/00-index.yaml` | Widget catalog index and authoring guidance. |
| `widgets/actions.yaml` | Action-control templates such as action buttons and action groups. |
| `widgets/layout.yaml` | Shell, page, panel, toolbar, split-pane, and page-header templates. |
| `widgets/surfaces.yaml` | Surface and panel templates. |
| `widgets/tables.yaml` | Table and structured row templates. |
| `widgets/forms.yaml` | Form/input templates. |
| `widgets/filters.yaml` | Filter/search/refinement templates. |
| `widgets/data-display.yaml` | Generic data display templates. |
| `widgets/states.yaml` | State/status templates. |
| `widgets/streams.yaml` | Stream/timeline/event templates. |
| `widgets/dashboards.yaml` | Dashboard/workbench templates. |
| `widgets/presentations.yaml` | Templates closely tied to generic presentation/reference concepts. |

## What belongs here

Put a concept here when it is a reusable Web UI realization pattern.

Good candidates:

- Generic action button.
- Action group.
- Section header.
- Panel.
- Split feature.
- Card grid.
- Data table.
- Filter bar.
- Empty state.
- Status badge.
- Page shell.

Poor candidates:

- A product-specific Tree Center category tile.
- A Street Deli menu item card with application-specific fields.
- A CSS rule for one promoted component.
- A semantic archetype such as `Appointment` or `PlantRecommendationSet`.

Application-specific Web MDS packages should specialize or compose generic templates rather than putting product-specific templates here.

## Component hierarchy

The Web MDS uses component levels to organize generated and promoted code:

| Level | Generic meaning |
| --- | --- |
| `atom` | Small primitive such as a button, badge, label, icon, or status marker. |
| `molecule` | Small composed component such as an action group, card, section header, row, or compact reference. |
| `organism` | Larger Web widget or page section that satisfies one or more Interaction IR obligations. |
| `rich_widget` | Substantial interactive widget with richer internal state or composition. |
| `page` | Route/screen-level composition of organisms and page chrome. |

The React target currently maps those levels to directories in `targets/react.yaml`:

```yaml
component_layout:
  strategy: component_system
  dirs:
    atom: atoms
    molecule: molecules
    organism: organisms
    rich_widget: rich-widgets
    page: pages
    component: components
```

The generic component-system policy is codified in `component-system.yaml`. The remaining cleanup is to migrate widget templates toward one canonical component block and make validation/planning use the policy more deeply.

## Lowering model

A Web lowering rule receives Interaction IR obligations and emits Web widget obligations.

```text
representation/action obligation
  -> lowering-rules.yaml
  -> emitted Web widget template
  -> React plan/scaffold
```

A useful rule emits a Web component that satisfies a target-level obligation. It should not usually emit every atom and molecule directly. Atoms and molecules should usually enter through widget composition.

Example:

```text
result_collection + select_subject
  -> ResultCollectionWidget (organism)
       uses SectionHeader (molecule)
       uses ResultCard (molecule)
       uses ActionButton (atom)
```

## Commands

Run from the `dmeta/` repository root.

Validate the generic package including Web MDS:

```bash
go run ./cmd/dmeta validate-ir \
  --root ./sources/dmeta-ir \
  --output table
```

Lower generic Interaction IR obligations into Web obligations:

```bash
go run ./cmd/dmeta lower-web \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --web-root ./sources/dmeta-ir/meta-design-systems/web \
  --output table
```

List generic Web templates:

```bash
go run ./cmd/dmeta list-components \
  --root ./sources/dmeta-ir \
  --output table
```

Show one generic Web template:

```bash
go run ./cmd/dmeta show-component \
  --root ./sources/dmeta-ir \
  --id dmeta.action_button \
  --output yaml
```

Plan or scaffold an application React target from a concrete instance, not directly from this generic directory unless the instance points here.

## Editing checklist

Before editing:

- Confirm the concept is generic Web, not application-specific Web.
- Confirm the relevant Interaction IR representation/action exists or should exist.
- Choose the correct widget catalog file.
- Add intent/prose explaining why the template or lowering rule exists.

After editing:

- Run `validate-ir` for `./sources/dmeta-ir`.
- Run `lower-web` if lowering rules changed.
- Run `list-components` or `show-component` to inspect template output.
- If Go loader/validator/generator behavior changed, run `go test ./...`.

## Where to read more

```text
../../README.md
../../../../design-docs/06-dmeta-design-language-and-tooling-spec.md
../../../../playbooks/02-dmeta-web-react-metadesignsystem-playbook.md
```
