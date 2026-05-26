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
    - Path: ../../../../../../../../../../code/wesen/go-go-golems/go-go-os-frontend/.github/workflows/publish-npm.yml
      Note: go-go-os-frontend npm publish workflow now reads NODE_AUTH_TOKEN from Vault via GitHub Actions OIDC
    - Path: .github/workflows/publish-pbui.yml
      Note: PBUI npm publish workflow now reads NODE_AUTH_TOKEN from Vault via GitHub Actions OIDC
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
    - Path: proof-of-concept/deli-pbui-react/src/domain/deli/deliWorkbenchSlice.ts
      Note: Added searchFilter/dietFilter/categoryFilter state and actions
    - Path: proof-of-concept/deli-pbui-react/src/widgets/DeliPbuiWorkbench/hooks/useDeliActionController.ts
      Note: Rewritten with discriminated interaction state
ExternalSources: []
Summary: Implementation diary for cross-pollinating Readwise Viewer CLIM UX features into Deli PBUI React PoC
LastUpdated: 2026-05-26T19:50:00-04:00
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

---

## Step 5: Polish — Keyboard Handling, RTK Warnings, Storybook Cleanup

Added Escape key handling to confirm modal and context menu, suppressed RTK serializable check warnings, and cleaned up all Storybook story type patterns.

### Prompt Context

**User prompt (verbatim):** "continue, you were struggling a bit, so we took a break. Don't forget to keep continuity in the diary format, and commit at appropriate intervals"

**Assistant interpretation:** Resume work, fix remaining issues, add polish.

**Inferred user intent:** Get the codebase to a clean, production-quality state with no console warnings and proper keyboard support.

**Commit (code):** 41f53d3 — "feat(stories): comprehensive Storybook stories for all CLIM components"
**Commit (code):** 8f27090 — "fix(clim): keyboard handling and RTK serializable check suppression"

### What I did
- Added `useEffect` keyboard handler to `PbuiConfirmModal` — Escape key calls `onCancel`
- Added `useEffect` keyboard handler to `PbuiContextMenu` — Escape key calls `onDismiss`
- Configured RTK `serializableCheck` in `store.ts` to ignore `pbuiSession.interaction.action.args` and the `enterSelect`/`enterConfirm` actions (which carry `ActionSpec` objects with `accepts` functions)
- Fixed all remaining `satisfies Meta<typeof ...>` patterns across 9 story files → `as Meta` to avoid SB8 strict-args errors
- Enriched domain stories: DeliMenuView (3 variants), DeliDetailView (2 new), DeliCartView (multiple items), DeliHelpView (prefix commands)
- Added comprehensive PbuiShell stories: normal, select, confirm, with-context-menu modes
- Marked all 20 tasks complete in DMETA-PBUI-RW-CROSSPOLL

### Why
Keyboard accessibility is essential for a CLIM interface — users expect to dismiss modals and menus with Escape. The RTK serializable warnings were noise obscuring real issues.

### What worked
- The `useEffect` pattern for Escape key is clean and self-contained
- The RTK `ignoredPaths`/`ignoredActions` config precisely targets only the problematic paths
- Converting all stories to `as Meta` eliminated the entire class of SB8 strict-args type errors

### What didn't work
- The `sed` approach for fixing `satisfies Meta` → `as Meta` was too aggressive initially; manual file rewrites were needed for the new component stories

### What I learned
- Storybook 8 with `satisfies Meta<typeof Component>` enforces `args` on every story, even render-only ones. Using `as Meta` or `as Meta<typeof Component>` is more practical.
- The iframe URL (`/iframe.html?path=/story/...`) gives clean component-only views for screenshots, without Storybook chrome.

### What was tricky to build
- The RTK `serializableCheck.ignoredPaths` needs to match the exact state path where functions live. `pbuiSession.interaction.action.args` covers the `accepts` functions in the interaction state.

### What warrants a second pair of eyes
- The `ignoredPaths` and `ignoredActions` in the RTK middleware config — are they broad enough? Too broad?

### What should be done in the future
- Add Enter key support in the confirm modal (Enter = confirm)
- Add arrow key navigation in the context menu (keyboard-accessible menu items)
- Consider making the `PbuiCommandLine` auto-focus when entering select/confirm mode

### Code review instructions
- Check `src/app/store.ts` — RTK middleware config
- Check `PbuiConfirmModal.tsx` and `PbuiContextMenu.tsx` — keyboard handlers
- Verify in browser: Escape dismisses both modals

### Technical details

