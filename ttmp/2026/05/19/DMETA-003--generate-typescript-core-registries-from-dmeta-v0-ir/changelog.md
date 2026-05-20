# Changelog

## 2026-05-19

- Initial workspace created


## 2026-05-19

Created DMETA-003 ticket, added generator tasks, related source/spec/validator files, and wrote the intern-facing TypeScript core registry generator analysis/design/implementation guide. Implementation intentionally not started pending review.


## 2026-05-19

Uploaded the DMETA-003 intern-facing TypeScript core registry generator guide to reMarkable at /ai/2026/05/19/DMETA-003 as DMETA 003 TypeScript Core Registry Generator Guide.pdf.


## 2026-05-19

Updated the generator guide to reflect the split core-model package structure and re-uploaded the guide to reMarkable. The future generate-core implementation should rely on validator.LoadPackage to merge 01-core-model.yaml plus core-model/*.yaml rather than manually reading a monolithic core model.


## 2026-05-19

Implemented dmeta generate-core as a Glazed command. Added pkg/dmeta/generator/core with deterministic TypeScript renderers, --dry-run/--force writing, smoke/determinism tests, and generated dmeta/generated/dmeta-core/*.ts from the validated split core model. Ran gofmt, go test ./..., validate-ir, generate-core dry-run, and generate-core --force successfully.

