# Generic DMETA MetaDesignSystems

This directory contains generic target-family MetaDesignSystems. A MetaDesignSystem receives Semantic IR and Interaction IR obligations and decides how one interface family realizes them.

The generic package currently contains two target families:

```text
meta-design-systems/
  web/
  pbui/
```

The Web MetaDesignSystem is for conventional browser UI and React component generation. The PBUI MetaDesignSystem is for presentation-based UI concepts inspired by CLIM-style typed presentations and actions.

## Target-family boundary

The shared front half of DMETA is:

```text
Semantic IR
  -> Interaction IR
```

A MetaDesignSystem starts after that point:

```text
Interaction obligations
  -> target-family lowering rules
  -> target-family obligations
  -> target planner/generator
```

This means a MetaDesignSystem should not redefine domain meaning. It should explain how target-family components, presentation types, states, slots, regions, and events realize existing obligations.

## Subdirectories

| Directory | Purpose |
| --- | --- |
| `web/` | Generic browser/Web MetaDesignSystem. It owns reusable Web widget templates, Web lowering rules, and React target inputs. |
| `pbui/` | Generic presentation-based UI MetaDesignSystem. It owns PBUI presentation types, PBUI lowering rules, and PBUI React proof target inputs. |

## Commands

Run from the `dmeta/` repository root.

Validate generic Web as part of full IR validation:

```bash
go run ./cmd/dmeta validate-ir \
  --root ./sources/dmeta-ir \
  --output table
```

Inspect Web lowering:

```bash
go run ./cmd/dmeta lower-web \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --web-root ./sources/dmeta-ir/meta-design-systems/web \
  --output table
```

Validate PBUI:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

Inspect PBUI lowering:

```bash
go run ./cmd/dmeta lower-pbui \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

## Editing checklist

- Edit `web/` for reusable browser widget/template/lowering concepts.
- Edit `pbui/` for reusable presentation-system concepts.
- Keep Semantic IR and Interaction IR references explicit and traceable.
- Add prose rationale when a target-family rule exists because generated metadata should be understandable to designers and developers.
- Validate the target family after editing.

## Where to read more

```text
../README.md
../../../design-docs/06-dmeta-design-language-and-tooling-spec.md
../../../playbooks/02-dmeta-web-react-metadesignsystem-playbook.md
../../../playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md
```
