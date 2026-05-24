---
Title: PBUI MetaDesignSystem Implementation Report
Ticket: DMETA-PBUI-PRESENTATION-PROFILE
Status: active
Topics:
    - dmeta
    - design-system
    - compiler-ir
    - metadesignsystem
    - pbui
    - clim
    - react
DocType: analysis
Intent: long-term
Owners: []
RelatedFiles:
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
      Note: Street Deli concrete PBUI profile entrypoint described in the report
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
      Note: Concrete React CLIM app target described in the report
    - Path: examples/street-deli-ordering/www/clim-react/package.json
      Note: Generated concrete React CLIM app package described in the report
    - Path: pkg/dmeta/cmds/scaffold_pbui_react_app.go
      Note: Concrete React app scaffold CLI described in the report
    - Path: pkg/dmeta/metadesign/pbui/lower.go
      Note: PBUI lowering implementation described in the report
    - Path: pkg/dmeta/metadesign/pbui/model.go
      Note: Global PBUI Go model described in the report
    - Path: pkg/dmeta/metadesign/pbui/profile/instantiate.go
      Note: Concrete profile instantiation implementation described in the report
    - Path: pkg/dmeta/metadesign/pbui/profile/react_app_plan.go
      Note: Concrete React app planning implementation described in the report
    - Path: sources/dmeta-ir/meta-design-systems/pbui/lowering-rules.yaml
      Note: PBUI lowering rule catalog described in the report
    - Path: sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
      Note: Global PBUI MetaDesignSystem package entrypoint described in the report
    - Path: sources/dmeta-ir/meta-design-systems/pbui/presentation-types.yaml
      Note: PBUI presentation type catalog described in the report
    - Path: sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
      Note: Generic PBUI React target described in the report
ExternalSources: []
Summary: Exhaustive implementation report for the PBUI MetaDesignSystem, concrete Street Deli PBUI profile, generic PBUI React scaffold, and concrete CLIM React app scaffold.
LastUpdated: 2026-05-24T18:47:05.836854203-04:00
WhatFor: 'Use this report to understand the current PBUI implementation end to end: IRs, schemas, Go packages, commands, generated artifacts, application author responsibilities, and the path from app idea to PBUI React output.'
WhenToUse: Read before modifying PBUI IR, adding a new presentation type, changing lowering rules, authoring a concrete PBUI profile, extending React scaffold generation, or onboarding a new engineer to the PBUI compiler path.
---


# PBUI MetaDesignSystem Implementation Report

## Purpose of this report

This report explains the PBUI MetaDesignSystem implementation as it exists now. It covers the authored IR files, the Go model and loader code, the validation rules, the lowering pass, descriptor derivation, the generic PBUI React target, the concrete Street Deli PBUI presentation profile, the concrete profile instantiation pass, the concrete React CLIM app planning and scaffolding pass, and the resulting generated applications.

The report is written for a capable engineer who needs to work on the system without relying on chat history. The objective is not to summarize only the visible commands. The objective is to explain why each layer exists, what information it owns, which files implement it, what an application author must provide, what the compiler derives, and how the workflow moves from an application idea to a buildable PBUI React result.

The current implementation contains two React output paths:

1. A **generic PBUI React scaffold** under `examples/street-deli-ordering/generated/pbui-react/`. This path proves that abstract PBUI obligations can become registries, metadata, hooks, components, stories, and support files.
2. A **concrete Street Deli CLIM React app scaffold** under `examples/street-deli-ordering/www/clim-react/`. This path applies a local concrete presentation profile before generating app shell, fonts, CSS, runtime placeholders, Storybook stories, view components, and presentation components.

The second path is newer. It exists because the generic PBUI scaffold is not enough to produce a real application. Abstract PBUI can say that there should be a `pbui.presentation_ref`; it cannot decide that the Street Deli app uses Berkeley Mono, a black shell, a footer command line, a `MENU` mode label, or view components named `MenuView`, `DetailView`, and `CartView`. Those decisions live in the concrete profile.

## One-page map of the current PBUI pipeline

The current pipeline is a sequence of IR transformations and target planning steps. Each step consumes an explicit source package and produces either validation findings, obligations, descriptors, plans, rendered files, or written files.

```text
Application idea
  |
  v
Semantic IR package
  - archetypes
  - capabilities
  - domain examples
  - domain type mappings
  |
  |  interaction.ElaborateInteractions
  v
Interaction IR obligations
  - representations
  - actions
  - source elaboration rules
  |
  |  pbui.Lower
  v
PBUI obligations
  - presentation type ids
  - source rules
  - source actions/representations
  - presenter intent
  - recognizer intent
  - rationale
  |
  +------------------------------+
  |                              |
  | generic PBUI React path       | concrete profile path
  |                              |
  v                              v
PBUI React plan                  Concrete PBUI profile package
  - registries                    - style profile
  - hooks                         - surfaces
  - components                    - view models
  - metadata                      - presentation bindings
  - stories                       - React app target
  |                              |
  | RenderReactPlan              | profile.InstantiateProfile
  v                              v
Generated generic package        ConcretePresentationPlan
examples/.../generated/pbui-react  - views
                                   - surfaces
                                   - component bindings
                                   - style profile
                                   |
                                   | profile.BuildReactAppPlan
                                   v
                                 ReactAppPlan
                                   - app files
                                   - runtime files
                                   - CSS/fonts
                                   - Storybook files
                                   - view/component files
                                   |
                                   | profile.WriteReactAppPlan
                                   v
                                 Concrete app scaffold
                                 examples/.../www/clim-react
```

The important architectural rule is that each layer owns only the information that belongs at that layer. Semantic IR owns domain meaning. Interaction IR owns modality-neutral actions and representations. PBUI owns presentation-system obligations. A concrete profile owns one concrete presentation system. A React target owns files, TypeScript, JSX, Storybook, and package layout.

## The layers and their responsibilities

The implementation is easiest to understand when each layer is described by the question it answers.

| Layer | Main question | Authored by application author? | Current files |
| --- | --- | --- | --- |
| Semantic IR | What domain objects exist, and what semantic capabilities do they have? | Yes, for the app domain. | `examples/street-deli-ordering/01-core-model.yaml`, `examples/street-deli-ordering/core-model/*.yaml` |
| Interaction IR | What modality-neutral actions and representations follow from semantic facts? | Mostly global, occasionally extended. | `sources/dmeta-ir/interactions/actions.yaml`, `representations.yaml`, `elaboration-rules.yaml` |
| PBUI MetaDesignSystem | Which presentation-system obligations should exist for those interactions? | Global PBUI authors maintain this. | `sources/dmeta-ir/meta-design-systems/pbui/*.yaml` |
| Generic PBUI React target | How can abstract PBUI obligations become an inspectable React scaffold? | Target authors maintain this. | `sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml`, `pkg/dmeta/metadesign/pbui/react_*` |
| Concrete PBUI profile | How should abstract PBUI obligations look and behave in one concrete presentation system? | Yes, for each concrete app/profile. | `examples/street-deli-ordering/meta-design-systems/pbui/*.yaml` |
| Concrete React app target | Which actual app files, stories, CSS, fonts, and runtime modules realize the profile? | Target/profile authors maintain this. | `examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml`, `pkg/dmeta/metadesign/pbui/profile/react_app_*` |

The distinction between the PBUI MetaDesignSystem and the concrete PBUI profile matters. PBUI says that there is an abstract presentation type called `pbui.action_presentation`. The Street Deli profile says that in this app, that type is rendered by `ActionPresentationInline`, appears inside command bars or presentation areas, uses prototype-clim classes, and participates in a black monochrome CLIM shell.

## What the application author starts with

An application author does not begin by writing React components. The author begins by describing the domain. In the Street Deli example, the domain package is rooted at:

```text
examples/street-deli-ordering/
```

