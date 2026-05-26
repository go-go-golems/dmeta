---
Title: CLIM UX Cross-Pollination Analysis: Readwise Viewer → Deli PBUI React
Ticket: DMETA-PBUI-RW-CROSSPOLL
Status: active
Topics:
  - pbui
  - clim
  - react
  - readwise
  - ux
  - proof-of-concept
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
  - Path: /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/proof-of-concept/deli-pbui-react/src/generic/clim
    Note: Deli PBUI React generic CLIM layer — types, session slice, action engine, command parser, components
  - Path: /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/proof-of-concept/deli-pbui-react/src/domain/deli
    Note: Deli domain layer — actions, presentations, routing, view models, workbench slice
  - Path: /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench
    Note: Deli workbench widget composing generic + domain layers
  - Path: /home/manuel/workspaces/2026-05-19/dmeta-dsl/2026-05-21--readwise-viewer/pkg/web/clim
    Note: Readwise Viewer CLIM implementation — vanilla TS + Redux + Immer + DOM rendering
  - Path: /home/manuel/workspaces/2026-05-19/dmeta-dsl/2026-05-21--readwise-viewer/ttmp/2026/05/21/RWCLIM-001--readwise-viewer-clim-core-architecture-review/reference/01-diary.md
    Note: Readwise CLIM architecture review diary with detailed UX evolution notes
  - Path: /home/manuel/workspaces/2026-05-19/dmeta-dsl/2026-05-21--readwise-viewer/ttmp/2026/05/21/RWCAT-001--readwise-reader-document-categorization-with-sqlite/design-doc/02-readwise-clim-presentation-ui-design-and-implementation-guide.md
    Note: Original design guide specifying the Readwise CLIM interaction model
ExternalSources: []
Summary: Side-by-side analysis of the Deli PBUI React PoC and the Readwise Viewer CLIM implementation to identify UX features, interaction patterns, and architectural improvements that can be ported back into the PoC to make it a stronger basis for a general-purpose CLIM-inspired presentation-based UI package.
LastUpdated: 2026-05-26T12:00:00-04:00
WhatFor: Use this to understand which Readwise Viewer UX patterns are missing from the Deli PoC and how to port them; also read before implementing any of the listed improvements.
WhenToUse: Read before planning or implementing UX improvements to the Deli PBUI React PoC, or before designing the general-purpose CLIM React package.
---

# CLIM UX Cross-Pollination Analysis: Readwise Viewer → Deli PBUI React

## Executive Summary

The Deli PBUI React proof-of-concept (`dmeta/proof-of-concept/deli-pbui-react/`) and the Readwise Viewer CLIM UI (`2026-05-21--readwise-viewer/pkg/web/clim/`) share the same CLIM philosophy — every meaningful object on screen is a typed presentation, interaction flows through normal → select → confirm modes, and a command line drives the action registry. However, the Readwise Viewer has gone through a more intensive UX evolution (7 implementation steps documented in RWCLIM-001), resulting in several mature interaction patterns that the Deli PoC lacks.

This document maps the architectural alignment, identifies specific UX gaps in the Deli PoC, and proposes concrete features to port. The goal is to make the Deli PoC a stronger proof-of-concept that will serve as the basis for both a general-purpose CLIM React package and the concrete deli metadesign system.

## Problem Statement

The Deli PBUI React PoC was built primarily to "discover the right React target shape before converting the design back into DMETA templates and code generation." It achieves a clean generic/domain separation, but its UX is deliberately minimal:

- No right-click context menus
- No hint-line action presentations after selection
- No pagination support
- No search/filter prefix commands
- No `ActionPresentation` model (actions are rendered as separate `PbuiAction` buttons, not as presentations)
- No `InteractionState` discriminated union (session uses `mode` string + `pendingActionId` + `pendingRequest` + `filledArgs`)
- No `commandHint` line separate from `resultLine`
- No `copyValue` on presentation refs
- No `dangerousTarget` visual distinction (select-mode targets that require confirmation look the same as safe targets)
- No build freshness checks for generated assets

