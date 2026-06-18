# @jaemin/eslint-config

Personal, opinionated ESLint flat config for Jaemin's TypeScript, React, and AI-agent-assisted coding workflows.

The v0.1 goal is small and practical: dogfood a warning-first ESLint 9 flat config against `synchronize-tab-scrolling` and keep only low-noise rules.

## Usage

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

## Rules

- `jaemin/no-ts-ignore`
- `jaemin/no-as-any`
- `jaemin/no-empty-catch-without-handling`
- `jaemin/no-focused-or-skipped-tests`
- `jaemin/naming-convention`

## Design

See [`docs/superpowers/specs/2026-06-19-jaemin-eslint-config-design.md`](docs/superpowers/specs/2026-06-19-jaemin-eslint-config-design.md).
