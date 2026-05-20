# Tasks

## TODO

- [ ] Inventory the mobile and CLIM prototype assets under `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/` and decide the public URL layout.
- [ ] Add production packaging for a static-site image that copies both prototypes into a `/site` directory.
- [ ] Add or adapt CI so the DMETA examples image is published with immutable `sha-<commit>` tags.
- [ ] Add a GitOps Kustomize package under `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/dmeta-examples/` using the existing `static-sites-host` publisher pattern.
- [ ] Add `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/applications/dmeta-examples.yaml` and bootstrap the Argo CD Application once.
- [ ] Validate `https://dmeta-examples.yolo.scapegoat.dev/`, `/mobile/`, and `/clim/` with curl and browser smoke tests.
- [ ] Record rollout evidence, failures, and final URLs in the diary and changelog.
