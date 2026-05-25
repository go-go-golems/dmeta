---
Title: PBUI Core Action Presentation Ref Navigation Select Engine
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
      Note: |-
        Concrete Street Deli command/action bindings used as the first profile-level input to the engine.
        Command binding source for action/ref engine examples and BACK availability
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
      Note: |-
        Encodes the reviewed visual rules that the engine and target components must respect.
        Concrete PBUI visual rules for no boxes
    - Path: examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
      Note: |-
        Concrete Street Deli view models and default command sets.
        View model source for command availability examples
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/components
      Note: Extracted PBUI React component kit baseline with per-widget Storybook stories
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/components/
      Note: |-
        Current proof-of-concept generic CLIM shell and presentation components.
        Current generic CLIM renderer baseline for style states
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiClickableText/PbuiClickableText.tsx
      Note: Shared dotted underline primitive for actions and selectable refs
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiPresentationRef/PbuiPresentationRef.tsx
      Note: Semantic presentation ref renderer with muted techno-babble and selectable label
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts
      Note: |-
        Current proof-of-concept command-binding and action-request helper baseline.
        Current compatibility/request helper baseline
    - Path: proof-of-concept/deli-pbui-react/src/generic/clim/types.ts
      Note: Current proof-of-concept generic runtime type baseline.
    - Path: proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx
      Note: |-
        Current hand-authored POC where missing engine responsibilities are still visible.
        Current POC widget showing missing engine responsibilities
ExternalSources:
    - /home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim — Prior CLIM runtime reference for refs, actions, command parsing, and interaction modes.
Summary: Design and implementation guide for the reusable PBUI engine that manages presentation refs, action compatibility, slot filling, selection, command input, view navigation, URL routing, and confirmation.
LastUpdated: 2026-05-25T13:18:01.895217141-04:00
WhatFor: Use this document to implement the reusable core interaction engine shared by PBUI applications before moving the Street Deli POC behavior into generated/runtime code.
WhenToUse: Read before extending proof-of-concept/deli-pbui-react beyond local widget state, generating command/action registries, or adding select-mode/navigation behavior to PBUI targets.
---



# PBUI Core Action Presentation Ref Navigation Select Engine

## Executive Summary

The Street Deli PBUI proof of concept now has enough interaction behavior to reveal the next missing layer. It can render presentation references, expose command/action bindings, build action requests, navigate between a few views, confirm a dangerous action, and keep a small cart draft in local React state. These behaviors work, but they are still distributed across the widget. The widget decides what is clickable, which command to run, whether an order can be placed, how BACK behaves, and how a view transition should update state.

A PBUI application needs a reusable engine for these responsibilities. The engine is the runtime layer that connects presentation references, action descriptors, command bindings, selection state, mode state, action input slots, command input, view navigation, URL routing, disabled reasons, and confirmation. It is not specific to Street Deli. Street Deli supplies domain objects, projection functions, action bindings, and handlers. The engine supplies the general rules for how a user chooses objects and actions in a presentation-based interface.

This document explains the engine that should be built next. It is written for a new developer who needs to understand the problem, the target architecture, the data model, the algorithms, the React integration points, and the implementation phases.

## 1. The problem this engine solves

The proof of concept currently mixes application behavior and generic PBUI behavior. That was useful while discovering the target, but it should not become the architecture. When a user clicks a menu item, a removable ingredient, `PLACE-ORDER`, or `BACK`, the widget currently decides what happens. That works for a demo. It does not scale to another PBUI application because every application would have to reimplement the same rules.

The repeated questions are generic:

- What presentation reference is currently selected?
- Which actions can accept this reference as an input?
- Which command bindings are available in the current view?
- Which action inputs are already filled by selected refs or command arguments?
- Which actions are enabled, disabled, dangerous, or waiting for confirmation?
- Should clicking a ref merely select it, pre-fill an action slot, enter select mode, or invoke an action?
- What should happen when the user types a command in the footer?
- What route should represent the current view?
- How should BACK use route history?

These questions should be answered once in a reusable engine. The current Street Deli widget should become a client of that engine.

## 2. Vocabulary

The engine uses a small set of terms. These terms must stay precise because they map directly to YAML schemas, TypeScript types, and runtime behavior.

