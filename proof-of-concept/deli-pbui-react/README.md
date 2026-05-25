# Deli PBUI React Proof of Concept

Standalone Vite/React/Tailwind/RTK Query/Storybook proof of concept for the Street Deli PBUI direction.

This package is intentionally hand-authored. It exists to discover the right React target shape before converting the design back into DMETA templates and code generation.

## Structure

- `src/generic/clim/` contains reusable CLIM/PBUI runtime types and generic presentation components.
- `src/domain/deli/` contains Street Deli domain data, action descriptors, view model definitions, and RTK Query fixture API.
- `src/widgets/DeliPbuiWorkbench/widget.tsx` composes the generic and domain layers into one reviewable widget.
- `src/widgets/DeliPbuiWorkbench/widget.stories.tsx` is the Storybook review surface.

## Commands

```bash
npm install
npm run build
npm run build-storybook
```
