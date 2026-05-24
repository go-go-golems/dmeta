---
Title: Diary
Ticket: DMETA-CLIM-MDS
Status: active
Topics:
    - dmeta
    - design-system
    - compiler-ir
    - metadesignsystem
    - react
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/design-doc/01-clim-presentation-metadesignsystem-architecture-and-first-pass-implementation-guide.md
      Note: Design guide that the task plan implements
    - Path: ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/sources/local/01-aitr-794.md
      Note: Primary source thesis for CLIM/presentation-system analysis
    - Path: ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/tasks.md
      Note: Phased implementation and Street Deli dogfooding task plan
ExternalSources: []
Summary: Chronological implementation and research diary for the CLIM/presentation-based MetaDesignSystem ticket.
LastUpdated: 2026-05-24T16:30:06.156039781-04:00
WhatFor: Record the source import, thesis analysis, design interpretation, and future implementation work for the CLIM MetaDesignSystem ticket.
WhenToUse: Read before resuming CLIM MetaDesignSystem research or implementation.
---



# Diary

## Goal

Capture the research and implementation trail for designing a CLIM/presentation-based MetaDesignSystem and understanding how it should relate to DMETA's semantic, interaction, Web, and React target layers.

## Step 1: Import the original thesis and extract the architectural lessons

This step created the new ticket, imported the original presentation-systems thesis, and read it closely enough to identify which parts are directly relevant to the DMETA compiler architecture. The key result is that the thesis strongly supports making actions and object types first-class objects, but it also suggests a stricter separation between domain objects, presented objects, commands, presentation styles, presenters, recognizers, and target renderers than the user's first shorthand formulation might imply.

The imported thesis is not simply "about direct manipulation." Its more durable contribution is a process architecture: a user interface is a system of data bases and translators. Presentations are structured objects. Commands can be stored as data. Presenter and recognizer state can themselves be presented. This aligns well with a CLIM-like MetaDesignSystem for DMETA because it gives us a disciplined place to put presentation types, command objects, type descriptions, presenter controls, command planning, and multiple interface styles over the same semantic base.

### Prompt Context

**User prompt (verbatim):** "Now let's create a new ticket to now design out a proper CLIM/presentation based UI setup. Import the /tmp/aitr-794.md document (the original thesis) into the ticket with `docmgr import file --file ... --ticket ...` and read it carefully.

We want a couple of things in our CLIM metadesignsystem:

- actions are also objects in our end design system: they can be introspected, they can be menipulated, they can expose documentation and metadata.
- object types are as well (so that we can get information about the objects underlying presentations).

we also have a final pass that compiles to react:
- actions become objects and rtk-query actions
- presentations become react widgets
- presenters are things that transform parts of a redux slice through to props / variables in useXXX


Analyze the  book in detail, then see if that makes sense, and reformulate in your own words concisely, before we go mmuch further."

**Assistant interpretation:** Create a new research ticket, import the original presentation-system thesis, read it as a primary source, and use it to assess whether the proposed CLIM MetaDesignSystem direction is conceptually sound.

**Inferred user intent:** Ground the next DMETA architecture phase in a serious presentation-systems model rather than in ad hoc Web/React assumptions.

**Commit (code):** N/A

### What I did
- Created ticket `DMETA-CLIM-MDS`.
- Imported `/tmp/aitr-794.md` into the ticket sources.
- Created the diary document for the new ticket.
- Read the thesis in multiple large sections, with emphasis on:
  - the primitive presentation system model;
  - the presenter/recognizer split;
  - command databases;
  - interfaces to presenter and recognizer state;
  - style descriptions and style-driven presenters;
  - command objects, parameter descriptions, and execution state;
  - multiple attached presentation systems over the same application data base.

### Why
- The CLIM MetaDesignSystem should not be designed from Web-first assumptions.
- The thesis offers a general architecture for presentation systems that is closer to CLIM than to modern component-first frontend practice.
- A careful reading helps separate reusable structure from thesis-era implementation details.

### What worked
- The thesis clearly supports treating commands as first-class data objects.
- The thesis clearly supports treating types/class descriptions as first-class objects in the same overall network.
- The thesis clearly supports presenting the state of presenter/recognizer/editor subsystems, not just application data.
- The thesis supports multiple concurrent presentation systems over the same domain base and explicit command-planning layers.