| Term | Meaning | Example |
|---|---|---|
| PresentationRef | A typed reference to something presented on screen. | `<MenuItem> Hudson Classic #sandwich.hudson-classic` |
| ActionDescriptor | The semantic action id, input schema, effects, and safety. | `submit_order(cart_ref)` |
| CommandBinding | A concrete UI command label bound to an action, view, surface, input mapping, and handler. | `PLACE-ORDER -> submit_order` |
| Action slot | One required or optional input position for an action. | `part_ref` for `remove_part` |
| Filled slot | A slot with a concrete value from a ref, command arg, current draft, current cart, or route state. | `part_ref = ingredient.turkey` |
| Compatible action | An action whose input schema can accept the current ref or current state. | `remove_part` accepts an ingredient ref in detail view |
| View model | The current PBUI view definition and its default commands. | `detail`, `cart`, `help` |
| Mode | The current interaction mode. | `normal`, `select`, `confirm` |
| Route state | The URL-visible state representing the current view and main objects. | `/detail/sandwich.hudson-classic` |

## 3. Current evidence from the Street Deli proof of concept

The current proof-of-concept files are the evidence base for this design.

```text
proof-of-concept/deli-pbui-react/src/generic/clim/types.ts
proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts
proof-of-concept/deli-pbui-react/src/generic/clim/components/
proof-of-concept/deli-pbui-react/src/domain/deli/commandBindings.ts
proof-of-concept/deli-pbui-react/src/domain/deli/viewModels.ts
proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx
```

The current code proves four useful ideas:

- Command bindings are the right concrete layer for labels such as `PLACE-ORDER`, `BACK`, and `REMOVE-INGREDIENT`.
- Presentation refs should be generic objects with type, id, label, capabilities, and metadata.
- Action requests can be built from command bindings and a small input context.
- View transitions and confirmation are part of the runtime contract, not only styling.

The current code also shows what is missing:

- Compatibility is currently based on simple input source names such as `selected_presentation`.
- View transitions are encoded in widget switch statements.
- URL routing is not the source of truth.
- BACK is not a generic history-aware command yet.
- Empty-order prevention is not part of a generic availability check.
- Removed presentation styling and clickable-ref styling have to be applied consistently from the profile.

## 4. Style and interaction rules from the profile

The updated Street Deli style profile is:

```text
examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml
```

The profile now records visual rules that target components and the engine must respect. These rules matter because the engine computes states such as selectable, selected, disabled, removed, dangerous, and confirm. The target renderer then turns those states into visual treatment.

The core visual rules are:

- Ordinary sections and presentation rows are text, not boxes.
- Underline signals clickability and validity.
- Presentation refs turn red when they are selectable.
- Red is not passive selection. Red means the ref is a valid target for an available or pending action.
- Titles and section labels such as `VIEW MODEL` and `COMPOSITION DRAFT` are not underlined unless they are themselves actions.
- Removed rows become faint across the entire row.
- Dangerous actions such as `PLACE-ORDER` use the danger color and confirmation flow.

The engine should not hard-code CSS class strings. It should compute semantic UI states:

```ts
type PresentationVisualState = {
  selected: boolean;
  selectable: boolean;
  disabled: boolean;
  removed: boolean;
  dangerousTarget: boolean;
};
```

The target component maps this state through the style profile:

```text
selectable -> red + underline + pointer
selected -> bright text or textual marker, not red underline
removed -> opacity/dim treatment across whole row
section label -> plain muted/uppercase text, no underline
```

## 5. The engine boundary

The core engine is a TypeScript runtime module. It should not know that the app is a deli. It should not know about sandwiches, ingredients, carts, or substitutions. It should know about refs, descriptors, bindings, views, routes, and mode transitions.

A first target location in the POC is:

```text
proof-of-concept/deli-pbui-react/src/generic/clim/engine.ts
```

A later reusable package might be:

```text
packages/pbui-react-clim/src/engine.ts
```

The engine receives application-provided registries:

```ts
interface PBUIEngineConfig<TView extends string, TCommand extends string, TAction extends string> {
  views: Record<TView, ViewModelDefinition<TView, TCommand>>;
  actions: Record<TAction, ActionDescriptor<TAction>>;
  commandBindings: Record<TCommand, CommandBinding<TCommand, TAction>>;
  routes: RouteAdapter<TView>;
  actionPolicies: ActionPolicyRegistry<TAction>;
}
```

The engine owns interaction state:

