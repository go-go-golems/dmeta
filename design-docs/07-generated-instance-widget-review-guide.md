---
Title: Generated Instance Widget Review Guide
Status: active
Topics:
    - design-system
    - widget-templates
    - code-generation
    - react
DocType: design-doc
Intent: long-term
Summary: "Short review guide for generated DMETA instance widget scaffolds and promoted widgets."
LastUpdated: 2026-05-20T21:15:00-04:00
WhatFor: "Use when reviewing files produced by dmeta scaffold-instance or deciding whether a scaffold is ready to become a promoted widget implementation."
WhenToUse: "Read before editing generated instance widgets, regenerating scaffolds, or reviewing promotion diffs."
---

# Generated Instance Widget Review Guide

Generated instance widgets are starting points. They are not finished product components. A scaffold proves that an instance manifest can resolve templates, generate typed props, preserve metadata, and create Storybook seed files. Promotion is a separate human step.

The current widget scaffold philosophy is **reflection first**. Archetype and capability inheritance should explain why a template applies, what semantic context matters, and which projections might be useful. It should not automatically force one rigid prop surface or layout. Treat generated semantic context, projection hints, and adapter TODO files as implementation guidance unless a template explicitly opts into strict projection adapter generation.

## Review order

1. Start with the instance manifest under `instantiations/`. Confirm the widget should exist in this concrete design system.
2. Read the generated `.metadata.ts` sidecar. Confirm `templateId`, `instanceId`, `variant`, `selectedAs`, `reason`, and `adaptations` match the manifest. If present, review `semanticContext`, `projectionHints`, and `generation` as scaffold guidance.
3. Read the `.types.ts` file. Replace placeholder `unknown` aliases only when the concrete domain view models exist.
4. Read the component scaffold. Treat it as a structural placeholder until it has real markup, accessibility behavior, keyboard behavior, and design-language styling. Generated doc comments are context for the implementor, not final UX.
5. If present, read `.adapter.todo.ts`. Use it as a checklist for domain-to-widget mapping, then promote or delete it intentionally.
6. Read the `.stories.tsx` file. Add stories for the selected variant and the instance-specific states, not every possible template state.

## Promotion rule

A promoted widget should have:

- real semantic markup rather than a JSON `<pre>` placeholder;
- props backed by concrete view-model types;
- callbacks that emit typed presentation/action/filter requests;
- Storybook coverage for selected variants and edge states;
- no direct backend calls inside the widget;
- metadata that still records the originating template and instance selection reason;
- semantic context preserved where useful for debugging/review, but not at the cost of a cramped or rigid UI.

## Reflection-first review questions

Ask these before promotion:

- Does the scaffold use archetype/capability context as guidance rather than a mandatory layout recipe?
- Are required projection hints genuinely required for this widget, or merely recommended/optional?
- Does any adapter TODO encode a real domain decision that should be made by the implementor?
- Would strict projection adapter mode make this widget safer, or would it overconstrain the design?
- Are human annotations from the semantic model still visible enough for reviewers and LLM-assisted maintenance?

## Regeneration rule

Do not blindly overwrite promoted widgets. Regeneration is safe for scaffold-stage files. Once a widget is promoted, generator output should become a migration aid rather than an automatic replacement.
