# Changelog

## 2026-05-20

- Initial workspace created


## 2026-05-20

Created production deployment ticket, initial design plan, rollout checklist, task list, and diary for dmeta-examples.yolo.scapegoat.dev.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/design-doc/01-production-deployment-plan.md — Initial deployment plan
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/index.md — Ticket overview
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/playbook/01-rollout-checklist.md — Rollout checklist
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/reference/01-diary.md — Diary


## 2026-05-20

Recorded Step 1 commit hash for initial production rollout planning docs (commit 497058a50033bdb9135622c5b552eb5967350059).

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/changelog.md — Changelog entry with Step 1 commit
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/reference/01-diary.md — Step 1 commit hash


## 2026-05-20

Added static examples image packaging and GHCR workflow for the DMETA street deli mobile/CLIM site.

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/.github/workflows/publish-examples-static.yaml — Publishes ghcr.io/go-go-golems/dmeta-examples-static tags
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/Dockerfile.examples-static — Builds /site artifact image
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/tasks.md — Marked inventory


## 2026-05-20

Recorded packaging commit hash for the static examples image (commit 8d47cc723f9d7a787f1e9ca32044378675f9d92a).

### Related Files

- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/changelog.md — Changelog entry with Step 2 commit
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/reference/01-diary.md — Step 2 commit hash


## 2026-05-20

Added K3s GitOps manifests for dmeta-examples.yolo.scapegoat.dev (commit 0c381e099b8fa9b6640c579ffcfac1c911aaf0a7 in hetzner-k3s).

### Related Files

- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/applications/dmeta-examples.yaml — Argo CD Application
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/ingress.yaml — Public Ingress
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml — Static-site publisher Job


## 2026-05-20

Switched examples publishing to infra-tooling reusable workflow with Vault OIDC GitOps PR configuration; opened source PR #1 and K3s PR #87. Latest branch workflow published sha-3697432, but anonymous GHCR pull still fails because the package is private.

### Related Files

- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml — Initial GitOps publisher job in PR #87
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/vault/policies/github-actions/dmeta-gitops-pr.hcl — Vault policy for dmeta GitOps PR token
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/vault/roles/github-actions/dmeta-gitops-pr.json — Vault JWT role bound to go-go-golems/dmeta main push
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/.github/workflows/publish-examples-static.yaml — Reusable GHCR publish workflow with future GitOps PR automation
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/deploy/gitops-targets.json — GitOps target config for infra-tooling


## 2026-05-20

Matched the retro-obsidian-publish private GHCR pattern for dmeta-examples: added VaultStaticSecret image-pull wiring, Kubernetes Vault role/policy, and seeded kv/apps/dmeta-examples/prod/image-pull; pushed K3s PR update commit 4475da7.

### Related Files

- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml — Publisher Job uses serviceAccountName and imagePullSecrets
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/serviceaccount.yaml — ServiceAccount references VSO-created GHCR pull secret
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/vault-static-secret-image-pull.yaml — Creates kubernetes.io/dockerconfigjson from Vault
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/vault/policies/kubernetes/dmeta-examples.hcl — Kubernetes Vault policy for image-pull secret
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/vault/roles/kubernetes/dmeta-examples.json — Kubernetes Vault role bound to static-sites/dmeta-examples


## 2026-05-20

Completed production rollout: merged source PR #1, merged K3s PRs #87/#88/#89, bootstrapped Argo CD Application, verified dmeta-examples is Synced/Healthy, and smoke-tested root/mobile/CLIM URLs with HTTP 200.

### Related Files

- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/applications/dmeta-examples.yaml — Bootstrapped Argo CD Application
- /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/publish-job.yaml — Final publisher Job synced as sha-a291e27
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/.github/workflows/publish-examples-static.yaml — Source workflow merged and published main image sha-a291e27
- /home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/ttmp/2026/05/20/DMETA-EXAMPLES-PROD-001--deploy-dmeta-street-deli-prototypes-to-production/tasks.md — All rollout tasks checked