```ts
interface PBUIEngineState<TView extends string, TCommand extends string, TAction extends string> {
  view: TView;
  mode: 'normal' | 'select' | 'confirm';
  selectedRef?: PresentationRef;
  focusedRef?: PresentationRef;
  pendingCommand?: CommandBinding<TCommand, TAction>;
  pendingRequest?: ActionRequest<TAction>;
  slotState: ActionSlotState<TAction>;
  commandBuffer: string;
  resultLine?: string;
  history: RouteSnapshot<TView>[];
}
```

The application owns domain state:

```ts
interface DeliDomainState {
  menu: MenuItem[];
  selectedItemId?: string;
  draft?: CompositionDraft;
  cart: DeliCartItem[];
  order?: Order;
}
```

The boundary is important. The engine can say: `REMOVE-INGREDIENT` is available for this ref and will produce an action request. The Street Deli application decides how removing an ingredient mutates the draft.

## 6. Engine inputs

### 6.1 Presentation refs

A presentation ref is the unit of selection and action targeting.

```ts
interface PresentationRef<TType extends string = string> {
  type: TType;
  id: string;
  label: string;
  capabilities: string[];
  metadata?: Record<string, string | number | boolean | string[]>;
}
```

Presentation refs should be created by domain projection functions. For Street Deli:

```ts
function ingredientPresentation(ingredient: Ingredient): PresentationRef<'Ingredient'> {
  return {
    type: 'Ingredient',
    id: ingredient.id,
    label: `${ingredient.name} [${ingredient.role}]`,
    capabilities: ingredient.removable ? ['labelable', 'removable'] : ['labelable'],
    metadata: { role: ingredient.role, removable: ingredient.removable },
  };
}
```

The engine should treat refs as typed values. It should not parse labels to decide behavior.

### 6.2 Action descriptors

An action descriptor describes semantic action shape.

```ts
interface ActionDescriptor<TAction extends string = string> {
  id: TAction;
  label: string;
  description: string;
  inputTypes: Record<string, 'SemanticRef' | 'string' | 'number' | 'boolean'>;
  mutatesBackend: boolean;
  requiresConfirmation: boolean;
}
```

This should eventually be generated from Interaction IR actions in:

```text
examples/street-deli-ordering/interactions/actions.yaml
```

### 6.3 Command bindings

A command binding maps a concrete command label to an action descriptor and runtime binding details.

```ts
interface CommandBinding<TCommand extends string, TAction extends string> {
  id: TCommand;
  actionId: TAction;
  label: string;
  summary: string;
  views: string[];
  presentationType: string;
  surface: string;
  handler: string;
  inputMapping: Record<string, string>;
  requiresConfirmation: boolean;
  confirmation?: ConfirmationSpec;
}
```

Street Deli source:

```text
examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml
```

Example:

```yaml
REMOVE-INGREDIENT:
  action: remove_part
  views: [detail]
  input_mapping:
    composition_ref: current_draft
    part_ref: selected_presentation
```

This tells the engine that a clicked presentation can fill `part_ref` if the clicked presentation is compatible with the action.

### 6.4 View models

A view model defines the current set of default commands and presentation families.

```ts
interface ViewModelDefinition<TView extends string, TCommand extends string> {
  id: TView;
  modeLabel: string;
  primaryPresentations: string[];
  defaultActions: TCommand[];
}
```

Street Deli source:

```text
examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml
```

`BACK` should be available in most non-root views. The engine should not treat BACK as an app-specific hack. It should use route history first, then a configured fallback route.

### 6.5 Route adapter

The route adapter maps between engine state and React routing.

```ts
interface RouteAdapter<TView extends string> {
  parse(location: Location): RouteSnapshot<TView>;
  format(snapshot: RouteSnapshot<TView>): string;
  replace(snapshot: RouteSnapshot<TView>): void;
  push(snapshot: RouteSnapshot<TView>): void;
  back(fallback: RouteSnapshot<TView>): void;
}
```

For Street Deli, target routes should eventually look like:

```text
/menu
/detail/:menuItemId
/substitution/:draftId/:partId
/cart
/help
/tracker/:orderId
```

The POC may use query or hash routes temporarily, but the engine should expose a normal React routing integration.

## 7. Engine outputs

The engine should produce a derived view of interaction state for renderers.

```ts
interface PBUIDerivedState<TCommand extends string, TAction extends string> {
  availableCommands: AvailableCommand<TCommand, TAction>[];
  selectedRef?: PresentationRef;
  presentationStates: Record<string, PresentationVisualState>;
  pendingPrompt?: ConfirmationPrompt<TCommand, TAction>;
  commandLine: CommandLineState;
}
```

