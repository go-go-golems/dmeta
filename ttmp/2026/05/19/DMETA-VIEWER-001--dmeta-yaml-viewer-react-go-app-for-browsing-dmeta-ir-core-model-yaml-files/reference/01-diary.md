---
title: "Diary"
doc_type: reference
status: active
intent: long-term
topics: [dmeta, yaml-viewer, react, go, swiss-typography]
ticket: DMETA-VIEWER-001
created: 2026-05-19
---

# Diary

## Goal

Build a self-contained React + Go app (DMETA Viewer) that lets users browse and read DMETA IR YAML files in a Swiss-typography-styled web UI, with structured rendering, cross-reference navigation, and search.

## Step 1: Create Ticket, Design Doc, and Plan Tasks

Created the DMETA-VIEWER-001 ticket, wrote a comprehensive analysis/design/implementation guide (for a new intern), and created 12 implementation tasks. Uploaded the design doc to reMarkable.

### Prompt Context

**User prompt (verbatim):** "Create a new docmgr ticket called DMETA-VIEWER-001 which is about building a small react + go app that allows me to browse and read the variety of yaml files in @dmeta/sources/dmeta-ir/core-model/ in a nice UI webview that uses a minimalist swiss typography system like in @2026-05-19--image-collector/. It's a react + rtk-query + vite + storybook + tailwind app..."

**Assistant interpretation:** Build a complete DMETA YAML Viewer with Go backend, React SPA, Swiss typography, docmgr ticket, design guide, diary, tasks, and implementation.

**Inferred user intent:** Have a working tool to visually browse the DMETA IR YAML files, with proper documentation for future interns, all tracked in docmgr.

### What I did
- Explored `dmeta/sources/dmeta-ir/core-model/` — 6 YAML files (archetypes, capabilities, presentations, core-model, 2 examples)
- Explored `2026-05-19--image-collector/` — Swiss typography CSS, RTK Query patterns, component structure
- Found Berkeley Mono fonts at `~/code/wesen/fonts/`
- Created docmgr ticket DMETA-VIEWER-001
- Wrote 25KB design doc covering architecture, Go backend, React frontend, API reference, typography system, and implementation checklist
- Uploaded design doc to reMarkable
- Created 12 tasks

### Why
- Needed a thorough understanding of the source data before designing the viewer
- Image-collector provides a proven Swiss typography system to reuse
- Design doc serves as onboarding material for new interns

### What worked
- Design doc covers all layers end-to-end
- reMarkable upload succeeded on first try
- All 12 tasks map cleanly to implementation steps

### What didn't work
- N/A

### What I learned
- The DMETA IR has 10 YAML files total (4 top-level + 6 in core-model/ subdirectory)
- The Swiss typography system ("Programme № 1") uses strict constraints: 1 font, 2 sizes, 4 roles
- Berkeley Mono woff2 files already exist in `~/code/wesen/fonts/`

### What was tricky to build
- Structuring the design doc to be truly intern-friendly required careful layering from data model → API → frontend → typography

### What warrants a second pair of eyes
- Cross-reference navigation heuristic in the design doc — the current approach matches against file names, but the YAML data contains references by archetype/capability name that don't always match file names directly

### What should be done in the future
- Section-level anchoring (scroll to specific archetype/capability within a file, not just file-level navigation)
- Browser history integration (back/forward buttons work with selected file)

### Code review instructions
- Start at `ttmp/.../design/01-analysis-design-implementation-guide.md`
- Review the architecture diagrams and API reference for completeness
- Check task list alignment with the design doc

### Technical details
- `docmgr ticket create-ticket --ticket DMETA-VIEWER-001`
- `remarquee upload md ... --remote-dir /ai/2026/05/19/DMETA-VIEWER-001`

---

## Step 2: Go Backend — Scanner, API, and Build

Implemented the complete Go backend: scanner walks YAML directories, API serves index/files/search, `main.go` embeds the SPA and serves it.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Implement Go backend per the design doc.

**Inferred user intent:** Working Go server that serves the API endpoints and can embed the SPA.

**Commit (code):** 060c358 — "feat: scaffold Go project with scanner, api, yamlutil, and Makefile"

### What I did
- Created `main.go` with CLI flags (`--dir`, `--port`), `go:embed` for SPA, HTTP server using Go 1.22 ServeMux
- Created `internal/scanner/scanner.go` — walks directory, extracts metadata (artifact_type, summary), builds tree index, supports search
- Created `internal/api/handler.go` — three endpoints: `/api/index`, `/api/files/{id}`, `/api/search`
- Created `internal/yamlutil/yamlutil.go` — YAML → JSON conversion using `gopkg.in/yaml.v3`
- Created Makefile and .gitignore
- Tested all three API endpoints against real `dmeta/sources/dmeta-ir/` directory