The Readwise Viewer, by contrast, has iterated through real UX pain (broken `SEARCH` command, missing ESC cancellation, inconsistent danger styling) and arrived at a more robust interaction model. Its patterns should flow back into the PoC.

## Architectural Alignment

### Shared core: both systems implement

| Concept | Deli PoC | Readwise Viewer |
|---|---|---|
| PresentationRef | `PresentationRef<TType>` with `type`, `id`, `label`, `capabilities`, `metadata` | `PresentationRef` with `semanticId`, `domainType`, `presentationType`, `label`, `capabilities`, `copyValue` |
| Action registry | `ActionSpec<TAction>` with `id`, `views`, `args`, `run()` | `ClimAction` with `id`, `argTypes`, `dangerous`, `noArg` |
| Command parser | `parseCommandLine()` — action, confirm, cancel, empty, unknown | `parseCommand()` — action, prefix, missing-argument, empty, unknown |
| Interaction modes | `InteractionMode = 'normal' \| 'select' \| 'confirm'` | `InteractionState = { kind: 'normal' } \| { kind: 'select', action } \| { kind: 'confirm', action, ref }` |
| Action engine | `actionAcceptsRef()`, `canFillRefArg()`, `nextOpenArg()`, `presentationVisualState()` | `actionAcceptsRef()`, `getCompatibleActions()`, `actionToPresentation()` |
| Command line | `PbuiCommandLine` React component with history, ESC | Global `keydown` listener with ESC, Enter, Backspace, printable chars |
| View routing | `RouteCodec<DeliViewId>` with push/replace/back + popstate | `setView()` Redux action — no URL routing, in-memory only |
| State management | Redux Toolkit (`pbuiSessionSlice` + `deliWorkbenchSlice`) | Redux + Immer (single `climReducer`) |

### Key architectural differences

| Dimension | Deli PoC | Readwise Viewer |
|---|---|---|
| Rendering | React components (`PbuiPresentationRef`, `PbuiActionBar`, `PbuiShell`) | String HTML injected via `innerHTML` + delegated events |
| Type safety | Full TypeScript generics (`PresentationRef<TType>`, `ActionSpec<TAction>`) | TypeScript but fewer generics, `any`/casts in store |
| Action arg model | Rich: `RefActionArgSpec` + `ValueActionArgSpec` with `kind`, `accepts()` | Flat: `argTypes: string[]` only, no value args, no `accepts()` |
| Confirmed actions | `ActionSpec.requiresConfirmation` + `confirmation` object with prompt/labels | `ClimAction.dangerous` flag → confirm modal |
| Session slice | `PbuiSessionState` with `mode`, `pendingActionId`, `pendingRequest`, `filledArgs`, `commandBuffer`, `commandHistory`, `historyCursor`, `resultLine` | `ClimState.ui` with `interaction` (discriminated union), `selected`, `commandBuffer`, `commandHistory`, `actionResult`, `commandHint`, `contextMenu` |
| API layer | RTK Query fixture (`useGetMenuQuery`) | Real Go API over SQLite (`api.*` fetch wrappers) |
| Pagination | None | `page.offset`, `page.limit`, `page.total`, NEXT/PREV |
| Filters | None | `DocumentFilters` with location, category, source, tag, untagged, q |
| Context menu | None | Full right-click menu with compatible actions |
| Confirm modal | Inline `PbuiConfirmPrompt` component | Overlay modal rendered by `renderConfirmModal()` |
| Build freshness | None | `make check-web` target |

## UX Features to Port

### 1. Right-click Context Menu

**Status in Readwise Viewer**: Fully implemented. Right-click on any `.pres` element opens a positioned context menu showing the presentation's type/label header and a list of compatible `ClimAction` entries. Dangerous actions are visually marked with `⚠` and red coloring. Clicking outside the menu closes it. Clicking a menu item dispatches the action.