A renderer should be able to ask:

```ts
const state = engine.presentationState(ref);
```

and receive:

```ts
{
  selected: false,
  selectable: true,
  disabled: false,
  removed: false,
  dangerousTarget: false,
}
```

It should not have to recompute compatibility in React component code.

## 8. Compatibility and slot filling

Compatibility is the center of the engine. A ref click should not blindly execute the first command. It should update selection and compute the actions that can accept the ref.

The first implementation can use command binding input sources:

```ts
function bindingUsesSelectedPresentation(binding: CommandBinding): boolean {
  return Object.values(binding.inputMapping).includes('selected_presentation');
}
```

That is useful but incomplete. The final compatibility check should use action input types and constraints.

A better algorithm:

```ts
function compatibleSlots(ref, action, binding, context): CompatibleSlot[] {
  const slots = [];

  for (const [inputName, inputType] of Object.entries(action.inputTypes)) {
    const source = binding.inputMapping[inputName];

    if (source !== 'selected_presentation') continue;
    if (!refCanSatisfyInput(ref, action, inputName, context)) continue;

    slots.push({ actionId: action.id, inputName, ref });
  }

  return slots;
}
```

The missing function is `refCanSatisfyInput`. In v1 it can check ref type and capabilities. Later it should use Interaction IR selectors.

```ts
function refCanSatisfyInput(ref, action, inputName, context): boolean {
  const constraint = context.actionInputConstraints[action.id]?.[inputName];

  if (!constraint) return true;
  if (constraint.types && !constraint.types.includes(ref.type)) return false;
  if (constraint.capabilities && !constraint.capabilities.every(c => ref.capabilities.includes(c))) return false;

  return true;
}
```

For Street Deli:

```text
ref = <Ingredient turkey>
action = remove_part
slot = part_ref
constraint = type Ingredient, capability removable
result = compatible
```

For sourdough:

```text
ref = <Ingredient sourdough>
action = remove_part
slot = part_ref
constraint = type Ingredient, capability removable
result = incompatible
```

## 9. Click behavior

Clicking a ref should follow a generic policy. The policy should not live inside `DeliPbuiWorkbench`.

Recommended v1 behavior:

```text
onPresentationClick(ref):
  select ref
  compute compatible commands for current view
  fill any slots that can be filled by this ref

  if mode == select and pending action has enough inputs:
    build request
    maybe confirm or execute
    return

  if normal mode and exactly one direct default command is compatible:
    if command policy allows direct invoke:
      maybe confirm or execute
    else:
      show narrowed action set
    return

  show narrowed compatible action set
```

Direct invocation should be controlled by policy. For example:

```ts
interface ActionInvocationPolicy {
  directInvokeOnRefClick: boolean;
  requireExplicitActionFirst: boolean;
}
```

Street Deli might allow direct `CUSTOMIZE` on menu-item click and direct `REMOVE-INGREDIENT` on ingredient click in the POC. A more formal CLIM mode might require choosing `REMOVE-INGREDIENT` first, then clicking an ingredient in select mode. The engine should support both policies.

## 10. Command input behavior

The footer command line should be an actual input. It should parse commands through the same command binding registry used by clickable actions.

Basic algorithm:

```ts
onCommandSubmit(text):
  parsed = parseCommand(text)
  binding = findBindingForCurrentView(parsed.command)

  if no binding:
    resultLine = `Unknown command for ${currentView}`
    return

  slotState = fillSlotsFromCommandArgs(binding, parsed.args)
  slotState = fillSlotsFromCurrentContext(binding, slotState)

  if missing required slots:
    mode = select
    pendingCommand = binding
    resultLine = `Select ${missingSlot}`
    return

  request = buildActionRequest(binding, slotState)

  if request requires confirmation:
    mode = confirm
    pendingRequest = request
    return

  execute request
```

Example:

```text
FILTER-DIETARY vegetarian
```

parses as:

```ts
{
  command: 'FILTER-DIETARY',
  args: ['vegetarian']
}
```

and fills:

```ts
{
  dietary_tag: 'vegetarian'
}
```

The argument schema should eventually live in `action-bindings.yaml`, not in ad hoc parsing code.

## 11. Availability and disabled reasons

A command may be known but unavailable. `PLACE-ORDER` is the current example. It should not be executable when the cart is empty.