### What didn't work
- The user's initial shorthand "actions become objects and RTK Query actions" is only partly correct. The thesis supports actions-as-objects very strongly, but it does not support collapsing all actions into one React/RTKQ runtime form. Some actions are domain commands, some are presenter controls, some are recognizer/editor commands, and some may be planning objects.

### What I learned
- The thesis distinguishes three concerns very carefully:
  - the application data base;
  - the presentation data base;
  - the translators between them.
- Commands are not just callbacks; they are describable, inspectable, type-checked objects.
- Presenters are not just view functions. They include:
  - domain collection;
  - semantic presentation;
  - organizational layout.
- Recognizers are not just event handlers. They parse presentation structure and user edits into domain commands.
- A presentation system can include interfaces to its own presenter and recognizer state. That is directly relevant for a CLIM MetaDesignSystem.

### What was tricky to build
- The source document is long and partially repetitive because of scanning/OCR artifacts. It requires careful reading to distinguish core model ideas from duplicated text and incidental examples.
- Some thesis terminology is broader than current DMETA vocabulary. For example, "presentation" in the thesis includes structured visible objects, presentation properties, inter-presentation relations, and command presentations. Mapping that into DMETA requires care so that Interaction IR, CLIM MetaDesignSystem IR, and React target IR do not collapse back together.

### What warrants a second pair of eyes
- Review whether a future CLIM MetaDesignSystem should treat presenter controls and recognizer controls as explicit object catalogs, parallel to actions and presentation types.
- Review whether React should compile from CLIM concepts directly, or from a more general interaction layer that both CLIM and Web can share.

### What should be done in the future
- Write a concise design note that reformulates the thesis in DMETA terms.
- Define the minimal CLIM MetaDesignSystem IR vocabulary:
  - presentation types;
  - action/command objects;
  - object type descriptions;
  - presenter descriptions;
  - recognizer/translators;
  - command tables / planning layers;
  - interfaces to presenter/recognizer state.
- Decide which parts belong in universal Interaction IR and which belong only in the CLIM MetaDesignSystem.