```typescript
// RTK serializable check suppression
middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  serializableCheck: {
    ignoredPaths: ['pbuiSession.interaction.action.args'],
    ignoredActions: ['pbuiSession/enterSelect', 'pbuiSession/enterConfirm'],
  },
}).concat(deliApi.middleware),

// Confirm modal Escape handler
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
  }
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onCancel]);
```

---

## Step 6: Wire Prefix Commands with Live Filtering

Connected the SEARCH, CATEGORY, and DIET prefix commands to actual domain filtering. Added filter state to the workbench and wired the controller to dispatch filter actions.

### Prompt Context

**User prompt (verbatim):** (same as Step 5)

**Assistant interpretation:** Continue polishing, wire prefix commands.

**Inferred user intent:** Make the prefix commands actually do something useful — not just parse but dispatch.

**Commit (code):** 2dd7b9a — "feat(deli): wire SEARCH/CATEGORY/DIET prefix commands with live filtering"

### What I did
- Added `searchFilter`, `dietFilter`, `categoryFilter` to `DeliWorkbenchState`
- Added `setSearchFilter`, `setDietFilter`, `setCategoryFilter` actions to `deliWorkbenchSlice`
- Updated `DeliPbuiWorkbench` to compute `filteredMenu` from all active filters
- `DeliMenuView` now renders `filteredMenu` instead of the full `menu`
- Updated `useDeliActionController` to dispatch filter actions on prefix commands:
  - `SEARCH <query>` → filters menu by name, tags, or category (case-insensitive)
  - `CATEGORY <name>` → filters menu by category
  - `DIET <tag>` → filters menu by dietary tags
  - Prefix command without argument (e.g., just `SEARCH`) → clears the corresponding filter
- Fixed RTK serializableCheck to also ignore `pbuiSession.contextMenu.actions` and `showContextMenu` action
- Verified all flows in browser: SEARCH, CATEGORY, clear filter, context menu, confirm modal

### Why
Prefix commands were recognized but not dispatched in the previous step — they were stubs. This makes them functional and demonstrates the full CLIM command → domain dispatch pipeline.

### What worked
- The `filteredMenu` approach is clean — the full `menu` is still available for `selectedItem` lookups, and the view renders the filtered subset
- Using prefix command without argument as "clear filter" is a natural UX convention

### What didn't work
- Initially used `item.dietary` which doesn't exist on `MenuItem` — had to switch to `item.tags`
- Accidentally deleted `const interaction = session.interaction;` when inserting the `filteredMenu` computation — had to add it back
- Duplicate import of `deliWorkbenchActions` was introduced — caught by tsc

### What I learned
- The CLIM command → domain dispatch pipeline is clean: command parser identifies kind → controller dispatches domain action → domain slice updates state → view re-renders
- Composable filters (SEARCH + CATEGORY + DIET can all be active simultaneously) are powerful but need clear UX for understanding what's active

### What was tricky to build
- The interaction between multiple filters — if SEARCH and CATEGORY are both active, both apply (AND logic). This means `SEARCH market` + `CATEGORY sandwich` = empty results. The user needs to clear one before applying the other.

### What warrants a second pair of eyes
- The filter composition logic (AND between all active filters) — should it be OR? Should we show which filters are active in the UI?
- The `selectedItem` still looks up from the full `menu`, not `filteredMenu` — this is intentional (selected item persists even if filtered out) but could be confusing

### What should be done in the future
- Show active filter indicators in the view header or command line
- Add a "CLEAR ALL FILTERS" command or make ESC clear filters when no interaction is pending
- Consider making the hint bar show the active filters

### Code review instructions
- Check `src/domain/deli/deliWorkbenchSlice.ts` — new filter state and actions
- Check `src/widgets/DeliPbuiWorkbench/DeliPbuiWorkbench.tsx` — `filteredMenu` computation
- Check `src/widgets/DeliPbuiWorkbench/hooks/useDeliActionController.ts` — prefix command dispatch
- Verify in browser: type `SEARCH hudson` → only Hudson Classic shows; type `SEARCH` → filter cleared

### Technical details

```typescript
// Filter computation in DeliPbuiWorkbench
const filteredMenu = menu.filter((item) => {
  if (searchFilter) {
    const q = searchFilter.toLowerCase();
    const matches = item.name.toLowerCase().includes(q)
      || item.tags.some((t) => t.toLowerCase().includes(q))
      || item.category.toLowerCase().includes(q);
    if (!matches) return false;
  }
  if (dietFilter) {
    const d = dietFilter.toLowerCase();
    const matches = item.tags.some((t) => t.toLowerCase().includes(d));
    if (!matches) return false;
  }
  if (categoryFilter) {
    const c = categoryFilter.toLowerCase();
    const matches = item.category.toLowerCase().includes(c);
    if (!matches) return false;
  }
  return true;
});

// Prefix command dispatch in useDeliActionController
if (parsed.kind === 'prefix') {
  if (cmd === 'SEARCH') {
    dispatch(deliWorkbenchActions.setSearchFilter(val));
    navigateToView('menu');
  }
}
```

