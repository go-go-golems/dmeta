---
Title: Minimal PBUI CLIM Core Simplification Analysis and Implementation Guide
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
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/compatibilityRules.ts
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/deliWorkbenchSlice.ts
      Note: Deli state that future ActionRuntimeContext will resolve/mutate
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/handlers.ts
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/commandParser.ts
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/compatibility.ts
      Note: Binding-oriented compatibility helpers targeted for removal
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/compatibilityRules.ts
      Note: Metadata compatibility evaluator targeted for simplification
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/handlerRegistry.ts
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts
      Note: Closest existing slice to future action invocation slice
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/types.ts
      Note: Current generic type model to replace with typed action args
    - Path: proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx
      Note: Current god widget to split during minimal PBUI core refactor
ExternalSources: []
Summary: Analysis and implementation guide for cutting the Street Deli PBUI POC down to a minimal action/presentation dispatch core.
LastUpdated: 2026-05-25T17:42:00.952362498-04:00
WhatFor: Use this when replacing the current POC's god-widget and compatibility layers with a minimal typed action engine.
WhenToUse: Before implementing the next PBUI core refactor or compiler pass that targets the cleaned-up action/presentation model.
---


# Minimal PBUI CLIM Core Simplification Analysis and Implementation Guide

## Executive Summary

The Street Deli PBUI React proof of concept has been valuable because it forced the target architecture into code. It now has a component kit, Redux slices, a command REPL, select mode, confirm mode, handler registries, route handling, and metadata-derived compatibility. That is enough to reveal the next problem: the prototype has accumulated two different designs at once. One design is the useful CLIM idea—actions accept typed objects, presentations expose semantic references, and the user fills action arguments by selecting objects. The other design is scaffolding from earlier discovery—stringly `inputMapping`, compatibility metadata, binding-oriented matching, and a large `DeliPbuiWorkbench` that owns too many responsibilities.

This document proposes a hard cleanup, not a compatibility migration. The new core should be a minimal action/presentation dispatch system. An action declares typed arguments. A rendered presentation yields a `SemanticRef`. The engine checks whether the selected action has an open argument slot and whether the clicked ref can fill it. The primary matching rule is object type equality plus an optional `accepts` lambda. The lambda gives us all the flexibility we need without a general metadata rule engine.

The intended end state is simple enough that a new developer can reason about it in one sitting:

```text
ActionSpec(args) + SemanticRef + ActionInvocationState + RuntimeContext
  -> can fill next argument?
  -> fill argument / ask for value / confirm / run action
```

The current POC should be refactored toward this shape before using it as the reference for dmeta compiler passes. Otherwise the compiler will learn the accidental complexity rather than the core design.

## Problem Statement

The current POC works, but `DeliPbuiWorkbench` has become a god component. It renders the app, derives presentations, initializes Redux slices, handles routes, parses REPL commands, computes compatibility, manages action invocation, invokes handlers, seeds Storybook cart data, and knows Deli-specific object details. This makes it difficult to see which parts are reusable PBUI runtime concepts and which parts are Street Deli application code.

The matching model also became too indirect. The current system asks questions like:

```text
Which command bindings in the current view use selected_presentation?
Which metadata compatibility rule applies to this binding?
Which presentation refs are compatible with that binding?
```

The model we want asks a simpler question:

```text
The user selected action A. A needs argument X. Can this SemanticRef fill X?
```

That question is easier to explain, easier to implement, easier to generate, and closer to the original CLIM idea.

## Current System Inventory

The current proof-of-concept has these important files.