**Current Deli PoC state**: No context menu at all. Users must use the action bar buttons or type commands.

**Why port it**: Context menus are the fastest expert interaction for CLIM-style UIs. They let a user select an object and immediately choose an action without moving to a separate action bar. This is especially important when the action bar is at the bottom of a scrollable view.

**Port plan**:
- Add `PbuiContextMenu` generic component to `src/generic/clim/components/`
- Add context menu state to `PbuiSessionState` (or a new `PbuiContextMenuSlice`)
- Use `onContextMenu` on `PbuiPresentationRef` to dispatch `showContextMenu(ref, x, y, actions)`
- Render compatible actions for the right-clicked presentation using the existing `actionEngine.actionsForRef()`
- Handle click-outside dismissal
- Style dangerous items with `text-clim-danger`

### 2. Action Presentations (Actions as Presentations)

**Status in Readwise Viewer**: Fully implemented via `ActionPresentation extends PresentationRef`. After selecting a `ReaderDocument`, compatible actions appear as clickable `.pres.hint-action` elements in the command hint line. Clicking an action presentation applies it to the selected target. Action presentations carry `ActionIntent` (navigate, inspect, filter, external, mutate, dangerous, confirm, cancel) and `requiresConfirmation`.

**Current Deli PoC state**: Actions are rendered as `PbuiAction` buttons in `PbuiActionBar`. They are not typed presentations — they don't carry `data-presentation-type`, they don't participate in the presentation selection model, and they have no concept of intents.

**Why port it**: Making actions into presentations is the single most impactful architectural improvement. It unifies the interaction model: context menu items, hint-line actions, and action-bar buttons all become the same thing. It enables data-driven danger styling, intent-based coloring, and capability-based filtering without special-case code per action surface.

**Port plan**:
- Add `ActionIntent` and `ActionPresentation<TAction>` types to `src/generic/clim/types.ts`
- Add `actionToPresentation()` builder in `actionEngine.ts`
- Update `PbuiActionBar` to render `ActionPresentation` objects
- Add a `PbuiHintBar` component that shows compatible action presentations after selection
- Update `PbuiPresentationRef` click handling to detect `type: 'Action'` presentations and dispatch accordingly

### 3. Discriminated Interaction State Union

**Status in Readwise Viewer**: Fully implemented. `InteractionState = { kind: 'normal' } | { kind: 'select'; action: ClimAction } | { kind: 'confirm'; action: ClimAction; ref: PresentationRef }`. Impossible states like "confirm mode without a pending ref" are unrepresentable.

**Current Deli PoC state**: `PbuiSessionState` uses `mode: InteractionMode` (string union `'normal' | 'select' | 'confirm'`) plus `pendingActionId?: string`, `pendingRequest?: ActionRequest`, `filledArgs: Record<string, unknown>`. These fields can drift: for example, `mode: 'confirm'` with `pendingActionId: undefined` is representable but meaningless.

**Why port it**: Discriminated unions make invalid states unrepresentable, eliminate a class of bugs where reducer logic forgets to clear one of the scattered pending fields, and make TypeScript narrowing natural at every call site.

**Port plan**:
- Define `PbuiInteractionState` as a discriminated union in `types.ts`
- Refactor `pbuiSessionSlice.ts` to use `interaction: PbuiInteractionState` instead of `mode + pendingActionId + pendingRequest + filledArgs`
- Update all consumers (workbench hooks, component props) to narrow on `interaction.kind`

### 4. Command Hint Line (Separate from Result Line)

**Status in Readwise Viewer**: `ClimState.ui` has both `actionResult: string` (what happened) and `commandHint: string` (what to do next). After selecting a document, the hint shows "Selected <ReaderDocument> X. INSPECT CLASSIFY ARCHIVE-DOCUMENT. Right-click for menu." After entering select mode, it shows "INSPECT: click a red compatible presentation. ESC cancels."

