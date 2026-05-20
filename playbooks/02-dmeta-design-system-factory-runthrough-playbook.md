---
Title: DMETA Design System Factory Runthrough Playbook
Ticket: DMETA-001
Status: active
Topics:
    - design-system
    - dsl
    - presentation-based-ui
    - code-generation
    - react
DocType: playbook
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ../design-docs/02-semantic-archetype-and-capability-model.md
      Note: Intermediate semantic/archetype model used by this playbook
    - Path: ../design-docs/03-dense-operational-ui-graphic-design-and-ux-archetype.md
      Note: Intermediate graphic design/UX archetype used by this playbook
ExternalSources: []
Summary: "Runthrough protocol for turning collaborative discussion into concrete design-system DSL specs, playbooks, generators, lint, and hard design rules."
LastUpdated: 2026-05-19T17:40:00-04:00
WhatFor: "Use to run DMETA-style design system factory sessions from abstract intent to concrete domain-specific design systems."
WhenToUse: "Use after initial orientation when preparing to produce concrete widget IR specs and tooling for a domain."
---

# DMETA Design System Factory Runthrough Playbook

## Purpose

This playbook refines the original Collaborative Schema Design Sessions playbook for the DMETA design-system factory. It describes how to move from a high-level collaborative discussion to concrete artifacts:

```text
collaborative discussion + base playbook
  -> intermediate semantic/archetype model
  -> intermediate graphic design/UX archetype
  -> concrete widget DSL spec
  -> concrete playbooks
  -> codegen/lint/tooling
  -> hard design guidelines
  -> concrete domain-specific design system instance
```

The playbook is intentionally staged. The early stages keep things generic and range-based. The later stages harden choices into schemas, generators, lint rules, and domain-specific widgets.

## Environment Assumptions

- Work happens inside a docmgr ticket.
- The ticket contains the imported HAIR-041 sources and playbooks.
- The ticket contains or references at least two visual/design references.
- The team has at least two target domain examples for pressure testing.
- The target frontend stack is React + Vite + TypeScript + RTK Query + Tailwind, unless explicitly changed.

## Phase 0 — Orientation and source import

### Inputs

- Base collaborative schema design playbook.
- HAIR-041 widget IR and design-language artifacts.
- Existing reference apps or screenshots.
- User intent for the desired app family.

### Work

1. Create docmgr ticket.
2. Import source playbooks/specs.
3. Copy visual references into `sources/images/`.
4. Relate live code examples.
5. Create investigation diary.

### Exit criteria

- Ticket has sources, playbooks, diary, and initial tasks.
- The agent can summarize the intended app family and visual direction.

## Phase 1 — Intermediate semantic/archetype model

### Goal

Define the reusable semantic layer at the meta level. Do not lock onto one concrete domain.

### Prompts

- What kinds of operational roles recur across the target app family?
- Which concrete domain objects from example apps map to those roles?
- Which roles are better understood as archetypes vs capabilities?
- Which presentations are capability-level vs archetype-level?
- Which actions operate over capabilities, archetypes, or concrete domain types?

### Required output

A document equivalent to:

```text
design-doc/03-semantic-archetype-and-capability-model.md
```

It must define:

- domain type;
- archetype;
- capability;
- projection;
- presentation;
- action;
- compositional mapping rules;
- at least two cross-domain examples.

### Exit criteria

The team can map two different domains onto the same archetype/capability vocabulary without obvious distortion.

## Phase 2 — Intermediate graphic design/UX archetype

### Goal

Define the desired visual and interaction archetype at the generic level. Do not choose all hard token values yet.

### Prompts

- What should the UI feel like after eight hours of expert use?
- What makes dense information legible instead of visually exhausting?
- Which constraints are archetypal vs theme-specific?
- Which ranges should later become hard rules?
- Which interaction affordances are mandatory for dense operational work?

### Required output

A document equivalent to:

```text
design-doc/04-dense-operational-ui-graphic-design-and-ux-archetype.md
```

It must define ranges/rules for:

- typography;
- spacing and rhythm;
- density modes;
- color semantics;
- borders/radius/elevation;
- layout archetypes;
- component archetypes;
- keyboard/context interaction;
- presentation-based UI affordances;
- theming knobs.

### Exit criteria

The team can distinguish mandatory information-design constraints from optional theme choices.

## Phase 3 — Concrete schema design

### Goal

Turn the two intermediate documents into concrete DSL artifacts.

### Candidate artifacts

For DMETA v0, keep the core model split into focused files rather than one very large YAML document:

```text
sources/dmeta-ir/
  00-index.yaml
  01-core-model.yaml                  # package/index: summary, long_summary, references, file list
  core-model/
    core-model.yaml                   # shared metadata, logical types, authoring guidance
    archetypes.yaml                   # archetypes with description + long_description
    capabilities.yaml                 # capabilities with description + long_description
    presentations.yaml                # presentations + actions
    examples/
      agent-workflow.yaml             # one pressure-test domain per file
      retail-logistics.yaml
  02-design-language.yaml
  03-widgets.yaml
```

The split is intentional. `01-core-model.yaml` is a package index. The semantic sections live in `core-model/*.yaml`, and each domain example gets its own file under `core-model/examples/`.

### Work