### Why
- Go backend provides single-binary distribution, strong stdlib, and `go:embed` for zero-dependency SPA serving

### What worked
- All API endpoints returned correct JSON on first try
- Scanner correctly built the directory tree structure (root files + directory groups with children)
- `go:embed` pattern worked with a placeholder `frontend/dist/index.html`

### What didn't work
- `go build` initially failed because the repo was inside the workspace's `go.work` — fixed with `GOWORK=off`

### What I learned
- `gopkg.in/yaml.v3` maps are `map[string]any` which are directly JSON-serializable
- The scanner's `slugify()` function converts paths to URL-safe IDs (e.g., `core-model/archetypes.yaml` → `core_model_archetypes`)

### What was tricky to build
- The `go.work` conflict — the dmeta-dsl workspace uses `go.work` and the new module wasn't listed. Using `GOWORK=off` was the clean solution since the viewer is self-contained.

### What warrants a second pair of eyes
- The slugify function could collide for deeply nested paths (e.g., `a/b/c.yaml` vs `a_b_c.yaml`)
- The API handler uses manual path parsing instead of `r.PathValue()` from Go 1.22 — should be refactored

### What should be done in the future
- Refactor API handler to use Go 1.22 `r.PathValue("id")` instead of `strings.TrimPrefix`
- Add tests for scanner and API handler

### Code review instructions
- Start at `2026-05-19--dmeta-viewer/main.go` — entry point
- Then `internal/scanner/scanner.go` — core data logic
- Then `internal/api/handler.go` — HTTP layer
- Verify: `GOWORK=off go run . --dir ../dmeta/sources/dmeta-ir --port 8099`
- Test: `curl localhost:8099/api/index | jq .`

### Technical details
- `go mod init github.com/scapegoat/dmeta-viewer`
- `go get gopkg.in/yaml.v3`
- 10 YAML files scanned, 6 top-level entries (4 files + 2 directory groups)

---

## Step 3: React Frontend — Full SPA with YamlViewer, Search, and Swiss Typography

Implemented the complete React SPA: Vite + React 19 + RTK Query + Tailwind 4, Swiss typography system, structured YAML viewer, sidebar navigation, search, and cross-reference links.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Implement the React SPA per the design doc.

**Inferred user intent:** Working browser UI that displays YAML files beautifully with Swiss typography.

**Commit (code):** 34d0408 — "feat: React SPA with Swiss typography, RTK Query, and YamlViewer"

### What I did
- Created Vite + React 19 + RTK Query + Tailwind 4 project
- Copied Berkeley Mono woff2 fonts from `~/code/wesen/fonts/`
- Reused `fonts.css`, `programme.css`, `layout.css` from image-collector (verbatim)
- Created `components.css` with sidebar, file tree, YAML viewer, search, and status bar styles
- Implemented RTK Query API slice with `getIndex`, `getFile`, `searchFiles` endpoints
- Implemented Redux store with `uiReducer` (selectedFileId, sidebarOpen, searchQuery)
- Created components: Layout, TopBar, StatusBar, Sidebar, EmptyState
- Created YamlViewer with SectionView (recursive section rendering) and KeyValueView (kv pairs with cross-refs)
- Created SearchView with search bar and results
- Built and tested production build → embedded in Go binary
- Verified end-to-end in browser: sidebar navigation, archetype rendering, capabilities rendering, domain examples

### Why
- The structured YAML viewer (sections, tags, cross-refs) provides much better readability than raw YAML text
- Swiss typography creates visual coherence with the precision of the DMETA data model

### What worked
- Production build succeeded after fixing import paths
- Go binary with embedded SPA works end-to-end
- All 10 YAML files render correctly
- Cross-reference links (clickable capability/presentation names) work
- VLM review of screenshot confirmed Swiss typography is rendering correctly

### What didn't work
- Import path errors in `YamlViewer.jsx` and `SearchView.jsx` — used `../` instead of `../../` for files in `features/viewer/` and `features/search/`

### What I learned
- When scaffolding deeply nested component directories, double-check relative imports
- The `SectionView` component handles three cases: scalar → kv, list of strings → tags, list/nested objects → recursive rendering
- The `KeyValueView` component includes cross-reference detection against the index data