**Current Deli PoC state**: Only `resultLine`. There is no separate hint. The result line shows both action results ("Selected Classic BLTA") and mode guidance ("Type a command such as CUSTOMIZE, CART, HELP"). This means actionable guidance and status messages compete for the same visual slot.

**Why port it**: A dedicated hint line provides continuous contextual guidance. It tells the user what actions are available, what mode they're in, and how to cancel — all without overwriting the last action result. This is a core CLIM UX principle inherited from the Lisp Machines.

**Port plan**:
- Add `commandHint?: string` to `PbuiSessionState`
- Add `PbuiHintLine` component or extend `PbuiCommandLine` to render it below the command input
- Update action dispatch and mode transitions to set appropriate hints
- Keep `resultLine` for action outcomes only

### 5. Presentation `copyValue` and Copy-on-Select

**Status in Readwise Viewer**: Every `PresentationRef` has an optional `copyValue` field. For `ReaderDocument`, this is the Reader URL. The DOM stores it as `data-copy-value`. This enables future COPY-URL actions and clipboard integration.

**Current Deli PoC state**: No `copyValue`. Presentations have `metadata?: Record<string, unknown>` but no standardized copyable value.

**Why port it**: In data-heavy CLIM UIs, the most common expert action after selecting an object is copying its reference (URL, ID, path). Making `copyValue` a first-class field on `PresentationRef` enables COPY-URL, COPY-ID, and clipboard actions without domain-specific special casing.

**Port plan**:
- Add `copyValue?: string` to `PresentationRef` in `types.ts`
- Add `data-copy-value` attribute to `PbuiPresentationRef` DOM elements
- Add a generic `COPY` action to the action registry that reads `selectedRef.copyValue`

### 6. Danger-aware Target Styling

**Status in Readwise Viewer**: Select-mode targets that match a dangerous action (like `ARCHIVE-DOCUMENT`) are styled differently: they get the `selectable` class (red color) plus visual context that the pending action is dangerous. The confirmation modal explicitly shows `<ACTION_ID> <TYPE> label` with red styling.

**Current Deli PoC state**: `presentationVisualState()` computes `dangerousTarget: true` when `selectable && selectedAction.requiresConfirmation`, but no CSS styling distinguishes dangerous targets from safe targets. The `PbuiPresentationRef` component doesn't use `dangerousTarget` at all.

**Why port it**: In the deli domain, `REMOVE-INGREDIENT` is not destructive (it can be undone by re-adding), but `PLACE-ORDER` is. As the PoC grows more actions, the user needs to see at a glance which click will trigger a confirmation. Red-on-red (dangerous target during dangerous action selection) vs plain-red (safe target during action selection) is the CLIM convention.

**Port plan**:
- Add `dangerousTarget` styling to `PbuiPresentationRef`: when `state.dangerousTarget` is true, render with `text-clim-danger` or a `ring-clim-danger` outline
- Add a CSS class `pres-danger-target` analogous to the Readwise Viewer's approach
- Update `DeliMenuView` and `DeliDetailView` to pass `dangerousTarget` through to presentations

### 7. Prefix Commands and Filter/Search

**Status in Readwise Viewer**: `SEARCH <query>`, `SOURCE <name>`, `TAG <key>`, `LOCATION <loc>` are prefix commands parsed before action lookup. They immediately filter the document list and navigate to the documents view. The parser returns `missing-argument` if the user types bare `SEARCH` without a query.

**Current Deli PoC state**: `FILTER-DIETARY` and `FILTER-BY-CATEGORY` are defined as actions with value args, but they require entering select mode and then providing a text input — there's no direct `FILTER-DIETARY vegetarian` prefix command. The command parser doesn't understand prefix commands at all.