---

## Step 7: Keyboard Accessibility, Filter Indicators, and Interaction Tests

Added Enter key for confirm modal, arrow key navigation for context menu, auto-focus command line in interaction modes, active filter badges, and Storybook interaction tests.

### Prompt Context

**User prompt (verbatim):** "yes, continue."

**Assistant interpretation:** Continue with next improvement items from the diary.

**Inferred user intent:** Polish the PoC with accessibility improvements, visual feedback for filters, and test coverage.

**Commit (code):** 9e0e12d — "feat(clim): keyboard accessibility and filter indicators"

### What I did
- Added Enter key support in `PbuiConfirmModal` — Enter confirms, Escape cancels
- Added arrow key navigation in `PbuiContextMenu` — Up/Down to move focus, Enter to select, Escape to dismiss
- Added `autoFocus` prop to `PbuiCommandLine` — shell passes `autoFocus={state.mode !== 'normal'}`
- Added `useRef` + `useEffect` to auto-focus the command input when entering select/confirm mode
- Added `activeFilters` prop to `DeliViewHeader` — renders red-bordered filter badges (e.g. "SEARCH: classic")
- Computed `activeFilters` array in `DeliPbuiWorkbench` from `searchFilter`, `categoryFilter`, `dietFilter`
- Updated confirm modal hint text: "Enter to confirm · Escape to cancel · or type YES / ESC"
- Added Storybook interaction tests (play functions) for:
  - `PbuiConfirmModal`: click CONFIRM button, click CANCEL button
  - `PbuiContextMenu`: click action, click-away dismiss
- Added `AutoFocusSelect` story for `PbuiCommandLine`

### Why
A CLIM interface is keyboard-first — every interaction must be achievable without a mouse. The confirm modal, context menu, and command line are the three main keyboard interaction surfaces.

### What worked
- The `useRef` + `useEffect` pattern for auto-focus is clean and React-idiomatic
- The `focusedIndex` state in context menu enables arrow key navigation with visual focus via `focus:bg-clim-highlight`
- Filter badges use the `border-clim-danger text-clim-danger` style — consistent with the danger intent

### What didn't work
- Accidentally deleted `const interaction = session.interaction;` *again* when inserting the `activeFilters` computation — this is now the third time! Need to be more careful when inserting code before a declaration.

### What I learned
- When inserting code before a `const` declaration, always include the declaration in the new text to avoid accidentally removing it
- Storybook `fn()` from `storybook/test` replaces manual `() => {}` for interaction test assertions
- The `within(canvasElement)` + `findByRole` pattern works well for interaction tests

### What was tricky to build
- The context menu arrow key navigation with `enabledActions` — need to track only non-disabled actions for keyboard navigation, separate from the rendered `actions` array which may include disabled items
- The `buttonRefs` array needs to map from `enabledIndex` (not the render index) to button elements

### What warrants a second pair of eyes
- The `enabledActions` filtering in the context menu — disabled actions are still rendered but skipped for keyboard navigation. Is this the right UX?
- The Enter key on the confirm modal could conflict with the command line if both are active simultaneously — but they shouldn't be, since the modal blocks the command line.

### What should be done in the future
- Add Tab key navigation in context menu (consistent with WAI-ARIA menu pattern)
- Add ARIA roles to context menu (`role="menu"`, `role="menuitem"`)
- Add screen reader announcements for mode changes (select/confirm/normal)
- Consider adding a `useClimKeyboard` hook that centralizes keyboard shortcuts

### Code review instructions
- Check `PbuiConfirmModal.tsx` — Enter/Escape handlers
- Check `PbuiContextMenu.tsx` — arrow key navigation with `focusedIndex` state
- Check `PbuiCommandLine.tsx` — `autoFocus` prop + `useRef`/`useEffect`
- Check `DeliViewHeader.tsx` — `activeFilters` rendering
- Run Storybook and verify interaction tests pass

### Technical details

