# Generic PBUI MetaDesignSystem

This directory contains the generic Presentation Based UI MetaDesignSystem. PBUI is a target-family layer that lowers Interaction IR obligations into typed presentation-system obligations. It is inspired by CLIM-style interfaces where visible objects, action presentations, inspectors, command choosers, and lifecycle/status surfaces are first-class presentation concepts.

PBUI is not the Web MetaDesignSystem and not a React component library. React may render PBUI obligations later, but PBUI itself describes presentation-system semantics.

```text
Semantic IR
  -> Interaction IR
  -> PBUI MetaDesignSystem
  -> PBUI React proof target or concrete PBUI profile
```

## Files and directories

| Path | Purpose |
| --- | --- |
| `meta-design-system.yaml` | PBUI package manifest. It lists presentation types, lowering rules, and target files. |
| `presentation-types.yaml` | Generic PBUI presentation type catalog. |
| `lowering-rules.yaml` | Rules that map Interaction IR representations/actions to PBUI presentation obligations. |
| `targets/react.yaml` | Generic PBUI React proof target configuration. |
| `profiles/` | Optional/profile-oriented material for concrete PBUI systems. |

## What belongs here

Put a concept here when it is a reusable presentation-system concept.

Good candidates:

- Typed object reference presentation.
- Action presentation.
- Inspector panel.
- Action chooser.
- Lifecycle/status presentation.
- Composition presentation.
- Presentation metadata required by recognizers or presenters.

Poor candidates:

- Web cards, CSS modules, DOM layout, or browser widgets.
- Application-specific domain objects that belong in an application semantic package.
- Concrete CLIM profile bindings such as exact CSS classes, shell regions, or app-specific renderer names.

## Lowering model

PBUI lowering receives Interaction IR obligations and emits typed presentation obligations.

```text
representation/action obligation
  -> pbui/lowering-rules.yaml
  -> PBUI presentation types
  -> generic PBUI React proof target or concrete PBUI profile
```

A PBUI lowering rule should explain:

- what representation/action it matches;
- which PBUI presentation types it emits;
- why the presentation should exist;
- what presenter intent is expected;
- what recognizer intent is expected.

Those explanations matter because PBUI-generated artifacts should remain traceable back to semantic facts and interaction obligations.

## Commands

Run from the `dmeta/` repository root.

Validate PBUI:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

Lower Interaction IR obligations into PBUI obligations:

```bash
go run ./cmd/dmeta lower-pbui \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

Plan generic PBUI React proof files:

```bash
go run ./cmd/dmeta plan-pbui-react \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output-dir ./generated/pbui-react \
  --output table
```

Scaffold generic PBUI React proof files when intentionally writing output:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./sources/dmeta-ir \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output-dir ./generated/pbui-react \
  --dry-run \
  --output table
```

## Editing checklist

Before editing:

- Confirm the concept is presentation-system generic, not Web-specific and not application-specific.
- Check whether an existing presentation type already covers the intent.
- Add prose rationale, presenter intent, and recognizer intent for lowering rules.

After editing:

- Run `validate-pbui`.
- Run `lower-pbui`.
- Plan the PBUI React proof target if presentation metadata or target output should change.
- Run Go tests if loader, validator, lowerer, or generator code changed.

## Where to read more

```text
../../README.md
../../../../design-docs/06-dmeta-design-language-and-tooling-spec.md
../../../../playbooks/03-dmeta-pbui-clim-metadesignsystem-playbook.md
```