The engine should distinguish three states:

| State | Meaning | Example |
|---|---|---|
| hidden | Not relevant in this view. | `APPLY` in menu view |
| disabled | Relevant but unavailable; show reason. | `PLACE-ORDER` in empty cart |
| enabled | Runnable or can enter select/confirm. | `CUSTOMIZE` when a menu item is selected |

Policy shape:

```ts
interface AvailabilityResult {
  enabled: boolean;
  reason?: string;
}

type AvailabilityPolicy<TAction extends string> = (
  action: ActionDescriptor<TAction>,
  binding: CommandBinding,
  context: EngineContext,
) => AvailabilityResult;
```

Street Deli policy:

```ts
function streetDeliAvailability(action, binding, context) {
  if (binding.id === 'PLACE-ORDER' && context.domain.cart.items.length === 0) {
    return { enabled: false, reason: 'Cart is empty.' };
  }
  return { enabled: true };
}
```

The renderer should still show disabled commands when useful, but the visual style must be dim and must not signal valid clickability.

## 12. Navigation and URL routing

View transitions should update the URL. This is not optional in a React application because the URL is how users reload, share, navigate back, and inspect state.

Recommended route mapping:

```text
/menu
/detail/:menuItemId
/substitution/:draftId/:partId
/cart
/help
/tracker/:orderId
```

The engine should expose navigation commands:

```ts
engine.navigate({ view: 'detail', params: { menuItemId } });
engine.back({ fallback: { view: 'menu' } });
```

`BACK` should use browser/history semantics:

```ts
function executeBack() {
  if (history.canGoBackWithinApp()) {
    routeAdapter.back({ view: 'menu' });
  } else {
    routeAdapter.push({ view: 'menu' });
  }
}
```

This means `BACK` is not the same thing as `MENU`. `MENU` is an explicit route command. `BACK` is history-aware.

## 13. Mode machine

The engine needs a small deterministic mode machine.

```text
normal
  click action with complete inputs -> execute or confirm
  click action missing ref input -> select
  click compatible ref with direct policy -> execute or confirm
  type command with complete inputs -> execute or confirm
  type command missing ref input -> select

select
  click compatible ref -> fill slot
  if request complete -> execute or confirm
  press Escape / CANCEL -> normal

confirm
  confirm -> execute request
  cancel -> normal
```

Pseudocode:

```ts
function transition(state, event) {
  switch (state.mode) {
    case 'normal':
      return handleNormal(state, event);
    case 'select':
      return handleSelect(state, event);
    case 'confirm':
      return handleConfirm(state, event);
  }
}
```

The important property is that rendering should be derived from mode state. If the engine is in `select`, compatible refs turn red and underline. If the engine is in `confirm`, the confirmation prompt is visible and the pending request is fixed.

## 14. React integration API

The React integration should be hook-based.

```ts
function usePBUIEngine(config, domainContext) {
  const [state, dispatch] = useReducer(engineReducer, initialStateFromRoute());
  const derived = derivePBUIState(state, config, domainContext);

  return {
    state,
    derived,
    selectRef: (ref) => dispatch({ type: 'presentation.clicked', ref }),
    invokeCommand: (commandId) => dispatch({ type: 'command.invoked', commandId }),
    submitCommandLine: (text) => dispatch({ type: 'command.submitted', text }),
    confirm: () => dispatch({ type: 'confirm.accepted' }),
    cancel: () => dispatch({ type: 'confirm.cancelled' }),
    navigate: (route) => dispatch({ type: 'route.navigate', route }),
    back: () => dispatch({ type: 'route.back' }),
  };
}
```

A component should become simple:

```tsx
function PresentationLine({ ref }) {
  const visual = engine.derived.presentationStates[ref.id];

  return (
    <PresentationRefLine
      presentation={ref}
      selected={visual.selected}
      selectable={visual.selectable}
      disabled={visual.disabled}
      removed={visual.removed}
      onSelect={() => engine.selectRef(ref)}
    />
  );
}
```

The widget should not decide compatibility. It should display engine-derived state and send events back to the engine.

## 15. What stays application-specific

The engine must not absorb application logic.

Street Deli should still own:

- menu fixtures and API calls;
- composition draft reducer;
- cart reducer;
- order submission handler;
- domain projection functions;
- Deli-specific availability policy;
- Deli-specific route parameter interpretation;
- Deli-specific generated registries.

The engine owns:

- ref selection;
- action slot filling;
- command parsing dispatch;
- mode transitions;
- confirmation flow;
- route synchronization contract;
- command/action availability state;
- derived visual state for refs/actions.

## 16. Implementation plan

### Phase 1: Extract engine types

Create:

```text
proof-of-concept/deli-pbui-react/src/generic/clim/engineTypes.ts
```

Move or define:

- `PBUIEngineState`
- `PBUIDerivedState`
- `PresentationVisualState`
- `ActionSlotState`
- `RouteSnapshot`
- `AvailabilityResult`
- `EngineEvent`

Acceptance criteria:

- Existing POC builds.
- No behavior changes yet.

### Phase 2: Extract compatibility and derived state

Create:

```text
proof-of-concept/deli-pbui-react/src/generic/clim/compatibility.ts
```

Implement:

```ts
compatibleCommandsForRef(ref, view, registries, context)
derivePresentationVisualState(ref, engineState, compatibleCommands)
deriveAvailableCommands(view, registries, context)
```

Acceptance criteria:

- Menu item click and ingredient click still work.
- Compatibility logic is no longer embedded in `DeliPbuiWorkbench`.

### Phase 3: Add availability policies

Add:

```ts
availabilityPolicies.ts
```

Implement generic policy composition:

```ts
result = allPolicies.every(policy => policy(...).enabled)
```

Street Deli first policy:

```text
PLACE-ORDER disabled when cart is empty
```

Acceptance criteria:

- `PLACE-ORDER` is disabled in empty cart.
- Disabled reason is visible in result/help text or command metadata.

### Phase 4: Add route adapter

For the POC, use a browser-history adapter without adding a router dependency first.

```ts
window.history.pushState(...)
window.addEventListener('popstate', ...)
```

Later, support React Router or TanStack Router.

Acceptance criteria:

- Navigating to cart updates URL.
- Reloading `/cart` or `?view=cart` restores cart view if enough state exists.
- BACK follows app history with menu fallback.

### Phase 5: Add reducer-based mode machine

Create:

```text
proof-of-concept/deli-pbui-react/src/generic/clim/engineReducer.ts
```

Events:

```ts
{ type: 'presentation.clicked', ref }
{ type: 'command.clicked', commandId }
{ type: 'command.submitted', text }
{ type: 'confirm.accepted' }
{ type: 'confirm.cancelled' }
{ type: 'route.changed', route }
```

Acceptance criteria:

- Current flow passes.
- Confirmation behavior is not implemented in widget-local code.
- Select mode can be added by reducer transition rather than per-view handlers.

### Phase 6: Replace POC ad hoc widget logic

`DeliPbuiWorkbench` should become a composition of:

- domain data selectors;
- projection functions;
- `usePBUIEngine`;
- renderer components.

Acceptance criteria:

- The widget no longer contains a large switch for command execution except for domain handler dispatch.
- Playwright flow still passes.

## 17. Code-generation implications

The compiler should eventually generate several pieces from IR/profile YAML:

```text
src/domain/deli/generated/actionDescriptors.ts
src/domain/deli/generated/commandBindings.ts
src/domain/deli/generated/viewModels.ts
src/domain/deli/generated/routeSpec.ts
src/domain/deli/generated/actionInputConstraints.ts
```

The engine should be handwritten and reusable. Generated code should configure it.

The generation boundary should look like this:

```text
YAML/IR/profile
  -> generated registries and constraints
  -> reusable engine
  -> app-specific handlers and projection functions
  -> generic renderer components
```

This prevents templates from reimplementing behavior in every generated widget.

## 18. Component kit baseline

The engine should not emit Tailwind class strings directly into application widgets. It should emit semantic state, and a small PBUI/CLIM React component kit should render that state consistently. The proof of concept now starts that extraction under:

```text
proof-of-concept/deli-pbui-react/src/generic/clim/components/
```

Each component has its own directory with implementation, Storybook story, `types.ts`, and `index.ts`. This structure gives generators a stable target. A generated or hand-authored view should render semantic data through these components instead of reconstructing the visual grammar locally.

The current baseline components are:

