---
Title: Production Deployment Plan
Ticket: DMETA-EXAMPLES-PROD-001
Status: active
Topics:
    - dmeta
    - react
    - deployment
    - kubernetes
    - static-sites
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/docs/app-packaging-and-gitops-pr-standard.md
      Note: Cluster packaging and GitOps release standard informing the plan
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/docs/public-repo-ghcr-argocd-deployment-playbook.md
      Note: GHCR and Argo CD deployment reference informing the plan
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/go-go-os-examples/ingress.yaml
      Note: Template for Traefik/cert-manager static-site Ingress
    - Path: ../../../../../../../../../../code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/go-go-os-examples/publish-job.yaml
      Note: Template for static-sites publisher Job
    - Path: examples/street-deli-ordering/prototype-clim/app.js
      Note: CLIM prototype runtime planned for static artifact packaging
    - Path: examples/street-deli-ordering/prototype-clim/index.html
      Note: CLIM prototype entrypoint planned for /clim/ production subpath
    - Path: examples/street-deli-ordering/prototype/app.js
      Note: Mobile prototype runtime planned for static artifact packaging
    - Path: examples/street-deli-ordering/prototype/index.html
      Note: Mobile prototype entrypoint planned for /mobile/ production subpath
ExternalSources: []
Summary: Architecture and rollout plan for serving mobile and CLIM prototypes at dmeta-examples.yolo.scapegoat.dev.
LastUpdated: 2026-05-20T13:55:53.093282335-04:00
WhatFor: Design the least-surprise production path for static DMETA example prototypes on the existing K3s static-sites hosting stack.
WhenToUse: Use before changing packaging or GitOps manifests for the dmeta-examples production rollout.
---


# Production Deployment Plan

## Executive Summary

Publish the street deli mobile and CLIM prototypes as a small static site at `dmeta-examples.yolo.scapegoat.dev`. The recommended first production path is not a new long-running app: it is a static artifact release, using the existing K3s `static-sites-host` Caddy service and the already-proven `go-go-os-examples` publisher Job pattern.

The source repository should produce a static-site image containing both prototype directories. The GitOps repo should pin an immutable image tag in a publisher Job, copy `/site` into `/srv/sites/dmeta-examples.yolo.scapegoat.dev/releases/<release>`, atomically repoint `current`, and serve it through a dedicated Ingress.

## Problem Statement

The prototypes currently live as local static files under `dmeta/examples/street-deli-ordering/`:

- `prototype/` — mobile touch ordering prototype.
- `prototype-clim/` — CLIM/command-driven prototype.

They need a public production URL under `dmeta-examples.yolo.scapegoat.dev` without turning a static prototype into an unnecessary backend service. The deployment should remain reviewable in Git, reproducible, and consistent with the existing Hetzner K3s operating model.

## Proposed Solution

### Public URL layout

Use one host and explicit subpaths:

- `/` — landing page explaining the examples and linking to both prototypes.
- `/mobile/` — copied from `dmeta/examples/street-deli-ordering/prototype/`.
- `/clim/` — copied from `dmeta/examples/street-deli-ordering/prototype-clim/`.

This avoids multiple certificates and keeps the public surface easy to remember.

### Packaging

Add a packaging step in the DMETA repository that builds an OCI image with this shape:

```text
/site/
  index.html
  mobile/
    index.html
    app.js
    styles.css
  clim/
    index.html
    app.js
    styles.css
```

The image does not need to run a server. It only needs to contain files for the GitOps publisher Job to copy out.

### GitOps

Add the following to `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/`:

```text
gitops/applications/dmeta-examples.yaml
gitops/kustomize/dmeta-examples/kustomization.yaml
gitops/kustomize/dmeta-examples/ingress.yaml
gitops/kustomize/dmeta-examples/publish-job.yaml
```

The Kustomize package should mirror `gitops/kustomize/go-go-os-examples/`:

- namespace: `static-sites`
- publisher image: immutable DMETA examples static image tag
- host: `dmeta-examples.yolo.scapegoat.dev`
- service backend: existing `static-sites-host` service
- TLS: `letsencrypt-prod` via cert-manager

### Bootstrap

Because this GitOps repo does not auto-materialize every new `gitops/applications/*.yaml` file, the first rollout needs a one-time apply:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
export KUBECONFIG=$PWD/kubeconfig-91.98.46.169.yaml
kubectl apply -f gitops/applications/dmeta-examples.yaml
kubectl -n argocd annotate application dmeta-examples argocd.argoproj.io/refresh=hard --overwrite
```

After that, normal GitOps changes should reconcile through Argo CD.

## Design Decisions

1. **Use the static-sites host instead of a new Deployment.** The prototypes are static HTML/CSS/JS, so a Caddy-backed static host plus publisher Job is simpler and aligns with existing cluster practice.
2. **Use one hostname with subpaths.** This reduces DNS/certificate overhead and makes the demo entrypoint obvious.
3. **Pin immutable image tags in GitOps.** The running release should be reviewable and rollback-friendly.
4. **Keep the source package self-contained.** The production artifact should not depend on workstation paths once built.

## Alternatives Considered

- **Direct ConfigMap content:** rejected because prototype files can grow and are better treated as release artifacts.
- **Dedicated Nginx/Caddy Deployment:** viable but more runtime surface than needed while a shared static host already exists.
- **Manual copy to PVC:** acceptable as an emergency bridge, but not a production workflow because it bypasses GitOps review and reproducibility.
- **Separate hosts for mobile and CLIM:** not needed for the first release; subpaths are enough.

## Implementation Plan

1. Inventory current prototype assets and verify relative links work under `/mobile/` and `/clim/`.
2. Add a generated or checked-in landing page for `/`.
3. Add static packaging to the DMETA repo, likely via a small Dockerfile and optional script that assembles `/site`.
4. Add CI to publish the image to GHCR with `sha-<commit>` tags.
5. Add the K3s GitOps `dmeta-examples` Kustomize package and Argo CD Application.
6. Bootstrap the Argo CD Application once.
7. Smoke test with curl and a browser:
   - `https://dmeta-examples.yolo.scapegoat.dev/`
   - `https://dmeta-examples.yolo.scapegoat.dev/mobile/`
   - `https://dmeta-examples.yolo.scapegoat.dev/clim/`
8. Record screenshots, command output, and rollout status in the diary.

## Open Questions

- What GitHub repository/organization should own the published image name if the local DMETA worktree is not yet mirrored to a public repository?
- Should the landing page be hand-authored or generated from `00-index.yaml` later?
- Should future DMETA examples share this host under more subpaths, or should this ticket stay narrowly scoped to street deli prototypes?

## References

- `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/docs/app-packaging-and-gitops-pr-standard.md`
- `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/docs/public-repo-ghcr-argocd-deployment-playbook.md`
- `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/go-go-os-examples/`
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/`
