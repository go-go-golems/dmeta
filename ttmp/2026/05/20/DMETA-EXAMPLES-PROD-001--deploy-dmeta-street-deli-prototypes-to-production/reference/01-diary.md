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
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/gitops/applications/dmeta-examples.yaml
      Note: Argo CD Application declaration for dmeta examples
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/ingress.yaml
      Note: Ingress for dmeta-examples.yolo.scapegoat.dev
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/kustomization.yaml
      Note: Kustomize package added in Step 3
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml
      Note: Publisher Job pins dmeta examples static artifact tag
    - Path: .dockerignore
      Note: Docker build context hygiene for examples static image
    - Path: .github/workflows/publish-examples-static.yaml
      Note: GHCR publish workflow for immutable dmeta examples image
    - Path: Dockerfile.examples-static
      Note: Static artifact image packaging added in Step 2
    - Path: examples/street-deli-ordering/www/clim/index.html
      Note: CLIM prototype packaged under /site/clim
    - Path: examples/street-deli-ordering/www/index.html
      Note: Landing page packaged as /site root
    - Path: examples/street-deli-ordering/www/mobile/index.html
      Note: Mobile prototype packaged under /site/mobile
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

**Commit (code):** 497058a50033bdb9135622c5b552eb5967350059 — "Docs: plan DMETA examples production rollout"

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

## Step 2: Package the prototypes as a static artifact image

I found that the street deli example already had a production-shaped `www/` directory with a landing page and both prototypes laid out under `mobile/` and `clim/`. I added a small Alpine-based artifact image that copies that directory to `/site`, plus a GitHub Actions workflow that can publish immutable GHCR tags for the K3s publisher Job to consume.

This step turns the local static prototypes into a reviewable release artifact. It does not deploy the site yet; it creates the artifact contract that GitOps can later pin as `ghcr.io/go-go-golems/dmeta-examples-static:sha-<commit>`.

### Prompt Context

**User prompt (verbatim):** "go ahead"

**Assistant interpretation:** Continue from the ticket planning work and start implementing the deployment path, committing focused increments.

**Inferred user intent:** The user wants me to move beyond documentation into concrete packaging and GitOps changes for production rollout.

**Commit (code):** 8d47cc723f9d7a787f1e9ca32044378675f9d92a — "Package DMETA examples static site"

### What I did

- Inventoried the static assets under `examples/street-deli-ordering/`.
- Confirmed `examples/street-deli-ordering/www/` already contains:
  - `index.html`
  - `mobile/index.html`, `mobile/app.js`, `mobile/styles.css`
  - `clim/index.html`, `clim/app.js`, `clim/styles.css`
  - CLIM Berkeley Mono fonts under `clim/fonts/`
- Confirmed `diff -qr` shows `www/mobile` matches `prototype` and `www/clim` matches `prototype-clim`.
- Added `Dockerfile.examples-static` to package `examples/street-deli-ordering/www/` as `/site` in an Alpine image.
- Added `.dockerignore` to keep the image build context small and avoid docs/worktree noise.
- Added `.github/workflows/publish-examples-static.yaml` to build PRs and publish pushes/workflow-dispatch runs to `ghcr.io/go-go-golems/dmeta-examples-static`.
- Ran a local Docker build and inspected the image contents:

```bash
cd /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta
docker build -f Dockerfile.examples-static -t dmeta-examples-static:test .
docker run --rm dmeta-examples-static:test sh -c 'find /site -maxdepth 3 -type f | sort && echo --- && cat /site-manifest.txt'
```

### Why

- The K3s `static-sites-host` publisher pattern expects an image with static files under `/site` and basic Unix tools available for the copy/symlink command.
- Using Alpine keeps `sh`, `cp`, `find`, and `ln` available inside the image while avoiding a dedicated web server process.
- CI publishing is needed so GitOps can pin immutable release tags instead of depending on local Docker images.

### What worked

- The local image built successfully.
- The `RUN test -f ...` checks in the Dockerfile verified all required entrypoints and assets are present.
- The image contains the expected `/site` tree and `/site-manifest.txt`.
- The existing `www/` directory already provided the exact public URL layout planned in Step 1.

### What didn't work

- N/A for this step. No build failures occurred.

### What I learned

- The source tree had already promoted the prototypes into a deployable `www/` layout, including a root landing page and CLIM fonts.
- The packaging task could therefore stay small: copy the known-good static tree instead of generating or rewriting it.

### What was tricky to build