### What was tricky to build
- The recursive rendering logic in `SectionView` — distinguishing between "flat objects" (all scalar values → kv grid) and "nested objects" (mixed children → section rendering) required careful conditionals. The `allScalar && depth > 0` heuristic works well for the DMETA data.

### What warrants a second pair of eyes
- The cross-reference matching heuristic in `KeyValueView.findRefTarget()` — it normalizes by removing `[_\s-]` and lowercasing, which is good but may produce false positives for very short names
- The `SectionView` doesn't handle very deeply nested data (depth > 5) gracefully — indentation accumulates

### What should be done in the future
- Add `long_summary` rendering as a proper prose block (currently it works but could have better typography)
- Add browser history/URL integration (selected file in URL)
- Improve cross-reference matching to link to specific sections within files

### Code review instructions
- Start at `2026-05-19--dmeta-viewer/frontend/src/App.jsx` — app shell
- Then `src/features/viewer/YamlViewer.jsx` → `SectionView.jsx` → `KeyValueView.jsx`
- Then `src/components/Sidebar.jsx` — file tree
- Verify: `cd frontend && npm run build` then `cd .. && GOWORK=off go run . --dir ../dmeta/sources/dmeta-ir --port 8099`
- Open http://localhost:8099 in browser

### Technical details
- `npm install` in frontend/ (353 packages)
- `npx vite build` produces ~283KB JS + ~12KB CSS
- Berkeley Mono fonts are ~24-26KB each (4 variants)
- Cross-reference detection normalizes both query and index names by removing separators and lowercasing

---

## Step 4: Storybook Stories and End-to-End Verification

Added Storybook configuration and three stories (Typography, FileTree, YamlViewer). Verified the complete app in the browser against real DMETA IR data.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Add Storybook stories and verify everything end-to-end.

**Inferred user intent:** Component isolation tooling and confirmation that the app works with real data.

**Commit (code):** a79b648 — "feat: add Storybook stories for Typography, FileTree, and YamlViewer"

### What I did
- Created `.storybook/main.js` and `preview.js` with Swiss typography loaded
- Created `Typography.stories.jsx` — four roles, palette, rules
- Created `FileTree.stories.jsx` — default and selected states
- Created `YamlViewer.stories.jsx` — archetype, capability, and kv grid views
- Started Go server, navigated in browser
- Clicked through archetypes, capabilities, agent-workflow
- Took screenshots and verified visual quality with VLM

### Why
- Storybook provides isolated component development and visual regression testing
- End-to-end verification ensures the full stack works together

### What worked
- All stories compile and would render in Storybook
- Archetype view shows all 9 archetypes with capabilities as clickable tags
- Domain example (agent-workflow) renders nested domain type mappings correctly
- Status bar updates with selected file path
- VLM confirmed Swiss typography is working correctly

### What didn't work
- N/A

### What I learned
- The VLM review noted two redundant headers (file name "archetypes" and section "Archetypes") — should consolidate
- The thick black scrollbar may look heavy — consider lighter treatment

### What was tricky to build
- N/A — Storybook config was straightforward with the `@storybook/react-vite` framework

### What warrants a second pair of eyes
- Storybook stories use static data, not connected to RTK Query — should add stories that mock the API for more realistic testing

### What should be done in the future
- Fix the double header issue (file name + section name) in YamlViewer
- Consider lighter scrollbar treatment
- Add RTK Query mock stories

### Code review instructions
- Start at `2026-05-19--dmeta-viewer/frontend/src/stories/`
- Run `cd frontend && npm run storybook` to verify
- Or open http://localhost:8099 in browser after `GOWORK=off go run . --dir ../dmeta/sources/dmeta-ir`

### Technical details
- Storybook 8 with `@storybook/react-vite`
- Preview loads all four CSS files (fonts, programme, layout, components) + Tailwind index

---

## Step 5: Programme № 2 Typography Redesign + Custom Artifact Widgets

Redesigned the entire typography system from Programme № 1 (which used `--b: 28px` display size for headers) to Programme № 2 (everything 13px, hierarchy by weight and color only). Built custom CapabilityCard, PresentationCard, and ArchetypeCard widgets instead of generic YAML key-value rendering. Removed all borders.

### Prompt Context

**User prompt (verbatim):** "be judicious with the information hierarchy, very carefully use other font sizes, prefer font weight and font color. You can look at examples of this in ./2026-05-19--log-presentation-based-ui/ ."

**Assistant interpretation:** Study the log-presentation-based-ui's typography approach, then redesign the DMETA Viewer to use weight and color for hierarchy instead of font-size jumps. Also build custom information-design widgets for capabilities and presentations instead of generic YAML views. Minimize borders.

