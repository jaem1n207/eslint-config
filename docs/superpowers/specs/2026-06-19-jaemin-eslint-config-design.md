# Jaemin ESLint Config Design

Date: 2026-06-19
Status: approved design draft for review
Working repository: `jaem1n207/eslint-config`
Preferred package name: `@jaemin/eslint-config`

## 1. Decision Summary

The project is no longer named CodeJig. The intended final form is a personal,
opinionated ESLint config similar in product shape to `antfu/eslint-config`,
but scoped to Jaemin's coding habits, architecture preferences, naming
conventions, and AI-agent failure patterns.

Version 0.1 must stay small. It should not become a generic lint platform,
dashboard, multi-language scanner, or AI-powered convention engine. Its first
job is to be installed into `synchronize-tab-scrolling` as an ESLint 9 flat
config and prove that it can repeatedly catch real issues with low noise.

Primary v0.1 success criterion:

- Installable in `synchronize-tab-scrolling`.
- Runs in warning-first dogfood mode.
- Finds real, review-worthy violations.
- Produces a rule backlog from observed misses and false positives.
- Keeps the path clear toward a public `@jaemin/eslint-config` package.

## 2. Naming

Chosen GitHub repository:

- `jaem1n207/eslint-config`

Preferred npm package:

- `@jaemin/eslint-config`

The original preferred repository was `jaemin/eslint-config`, but the available
repository for implementation is `jaem1n207/eslint-config`. The package name
can still remain `@jaemin/eslint-config` if that npm scope is available.

Recommended usage:

```ts
import jaemin from '@jaemin/eslint-config'

export default jaemin({
  profile: 'migration',
  react: true,
  typescript: true,
  tanstack: true,
  agent: 'warn',
  naming: 'warn',
})
```

Trade-off:

- `eslint-config` is less branded than CodeJig, but it is much clearer at the
  moment of installation.
- A personal config name makes the project easier to understand and compare to
  existing tools such as `@antfu/eslint-config`.
- CodeJig can be discarded completely. Keeping it as a second brand would add
  explanation cost without improving the harness.

## 3. MVP Scope

The v0.1 scope is an ESLint 9 flat-config package for TypeScript, React, and
Jaemin's current frontend stack.

Included:

- Single package repository.
- Default config factory: `jaemin(options)`.
- ESLint 9 flat config only.
- TypeScript, React, JSX, imports, tests, and basic TanStack-aware defaults.
- Embedded custom plugin object for Jaemin-specific rules.
- Agent guardrail rules.
- Mechanical naming convention rules.
- Warning-first dogfood adoption mode.
- Rule backlog document.
- Rule tests and config smoke tests.

Excluded from v0.1:

- Legacy `.eslintrc` support.
- Python or non-JavaScript linting.
- Standalone CodeJig platform.
- Web dashboard.
- AGENTS.md automatic parsing.
- Semantic judgment about whether a name is "good".
- Project-specific architecture rules such as locale directory coupling or
  manifest update coupling.

Trade-off:

- The MVP will not cover every project under `/Users/jaemin/programming`.
- It will cover the most important first surface: modern TypeScript and React
  work where ESLint already runs frequently.

## 4. Package Structure

Start as one package. Do not split into `core`, `plugin`, `cli`, and `config`
packages until the need is proven.