- The artifact image cannot be `scratch` or a pure static web image if the K3s publisher Job overrides the command and expects shell utilities. Alpine is intentional because it satisfies the publisher contract.
- The image tag in GitOps must be chosen after this commit exists and the image is published; until then, the workflow file defines the tag shape but no remote image is guaranteed to exist.

### What warrants a second pair of eyes

- Confirm that `ghcr.io/go-go-golems/dmeta-examples-static` is the desired package namespace and that package visibility will be public or otherwise pullable by the cluster.
- Confirm whether pushes from `task/dmeta-dsl` should publish, or whether the workflow should publish only from `main` plus manual dispatch.

### What should be done in the future

- Push the packaging commit so GitHub Actions can publish a `sha-<commit>` image tag.
- Use that exact tag in the K3s `publish-job.yaml`.
- If GHCR visibility is private by default, make the package public or wire an imagePullSecret before bootstrapping Argo CD.

### Code review instructions

- Review `Dockerfile.examples-static` first; it defines the `/site` artifact contract consumed by K3s.
- Review `.github/workflows/publish-examples-static.yaml` for image name, trigger policy, tags, and permissions.
- Validate locally with:

```bash
cd /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta
docker build -f Dockerfile.examples-static -t dmeta-examples-static:test .
docker run --rm dmeta-examples-static:test test -f /site/mobile/index.html
docker run --rm dmeta-examples-static:test test -f /site/clim/index.html
```

### Technical details

- Image name: `ghcr.io/go-go-golems/dmeta-examples-static`.
- Required in-image content root: `/site`.
- Expected public paths after publishing through static-sites-host:
  - `/`
  - `/mobile/`
  - `/clim/`

## Step 3: Add the K3s GitOps package for dmeta-examples

I added the production-side manifests in the Hetzner K3s repository, following the existing `go-go-os-examples` static-sites pattern. The new Kustomize package declares a publisher Job that copies the static artifact image into the shared static-sites PVC and an Ingress that serves the host through `static-sites-host`.

The GitOps commit intentionally pins `ghcr.io/go-go-golems/dmeta-examples-static:sha-0f19990`, which corresponds to the current DMETA source HEAD after the packaging and diary commits. The remaining rollout dependency is that this image tag must actually be published to GHCR before Argo syncs the publisher Job.

### Prompt Context

**User prompt (verbatim):** (same as Step 2)

**Assistant interpretation:** Continue implementing the planned production rollout and commit the next focused increment in the GitOps repository.

**Inferred user intent:** The user wants the K3s repository prepared to serve the prototypes under the requested hostname.

**Commit (code):** 0c381e099b8fa9b6640c579ffcfac1c911aaf0a7 — "Deploy DMETA examples static site" in `/home/manuel/code/wesen/2026-03-27--hetzner-k3s`

### What I did

- Added `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/kustomization.yaml`.
- Added `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml`.
- Added `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/ingress.yaml`.
- Added `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/applications/dmeta-examples.yaml`.
- Rendered the package locally with:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
kubectl kustomize gitops/kustomize/dmeta-examples
```

- Committed the GitOps manifests in the K3s repo.

### Why

- The production host must be represented in the GitOps repo so Argo CD can reconcile it.
- Reusing the static-sites package shape keeps this deployment consistent with an existing, working static-site deployment.
- Pinning the image tag in Git makes the rollout reviewable and rollback-friendly.

### What worked

- `kubectl kustomize gitops/kustomize/dmeta-examples` rendered the Job and Ingress successfully.
- The rendered resources use namespace `static-sites`, backend service `static-sites-host`, and host `dmeta-examples.yolo.scapegoat.dev`.
- The K3s commit succeeded as `0c381e099b8fa9b6640c579ffcfac1c911aaf0a7`.

### What didn't work

- I did not bootstrap or sync the Argo CD Application yet, because the pinned GHCR image tag must exist before the publisher Job can succeed.
- I did not validate the live URL yet for the same reason.

### What I learned

- The static-sites pattern is very small for new hosts: a publisher Job, an Ingress, a Kustomization, and a one-time Argo CD Application declaration.
- The main ordering constraint is now external to Kustomize: publish the DMETA image tag, push the K3s commit, then bootstrap/sync.

### What was tricky to build

- The image tag is derived from the DMETA repository, not the K3s repository. I pinned `sha-0f19990` because that is the current DMETA HEAD after packaging docs were committed; if the workflow publishes a different SHA due to a different push strategy, `publish-job.yaml` must be bumped before bootstrap.
- The Argo Application file being present in Git is necessary but insufficient; this repo still requires a one-time `kubectl apply -f gitops/applications/dmeta-examples.yaml` for new Applications.

### What warrants a second pair of eyes

- Verify the pinned `sha-0f19990` tag exists in GHCR before syncing Argo.
- Verify the image package visibility is public or that cluster image pull credentials exist.
- Review whether the publisher Job name should include a longer SHA if multiple rapid releases are expected.

### What should be done in the future

- Push the DMETA branch and confirm the GHCR workflow publishes `sha-0f19990`.
- Push the K3s commit to `origin/main`.
- Bootstrap the Argo CD Application and smoke test the public URL.

### Code review instructions

- Start in the K3s repo at `gitops/kustomize/dmeta-examples/publish-job.yaml` and verify image, release, host, and PVC mount.
- Then review `gitops/kustomize/dmeta-examples/ingress.yaml` for host, TLS secret, ingress class, and backend service.
- Validate locally with:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
kubectl kustomize gitops/kustomize/dmeta-examples
```

