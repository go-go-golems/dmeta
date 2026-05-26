# Generic CLIM (Command Line Interface Model) Layer

This directory contains the domain-agnostic CLIM framework that can be reused across different PBUI (Presentation-Based User Interface) applications.

## Architecture

```
┌─────────────────────────────────────────────┐
│                  PbuiShell                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Header  │ │  Views   │ │ Command Line  │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────────────┐ ┌────────────────────┐  │
│  │  Action Bar     │ │    Hint Bar        │  │
│  └─────────────────┘ └────────────────────┘  │
│  ┌─────────────────┐ ┌────────────────────┐  │
│  │  Context Menu    │ │  Confirm Modal     │  │
│  └─────────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Core Types (`types.ts`)

| Type | Purpose |
|------|---------|
| `PresentationRef` | A reference to a domain object (type, id, label, capabilities, copyValue) |
| `ActionSpec` | An action definition (id, label, description, views, args, run) |
| `ActionPresentation` | An action enriched for rendering (intents, requiresConfirmation, disabledReason) |
| `ActionIntent` | Semantic intent: navigate, inspect, filter, mutate, dangerous, external, confirm, cancel |
| `PbuiInteractionState` | Discriminated union: `normal \| select \| confirm` |
| `ClimSessionState` | Shell-facing view model (modeLabel, commandBuffer, resultLine, commandHint) |
| `ContextMenuState` | Context menu position, ref, and actions |

## Key Concepts

### Discriminated Interaction State

The `PbuiInteractionState` union makes impossible states unrepresentable:

```typescript
type PbuiInteractionState =
  | { kind: 'normal' }
  | { kind: 'select'; action: ActionSpec; filledArgs: Record<string, unknown> }
  | { kind: 'confirm'; action: ActionSpec; request: ActionRequest; filledArgs: Record<string, unknown> }
```

TypeScript narrowing on `interaction.kind` eliminates an entire class of state bugs.

### Action Intents

Every action carries semantic intents derived from its spec:

```typescript
function actionIntents(action: ActionSpec): ActionIntent[]
// PLACE-ORDER → ['dangerous', 'confirm', 'mutate']
// BACK → ['navigate', 'cancel']
// CUSTOMIZE → ['inspect', 'mutate']
```

Intents drive visual rendering: dangerous actions get red styling, confirm intents trigger the modal, navigate actions get neutral styling.

### Presentation Refs

Domain objects are represented as `PresentationRef` — a lightweight, serializable reference:

```typescript
interface PresentationRef {
  type: string;          // e.g. 'MenuItem', 'Ingredient'
  id: string;           // e.g. 'classic-blta'
  label: string;        // e.g. 'Classic BLTA $11.95'
  capabilities: string[]; // e.g. ['labelable', 'composable']
  copyValue?: string;    // e.g. 'classic-blta' (for clipboard)
}
```

### Action Arguments

Actions can accept two kinds of arguments:

- **Ref arguments** (`kind: 'ref'`): filled by clicking a compatible presentation
- **Value arguments** (`kind: 'value'`): filled by typing in the command line

The action engine automatically determines which presentations are compatible with a ref argument using the `accepts` predicate or `objectType` matching.

## Components

| Component | Purpose |
|-----------|---------|
| `PbuiShell` | Top-level layout: header, main content, command line, overlays |
| `PbuiCommandLine` | Command input with result line, hint line, action status |
| `PbuiActionBar` | Horizontal row of action buttons for the current view |
| `PbuiHintBar` | Context-sensitive hint with compatible actions for selected ref |
| `PbuiPresentationRef` | Clickable presentation reference with select/muted/disabled/dangerousTarget states |
| `PbuiContextMenu` | Right-click positioned popup with compatible actions |
| `PbuiConfirmModal` | Overlay modal for dangerous action confirmation |
| `PbuiHelpView` | Generated help from action and prefix-command registries |
| `PbuiAction` | Single action button with intent-based styling |

## Action Engine (`actionEngine.ts`)

```typescript
// Derive intents from an action spec
actionIntents(action: ActionSpec): ActionIntent[]

// Convert action spec to presentation (with intents, confirmation flag)
actionToPresentation(action: ActionSpec): ActionPresentation

// Filter actions compatible with a selected presentation
compatibleActionPresentations(actions, ref, context): ActionPresentation[]

// Build presentations for a set of action specs, filtering by view
actionPresentationsForSpecs({ actions, view?, ref?, context? }): ActionPresentation[]
```

## Command Parser (`commandParser.ts`)

Supports three command types:

1. **Action commands**: `CUSTOMIZE`, `PLACE-ORDER`, `HELP`
2. **Prefix commands**: `SEARCH <query>`, `CATEGORY <name>`, `DIET <tag>`
3. **Meta commands**: `ESC` (cancel), `YES` (confirm), `LIST` (list views)

Prefix commands are registered globally via `registerPrefixCommands()`.

## Session State (`pbuiSessionSlice.ts`)

RTK slice managing:

- `interaction`: the current interaction state (normal/select/confirm)
- `commandBuffer`: current command input text
- `resultLine`: last result message
- `commandHint`: contextual hint below the result line
- `commandHistory`: command history for Up/Down navigation
- `selectedRef`: currently selected presentation
- `contextMenu`: context menu state (visible, position, ref, actions)

## Domain Integration

To use the generic CLIM layer for a new domain:

1. Define domain `PresentationRef` types and conversions
2. Define `ActionSpec` objects with domain logic
3. Register prefix commands with `registerPrefixCommands()`
4. Create a workbench component that:
   - Selects visible actions for the current view
   - Uses `useActionController`-style hook for interaction dispatch
   - Passes `ClimSessionState`, context menu, and confirm action to `PbuiShell`
5. Define view models with `modeLabel` and `primaryPresentations`