1. Draft schemas with examples before finalizing fields.
2. Add both short and long prose context:
   - every core-model package/index file needs `summary` and `long_summary`;
   - every archetype needs `description` and `long_description`;
   - every capability needs `description` and `long_description`;
   - subfiles should include `references` pointing to the design docs needed to understand them.
3. For every field ask:
   - What consumes this?
   - Is it for generation, validation, runtime interpretation, or review?
   - Can it be derived from another layer?
   - What invariant can validate it?
4. Pressure-test against at least two domains, one example file per domain.
5. Remove fields that have no consumer.

### Exit criteria

- Example YAML exists for at least two domains, each in its own `core-model/examples/*.yaml` file.
- Invariants are clear.
- Generation targets are clear.
- The schema separates archetypes, capabilities, presentations/actions, domain examples, widgets, and design language.
- The YAML files carry enough prose context for interns, reviewers, generated docs, and LLM-assisted workflows to understand the semantics without relying only on terse identifiers.

## Phase 4 — Hard design rules

### Goal

Choose exact design tokens and constraints for one concrete design-system instance.

### Work

1. Select theme axes:
   - density;
   - neutral tone;
   - type mode;
   - radius;
   - row treatment;
   - surface separation;
   - accent strategy.
2. Freeze exact typography roles.
3. Freeze spacing and row-height tokens.
4. Freeze semantic color roles.
5. Define allowed component states.
6. Define lintable visual constraints.

### Exit criteria

- `design-language.yaml` has exact token values.
- Generated helpers can enforce typography, spacing, color, and state styles.
- Lint rules can detect violations.

## Phase 5 — Widget DSL and generator design

### Goal

Define component classes and deterministic generation outputs.

### Work

1. Define widget class inventory around generic structures:
   - `RecordStream`;
   - `DenseTable`;
   - `ProcessPanel`;
   - `DetailDrawer`;
   - `ActionPalette`;
   - `FilterBar`;
   - `PresentationToken`;
   - `StatusBadge`;
   - `CompactReference`.
2. Define widget contracts against presentations and capabilities, not raw domain objects only.
3. Define generated outputs:
   - component scaffold;
   - `.types.ts`;
   - metadata sidecar;
   - story scaffold;
   - index barrel;
   - helper modules.
4. Preserve HAIR-041 promotion workflow.

### Exit criteria

- Widget YAML can generate useful scaffolds.
- Widgets consume typed presentations and emit typed action callbacks.
- Adapter boundary remains explicit.

## Phase 6 — Tooling and validation

### Goal

Build the computational guardrails.

### Required tools

- Schema validator.
- Widget scaffold generator.
- Design helper generator.
- Presentation registry generator.
- Action registry helper generator.
- Design-system lint.
- Promotion validator.
- Storybook coverage manifest checker.

### Exit criteria

- Invalid archetype/capability references fail validation.
- Invalid presentation requirements fail validation.
- Raw/unauthorized design values are linted.
- Generated and promoted widgets remain auditable.

## Phase 7 — Concrete domain instantiation

### Goal

Use the factory to produce a concrete domain-specific design system.

Example domains:

- AI agent workflows;
- agricultural sensor logs;
- ecommerce retail backend;
- retail logistics order pipeline.

### Work

1. Define domain types.
2. Map them to archetypes/capabilities.
3. Choose domain-specific presentations only where generic ones are insufficient.
4. Generate widget scaffolds and design helpers.
5. Promote pilot widgets.
6. Harden Storybook.
7. Run lint/audit.

### Exit criteria

- A running React application demonstrates the generated design system.
- At least one dense stream/table, one detail panel, and one typed action flow work end-to-end.

## Failure Modes

### Failure mode 1 — Concrete domain leaks into the generic layer

Symptom: `Agent`, `Shipment`, or `Order` becomes a base factory concept.

Fix: map it to `Actor`, `WorkItem`, `Event`, `Resource`, etc.; keep concrete names in `domain-mapping.yaml`.

### Failure mode 2 — Capabilities become vague tags

Symptom: capabilities exist but define no projections, presentations, actions, or validation rules.

Fix: every capability must specify what it contributes to rendering, action routing, filtering, validation, or generation.

### Failure mode 3 — Design archetype becomes a fixed skin too early

Symptom: the generic layer says all apps must use one exact font/color/background.

Fix: keep ranges in the archetype layer; harden values only for concrete design-system instances.

### Failure mode 4 — Presentations attach to the wrong layer

Symptom: every status badge is separately defined for every domain type.

Fix: move reusable presentations to capabilities (`stateful.status_badge`) or archetypes (`work_item_row`) and let domain types override only when necessary.

## Practical next command sequence

```bash
# from repo root
cd /home/manuel/workspaces/2026-05-19/dmeta-dsl

docmgr doc list --ticket DMETA-001

docmgr doctor --ticket DMETA-001 --stale-after 30
```

Then read, in order:

1. `design-doc/02-design-system-factory-vision-and-scope.md`
2. `design-doc/03-semantic-archetype-and-capability-model.md`
3. `design-doc/04-dense-operational-ui-graphic-design-and-ux-archetype.md`
4. this playbook

## Exit Criteria for This Playbook

This playbook has succeeded when a future agent can start from the intermediate documents and produce:

- concrete YAML schemas;
- concrete hard visual rules;
- generator/lint tooling tasks;
- widget promotion playbooks;
- and a first concrete domain-specific design-system instance.
