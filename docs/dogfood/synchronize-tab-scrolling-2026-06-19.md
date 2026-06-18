# synchronize-tab-scrolling Dogfood Report

Date: 2026-06-19
Target: `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling`
Mode: `profile: migration`, `agent: warn`, `naming: warn`
Package: local tarball from `@jaemin/eslint-config@0.0.0`

## Command

```bash
NODE_OPTIONS='--experimental-strip-types' pnpm exec eslint . --flag unstable_native_nodejs_ts_config
```

## Result

Exit code: 1

Summary:

- Total: 65 problems
- Errors: 16
- Warnings: 49
- Existing non-Jaemin errors: 16
- Jaemin warnings: 25

Jaemin rule counts:

| Rule | Count | Initial classification | Decision |
| --- | ---: | --- | --- |
| `jaemin/no-empty-catch-without-handling` | 6 | likely true positives or explicit-ignore candidates | keep |
| `jaemin/naming-convention` | 19 | mixed: real legacy convention drift plus migration friction | keep warn-only, tune ignores/options before enforcing |
| `jaemin/no-as-any` | 0 | no signal in this repo run | keep |
| `jaemin/no-ts-ignore` | 0 | no signal in this repo run | keep |
| `jaemin/no-focused-or-skipped-tests` | 0 | no signal in this repo run | keep |

## Findings

The first dogfood run exposed several noisy naming false positives:

- config file names such as `vite.config.mts`
- `store` substring in `fetch-store-stats.ts`
- hook-file helper functions such as `savePositionToSession`
- `use-cases-section.tsx` being treated as a hook context
- explicit empty-catch comments such as `Gracefully handle unavailable sessionStorage`

The package was tuned before this final report:

- config files are ignored by the default naming config
- store suffix enforcement only applies inside `/stores/`
- hook naming only applies to real hook candidates
- `gracefully handle` comments count as explicit empty-catch intent

Remaining Jaemin warnings after tuning:

- `contentScripts` camelCase directory paths trigger directory naming warnings. This is expected migration friction for this target, not an immediate `error` candidate.
- 6 empty catch blocks remain useful review signals.
- `zh_TW.ts` still triggers file-name naming. Locale casing needs an explicit i18n/locale exception before enforcing naming in real projects.

## Decision

Do not promote `naming` to error from this run. Keep `naming: 'warn'` in migration mode and add project-specific ignore options during adoption.

`no-empty-catch-without-handling` produced useful signal and should remain in the v0.1 agent rule family.