```typescript
// Auto-focus command line on mode change
useEffect(() => {
  if (autoFocus) {
    inputRef.current?.focus();
  }
}, [autoFocus]);

// Context menu keyboard navigation
const handleKeyDown = useCallback((e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    const next = focusedIndex < enabledActions.length - 1 ? focusedIndex + 1 : 0;
    setFocusedIndex(next);
    buttonRefs.current[next]?.focus();
  }
  // ...
}, [visible, focusedIndex, enabledActions, onAction, onDismiss]);

// Filter badges in view header
{activeFilters?.map((filter) => (
  <span key={filter} className="text-xs px-1.5 py-0.5 border border-clim-danger text-clim-danger">
    {filter}
  </span>
))}
```

---

## Step 8: Generic CLIM Package Polish

Made the shell title configurable, removed unused imports, added CLIM layer README, and added end-to-end Storybook story.

### Prompt Context

**User prompt (verbatim):** "yes, continue."

**Assistant interpretation:** Continue polishing the PoC for general-purpose reuse.

**Inferred user intent:** Strengthen the generic CLIM layer as a reusable package foundation.

**Commit (code):** f38d296 — "refactor(shell): make title configurable, remove unused PbuiConfirmPrompt import"
**Commit (code):** 5038e2b — "docs: add README for generic CLIM layer"
**Commit (code):** 37d11c4 — "feat(stories): add PlaceOrderConfirmFlow end-to-end story test"

### What I did
- Made `PbuiShell` title configurable (defaults to 'CLIM', domain passes 'HUDSON STREET DELI')
- Removed unused `PbuiConfirmPrompt` import from `DeliPbuiWorkbench`
- Added comprehensive `README.md` for `src/generic/clim/` covering architecture, types, components, action engine, command parser, session state, and domain integration guide
- Added `PlaceOrderConfirmFlow` end-to-end Storybook story with play function

### Why
The generic CLIM layer should have zero domain-specific assumptions. Hardcoded titles are a clear violation. Documentation makes the layer accessible as a standalone package.

### What worked
- The title prop approach is clean — the shell stays generic, the workbench provides the domain title
- The README captures the key architectural decisions (discriminated union, action intents, presentation refs) in a scannable format

### What didn't work
- N/A (straightforward refactor)

### What I learned
- The `ClimSessionState` type serves as a clean boundary between the shell (generic) and the session implementation (specific). It's a view model constructed by the workbench from the `PbuiInteractionState` discriminated union.

### What was tricky to build
- Nothing particularly tricky in this step — mostly documentation and minor refactors.

### What warrants a second pair of eyes
- The README's "Domain Integration" section — is it sufficient for a new developer to create a CLIM application from scratch?

### What should be done in the future
- Extract `src/generic/clim/` into its own npm package
- Add unit tests for the action engine functions
- Add a minimal example app alongside the Deli PoC

### Code review instructions
- Check `src/generic/clim/README.md` — accuracy and completeness
- Check `PbuiShell.tsx` — title prop usage
- Check `DeliPbuiWorkbench.stories.tsx` — PlaceOrderConfirmFlow story

---

## Step 9: Extract `@go-go-golems/pbui` Package

Extracted the generic CLIM layer into a proper npm package following the go-go-os-frontend conventions.

### Prompt Context

**User prompt (verbatim):** "name the package @go-go-golems/pbui (see ~/code/wesen/go-go-golems/go-go-os-frontend/ where we already have a whole bunch of packages, to see if there is a common structure to be used here.)"

**Assistant interpretation:** Extract the generic CLIM layer into `@go-go-golems/pbui` package following existing go-go-golems package conventions.

**Inferred user intent:** Make the PoC's generic layer reusable as a proper package in the go-go-golems ecosystem.

**Commit (code):** b7f505d — "feat: extract @go-go-golems/pbui package from deli-pbui-react PoC"

### What I did
- Created `dmeta/packages/pbui/` following go-go-os-frontend package conventions
- Set up `package.json` with `@go-go-golems/pbui` name, peerDeps (react, RTK, react-redux), sub-path exports
- Set up `tsconfig.json` with `composite: true`, `jsx: react-jsx`, same compiler options as os-core
- Copied all 43 source files from `src/generic/clim/` → `packages/pbui/src/`
- Created barrel `index.ts` re-exporting all types, functions, and components
- Created per-component `index.ts` barrels with `export type *` for types
- Extracted CSS theme tokens to `src/theme/clim-tokens.css` (scoped to `[data-widget="clim"]`)
- Added `src/theme/index.ts` for `import '@go-go-golems/pbui/theme'`
- Created `pnpm-workspace.yaml` at `dmeta/` level linking `packages/*` and `proof-of-concept/*`
- Updated PoC `package.json` to depend on `@go-go-golems/pbui: workspace:*`
- Replaced all 30+ relative `../../generic/clim/...` imports with `@go-go-golems/pbui`
- Consolidated multiple import lines from the same package into single import statements
- Removed `src/generic/clim/` from the PoC (now lives in the package)
- Fixed Tailwind v4 class discovery: added `@source` directives to `index.css` pointing to package source
- Added comprehensive README with installation, Tailwind setup, architecture, API docs, and domain integration guide