```txt
eslint-config/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── configs/
│   │   ├── base.ts
│   │   ├── typescript.ts
│   │   ├── react.ts
│   │   ├── tanstack.ts
│   │   ├── test.ts
│   │   ├── agent.ts
│   │   ├── naming.ts
│   │   └── strict.ts
│   ├── rules/
│   │   ├── no-empty-catch-without-handling.ts
│   │   ├── no-ts-ignore.ts
│   │   ├── no-as-any.ts
│   │   ├── no-focused-or-skipped-tests.ts
│   │   └── naming-convention.ts
│   ├── plugin.ts
│   └── utils/
│       ├── create-rule.ts
│       ├── path-matches.ts
│       └── ast.ts
├── fixtures/
│   ├── valid/
│   └── invalid/
├── test/
│   ├── rules/
│   └── configs/
├── docs/
│   ├── rules/
│   ├── presets.md
│   ├── adoption.md
│   └── rule-backlog.md
├── eslint.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

The package should include an embedded flat-config plugin object:

```ts
plugins: {
  jaemin: jaeminPlugin,
}
```

Rule names:

```txt
jaemin/no-empty-catch-without-handling
jaemin/no-ts-ignore
jaemin/no-as-any
jaemin/no-focused-or-skipped-tests
jaemin/naming-convention
```

Trade-off:

- One package keeps installation simple.
- A separate `eslint-plugin-jaemin` may be useful later, but splitting it in
  v0.1 would create package-boundary work before the rule set has proven value.

## 5. Config API

The public API is a config factory, not legacy preset strings.

```ts
type JaeminConfigOptions = {
  profile?: 'starter' | 'agent' | 'strict' | 'migration'
  typescript?: boolean
  react?: boolean
  tanstack?: boolean
  agent?: 'off' | 'warn' | 'error'
  naming?: 'off' | 'warn' | 'error'
  ignores?: string[]
  rules?: Record<string, unknown>
}
```

Design principles:

- `profile` controls overall adoption posture.
- Feature flags such as `react`, `typescript`, and `tanstack` describe project
  capabilities, not strictness levels.
- Rule families such as `agent` and `naming` can be independently disabled or
  promoted.
- Project-level overrides remain possible through returned flat config arrays.

Trade-off:

- Factory options require a small amount of API design now.
- They avoid the ambiguity of many preset names and fit ESLint 9 flat config
  better than `plugin:...` strings.

## 6. Presets And Profiles

Profiles:

- `migration`: existing repo adoption. Most custom rules are warn or off.
- `starter`: low-noise default for new or healthy projects.
- `agent`: emphasizes AI-agent guardrails.
- `strict`: new-project mode. Low-noise rules can become errors.

Feature flags:

- `typescript`
- `react`
- `tanstack`

Severity families:

- `agent`
- `naming`

Do not add `architecture` in v0.1. It is valuable, but repo-specific
architecture rules have higher false-positive risk and need a separate design.

Trade-off:

- Fewer profiles mean less marketing surface.
- Separate severity families make gradual adoption practical in real repos.

## 7. Rule Authoring Model

Rules are divided into three categories.

### Imported Rules

Existing ecosystem rules configured with Jaemin's defaults.

Examples:

- TypeScript rules.
- React and React Hooks rules.
- Import ordering.
- Test rules.

### Wrapped Rules

Existing rules with opinionated options and project-friendly overrides.

Examples:

- Naming convention.
- Restricted syntax.
- Restricted imports.

### Custom Rules

Rules implemented in this package when existing rules cannot express the
desired invariant.

Custom rules must pass these requirements before implementation:

- The rule is mechanically decidable.
- A violation is usually review-worthy.
- Valid and invalid fixtures can be written.
- Escape hatches are documented.
- Default severity is mapped to profiles.

Trade-off:

- This slows rule creation.
- It prevents the project from becoming a noisy preference dump.

## 8. Rule Backlog

Start with `docs/rule-backlog.md`. Do not introduce Notion, a database, or a
custom backlog app in v0.1.

Backlog entry shape:

```md
## no-empty-catch-without-handling

Status: candidate | accepted | implemented | rejected
Source: synchronize-tab-scrolling AGENTS.md / review comment / session retrospective
Signal: empty catch without log, throw, fallback, comment, or allow marker
Autofix: no
Default: agent=warn
False positive risk: low
Examples:
- bad: catch (error) {}
- good: catch (error) { logger.warn(error) }
```

Promotion criteria:

- The signal is deterministic.
- The rule has low false-positive risk.
- The project has repeated evidence that this mistake matters.
- The rule has a clear exception policy.

If a candidate fails these criteria, it stays in docs, checklist, or agent
instructions rather than becoming lint.

## 9. First Rule Set

P0 v0.1 rules:

### `jaemin/no-empty-catch-without-handling`

Flags empty catch blocks with no log, throw, fallback, explanatory comment, or
intentional ignore marker.

Trade-off:

- Some errors are intentionally ignored.
- The rule must support an explicit escape hatch.

### `jaemin/no-ts-ignore`

Disallows `@ts-ignore`. Allows explained `@ts-expect-error`.

Trade-off:

- Migration work may temporarily need suppressions.
- False positives are low, so this is a strong early rule.

### `jaemin/no-as-any`

Flags obvious `any` escape hatches such as `as any`, angle-bracket `any`
assertions, and explicit `Array<any>`.

Trade-off:

- Third-party boundaries and generated code may require ignores.
- Path-level ignores are required from the start.

### `jaemin/no-focused-or-skipped-tests`

Flags `test.only`, `describe.only`, `it.only`, `test.skip`, `describe.skip`,
and related focused or skipped test APIs.

Trade-off:

- Useful during local debugging.
- Should be warning in local dogfood and error in CI once stable.

### `jaemin/naming-convention`

Enforces mechanical naming rules.

Default checks:

- File names: `kebab-case`.
- Directory names: `kebab-case`.
- React component identifiers: `PascalCase`.
- Hook identifiers: `useCamelCase`.
- Zustand store files: `*-store.ts`.
- Test files: configurable `*.test.ts(x)` or `*.spec.ts(x)`.
- General variables: `camelCase`.
- Module constants: optional `UPPER_CASE`.

Trade-off:

- Naming rules create real adoption friction.
- The rule must include ignore globs and per-kind options from v0.1.
- It must not judge semantic name quality.

P1 backlog, not v0.1:

- `jaemin/no-unsafe-eslint-disable`
- `jaemin/require-ime-composition-guard`
- `jaemin/no-async-scroll-handler`
- `jaemin/require-passive-scroll-listener`
- `jaemin/no-relative-parent-imports`
- `jaemin/require-barrel-export`

P2 non-lint material:

- Good variable names.
- Respecting architecture.
- Keeping components small.
- Choosing the right abstraction.
- Avoiding AI-looking UI.

These belong in review guidance, docs, or skills, not deterministic lint.

## 10. Dogfood Strategy

The first dogfood target is:

- `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling`

Initial config:

```ts
import jaemin from '@jaemin/eslint-config'