### Code review instructions
- Start with the imported source:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/sources/local/01-aitr-794.md`
- Then review the current DMETA compiler articles and implementation if needed.

### Technical details
- Ticket path:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/`
- Imported source path:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/sources/local/01-aitr-794.md`

## Step 2: Analyze the Readwise Viewer CLIM frontend as a first-pass implementation reference

This step analyzed the Readwise Viewer CLIM frontend under `/home/manuel/code/wesen/2026-05-21--readwise-viewer` to see which existing implementation patterns are worth carrying into the first DMETA CLIM/PBUI pass. The main result is that the repo already demonstrates a useful simplified shape: typed presentation references, actions-as-presentations, a command parser, a small interaction-state machine, and target-specific rendering concerns separated from action execution.

It also shows what not to over-formalize too early. The system works without a full standalone presenter IR, standalone recognizer IR, or explicit presentation-database persistence. That is a strong argument for a smaller first pass in DMETA: author presentation types and lowering rules, derive object and action descriptors from Semantic/Interaction IR, and compile presenter/recognizer behavior into React target artifacts rather than introducing every conceptual layer as a separate authored schema.

### Prompt Context

**User prompt (verbatim):** "~/code/wesen/2026-05-21--readwise-viewer -- Analyze the CLIM / react setup in here, which could inform our first pass as well"

**Assistant interpretation:** Inspect the existing CLIM-ish frontend architecture in Readwise Viewer and extract lessons that should shape the first-pass DMETA CLIM MetaDesignSystem design.

**Inferred user intent:** Ground the DMETA CLIM first pass in a working implementation that already balances typed presentations, action objects, state machines, and frontend target concerns.

**Commit (code):** N/A

### What I did
- Read the existing architecture review doc in the repo's `ttmp/.../RWCLIM-001...` workspace.
- Read the current frontend files:
  - `pkg/web/clim/types.ts`
  - `pkg/web/clim/store.ts`
  - `pkg/web/clim/commands.ts`
  - `pkg/web/clim/actions.ts`
  - `pkg/web/clim/render.ts`
  - `pkg/web/clim/app.ts`
- Read backend presentation-wrapper code:
  - `pkg/readwiseviewer/api.go`

### Why
- The repo already explores the design direction of actions-as-presentations and a presentation-oriented interaction model.
- A real implementation is a better guide for first-pass simplification than trying to implement the whole thesis architecture literally.

### What worked
- The backend/frontend boundary is clean and highly relevant: the Go API returns `PresentationRef` wrappers for every meaningful object.
- `ActionPresentation extends PresentationRef` is a strong proof that actions can be modeled as first-class presentable/selectable objects.
- The command parser is already factored into a pure module (`commands.ts`), which is a good pattern for a target-compiled recognizer/parser layer.
- The interaction state machine is present as a discriminated union (`normal/select/confirm`), which is a good small first-pass state model.
- Rendering and action execution are at least conceptually separate: `render.ts` maps state to UI, `actions.ts` maps commands and actions to effects, and `app.ts` wires delegated input events.

### What didn't work
- The frontend is not actually React. It uses Redux plus manual DOM rendering, so it is best treated as a CLIM/PBUI prototype, not as a finished React target architecture.
- Some action rendering still leaks through stringly HTML paths such as hint-bar spans, which shows why DMETA should make action presentations explicit in the IR.
- Type descriptors are not yet first-class objects; types are mostly strings such as `domainType` and `presentationType`.

### What I learned
- The most valuable first-pass ideas already present in the repo are:
  - `PresentationRef` as the common selected/rendered object shape;
  - `ActionPresentation` as a specialized presentation object;
  - pure command parsing;
  - a small interaction-state machine;
  - one store holding both domain-view state and interaction/session state;
  - target-specific rendering/adapters rather than universal runtime presenter objects.
- The repo supports the idea that Redux slices can act as the "databases" of the thesis, but it also suggests that not everything has to be persistent slice state. Some of the presentation database should remain derived.
- For a React target, what this repo currently calls renderers would become selectors/hooks/components instead of string-building functions.

### What was tricky to build
- The repo mixes three layers in one frontend package: presentation references, action execution, and browser rendering. That is fine for the app, but while analyzing it, one has to separate the CLIM model from the concrete implementation shortcuts.
- The architecture review doc in the repo is already doing some of the same conceptual work we want in DMETA, so it is easy to accidentally restate that document instead of extracting the reusable structural lessons.

### What warrants a second pair of eyes
- Review whether the first DMETA CLIM pass should adopt the Readwise Viewer `ActionPresentation` shape nearly directly.
- Review whether the DMETA React target should compile to a single session slice plus a few domain slices, rather than many small presentation-specific slices.
- Review how much of `commands.ts` should become universal CLIM/PBUI command parsing shape versus React-target-only parsing utilities.

### What should be done in the future
- Write a short design note that uses Readwise Viewer as evidence for a minimal first-pass DMETA CLIM schema.
- Propose a compact PBUI IR with authored presentation types and derived type/action descriptors.
- Sketch how `PresentationRef`, `ActionPresentation`, selectors, and event adapters would be generated by a DMETA React target.

### Code review instructions
- Read:
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/types.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/store.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/actions.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/render.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/app.ts`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/readwiseviewer/api.go`

### Technical details
- The strongest current pattern in the repo is:
  - backend emits `PresentationRef`
  - frontend derives compatible actions from selected presentations
  - actions can themselves be rendered as `ActionPresentation`
  - command parsing is pure
  - interaction state is explicit
  - rendering is a target concern

## Step 3: Write the intern-facing CLIM MetaDesignSystem guide and prepare reMarkable delivery

This step turned the source analysis into the main ticket deliverable: a long-form architecture and implementation guide for an intern. The guide is intentionally technical and prose-first. It explains the current DMETA compiler baseline, the parts of the thesis that matter, the lessons from the Readwise Viewer CLIM frontend, the proposed first-pass IR shape, the proposed React target shape, and the implementation sequence.

The most important design outcome of the writing process is a sharpened first-pass recommendation: we should not start by authoring every CLIM concept as its own schema family. Instead, we should author presentation types and lowering rules in the new PBUI MetaDesignSystem, derive type descriptors from Semantic IR, derive action descriptors from Interaction IR, and compile presenter/recognizer behavior into React target artifacts such as selectors, hooks, event adapters, widgets, and metadata sidecars.

### Prompt Context

**User prompt (verbatim):** "Alright, Create  a detailed analysis / design / implementation guide that is for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file references. It should be very clear and technical. Store in the ticket and the nupload to remarkable.


Keep a diary as you work."

**Assistant interpretation:** Write the main ticket design document as an intern-facing technical guide, update ticket bookkeeping, keep the diary current, and upload the resulting document bundle to reMarkable.

**Inferred user intent:** Produce durable, implementation-ready documentation before any CLIM MetaDesignSystem schema work begins.

**Commit (code):** N/A

### What I did
- Created the primary design doc:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/design-doc/01-clim-presentation-metadesignsystem-architecture-and-first-pass-implementation-guide.md`
- Wrote sections covering:
  - the current DMETA compiler baseline;
  - the thesis model in DMETA terms;
  - the Readwise Viewer CLIM frontend as a first-pass reference;
  - the simplified first-pass PBUI/CLIM architecture;
  - the proposed PBUI IR file set;
  - the proposed React target/runtime shape;
  - implementation phases;
  - testing and open questions.
