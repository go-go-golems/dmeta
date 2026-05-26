# @go-go-golems/pbui

Presentation-Based User Interface (PBUI) / Command Line Interface Model (CLIM) framework for React. Domain-agnostic shell, action engine, command parser, and interaction components.

## Installation

```bash
pnpm add @go-go-golems/pbui
```

### Peer dependencies

```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "react": "^18 || ^19",
  "react-dom": "^18 || ^19",
  "react-redux": "^9.0.0"
}
```

## Tailwind CSS setup

This package uses Tailwind CSS class names in its components. If you use Tailwind v4, you **must** add a `@source` directive so Tailwind scans the package source for class names:

```css
/* In your app's main CSS file (e.g. src/index.css) */
@import "tailwindcss";

/* Scan the package source for Tailwind class names */
@source "../node_modules/@go-go-golems/pbui/src";
```

> **Important:** Without the `@source` directive, Tailwind v4 will not generate CSS for the utility classes used by the package components, and spacing/layout will break.
>
> The path is **relative to the CSS file**, not the project root. Adjust the number of `../` to match your directory structure.

If you use Tailwind v3, add the package path to `content` in `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@go-go-golems/pbui/src/**/*.{ts,tsx}',
  ],
};
```

### CSS theme tokens

The package ships CSS custom properties under `src/theme/clim-tokens.css`. Import them if you don't use Tailwind:

```css
@import "@go-go-golems/pbui/theme/clim-tokens.css";
```

Or in JS:

```ts
import '@go-go-golems/pbui/theme';
```

Wrap your app in `<div data-widget="clim">` to activate the scoped tokens.

If you use Tailwind, register the color tokens in your `@theme` directive:

```css
@theme {
  --color-clim-bg: #050505;
  --color-clim-panel: #101010;
  --color-clim-border: #303030;
  --color-clim-fg: #d8d8d8;
  --color-clim-muted: #777777;
  --color-clim-bright: #ffffff;
  --color-clim-danger: #ff4d4d;
}
```

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

## Core Types

| Type | Purpose |
|------|---------|
| `PresentationRef` | A reference to a domain object (type, id, label, capabilities, copyValue) |
| `ActionSpec` | An action definition (id, label, description, views, args, run) |
| `ActionPresentation` | An action enriched for rendering (intents, requiresConfirmation, disabledReason) |
| `ActionIntent` | Semantic intent: navigate, inspect, filter, mutate, dangerous, external, confirm, cancel |
| `PbuiInteractionState` | Discriminated union: `normal | select | confirm` |
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

## Action Engine

```typescript
import {
  actionIntents,
  actionToPresentation,
  compatibleActionPresentations,
  actionPresentationsForSpecs,
  presentationVisualState,
} from '@go-go-golems/pbui';

// Derive intents from an action spec
actionIntents(action: ActionSpec): ActionIntent[]

// Convert action spec to presentation (with intents, confirmation flag)
actionToPresentation(action: ActionSpec): ActionPresentation

// Filter actions compatible with a selected presentation
compatibleActionPresentations(actions, ref, context): ActionPresentation[]

// Build presentations for a set of action specs, filtering by view
actionPresentationsForSpecs({ actions, view?, ref?, context? }): ActionPresentation[]

// Get visual state for a presentation given the current interaction
presentationVisualState({ ref, selectedRef, interaction, actionPresentations }): VisualState
```

## Command Parser

Supports three command types:

1. **Action commands**: `CUSTOMIZE`, `PLACE-ORDER`, `HELP`
2. **Prefix commands**: `SEARCH <query>`, `CATEGORY <name>`, `DIET <tag>`
3. **Meta commands**: `ESC` (cancel), `YES` (confirm), `LIST` (list views)

Prefix commands are registered globally via `registerPrefixCommands()`.

```typescript
import { registerPrefixCommands, getPrefixCommandHelp, parseCommandLine } from '@go-go-golems/pbui';
```

## Session State (RTK)

```typescript
import { pbuiSessionActions, pbuiSessionReducer } from '@go-go-golems/pbui';
import type { PbuiSessionState } from '@go-go-golems/pbui';
```

RTK slice managing:

- `interaction`: the current interaction state (normal/select/confirm)
- `commandBuffer`: current command input text
- `resultLine`: last result message
- `commandHint`: contextual hint below the result line
- `commandHistory`: command history for Up/Down navigation
- `selectedRef`: currently selected presentation
- `contextMenu`: context menu state (visible, position, ref, actions)

## Domain Integration

To use this package for a new domain:

1. Define domain `PresentationRef` types and conversions
2. Define `ActionSpec` objects with domain logic
3. Register prefix commands with `registerPrefixCommands()`
4. Create a workbench component that:
   - Selects visible actions for the current view
   - Uses `useActionController`-style hook for interaction dispatch
   - Passes `ClimSessionState`, context menu, and confirm action to `PbuiShell`
5. Define view models with `modeLabel` and `primaryPresentations`
6. Add `@source` directives to your CSS for Tailwind v4

## Sub-path imports

| Path | Contents |
|------|----------|
| `@go-go-golems/pbui` | Full public API |
| `@go-go-golems/pbui/types` | Core types only |
| `@go-go-golems/pbui/action-engine` | Action engine functions |
| `@go-go-golems/pbui/command-parser` | Command parser |
| `@go-go-golems/pbui/session-slice` | RTK session slice |
| `@go-go-golems/pbui/routing` | Route codec and helpers |
| `@go-go-golems/pbui/theme` | CSS token imports |
| `@go-go-golems/pbui/theme/clim-tokens.css` | CSS custom properties |