export default jaemin({
  profile: 'migration',
  react: true,
  typescript: true,
  tanstack: false,
  agent: 'warn',
  naming: 'warn',
})
```

Dogfood loop:

1. Install the config locally.
2. Run full repo lint.
3. Record all violations.
4. Classify each violation as true positive, false positive, or style friction.
5. Fix low-cost true positives in the target repo only after rule behavior is
   trusted.
6. Update rule docs and backlog.
7. Promote low-noise rules from `migration` to `starter`.

Do not use `--max-warnings=0` in the first dogfood run. The first run is for
signal discovery, not enforcement.

## 11. Agent, Pre-Commit, And CI Integration

Agent workflow should remain ESLint-centered:

```bash
pnpm lint
pnpm lint --fix
```

Optional scripts:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:jaemin": "eslint ."
  }
}
```

Because the CodeJig brand is discarded, avoid `codejig` as a script or CLI
name. If a convenience script is added, prefer `lint:jaemin` or no extra script
at all.

Pre-commit:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,mts,cts}": "eslint --fix"
  }
}
```

CI:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Full-repo rules should be treated carefully in pre-commit because staged-only
execution can hide cross-file context. In v0.1, file-system-wide rules should
be avoided or limited to CI/full lint.

Trade-off:

- A custom CLI would be more branded.
- Plain ESLint integration is more reliable and easier for agents, editors,
  hooks, and CI to run repeatedly.

## 12. Testing Strategy

Test layers:

1. Rule unit tests with ESLint `RuleTester`.
2. Config smoke tests that instantiate `jaemin(options)`.
3. Fixture project tests using `eslint.lintFiles()`.
4. Manual dogfood report against `synchronize-tab-scrolling`.

Custom rule merge gate:

- At least two invalid fixtures.
- At least two valid fixtures.
- Escape hatch documented.
- Autofix output test if autofix exists.
- Default severity and profile mapping documented.

Recommended tooling:

- `vitest` for tests.
- `typescript-eslint` test utilities where useful.
- Small fixtures rather than full copied projects.

Trade-off:

- The test gate slows early rule writing.
- It is necessary because a personal config becomes useless if developers stop
  trusting its warnings.

## 13. Implementation Order

Recommended implementation sequence after this design is approved:

1. Use the created `jaem1n207/eslint-config` repository.
2. Scaffold a single-package TypeScript project.
3. Add ESLint flat config factory with base TypeScript and React config.
4. Add embedded `jaemin` plugin object.
5. Implement P0 custom rules one at a time with tests.
6. Add docs for rule backlog, presets, and adoption.
7. Dogfood against `synchronize-tab-scrolling` in migration mode.
8. Tune severities and false-positive handling from real output.

## 14. Open Decisions For Implementation Planning

These should be decided during the implementation plan, not in this design:

- Exact package manager commands for scaffolding.
- Whether to use `tsdown`, `unbuild`, `rollup`, or `tsx` for package output.
- Exact dependency versions.
- Whether to publish immediately or keep the first version local/private.
- Whether repo creation should include MIT license or another license.
- Whether `@jaemin` npm scope is available.
- Whether `tanstack` defaults need custom rules or only imported rules.

## 15. Self-Review

This design is intentionally scoped to an ESLint config package. It does not
attempt to solve all repo-quality automation, and it does not claim that every
preference should become lint.

The riskiest area is `jaemin/naming-convention`, because naming rules often
create adoption friction. It should ship warning-only and with explicit ignore
options.

The second riskiest area is custom rule creep. The backlog promotion criteria
are part of the design because the project's value depends on low-noise,
repeatable enforcement.