- Included:
  - prose paragraphs;
  - bullet lists;
  - pseudocode;
  - Mermaid diagrams;
  - file references;
  - API shape sketches.

### Why
- The next implementation phase is architectural, not just incremental coding.
- A new intern needs a single source that explains both the theory and the practical first pass.
- The guide should make the first-pass scope explicit so implementation does not drift into a full thesis reimplementation.

### What worked
- The guide is now stored in the ticket workspace and can act as the source of truth for the CLIM MetaDesignSystem v1.
- The document clearly separates:
  - what belongs in current Semantic IR;
  - what belongs in current Interaction IR;
  - what belongs in the new PBUI MetaDesignSystem;
  - what belongs only in the React target.
- The document incorporates concrete lessons from the imported thesis and the Readwise Viewer code rather than discussing CLIM in the abstract.

### What didn't work
- N/A. The document writing phase did not hit technical blockers.

### What I learned
- The writing process clarified that the most defensible first-pass authored PBUI files are:
  - `meta-design-system.yaml`
  - `presentation-types.yaml`
  - `lowering-rules.yaml`
  - `targets/react.yaml`
- It also clarified that `PresentationRef` and `ActionPresentation` are likely the best first runtime object shapes to aim for.

### What was tricky to build
- The main difficulty was balancing thesis fidelity against implementation simplicity. The thesis supports a richer model than we should implement in v1, so the guide needed to explain not only what the full model contains but why some parts are intentionally deferred.
- Another difficulty was writing for an intern without flattening the architecture into vague advice. The guide had to remain concrete enough that someone could begin creating schemas and Go packages from it.

### What warrants a second pair of eyes
- Review whether the proposed PBUI file split is the right minimum authored surface.
- Review whether command sets should remain deferred or should be first-pass authored objects.
- Review whether the React target package should stay under `pkg/dmeta/generator/react` or eventually move under a more explicit PBUI target path.

### What should be done in the future
- Upload the document bundle to reMarkable.
- Potentially add a short follow-on doc with even more concrete YAML schema skeletons and Go struct definitions.
- Once the guide is reviewed, begin Phase 1 implementation of the PBUI package and validator.

