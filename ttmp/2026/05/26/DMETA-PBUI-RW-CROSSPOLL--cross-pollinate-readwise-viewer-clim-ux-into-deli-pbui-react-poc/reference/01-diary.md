---
Title: Diary
Ticket: DMETA-PBUI-RW-CROSSPOLL
Status: active
Topics:
    - pbui
    - clim
    - react
    - readwise
    - ux
    - proof-of-concept
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/actionEngine.ts
      Note: Extended with actionIntents()
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/commandParser.ts
      Note: Extended with prefix command registry (register/get/parse)
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiConfirmModal/PbuiConfirmModal.tsx
      Note: New confirm modal overlay for dangerous actions
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiContextMenu/PbuiContextMenu.tsx
      Note: New context menu component positioned at mouse event coordinates
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/components/PbuiHintBar/PbuiHintBar.tsx
      Note: New hint bar showing compatible actions for selected presentation
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/pbuiSessionSlice.ts
      Note: Refactored session slice with interaction discriminated union replacing scattered mode fields
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/generic/clim/types.ts
      Note: Core CLIM types with PbuiInteractionState discriminated union
    - Path: dmeta/proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/hooks/useDeliActionController.ts
      Note: Rewritten with discriminated interaction state
ExternalSources: []
Summary: Implementation diary for cross-pollinating Readwise Viewer CLIM UX features into Deli PBUI React PoC
LastUpdated: 2026-05-26T17:18:00-04:00
WhatFor: Track implementation progress, failures, and decisions for the CLIM UX cross-pollination work
WhenToUse: Read before resuming work on this ticket; add steps as work progresses
---









# Diary

## Goal

Record the implementation journey for cross-pollinating Readwise Viewer CLIM UX patterns into the Deli PBUI React PoC, making the PoC a stronger basis for a general-purpose CLIM React package.

## Step 1: Analysis and Design

Analyzed both codebases (Deli PBUI React PoC and Readwise Viewer CLIM) and identified 10 UX features to cross-pollinate. Created a 24KB design document covering all features, phases, and implementation approach.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the cross-pollination work from the previous session.

**Inferred user intent:** Complete the Readwise Viewer UX feature port into the Deli PBUI PoC.

### What I did
- Analyzed the Readwise Viewer CLIM codebase (store.ts, render.ts, actions.ts, commands.ts, styles.css, types.ts)
- Analyzed the existing Deli PBUI React PoC structure
- Created docmgr ticket DMETA-PBUI-RW-CROSSPOLL with 10 features, 5 phases, ~20 tasks
- Wrote 24KB cross-pollination analysis design doc
- Uploaded design doc to reMarkable

### Why
Need a structured plan to port UX interaction patterns from the battle-tested Readwise Viewer into the PoC without copying code.

### What worked
- The design doc gave a clear phased approach (Types → Action Engine → Components → Command Parser → Integration)
- Discriminated union pattern (PbuiInteractionState) emerged as the core architectural decision

### What didn't work
- N/A (analysis phase)

### What I learned
- The Readwise Viewer uses mutable DOM globals for state; React needs hooks/context/Redux
- The Readwise Viewer's "mode" system (normal/select/confirm) maps directly to a discriminated union

### What was tricky to build
- Identifying which patterns to port vs which to skip (pagination and build freshness check skipped)

### What warrants a second pair of eyes
- The decision to skip features 8 and 10 — reasonable for PoC but needs revisiting for production

### What should be done in the future
- Re-evaluate pagination and build freshness check for production CLIM

### Code review instructions
- Review design doc at `design-doc/01-clim-ux-cross-pollination-analysis-readwise-viewer-deli-pbui-react.md`
- Check ticket tasks at `tasks.md`

---

## Step 2: Phase 1 — Types and Session State Refactoring

Added ActionIntent, PbuiInteractionState discriminated union, ActionPresentation with intents/requiresConfirmation, ContextMenuState, PrefixCommandHelp, copyValue to PresentationRef. Refactored pbuiSessionSlice to use interaction discriminated union.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Implement Phase 1 types and session state refactoring.

**Inferred user intent:** Make impossible states unrepresentable through the type system.

**Commit (code):** 415d57c — "feat(clim): cross-pollinate Readwise Viewer UX into Deli PBUI React PoC"