| Component | Responsibility |
|---|---|
| `PbuiText` | Render normal, bright, muted, danger, and removed text tones. |
| `PbuiClickableText` | Render the shared dotted underline affordance for actions and selectable reference labels. |
| `PbuiSectionLabel` | Render non-clickable section labels such as `VIEW MODEL` and `COMPOSITION DRAFT`. |
| `PbuiPresentationRef` | Render `<Type> label #id capabilities` while keeping technical text muted and making only the semantic label selectable. |
| `PbuiAction` | Render one action/command presentation through `PbuiClickableText`. |
| `PbuiActionBar` | Render the current command/action set without box styling. |
| `PbuiCommandLine` | Render the editable command input and result line. |
| `PbuiConfirmPrompt` | Render confirmation prompts using text affordances, not panels. |
| `PbuiShell` | Render the global CLIM shell and command line. |

`PbuiClickableText` owns the underline implementation:

```ts
const clickableDecorationStyle = {
  textDecorationLine: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationSkipInk: 'auto',
  textUnderlineOffset: '2.5px',
  textDecorationThickness: '1px',
};
```

The fixed pixel underline offset is intentional. If the offset is expressed in `em`, uppercase action labels and lowercase ingredient labels with descenders compute different pixel offsets. A shared `2.5px` offset keeps command labels and selectable reference labels aligned while `text-decoration-skip-ink: auto` avoids drawing through glyph ink.

## 19. Testing plan

### Unit tests

Test the engine without React:

```ts
it('marks removable ingredient as compatible with REMOVE-INGREDIENT')
it('does not mark non-removable bread as compatible')
it('disables PLACE-ORDER when cart is empty')
it('enters confirm mode for submit_order')
it('BACK uses history before fallback')
```

### Storybook tests

Use stories for state review:

- menu with compatible menu refs;
- detail with removable/non-removable ingredients;
- cart empty with disabled `PLACE-ORDER`;
- cart with item and confirmation;
- help showing command registry;
- tracker with BACK/MENU.

### Playwright tests

Start with the current manual flow and commit it later:

```text
open /menu
click Market Greens
expect /detail/salad.market-greens
click avocado
expect REMOVE-INGREDIENT request or select-mode slot fill
click ADD-TO-ORDER
expect /cart
click PLACE-ORDER
expect confirm prompt
confirm
expect /tracker/<orderId>
```

## 20. Design decisions

### Decision 1: Command bindings are concrete profile data

Command labels, surfaces, handlers, input mappings, and confirmation text belong in the PBUI profile. They are not universal Interaction IR. `submit_order` is a semantic action. `PLACE-ORDER` is a concrete Street Deli command.

### Decision 2: The engine computes states; components render states

React components should not decide compatibility. They should receive `selected`, `selectable`, `removed`, `disabled`, and `dangerous` state and render them according to the style profile.

### Decision 3: URL routing is part of the engine contract

A PBUI application is still a React application. View state must be reflected in the URL. The engine should integrate with routing rather than hiding view state inside component-local state.

### Decision 4: BACK is history-aware

`BACK` and `MENU` are different. `MENU` navigates to a known route. `BACK` should use route history with a fallback.

### Decision 5: Select mode remains first-class

Direct ref click is useful, but select mode is still required. Some actions should be chosen first, then filled by clicking a compatible ref. The engine must support both policies.

## 21. Open questions

- Should the first route adapter use query params, hash routing, or `history.pushState` paths in the standalone POC?
- Should `action-bindings.yaml` include an explicit argument schema for command-line parsing?
- How much of `refCanSatisfyInput` can be generated from Interaction IR selectors in the next pass?
- Should disabled actions remain visible by default, or should each view decide visibility policy?
- Should passive selection get a textual marker such as `SELECTED`, or should it remain bright text only?

## 22. Key points

- The next reusable PBUI layer is an action/presentation/ref/navigation/select engine.
- The engine connects refs, actions, command bindings, selection, slot filling, availability, confirmation, and routing.
- Street Deli should configure the engine; it should not own the generic interaction rules.
- Visual state must be derived by the engine and rendered through the style profile.
- URL routing and BACK behavior are part of the core interaction model, not cosmetic details.
- The current POC should be refactored toward this engine before more compiler templates are written.

## References

- `examples/street-deli-ordering/meta-design-systems/pbui/style-profile.yaml`
- `examples/street-deli-ordering/meta-design-systems/pbui/action-bindings.yaml`
- `examples/street-deli-ordering/meta-design-systems/pbui/view-models.yaml`
- `proof-of-concept/deli-pbui-react/src/generic/clim/types.ts`
- `proof-of-concept/deli-pbui-react/src/generic/clim/runtime.ts`
- `proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/widget.tsx`
- `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim`
