# Presets

Use the default factory:

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

Profiles:

- `migration`: warning-first adoption for existing projects.
- `starter`: low-noise default.
- `agent`: stronger AI-agent guardrails.
- `strict`: error-oriented new-project profile.

Feature flags:

- `typescript`
- `react`
- `tanstack`

Severity families:

- `agent`
- `naming`
