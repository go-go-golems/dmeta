---
Title: Street Deli PBUI dogfooding review
Ticket: DMETA-CLIM-MDS
Status: active
Topics:
  - dmeta
  - pbui
  - clim
  - street-deli
  - react
DocType: design-doc
Intent: implementation-review
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Review of the first Street Deli PBUI/CLIM React scaffold generated from the new PBUI MetaDesignSystem."
LastUpdated: 2026-05-24T17:45:00-04:00
WhatFor: "Use this to understand what the first generated Street Deli PBUI React target proves, what it does not prove yet, and which gaps should drive the next schema/codegen work."
WhenToUse: "Read before promoting generated PBUI React output into a richer runnable Street Deli CLIM app."
---

# Street Deli PBUI dogfooding review

## Summary

The first Street Deli PBUI/CLIM dogfooding pass generated a separate React/TypeScript scaffold under:

```text
examples/street-deli-ordering/generated/pbui-react/
```

This path is intentionally separate from both:

```text
examples/street-deli-ordering/www/mobile-react/
examples/street-deli-ordering/generated/react/
```

The generated PBUI target is not yet a polished mobile app. It is a buildable target scaffold that proves the new PBUI MetaDesignSystem can drive concrete React-oriented output from the existing Semantic IR and Interaction IR pipeline.

The scaffold currently generates:

- object type registry;
- action descriptor registry;
- presentation type registry;
- PBUI session state skeleton;
- selector/projection skeleton;
- action request builder;
- event adapter;
- command parser;
- presentation hooks;
- presentation components;
- metadata sidecars;
- Storybook story skeletons;
- `package.json` and `tsconfig.json` for TypeScript validation.

## Validation performed

The generated package was rebuilt with:

```bash
cd examples/street-deli-ordering/generated/pbui-react
npm install --no-audit --no-fund
npm run build
```

The existing promoted Street Deli app was also rebuilt with:

```bash
cd examples/street-deli-ordering/www/mobile-react
npm run build
```

Both builds passed.

## What this proves

This dogfooding pass proves that the PBUI compiler path is no longer just a set of docs or schemas. The following end-to-end chain works:

```text
Street Deli Semantic IR
  -> Interaction IR elaboration
  -> PBUI lowering
  -> object/action descriptor derivation
  -> PBUI React planning
  -> PBUI React scaffold rendering
  -> TypeScript build validation
```

It also proves that generated metadata can preserve natural-language intent. The generated metadata sidecars include:

- `MetaDesignSystem`;
- `CodegenTarget`;
- `PresentationTypeID`;
- source representations;
- source actions;
- source rules;
- domain types;
- presenter intent;
- recognizer intent;
- lowering rationale;
- source passes.

## Generated PBUI presentations

The first scaffold emits these presentation components:

| PBUI presentation | Generated component | What it proves |
| --- | --- | --- |
| `pbui.presentation_ref` | `PbuiPresentationRef` | Compact object references can become first-class generated presentations. |
| `pbui.action_presentation` | `PbuiActionPresentation` | Actions can become first-class presentable objects. |
| `pbui.action_chooser` | `PbuiActionChooser` | Action-choice surfaces can be generated separately from concrete menus/toolbars. |
| `pbui.inspector_panel` | `PbuiInspectorPanel` | Object/type/action inspection can become a target-level scaffold. |
| `pbui.lifecycle_status` | `PbuiLifecycleStatus` | Stateful domain facts can produce lifecycle/status presentation scaffolds. |
| `pbui.composition_presentation` | `PbuiCompositionPresentation` | The richer Street Deli composition/substitution case can drive a structured presentation scaffold. |

## Comparison with promoted Street Deli React widgets

The promoted app under `www/mobile-react/` remains the UX reference and the maintained demo implementation. It has domain-specific widgets such as:

- `StreetDeliMenuBrowser`;
- `StreetDeliCompositionCard`;
- `StreetDeliCompositionCustomizer`;
- `StreetDeliIngredientRow`;
- `StreetDeliSubstitutionChip`;
- `StreetDeliOrderCart`;
- `StreetDeliOrderTracker`;
- `StreetDeliRoleTag`.

The generated PBUI target is intentionally not a one-for-one clone of those widgets. It groups output around CLIM/PBUI presentation concepts rather than mobile visual widgets.

The current relationship is:

| Existing promoted widget | Closest generated PBUI concept | Gap |
| --- | --- | --- |
| `StreetDeliMenuBrowser` | `PbuiPresentationRef`, `PbuiActionChooser` | Needs a menu-browser-specific presenter that groups object refs by category and availability. |
| `StreetDeliCompositionCard` | `PbuiCompositionPresentation` | Needs a visual/card target style and concise card projection. |
| `StreetDeliCompositionCustomizer` | `PbuiCompositionPresentation`, `PbuiActionPresentation` | Needs nested part-level presenter hooks and recognizer adapters for substitutions/configuration. |
| `StreetDeliIngredientRow` | `PbuiCompositionPresentation` | Needs subpresentation rendering for parts/roles rather than one coarse component. |
| `StreetDeliSubstitutionChip` | `PbuiActionPresentation` | Needs candidate-specific action presentation variants. |
| `StreetDeliOrderCart` | `PbuiCompositionPresentation`, `PbuiActionPresentation` | Needs cart-specific grouping and submit-order confirmation flow. |
| `StreetDeliOrderTracker` | `PbuiLifecycleStatus` | Needs ordered phase data and time/progress adapters. |
| `StreetDeliRoleTag` | `PbuiCompositionPresentation` | Needs role-label subpresentation extraction. |

## Gaps to address next

These should be treated as schema/codegen follow-ups, not patched directly in generated target files.

### 1. Presentation types need subpresentation structure

`pbui.composition_presentation` currently becomes one coarse component. Street Deli needs nested subpresentations for:

- part rows;
- role labels;
- substitution candidates;
- configuration controls;
- cart actions.

The PBUI schema already has `roles`; the next pass should make role-to-subpresentation planning explicit enough for the React target to generate child components or slots.

### 2. Presenter hooks need real domain selector contracts

The generated hooks are syntactic placeholders. The next target pass should derive selector signatures from:

- object descriptors;
- projection descriptors;
- presentation roles;
- source domain types.

### 3. Recognizer/event adapters need action argument contracts

The generated action request builders do not yet map presentation-local events to typed Interaction IR inputs. For Street Deli, this matters for:

- `composition_ref`;
- `part_ref`;
- `replacement_candidate_ref`;
- `cart_ref`;
- `state`;
- `key`/`value` configuration changes.

### 4. Action chooser coverage improved but remains generic

The PBUI lowering rule now emits `pbui.action_chooser` for compact inspectable/copyable references. That proves the concept, but a richer action chooser should group actions by:

- subject compatibility;
- safety/confirmation;
- intent category;
- current interaction state.

### 5. Metadata JSON shape should be polished

The generated metadata currently serializes Go field names. Before using metadata as a stable external contract, add explicit JSON tags and choose a lower/camel-case schema.

## Recommended next implementation steps

1. Add subpresentation/slot planning to PBUI presentation types.
2. Add input-contract derivation for action request builders.
3. Add metadata JSON tags and update the golden fixture intentionally.
4. Promote the generated scaffold into a richer `mobile-clim-react` experiment only after generated selectors/adapters become meaningful.

## Conclusion

The first dogfooding pass is successful as a compiler proof. It demonstrates that PBUI is now an executable layer, not just a design document. The next work should focus on making generated presenter hooks and recognizer adapters semantically useful enough that the Street Deli CLIM output can start approximating the promoted mobile app's interaction behavior.
