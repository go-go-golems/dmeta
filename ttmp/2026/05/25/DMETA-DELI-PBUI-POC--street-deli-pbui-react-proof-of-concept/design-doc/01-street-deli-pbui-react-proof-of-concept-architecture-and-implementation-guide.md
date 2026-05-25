---
Title: Street Deli PBUI React Proof of Concept Architecture and Implementation Guide
Ticket: DMETA-DELI-PBUI-POC
Status: active
Topics:
    - dmeta
    - pbui
    - clim
    - react
    - code-generation
    - documentation
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: examples/street-deli-ordering/meta-design-systems/pbui
      Note: Street Deli PBUI profile now keeps app-specific overrides and view models.
    - Path: proof-of-concept/deli-pbui-react
      Note: |-
        Standalone hand-authored Vite/React/Tailwind/RTK Query/Storybook proof-of-concept package.
        Standalone Deli PBUI React proof-of-concept package
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli
      Note: Street Deli-specific domain types, fixtures, action descriptors, view models, and RTK Query fixture API.
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/actions.ts
      Note: Street Deli action descriptor baseline
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/viewModels.ts
      Note: Street Deli view model registry baseline
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim
      Note: Reusable CLIM/PBUI runtime types and components that should inform future package extraction.
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/components.tsx
      Note: Reusable CLIM/PBUI component baseline
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/types.ts
      Note: Reusable CLIM/PBUI runtime type baseline
    - Path: proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.stories.tsx
      Note: |-
        Storybook review surface for the proof-of-concept widget.
        Storybook review surface
    - Path: proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx
      Note: |-
        Main widget entrypoint that composes reusable CLIM components with Street Deli domain registries.
        Main proof-of-concept widget
    - Path: sources/dmeta-ir/meta-design-systems/pbui/profiles/clim
      Note: Reusable CLIM PBUI profile extracted from the Street Deli example.
    - Path: sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/presentation-bindings.yaml
      Note: Reusable CLIM presentation binding profile extracted from Street Deli
    - Path: sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/surfaces.yaml
      Note: Reusable CLIM surface profile extracted from Street Deli
ExternalSources:
    - /home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim — Runtime architecture reference for PresentationRef, ActionPresentation, command parsing, and state transitions.
Summary: Intern-facing architecture and implementation guide for a standalone hand-authored Street Deli PBUI React proof of concept.
LastUpdated: 2026-05-25T00:00:00-04:00
WhatFor: Use to understand why the proof of concept exists, how it separates reusable CLIM/PBUI code from Street Deli domain code, and how it should feed future DMETA generation templates.
WhenToUse: Before extending proof-of-concept/deli-pbui-react or converting its proven patterns back into PBUI React generation.
---


# Street Deli PBUI React Proof of Concept Architecture and Implementation Guide

## Executive summary

This ticket changes direction deliberately. The previous PBUI/CLIM React work started from code generation. That produced useful scaffolding and metadata, but it also exposed a problem: the generated app was mostly architecture-shaped, not domain-operational. It generated a shell, placeholder presentation components, Storybook stories, and metadata, but it did not yet prove the right concrete target for Street Deli actions, command bindings, view models, selectors, and domain state.

The new proof of concept takes the opposite path. We will first build a small, standalone React app by hand in `proof-of-concept/deli-pbui-react`. It uses Vite, Storybook, Tailwind, RTK Query, and the `widget.tsx` / `widget.stories.tsx` pattern. The app is intentionally small, but it has a strict architecture: reusable CLIM/PBUI code lives separately from Street Deli domain code. Once this architecture feels right in hand-authored React, we can convert the stable parts back into templates, reusable packages, and code generation.

The first cleanup step has already started this separation at the IR/profile level. Generic CLIM surface and presentation binding concepts moved into a reusable profile under `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim`. Street Deli-specific PBUI files under `examples/street-deli-ordering/meta-design-systems/pbui` now keep local view models, style choices, target settings, and domain-specific composition binding overrides.

## 1. Why this proof of concept exists