| Area | Current files | Current responsibility |
|---|---|---|
| God widget | `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx` | Routes, Redux resets, presentation derivation, compatibility, REPL execution, handler invocation, rendering. |
| Generic types | `src/generic/clim/types.ts` | `PresentationRef`, `ActionDescriptor`, `CommandBinding`, `ActionRequest`, shell session state. |
| Compatibility helpers | `src/generic/clim/compatibility.ts` | Binding-ordering, selected-presentation source checks, action-presentation derivation, presentation visual state. |
| Compatibility rules | `src/generic/clim/compatibilityRules.ts`, `src/domain/deli/compatibilityRules.ts` | Metadata-shaped compatibility registry and evaluator. |
| PBUI session slice | `src/generic/clim/pbuiSessionSlice.ts` | Mode, selected ref, pending command/request, command buffer/history/result line. |
| Deli workbench slice | `src/domain/deli/deliWorkbenchSlice.ts` | View id, selected item id, removed ingredients, cart items. |
| Handler registry | `src/generic/clim/handlerRegistry.ts`, `src/domain/deli/handlers.ts` | Resolve handler name to runtime behavior. |
| REPL parser | `src/generic/clim/commandParser.ts` | Normalize typed commands, confirm/cancel/unknown parsing. |
| Command bindings | `src/domain/deli/commandBindings.ts`, `examples/.../action-bindings.yaml` | View-facing command labels, handlers, confirmation prompts, old input mapping. |

Most of these pieces contain useful lessons. The cleanup should preserve the lessons but delete the unnecessary shapes.

## What Is Superfluous or Misplaced

### 1. `DeliPbuiWorkbench` is too large

`widget.tsx` should not be the system. A React widget should compose smaller parts:

- state selectors;
- command-line shell;
- view renderer;
- action bar;
- action engine adapter;
- domain handlers.

The current file does all of those directly. That makes it hard to validate the core engine in isolation and hard to generate code later.

The most important extraction target is not another widget. It is a pure action engine plus thin React/Redux adapters.

### 2. `ActionDescriptor.inputTypes` is too weak

Current shape in `types.ts`:

```ts
inputTypes: Record<string, 'SemanticRef' | 'string' | 'number' | 'boolean'>
```

This erases the important type. `REMOVE-INGREDIENT` does not take a generic `SemanticRef`; it takes an `Ingredient`. `CUSTOMIZE` takes a `MenuItem`. `FILTER-DIETARY` takes a `DietaryTag` or maybe a typed query value that resolves to a `DietaryTag`.

The new action model should name the argument object type directly:

```ts
args: [
  { name: 'ingredient', kind: 'ref', objectType: 'Ingredient' }
]
```

### 3. `inputMapping` should go away for the minimal core

Current command bindings use a string mapping:

```ts
inputMapping: {
  composition_ref: 'current_draft',
  part_ref: 'selected_presentation'
}
```

This was useful while the action system did not know its own argument sources. In the minimal engine, we do not need that DSL. A `ref` argument is filled by selecting a compatible presentation. A `value` argument is filled by a value input presentation or REPL token. Contextual values such as current cart or current draft can be provided by the runtime context or by action lambdas.

The core should not inspect strings like `selected_presentation`. The core should inspect the selected action's next open argument.

### 4. `bindingUsesInputSource` is a symptom, not a primitive

Current helper:

```ts
bindingUsesInputSource(binding, 'selected_presentation')
```

This exists only because `inputMapping` is stringly typed. Once actions have typed argument slots, this function disappears. The engine asks:

```ts
const openArg = nextOpenArg(action, state.filledArgs)
openArg.kind === 'ref'
```

That is both clearer and less error-prone.

### 5. Metadata compatibility rules are too complex for the core

Current rule style:

```ts
{
  acceptedTypes: ['Ingredient'],
  requiredCapabilities: ['removable'],
  metadata: {
    removed: { notEquals: 'yes' }
  }
}
```

This is more machinery than the minimal core needs. The new core should match by object type and then call an optional lambda:

```ts
{
  name: 'ingredient',
  kind: 'ref',
  objectType: 'Ingredient',
  accepts: (ref, ctx) => !ctx.deli.isRemovedIngredient(ref.id)
}
```

