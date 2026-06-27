# Maintainer Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PR label automation and draft release-note automation for `@jaemin/eslint-config` while preserving the existing `pnpm check` CI contract.

**Architecture:** Keep `.github/workflows/check.yml` unchanged as the authoritative quality gate. Add one label-only `pull_request_target` workflow, `.github/labeler.yml`, one Release Drafter workflow, and `.github/release-drafter.yml`; the release workflow creates or updates a GitHub draft release with an associated tag name, but does not publish npm packages or edit package metadata.

**Tech Stack:** GitHub Actions, actions/labeler pinned to `v6.1.0`, release-drafter pinned to `v7.5.1`, existing pnpm/Node CI.

---

## File Structure

Create or modify these files inside `/Users/jaemin/programming/projects/active/eslint-config`.

- Create: `.github/workflows/labeler.yml`
  - Responsibility: Apply labels to pull requests without checking out or executing untrusted PR code.
- Create: `.github/labeler.yml`
  - Responsibility: Define PR label rules for rules, configs, docs, tests, and CI areas.
- Create: `.github/workflows/release-drafter.yml`
  - Responsibility: Update a GitHub draft release when changes land on `main`.
- Create: `.github/release-drafter.yml`
  - Responsibility: Group draft release notes by labels and exclude skipped changelog entries.
- Preserve: `.github/workflows/check.yml`
  - Responsibility: Continue running `pnpm check`; do not modify in this plan.

## Task 1: Add PR Labeler

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/.github/workflows/labeler.yml`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/.github/labeler.yml`

- [ ] **Step 1: Create the workflow directory**

Run:

```bash
mkdir -p .github/workflows
```

Expected: `.github/workflows` exists.

- [ ] **Step 2: Add the labeler workflow**

Create `/Users/jaemin/programming/projects/active/eslint-config/.github/workflows/labeler.yml`:

```yaml
name: Label PRs

on:
  pull_request_target:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  label:
    name: Label
    runs-on: ubuntu-latest
    steps:
      - name: Apply labels
        uses: actions/labeler@f27b608878404679385c85cfa523b85ccb86e213 # v6.1.0
        with:
          sync-labels: true
```

Expected: The workflow performs label changes only and never checks out the PR branch.

- [ ] **Step 3: Add the labeler config**

Create `/Users/jaemin/programming/projects/active/eslint-config/.github/labeler.yml`:

```yaml
'area:ci':
  - changed-files:
      - any-glob-to-any-file:
          - '.github/**'

'area:docs':
  - changed-files:
      - any-glob-to-any-file:
          - 'docs/**'
          - 'README.md'

'area:rules':
  - changed-files:
      - any-glob-to-any-file:
          - 'src/rules/**'
          - 'docs/rules/**'

'area:configs':
  - changed-files:
      - any-glob-to-any-file:
          - 'src/configs/**'
          - 'src/index.ts'

'area:plugin':
  - changed-files:
      - any-glob-to-any-file:
          - 'src/plugin.ts'

'area:tests':
  - changed-files:
      - any-glob-to-any-file:
          - 'test/**'
          - '**/*.test.ts'

'area:package':
  - changed-files:
      - any-glob-to-any-file:
          - 'package.json'
          - 'pnpm-lock.yaml'
          - 'tsdown.config.ts'
          - 'tsconfig.json'

'type:feature':
  - head-branch:
      - '^feat[/-]'
      - '^feature[/-]'

'type:fix':
  - head-branch:
      - '^fix[/-]'
      - '^hotfix[/-]'

'type:docs':
  - head-branch:
      - '^docs[/-]'

'target:main':
  - base-branch:
      - '^main$'
```

Expected: The config separates rules, configs, plugin shell, docs, package metadata, tests, and CI changes.

- [ ] **Step 4: Validate labeler files**

Run:

```bash
actionlint .github/workflows/labeler.yml
ruby -e 'require "yaml"; YAML.load_file(".github/labeler.yml"); puts "labeler config ok"'
```

Expected: `actionlint` prints no output, and Ruby prints `labeler config ok`.

- [ ] **Step 5: Commit labeler automation**

Run:

```bash
git add .github/workflows/labeler.yml .github/labeler.yml docs/superpowers/plans/2026-06-26-maintainer-automation.md
git commit -m "ci: add pull request labeler"
```

Expected: One commit contains the labeler workflow/config and this plan file.

## Task 2: Add Draft Release Notes

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/.github/workflows/release-drafter.yml`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/.github/release-drafter.yml`

- [ ] **Step 1: Add the Release Drafter workflow**

Create `/Users/jaemin/programming/projects/active/eslint-config/.github/workflows/release-drafter.yml`:

```yaml
name: Release Drafter

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: read

jobs:
  update-release-draft:
    name: Update release draft
    runs-on: ubuntu-latest
    steps:
      - name: Update draft release
        uses: release-drafter/release-drafter@3832cfb52f98ab0f0e5b62aecf94909e334d4da6 # v7.5.1
        with:
          config-name: release-drafter.yml
          publish: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Expected: The workflow updates a draft GitHub release only; it does not checkout code, publish npm packages, or mutate package metadata. The draft release uses `tag-template` for its associated release tag name, and publishing remains manual.

- [ ] **Step 2: Add the Release Drafter config**

Create `/Users/jaemin/programming/projects/active/eslint-config/.github/release-drafter.yml`:

```yaml
name-template: 'v$RESOLVED_VERSION'
tag-template: 'v$RESOLVED_VERSION'
change-template: '- $TITLE @$AUTHOR (#$NUMBER)'
change-title-escapes: '\<*_&`#@'
no-changes-template: '- No user-facing changes'

categories:
  - type: 'pre-exclude'
    when:
      label: 'skip-changelog'
  - title: 'Fixes'
    exclusive: true
    when:
      labels:
        - 'type:fix'
        - 'bug'
  - title: 'Documentation'
    exclusive: true
    when:
      labels:
        - 'area:docs'
        - 'type:docs'
  - title: 'Rules'
    exclusive: true
    when:
      label: 'area:rules'
  - title: 'Config Presets'
    exclusive: true
    when:
      labels:
        - 'area:configs'
        - 'area:plugin'
  - title: 'Tests and CI'
    exclusive: true
    when:
      labels:
        - 'area:tests'
        - 'area:ci'
        - 'area:package'
  - title: 'Other Changes'
    exclusive: true
  - type: 'version-resolver'
    semver-increment: 'minor'
    when:
      label: 'type:feature'
  - type: 'version-resolver'
    semver-increment: 'patch'
    when:
      labels:
        - 'type:fix'
        - 'type:docs'
        - 'area:docs'
        - 'area:tests'
        - 'area:ci'
        - 'area:package'
  - type: 'version-resolver'
    semver-increment: 'patch'

sort-by: 'merged_at'
sort-direction: 'descending'
template: |
  ## Changes

  $CHANGES
```

Expected: Draft notes group changes into one changelog category per PR, exclude `skip-changelog`, and default to patch version resolution. Minor version resolution is driven by explicit `type:feature` labels rather than broad area labels.

- [ ] **Step 3: Validate Release Drafter files**

Run:

```bash
actionlint .github/workflows/release-drafter.yml
ruby -e 'require "yaml"; YAML.load_file(".github/release-drafter.yml"); puts "release drafter config ok"'
```

Expected: `actionlint` prints no output, and Ruby prints `release drafter config ok`.

- [ ] **Step 4: Confirm existing check workflow is unchanged**

Run:

```bash
git diff -- .github/workflows/check.yml
```

Expected: No output.

- [ ] **Step 5: Run existing repository quality gate**

Run:

```bash
pnpm check
```

Expected: Typecheck, lint, tests, and build pass.

- [ ] **Step 6: Commit Release Drafter automation**

Run:

```bash
git add .github/workflows/release-drafter.yml .github/release-drafter.yml
git commit -m "ci: add release draft automation"
```

Expected: One commit contains only Release Drafter workflow/config files.

## Self-Review Checklist

- [ ] The existing `Check` workflow remains unchanged.
- [ ] Release Drafter updates only GitHub draft releases.
- [ ] No npm publish, rule default, or package metadata changes are included.
- [ ] Labeler uses `pull_request_target` without checkout or code execution.
- [ ] All third-party actions are pinned to full commit SHA.