### Technical details

- K3s GitOps commit: `0c381e099b8fa9b6640c579ffcfac1c911aaf0a7`.
- Pinned artifact image: `ghcr.io/go-go-golems/dmeta-examples-static:sha-0f19990`.
- Public host: `dmeta-examples.yolo.scapegoat.dev`.
- Static-sites release directory: `/srv/sites/dmeta-examples.yolo.scapegoat.dev/releases/sha-0f19990`.

## Step 4: Move deployment handoff to GitHub PRs and Vault-backed GitOps automation

I changed direction from trying to force a local push to `main` in the K3s repo. The safer path is now Git-based: the DMETA source branch has a PR, the K3s manifests have a separate PR, and the source workflow is wired to use the shared `infra-tooling` reusable workflow with Vault OIDC for future GitOps image-bump PRs.

The remaining blocker is not image publication: the latest branch workflow successfully published `ghcr.io/go-go-golems/dmeta-examples-static:sha-3697432`. The blocker is package visibility. Anonymous pulls from GHCR still return `unauthorized`, so either the package must be made public in GitHub's package settings or the static-sites publisher Job must receive an image pull secret.

### Prompt Context

**User prompt (verbatim):** "so wht is the issue right now? can we trigger the deploy through git instead of trying to do it locally?"

**Assistant interpretation:** Explain the current blocker and switch from local direct deployment/push attempts to the existing GitHub Actions + Vault OIDC + GitOps PR workflow.

**Inferred user intent:** The user wants the rollout to follow the established source-repo-to-GitOps PR model instead of ad hoc local deployment work.

**Commit (code):** 36974327900a976043bb4ac475931cf118c8bec0 — "Fix examples static workflow validation" in `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta`; 9b23f2d — "Bump DMETA examples initial image tag" in `/home/manuel/code/wesen/2026-03-27--hetzner-k3s` PR branch.

### What I did

- Pushed the DMETA source branch `task/dmeta-dsl` to GitHub.
- Observed the initial branch workflow succeeded for the simple local workflow and published a branch image.
- Tried to push local K3s `main` and hit a non-fast-forward rejection because `origin/main` had advanced.
- Started a rebase, hit an unrelated conflict in `gitops/kustomize/retro-obsidian-publish/deployment.yaml`, and aborted the rebase.
- Reworked `.github/workflows/publish-examples-static.yaml` to call `go-go-golems/infra-tooling/.github/workflows/publish-ghcr-image.yml@main`.
- Added `deploy/gitops-targets.json` targeting `gitops/kustomize/dmeta-examples/publish-job.yaml`, container `publish`.
- Added K3s Vault OIDC files for future DMETA main-branch GitOps PR automation:
  - `vault/policies/github-actions/dmeta-gitops-pr.hcl`
  - `vault/roles/github-actions/dmeta-gitops-pr.json`
- Bootstrapped the live Vault GitHub Actions OIDC config with `scripts/bootstrap-vault-github-actions-oidc.sh` after exporting `VAULT_TOKEN`.
- Seeded `kv/ci/github/dmeta/gitops-pr-token` with a GitOps-capable GitHub token.
- Opened source PR: `https://github.com/go-go-golems/dmeta/pull/1`.
- Opened K3s GitOps PR: `https://github.com/wesen/2026-03-27--hetzner-k3s/pull/87`.
- Fixed the reusable workflow validation after it failed on `go test ./...` due to the local `replace github.com/go-go-golems/glazed => ../glazed` directive not existing on the GitHub runner.
- Confirmed workflow run `https://github.com/go-go-golems/dmeta/actions/runs/26181314656` succeeded and published `sha-3697432`.

### Why

