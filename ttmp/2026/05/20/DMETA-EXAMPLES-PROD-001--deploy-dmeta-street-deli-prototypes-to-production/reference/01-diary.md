---
Title: Diary
Ticket: DMETA-EXAMPLES-PROD-001
Status: active
Topics:
    - dmeta
    - react
    - deployment
    - kubernetes
    - static-sites
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/design-doc/01-production-deployment-plan.md
      Note: Initial deployment architecture plan created in Step 1
    - Path: ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/index.md
      Note: Ticket overview created in Step 1
    - Path: ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/playbook/01-rollout-checklist.md
      Note: Initial rollout checklist created in Step 1
    - Path: ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/tasks.md
      Note: Task list created in Step 1
ExternalSources: []
Summary: Chronological implementation diary for productionizing the street deli prototype deployment.
LastUpdated: 2026-05-20T13:55:52.980617444-04:00
WhatFor: Record decisions, commands, failures, commits, and validation evidence while productionizing dmeta-examples.yolo.scapegoat.dev.
WhenToUse: Read before resuming the ticket, changing deployment manifests, or validating a rollout.
---


# Diary

## Goal

This diary captures the implementation journey for publishing the DMETA street deli mobile and CLIM prototypes from `dmeta/examples/street-deli-ordering/` to the Hetzner K3s production host `dmeta-examples.yolo.scapegoat.dev`.

## Step 1: Create the production deployment ticket and planning docs

I created the ticket workspace and seeded the first set of documents needed to continue the deployment deliberately: a design plan, a rollout checklist, a task list, and this diary. I also inspected the existing K3s static-site deployment pattern so the ticket starts from the cluster's current operating model instead of inventing a new runtime shape.

The main decision captured here is to treat the prototypes as static release artifacts. The initial plan points toward a static-site image plus the existing `static-sites-host` publisher Job pattern, with `/mobile/` and `/clim/` served below one hostname.

### Prompt Context

**User prompt (verbatim):** "Create a docmgr ticket for pushing the clim and mobile prototypes in @dmeta/examples/ to production on ~/code/wesen/2026-03-27--hetzner-k3s/, under dmeta-examples.yolo.scapegoat.dev . Keep a diary, commit at appropriate intervals."

**Assistant interpretation:** Create a docmgr ticket in the DMETA documentation workspace for productionizing the street deli mobile and CLIM prototypes, document the deployment plan and rollout workflow, keep a chronological diary, and commit the documentation work in focused increments.

**Inferred user intent:** The user wants a durable ticket and work trail so the prototype deployment can be continued, reviewed, and eventually rolled out through the existing Hetzner K3s GitOps process.

**Commit (code):** pending — initial docs have not been committed yet at the time this step is first written.

### What I did

- Checked the current workspace and confirmed `/home/manuel/workspaces/2026-05-19/dmeta-dsl` is not itself a Git repository, while `dmeta/` is a Git worktree.
- Inspected `dmeta/examples/street-deli-ordering/prototype/` and `prototype-clim/` to confirm they are static HTML/CSS/JS prototypes.
- Inspected `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/docs/app-packaging-and-gitops-pr-standard.md`, `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/docs/public-repo-ghcr-argocd-deployment-playbook.md`, and `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/go-go-os-examples/` to identify the existing production pattern.
- Added docmgr vocabulary topics for `deployment`, `kubernetes`, and `static-sites`.
- Created ticket `DMETA-EXAMPLES-PROD-001` with docs:
  - `index.md`
  - `tasks.md`
  - `design-doc/01-production-deployment-plan.md`
  - `playbook/01-rollout-checklist.md`
  - `reference/01-diary.md`

### Why

- The deployment touches both the DMETA prototype source tree and a separate K3s GitOps repository, so a ticket is needed to keep decisions, file links, validation commands, and rollout evidence together.
- The static prototypes should not become a bespoke runtime service unless there is a concrete need; the existing `static-sites-host` path is simpler and already established.

### What worked

- `docmgr status --summary-only` found the DMETA doc root at `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp`.
- `docmgr ticket create-ticket` created the ticket workspace successfully.
- `docmgr doc add` created the diary, design plan, and rollout checklist successfully.
- The K3s repo already has a close template in `gitops/kustomize/go-go-os-examples/`.

### What didn't work

- Running `git status --short` from `/home/manuel/workspaces/2026-05-19/dmeta-dsl` failed because that directory is not a Git repository:

```text
fatal: not a git repository (or any of the parent directories): .git
```

The correct Git worktree for this ticket's docs is `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta`.

### What I learned

- The target K3s repository already has a static-sites shared PVC and Caddy host service, so the production design can be mostly a new publisher Job and Ingress.
- New Argo CD Application YAML files in this K3s repo still need a one-time `kubectl apply`; there is no app-of-apps layer that automatically applies every file in `gitops/applications/`.

### What was tricky to build

- The main subtlety was repository boundaries: the current shell directory is not a Git repository, the DMETA docs live in the `dmeta/` worktree, and the production manifests will live in `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/`. I verified each path before writing docs so later commits can be made in the correct repository.
- The second subtlety is that the prototypes are static files but need production-grade release semantics. The existing static-sites publisher pattern solves that by making the release artifact an immutable image and making the cluster copy it into a versioned release directory.

### What warrants a second pair of eyes

- Confirm the final image registry/repository name before implementing CI, especially if the DMETA worktree is not yet backed by a public GitHub repository.
- Confirm whether the public URL layout should be `/mobile/` and `/clim/`, or whether the root should redirect to one of them.

### What should be done in the future

- Implement packaging and CI in the DMETA repo.
- Add the K3s GitOps package and Argo CD Application in the Hetzner K3s repo.
- Bootstrap and smoke test the production URL.

### Code review instructions

- Start with `ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/index.md` for the ticket overview.
- Review `design-doc/01-production-deployment-plan.md` for architecture choices.
- Review `playbook/01-rollout-checklist.md` for operational commands and validation criteria.
- Validate with:

```bash
cd /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta
docmgr doctor --ticket DMETA-EXAMPLES-PROD-001
```

### Technical details

- Existing static-site GitOps pattern: `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/go-go-os-examples/`.
- Source mobile prototype: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype/`.
- Source CLIM prototype: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/`.
