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

## Review order

1. Start with the instance manifest under `instantiations/`. Confirm the widget should exist in this concrete design system.
2. Read the generated `.metadata.ts` sidecar. Confirm `templateId`, `instanceId`, `variant`, `selectedAs`, `reason`, and `adaptations` match the manifest.
3. Read the `.types.ts` file. Replace placeholder `unknown` aliases only when the concrete domain view models exist.
4. Read the component scaffold. Treat it as a structural placeholder until it has real markup, accessibility behavior, keyboard behavior, and design-language styling.
5. Read the `.stories.tsx` file. Add stories for the selected variant and the instance-specific states, not every possible template state.

## Promotion rule

A promoted widget should have:

- real semantic markup rather than a JSON `<pre>` placeholder;
- props backed by concrete view-model types;
- callbacks that emit typed presentation/action/filter requests;
- Storybook coverage for selected variants and edge states;
- no direct backend calls inside the widget;
- metadata that still records the originating template and instance selection reason.

## Regeneration rule

Do not blindly overwrite promoted widgets. Regeneration is safe for scaffold-stage files. Once a widget is promoted, generator output should become a migration aid rather than an automatic replacement.