This moves domain logic into typed runtime code instead of encoding it as a mini-language over metadata.

### 6. Capabilities should be hints, not matching logic

Capabilities are still useful. They can appear in debug display. They can inform MetaDesignSystem decisions about which presenters to choose. They can help a developer understand why an object was rendered a certain way. They should not be the primary runtime action matcher.

Runtime matching should be:

```text
objectType equality + optional accepts lambda
```

Capabilities may remain on `SemanticRef`, but the matching engine should not depend on them.

### 7. `ActionPresentation.subject` should be removed

Current action presentation can carry a `subject`:

```ts
interface ActionPresentation {
  descriptor: ActionDescriptor
  subject?: PresentationRef
}
```

This smuggles an argument into the visual representation of an action. The new core should track action invocation state explicitly:

```ts
selectedActionId
filledArgs
openArgName
mode
```

An action bar can render whether an action is selected, available, blocked, or executable. It should not own a hidden subject.

### 8. `compatibleBindingsForPresentation` is backwards for the new model

Current algorithm:

```text
presentation -> compatible command bindings
```

New algorithm:

```text
selected action + open arg slot + candidate ref -> can fill?
```

A presentation should become selectable only when an action is selected and that action has an open `ref` argument slot that accepts the presentation. Otherwise clicking a presentation should select the object and reveal available actions. It should not invoke an action by default.

### 9. Ordering does not belong in compatibility

`defaultActionOrder` sorting in `compatibility.ts` is not compatibility. It is action bar planning. It should move to a small action presentation planner or view renderer. The matcher should not know about visual order.

### 10. `dangerousTarget` is visual state, not compatibility

`dangerousTarget` is derived from action presentation intent, not from whether a ref can fill an argument. The minimal matcher should return only whether a candidate can fill a slot. The visual layer can decide to render a selected action or target in red.

## Proposed Minimal Core

The new core consists of five concepts:

1. `SemanticRef`
2. `ActionArgSpec`
3. `ActionSpec`
4. `ActionInvocationState`
5. `ActionRuntimeContext`

Everything else should either be a React adapter, Redux slice, domain adapter, or presentation component.

### Concept Diagram

```text
                 +----------------------+
                 |      ActionSpec      |
                 | id, label, args, run |
                 +----------+-----------+
                            |
                            | selected by REPL or action bar
                            v
+------------------+   +----------------------+   +------------------+
|   SemanticRef    |-->| ActionInvocation     |-->| ActionRuntimeCtx |
| objectType, id   |   | selectedAction, args |   | resolve, domain  |
+------------------+   +----------+-----------+   +------------------+
                                  |
                                  | all args filled?
                                  v
                           confirm or run
```

### `SemanticRef`

A `SemanticRef` is the object pointer exposed by a presentation. It is not the domain object itself. It is enough information for the runtime to resolve the current object from Redux or a domain registry.

```ts
export interface SemanticRef<TObjectType extends string = string> {
  objectType: TObjectType;
  id: string;
  label: string;
  presentationType?: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
}
```

`presentationType` stays because it records how this thing was rendered. That can be useful for debugging and for future UI policy. It is not the same as `objectType` and should not replace it.

`metadata` stays as descriptive/presentation metadata. It should not be the main logic mechanism for matching action arguments.

### `ActionArgSpec`

An action argument is either a reference to a known object or a value entered through a command line or input presentation.

```ts
export type ActionArgSpec = RefArgSpec | ValueArgSpec;

export interface RefArgSpec {
  name: string;
  kind: 'ref';
  objectType: string;
  required?: boolean;
  accepts?: (ref: SemanticRef, ctx: ActionRuntimeContext) => boolean;
}

export interface ValueArgSpec {
  name: string;
  kind: 'value';
  valueType: string;
  required?: boolean;
  presentation?: ValueInputPresentation;
  accepts?: (value: unknown, ctx: ActionRuntimeContext) => boolean;
}

export interface ValueInputPresentation {
  kind: 'text-input' | 'number-input' | 'select' | 'autocomplete';
  label?: string;
  placeholder?: string;
}
```