Generated code is only useful when the target shape is known. In the current PBUI/CLIM work, the target shape is still being discovered. We know the broad ideas: typed presentation references, typed action presentations, CLIM-like command rhythm, selection modes, confirmation modes, and inspectable action/object metadata. We do not yet know the exact shape of the React code that should host a real Street Deli ordering workflow.

The most important missing pieces are domain-operational:

- How should `view-models.yaml` become concrete React view-model registries and selectors?
- How should Interaction IR actions become typed action descriptors, command aliases, action request builders, and handler stubs?
- How should Street Deli domain types such as `MenuItem`, `Ingredient`, `OrderItem`, and `Order` become typed presentation refs?
- Which parts of a CLIM shell are reusable across apps, and which parts are Street Deli-specific?
- How should Storybook present the application states that will later become generated review surfaces?

A hand-authored proof of concept lets us answer these questions in code. The goal is not to abandon generation. The goal is to give generation a better target.

## 2. The extraction: generic PBUI CLIM profile vs Street Deli profile

Before creating the React proof of concept, the PBUI YAML organization was cleaned up.

### 2.1 Reusable CLIM profile

Reusable CLIM profile files now live under:

```text
sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/
  surfaces.yaml
  presentation-bindings.yaml
```

These files describe concepts that are not intrinsically Street Deli-specific:

- a CLIM shell;
- a header with brand and mode label regions;
- an active view frame;
- a command line;
- context menus;
- confirmation prompts;
- generic presentation refs;
- generic action presentations;
- action choosers;
- inspector panels;
- lifecycle status presentations;
- generic composition presentation structure.

This is the start of a reusable PBUI CLIM profile. Later, this can become a package-level profile that any PBUI React application can inherit.

### 2.2 Street Deli local profile

Street Deli keeps local files under:

```text
examples/street-deli-ordering/meta-design-systems/pbui/
  presentation-system.yaml
  style-profile.yaml
  surfaces.yaml
  view-models.yaml
  presentation-bindings.yaml
  targets/react-app.yaml
```

The important distinction is that local Street Deli files should now contain local facts:

- Street Deli view models: menu, detail, substitution, cart, help, tracker.
- Street Deli style profile: monochrome deli prototype styling, Berkeley Mono references, selected/selectable/danger states.
- Street Deli composition binding details: menu item header, ingredient rows, substitutions, cart item blocks.
- Street Deli React app target choices.

The local `presentation-system.yaml` inherits the reusable CLIM profile paths:

```yaml
inherits:
  meta_design_system: pbui
  pbui_root: ../../../sources/dmeta-ir/meta-design-systems/pbui
  surfaces: ../../../../sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/surfaces.yaml
  presentation_bindings: ../../../../sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/presentation-bindings.yaml
```

The profile loader now merges inherited surfaces and presentation bindings with local overrides. This keeps the concrete Street Deli profile valid while allowing the reusable profile to own the common CLIM vocabulary.

## 3. The proof-of-concept package

The standalone package lives at:

```text
proof-of-concept/deli-pbui-react/
```

It is intentionally not generated. It is a working sketch of the target we want generation to produce later.

```text
proof-of-concept/deli-pbui-react/
  package.json
  vite.config.ts
  tsconfig.json
  postcss.config.js
  index.html
  .storybook/
    main.ts
    preview.tsx
  src/
    index.css
    main.tsx
    App.tsx
    app/
      store.ts
    generic/
      clim/
        types.ts
        components.tsx
    domain/
      deli/
        types.ts
        fixtures.ts
        actions.ts
        viewModels.ts
        deliApi.ts
    widgets/
      DeliPbuiWorkbench/
        widget.tsx
        widget.stories.tsx
```

The package uses:

- **Vite** for local React development and production build.
- **Storybook** for reviewing the widget in isolation.
- **Tailwind CSS** for fast visual iteration and future token mapping.
- **RTK Query** for data access, even though the first API is fixture-backed.
- **React Redux** because RTK Query needs a store provider.
- **`widget.tsx` + `widget.stories.tsx`** as the reviewable component pattern.

## 4. Architectural rule: generic code and domain code must stay separate

The proof of concept has one rule that matters more than any individual component: generic CLIM/PBUI code must not know Street Deli domain facts.

Generic code lives under:

```text
src/generic/clim/
```

Street Deli domain code lives under:

```text
src/domain/deli/
```

The widget composes them:

```text
src/widgets/DeliPbuiWorkbench/widget.tsx
```

This structure is deliberate. When we later convert the proof of concept into templates, the generic directory points toward a reusable runtime package, while the domain directory points toward generated app-specific files.

## 5. Generic CLIM/PBUI layer

The generic layer is small but important. It defines the runtime concepts that should not depend on sandwiches, ingredients, carts, or deli categories.

### 5.1 Generic types

File:

```text
src/generic/clim/types.ts
```

Key types:

```ts
export type InteractionMode = 'normal' | 'select' | 'confirm';

export interface PresentationRef<TType extends string = string> {
  type: TType;
  id: string;
  label: string;
  capabilities: string[];
  metadata?: Record<string, string | number | string[]>;
}

export interface ActionDescriptor<TAction extends string = string> {
  id: TAction;
  label: string;
  description: string;
  inputTypes: Record<string, 'SemanticRef' | 'string' | 'number' | 'boolean'>;
  mutatesBackend: boolean;
  requiresConfirmation: boolean;
}

export interface ActionPresentation<TAction extends string = string> {
  descriptor: ActionDescriptor<TAction>;
  disabledReason?: string;
  subject?: PresentationRef;
}
```

This is the minimum vocabulary for a CLIM-like app. A presentation ref is a typed handle for an object. An action descriptor is a typed description of something the user can do. An action presentation is the UI object that makes the action visible and selectable.

### 5.2 Generic components

File:

```text
src/generic/clim/components.tsx
```

Components:

- `ClimShell`
- `PresentationRefLine`
- `ActionPresentationInline`
- `ActionHintBar`

These components know about CLIM concepts but not about Street Deli concepts. `PresentationRefLine` can render a `MenuItem`, but it can also render a document, task, source, order, or workflow run if another domain supplies a different `PresentationRef`.

The long-term reusable package could start from this layer:

```text
@dmeta/pbui-react-clim
  types
  shell components
  presentation components
  command parser
  selection state machine
  compatible action selectors
```

## 6. Street Deli domain layer

The domain layer makes the abstract CLIM/PBUI concepts concrete.

### 6.1 Domain types

File:

```text
src/domain/deli/types.ts
```

The first proof of concept defines:

```ts
export type DeliDomainType = 'MenuItem' | 'Ingredient' | 'OrderItem' | 'Order';

export interface Ingredient {
  id: string;
  name: string;
  role: 'protein' | 'freshness' | 'fat' | 'acid' | 'bread' | 'condiment';
  removable: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  ingredients: Ingredient[];
}
```

These are not generic CLIM concepts. They belong to the Street Deli application. In a generated future, these should come from Semantic IR domain examples and domain schemas.

### 6.2 Action descriptors

File:

```text
src/domain/deli/actions.ts
```

The proof of concept defines a concrete action registry:

```ts
export const deliActionDescriptors = {
  select_menu_item: {...},
  remove_part: {...},
  apply_substitution: {...},
  add_to_order: {...},
  submit_order: {...},
  return_to_menu: {...},
};
```

This is one of the most important additions compared to the generated CLIM scaffold. Interaction IR actions already exist in `sources/dmeta-ir/interactions/actions.yaml`, but the generated concrete app did not yet turn them into a useful domain-facing registry. The proof of concept does that by hand so we can learn what the generated version should look like.

Future generation should produce a typed file like this from:

- `sources/dmeta-ir/interactions/actions.yaml`
- `sources/dmeta-ir/interactions/elaboration-rules.yaml`
- Street Deli command/action bindings that still need to be authored.

### 6.3 View model definitions

File:

```text
src/domain/deli/viewModels.ts
```

The proof of concept defines:

```ts
export const deliViewModels = {
  menu: {
    id: 'menu',
    modeLabel: 'MENU',
    primaryPresentations: ['pbui.presentation_ref', 'pbui.action_chooser', 'pbui.action_presentation'],
    defaultActions: ['select_menu_item', 'return_to_menu'],
  },
  detail: {...},
  cart: {...},
};
```

This is another missing generated piece. The YAML source already exists in:

```text
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
```