### Code review instructions
- Start with:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/design-doc/01-clim-presentation-metadesignsystem-architecture-and-first-pass-implementation-guide.md`
- Then compare claims against:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/sources/local/01-aitr-794.md`
  - `/home/manuel/code/wesen/2026-05-21--readwise-viewer/pkg/web/clim/types.ts`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/interaction/model.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/metadesign/web/model.go`
  - `/home/manuel/code/wesen/go-go-golems/dmeta/pkg/dmeta/generator/react/model.go`

### Technical details
- The design guide uses the current date's ticket path and is intended to be bundled with the diary for delivery.

## Step 4: Convert the CLIM/PBUI guide into implementation phases and Street Deli dogfooding tasks

This step converted the design guide into a concrete phased task plan. The plan now makes the implementation path explicit: first add a minimal PBUI MetaDesignSystem package and validator, then lower Interaction IR obligations into PBUI presentation obligations, then derive object/action descriptors, then plan and render a React target, and finally dogfood the work against Street Deli.

The Street Deli dogfooding phase is important because it keeps the PBUI design honest. A PBUI/CLIM MetaDesignSystem that only validates schemas but cannot regenerate or rebuild a concrete ordering UI would not prove much. The task plan now explicitly requires a separate Street Deli PBUI/CLIM output path, rescaffolding, rebuild validation, comparison against the promoted Street Deli React implementation, and follow-up gaps captured as schema/design-system tasks rather than target-layer hacks.

### Prompt Context

**User prompt (verbatim):** "Let's create tasks and phases to implement @DMETA-CLIM-MDS  . Then work on them one by one, keeping a detailed diary as you work, commititng at appropriate intervals. Further more, don't skimp on natural language documentation/explanation/intent fields in the different IRs, to flesh out the otherwise terse formal data."

**Assistant interpretation:** Create a phased implementation plan for the CLIM/PBUI MetaDesignSystem, then start working through it with diary entries and commits. Keep IR catalogs richly documented with intent and explanation fields.

**Inferred user intent:** Move from research/design into incremental implementation while preserving human-readable architecture documentation inside both ticket docs and machine-readable IR files.

**User prompt (verbatim, addendum):** "also add tasks to port the deli CLIM implementation to use the new design system, and regenerate / rescaffold / rebuild it basically, in order to test our new system.

Then continue"

**Assistant interpretation:** Add an explicit Street Deli end-to-end dogfooding phase before continuing implementation.

**Inferred user intent:** Ensure the new PBUI/CLIM system is tested through a real concrete app path, not only through isolated catalog validation.

**Commit (code):** N/A

### What I did
- Replaced the placeholder ticket task list with a full phased plan in:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/tasks.md`
- Added phases for:
  - ticket planning and source evidence;
  - minimal PBUI MetaDesignSystem package and validator;
  - PBUI lowering;
  - descriptor derivation;
  - PBUI React target planning;
  - PBUI React target rendering;
  - golden tests;
  - Street Deli PBUI/CLIM dogfooding;
  - documentation and reMarkable refresh.
- Added a dedicated Street Deli phase that requires regeneration/rescaffolding/rebuilding through the new PBUI path.

### Why
- The CLIM/PBUI implementation has enough moving parts that a phased plan is necessary to avoid collapsing the layers back together.
- The user explicitly requested tasks, phases, diary entries, commits, and rich natural-language IR fields.
- Street Deli is the best existing fixture for proving that the new design system can drive real output.

### What worked
- The task plan now directly encodes the architecture from the design guide.
- The dogfooding phase gives the implementation a concrete end-to-end success criterion.
- The plan explicitly says to keep rich `summary`, `long_summary`, `intent`, `description`, `notes`, and rationale-style fields in PBUI YAML.

### What didn't work
- N/A. This was planning and documentation work; no implementation failures occurred in this step.

### What I learned
- The Street Deli dogfooding phase should be treated as part of the design-system implementation, not as a later optional demo. It is the concrete test that will expose missing presenter, recognizer, and target-planning concepts.

### What was tricky to build
- The task plan needed to be implementation-oriented without pretending the exact final CLI names already exist. I used validation gates that name likely commands where the architecture is clear and left implementation-specific choices to the phase that creates those commands.

### What warrants a second pair of eyes
- Review the Street Deli PBUI output location before generating files. The output should stay separate from both `generated/react/` and the promoted `www/mobile-react/` app unless we intentionally create a new runnable experiment.
- Review whether PBUI target planning should extend the existing React generator package or get its own target subpackage.

### What should be done in the future
- Begin Phase 1 by authoring the PBUI MetaDesignSystem YAML package and Go loader/validator.
- Commit the planning docs before mixing them with code changes.

### Code review instructions
- Review the task plan first:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/tasks.md`
- Then review the guide that motivates it:
  - `/home/manuel/code/wesen/go-go-golems/dmeta/ttmp/2026/05/24/DMETA-CLIM-MDS--design-clim-presentation-metadesignsystem-and-react-target-lowering/design-doc/01-clim-presentation-metadesignsystem-architecture-and-first-pass-implementation-guide.md`

### Technical details
- No Go code changed in this step.
- The next step should be a focused implementation commit for PBUI source YAML plus loader/validator code.