**Why port it**: Filter/search prefix commands are the primary expert interaction in data-heavy CLIM UIs. Typing `SEARCH salmon` and immediately seeing results is far faster than `FILTER-DIETARY → select input → type → submit`. The prefix command pattern is general-purpose and should be in the generic layer.

**Port plan**:
- Extend `parseCommandLine()` to support prefix commands: a registry of `{ id, args, description, example }` that the parser checks before action lookup
- Add `CommandParseResult` kind: `{ kind: 'prefix'; command: PrefixCommand; value: string }` and `{ kind: 'missing-argument'; command: PrefixCommand; example: string }`
- Define deli prefix commands: `SEARCH <query>`, `CATEGORY <name>`, `DIET <tag>`
- Wire prefix command results to domain dispatch in `useDeliActionController`

### 8. Pagination

**Status in Readwise Viewer**: `ViewState.page` carries `offset`, `limit`, `total`. The documents view renders `Page N of M` with clickable ← PREV and NEXT →. `loadNextPage()` and `loadPrevPage()` update the offset and re-fetch.

**Current Deli PoC state**: No pagination. The fixture menu is small (a handful of items), so pagination isn't needed for the deli domain. But the generic CLIM layer should support it.

**Why port it**: The general-purpose CLIM React package will need pagination for any data-heavy view. Even in the deli PoC, a large menu could benefit from scrolling pagination.

**Port plan**:
- Add `PbuiPageMeta` type (`offset`, `limit`, `total`) to generic types
- Add `NEXT-PAGE` and `PREV-PAGE` actions to the generic action registry
- Add `PbuiPagination` component
- Wire into the deli domain if the fixture data grows

### 9. Generated HELP from Registries

**Status in Readwise Viewer**: The help view is fully generated from `CLIM_ACTIONS` and `PREFIX_COMMAND_HELP`. It shows action IDs, arg types, descriptions, and dangerous markers. It also shows prefix command help with examples.

**Current Deli PoC state**: `DeliHelpView` renders a static table of all `deliActions`. It doesn't show prefix commands (none exist), doesn't mark dangerous actions, and doesn't derive from the command parser. The generic layer has no `PbuiHelpView`.

**Why port it**: Generated help guarantees that the help view never drifts from the action/command registry. This was a concrete bug in the Readwise Viewer (SEARCH was documented but broken), and the generated-help fix eliminated an entire class of help drift bugs.

**Port plan**:
- Add a generic `PbuiHelpView` component that accepts an action registry and a prefix-command registry
- Make `DeliHelpView` use the generic component instead of hand-coding the table
- Show dangerous markers and prefix command examples

### 10. Build Freshness Check

**Status in Readwise Viewer**: `make check-web` runs Bun tests, TypeScript type-check, frontend bundle build, and then verifies no diff on the embedded `app.js`. This prevents the Go server from serving stale UI.

**Current Deli PoC state**: No freshness check. The Vite dev server handles hot reload during development, but there's no CI-equivalent check for build consistency.

**Why port it**: As the PoC grows (and especially if it gets embedded in a Go binary like the Readwise Viewer), a freshness check prevents debug-difficult stale-asset issues.

**Port plan**:
- Add a `check` npm script that runs `tsc --noEmit`, `npm run build`, and optionally checks for uncommitted build output
- Integrate with any future Go embedding

## Alignment Assessment: What Already Aligns Well

The two codebases share a remarkably consistent mental model despite different technology stacks (React vs vanilla TS/Redux+Immer). The alignment is strongest in:

1. **PresentationRef as the central semantic unit** — both define typed, id'd, capability-tagged wrappers. The Deli PoC is slightly more generic with `PresentationRef<TType>`, while the Readwise Viewer uses `semanticId` + `domainType` + `presentationType`. A merged type should have both the Deli's generic `type` parameter and the Readwise's `copyValue`.