But the generated React app did not yet produce a strong typed view-model registry. The proof of concept shows the target shape: a TypeScript object that can drive mode labels, default actions, presentation layout, Storybook states, and selectors.

### 6.4 RTK Query fixture API

File:

```text
src/domain/deli/deliApi.ts
```

The app uses RTK Query even though the initial data is local fixture data:

```ts
export const deliApi = createApi({
  reducerPath: 'deliApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getMenu: builder.query<MenuItem[], void>({
      queryFn: () => ({ data: menuItems }),
    }),
  }),
});
```

This is intentional. The data access pattern should look like a real application from the beginning. Later, the fake query can become a real HTTP endpoint without changing the presentation architecture.

## 7. The widget entrypoint

The main review surface is:

```text
src/widgets/DeliPbuiWorkbench/widget.tsx
```

It does three things:

1. It reads data from the domain API.
2. It projects domain objects into generic `PresentationRef` objects.
3. It renders generic CLIM components using domain registries.

The important projection is:

```ts
function menuItemPresentation(item: MenuItem): PresentationRef<'MenuItem'> {
  return {
    type: 'MenuItem',
    id: item.id,
    label: `${item.name} $${item.price.toFixed(2)}`,
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
  };
}
```

This function is the kind of thing that future generation might scaffold from Semantic IR capabilities. The exact projection may become hand-maintained, but the signature and placement are useful: domain object in, generic presentation object out.

## 8. Storybook as the review surface

The Storybook file is:

```text
src/widgets/DeliPbuiWorkbench/widget.stories.tsx
```

Storybook is not optional for this work. PBUI is a presentation-system project, and presentation systems need reviewable states. A future generated app should produce stories for:

- normal mode;
- select mode;
- confirm mode;
- empty menu;
- selected item;
- substitution candidate flow;
- cart with dangerous submit action;
- action disabled states;
- inspector/help surfaces.

The first proof of concept has one story, `MenuMode`, because the initial package is a baseline. The next increments should add states before adding more infrastructure.

## 9. What should become reusable

A large part of the proof of concept should eventually become reusable.

| Area | Current proof-of-concept path | Future home |
|---|---|---|
| CLIM runtime types | `src/generic/clim/types.ts` | reusable PBUI React CLIM package |
| CLIM shell/components | `src/generic/clim/components.tsx` | reusable PBUI React CLIM package |
| Storybook shell | add under `src/generic/clim/storybook` later | reusable PBUI React CLIM package |
| Surface defaults | `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/surfaces.yaml` | reusable PBUI CLIM profile |
| Presentation binding defaults | `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim/presentation-bindings.yaml` | reusable PBUI CLIM profile |
| Deli domain types | `src/domain/deli/types.ts` | generated/app-specific |
| Deli action descriptors | `src/domain/deli/actions.ts` | generated from Interaction IR plus action bindings |
| Deli view models | `src/domain/deli/viewModels.ts` | generated from `view-models.yaml` |
| Deli projection functions | `widget.tsx` for now | generated stubs plus promoted code |

## 10. What is still missing

The proof of concept is intentionally small. It does not yet solve the full app.

Missing but important:

- a real `action-bindings.yaml` that maps command labels like `PLACE-ORDER` to Interaction IR action ids like `submit_order`;
- typed action request builders for each action;
- action handler stubs and real handlers;
- compatible action selectors based on current selection and view mode;
- normal/select/confirm state transitions;
- domain reducers for cart and composition drafts;
- substitution candidate projection and application flow;
- generated object type descriptors in the concrete app;
- generated action descriptors in the concrete app;
- generated view-model registry from YAML;
- generated presentation binding registry from inherited PBUI profile files.

These are not failures. They are the next design targets. The proof of concept should grow toward them by hand before we template them.

## 11. How to run the proof of concept

From the package directory:

```bash
cd proof-of-concept/deli-pbui-react
npm install --no-audit --no-fund
npm run build
npm run build-storybook
```

Validated result:

- `npm run build` passes.
- `npm run build-storybook` passes.
- Storybook emits the usual large chunk warning, but the build completes successfully.

## 12. Implementation plan for the next intern

### Phase 1: Expand the hand-authored baseline