### What I did
- Added `ActionIntent` union type: navigate | inspect | filter | mutate | dangerous | external | confirm | cancel
- Added `PbuiInteractionState` discriminated union: `normal | select | confirm` with typed action/filledArgs/request
- Extended `ActionPresentation` with `intents: ActionIntent[]` and `requiresConfirmation: boolean`
- Added `ContextMenuState` with position, ref, and actions
- Added `PrefixCommandHelp` interface in commandParser.ts
- Added `copyValue?: string` to `PresentationRef`
- Added `commandHint?: string` to `PbuiSessionState`
- Refactored `pbuiSessionSlice.ts`: replaced scattered `mode + pendingActionId + pendingRequest + filledArgs` with `interaction: PbuiInteractionState`
- Added session actions: `enterSelect`, `selectCompleted`, `selectCancelled`, `enterConfirm`, `confirmCompleted`, `confirmCancelled`, `showContextMenu`, `hideContextMenu`, `setCommandHint`

### Why
The old session state had scattered fields that could represent impossible states (e.g., mode='select' with no pending action). The discriminated union makes impossible states unrepresentable and makes the interaction flow explicit.

### What worked
- The discriminated union pattern eliminated an entire class of state bugs
- TypeScript narrowing on `interaction.kind` made the action controller cleaner

### What didn't work
- Initially forgot to reconcile `ClimSessionState` (shell-facing) with `PbuiSessionState` (slice-facing) — they serve different purposes. `ClimSessionState` remains as a "view model" that the workbench constructs from the interaction state.

### What I learned
- Keep shell-facing types (`ClimSessionState`) separate from store types — they serve different consumers
- The `ActionSpec<string>` vs `ActionSpec<DeliCommandId>` widening issue requires careful casting at the domain boundary

### What was tricky to build
- The `PbuiInteractionState<TAction extends string = string>` generic — defaults to `string` for the generic layer but needs `DeliCommandId` at the domain layer. Casts are needed when crossing the boundary.
- The `return { ... }` statement was accidentally deleted during an edit, causing a syntax error that took a second pass to find.

### What warrants a second pair of eyes
- The `as ActionSpec<DeliCommandId>` casts in DeliPbuiWorkbench.tsx — are they safe? They are because only DeliCommandId actions are registered, but the type system can't prove it.
- RTK serializable check warnings when putting `ActionSpec` (with `accepts` functions) into Redux state — acceptable for PoC but needs middleware fix for production.

### What should be done in the future
- Add RTK middleware config to suppress serializable check for `accepts` functions
- Consider making `PbuiInteractionState` generic on the store level so casts aren't needed

### Code review instructions
- Start at `src/generic/clim/types.ts` — review the new type definitions
- Check `src/generic/clim/pbuiSessionSlice.ts` — review the refactored actions/reducer
- Check `src/generic/clim/actionEngine.ts` — review `actionIntents()`, `compatibleActionPresentations()`

### Technical details

```typescript
// Key type: PbuiInteractionState discriminated union
export type PbuiInteractionState<TAction extends string = string> =
  | PbuiInteractionNormal        // { kind: 'normal' }
  | PbuiInteractionSelect<TAction>  // { kind: 'select', action, filledArgs }
  | PbuiInteractionConfirm<TAction>; // { kind: 'confirm', action, request, filledArgs }

// Key function: derive intents from action spec
export function actionIntents(action: ActionSpec): ActionIntent[] {
  const intents: ActionIntent[] = [];
  if (action.requiresConfirmation) intents.push('dangerous', 'confirm');
  if (action.views.length > 0) intents.push('navigate');
  // ... more rules
  return intents;
}
```

---

## Step 3: Phase 2-4 — Action Engine, Command Parser, and New Components

Implemented the action engine extension, command parser prefix commands, and created four new generic CLIM components (PbuiContextMenu, PbuiHintBar, PbuiConfirmModal, PbuiHelpView). Updated existing components.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Commit (code):** 415d57c — "feat(clim): cross-pollinate Readwise Viewer UX into Deli PBUI React PoC"