### Why
The generic CLIM layer had zero outbound domain dependencies — it was always meant to be reusable. Extracting it into a proper package enforces a clean API boundary and makes it available to future CLIM apps (e.g., Readwise Viewer rewrite).

### What worked
- The go-go-os-frontend package conventions (peerDeps, `exports` map, `composite: true` tsconfig) mapped directly
- `pnpm-workspace.yaml` with `workspace:*` dependency resolved cleanly
- All component source files needed zero changes — relative imports (`../../types`, `../PbuiAction`) resolve identically in the new location
- The barrel `index.ts` forced us to audit every public export, catching `PrefixCommandHelp` (was in `commandParser`, not `types`) and missing function exports

### What didn't work
- **Tailwind v4 `@source` with `node_modules` path failed** — Tailwind couldn't find the class names when pointing at `node_modules/@go-go-golems/pbui/src/**/*.tsx`. Had to use the real filesystem path (`../../../packages/pbui/src/**/*.tsx`) which works because pnpm uses relative paths back to workspace packages.
- **CSS spacing completely broke** when the package was extracted — Tailwind v4 only generates CSS for classes it discovers in scanned files. Since the components moved outside the scan path, classes like `px-3`, `py-2`, `gap-2`, `flex` etc. were no longer generated. Adding `@source` fixed it.

### What I learned
- Tailwind v4's content discovery does NOT scan `node_modules` by default — you MUST add `@source` directives for any package that uses Tailwind classes in its source. This is a critical integration point.
- The `workspace:*` dependency in pnpm creates a real directory (not a symlink) at `node_modules/@go-go-golems/pbui` pointing back to the workspace package.
- The `clickableDecorationStyle` export was only accessible via the component's barrel `index.ts` — needed to add it explicitly.

### What was tricky to build
- The Tailwind `@source` resolution — the path must be relative to the CSS file, not the project root, and must point to the actual source files (not through the node_modules symlink). This is a fragile integration point that every consumer must get right.
- The barrel export audit — needed to carefully check every function/type that the PoC app imports and ensure it's exported from the package barrel. Missed several on first pass (`actionAcceptsRef`, `canFillRefArg`, `canFillValueArg`, `nextOpenArg`, `presentationVisualState`, `PrefixCommandHelp`, `parseCommandLine` vs `parseCommand`, `makeRouteCodec` vs `RouteCodec`).

### What warrants a second pair of eyes
- The `@source` path in `index.css` — using `../../../packages/pbui/src/**/*.tsx` works but is fragile. If the package is published to npm and installed normally, consumers would need `../../node_modules/@go-go-golems/pbui/src/**/*.tsx`. Should the README document both patterns?
- The `pnpm-workspace.yaml` at the `dmeta/` level — is this the right place, or should it be at the workspace root?

### What should be done in the future
- Consider publishing the package with pre-built CSS so consumers don't need `@source` directives
- Add unit tests for the action engine and command parser pure functions
- Add a minimal example app alongside the Deli PoC
- Consider a Tailwind plugin that automatically registers the `clim-*` color tokens

### Code review instructions
- Check `packages/pbui/package.json` — peerDeps, exports map, scripts
- Check `packages/pbui/src/index.ts` — all public exports
- Check `proof-of-concept/deli-pbui-react/src/index.css` — @source directives
- Verify `npx tsc --noEmit` passes in both the package and the PoC
- Verify the app renders correctly in the browser with no CSS issues

---

## Step 10: Vault-backed npm publishing for PBUI and go-go-os-frontend

Moved npm publishing authentication out of GitHub environment secrets and into Vault-backed GitHub Actions OIDC for both the new `@go-go-golems/pbui` publishing workflow in `dmeta` and the existing npm publishing workflow in `go-go-os-frontend`.

The important design choice was to keep the publish workflows manual and guarded, but make the npm token retrieval just-in-time: GitHub Actions receives an OIDC JWT, Vault verifies that it came from the exact repository/workflow on `main`, and the workflow receives `NODE_AUTH_TOKEN` only for the publish step.

### Prompt Context

**User prompt (verbatim):** "Setup vault token for npm publishing, for go-go-os-frontend _and_ for dmeta. Keep a diary as you work."

