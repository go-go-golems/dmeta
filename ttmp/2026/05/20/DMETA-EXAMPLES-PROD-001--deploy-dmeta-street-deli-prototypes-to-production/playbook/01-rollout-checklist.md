---
Title: Rollout Checklist
Ticket: DMETA-EXAMPLES-PROD-001
Status: active
Topics:
    - dmeta
    - react
    - deployment
    - kubernetes
    - static-sites
DocType: playbook
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: Operator checklist for packaging, GitOps changes, bootstrap, and smoke validation.
LastUpdated: 2026-05-20T13:55:53.142020858-04:00
WhatFor: "Provide the command checklist for rolling dmeta-examples.yolo.scapegoat.dev into production."
WhenToUse: "Use during implementation and release validation for the DMETA examples static site."
---

# Rollout Checklist

## Purpose

This playbook is the operator checklist for deploying the DMETA street deli mobile and CLIM prototypes to `https://dmeta-examples.yolo.scapegoat.dev`.

## Environment Assumptions

- Source workspace: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta`
- GitOps repository: `/home/manuel/code/wesen/2026-03-27--hetzner-k3s`
- Cluster ingress already supports `*.yolo.scapegoat.dev`.
- `static-sites-host` is already deployed in namespace `static-sites`.
- The first Argo CD Application object must be bootstrapped manually with `kubectl apply`.

## Commands

### 1. Inventory the source files

```bash
cd /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta
find examples/street-deli-ordering/prototype examples/street-deli-ordering/prototype-clim -maxdepth 1 -type f -print | sort
```

Expected files include `index.html`, `app.js`, and `styles.css` in both prototype directories.

### 2. Validate links for subpath hosting

Inspect the HTML files before packaging:

```bash
rg -n 'src=|href=|url\(' examples/street-deli-ordering/prototype examples/street-deli-ordering/prototype-clim
```

Relative `app.js` and `styles.css` references are compatible with `/mobile/` and `/clim/`. Absolute `/...` references need to be fixed before deployment.

### 3. Build and publish the static artifact image

Placeholder until packaging exists:

```bash
cd /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta
# build image containing /site
# publish ghcr.io/<owner>/<image>:sha-<commit>
```

Record the exact image tag in the diary before editing GitOps.

### 4. Add GitOps package

Create or update:

```text
/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/kustomization.yaml
/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml
/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/ingress.yaml
/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/applications/dmeta-examples.yaml
```

Use `gitops/kustomize/go-go-os-examples/` as the direct template.

### 5. Render the manifests locally

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
kubectl kustomize gitops/kustomize/dmeta-examples
```

Check that the rendered resources use:

- namespace `static-sites`
- host `dmeta-examples.yolo.scapegoat.dev`
- backend service `static-sites-host`
- pinned immutable image tag

### 6. Bootstrap the Argo CD Application once

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
export KUBECONFIG=$PWD/kubeconfig-91.98.46.169.yaml
kubectl apply -f gitops/applications/dmeta-examples.yaml
kubectl -n argocd annotate application dmeta-examples argocd.argoproj.io/refresh=hard --overwrite
```

### 7. Validate rollout

```bash
kubectl -n argocd get application dmeta-examples
kubectl -n static-sites get job,ingress,pod | rg 'dmeta-examples|static-sites-host'
curl -I https://dmeta-examples.yolo.scapegoat.dev/
curl -I https://dmeta-examples.yolo.scapegoat.dev/mobile/
curl -I https://dmeta-examples.yolo.scapegoat.dev/clim/
```

Then open the pages in a browser and smoke test:

- Mobile prototype menu opens.
- Mobile customizer can remove/substitute an ingredient and add to cart.
- CLIM prototype menu opens.
- CLIM help and cart/tracker flows render.

## Exit Criteria

- `https://dmeta-examples.yolo.scapegoat.dev/` returns HTTP 200 and links to both demos.
- `/mobile/` and `/clim/` return HTTP 200 and load CSS/JS successfully.
- Argo CD reports the `dmeta-examples` application as synced and healthy, or any temporary degraded state is understood and documented.
- Diary contains exact image tag, GitOps commit hash, bootstrap commands, smoke-test output, and screenshots if captured.

## Common Failure Modes

- **404 from Caddy:** publisher Job did not copy into `/srv/sites/dmeta-examples.yolo.scapegoat.dev/current` or the symlink points at a missing release.
- **TLS pending:** cert-manager has not completed issuance for the new Ingress yet.
- **Argo app missing:** `gitops/applications/dmeta-examples.yaml` was committed but never applied to the cluster.
- **CSS/JS missing under subpaths:** HTML or JS used absolute paths that need to become relative or base-aware.