### What I did
- Extended `actionEngine.ts`: `actionIntents()`, `actionToPresentation()`, `compatibleActionPresentations()`
- Updated `actionPresentationsForSpecs()` to include `intents` and `requiresConfirmation`
- Extended `commandParser.ts`: `registerPrefixCommands()`, `getPrefixCommandHelp()`, new parse results (prefix, missing-argument)
- Updated `actionStatus.ts`: `formatInteractionStatus()` using discriminated union
- Created `PbuiContextMenu`: positioned context menu with actions, dismiss on click-away
- Created `PbuiHintBar`: shows compatible actions for the selected presentation
- Created `PbuiConfirmModal`: overlay modal for dangerous action confirmation
- Created `PbuiHelpView`: renders action list + prefix command reference
- Updated `PbuiCommandLine`: renders hint line below result line
- Updated `PbuiPresentationRef`: `dangerousTarget` styling, `onContextMenu`, `data-copy-value`
- Updated `PbuiShell`: renders context menu and confirm modal overlay
- Created domain: `prefixCommands.ts` with SEARCH/CATEGORY/DIET
- Added COPY action and copyValue to all deli presentations
- Wired `onContextMenu` through DeliMenuView and DeliDetailView
- Rewrote `useDeliActionController.ts` with discriminated interaction state
- Created `useDeliWorkbenchRouting.ts` with prefix command registration

### Why
These components implement the core UX patterns from the Readwise Viewer: context menu (right-click actions), hint bar (selection-aware action hints), confirm modal (dangerous action gate), and help view (command reference).

### What worked
- The `makeAp()` helper function in stories eliminated boilerplate for creating `ActionPresentation` objects
- Using `as Meta<typeof Component>` instead of `satisfies Meta<typeof Component>` in stories avoids the SB8 strict-args requirement for render-only stories
- The `dangerousTarget` flag on `PbuiPresentationRef` gives visual distinction (e.g., red border) when a dangerous action is in select mode

### What didn't work
- First attempt at fixing Storybook type errors used `sed` to replace `satisfies Meta<typeof ...>` with `as Meta`, but this broke the `const meta = { ... } satisfies Meta<typeof ...>` syntax — the `as Meta` needs to go after the closing brace, and the `typeof` part was lost
- The `PrefixCommandHelp` type was initially exported from `types.ts` but actually lives in `commandParser.ts` — caused import errors

### What I learned
- SB8 stories with `satisfies Meta<typeof Component>` require `args` on every story, even render-only ones. Using `as Meta<typeof Component>` is more forgiving.
- When using `sed` for code transforms, always verify the output — regex replacement across code files is fragile

### What was tricky to build
- The `PbuiContextMenu` needs to be positioned absolutely relative to the viewport — used `position: fixed` with the x/y from the mouse event
- The `PbuiConfirmModal` renders as a portal-like overlay within `PbuiShell` — needed to be outside the normal flow to cover the entire shell
- The `PrefixCommandHelp` type location — it belongs in `commandParser.ts` (where the registry lives), not in `types.ts` (which is for core CLIM types)

### What warrants a second pair of eyes
- The context menu dismiss behavior — should it dismiss on scroll? on any click outside?
- The confirm modal's keyboard handling (YES/ESC) — is it captured at the right level?

### What should be done in the future
- Add keyboard event handling for the confirm modal (Escape to cancel)
- Test right-click context menu interaction end-to-end
- Add Storybook interaction tests (play function) for select→confirm flow

### Code review instructions
- Check new components: `src/generic/clim/components/PbuiContextMenu/`, `PbuiHintBar/`, `PbuiConfirmModal/`, `PbuiHelpView/`
- Check updated: `src/generic/clim/components/PbuiCommandLine/`, `PbuiPresentationRef/`, `PbuiShell/`
- Check domain: `src/domain/deli/prefixCommands.ts`, updated `actions.ts`, `pbuiPresentations.ts`
- Check hooks: `src/widgets/DeliPbuiWorkbench/hooks/useDeliActionController.ts`, `useDeliWorkbenchRouting.ts`
- Verify TypeScript: `npx tsc --noEmit` (should be clean)

### Technical details

```typescript
// PbuiContextMenu: positioned at mouse event coordinates
<PbuiContextMenu
  visible={contextMenu.visible}
  x={contextMenu.x}
  y={contextMenu.y}
  ref={contextMenu.ref}
  actions={contextMenu.actions}
  onAction={handleContextMenuAction}
  onDismiss={() => dispatch(pbuiSessionActions.hideContextMenu())}
/>

// PbuiHintBar: shows compatible actions for current selection
<PbuiHintBar
  selectedRef={session.selectedRef}
  actions={compatibleActionPresentations(visibleActions, selectedRef, actionContext())}
  onAction={handleInvoke}
/>

// PbuiConfirmModal: overlay with confirm/cancel
<PbuiConfirmModal
  action={interaction.action}
  ref={session.selectedRef}
  onConfirm={confirmPending}
  onCancel={cancelPending}
/>
```

---

## Step 4: TypeScript Compilation Fixes and Storybook Stories

