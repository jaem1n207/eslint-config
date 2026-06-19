# CI-Only Hardening Design

Date: 2026-06-19
Status: approved design draft for review
Working repository: `jaem1n207/eslint-config`

## 1. Decision Summary

The first improvement after the v0.1 merge is CI-only hardening. The goal is to
move the existing local verification contract into GitHub Actions without
changing runtime behavior, rule defaults, package metadata, release flow, or
published artifacts.

Primary success criterion:

- Every pull request and every push to `main` runs the repository's existing
  `pnpm check` script.
- CI fails when typechecking, linting, tests, or build fails.
- The workflow is small enough that later dogfood and release work can build on
  it without first untangling CI choices.

## 2. Scope

Included:

- Add one GitHub Actions workflow under `.github/workflows/`.
- Run on `pull_request`.
- Run on `push` to `main`.
- Use the package manager declared by `package.json`.
- Install dependencies with the lockfile frozen.
- Run `pnpm check`.

Excluded:

- npm publish.
- package provenance.
- GitHub release creation.
- tag-triggered release jobs.
- Node version matrix.
- package smoke tests with `pnpm pack`.
- dogfood against external projects.
- rule/config behavior changes.

Trade-off:

- This does not prove the package is publish-ready.
- It does prove the current repository cannot merge changes that break the
  existing local quality gate.

## 3. Workflow Shape

The workflow should be named `Check`.

Expected job:

```yaml
name: Check

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7.0.0
      - uses: actions/setup-node@v6.4.0
        with:
          node-version: 24
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
```

This intentionally avoids clever caching in the first workflow. Cache tuning can
be added later if CI time becomes a real cost.

## 4. Verification Contract

The workflow delegates to the existing script in `package.json`:

```sh
pnpm check
```

That script currently runs:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test:run`
- `pnpm build`

CI should not duplicate those commands separately unless there is a clear
diagnostic reason later. Keeping one source of truth prevents local and CI
verification from drifting.

## 5. Failure Handling

Expected failures should be ordinary command failures:

- Dependency resolution or lockfile drift fails during `pnpm install
  --frozen-lockfile`.
- TypeScript errors fail during `pnpm typecheck`.
- ESLint errors fail during `pnpm lint`.
- Test failures fail during `pnpm test:run`.
- Build failures fail during `pnpm build`.

No custom retry, continue-on-error, or warning-only CI behavior should be added.
If CI fails, the failure should block the pull request.

## 6. Future Work

After this CI-only change lands, the next small steps can be evaluated
independently:

- Add package smoke verification with `pnpm pack`.
- Add dogfood reports for one Next.js app and one Node/Bun or library project.
- Tune `naming-convention` and `imports` only from dogfood evidence.
- Add release and npm publish automation once the package metadata is ready.

These are intentionally outside this design so the first post-v0.1 change stays
small and reviewable.