The main semantic entrypoint is:

```text
examples/street-deli-ordering/01-core-model.yaml
```

That file points at the split semantic package:

```yaml
files:
  core_model: ./core-model/core-model.yaml
  archetypes: ./core-model/archetypes.yaml
  capabilities: ./core-model/capabilities.yaml
  presentations: ./core-model/presentations.yaml
  domain_example: ./core-model/street-deli-ordering.yaml
```

The domain example maps real Street Deli concepts onto semantic archetypes and capabilities. For example, `MenuItem` is declared as a composable food item and receives capabilities such as `identifiable`, `labelable`, `ingredient_composable`, `configurable`, and `dietary`. `Order` is declared as a work item and timeline span. `SubstitutionRule` carries role-preserving substitution metadata.

A shortened example from `examples/street-deli-ordering/core-model/street-deli-ordering.yaml` shows the pattern:

```yaml
domain_types:
  MenuItem:
    description: Composable food item on the menu.
    archetypes:
      - MenuItem
      - ActionSpec
    capabilities:
      identifiable:
        id: menu_item_id
      labelable:
        label: item_name
        subtitle: description
      ingredient_composable:
        parts: ingredients
        part_count: ingredient_count
        required_roles: [structural, protein]
      configurable:
        config_options:
          - name: size
            values: [half, whole]
            default: whole
      dietary:
        dietary_tags: item_dietary_tags
        allergen_contains: item_allergens
```

This is not UI data. It is semantic data. It says what the object is and which meaningful capabilities it has. The later compiler passes decide that an identifiable, labelable object should have a compact reference, that a composable object should have a composition summary and edit actions, and that a stateful temporal order should have lifecycle progress.

The application author also provides an instance manifest when they want to plan concrete outputs. The Street Deli instance file is:

```text
examples/street-deli-ordering/instantiations/street-deli-ordering.yaml
```

It now uses the hard-cut compiler schema:

```yaml
semantic_root: ..
interactions_root: ../../../sources/dmeta-ir
meta_design_systems:
  web:
    root: ../meta-design-systems/web
    global_root: ../../../sources/dmeta-ir/meta-design-systems/web
  pbui:
    root: ../../../sources/dmeta-ir/meta-design-systems/pbui
targets:
  react:
    target_file: ../../../sources/dmeta-ir/meta-design-systems/web/targets/react.yaml
    output_dir: ../generated/react
  pbui_react:
    target_file: ../../../sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
    output_dir: ../generated/pbui-react
```

This manifest tells the tooling where to find semantic inputs, shared Interaction IR, Web MetaDesignSystem inputs, PBUI MetaDesignSystem inputs, and target output directories. The concrete profile path is currently passed directly to profile commands rather than through this instance manifest.

## Interaction IR: the modality-neutral bridge

PBUI does not lower directly from semantic capabilities into React components. It lowers from Interaction IR obligations. The Interaction IR package is rooted at:

```text
sources/dmeta-ir/interactions/
```

The relevant files are:

```text
sources/dmeta-ir/interactions/actions.yaml
sources/dmeta-ir/interactions/representations.yaml
sources/dmeta-ir/interactions/elaboration-rules.yaml
```

The elaboration rules define how resolved semantic facts become modality-neutral obligations. The rule file is compact and important. It contains rules such as:

```yaml
- id: identifiable_labelable_to_compact_reference
  when:
    all_capabilities: [identifiable, labelable]
  emits:
    representations: [compact_reference]
    actions: [copy_reference]

- id: inspectable_to_inspection
  when:
    all_capabilities: [inspectable]
  emits:
    representations: [inspection_entrypoint]
    actions: [inspect_subject]

- id: composable_to_composition_views
  when:
    all_capabilities: [composable]
  emits:
    representations: [composition_summary, composition_breakdown]
    actions: [remove_part, add_part]
```

This layer deliberately avoids presentation words such as component, widget, card, row, or shell. It says that an object has a `compact_reference`, not that it should be rendered as a chip. It says that an object supports `inspect_subject`, not that it should have a right-click menu. This separation makes PBUI possible because PBUI can consume actions and representations without inheriting Web-specific or React-specific assumptions.

The Go implementation for this upstream layer lives in:

```text
pkg/dmeta/interaction/model.go
pkg/dmeta/interaction/load.go
pkg/dmeta/interaction/elaborate.go
```

The PBUI commands call `interaction.LoadPackage`, `interaction.ValidatePackage`, and `interaction.ElaborateInteractions` before doing PBUI-specific work. In command code, the pattern is consistent:

```go
interactionPkg, err := interaction.LoadPackage(ctx, s.InteractionsRoot)
interactionFindings := interaction.ValidatePackage(interactionPkg)
interactionObligations, elaborationFindings := interaction.ElaborateInteractions(
    semanticPkg.CoreModel,
    resolved,
    interactionPkg,
)
```

The result is a list of `interaction.Obligation` values. Each obligation names an example id, domain type id, kind (`representation` or `action`), and obligation id. PBUI groups those obligations by example and domain type before applying PBUI lowering rules.

## The PBUI MetaDesignSystem package

The global PBUI package lives at:

```text
sources/dmeta-ir/meta-design-systems/pbui/
```

It contains four authored files:

```text
meta-design-system.yaml
presentation-types.yaml
lowering-rules.yaml
targets/react.yaml
```

The package entrypoint is `meta-design-system.yaml`. It declares the package id, intent, file references, and validation policy:

```yaml
id: pbui
name: Presentation Based UI MetaDesignSystem
files:
  presentation_types: ./presentation-types.yaml
  lowering_rules: ./lowering-rules.yaml
  react_target: ./targets/react.yaml
validation:
  require_unique_presentation_type_ids: true
  require_known_representations: true
  require_known_actions: true
  reject_abstract_interaction_realizations: true
```

The purpose statement in the file is accurate: PBUI is neither a React component library nor a replacement for Semantic IR or Interaction IR. It is the layer that turns Interaction IR obligations into presentation-system obligations.

## PBUI presentation types

The central PBUI schema is `presentation-types.yaml`. A presentation type is not a React component. It is a typed interface object. It describes what kind of thing will be presented, which actions and representations it realizes, which roles it contains, and how a target should think about presenter and recognizer responsibilities.

The current catalog defines six presentation types:

| Presentation type | Purpose |
| --- | --- |
| `pbui.presentation_ref` | A stable compact handle for one semantic object or selected interface object. |
| `pbui.action_presentation` | A first-class presentable object for an Interaction IR action available in context. |
| `pbui.inspector_panel` | A structured presentation that expands a selected object's facts, descriptors, and available actions. |
| `pbui.action_chooser` | A presentation for choosing enabled actions for the current object or interaction state. |
| `pbui.lifecycle_status` | A presentation for stateful and temporal lifecycle progress. |
| `pbui.composition_presentation` | A presentation for composed objects made of parts with roles, substitutions, and local edit actions. |

A presentation type has a shape like this:

```yaml
pbui.presentation_ref:
  name: Presentation Reference
  summary: Stable compact presentation of one semantic object.
  intent: >-
    Give the user a selectable, inspectable handle for an object.
  description: >-
    A presentation reference carries stable identity, label text, object type
    metadata, and capability hints.
  presents:
    object_types: []
    type_descriptors: true
    action_descriptors: false
  realizes:
    representations:
      - compact_reference
      - inspection_entrypoint
    actions:
      - inspect_subject
      - copy_reference
      - select_subject
  roles:
    - identity
    - label
    - capabilities
    - selection_state
  presenter:
    intent: >-
      Project semantic identity and human-readable label data from the domain
      object into a compact first-class presentation object.
    preferred_target_shape: selector_or_projection_hook
  recognizer:
    intent: >-
      Interpret click, keyboard selection, copy gesture, or command-line
      completion as selection, inspection, or copy-reference action requests.
    preferred_target_shape: event_adapter
```