Fixed all TypeScript compilation errors after the Phase 1-4 changes and added comprehensive Storybook stories for all new and updated components.

### Prompt Context

**User prompt (verbatim):** "continue, you were struggling a bit, so we took a break. Don't forget to keep continuity in the diary format, and commit at appropriate intervals"

**Assistant interpretation:** Resume work, fix remaining TS errors, add stories, commit at intervals.

**Inferred user intent:** Get the codebase to a clean, compilable state with comprehensive stories before moving to the next phase.

**Commit (code):** 415d57c — "feat(clim): cross-pollinate Readwise Viewer UX into Deli PBUI React PoC"

### What I did
- Fixed `PrefixCommandHelp` import in `PbuiHelpView.tsx` (was importing from `types.ts`, now from `commandParser.ts`)
- Fixed `PbuiShell/types.ts`: replaced `ClimSessionState['pendingAction']` and `ClimSessionState['selected']` with direct `ActionSpec` and `PresentationRef` types
- Fixed `DeliPbuiWorkbench.tsx`: added `ActionSpec` import, cast `interaction.action` to `ActionSpec<DeliCommandId>` at domain boundary
- Fixed `useDeliActionController.ts`: restored accidentally deleted `return {` statement, cast `interaction.action` in `continueAction` and `runAction` calls
- Rewrote all story files with proper `as Meta<typeof Component>` pattern (8 files)
- Added `args` to stories that need them (SB8 strict mode requirement)
- Verified `npx tsc --noEmit` passes clean
- Committed all Phase 1-4 work as 415d57c

### Why
Multiple type issues accumulated from the refactoring — needed systematic cleanup before proceeding.

### What worked
- Running `npx tsc --noEmit` repeatedly and fixing errors category by category (story files first, then workbench types, then imports)
- Rewriting story files completely rather than patching them — cleaner and less error-prone

### What didn't work
- Using `sed` to replace `satisfies Meta<typeof ...>` with `as Meta` — it mangled the `const meta = { ... }` block syntax. The `as Meta` assertion goes on the *expression*, not inside the object literal.
- Earlier, I accidentally deleted a `return {` statement in `useDeliActionController.ts` by having overlapping edit targets — the `handleInvoke` closing brace and `handlePresentationClick` opening merged.

### What I learned
- When multiple edits target adjacent code, merge them into one edit to avoid overlap issues
- Always verify `tsc --noEmit` after each batch of edits — don't accumulate errors

### What was tricky to build
- The `ActionSpec<string>` vs `ActionSpec<DeliCommandId>` type widening — TypeScript correctly identifies that `interaction.action` (from `PbuiInteractionState<string>`) is wider than what `DeliDetailView` expects (`ActionSpec<DeliCommandId>`). The casts are safe because only DeliCommandId actions are registered, but the type system can't prove it.

### What warrants a second pair of eyes
- The `as ActionSpec<DeliCommandId>` casts — safe by construction but not type-safe
- The `PbuiShell` types now use `ActionSpec` (defaulting to `string`) — should it be generic?

### What should be done in the future
- Make `PbuiShellProps` generic on the action type to eliminate casts at the domain boundary
- Add RTK middleware to suppress serializable check warnings for function-valued `accepts` fields

### Code review instructions
- Run `npx tsc --noEmit` — should be clean
- Check story files: `PbuiAction/PbuiAction.stories.tsx`, `PbuiActionBar/PbuiActionBar.stories.tsx`, `PbuiCommandLine/PbuiCommandLine.stories.tsx`, `PbuiContextMenu/PbuiContextMenu.stories.tsx`, `PbuiConfirmModal/PbuiConfirmModal.stories.tsx`, `PbuiHelpView/PbuiHelpView.stories.tsx`, `PbuiHintBar/PbuiHintBar.stories.tsx`, `PbuiPresentationRef/PbuiPresentationRef.stories.tsx`
- Verify in browser: `http://localhost:5173` — menu view, detail select mode, cart confirm modal all work

### Technical details

Verified flows in browser:
1. Menu view → click item → hint bar shows compatible actions
2. Click CUSTOMIZE → detail view with ingredients
3. Click REMOVE-INGREDIENT → select mode (only removable ingredients clickable)
4. Click turkey → ingredient removed, back to normal mode
5. ADD-TO-ORDER → navigates to cart
6. PLACE-ORDER → confirm modal overlay with CONFIRM/CANCEL
7. CONFIRM → navigates to tracker

Storybook at http://localhost:6006 loads successfully with all new stories.