**Assistant interpretation:** Configure Vault roles/policies and update both GitHub Actions npm publish workflows so npm tokens are retrieved from Vault via GitHub Actions OIDC rather than from GitHub environment secrets.

**Inferred user intent:** Centralize npm publish credentials in Vault, reuse the existing GitHub Actions OIDC pattern, and document the infrastructure change for later review/debugging.

**Commit (code):** b9f8c630c185994fd6210e76c2821cfa1da01daa — "ci: read pbui npm token from Vault"

**Commit (code):** 80baa8fd9a6c7dcec1cf4b59085f5908a19fd205 — "ci: read npm publish token from Vault"

### What I did
- Confirmed Vault already has a `github-actions/` JWT auth mount using issuer `https://token.actions.githubusercontent.com`.
- Confirmed existing roles such as `dmeta-gitops-pr` use the same GitHub Actions OIDC pattern.
- Created/updated Vault policy `gha-dmeta-npm-publish`, limited to `kv/data/ci/github/dmeta/npm-token` plus self-token lookup/renew/revoke.
- Created/updated Vault policy `gha-go-go-os-frontend-npm-publish`, limited to `kv/data/ci/github/go-go-os-frontend/npm-token` plus self-token lookup/renew/revoke.
- Created/updated Vault role `dmeta-npm-publish`, bound to `go-go-golems/dmeta`, `workflow_dispatch`, `refs/heads/main`, and `.github/workflows/publish-pbui.yml@refs/heads/main`.
- Created/updated Vault role `go-go-os-frontend-npm-publish`, bound to `go-go-golems/go-go-os-frontend`, `workflow_dispatch`, `refs/heads/main`, and `.github/workflows/publish-npm.yml@refs/heads/main`.
- Updated `dmeta/.github/workflows/publish-pbui.yml` to call `hashicorp/vault-action@v3` and pass the Vault output as `NODE_AUTH_TOKEN` to `npm publish`.
- Updated `go-go-os-frontend/.github/workflows/publish-npm.yml` to call `hashicorp/vault-action@v3` and pass the Vault output as `NODE_AUTH_TOKEN` to the existing `publish-npm-package-set.mjs` script.
- Removed the `secrets.NPM_TOKEN` dependency from the dmeta workflow.
- Parsed both YAML files with Ruby's YAML parser to catch obvious syntax errors.

### Why
- Vault is already the central secret store for this environment, and GitHub Actions OIDC avoids long-lived Vault tokens in GitHub.
- The npm token should be readable only by the manual publish workflow for the intended repo, not by arbitrary workflows or branches.
- Keeping `dry_run`, `skip_existing`, and `CONFIRM_LATEST` preserves the go-go-os-frontend operational safety model while changing only where the credential comes from.

### What worked
- Vault policies uploaded successfully.
- The second role creation attempt succeeded when the payload was sent as JSON over stdin.
- The final role reads showed the expected bound claims and token policies.
- The workflow diffs are small and localized to the publish-auth boundary.
- Both edited workflow files parse as YAML.

### What didn't work
- The first attempt to create the Vault JWT roles passed `bound_claims` as a CLI string and Vault rejected it:
  - Command shape: `vault write auth/github-actions/role/dmeta-npm-publish ... bound_claims='{...}' ...`
  - Error: `error converting input for field "bound_claims": '' expected a map, got 'string'`
- The repo-specific npm-token KV paths do not exist yet:
  - `vault kv metadata get kv/ci/github/dmeta/npm-token` exited with status `2`
  - `vault kv metadata get kv/ci/github/go-go-os-frontend/npm-token` exited with status `2`
- `gh repo view ... --json databaseId` produced no useful output in this shell, so I did not bind the Vault roles to `repository_id`. The roles are still tightly bound by repository owner/name, workflow path, event, and `main` ref.

### What I learned
- For Vault JWT roles with map-valued fields, stdin JSON is safer than trying to pass nested maps through `vault write key=value` shell quoting.
- The existing dmeta GitOps Vault role is scoped to push-on-main and a GitOps PR token; npm publishing needs a separate role/policy rather than extending that role.
- go-go-os-frontend's current npm publish workflow relies on the `npm-production` environment and npm auth side effects, but the workflow itself did not explicitly reference `secrets.NPM_TOKEN`.

### What was tricky to build
- The biggest sharp edge was claim binding. Binding to `workflow_dispatch`, `refs/heads/main`, and an exact `workflow_ref` intentionally means the Vault role will not work from a task branch. That is safer for production publishing, but it means the first full end-to-end dry run must happen after the workflow changes are on `main`.
- The other tricky part was preserving the existing npm publish behavior. `actions/setup-node` writes npm registry configuration, while `npm publish` needs `NODE_AUTH_TOKEN` at publish time. The workflows now keep that same contract but source `NODE_AUTH_TOKEN` from the Vault action output instead of a GitHub secret.