A value argument is where free-form strings belong. Most domain data should not be plain `string`; it should be a typed value such as `DietaryTag`, `SearchQuery`, or `Quantity`. If a traditional UI would show a form field, then a `value` argument is appropriate.

### `ActionSpec`

An action declares its arguments and how to run once all arguments are filled.

```ts
export interface ActionSpec<TActionId extends string = string> {
  id: TActionId;
  label: string;
  description?: string;
  args: ActionArgSpec[];
  requiresConfirmation?: boolean;
  run: (args: FilledArgs, ctx: ActionRuntimeContext) => ActionResult | Promise<ActionResult>;
}

export type FilledArgs = Record<string, unknown>;

export interface ActionResult {
  message?: string;
}
```

Example: `CUSTOMIZE`.

```ts
const customize: ActionSpec = {
  id: 'CUSTOMIZE',
  label: 'CUSTOMIZE',
  args: [
    { name: 'item', kind: 'ref', objectType: 'MenuItem' },
  ],
  run: ({ item }, ctx) => {
    const ref = item as SemanticRef<'MenuItem'>;
    ctx.deli.openDetail(ref.id);
    return { message: `Opened ${ref.label}.` };
  },
};
```

Example: `REMOVE-INGREDIENT`.

```ts
const removeIngredient: ActionSpec = {
  id: 'REMOVE-INGREDIENT',
  label: 'REMOVE-INGREDIENT',
  args: [
    {
      name: 'ingredient',
      kind: 'ref',
      objectType: 'Ingredient',
      accepts: (ref, ctx) => !ctx.deli.isRemovedIngredient(ref.id),
    },
  ],
  run: ({ ingredient }, ctx) => {
    const ref = ingredient as SemanticRef<'Ingredient'>;
    ctx.deli.removeIngredient(ref.id);
    return { message: `Removed ${ref.label}.` };
  },
};
```

Example: `FILTER-DIETARY` as a value argument.

```ts
const filterDietary: ActionSpec = {
  id: 'FILTER-DIETARY',
  label: 'FILTER-DIETARY',
  args: [
    {
      name: 'tag',
      kind: 'value',
      valueType: 'DietaryTag',
      presentation: {
        kind: 'autocomplete',
        label: 'Dietary tag',
        placeholder: 'vegan, vegetarian, gluten-free...',
      },
    },
  ],
  run: ({ tag }, ctx) => {
    ctx.deli.filterByDietaryTag(tag);
    return { message: `Filtered by ${String(tag)}.` };
  },
};
```

### `ActionInvocationState`

Action invocation state should be its own Redux slice. It should not be hidden in the widget and should not be mixed with domain state. The current `pbuiSessionSlice` can evolve into this, but it should be centered on action invocation rather than command bindings.

```ts
export interface ActionInvocationState {
  mode: 'idle' | 'selecting-ref' | 'editing-value' | 'confirming';
  selectedActionId?: string;
  selectedRef?: SemanticRef;
  filledArgs: Record<string, unknown>;
  openArgName?: string;
  commandBuffer: string;
  commandHistory: string[];
  historyCursor?: number;
  message?: string;
}
```

The important invariant is:

```text
A presentation is selectable only when mode = selecting-ref and the current open ref argument accepts it.
```

Outside that state, clicking a presentation selects the object and shows available actions. It does not run an action by default.

## Minimal Matching Algorithm

The matching algorithm should be small enough to memorize.

### `canFillRefArg`

```ts
function canFillRefArg(
  arg: RefArgSpec,
  ref: SemanticRef,
  ctx: ActionRuntimeContext,
): boolean {
  if (ref.objectType !== arg.objectType) {
    return false;
  }
  return arg.accepts?.(ref, ctx) ?? true;
}
```