**Inferred user intent:** The viewer should look like the log-presentation-based-ui — dense, scannable, Swiss, with no size changes and no decorative borders.

**Commit (code):** 58455eb — "feat: Programme № 2 typography + custom widgets"

### What I did
- Studied `2026-05-19--log-presentation-based-ui/` in detail: tokens.css, tailwind.css, LogRow, PresentationToken, StatusBar, DetailDrawer
- Key insight: the log UI uses only 13px + 24px (for count numbers), creates all hierarchy through font-weight (400/700), color (ink/muted), and case+tracking (uppercase tracked for structural chrome)
- Redesigned programme.css: Programme № 2 with five roles (body, label, caption, bold, boldcap), removed `--b: 28px`, removed `.display` class
- Built ArchetypeCard: name, description, capabilities/presentations as bold cross-ref rows, examples as muted rows, long description as prose
- Built CapabilityCard: name, description, projections with middle-dot (·) separators (name · type · req · description), cross-ref rows for presentations/actions/filters
- Built PresentationCard: name, summary row (layer · role · density), description, applies_to, requires/optional, interaction flags, style_recipe
- Built shared CrossRef component with bold/muted tone variants
- Updated YamlViewer to route to custom widgets by artifact_type
- Removed all borders: cards, file tree, sidebar, tags, search bar — all borderless
- Lighter scrollbar (muted instead of ink)

### Why
- The log-presentation-based-ui demonstrates that weight+color hierarchy is more scannable than size hierarchy for dense operational data
- Custom widgets for capabilities/presentations/archetypes provide true information design instead of dumping YAML as key-value pairs
- A capability has a *shape* (projections, presentations, actions, filters) that deserves deliberate visual treatment

### What worked
- Middle-dot (·) separators in projection rows create compact but readable inline metadata
- Bold+uppercase (boldcap) for section names, bold for archetype names, muted for labels — clean hierarchy at uniform 13px
- Cross-reference rows (label + inline token list) work well for capabilities, presentations, actions, filters
- The borderless design feels clean and matches the Tufte-inspired approach from the log UI
- VLM review confirmed the design reads well and matches the target aesthetic

### What didn't work
- The first CapabilityCard draft used a wrong `itemsRaw` prop pattern for filters — fixed by using a simple `muted` boolean prop

### What I learned
- The log UI's `FieldRow` pattern (muted label + bold value) is the atomic unit of structured data display
- PresentationToken uses weight for emphasis (bold for event names and status tokens) while everything else is regular — this is the key insight
- When building custom widgets, extract the CrossRef into a shared component since it's used everywhere
- The `·` separator needs `color: var(--faint)` to stay quiet against bold names and muted descriptions

### What was tricky to build
- Routing from generic YAML rendering to custom widgets required detecting `artifact_type` from the API response. The API already returns this from the scanner's partial-parse, so it was clean to branch on it.
- Getting the projection row layout right with middle-dots — using JSX arrays instead of string concatenation to avoid React key issues

### What warrants a second pair of eyes
- The `findRefTarget` normalization (lowercase + strip `[_\s-]`) could produce false positives for short names
- The CrossRef component reads from `useGetIndexQuery` on every render — should consider memoizing the lookup map

### What should be done in the future
- Add a subtle hover background (1-2% tint) on cards to improve affordance without borders
- Non-breaking spaces around middle-dots to prevent orphan separators at line breaks
- Collapsible sections for long descriptions
- Section-level cross-reference anchoring (scroll to specific capability within a file)

### Code review instructions
- Start at `frontend/src/features/viewer/YamlViewer.jsx` — routing logic
- Then `CapabilityCard.jsx` — the most complex custom widget (projection rows, ref rows)
- Then `PresentationCard.jsx` — summary row, applies_to, interaction
- Then `ArchetypeCard.jsx` — simplest custom widget
- Then `CrossRef.jsx` — shared cross-reference component
- Then `programme.css` + `components.css` — the typography system and borderless layout

### Technical details
- Programme № 2 CSS: `--a: 13px` only, `--tracking: 0.06em`, `--tracking-wide: 0.08em`
- Five roles: `.body` (ink, normal), `.label` (mute, uppercase, tracked), `.caption` (ink, uppercase, tracked), `.bold` (ink, 700), `.boldcap` (ink, 700, uppercase, wide-tracked)
- Projection row pattern: `<bold>name</> · <label>type</> · <bold>req</> · <body muted>description</>`
- VLM confirmed: "cards are scannable at a glance", "token rows read quickly", "borderless design feels clean"