### What warrants a second pair of eyes
- Confirm whether the bound claim set should also include GitHub's `environment` claim for `npm-production`. I avoided it because existing roles in this Vault setup do not depend on that claim, and GitHub's environment claim behavior can be easy to mis-assume.
- Confirm whether separate repo-scoped npm tokens are preferred, or whether both policies should read a shared org-level npm token path.
- Confirm the `hashicorp/vault-action@v3` `secrets` path syntax against a real workflow run once the KV paths exist.

### What should be done in the future
- Generate or copy real npm automation tokens into Vault:
  - `vault kv put kv/ci/github/dmeta/npm-token value="<npm-automation-token>"`
  - `vault kv put kv/ci/github/go-go-os-frontend/npm-token value="<npm-automation-token>"`
- Merge the dmeta workflow change to `main` before expecting Vault auth to succeed, because the role is bound to `refs/heads/main`.
- Run both publish workflows with `dry_run: true` to validate OIDC → Vault → npm auth before attempting a real publish.
- Optionally add `repository_id` claim binding once the GitHub repository IDs are available in a reliable way.

### Code review instructions
- Review `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/.github/workflows/publish-pbui.yml`, especially the `Read NPM token from Vault` step and the `NODE_AUTH_TOKEN` env on `Publish to npm`.
- Review `/home/manuel/code/wesen/go-go-golems/go-go-os-frontend/.github/workflows/publish-npm.yml`, especially the `Read NPM token from Vault` step and the `NODE_AUTH_TOKEN` env on `Publish selected packages to npmjs`.
- Validate Vault roles with:
  - `vault read auth/github-actions/role/dmeta-npm-publish`
  - `vault read auth/github-actions/role/go-go-os-frontend-npm-publish`
- Validate policies with:
  - `vault policy read gha-dmeta-npm-publish`
  - `vault policy read gha-go-go-os-frontend-npm-publish`
- After storing the real KV secrets and merging workflow changes to `main`, run each publish workflow with `dry_run: true`.

### Technical details
- Vault auth mount: `auth/github-actions/` (`jwt`, issuer/discovery URL `https://token.actions.githubusercontent.com`).
- Vault audience used by both roles and workflows: `https://vault.yolo.scapegoat.dev`.
- dmeta Vault role: `dmeta-npm-publish`.
- go-go-os-frontend Vault role: `go-go-os-frontend-npm-publish`.
- dmeta secret path expected by workflow: `kv/data/ci/github/dmeta/npm-token`, field `value`.
- go-go-os-frontend secret path expected by workflow: `kv/data/ci/github/go-go-os-frontend/npm-token`, field `value`.
- The workflows use `exportEnv: false`, then pass `steps.vault-npm.outputs.NODE_AUTH_TOKEN` only to the publish step.

---

## Step 11: Store npm tokens in Vault and validate dry-run publishing

Completed the operational handoff for Vault-backed npm publishing. I stored the local npmjs publish token in the repo-scoped Vault KV paths, merged the dmeta publishing workflow onto `main`, and ran dry-run publish workflows for both repositories.

Both GitHub Actions runs succeeded end-to-end. That validates the critical chain: GitHub workflow_dispatch on `main` → GitHub OIDC token → Vault `github-actions/` JWT auth → repo-specific Vault policy → `NODE_AUTH_TOKEN` output → npm dry-run publish.

### Prompt Context

**User prompt (verbatim):** "go ahead"

**Assistant interpretation:** Proceed with the remaining operational setup: put the npm token into Vault, make the dmeta workflow reachable on `main`, and verify the publish workflows with dry runs.

**Inferred user intent:** Finish the Vault-backed npm publish setup rather than leaving it as wiring-only infrastructure.

**Commit (code):** fc431eb — "Merge task/dmeta-dsl Vault npm publishing setup"

### What I did
- Confirmed local npm auth works as user `wesen3000`.
- Confirmed `npm token list` reports a publish token.
- Extracted the npmjs auth token from `~/.npmrc` without printing it.
- Stored that token in both Vault KV paths:
  - `kv/ci/github/dmeta/npm-token`
  - `kv/ci/github/go-go-os-frontend/npm-token`
