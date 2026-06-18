# Adoption

Start with migration mode:

```ts
import jaemin from '@jaemin/eslint-config'

export default jaemin({
  profile: 'migration',
  react: true,
  typescript: true,
  agent: 'warn',
  naming: 'warn',
})
```

Run:

```bash
pnpm lint
```

Classify each warning:

- true positive
- false positive
- style friction

Promote only low-noise rules from warning to error.
