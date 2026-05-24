# Diary

## Goal

Capture the step-by-step narrative of migrating the Hudson Street Deli mobile ordering prototype from static HTML/CSS/JS to React, using DMETA reflection-first widget scaffolds as semantic guides.

## Step 1: Read playbooks, design docs, and ticket guide; create docmgr ticket and write system guide

Before writing any code, I read all the referenced documentation to build a thorough understanding of the system. Then I created a docmgr ticket and wrote an exhaustive intern-ready implementation guide.

### Prompt Context

**User prompt (verbatim):** "Read these playbooks/docs first: playbooks/02-dmeta-design-system-factory-runthrough-playbook.md, playbooks/01-collaborative-schema-design-sessions-for-presentation-based-ui.md, design-docs/07-generated-instance-widget-review-guide.md, and the ticket guide ttmp/2026/05/23/DMETA-WIDGET-REFLECTIVE-SCAFFOLDS--reflection-first-widget-scaffolds/design-doc/01-reflection-first-widget-scaffold-implementation-guide.md. Then migrate examples/street-deli-ordering/www/mobile to React by treating the static prototype as the UX reference and examples/street-deli-ordering/generated/widgets as semantic scaffolds to promote, not finished components. Use examples/street-deli-ordering/instantiations/street-deli-ordering.yaml to see the selected widgets, inspect each widget's .metadata.ts and .adapter.todo.ts for semantic context/projection hints, and update/add templates under examples/street-deli-ordering/widget-templates only if the chosen widgets do not fit. Validate with go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table and go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table. Create a new docmgr ticket for it, keep a diary as you work. Commit at appropriate intervals. Before starting: Create a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet points and pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and then upload to remarkable."

**Assistant interpretation:** Read all reference docs, understand the DMETA system, the Street Deli domain, the static prototype, the generated widget scaffolds, and the reflection-first philosophy. Then write an exhaustive intern-ready guide and create a docmgr ticket before beginning the React migration work.

**Inferred user intent:** Have a comprehensive, self-contained technical document that a new team member can read to understand the entire system and start implementing React widgets, without needing to piece together information from dozens of scattered files.

### What I did

- Read all 4 referenced documents (2 playbooks, 1 design-doc, 1 implementation guide)
- Located the dmeta repo at `/home/manuel/code/wesen/go-go-golems/dmeta/`
- Read the entire static prototype: `index.html` (130 lines), `styles.css` (700 lines), `app.js` (1117 lines)
- Read the instance manifest `street-deli-ordering.yaml`
- Read all generated widget scaffolds (metadata, types, adapter TODOs, tsx files)
- Read all widget template YAML files (item-cards, menu-browsing, customization, substitutions, ordering, tracking)
- Read the design-language IR (02-design-language.yaml)
- Read the domain example mapping (core-model/street-deli-ordering.yaml)
- Ran `validate-ir` and `plan-instance` — both pass cleanly with no errors
- Created docmgr ticket `DMETA-REACT-MIGRATION`
- Created design doc `01-street-deli-react-migration-system-guide-and-implementation-plan.md` (65KB)
- Created diary doc
- Related 8 key files to the ticket

### Why

The system guide is the foundation for all subsequent work. Without it, an implementor would need to read ~15 separate files, understand Go codegen, YAML IR schemas, and the reflection-first philosophy before being able to write a single React component. The guide consolidates everything into one document with prose, tables, pseudocode, diagrams, and file references.

### What worked

- All four reference docs were well-structured and cross-referenced, making it straightforward to build a unified picture
- The generated `.metadata.ts` files already contain resolved semantic context, which is very helpful for understanding why each widget was selected
- Both `validate-ir` and `plan-instance` pass cleanly, confirming the IR is in good shape before migration

### What didn't work

- Initially searched for files under the wrong directory (pi-agent-dashboard workspace vs dmeta repo) — resolved by finding the correct path

### What I learned

- The reflection-first philosophy is the key design decision: scaffolds are semantic guides, not rigid component specifications
- The static prototype is extremely detailed and well-structured — it serves as an almost pixel-perfect UX reference
- The substitution engine is the domain's core innovation and maps directly to `role_preserving_substitutable` capability projections
- The design-language IR has hard lint rules (error severity) for touch targets, dietary visibility, allergen warnings, and keyboard focus — these are not optional

### What was tricky to build

- Mapping the 3-level presentation hierarchy (capability → archetype → domain) onto concrete React component props requires judgment: a `composition_card` is an archetype-level presentation, but the widget may choose to show only some of its recommended projections
- The adapter TODO files are intentionally incomplete — they list what to think about but not the final mapping, which requires domain knowledge

### What warrants a second pair of eyes

- Whether the proposed state management (React context + useReducer) is sufficient or whether Zustand would be better for the customizer draft
- Whether the widget prop shapes I proposed in the guide match the prototype's actual rendering behavior closely enough
- Whether the file layout (promoted widgets in `www/mobile-react/src/widgets/`) is the right choice vs working in-place in `generated/widgets/`

### What should be done in the future

- Next: Initialize the Vite + React + TypeScript project
- Then: Extract design tokens from the static CSS
- Then: Port menu data and substitution engine
- Then: Implement widgets from atoms to organisms
- Upload the design guide to reMarkable

### Code review instructions

- Start with the design guide at `ttmp/2026/05/23/DMETA-REACT-MIGRATION.../design/01-street-deli-react-migration-system-guide-and-implementation-plan.md`
- Validate: `go run ./cmd/dmeta validate-ir --root ./examples/street-deli-ordering --include-info --output table` (should show no errors)
- Validate: `go run ./cmd/dmeta plan-instance --instance ./examples/street-deli-ordering/instantiations/street-deli-ordering.yaml --output table` (should show 8 selected, 6 excluded)

### Technical details

- dmeta repo: `/home/manuel/code/wesen/go-go-golems/dmeta/`
- Ticket path: `ttmp/2026/05/23/DMETA-REACT-MIGRATION--migrate-street-deli-mobile-prototype-to-react-using-reflection-first-widget-scaffolds/`
- Design doc: `design/01-street-deli-react-migration-system-guide-and-implementation-plan.md` (65KB, ~1200 lines)
- Related files: 8 key source files related to ticket index