There are two terms that appear repeatedly and should be understood precisely:

- A **presenter** is the direction from domain/session state into visible presentation data. In React, this is expected to compile into selectors, projection functions, hooks, or view-model construction.
- A **recognizer** is the direction from user interaction back into typed action requests. In React, this is expected to compile into event adapters, command parsers, action request builders, and state-machine transitions.

The current implementation does not yet define a large standalone presenter/recognizer runtime. It records presenter and recognizer intent as IR metadata and compiles first-pass targets into hooks, components, action builders, event adapters, and scaffolded runtime files. This is deliberate. The thesis-inspired model is broad, but the first implementation keeps the authored surface small until more concrete app behavior proves which concepts deserve richer schemas.

## PBUI lowering rules

The second core authored file is `lowering-rules.yaml`. A lowering rule decides when Interaction IR obligations should produce PBUI presentation obligations. Each rule has:

- `id`: stable rule id.
- `description`: concise statement of what is being lowered.
- `rationale`: why the presentation obligation exists.
- `when`: required domain types, representations, and actions.
- `emits`: PBUI presentation type ids.
- `presenter_intent`: how target presenter logic should project state.
- `recognizer_intent`: how target recognizer logic should turn interactions into action requests.

A representative rule is:

```yaml
- id: pbui.reference_for_compact_inspectable_subject
  description: Lower compact reference and inspection obligations into a selectable presentation reference.
  when:
    representations:
      - compact_reference
      - inspection_entrypoint
    actions:
      - inspect_subject
  emits:
    presentation_types:
      - pbui.presentation_ref
  presenter_intent: >-
    Project identity, label, type, and capability hints into a compact selectable presentation model.
  recognizer_intent: >-
    Treat selecting, copying, or opening the presentation as typed action requests over the underlying semantic subject.
```

The current rules are:

| Rule | Emits | Main use |
| --- | --- | --- |
| `pbui.reference_for_compact_inspectable_subject` | `pbui.presentation_ref` | Turns compact inspectable subjects into selectable references. |
| `pbui.inspector_for_inspectable_subject` | `pbui.inspector_panel` | Exposes object/type/action details for inspectable subjects. |
| `pbui.action_choices_for_reference` | `pbui.action_chooser`, `pbui.action_presentation` | Derives compatible action surfaces for compact references. |
| `pbui.lifecycle_for_order_progress` | `pbui.lifecycle_status` | Turns state/lifecycle obligations into order progress presentations. |
| `pbui.composition_for_editable_deli_item` | `pbui.composition_presentation` | Turns composition/edit obligations into structured composition presentations. |
| `pbui.substitution_actions_for_composition_parts` | `pbui.action_presentation`, `pbui.composition_presentation` | Presents substitution candidates as action-bearing choices. |
| `pbui.cart_summary_for_order_submission` | `pbui.composition_presentation`, `pbui.action_presentation` | Presents cart summaries and order submission actions. |

The rules are intentionally explanatory. The `rationale`, `presenter_intent`, and `recognizer_intent` fields survive into later plan rows and metadata. This lets a generated file explain why it exists.

## The PBUI Go model and loader

The Go model for the global PBUI package is in:

```text
pkg/dmeta/metadesign/pbui/model.go
```

The top-level struct is:

```go
type Package struct {
    Root                         string
    Meta                         MetaDesignSystemFile
    PresentationTypes            PresentationTypesFile
    LoweringRules                LoweringRulesFile
    ReactTarget                  ReactTargetFile
    DuplicatePresentationTypeIDs []string
}
```

The model mirrors the YAML files. `PresentationType` contains `Presents`, `Realizes`, roles, presenter intent, recognizer intent, notes, and an `Extra` map for experimental extension fields. `LoweringRule` contains selectors, emitted presentation types, and intent text. `ReactTargetFile` contains target defaults, file kinds, provenance, and runtime notes.

The loader is implemented in:

```text
pkg/dmeta/metadesign/pbui/load.go
```

The loader performs several important jobs:

1. It resolves the PBUI package root to an absolute path.
2. It loads `meta-design-system.yaml` and checks `artifact_type == dmeta_meta_design_system`.
3. It follows `files.presentation_types`, `files.lowering_rules`, and `files.react_target`, with default fallbacks.
4. It checks each file's `artifact_type`.
5. It scans raw YAML nodes for duplicate presentation type ids before unmarshalling into maps.

The duplicate-key scan is important. If YAML is unmarshalled directly into a Go map, duplicate keys are overwritten. That would hide an authoring error. The loader therefore scans `presentation_types` as a raw `yaml.Node` mapping and records duplicate ids in `DuplicatePresentationTypeIDs`.

## PBUI validation

The global PBUI validator is implemented in:

```text
pkg/dmeta/metadesign/pbui/validate.go
```

It exposes:

```go
func ValidatePackage(pkg *Package, interactions *interaction.Package) []validator.Finding
```

Validation has four groups:

1. `validateMeta` checks package id, summary, and intent.
2. `validatePresentationTypes` checks that the catalog is nonempty, ids are unique, prose fields exist, presenter and recognizer intent exist, and realized representations/actions are known concrete Interaction IR entries.
3. `validateLoweringRules` checks rule ids, duplicate rule ids, descriptions, rationales, presenter/recognizer intent, emitted presentation types, and selector references to Interaction IR.
4. `validateReactTarget` checks the React target id, intent, output directory, and provenance.

The validator rejects references to abstract Interaction IR actions or representations. This matters because PBUI obligations should be generated from concrete interaction obligations. A presentation type should not claim to realize an abstract action that cannot be executed.

The command wrapper is:

```text
pkg/dmeta/cmds/validate_pbui.go
```

It is exposed as:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

The command first validates Interaction IR. If Interaction IR has errors, PBUI validation stops and asks the user to run `validate-interactions`. This protects PBUI validation from reporting secondary errors caused by an invalid upstream package.

## The PBUI lowering pass

The lowering pass is implemented in:

```text
pkg/dmeta/metadesign/pbui/lower.go
```

The central output type is:

```go
type Obligation struct {
    ExampleID             string
    DomainTypeID          string
    PresentationTypeID    string
    SourceRuleID          string
    SourceRepresentations []string
    SourceActions         []string
    Description           string
    Rationale             string
    PresenterIntent       string
    RecognizerIntent      string
}
```

The lowering algorithm is straightforward and deterministic:

1. Group Interaction IR obligations by `(exampleID, domainTypeID)`.
2. For each group, record the set of representations and actions available for that domain type.
3. For each PBUI lowering rule, test whether all required representations and actions exist in the group.
4. For each emitted presentation type, create a PBUI obligation with source rule, source actions, source representations, and natural-language intent.
5. Deduplicate by `(exampleID, domainTypeID, ruleID, presentationTypeID)`.
6. Sort by example, domain type, presentation type, and rule id.

The matching function is intentionally simple:

```go
func matchesRule(rule LoweringRule, group *obligationGroup) bool {
    if len(rule.When.DomainTypes) > 0 && !contains(rule.When.DomainTypes, group.domainTypeID) {
        return false
    }
    for _, representationID := range rule.When.Representations {
        if !group.representations[representationID] {
            return false
        }
    }
    for _, actionID := range rule.When.Actions {
        if !group.actions[actionID] {
            return false
        }
    }
    return true
}
```

This first implementation uses exact requirement matching. It does not yet include scoring, rule priorities, inheritance-aware presentation selection, negative conditions, or rule composition. The current rules are small enough that exact matching is sufficient.

The command wrapper is:

```text
pkg/dmeta/cmds/lower_pbui.go
```

It is exposed as:

```bash
go run ./cmd/dmeta lower-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

For Street Deli, the current lower command emits 41 PBUI obligation rows. By presentation type, the distribution is:

| Presentation type | Rows |
| --- | ---: |
| `pbui.action_chooser` | 8 |
| `pbui.action_presentation` | 9 |
| `pbui.composition_presentation` | 3 |
| `pbui.inspector_panel` | 8 |
| `pbui.lifecycle_status` | 5 |
| `pbui.presentation_ref` | 8 |

These are abstract obligations. They do not know whether the app will be a command-line UI, a CLIM browser, or a React component tree. They only know that particular semantic domain types deserve particular PBUI presentation obligations.

## Descriptor derivation

The PBUI React target needs descriptors for object types and actions. Those descriptors are derived, not authored. The code is in:

```text
pkg/dmeta/metadesign/pbui/descriptors.go
```

There are two descriptor types:

```go
type ObjectTypeDescriptor struct {
    ExampleID              string
    ID                     string
    Description            string
    Archetypes             []string
    Capabilities           []string
    CapabilityDescriptions map[string]string
    Projections            map[string]ProjectionDescriptor
    Provenance             DescriptorProvenance
}

type ActionDescriptor struct {
    ID              string
    Intent          string
    Description     string
    LongDescription string
    Extends         []string
    Abstract        bool
    Inputs          map[string]interaction.ActionInput
    Effects         interaction.ActionEffects
    Result          validator.ActionResult
    Safety          interaction.ActionSafety
    Notes           string
    Provenance      DescriptorProvenance
}
```

`DeriveObjectTypeDescriptors` walks semantic domain examples and computes effective archetypes, capabilities, inherited capability descriptions, and projection descriptors from the resolved semantic model. `DeriveActionDescriptors` walks Interaction IR actions and copies action metadata into PBUI/target-facing descriptors.

The design rule is that PBUI should not ask authors to duplicate action and type taxonomies. Semantic IR already owns object types and capabilities. Interaction IR already owns actions. PBUI derives descriptors so targets can make those objects and actions inspectable.

The descriptors are used by the generic PBUI React target to generate registry files:

```text
registries/objectTypes.ts
registries/actions.ts
```

They can also support future concrete app behavior, especially help views, inspector panels, command palettes, and Storybook docs.

## Generic PBUI React target

The global PBUI target file is:

```text
sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
```

It defines a generic buildable scaffold target:

```yaml
id: react
defaults:
  output_dir: ./generated/pbui-react
  package_name: dmeta-pbui-react
  storybook: true
  metadata_sidecars: true
  dry_run_first: true
file_kinds:
  - package_json
  - tsconfig
  - object_type_registry
  - action_descriptor_registry
  - presentation_type_registry
  - session_slice
  - selectors
  - presenter_hook
  - action_request_builder
  - event_adapter
  - command_parser
  - component
  - metadata
  - stories
  - README
```

This target is not the final Street Deli app. It is a generic target-owned scaffold that proves the PBUI obligations can become React/TypeScript artifacts.

The planner is implemented in:

```text
pkg/dmeta/metadesign/pbui/react_plan.go
```

It produces a `ReactPlan`:

```go
type ReactPlan struct {
    TargetID          string
    MetaDesignSystem  string
    OutputDir         string
    PackageName       string
    ObjectDescriptors []ObjectTypeDescriptor
    ActionDescriptors []ActionDescriptor
    PresentationPlans []PresentationPlan
    Files             []ReactPlannedFile
}
```

The planner groups PBUI obligations by presentation type. Each `PresentationPlan` aggregates source domain types, source rules, source representations, source actions, description, rationale, presenter intent, recognizer intent, and planned files. The component name is derived from the presentation type id. For example:

| Presentation type | Generic component name |
| --- | --- |
| `pbui.presentation_ref` | `PbuiPresentationRef` |
| `pbui.action_presentation` | `PbuiActionPresentation` |
| `pbui.composition_presentation` | `PbuiCompositionPresentation` |

The planner then emits registry/runtime files and per-presentation files based on the target `file_kinds`.

For Street Deli, `plan-pbui-react` currently emits 41 file rows. By file kind:

| File kind | Rows |
| --- | ---: |
| `package_json` | 1 |
| `tsconfig` | 1 |
| `object_type_registry` | 1 |
| `action_descriptor_registry` | 1 |
| `presentation_type_registry` | 1 |
| `session_slice` | 1 |
| `selectors` | 1 |
| `action_request_builder` | 1 |
| `event_adapter` | 1 |
| `command_parser` | 1 |
| `README` | 1 |
| `presenter_hook` | 6 |
| `component` | 6 |
| `metadata` | 6 |
| `stories` | 6 |
| `barrel` | 6 |

The command is:

```bash
go run ./cmd/dmeta plan-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

The renderer is implemented in:

```text
pkg/dmeta/metadesign/pbui/react_render.go
```

It renders:

- `package.json`
- `tsconfig.json`
- object type registry
- action descriptor registry
- presentation type registry
- PBUI session slice
- selector stubs
- action request builder
- event adapters
- command parser
- README
- presenter hooks
- components
- metadata sidecars
- stories
- barrel files

The writer is implemented in:

```text
pkg/dmeta/metadesign/pbui/react_write.go
```

It supports:

- `DryRun`
- `Force`
- `MetadataOnly`
- `skip-existing` behavior when not forced

The command wrapper is:

```text
pkg/dmeta/cmds/scaffold_pbui_react.go
```

It is exposed as:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --dry-run \
  --output table
```

The generated generic package lives at:

```text
examples/street-deli-ordering/generated/pbui-react/
```

It is buildable with:

```bash
cd examples/street-deli-ordering/generated/pbui-react
npm ci --no-audit --no-fund
npm run build
```

## Why the generic scaffold was not enough

The generic scaffold proves the PBUI MetaDesignSystem works as a compiler layer. It does not define the concrete user interface for Street Deli.

The missing questions were:

- What visual style does the app use?
- What shell regions exist?
- Where do command lines and action bars live?
- Which concrete views exist?
- Which concrete component implements each presentation type?
- Which Storybook stories are needed for review?
- Which fonts and CSS should be copied?
- Where should the final promoted app live?

The generic PBUI React target cannot answer those questions because those questions belong to a concrete presentation system. That led to the concrete PBUI presentation profile package.

## Concrete Street Deli PBUI profile package

The local concrete profile lives at:

```text
examples/street-deli-ordering/meta-design-systems/pbui/
```

It contains six authored files:

```text
presentation-system.yaml
style-profile.yaml
surfaces.yaml
view-models.yaml
presentation-bindings.yaml
targets/react-app.yaml
```

The profile package is local to Street Deli because it encodes the concrete monochrome CLIM-like browser experience from:

```text
examples/street-deli-ordering/prototype-clim/
```

It also references the Readwise Viewer CLIM runtime as an architectural source:

```text
/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/
```

The profile entrypoint is `presentation-system.yaml`. It declares:

- profile id: `street_deli_clim`
- inherited MetaDesignSystem: `pbui`
- PBUI root reference
- visual reference files
- runtime reference files
- local profile catalog file references
- validation expectations

The `files` block is the local profile equivalent of a package manifest:

```yaml
files:
  style_profile: ./style-profile.yaml
  surfaces: ./surfaces.yaml
  view_models: ./view-models.yaml
  presentation_bindings: ./presentation-bindings.yaml
  react_app_target: ./targets/react-app.yaml
