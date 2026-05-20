---
Title: Deploy DMETA street deli prototypes to production
Ticket: DMETA-EXAMPLES-PROD-001
Status: active
Topics:
    - dmeta
    - react
    - deployment
    - kubernetes
    - static-sites
DocType: index
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Productionization ticket for publishing the DMETA street deli mobile and CLIM prototypes at dmeta-examples.yolo.scapegoat.dev."
LastUpdated: 2026-05-20T13:55:47.345320895-04:00
WhatFor: "Track packaging, GitOps, bootstrap, validation, and rollout evidence for the public DMETA examples site."
WhenToUse: "Use when continuing the deployment of the street deli prototypes from dmeta/examples into the Hetzner K3s static-sites hosting stack."
---

# Deploy DMETA street deli prototypes to production

## Overview

This ticket tracks the work required to make the two street deli prototypes in `dmeta/examples/street-deli-ordering/` publicly reachable through the Hetzner K3s cluster at:

- `https://dmeta-examples.yolo.scapegoat.dev/`
- `https://dmeta-examples.yolo.scapegoat.dev/mobile/`
- `https://dmeta-examples.yolo.scapegoat.dev/clim/`

The current preferred route is to reuse the existing `static-sites-host` architecture in `/home/manuel/code/wesen/2026-03-27--hetzner-k3s`: publish a static-site image containing the prototype files, add a one-shot publisher Job that writes a release directory into the shared static-sites PVC, and add an Ingress for the new hostname.

## Key Links

- [Production Deployment Plan](./design-doc/01-production-deployment-plan.md)
- [Rollout Checklist](./playbook/01-rollout-checklist.md)
- [Diary](./reference/01-diary.md)
- [Tasks](./tasks.md)
- [Changelog](./changelog.md)

## Source and target surfaces

- Source prototypes: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype/` and `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/prototype-clim/`
- Supporting DMETA package: `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/examples/street-deli-ordering/`
- Target GitOps repo: `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/`
- Existing deployment pattern: `/home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/go-go-os-examples/`

## Status

Current status: **active**. The ticket, task list, initial design plan, rollout checklist, and diary are created. No production manifests or app packaging changes have been made yet.

## Topics

- dmeta
- react
- deployment
- kubernetes
- static-sites