### `canFillValueArg`

```ts
function canFillValueArg(
  arg: ValueArgSpec,
  value: unknown,
  ctx: ActionRuntimeContext,
): boolean {
  return arg.accepts?.(value, ctx) ?? true;
}
```

### `nextOpenArg`

```ts
function nextOpenArg(action: ActionSpec, filled: FilledArgs): ActionArgSpec | undefined {
  return action.args.find(arg => arg.required !== false && filled[arg.name] === undefined);
}
```

### `continueAction`

```ts
function continueAction(action: ActionSpec, filled: FilledArgs, ctx: ActionRuntimeContext): ActionInvocationState {
  const next = nextOpenArg(action, filled);

  if (next?.kind === 'ref') {
    return {
      mode: 'selecting-ref',
      selectedActionId: action.id,
      filledArgs: filled,
      openArgName: next.name,
      message: `Select ${next.objectType} for ${action.label}.`,
    };
  }

  if (next?.kind === 'value') {
    return {
      mode: 'editing-value',
      selectedActionId: action.id,
      filledArgs: filled,
      openArgName: next.name,
      message: `Enter ${next.valueType} for ${action.label}.`,
    };
  }

  if (action.requiresConfirmation) {
    return {
      mode: 'confirming',
      selectedActionId: action.id,
      filledArgs: filled,
      message: `Confirm ${action.label}?`,
    };
  }

  return runAction(action, filled, ctx);
}
```

## Event Flows

### Flow 1: Click a presentation in idle mode

```text
User clicks <MenuItem> Hudson Classic
  -> engine stores selectedRef = { objectType: MenuItem, id: sandwich.hudson-classic }
  -> engine derives available actions for that ref
  -> UI shows CUSTOMIZE in action bar
```

No action runs yet.

### Flow 2: Click an action that needs a ref

```text
User clicks CUSTOMIZE
  -> selected action = CUSTOMIZE
  -> open arg = item: MenuItem
  -> if selectedRef is MenuItem and accepts passes, fill immediately
  -> otherwise enter selecting-ref mode
```

This behavior should be configurable, but the default should be conservative: if there is no selected compatible object, ask the user to select one.

### Flow 3: Action asks for a target

```text
User clicks REMOVE-INGREDIENT
  -> open arg = ingredient: Ingredient
  -> mode = selecting-ref
  -> only accepted Ingredient refs become selectable/red
  -> user clicks tomato
  -> fill ingredient = tomato
  -> run or confirm
```

### Flow 4: REPL value argument

```text
User types FILTER-DIETARY vegan
  -> parse command FILTER-DIETARY with token vegan
  -> action arg tag: DietaryTag is kind value
  -> REPL resolver resolves vegan to a typed DietaryTag value
  -> action runs
```

### Flow 5: Confirmation

```text
User types PLACE-ORDER
  -> action fills cart arg from runtime context or explicit value resolver
  -> action requires confirmation
  -> mode = confirming
User types YES
  -> run action
  -> mode = idle
```

## Proposed Module Layout

The new core should live in a fresh path rather than patching the existing compatibility modules in place. No backwards compatibility is required.

```text
src/generic/clim/core/
  types.ts
  matching.ts
  engine.ts
  repl.ts
  actionInvocationSlice.ts
  presentationState.ts
```

### `core/types.ts`

Defines:

- `SemanticRef`
- `ActionArgSpec`
- `RefArgSpec`
- `ValueArgSpec`
- `ActionSpec`
- `ActionRuntimeContext`
- `ActionInvocationState`
- `ActionResult`

### `core/matching.ts`

Defines:

- `canFillRefArg`
- `canFillValueArg`
- `nextOpenArg`
- `actionsForRef`
- `isPresentationSelectable`

This file should not import React, Redux, Street Deli, or command bindings.

### `core/engine.ts`