```

## Style profile

The style file is:

```text
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
```

It captures the concrete visual grammar of the Street Deli CLIM prototype. It includes:

- color tokens: black background, gray foreground, bright foreground, selection background, red select-mode target.
- typography tokens: Berkeley Mono family and font assets.
- spacing tokens: page padding, command bar padding, presentation block padding, indentation.
- class mappings: `clim-shell`, `header`, `main`, `cmd-bar`, `pres`, `selected`, `selectable`, `select-disabled`, `command-line`, and others.
- state style descriptions for `normal`, `select`, and `confirm`.

This file matters because it prevents visual decisions from being hidden in React components. A target can inspect style tokens and class semantics before rendering.

## Surface profile

The surface file is:

```text
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
```

It describes the concrete shell. The main surfaces are:

| Surface | Component | Purpose |
| --- | --- | --- |
| `shell` | `ClimShell` | Root application frame with header, active view, overlays, and command-line footer. |
| `header` | `ClimHeader` | Brand and current mode label. |
| `view` | `ClimViewFrame` | Reusable active-view frame with command echo, presentation area, and action bar. |
| `command_line` | `ClimCommandLine` | Persistent command buffer, result line, and hint surface. |
| `context_menu` | `ClimContextMenu` | Pointer-invoked compatible-action menu. |
| `confirm_prompt` | `ClimConfirmPrompt` | Confirmation surface for dangerous actions. |
| `help_surface` | `ClimHelpSurface` | Documentation surface for actions, presentation types, and keyboard grammar. |

This file is about placement and shell structure. It does not define domain objects and it does not define PBUI presentation types.

## View models

The view model file is:

```text
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
```

It defines six concrete Street Deli CLIM views:

| View | Mode label | Source prototype renderer | Purpose |
| --- | --- | --- | --- |
| `menu` | `MENU` | `renderMenu` | Browse menu items by category. |
| `detail` | `DETAIL` | `renderDetail` | Customize a selected menu item. |
| `substitution` | `SUBSTITUTION` | profile-defined | Present substitution candidates. |
| `cart` | `CART` | `renderCart` | Review cart items and submit order. |
| `help` | `HELP` | `renderHelp` | Present action and command documentation. |
| `tracker` | `TRACKER` | `renderTracker` | Track order lifecycle progress. |

Each view declares `primary_presentations`. For example, `menu` includes:

```yaml
primary_presentations:
  - pbui.presentation_ref
  - pbui.action_chooser
  - pbui.action_presentation
```

This means profile instantiation will place matching PBUI obligations into that view. If a PBUI obligation emits `pbui.lifecycle_status`, it will not appear in `menu` unless `menu.primary_presentations` includes it. This is the main local control point for view-level presentation organization.

## Presentation bindings

The binding file is:

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
```

It maps abstract PBUI presentation types to concrete renderer components and style/event semantics:

| PBUI presentation type | Concrete component |
| --- | --- |
| `pbui.presentation_ref` | `PresentationRefLine` |
| `pbui.action_presentation` | `ActionPresentationInline` |
| `pbui.action_chooser` | `ActionHintBar` |
| `pbui.inspector_panel` | `InspectorPanelBlock` |
| `pbui.lifecycle_status` | `LifecycleStatusBlock` |
| `pbui.composition_presentation` | `CompositionPresentationBlock` |

Bindings include display decisions, placement hints, class mappings, event bindings, data attributes, and subpresentation components. For example, `pbui.presentation_ref` says that a presentation ref is block-oriented, shows a type tag and id, uses classes such as `pres`, `pres-block`, `selected`, `selectable`, and `select-disabled`, and binds click/context-menu interactions to selection and compatible action menus.

This file is the main bridge between abstract PBUI and a concrete graphical presentation system.

## Concrete React app target

The concrete React app target file is:

```text
examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
```

It describes the buildable app target, not the generic PBUI package target. It includes:

- default output directory: `../../www/clim-react`
- package name: `street-deli-clim-react`
- Vite and Storybook flags
- app file kinds
- Storybook file kinds
- planned component groups
- runtime contract
- provenance

The file kinds now include both app files and Storybook files:

```yaml
file_kinds:
  - package_json
  - tsconfig
  - vite_config
  - index_html
  - main_tsx
  - app_shell
  - storybook_main
  - storybook_preview
  - storybook_preview_css
  - storybook_story_shell
  - storybook_fixtures
  - clim_types
  - clim_store
  - clim_actions
  - clim_commands
  - clim_selectors
  - clim_runtime
  - style_profile_css
  - font_assets
  - generated_registry_copy
  - shell_component
  - shell_story
  - command_line_component
  - command_line_story
  - command_bar_component
  - command_bar_story
  - presentation_component
  - presentation_story
  - action_presentation_component
  - action_presentation_story
  - context_menu_component
  - context_menu_story
  - confirm_prompt_component
  - confirm_prompt_story
  - view_component
  - view_story
  - metadata
```

Storybook is not an afterthought. It is part of the target because a presentation system needs a review surface. The scaffold now generates stories for shell components, command surfaces, presentation components, action presentation components, and each concrete view.

## Concrete profile Go model, loader, and validator

The concrete profile Go package is:

```text
pkg/dmeta/metadesign/pbui/profile/
```

The model is in:

```text
pkg/dmeta/metadesign/pbui/profile/model.go
```

The top-level struct is:

```go
type Package struct {
    Root                 string
    Meta                 PresentationSystemFile
    Style                StyleProfileFile
    Surfaces             SurfacesFile
    ViewModels           ViewModelsFile
    PresentationBindings PresentationBindingsFile
    ReactAppTarget       ReactAppTargetFile
}
```

The loader is:

```text
pkg/dmeta/metadesign/pbui/profile/load.go
```

It loads `presentation-system.yaml`, checks its artifact type, follows the declared file references, and checks artifact types for all referenced catalogs.

The validator is:

```text
pkg/dmeta/metadesign/pbui/profile/validate.go
```

It validates:

- profile id and prose fields.
- inherited MetaDesignSystem id.
- file references.
- style token groups and required classes.
- state styles for `normal`, `select`, and `confirm`.
- required surfaces: `shell`, `view`, `command_line`.
- surface and region component names.
- view mode labels and presenter/recognizer intent.
- view `primary_presentations` references to known PBUI presentation types.
- presentation binding ids and component names.
- React app target id, output directory, provenance, and runtime states.

The command wrapper is:

```text
pkg/dmeta/cmds/validate_pbui_profile.go
```

The command is:

```bash
go run ./cmd/dmeta validate-pbui-profile \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

The command validates Interaction IR first, then the abstract PBUI package, then the concrete profile. This ordering matters. A concrete profile that references a PBUI presentation type should not be evaluated against an invalid PBUI catalog.

## Concrete profile instantiation

The concrete instantiation pass is implemented in:

```text
pkg/dmeta/metadesign/pbui/profile/instantiate.go
```

It produces a target-neutral `ConcretePresentationPlan`:

```go
type ConcretePresentationPlan struct {
    ProfileID      string
    ProfileName    string
    StyleProfileID string
    ReactTargetID  string
    RuntimeStates  []string
    Views          []ConcreteViewPlan
}
```

Each view contains concrete presentation instances:

```go
type ConcretePresentationInstance struct {
    ViewID                string
    ModeLabel             string
    SurfaceID             string
    SurfaceComponent      string
    PresentationTypeID    string
    Component             string
    DomainTypes           []string
    SourceRules           []string
    SourceRepresentations []string
    SourceActions         []string
    PresenterIntent       string
    RecognizerIntent      string
    StyleProfileID        string
}
```

The algorithm is:

1. Sort concrete view ids from the profile.
2. For each view, look at its `primary_presentations` list.
3. Group abstract PBUI obligations whose presentation type appears in that view.
4. Look up the concrete binding for that presentation type.
5. Resolve placement hints into concrete surface ids.
6. Create concrete presentation instances with domain types, source rules, source representations, source actions, style profile, component name, and joined presenter/recognizer intent.

This pass does not plan React files. It answers presentation-system questions: which view, which surface, which component, which style profile. React app planning happens after this.

The command wrapper is:

```text
pkg/dmeta/cmds/instantiate_pbui.go
```

The command is:

```bash
go run ./cmd/dmeta instantiate-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output table
```

For Street Deli, this currently emits 15 concrete presentation rows:

| Presentation type | Concrete rows |
| --- | ---: |
| `pbui.action_chooser` | 1 |
| `pbui.action_presentation` | 6 |
| `pbui.composition_presentation` | 3 |
| `pbui.inspector_panel` | 1 |
| `pbui.lifecycle_status` | 1 |
| `pbui.presentation_ref` | 3 |

The number is lower than the abstract PBUI obligation count because profile instantiation groups obligations by view and presentation type.

## Concrete React app planning

The concrete React app planner is implemented in:

```text
pkg/dmeta/metadesign/pbui/profile/react_app_plan.go
```

It consumes `ConcretePresentationPlan`, not raw PBUI obligations. This is the key distinction from the generic PBUI React planner. Because it consumes the concrete plan, it can plan files that know about Street Deli views, CLIM shell components, command surfaces, fonts, Storybook, and concrete renderer names.

The output type is:

```go
type ReactAppPlan struct {
    TargetID       string
    OutputDir      string
    PackageName    string
    ProfileID      string
    StyleProfileID string
    Files          []ReactAppPlannedFile
}
```

A planned file includes path, kind, symbol, optional view/component/presentation context, surface id, and provenance:

```go
type ReactAppPlannedFile struct {
    Path               string
    Kind               string
    Symbol             string
    ViewID             string
    Component          string
    PresentationTypeID string
    SurfaceID          string
    Provenance         ReactAppFileProvenance
}
```

For Street Deli, the current app planner emits 63 rows. By file kind:

| File kind | Rows |
| --- | ---: |
| `package_json` | 1 |
| `tsconfig` | 1 |
| `vite_config` | 1 |
| `index_html` | 1 |
| `main_tsx` | 1 |
| `app_shell` | 1 |
| `storybook_main` | 1 |
| `storybook_preview` | 1 |
| `storybook_preview_css` | 1 |
| `storybook_story_shell` | 1 |
| `storybook_fixtures` | 1 |
| `clim_types` | 1 |
| `clim_store` | 1 |
| `clim_actions` | 1 |
| `clim_commands` | 1 |
| `clim_selectors` | 1 |
| `clim_runtime` | 1 |
| `style_profile_css` | 1 |
| `font_assets` | 3 |
| `generated_registry_copy` | 1 |
| `metadata` | 1 |
| `shell_component` | 3 |
| `shell_story` | 3 |
| `command_line_component` | 1 |
| `command_line_story` | 1 |
| `command_bar_component` | 2 |
| `command_bar_story` | 2 |
| `context_menu_component` | 1 |
| `context_menu_story` | 1 |
| `confirm_prompt_component` | 1 |
| `confirm_prompt_story` | 1 |
| `presentation_component` | 5 |
| `presentation_story` | 5 |
| `action_presentation_component` | 1 |
| `action_presentation_story` | 1 |
| `view_component` | 6 |
| `view_story` | 6 |

The command wrapper is:

```text
pkg/dmeta/cmds/plan_pbui_react_app.go
```

The command is:

```bash
go run ./cmd/dmeta plan-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --output table
```

This command is the review point before writing the real app scaffold.

## Concrete React app scaffolding

The renderer and writer for the concrete app are implemented in:

```text
pkg/dmeta/metadesign/pbui/profile/react_app_render.go
pkg/dmeta/metadesign/pbui/profile/react_app_write.go
```

The command wrapper is:

```text
pkg/dmeta/cmds/scaffold_pbui_react_app.go
```

The command is:

```bash
go run ./cmd/dmeta scaffold-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir examples/street-deli-ordering/www/clim-react \
  --output table
