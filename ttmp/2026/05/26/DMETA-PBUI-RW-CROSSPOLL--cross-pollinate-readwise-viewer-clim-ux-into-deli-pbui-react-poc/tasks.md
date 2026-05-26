# Tasks

## TODO

- [ ] Add tasks here

- [ ] Phase 1: Foundational Type & State Refactoring
- [ ] 1.1 Add ActionIntent, ActionPresentation types to generic/clim/types.ts
- [ ] 1.2 Add PbuiInteractionState discriminated union to types.ts
- [ ] 1.3 Refactor pbuiSessionSlice.ts to use discriminated InteractionState union
- [ ] 1.4 Add copyValue to PresentationRef
- [ ] 1.5 Add commandHint to session state
- [ ] 1.6 Add context menu state to session slice
- [ ] Phase 2: Action Presentations & Engine
- [ ] 2.1 Add actionToPresentation() builder and actionIntents() to actionEngine.ts
- [ ] 2.2 Refactor PbuiActionBar to render ActionPresentation objects
- [ ] 2.3 Add PbuiHintBar component showing compatible actions after selection
- [ ] 2.4 Update PbuiPresentationRef click handling for Action presentations
- [ ] Phase 3: Context Menu & Danger Styling
- [ ] 3.1 Add PbuiContextMenu generic component
- [ ] 3.2 Wire right-click context menu on PbuiPresentationRef
- [ ] 3.3 Add dangerousTarget visual styling to PbuiPresentationRef
- [ ] 3.4 Add PbuiConfirmModal overlay component (replace inline PbuiConfirmPrompt)
- [ ] Phase 4: Command Enhancements
- [ ] 4.1 Extend command parser for prefix commands (SEARCH, CATEGORY, DIET)
- [ ] 4.2 Define deli prefix commands and wire to domain dispatch
- [ ] 4.3 Add generic PbuiHelpView generated from action and prefix-command registries
- [ ] Phase 5: Wire Everything Together in Deli Domain
- [ ] 5.1 Update DeliPbuiWorkbench and hooks to use new interaction state
- [ ] 5.2 Wire context menu, hint bar, and confirm modal in deli views
- [ ] 5.3 Add COPY action to deli actions registry
- [ ] 5.4 Replace DeliHelpView with generic PbuiHelpView
- [ ] 5.5 Add comprehensive Storybook stories for all new components