Defines pure transition helpers:

- `selectAction`
- `selectPresentation`
- `enterValue`
- `confirm`
- `cancel`
- `continueAction`

This file can return transition descriptions or reducer payloads. It should not render.

### `core/repl.ts`

Defines:

- command normalization;
- command parsing;
- value argument token extraction;
- command history helper types.

The REPL should call the same action engine as the action bar. It should not have a parallel execution path.

### `core/actionInvocationSlice.ts`

Redux slice for:

- selected action id;
- selected ref;
- filled args;
- open arg;
- interaction mode;
- command buffer/history;
- status message.

This replaces the current `pbuiSessionSlice` once the new engine is implemented.

### `core/presentationState.ts`

Derives UI state from engine state:

```ts
function presentationVisualState(ref, engineState, ctx): {
  selected: boolean;
  selectable: boolean;
  disabled: boolean;
}
```

This file should answer visual questions only. It should call `matching.ts` for action argument matching.

## Deli Adapter Shape

Street Deli should provide domain-specific actions, resolvers, and context. It should not provide a custom matching engine.

```text
src/domain/deli/pbui/
  actions.ts
  refs.ts
  runtimeContext.ts
  valueResolvers.ts
```

### `domain/deli/pbui/actions.ts`

Exports `ActionSpec[]`:

```ts
export const deliActions: ActionSpec[] = [
  customize,
  removeIngredient,
  addToOrder,
  placeOrder,
  filterDietary,
];
```

### `domain/deli/pbui/refs.ts`

Builds `SemanticRef`s from current Redux state:

```ts
function menuItemRef(item: MenuItem): SemanticRef<'MenuItem'>
function ingredientRef(ingredient: Ingredient): SemanticRef<'Ingredient'>
function cartRef(cart: Cart): SemanticRef<'Cart'>
```

### `domain/deli/pbui/runtimeContext.ts`

Provides typed domain operations:

```ts
const ctx = {
  deli: {
    isRemovedIngredient(id),
    removeIngredient(id),
    openDetail(id),
    addCurrentDraftToCart(),
    placeOrder(),
  },
  resolve(ref),
};
```

The `accepts` lambda uses this context.

## What to Delete or Replace

This cleanup is a hard cutover. Delete or rewrite the old pieces rather than preserving adapters.

| Current item | Decision | Replacement |
|---|---|---|
| `ActionDescriptor.inputTypes` | Replace | `ActionSpec.args` with typed `ref`/`value` args. |
| `CommandBinding.inputMapping` | Remove from runtime core | Action args and REPL value resolution. |
| `bindingUsesInputSource` | Delete | `nextOpenArg(action, filledArgs)?.kind === 'ref'`. |
| `compatibilityRules.ts` metadata evaluator | Delete or archive after cutover | `canFillRefArg` with `objectType` + `accepts`. |
| `domain/deli/compatibilityRules.ts` | Delete | Deli action `accepts` lambdas. |
| `ActionPresentation.subject` | Remove | `ActionInvocationState.filledArgs`. |
| `compatibleBindingsForPresentation` | Replace | `isPresentationSelectable(ref, state, ctx)`. |
| `PbuiEngineState` in `engineTypes.ts` | Replace | `ActionInvocationState`. |
| `DeliPbuiWorkbench` god component | Split | Shell + view renderer + action engine adapter + Deli refs/actions. |
| `CommandBinding` as runtime primary object | Demote/remove | `ActionSpec` is primary; command label can be a field on action or REPL alias. |

## Implementation Plan

### Phase 1: Create the new core side-by-side, then cut over

Create new files under:

```text
proof-of-concept/deli-pbui-react/src/generic/clim/core/
```

Do not change the compiler yet. First get the POC running on the new runtime.

Implementation tasks:

1. Add `core/types.ts`.
2. Add `core/matching.ts` with unit-level pure functions.
3. Add `core/engine.ts` with pure transition helpers.
4. Add `core/actionInvocationSlice.ts` as the new Redux slice.
5. Add `core/repl.ts` for command parsing and value argument filling.

### Phase 2: Build Deli actions and refs

Create:

```text
src/domain/deli/pbui/actions.ts
src/domain/deli/pbui/refs.ts
src/domain/deli/pbui/runtimeContext.ts
```

Move Deli action behavior out of `handlers.ts` into `ActionSpec.run` where possible. If some behavior needs Redux dispatch, expose it through `ActionRuntimeContext`.

### Phase 3: Replace widget matching and click behavior

Rewrite `DeliPbuiWorkbench` around these rules:

- The action bar renders actions from `ActionSpec[]`.
- Clicking an action calls `selectAction(action)`.
- Clicking a presentation in idle mode selects the object and shows available actions.
- Clicking a presentation in selecting-ref mode fills the open argument if accepted.
- Presentations are selectable only when the selected action has an open ref arg that accepts them.

Pseudocode:

```ts
function onActionClick(action) {
  dispatch(actionEngineActions.selectAction(action.id));
}

function onPresentationClick(ref) {
  dispatch(actionEngineActions.selectPresentation(ref));
}

const visual = presentationVisualState(ref, engineState, ctx);
```

### Phase 4: Replace command binding registry

Remove runtime dependence on `commandBindings.ts` for action execution. Keep command labels/aliases either on `ActionSpec` or in a small command registry:

```ts
interface CommandAlias {
  command: string;
  actionId: string;
}
```

The REPL should map text to action id, then use the same engine path as the action bar.

### Phase 5: Remove legacy compatibility modules

After the POC runs on the new core, delete:

- `generic/clim/compatibilityRules.ts`
- `domain/deli/compatibilityRules.ts`
- old metadata compatibility sections from runtime TS
- `bindingUsesInputSource`
- old binding-oriented helpers in `compatibility.ts`

Keep only visual derivation helpers if they are still useful, but move them into `core/presentationState.ts`.

### Phase 6: Update docs and Storybook

Storybook should show:

- idle object selection;
- action selection;
- selecting-ref mode;
- value input mode;
- confirm mode;
- REPL command flow;
- disabled/unavailable action state.

## Acceptance Criteria

The refactor is complete when the following are true:

- `DeliPbuiWorkbench` no longer contains a Deli-specific `canUsePresentation` function.
- No runtime code uses `inputMapping` or `selected_presentation` strings.
- No runtime code uses metadata rules to decide compatibility.
- A presentation is selectable only when a selected action has an open ref argument slot that accepts it.
- Clicking a presentation in idle mode selects it and shows available actions; it does not run an action by default.
- `REMOVE-INGREDIENT` is represented as an action with an `Ingredient` ref argument and an `accepts` lambda.
- `FILTER-DIETARY` is represented as an action with a `DietaryTag` value argument.
- Confirm and REPL flows use the same engine as action clicks.
- Storybook validates idle selection, action selection, select mode, value entry, and confirm mode.

## API Reference Sketch

### Core Matching API

```ts
canFillRefArg(arg: RefArgSpec, ref: SemanticRef, ctx: ActionRuntimeContext): boolean
canFillValueArg(arg: ValueArgSpec, value: unknown, ctx: ActionRuntimeContext): boolean
nextOpenArg(action: ActionSpec, filled: FilledArgs): ActionArgSpec | undefined
actionsForRef(ref: SemanticRef, actions: ActionSpec[], ctx: ActionRuntimeContext): ActionSpec[]
```

### Core Engine API

```ts
selectAction(actionId: string): EngineTransition
selectPresentation(ref: SemanticRef): EngineTransition
enterValue(argName: string, value: unknown): EngineTransition
confirm(): EngineTransition
cancel(): EngineTransition
```

### Runtime Context API