```

The command supports:

- `--dry-run`: report file writes and font copies without writing.
- `--force`: overwrite existing files.
- `--output-dir`: override the target output directory.

There is one path semantics detail that matters. If no `--output-dir` is supplied, the profile default `../../www/clim-react` is resolved relative to the profile root. If an explicit `--output-dir` is supplied, it is treated as a normal command-working-directory path. This prevents explicit CLI paths from being incorrectly nested under the profile directory.

The generated app is:

```text
examples/street-deli-ordering/www/clim-react/
```

It contains:

```text
.storybook/main.ts
.storybook/preview.tsx
.storybook/preview.css
fonts/BerkeleyMono-Regular.woff2
fonts/BerkeleyMono-Bold.woff2
fonts/BerkeleyMono-Oblique.woff2
index.html
package.json
package-lock.json
tsconfig.json
vite.config.ts
src/App.tsx
src/main.tsx
src/clim/*.ts
src/components/**/*.{tsx,stories.tsx}
src/fixtures/presentationFixtures.ts
src/generated/concretePresentationPlan.metadata.json
src/generated/pbuiRegistries.ts
src/styles/clim.css
src/views/*.{tsx,stories.tsx}
```

This app is currently a scaffold. It is buildable and Storybook-enabled, but its runtime and renderers are placeholders. The next development phase should replace placeholder behavior with real Street Deli CLIM state, data, actions, command parsing, selection, context menus, and view rendering.

## Storybook as part of the PBUI result

Storybook is now part of the concrete app target because PBUI is a presentation-system compiler. A presentation system needs a review surface where each component and state can be inspected independently.

The generated Storybook files include:

```text
.storybook/main.ts
.storybook/preview.tsx
.storybook/preview.css
src/components/storybook/ClimStoryShell.tsx
src/fixtures/presentationFixtures.ts
```

`ClimStoryShell` gives every story the same black CLIM shell, mode label, main region, and command-line footer. Component stories import it so stories show components in the correct visual context.

Generated story families include:

- shell stories: `ClimShell`, `ClimHeader`, `ClimMain`.
- command stories: `ClimCommandBar`, `ClimCommandLine`, `ActionHintBar`, `ClimContextMenu`, `ClimConfirmPrompt`.
- presentation stories: `PresentationRefLine`, `ActionPresentationInline`, `CompositionPresentationBlock`, `InspectorPanelBlock`, `LifecycleStatusBlock`.
- view stories: `MenuView`, `DetailView`, `SubstitutionView`, `CartView`, `HelpView`, `TrackerView`.

The current stories are basic. They prove that the generated story graph builds. They should become richer visual parity fixtures as the app runtime becomes real.

## What gets generated from what

The current system has several generated outputs. The following table maps source inputs to generated artifacts.

| Source input | Compiler function/command | Output |
| --- | --- | --- |
| Semantic IR domain examples | `pbui.DeriveObjectTypeDescriptors` | Object descriptor registry for generic PBUI React target. |
| Interaction IR action catalog | `pbui.DeriveActionDescriptors` | Action descriptor registry for generic PBUI React target. |
| Interaction obligations + PBUI lowering rules | `pbui.Lower` / `lower-pbui` | Abstract PBUI obligations. |
| PBUI obligations + PBUI React target | `pbui.BuildReactPlan` / `plan-pbui-react` | Generic PBUI React file plan. |
| Generic PBUI React file plan | `pbui.RenderReactPlan`, `pbui.WriteReactFiles` / `scaffold-pbui-react` | `generated/pbui-react` package. |
| PBUI obligations + Street Deli profile | `profile.InstantiateProfile` / `instantiate-pbui` | Concrete presentation plan. |
| Concrete presentation plan + React app target | `profile.BuildReactAppPlan` / `plan-pbui-react-app` | Concrete app file plan. |
| Concrete app file plan | `profile.RenderReactAppFile`, `profile.WriteReactAppPlan` / `scaffold-pbui-react-app` | `www/clim-react` app scaffold. |

The important difference is between `generated/pbui-react` and `www/clim-react`:

- `generated/pbui-react` is a generic target package. It preserves PBUI concepts in generated TypeScript and metadata.
- `www/clim-react` is a concrete app scaffold. It applies a concrete profile and produces app shell, views, fonts, CSS, fixtures, and stories.

## Full workflow from app idea to PBUI React result

The current application workflow has nine stages.

### Stage 1: Describe the domain in Semantic IR

The application author writes or extends semantic files under the app root. For Street Deli, the author maps domain types such as `MenuItem`, `Ingredient`, `SubstitutionRule`, `Order`, `OrderItem`, and `PrepEvent` onto archetypes and capabilities.

The author must fill in:

- app package entrypoint (`01-core-model.yaml` or equivalent).
- local archetypes if the global vocabulary lacks a domain concept.
- local capabilities if the global vocabulary lacks a semantic behavior.
- domain example mappings from domain type to archetypes/capabilities.
- concrete fields used by capabilities.

The author does not write PBUI obligations manually.

Validation command:

```bash
go run ./cmd/dmeta validate-ir \
  --root ./examples/street-deli-ordering \
  --include-info \
  --output table
```

### Stage 2: Validate Interaction IR

The global Interaction IR package defines the available actions, representations, and elaboration rules.

Validation command:

```bash
go run ./cmd/dmeta validate-interactions \
  --root ./sources/dmeta-ir \
  --include-info \
  --output table
```

### Stage 3: Elaborate interactions

The compiler resolves semantic inheritance and applies `interactions/elaboration-rules.yaml`. This emits modality-neutral obligations.

Command:

```bash
go run ./cmd/dmeta elaborate-interactions \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --output table
```

This stage answers: which actions and representations are implied by the semantic domain model?

### Stage 4: Validate the PBUI MetaDesignSystem

The PBUI package must reference known concrete Interaction IR actions and representations.

Command:

```bash
go run ./cmd/dmeta validate-pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

This stage answers: is the global PBUI presentation-system catalog internally valid and compatible with Interaction IR?

### Stage 5: Lower Interaction IR obligations into PBUI obligations

Command:

```bash
go run ./cmd/dmeta lower-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

This stage answers: which abstract PBUI presentation types should exist for the app's semantic domain types?

### Stage 6A: Generate the generic PBUI React scaffold

This path is useful when developing the PBUI MetaDesignSystem itself.

Plan command:

```bash
go run ./cmd/dmeta plan-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --output table
```

Scaffold command:

```bash
go run ./cmd/dmeta scaffold-pbui-react \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --dry-run=false \
  --force \
  --output table
```

Build command:

```bash
cd examples/street-deli-ordering/generated/pbui-react
npm ci --no-audit --no-fund
npm run build
```

This stage answers: can abstract PBUI obligations become a buildable React/TypeScript package with descriptors and metadata?

### Stage 6B: Author a concrete PBUI profile

This path is necessary when building a real application. For Street Deli, the profile lives under:

```text
examples/street-deli-ordering/meta-design-systems/pbui/
```

The application/profile author fills in:

- `presentation-system.yaml`: profile entrypoint and references.
- `style-profile.yaml`: tokens, fonts, classes, interaction state styles.
- `surfaces.yaml`: shell, header, view, command line, context menu, confirm prompt.
- `view-models.yaml`: concrete views and their primary presentation types.
- `presentation-bindings.yaml`: mapping from PBUI presentation types to concrete components.
- `targets/react-app.yaml`: concrete app file kinds, component groups, runtime contract, Storybook output.

Validation command:

```bash
go run ./cmd/dmeta validate-pbui-profile \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --interactions-root ./sources/dmeta-ir \
  --include-info \
  --output table
```

This stage answers: is the concrete presentation profile compatible with the global PBUI package?

### Stage 7: Instantiate the concrete profile

Command:

```bash
go run ./cmd/dmeta instantiate-pbui \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output table
```

This stage answers: which concrete views, surfaces, components, and style profile entries realize the app's PBUI obligations?

### Stage 8: Plan the concrete React app

Command:

```bash
go run ./cmd/dmeta plan-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir ./examples/street-deli-ordering/www/clim-react \
  --output table
```

This stage answers: which files will be written for the concrete app, and what does each file represent?

### Stage 9: Scaffold and build the concrete React app

Command:

```bash
go run ./cmd/dmeta scaffold-pbui-react-app \
  --root ./examples/street-deli-ordering \
  --interactions-root ./sources/dmeta-ir \
  --pbui-root ./sources/dmeta-ir/meta-design-systems/pbui \
  --profile-root ./examples/street-deli-ordering/meta-design-systems/pbui \
  --output-dir examples/street-deli-ordering/www/clim-react \
  --output table
```

Build commands:

```bash
cd examples/street-deli-ordering/www/clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook
```

This stage answers: can the concrete profile become a buildable application and Storybook review surface?

## What the application user must fill in

A user who wants to build a new PBUI app must fill in different things depending on how far they want to go.

For a generic PBUI scaffold, the user must provide:

1. A valid Semantic IR package.
2. Domain examples mapping domain types to archetypes and capabilities.
3. Any local archetypes/capabilities needed by the domain.
4. An instance/output path or direct CLI `--root`/`--output-dir` values.

The user does not need a concrete PBUI profile for the generic `generated/pbui-react` path.

For a concrete app like Street Deli CLIM, the user must additionally provide:

1. A concrete profile entrypoint: `presentation-system.yaml`.
2. A style profile with tokens, fonts, classes, and interaction state style descriptions.
3. A surface catalog that names shell regions and concrete surface components.
4. A view model catalog that names concrete app views and lists which PBUI presentation types belong in each view.
5. Presentation bindings that map abstract PBUI presentation types to concrete renderer components.
6. A target app config that names file kinds, planned components, runtime contract, output directory, and Storybook expectations.

Street Deli currently fills those files under:

```text
examples/street-deli-ordering/meta-design-systems/pbui/
```

The user should not fill in derived PBUI obligations manually. They should not duplicate action descriptors if those actions already live in Interaction IR. They should not duplicate object type descriptors if those object types already live in Semantic IR. The compiler derives those.

## What the compiler derives

The compiler currently derives these artifacts:

- Interaction obligations from Semantic IR and Interaction IR elaboration rules.
- PBUI obligations from Interaction obligations and PBUI lowering rules.
- Object descriptors from Semantic IR domain examples and resolved inheritance.
- Action descriptors from Interaction IR actions.
- Generic PBUI React plans from PBUI obligations and target file kinds.
- Generic PBUI React files from the generic React plan.
- Concrete presentation plans from PBUI obligations and a concrete profile.
- Concrete React app plans from concrete presentation plans and a concrete React app target.
- Concrete app files and Storybook stories from the concrete React app plan.

This separation is important because it keeps the authored input surface smaller than the generated output surface. The user fills in domain meaning and concrete profile choices. The compiler derives repetitive glue.

## Current generated app status

The concrete app at:

```text
examples/street-deli-ordering/www/clim-react/
```

is a buildable scaffold. It is not yet the full Street Deli CLIM runtime.

It already has:

- package and Vite configuration.
- Storybook configuration.
- Berkeley Mono fonts.
- CLIM CSS tokens/classes.
- placeholder CLIM runtime modules.
- generated metadata and registry placeholders.
- fixtures.
- shell, command, presentation, and view components.
- Storybook stories for shell, command, presentation, and view components.

It does not yet have:

- real Street Deli domain data ported from `prototype-clim/js/data.js`.
- a complete React reducer/store for normal/select/confirm interaction states.
- real command parsing and execution.
- real compatible-action derivation.
- real `PresentationRef` generation from app state.
- real context menu behavior.
- real select-mode and confirm-mode flows.
- full `MenuView`, `DetailView`, `SubstitutionView`, `CartView`, `HelpView`, and `TrackerView` behavior.
- visual parity review against `prototype-clim` screenshots.

This is the correct current state. The scaffold proves the compiler path and gives the team a concrete workspace for the next implementation phase.

## Validation and test coverage

The current PBUI work includes unit tests and golden fixtures in:

```text
pkg/dmeta/metadesign/pbui/*_test.go
pkg/dmeta/metadesign/pbui/testdata/*.golden.json
pkg/dmeta/metadesign/pbui/profile/*_test.go
```

The tests cover:

- loading and validating the global PBUI package.
- duplicate presentation type detection.
- PBUI lowering behavior.
- descriptor derivation.
- React plan construction.
- render output for generated PBUI scaffold files.
- golden validation/lowering/metadata outputs.
- concrete profile loading and validation.
- rejection of unknown binding presentation types.
- concrete profile instantiation for Street Deli.
- concrete React app planning for Street Deli.

The broad validation command is:

```bash
go test ./pkg/dmeta/... ./cmd/dmeta -count=1
```

The current app build validation is:

```bash
cd examples/street-deli-ordering/generated/pbui-react
npm ci --no-audit --no-fund
npm run build

cd examples/street-deli-ordering/www/clim-react
npm ci --no-audit --no-fund
npm run build
npm run build-storybook

cd examples/street-deli-ordering/www/mobile-react
npm run build
```

Build directories, `node_modules`, Storybook static output, and TypeScript build info are ignored by `.gitignore`.

## Implementation decisions and their consequences

### PBUI is not Web

PBUI is a presentation-system layer, not a Web widget layer. It does not own cards, rows, buttons, drawers, or CSS. Those belong to Web or concrete profile/target layers. PBUI owns presentation references, action presentations, inspector panels, action choosers, lifecycle status presentations, and composition presentations.

### Widgets remain Web-specific

The earlier hard cutover moved widgets into the Web MetaDesignSystem. PBUI does not reintroduce universal widgets. A PBUI presentation type can later be rendered as a React component, terminal line, voice prompt, or other target artifact.

### Actions and object types are derived

The implementation derives object descriptors from Semantic IR and action descriptors from Interaction IR. This avoids a duplicate PBUI action/type taxonomy.

### Presenter and recognizer are intent fields first

The first implementation records presenter and recognizer intent but does not create a full presenter/recognizer runtime database. React targets currently compile the concept into selectors, hooks, event adapters, action request builders, and scaffolded runtime files.

### The concrete profile is local first

The Street Deli CLIM profile is local to `examples/street-deli-ordering`. It should become global only if another app reuses the same presentation system. This avoids prematurely generalizing the exact prototype-clim visual grammar.

### Storybook is a target artifact

Storybook stories are generated by the concrete React app target. They are not PBUI concepts. They are a review surface for one rendered target.

## Known limitations

The current implementation is intentionally first-pass. The limitations are clear:

1. PBUI lowering uses exact set matching. It does not yet support priorities, negative conditions, scoring, or rule inheritance.
2. Presentation types are not yet an inheritance hierarchy. They are flat ids with explanatory metadata.
3. Presenter and recognizer schemas are prose-heavy and implementation-light.
4. The generic PBUI React scaffold is buildable but not a polished runtime.
5. The concrete `www/clim-react` app is buildable but mostly placeholder behavior.
6. The concrete profile path is not yet wired through instance manifests; commands accept `--profile-root` directly.
7. The concrete React app renderer emits simple placeholder components rather than translating prototype-clim behavior.
8. Storybook stories are basic generated variants, not final visual parity stories.
9. The app does not yet consume generated metadata deeply beyond writing registry/metadata placeholder files.
10. The runtime does not yet implement real normal/select/confirm state transitions.

These limitations do not undermine the architecture. They define the next work.

## Next implementation work

The next work should happen in this order:

1. Port real Street Deli data into `www/clim-react/src/data/`.
2. Implement real `PresentationRef` creation functions for menu items, ingredients, substitutions, cart items, orders, and actions.
3. Implement a React reducer/store for normal/select/confirm state.
4. Implement real action registry and compatible-action derivation.
5. Implement command parser and command dispatch.
6. Replace placeholder presentation components with real renderer logic.
7. Replace placeholder view components with real `MenuView`, `DetailView`, `SubstitutionView`, `CartView`, `HelpView`, and `TrackerView` behavior.
8. Expand Storybook fixtures and variants to cover real data and states.
9. Run visual parity review against `prototype-clim`.
10. Decide which successful hand-authored patterns should be backfilled into scaffold generation.

The most important first milestone is an interactive `MenuView` with real presentation selection and action chooser behavior. Once that exists, the other views can reuse the same state and presentation primitives.

## File index

The following file index is the practical reference for implementation work.

### Global PBUI IR

```text
sources/dmeta-ir/meta-design-systems/pbui/meta-design-system.yaml
sources/dmeta-ir/meta-design-systems/pbui/presentation-types.yaml
sources/dmeta-ir/meta-design-systems/pbui/lowering-rules.yaml
sources/dmeta-ir/meta-design-systems/pbui/targets/react.yaml
```

### Street Deli concrete PBUI profile

```text
examples/street-deli-ordering/meta-design-systems/pbui/presentation-system.yaml
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
examples/street-deli-ordering/meta-design-systems/pbui/surfaces.yaml
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
examples/street-deli-ordering/meta-design-systems/pbui/presentation-bindings.yaml
examples/street-deli-ordering/meta-design-systems/pbui/targets/react-app.yaml
```

### Global PBUI Go package

```text
pkg/dmeta/metadesign/pbui/model.go
pkg/dmeta/metadesign/pbui/load.go
pkg/dmeta/metadesign/pbui/validate.go
pkg/dmeta/metadesign/pbui/lower.go
pkg/dmeta/metadesign/pbui/descriptors.go
pkg/dmeta/metadesign/pbui/react_plan.go
pkg/dmeta/metadesign/pbui/react_render.go
pkg/dmeta/metadesign/pbui/react_write.go
```

### Concrete profile Go package

```text
pkg/dmeta/metadesign/pbui/profile/model.go
pkg/dmeta/metadesign/pbui/profile/load.go
pkg/dmeta/metadesign/pbui/profile/validate.go
pkg/dmeta/metadesign/pbui/profile/instantiate.go
pkg/dmeta/metadesign/pbui/profile/react_app_plan.go
pkg/dmeta/metadesign/pbui/profile/react_app_render.go
pkg/dmeta/metadesign/pbui/profile/react_app_write.go
```

### PBUI CLI commands

```text
pkg/dmeta/cmds/validate_pbui.go
pkg/dmeta/cmds/lower_pbui.go
pkg/dmeta/cmds/plan_pbui_react.go
pkg/dmeta/cmds/scaffold_pbui_react.go
pkg/dmeta/cmds/validate_pbui_profile.go
pkg/dmeta/cmds/instantiate_pbui.go
pkg/dmeta/cmds/plan_pbui_react_app.go
pkg/dmeta/cmds/scaffold_pbui_react_app.go
cmd/dmeta/main.go
```

### Generated outputs

```text
examples/street-deli-ordering/generated/pbui-react/
examples/street-deli-ordering/www/clim-react/
```

## Closing summary

The PBUI MetaDesignSystem now has a complete first-pass compiler path. Semantic IR describes Street Deli domain objects. Interaction IR derives modality-neutral actions and representations. PBUI lowering turns those into presentation-system obligations. The generic PBUI React target turns those obligations into an inspectable buildable package. The concrete Street Deli PBUI profile then applies a CLIM-like presentation system with specific style, surfaces, views, component bindings, and app target metadata. The concrete React app planner and scaffold command turn that profile into a buildable Vite/React/Storybook app under `www/clim-react`.

The current state is not a finished user interface. It is a working compiler skeleton with a real app scaffold. The next phase is to fill the scaffold with real runtime state, real data, real presentation renderers, real command behavior, and visual parity with the static CLIM prototype. The architectural path is now explicit enough that this work can happen incrementally without collapsing Semantic IR, Interaction IR, PBUI, concrete profile data, and React target code into one unstructured layer.
