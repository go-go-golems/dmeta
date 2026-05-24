# Diary

## Goal

Capture the step-by-step narrative of migrating the Hudson Street Deli mobile ordering prototype from static HTML/CSS/JS to React, using DMETA reflection-first widget scaffolds as semantic guides.

## Step 1: Read playbooks, design docs, and ticket guide; create docmgr ticket and write system guide

Before writing any code, I read all the referenced documentation to build a thorough understanding of the system. Then I created a docmgr ticket and wrote an exhaustive intern-ready implementation guide.

### Prompt Context

**User prompt (verbatim):** "Read these playbooks/docs first: playbooks/02-dmeta-design-system-factory-runthrough-playbook.md, playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md, design-docs/07-generated-instance-widget-review-guide.md, and the ticket guide ttmp/2026/05/23/DMETA-WIDGET-REFLECTIVE-SCAFFOLDS--reflection-first-widget-scaffolds/design-doc/01-reflection-first-widget-scaffold-implementation-guide.md. Then migrate examples/street-deli-ordering/www/mobile to React..."

**Assistant interpretation:** Read all reference docs, understand the DMETA system, the Street Deli domain, the static prototype, the generated widget scaffolds, and the reflection-first philosophy. Then write an exhaustive intern-ready guide and create a docmgr ticket before beginning the React migration work.

**Inferred user intent:** Have a comprehensive, self-contained technical document that a new team member can read to understand the entire system and start implementing React widgets.

### What I did

- Read all 4 referenced documents
- Read the entire static prototype (HTML, CSS, JS)
- Read the instance manifest, generated widget scaffolds, widget template YAML, design-language IR, domain example
- Ran `validate-ir` and `plan-instance` — both pass cleanly
- Created docmgr ticket `DMETA-REACT-MIGRATION`
- Wrote 65KB intern-ready system guide with 25 sections
- Uploaded guide to reMarkable at `/ai/2026/05/23/DMETA-REACT-MIGRATION`
- Created diary doc, related 8 key files
- Committed (2216784)

### What worked

- All four reference docs were well-structured and cross-referenced
- The generated `.metadata.ts` files already contain resolved semantic context
- reMarkable upload succeeded on first attempt

### What didn't work

- Initially searched for files under the wrong directory

### What I learned

- The reflection-first philosophy is the key design decision
- The substitution engine maps directly to `role_preserving_substitutable` capability

### What warrants a second pair of eyes

- Whether React context + useReducer is sufficient for customizer draft
- Whether promoted widget prop shapes match prototype rendering behavior

### What should be done in the future

- Implement the React application
- Add Storybook stories for each widget

---

## Step 2: Initialize React project and promote all 8 widgets

Created the full React application with all 8 promoted widgets, state management, substitution engine, and design tokens.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** After writing the guide, proceed with the actual React migration by implementing the full application.

**Inferred user intent:** Produce a working React application that matches the static prototype's UX.

**Commit (code):** efd2ccd — "DMETA-REACT-MIGRATION: initialize React app with all 8 promoted widgets"

### What I did

- Initialized Vite + React + TypeScript project at `www/mobile-react/`
- Created design-tokens module (`tokens.ts`, `dataAttributes.ts`)
- Ported all menu data (12 items), substitution rules (25+ ingredient rules), and config options from static prototype
- Ported substitution engine (`resolveSubKey`, `getAutoSuggestCandidates`, `formatPrice`)
- Implemented state management (`DeliContext`, `deliReducer` with 17 action types)
- Promoted all 8 widgets:
  - `StreetDeliRoleTag` — role tag pill with role color lookup
  - `StreetDeliCompositionCard` — menu item card with name, price, description, ingredients, dietary badges, `data-dmeta-*` attributes
  - `StreetDeliIngredientRow` — ingredient with remove/undo/substituted states, role tags, dietary badges
  - `StreetDeliSubstitutionChip` — replacement suggestion card with original→replacement, roles, price delta
  - `StreetDeliCompositionCustomizer` — full bottom-sheet customization with ingredient list, substitution zone, config selectors, dietary summary, allergen warning, add-to-order button
  - `StreetDeliMenuBrowser` — header + category tabs + filtered card list
  - `StreetDeliOrderCart` — cart items with substitutions/config, totals, place order
  - `StreetDeliOrderTracker` — step indicator with auto-advancing timer
- Created shared surfaces: `DietaryFilterBar` (sticky), `BottomSheet` (overlay primitive), `CartFab` (floating button)
- Wired all screens in `App.tsx` with state-based routing
- Full CSS module styling matching the static prototype design tokens
- `npm run build` passes cleanly
- `validate-ir` and `plan-instance` both pass

### Why

The static prototype is the UX reference. The generated scaffolds provide semantic context. The React app must match the prototype's visual behavior while using the scaffold's metadata for provenance and testing.

### What worked

- Vite project setup was fast and clean
- CSS custom properties in `index.css` + CSS Modules per widget worked well
- The substitution engine ported cleanly from JS to TypeScript
- The reducer pattern maps well to the prototype's state object

### What didn't work

- Em-dash unicode characters (`—`) in JSDoc comments caused `tsc -b` to fail with `erasableSyntaxOnly` — fixed by replacing with `--`
- `verbatimModuleSyntax` requires `import type` for type-only imports — had to fix several files
- `noUnusedLocals`/`noUnusedParameters` caught several unused imports — had to clean up

### What I learned

- The Vite tsconfig.app.json has strict defaults (`erasableSyntaxOnly`, `verbatimModuleSyntax`, `noUnusedLocals`) that differ from a typical TS config — need to account for these
- CSS Modules are a good fit for the DMETA design token system: each widget gets scoped styles that reference the `:root` CSS custom properties

### What was tricky to build

- The CompositionCustomizer is the most complex widget — it composes IngredientRow, SubstitutionChip, config selectors, dietary summary, allergen warning, and add-to-order button all in one surface
- The substitution zone logic (show when ingredient removed, show top 2 auto-suggest candidates, "see all N options") requires careful state tracking

### What warrants a second pair of eyes

- The SubstitutionChip `onApply` callback passes the auto-suggest index which may not match the full candidate list index — this could be a bug when the "see all N options" flow is implemented
- The tracker step advancement timer in `App.tsx` uses `useEffect` with `setTimeout` — should verify it doesn't accumulate timers if the component re-renders

### What should be done in the future

- Add Storybook stories for each widget
- Implement the "See all N options" substitution detail sheet
- Add visual comparison screenshots with the static prototype
- Add unit tests for the substitution engine
- Add integration tests for the full ordering flow
- Verify all `data-dmeta-*` attributes render correctly

### Code review instructions

- Start with `www/mobile-react/src/App.tsx` — the top-level screen router
- Then `src/state/deliReducer.ts` — the core state logic
- Then `src/engine/substitutionEngine.ts` — the replacement engine
- Then `src/widgets/StreetDeliCompositionCustomizer/` — the most complex widget
- Verify: `cd www/mobile-react && npm run build` (should succeed)
- Verify: `cd ../.. && go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table` (no errors)
- Verify: `cd ../.. && go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table` (8 selected, 6 excluded)

### Technical details

- React app: `/home/manuel/code/wesen/go-go-golems/dmeta/examples/street-deli-ordering/www/mobile-react/`
- 56 files created in commit efd2ccd
- Build output: 231.91 KB JS + 14.99 KB CSS (gzipped: 69.93 KB + 3.63 KB)