- Direct local pushes to the GitOps `main` branch are brittle when remote automation is also writing to `main`.
- The established release contract is source repo publishes an immutable image, source repo opens a GitOps PR, and Argo deploys only after reviewed GitOps changes land.
- Adding the Vault role and policy now makes future `main` pushes from `go-go-golems/dmeta` able to open GitOps PRs without storing a long-lived token in GitHub secrets.

### What worked

- The source branch is pushed and has PR #1.
- The K3s deployment changes are isolated in PR #87 instead of being forced onto local `main`.
- The latest reusable workflow run succeeded on branch `task/dmeta-dsl`.
- The image tag `ghcr.io/go-go-golems/dmeta-examples-static:sha-3697432` exists in GHCR.
- Vault OIDC bootstrap accepted the new `dmeta-gitops-pr` role/policy files.
- The Vault token path `kv/ci/github/dmeta/gitops-pr-token` exists and contains the `token` key.

### What didn't work

- Local direct push to K3s `main` failed:

```text
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:wesen/2026-03-27--hetzner-k3s.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.
```

- Rebasing local K3s `main` onto `origin/main` conflicted in unrelated retro-obsidian-publish work:

```text
CONFLICT (content): Merge conflict in gitops/kustomize/retro-obsidian-publish/deployment.yaml
error: could not apply b49260e... Add --vault-name flag and bump image to sha-c4051c7
```

- The first reusable workflow attempt failed because `go test ./...` cannot run in a clean GitHub clone while `go.mod` has a local replace to `../glazed`:

```text
github.com/go-go-golems/glazed@v0.0.0: replacement directory ../glazed does not exist
```

I fixed that by making the static-site workflow validation check the packaged static files instead of running Go tests.

- Anonymous GHCR pull still fails because the package is private:

```text
Error response from daemon: Head "https://ghcr.io/v2/go-go-golems/dmeta-examples-static/manifests/sha-3697432": unauthorized
```

### What I learned

- Branch publishing works fine for the static artifact image, but the reusable workflow only opens GitOps PRs on `refs/heads/main`, matching the Vault role's bound claims.
- GitHub does not appear to expose a straightforward REST or GraphQL mutation for flipping GHCR package visibility; the documented path is the package settings UI.
- The first deployment still needs the K3s PR to land because the generic image-bump automation can only patch an existing manifest.

### What was tricky to build

- The source repo has local monorepo-style Go replacements, so a generic `go test ./...` release workflow is not safe on GitHub runners. For this static artifact, the correct validation boundary is the `/site` content contract, not the Go module.
- There are two independent Git flows now: DMETA source PR #1 and K3s GitOps PR #87. The first future main merge can publish a new image and create a bump PR, but the initial K3s package must exist first.
- The current image exists but may not be pullable by the cluster until GHCR visibility or imagePullSecrets are addressed.

### What warrants a second pair of eyes

- Decide whether to make `ghcr.io/go-go-golems/dmeta-examples-static` public in GitHub Package settings or add a Vault/VSO-backed image pull secret to the `static-sites` namespace.
- Review whether the source workflow should publish only from `main` after PR #1 merges, or whether branch publishing should remain enabled.
- Review the K3s PR for whether the initial `Application` should be applied manually after merge or whether another bootstrap mechanism should be added.

### What should be done in the future

- Merge `go-go-golems/dmeta` PR #1.
- Merge `wesen/2026-03-27--hetzner-k3s` PR #87 after resolving the image pull strategy.
- If the package is made public, verify anonymous pull succeeds:

```bash
DOCKER_CONFIG=/tmp/empty-docker-config docker pull ghcr.io/go-go-golems/dmeta-examples-static:sha-3697432
```

- Bootstrap the Argo CD Application once after PR #87 lands.

### Code review instructions

- Source PR #1: review `.github/workflows/publish-examples-static.yaml`, `deploy/gitops-targets.json`, and `Dockerfile.examples-static`.
- K3s PR #87: review `gitops/kustomize/dmeta-examples/`, `gitops/applications/dmeta-examples.yaml`, and the new Vault policy/role files.
- Check workflow evidence at `https://github.com/go-go-golems/dmeta/actions/runs/26181314656`.

### Technical details

- Source PR: `https://github.com/go-go-golems/dmeta/pull/1`.
- K3s PR: `https://github.com/wesen/2026-03-27--hetzner-k3s/pull/87`.
- Successful source workflow: `https://github.com/go-go-golems/dmeta/actions/runs/26181314656`.
- Published image: `ghcr.io/go-go-golems/dmeta-examples-static:sha-3697432`.
- Current blocker: package visibility or image pull secret.