```ts
interface ActionRuntimeContext {
  resolve(ref: SemanticRef): unknown;
  deli?: {
    isRemovedIngredient(id: string): boolean;
    removeIngredient(id: string): void;
    openDetail(menuItemId: string): void;
    addCurrentDraftToCart(): void;
    placeOrder(): void;
    filterByDietaryTag(tag: unknown): void;
  };
}
```

## File Reference Map for Interns

Start here:

1. `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`
   - Read this to understand why it must be split. It currently contains too many responsibilities.

2. `proof-of-concept/deli-pbui-react/src/generic/clim/types.ts`
   - Read this to see the old weak `ActionDescriptor` model.

3. `proof-of-concept/deli-pbui-react/src/generic/clim/compatibility.ts`
   - Read this to see the old binding-oriented compatibility model that should be replaced.

4. `proof-of-concept/deli-pbui-react/src/generic/clim/compatibilityRules.ts`
   - Read this to understand the metadata compatibility engine we are deliberately simplifying away.

5. `proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts`
   - Read this because it is the closest existing slice to the future action invocation slice.

6. `proof-of-concept/deli-pbui-react/src/domain/deli/deliWorkbenchSlice.ts`
   - Read this for the domain state that the runtime context will query and mutate.

7. `proof-of-concept/deli-pbui-react/src/generic/clim/commandParser.ts`
   - Read this to understand the REPL command path that should call the new action engine.

## Design Decisions

### Decision 1: Actions own argument types

An action should say it accepts `MenuItem`, `Ingredient`, `Cart`, or `DietaryTag`. It should not say it accepts `SemanticRef` and then rely on a separate metadata rule to recover the actual type.

### Decision 2: `accepts` lambdas replace metadata matching

The `accepts` lambda is the extension point. It is more expressive and less complicated than a declarative metadata predicate system. The compiler can still generate or wire lambdas, but the runtime engine should only call a function.

### Decision 3: Action invocation state is its own slice

Action invocation is not just UI state. It is the CLIM interaction state machine. It should live in a Redux slice so Storybook, tests, and generated apps can compose it like any other app state.

### Decision 4: Presentations are selected by default, not invoked by default

Clicking a presentation should select it and show available actions. Direct invocation can be configured later, but it should not be the default because it makes action selection implicit and harder to validate.

### Decision 5: Capabilities remain as hints

Capabilities can stay on refs for debug display and MetaDesignSystem planning. They should not be the primary runtime matching rule.

## Alternatives Considered

### Keep metadata compatibility rules

This works, and the current POC proves it. The downside is that it creates a rule language over presentation metadata, which is more complicated than the actual model requires. It also risks stale snapshot bugs, because metadata lives on copied refs.

### Keep command bindings as the primary runtime object

Command bindings are useful profile artifacts, but they are not the action engine. They mix view labels, handlers, input sources, surfaces, and confirmation behavior. The core engine should execute actions with typed args; command labels should be REPL/action-bar aliases over actions.

### Use capabilities for runtime matching

Capabilities are flexible, but too vague. `removable` is useful as a display/debug hint, but whether an ingredient is currently removable is domain state. The `accepts` lambda should ask domain state directly.

## Open Questions

- Should `ActionSpec.run` directly perform domain effects, or should it return effect descriptions that adapters execute?
- Should value arguments like `DietaryTag` resolve to refs or typed scalar value objects?
- Should command aliases live on `ActionSpec` or in a separate REPL command registry?
- Should route/view state remain in Deli workbench state, or should it become part of a generic PBUI route slice?
- Should direct-click invocation be configured at the action level, presentation level, or view profile level?

## Closing

The proof-of-concept has reached the point where more features will not help unless the core is simplified. The next implementation should be a hard cutover to a minimal action engine. The purpose is not to preserve the current runtime shapes; the purpose is to preserve the useful behavior while deleting the accidental complexity that emerged during discovery.