2. **Action registry as the command dispatch spine** — both have a centralized registry of actions that drive the command line, action bar, context menu, and help. The Deli PoC's `ActionSpec.run()` with runtime context is more flexible than the Readwise Viewer's switch-case `executeNoArgAction()`/`performArgAction()`.

3. **Normal → Select → Confirm interaction flow** — both implement the same three modes. The Readwise Viewer's discriminated union is strictly better and should be ported.

4. **Command parser separation** — both separate command parsing from action execution. The Deli PoC's parser handles confirm/cancel words; the Readwise Viewer's parser handles prefix commands. A merged parser should handle both.

5. **Clean generic/domain separation** — the Deli PoC's `src/generic/clim/` vs `src/domain/deli/` split is clean and intentional. The Readwise Viewer doesn't have this separation because it's a single-purpose app. The PoC's separation should be preserved and strengthened.

## Alignment Assessment: Where They Diverge

The critical divergence is in rendering architecture:

- **Deli PoC**: React components with JSX, props, hooks, and Tailwind classes. `PbuiPresentationRef` is a React component that receives presentation state as props. The action bar is a React component list.
- **Readwise Viewer**: String HTML rendered via `innerHTML`, with delegated DOM event handling. Presentations are `<span class="pres" data-type="..." data-id="...">` with attribute-based metadata.

This divergence is expected and correct. The Deli PoC's React component approach is the right long-term direction for a reusable package. The Readwise Viewer's string-HTML approach was a pragmatic choice for a Go-embedded, single-purpose app. When porting UX features, we should:

1. **Preserve the React component model** in the Deli PoC.
2. **Port UX interaction patterns**, not rendering code.
3. **Use React idioms** (hooks, context, portals) where the Readwise Viewer uses DOM globals.

## Proposed Implementation Order

The features above are ordered by impact and dependency:

1. **Discriminated Interaction State Union** (foundational — other features depend on it)
2. **Command Hint Line** (small, high UX impact, no dependencies)
3. **Action Presentations** (core architectural improvement)
4. **Right-click Context Menu** (depends on Action Presentations for action list)
5. **Danger-aware Target Styling** (depends on Action Presentations for intent data)
6. **Presentation copyValue** (small, independent)
7. **Prefix Commands and Filter/Search** (extends command parser)
8. **Generated HELP from Registries** (depends on prefix commands for complete help)
9. **Pagination** (independent, lower priority for deli domain)
10. **Build Freshness Check** (independent, lowest priority)

## What I Understand the User Is Asking

The user wants to:

1. **Analyze both codebases** — understand what the Deli PBUI React PoC has, what the Readwise Viewer CLIM implementation has, and where they align and diverge.

2. **Identify UX porting opportunities** — specifically UX features that the Readwise Viewer has evolved through real use (context menus, action presentations, hint lines, danger styling, prefix commands, pagination) that would make the Deli PoC a more complete and convincing proof of concept.

3. **Keep the PoC's dual purpose in mind** — the PoC serves as both (a) the basis for a general-purpose CLIM-inspired presentation-based UI package (the generic layer), and (b) the concrete deli-related parts that refine the structured metadesign system (the domain layer). Ported features should strengthen both purposes.

4. **Work within this workspace** — no going outside the `dmeta-dsl` workspace for reference.

5. **Create a docmgr ticket** — to track the analysis and resulting work.

In my own words: The user wants me to look at the battle-tested Readwise Viewer CLIM UI — which has gone through real UX iteration and bug fixes — and systematically identify which interaction patterns, UX features, and architectural improvements should flow back into the Deli PBUI React proof of concept. The goal isn't to copy code (the rendering stacks are different), but to identify conceptual gaps: what interaction patterns does the Readwise Viewer have that the Deli PoC lacks, and how should those patterns be implemented in React idiom within the PoC's clean generic/domain separation? The PoC needs to be strong enough to serve as the foundation for both a general-purpose CLIM React package and the deli metadesign system, and the Readwise Viewer's UX evolution is the fastest path to closing that gap.
