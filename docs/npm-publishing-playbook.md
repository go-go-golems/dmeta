# npm publishing playbook for `@go-go-golems/pbui`

This repository publishes `@go-go-golems/pbui` from GitHub Actions using npm Trusted Publishing. The publish workflow does not read an npm token from Vault and should not be given a `NODE_AUTH_TOKEN` secret.

## Current package

- Package: `@go-go-golems/pbui`
- Package directory: `packages/pbui`
- Workflow: `.github/workflows/publish-pbui.yml`
- GitHub environment: `npm-production`
- npm workflow identity:
  - repository: `go-go-golems/dmeta`
  - workflow file: `.github/workflows/publish-pbui.yml`
  - branch: `main`

## Bootstrap requirement

npm Trusted Publishing can only be configured for a package after the package exists on npm. If `@go-go-golems/pbui` has not been published yet, do the initial `0.1.0` publish manually with an interactive npm session, then add the trusted publisher in npm package settings.

After that, keep the CI workflow tokenless and publish from GitHub Actions only.

## npm package settings

In the npm web UI for `@go-go-golems/pbui`:

1. Add a trusted publisher for GitHub Actions.
2. Use owner `go-go-golems` and repository `dmeta`.
3. Use workflow `.github/workflows/publish-pbui.yml`.
4. Use branch `main`.
5. Enable package token lockdown / disallow granular access tokens after a successful trusted publish.

## Publish dry run

Use this before a real publish or after workflow edits:

1. Open **Actions → publish-pbui → Run workflow**.
2. Set `dry_run=true`.
3. Pick the intended `npm_tag`.
4. Keep `skip_existing=true`.
5. Run on `main`.

The dry run should install dependencies, typecheck, run the pack smoke test, and execute `npm publish --dry-run --provenance` without reading Vault.

## Real publish

Use `next` for proof publishes and release candidates:

1. Open **Actions → publish-pbui → Run workflow**.
2. Set `dry_run=false`.
3. Set `npm_tag=next`.
4. Keep `skip_existing=true`.
5. Leave `confirm_latest_publish` empty.
6. Run on `main`.

Use `latest` only for a deliberate release:

1. Set `dry_run=false`.
2. Set `npm_tag=latest`.
3. Set `confirm_latest_publish=CONFIRM_LATEST`.
4. Run on `main`.

## Validation commands

```bash
npm view @go-go-golems/pbui version dist-tags --json
npm view @go-go-golems/pbui@<version> dist.integrity --json
```

The GitHub Actions run should show an npm provenance statement for real publishes.

## Vault cleanup

Once a real trusted publish has succeeded and token lockdown is enabled, remove the obsolete Vault material:

```bash
vault kv metadata delete kv/ci/github/dmeta/npm-token
vault delete auth/github-actions/role/dmeta-npm-publish
vault policy delete gha-dmeta-npm-publish
```

Do not remove unrelated dmeta Vault material such as the GitOps PR token unless that workflow has also been migrated.
