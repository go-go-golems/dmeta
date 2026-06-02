# Generic DMETA Core Model

This directory contains the generic Semantic IR vocabulary for DMETA. It defines reusable archetypes, capabilities, projections, and examples that application packages can build on.

Semantic IR is the first compiler layer. It describes what a domain is made of and which projections matter. It does not describe Web widgets, PBUI presentation types, React props, CSS, Storybook stories, or application-specific page layouts.

## Files

| File or directory | Purpose |
| --- | --- |
| `core-model.yaml` | Metadata for the generic core model package. |
| `archetypes.yaml` | Reusable semantic roles such as actors, resources, work items, result sets, relations, events, and action specifications. |
| `capabilities.yaml` | Reusable semantic capabilities such as identifiable, labelable, stateful, temporal, inspectable, actionable, relatable, schedulable, and related operational affordances. |
| `examples/` | Generic examples used to prove and explain the vocabulary. |

## What belongs here

Put a concept here only if it is reusable across applications.

Good candidates:

- A reusable archetype such as `Resource`, `WorkItem`, `ResultSet`, or `Relation`.
- A reusable capability such as `identifiable`, `stateful`, `inspectable`, or `actionable`.
- A generic semantic projection requirement such as label, state, time range, relationship, or status.
- A generic example that explains how the core vocabulary is intended to be used.

Poor candidates:

- A product-specific domain type such as `ThujaGreenGiant`, `CoffeeOrder`, or `ClinicAppointment`.
- A React component such as `ProductCard` or `AppointmentBlock`.
- A Web layout rule such as four columns, a pill label, or a split feature section.
- A PBUI presentation renderer or CLIM profile binding.

Application packages should map their local domain types onto this vocabulary rather than forcing application-specific names into the generic package.

## Layer boundary

The intended flow is:

```text
core-model archetypes/capabilities/examples
  -> Interaction IR representations and actions
  -> target-specific MetaDesignSystems
```

If a thing can be summarized, inspected, filtered, or shown as a collection, define that visible obligation in Interaction IR representations. The core model should stop at semantic facts and projection names.

## Commands

Run from the `dmeta/` repository root.

Validate the generic IR package:

```bash
go run ./cmd/dmeta validate-ir \
  --root ./sources/dmeta-ir \
  --output table
```

Include informational findings when learning the model:

```bash
go run ./cmd/dmeta validate-ir \
  --root ./sources/dmeta-ir \
  --include-info \
  --output table
```

Generate TypeScript core registries when a consumer needs generated semantic artifacts:

```bash
go run ./cmd/dmeta generate-core \
  --root ./sources/dmeta-ir \
  --out ./generated/dmeta-core \
  --dry-run \
  --output table
```

## Editing checklist

Before editing:

- Ask whether the concept is generic or application-specific.
- Check existing archetypes and capabilities before adding new ones.
- Keep formal fields target-neutral.
- Add prose that explains why the concept exists and how it should be used.

After editing:

- Run `validate-ir`.
- Check any examples that should exercise the new concept.
- If the concept should lead to user-visible obligations, update `../interactions/` in a separate step.

## Where to read more

```text
../README.md
../../../design-docs/05-dmeta-core-model-and-widget-ir-spec.md
../../../playbooks/01-dmeta-shared-compiler-playbook.md
```