- Verified both Vault KV metadata entries exist.
- Merged `task/dmeta-dsl` into the dmeta `main` worktree.
- Resolved add/add merge conflicts in the ticket changelog and diary by taking the task branch version, because it contained Step 10 and the latest Vault setup record.
- Pushed dmeta `main` with merge commit `fc431eb`.
- Dispatched dmeta dry-run workflow:
  - repo: `go-go-golems/dmeta`
  - workflow: `publish-pbui.yml`
  - run: `26481694722`
  - result: success
- Dispatched go-go-os-frontend dry-run workflow:
  - repo: `go-go-golems/go-go-os-frontend`
  - workflow: `publish-npm.yml`
  - package: `@go-go-golems/os-core`
  - run: `26481694779`
  - result: success

### Why
- The Vault roles were bound to `refs/heads/main`, so dmeta needed the workflow on `main` before OIDC auth could pass.
- A successful dry run proves the credential retrieval and publish pipeline work without publishing a real package version.
- Storing the same npm publish token in two repo-specific KV paths keeps policies simple and narrow while still allowing later token rotation per repo.

### What worked
- The current local npmjs token is a publish-capable token and could be stored in Vault.
- dmeta `publish-pbui` completed successfully in 25 seconds.
- go-go-os-frontend `publish-npm` completed successfully in 29 seconds.
- In both runs, `Read NPM token from Vault` completed successfully.
- In both runs, the npm publish dry-run step completed successfully.

### What didn't work
- The first attempt to check out `main` in `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta` failed because `main` is already checked out in another worktree:
  - `fatal: 'main' is already used by worktree at '/home/manuel/code/wesen/go-go-golems/dmeta'`
- A fast-forward merge from `task/dmeta-dsl` to `main` was not possible because `main` already contained a PR merge commit:
  - `fatal: Not possible to fast-forward, aborting.`
- A normal merge produced add/add conflicts in the ticket `changelog.md` and `reference/01-diary.md`; these were resolved by taking the task branch version.

### What I learned
- The dmeta repo has two active worktrees: the task branch under `/home/manuel/workspaces/...` and `main` under `/home/manuel/code/wesen/go-go-golems/dmeta`.
- The main branch already contained the package extraction work through PR merge `686f6e4`, so the final Vault workflow merge needed to integrate only the additional CI/CD and diary changes.
- The Vault-bound workflow constraints were correctly strict: once the workflow was on `main`, both dry-run publish jobs could authenticate to Vault.

### What was tricky to build
- The worktree layout made a simple branch checkout fail. The safe path was to perform the `main` merge from `/home/manuel/code/wesen/go-go-golems/dmeta`, where `main` was already checked out.
- The merge conflicts were add/add conflicts because both branches had ticket docs. I resolved them by keeping the task branch documents because they contained the newest Step 10 Vault diary and changelog entries.
- The dry-run validation had to be launched only after pushing dmeta `main`; otherwise the Vault role's exact `workflow_ref` and `ref` constraints would have rejected the OIDC login.

### What warrants a second pair of eyes
- Decide whether using the same npm publish token for both Vault paths is acceptable long-term. It works, but separate tokens would make revocation/audit cleaner.
- Review whether the dmeta merge commit should be reflected back into any open PR/task branch bookkeeping.
- Confirm whether a real publish should target `latest` immediately or use `next` first for `@go-go-golems/pbui`.

### What should be done in the future
- Rotate to dedicated npm automation tokens per repository if npm org permissions make that practical.
- Run a real dmeta PBUI publish with `dry_run: false` and `confirm_latest_publish: CONFIRM_LATEST` when ready.
- Keep the first real go-go-os-frontend publish as a small single-package publish, as with the dry-run validation.

### Code review instructions
- Inspect dmeta run `26481694722`: https://github.com/go-go-golems/dmeta/actions/runs/26481694722
- Inspect go-go-os-frontend run `26481694779`: https://github.com/go-go-golems/go-go-os-frontend/actions/runs/26481694779
- Check that both runs show `Read NPM token from Vault` and publish dry-run steps as successful.
- Check the Vault metadata exists without reading secret values:
  - `vault kv metadata get kv/ci/github/dmeta/npm-token`
  - `vault kv metadata get kv/ci/github/go-go-os-frontend/npm-token`

### Technical details
- dmeta dry-run workflow inputs: `npm_tag=latest`, `dry_run=true`, `skip_existing=true`.
- go-go-os-frontend dry-run workflow inputs: `package_set=single`, `package_name=@go-go-golems/os-core`, `npm_tag=latest`, `dry_run=true`, `skip_existing=true`.
- GitHub Actions run IDs:
  - dmeta: `26481694722`
  - go-go-os-frontend: `26481694779`