Add more stories before adding abstractions:

- Menu mode with selected item.
- Detail mode with ingredient rows.
- Select mode for `REMOVE-INGREDIENT`.
- Cart mode with `PLACE-ORDER` requiring confirmation.
- Confirm prompt story.

### Phase 2: Add action request construction

Add a generic function:

```ts
function buildActionRequest<TAction extends string>(
  descriptor: ActionDescriptor<TAction>,
  subject: PresentationRef | undefined,
  inputs: Record<string, unknown>,
): ActionRequest<TAction> {
  return { actionId: descriptor.id, subject, inputs };
}
```

Then add domain-specific input mapping:

```ts
const deliActionInputMappings = {
  remove_part: {
    composition_ref: 'currentDraft',
    part_ref: 'selectedPresentation',
  },
  submit_order: {
    cart_ref: 'currentCart',
  },
};
```

This should eventually become `action-bindings.yaml`.

### Phase 3: Add a small CLIM state machine

Implement normal/select/confirm transitions:

```text
normal + choose action needing subject -> select
select + choose compatible subject -> normal or confirm
normal + choose dangerous complete action -> confirm
confirm + accept -> execute
confirm + cancel -> normal
```

This belongs in generic CLIM code, but it should be proven against Deli flows.

### Phase 4: Add domain state

Add cart and composition draft state. Keep API data separate from session state:

```text
RTK Query API state:
  menu data, backend order data

Domain draft state:
  current draft item, removed ingredients, substitutions, cart items

CLIM session state:
  selected presentation, mode, pending action, command buffer
```

### Phase 5: Convert stable code back into generation templates

Only after the hand-authored code feels stable should generation resume. The likely generated files are:

```text
src/domain/deli/generated/objectTypes.ts
src/domain/deli/generated/actionDescriptors.ts
src/domain/deli/generated/viewModels.ts
src/domain/deli/generated/presentationBindings.ts
src/domain/deli/generated/commandBindings.ts
```

The likely reusable package files are:

```text
src/generic/clim/types.ts
src/generic/clim/components.tsx
src/generic/clim/stateMachine.ts
src/generic/clim/actionRequests.ts
```

## 13. Review checklist

A reviewer should check the proof of concept using these questions:

- Does generic CLIM code avoid Street Deli domain names?
- Does domain code avoid React shell mechanics when possible?
- Can `viewModels.ts` be traced back to `view-models.yaml`?
- Can `actions.ts` be traced back to Interaction IR action ids?
- Does the widget compose generic and domain layers clearly?
- Does Storybook provide a useful review surface?
- Are the pieces named in a way that future code generation could reproduce?
- Does the package build independently from the rest of the repo?

## 14. Key decisions

- **Hand-authored before generated:** The target shape is still unknown, so a hand-authored baseline is more valuable than more scaffolding.
- **Standalone package:** The proof of concept should build independently and not depend on the current generated `www/clim-react` app.
- **RTK Query from the start:** Even fixture data should use an API-shaped access path so later backend wiring does not change the presentation architecture.
- **Tailwind for iteration:** Tailwind keeps the proof-of-concept styling fast while still allowing later tokenization.
- **Generic/domain split:** This is the architectural invariant. It is more important than visual completeness in the first pass.
- **Storybook first:** The widget must have a Storybook surface because PBUI behavior needs visual and interaction review.

## 15. Acceptance criteria for this ticket

This ticket is complete when:

- reusable CLIM profile files exist under `sources/dmeta-ir/meta-design-systems/pbui/profiles/clim`;
- Street Deli PBUI profile files contain local overrides rather than full copies of generic CLIM surfaces/bindings;
- the profile loader merges inherited surfaces and presentation bindings;
- `proof-of-concept/deli-pbui-react` exists as a standalone package;
- the proof-of-concept package uses Vite, React, Storybook, RTK Query, and Tailwind;
- the proof-of-concept package contains `widget.tsx` and `widget.stories.tsx`;
- generic CLIM code is separated from Street Deli domain code;
- `npm run build` and `npm run build-storybook` pass in the proof-of-concept package;
- this guide and diary are stored in the docmgr ticket and uploaded to reMarkable.
