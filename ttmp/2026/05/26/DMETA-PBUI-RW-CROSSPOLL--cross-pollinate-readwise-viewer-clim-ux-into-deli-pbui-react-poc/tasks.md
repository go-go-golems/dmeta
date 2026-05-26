# Tasks

## TODO

- [x] Add tasks here

- [x] Phase 1: Foundational Type & State Refactoring
- [x] 1.1 Add ActionIntent, ActionPresentation types to generic/clim/types.ts
- [x] 1.2 Add PbuiInteractionState discriminated union to types.ts
- [x] 1.3 Refactor pbuiSessionSlice.ts to use discriminated InteractionState union
- [x] 1.4 Add copyValue to PresentationRef
- [x] 1.5 Add commandHint to session state
- [x] 1.6 Add context menu state to session slice
- [x] Phase 2: Action Presentations & Engine
- [x] 2.1 Add actionToPresentation() builder and actionIntents() to actionEngine.ts
- [x] 2.2 Refactor PbuiActionBar to render ActionPresentation objects
- [x] 2.3 Add PbuiHintBar component showing compatible actions after selection
- [x] 2.4 Update PbuiPresentationRef click handling for Action presentations
- [x] Phase 3: Context Menu & Danger Styling
- [x] 3.1 Add PbuiContextMenu generic component
- [x] 3.2 Wire right-click context menu on PbuiPresentationRef
- [x] 3.3 Add dangerousTarget visual styling to PbuiPresentationRef
- [x] 3.4 Add PbuiConfirmModal overlay component (replace inline PbuiConfirmPrompt)
- [x] Phase 4: Command Enhancements
- [x] 4.1 Extend command parser for prefix commands (SEARCH, CATEGORY, DIET)
- [x] 4.2 Define deli prefix commands and wire to domain dispatch
- [x] 4.3 Add generic PbuiHelpView generated from action and prefix-command registries
- [x] Phase 5: Wire Everything Together in Deli Domain
- [x] 5.1 Update DeliPbuiWorkbench and hooks to use new interaction state
- [x] 5.2 Wire context menu, hint bar, and confirm modal in deli views
- [x] 5.3 Add COPY action to deli actions registry
- [x] 5.4 Replace DeliHelpView with generic PbuiHelpView
- [x] 5.5 Add comprehensive Storybook stories for all new components
