# Jaemin ESLint Config v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first dogfoodable `@jaemin/eslint-config` package: an ESLint 9 flat-config factory with a small embedded `jaemin` plugin and P0 custom rules.

**Architecture:** Ship one TypeScript package with a default `jaemin(options)` config factory. The package imports stable ecosystem ESLint configs, embeds a local flat-config plugin object for Jaemin-specific rules, and exposes profile/severity options for migration-first adoption.

**Tech Stack:** pnpm, TypeScript, ESLint 9 flat config, `typescript-eslint`, `@typescript-eslint/utils`, `@typescript-eslint/rule-tester`, Vitest, tsdown.

---

## File Structure

Create or modify these files inside `/Users/jaemin/programming/projects/active/eslint-config`.

- `package.json`: package metadata, runtime dependencies, dev dependencies, scripts, exports.
- `tsconfig.json`: strict TypeScript build settings.
- `tsdown.config.ts`: package build configuration.
- `vitest.config.ts`: Vitest config for rule and config tests.
- `eslint.config.ts`: self-lint config using the local source package.
- `src/index.ts`: public default config factory.
- `src/types.ts`: public option and internal config types.
- `src/plugin.ts`: embedded ESLint plugin object with custom rules.
- `src/configs/base.ts`: baseline JavaScript rules and ignores.
- `src/configs/typescript.ts`: TypeScript parser and TypeScript rules.
- `src/configs/react.ts`: React and React Hooks config.
- `src/configs/tanstack.ts`: TanStack-oriented restrictions and defaults.
- `src/configs/test.ts`: test-file config.
- `src/configs/agent.ts`: Jaemin agent guardrail severity mapping.
- `src/configs/naming.ts`: Jaemin naming severity mapping.
- `src/configs/strict.ts`: strict profile escalation.
- `src/rules/no-ts-ignore.ts`: disallow `@ts-ignore`.
- `src/rules/no-as-any.ts`: disallow obvious `any` escape hatches.
- `src/rules/no-empty-catch-without-handling.ts`: disallow unhandled empty catch blocks.
- `src/rules/no-focused-or-skipped-tests.ts`: disallow committed focused or skipped tests.
- `src/rules/naming-convention.ts`: mechanical path and identifier naming checks.
- `src/utils/create-rule.ts`: shared `ESLintUtils.RuleCreator` wrapper.
- `src/utils/case.ts`: case-checking helpers.
- `src/utils/ast.ts`: AST helper functions.
- `src/utils/path-matches.ts`: path ignore helper using `picomatch`.
- `test/rule-tester.ts`: shared RuleTester setup.
- `test/configs/config.test.ts`: config factory smoke tests.
- `test/rules/*.test.ts`: one test file per custom rule.
- `docs/rules/*.md`: concise rule docs.
- `docs/rule-backlog.md`: first rule backlog.
- `docs/presets.md`: profile and option docs.
- `docs/adoption.md`: dogfood and migration instructions.
- `docs/dogfood/synchronize-tab-scrolling-2026-06-19.md`: first dogfood report file.

The package stays single-package. Do not create a monorepo, separate plugin package, or CLI package in v0.1.

## Task 1: Tooling Scaffold

**Files:**
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/package.json`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/tsconfig.json`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/tsdown.config.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/vitest.config.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/types.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/index.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/configs/config.test.ts`

- [ ] **Step 1: Replace package metadata and scripts**

Replace `/Users/jaemin/programming/projects/active/eslint-config/package.json` with:

```json
{
  "name": "@jaemin/eslint-config",
  "version": "0.0.0",
  "description": "Personal opinionated ESLint flat config for Jaemin's TypeScript, React, and agent-assisted coding workflows.",
  "license": "MIT",
  "type": "module",
  "private": false,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jaemin/eslint-config.git"
  },
  "bugs": {
    "url": "https://github.com/jaemin/eslint-config/issues"
  },
  "homepage": "https://github.com/jaemin/eslint-config#readme",
  "keywords": [
    "eslint",
    "eslint-config",
    "flat-config",
    "typescript",
    "react"
  ],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "docs"
  ],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit",
    "check": "pnpm typecheck && pnpm lint && pnpm test:run && pnpm build"
  },
  "dependencies": {
    "@eslint/js": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/utils": "^8.0.0",
    "eslint-plugin-import-x": "^4.0.0",
    "eslint-plugin-react": "^7.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-vitest": "^0.5.0",
    "globals": "^16.0.0",
    "picomatch": "^4.0.0",
    "typescript-eslint": "^8.0.0"
  },
  "peerDependencies": {
    "eslint": ">=9.0.0",
    "typescript": ">=5.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@typescript-eslint/rule-tester": "^8.0.0",
    "eslint": "^9.0.0",
    "tsdown": "^0.15.0",
    "typescript": "^5.0.0",
    "vitest": "^4.0.0"
  },
  "packageManager": "pnpm@10.33.0"
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
pnpm install
```

Expected: `pnpm-lock.yaml` is created and dependencies install without peer dependency errors.

- [ ] **Step 3: Add TypeScript config**

Create `/Users/jaemin/programming/projects/active/eslint-config/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": true,
    "types": ["node", "vitest"]
  },
  "include": ["src", "test", "*.config.ts", "eslint.config.ts"]
}
```

- [ ] **Step 4: Add build config**

Create `/Users/jaemin/programming/projects/active/eslint-config/tsdown.config.ts`:

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
})
```

- [ ] **Step 5: Add Vitest config**

Create `/Users/jaemin/programming/projects/active/eslint-config/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globals: false,
  },
})
```

- [ ] **Step 6: Add initial public types**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/types.ts`:

```ts
import type { Linter } from 'eslint'

export type SeveritySwitch = 'off' | 'warn' | 'error'

export type JaeminProfile = 'migration' | 'starter' | 'agent' | 'strict'

export type FlatConfigItem = Linter.Config

export type JaeminConfigOptions = {
  profile?: JaeminProfile
  typescript?: boolean
  react?: boolean
  tanstack?: boolean
  agent?: SeveritySwitch
  naming?: SeveritySwitch
  ignores?: string[]
  rules?: Linter.RulesRecord
}

export const DEFAULT_PROFILE: JaeminProfile = 'starter'
```

- [ ] **Step 7: Add initial config factory**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/index.ts`:

```ts
import type { FlatConfigItem, JaeminConfigOptions } from './types'

import { DEFAULT_PROFILE } from './types'

export type { JaeminConfigOptions, JaeminProfile, SeveritySwitch } from './types'

export default function jaemin(options: JaeminConfigOptions = {}): FlatConfigItem[] {
  const profile = options.profile ?? DEFAULT_PROFILE

  return [
    {
      name: 'jaemin/meta',
      settings: {
        jaemin: {
          profile,
        },
      },
    },
    {
      name: 'jaemin/user-overrides',
      ignores: options.ignores,
      rules: options.rules,
    },
  ]
}
```

- [ ] **Step 8: Add first config smoke test**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/configs/config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import jaemin from '../../src/index'

describe('jaemin config factory', () => {
  it('returns a flat config array', () => {
    const config = jaemin()

    expect(Array.isArray(config)).toBe(true)
    expect(config[0]?.name).toBe('jaemin/meta')
  })

  it('records the selected profile', () => {
    const config = jaemin({ profile: 'migration' })

    expect(config[0]?.settings).toEqual({
      jaemin: {
        profile: 'migration',
      },
    })
  })
})
```

- [ ] **Step 9: Run scaffold checks**

Run:

```bash
pnpm test:run
pnpm typecheck
pnpm build
```

Expected:

- `pnpm test:run`: 2 tests pass.
- `pnpm typecheck`: exits 0.
- `pnpm build`: creates `dist/index.js` and `dist/index.d.ts`.

- [ ] **Step 10: Commit tooling scaffold**

Run:

```bash
git add package.json pnpm-lock.yaml tsconfig.json tsdown.config.ts vitest.config.ts src test
git commit -m "chore: scaffold eslint config package"
```

## Task 2: Rule Infrastructure And Embedded Plugin

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/utils/create-rule.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/rule-tester.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/index.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/test/configs/config.test.ts`

- [ ] **Step 1: Add shared rule creator**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/utils/create-rule.ts`:

```ts
import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/jaemin/eslint-config/blob/main/docs/rules/${ruleName}.md`,
)
```

- [ ] **Step 2: Add embedded plugin shell**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`:

```ts
import type { ESLint } from 'eslint'

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {},
}
```

- [ ] **Step 3: Add RuleTester helper**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/rule-tester.ts`:

```ts
import parser from '@typescript-eslint/parser'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { afterAll, describe, it } from 'vitest'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

export const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
})
```

- [ ] **Step 4: Register plugin in config factory**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/index.ts` with:

```ts
import type { FlatConfigItem, JaeminConfigOptions } from './types'

import { jaeminPlugin } from './plugin'
import { DEFAULT_PROFILE } from './types'

export type { JaeminConfigOptions, JaeminProfile, SeveritySwitch } from './types'
export { jaeminPlugin }

export default function jaemin(options: JaeminConfigOptions = {}): FlatConfigItem[] {
  const profile = options.profile ?? DEFAULT_PROFILE

  return [
    {
      name: 'jaemin/meta',
      plugins: {
        jaemin: jaeminPlugin,
      },
      settings: {
        jaemin: {
          profile,
        },
      },
    },
    {
      name: 'jaemin/user-overrides',
      ignores: options.ignores,
      rules: options.rules,
    },
  ]
}
```

- [ ] **Step 5: Extend config smoke test**

Replace `/Users/jaemin/programming/projects/active/eslint-config/test/configs/config.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import jaemin, { jaeminPlugin } from '../../src/index'

describe('jaemin config factory', () => {
  it('returns a flat config array', () => {
    const config = jaemin()

    expect(Array.isArray(config)).toBe(true)
    expect(config[0]?.name).toBe('jaemin/meta')
  })

  it('records the selected profile', () => {
    const config = jaemin({ profile: 'migration' })

    expect(config[0]?.settings).toEqual({
      jaemin: {
        profile: 'migration',
      },
    })
  })

  it('embeds the jaemin plugin object', () => {
    const config = jaemin()

    expect(config[0]?.plugins?.jaemin).toBe(jaeminPlugin)
    expect(jaeminPlugin.meta?.name).toBe('@jaemin/eslint-config')
  })
})
```

- [ ] **Step 6: Run checks**

Run:

```bash
pnpm test:run
pnpm typecheck
pnpm build
```

Expected:

- Config tests pass.
- TypeScript accepts the plugin object.
- Build emits `dist/index.js`.

- [ ] **Step 7: Commit rule infrastructure**

Run:

```bash
git add src test
git commit -m "chore: add embedded eslint plugin shell"
```

## Task 3: Implement `jaemin/no-ts-ignore`

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-ts-ignore.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-ts-ignore.test.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`

- [ ] **Step 1: Write failing rule test**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-ts-ignore.test.ts`:

```ts
import { ruleTester } from '../rule-tester'
import { noTsIgnore } from '../../src/rules/no-ts-ignore'

ruleTester.run('no-ts-ignore', noTsIgnore, {
  valid: [
    'const value: string = "ok"',
    '// @ts-expect-error explained: third-party type is wrong\nconst value = broken()',
    '/* @ts-expect-error explained: generated type mismatch */\nconst value = broken()',
  ],
  invalid: [
    {
      code: '// @ts-ignore\nconst value = broken()',
      errors: [{ messageId: 'noTsIgnore' }],
    },
    {
      code: '/* @ts-ignore */\nconst value = broken()',
      errors: [{ messageId: 'noTsIgnore' }],
    },
  ],
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run test/rules/no-ts-ignore.test.ts
```

Expected: FAIL because `../../src/rules/no-ts-ignore` does not exist.

- [ ] **Step 3: Implement rule**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-ts-ignore.ts`:

```ts
import { createRule } from '../utils/create-rule'

export const noTsIgnore = createRule({
  name: 'no-ts-ignore',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow @ts-ignore and require explained @ts-expect-error instead.',
    },
    messages: {
      noTsIgnore: 'Do not use @ts-ignore. Use an explained @ts-expect-error when suppression is justified.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Program() {
        const sourceCode = context.sourceCode

        for (const comment of sourceCode.getAllComments()) {
          if (comment.value.includes('@ts-ignore')) {
            context.report({
              loc: comment.loc,
              messageId: 'noTsIgnore',
            })
          }
        }
      },
    }
  },
})
```

- [ ] **Step 4: Register rule in plugin**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts` with:

```ts
import type { ESLint } from 'eslint'

import { noTsIgnore } from './rules/no-ts-ignore'

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'no-ts-ignore': noTsIgnore,
  },
}
```

- [ ] **Step 5: Run checks**

Run:

```bash
pnpm vitest run test/rules/no-ts-ignore.test.ts
pnpm test:run
pnpm typecheck
```

Expected:

- `no-ts-ignore` rule tests pass.
- Full test suite passes.
- Typecheck passes.

- [ ] **Step 6: Commit rule**

Run:

```bash
git add src/rules/no-ts-ignore.ts src/plugin.ts test/rules/no-ts-ignore.test.ts
git commit -m "feat: add no-ts-ignore rule"
```

## Task 4: Implement `jaemin/no-as-any`

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-as-any.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-as-any.test.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`

- [ ] **Step 1: Write failing rule test**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-as-any.test.ts`:

```ts
import { ruleTester } from '../rule-tester'
import { noAsAny } from '../../src/rules/no-as-any'

ruleTester.run('no-as-any', noAsAny, {
  valid: [
    'const value = input as unknown',
    'const list: Array<string> = []',
    'const list: string[] = []',
    'type Payload = unknown',
  ],
  invalid: [
    {
      code: 'const value = input as any',
      errors: [{ messageId: 'noAsAny' }],
    },
    {
      code: 'const value = <any>input',
      errors: [{ messageId: 'noAsAny' }],
    },
    {
      code: 'const values: Array<any> = []',
      errors: [{ messageId: 'noExplicitAnyContainer' }],
    },
    {
      code: 'const values: any[] = []',
      errors: [{ messageId: 'noExplicitAnyContainer' }],
    },
  ],
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run test/rules/no-as-any.test.ts
```

Expected: FAIL because `../../src/rules/no-as-any` does not exist.

- [ ] **Step 3: Implement rule**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-as-any.ts`:

```ts
import type { TSESTree } from '@typescript-eslint/utils'

import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { createRule } from '../utils/create-rule'

function isAnyKeyword(node: TSESTree.TypeNode | undefined): boolean {
  return node?.type === AST_NODE_TYPES.TSAnyKeyword
}

function isArrayOfAny(node: TSESTree.TypeNode): boolean {
  if (node.type === AST_NODE_TYPES.TSArrayType) {
    return isAnyKeyword(node.elementType)
  }

  if (node.type !== AST_NODE_TYPES.TSTypeReference) {
    return false
  }

  if (node.typeName.type !== AST_NODE_TYPES.Identifier || node.typeName.name !== 'Array') {
    return false
  }

  const params = node.typeArguments?.params ?? []

  return params.some((param) => isAnyKeyword(param))
}

export const noAsAny = createRule({
  name: 'no-as-any',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow obvious any escape hatches.',
    },
    messages: {
      noAsAny: 'Do not use an any assertion. Use unknown, a narrowed type, or a typed boundary instead.',
      noExplicitAnyContainer: 'Do not use an explicit any container type. Use unknown or a real element type.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSAsExpression(node) {
        if (isAnyKeyword(node.typeAnnotation)) {
          context.report({
            node: node.typeAnnotation,
            messageId: 'noAsAny',
          })
        }
      },
      TSTypeAssertion(node) {
        if (isAnyKeyword(node.typeAnnotation)) {
          context.report({
            node: node.typeAnnotation,
            messageId: 'noAsAny',
          })
        }
      },
      TSTypeAnnotation(node) {
        if (isArrayOfAny(node.typeAnnotation)) {
          context.report({
            node: node.typeAnnotation,
            messageId: 'noExplicitAnyContainer',
          })
        }
      },
    }
  },
})
```

- [ ] **Step 4: Register rule in plugin**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts` with:

```ts
import type { ESLint } from 'eslint'

import { noAsAny } from './rules/no-as-any'
import { noTsIgnore } from './rules/no-ts-ignore'

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'no-as-any': noAsAny,
    'no-ts-ignore': noTsIgnore,
  },
}
```

- [ ] **Step 5: Run checks**

Run:

```bash
pnpm vitest run test/rules/no-as-any.test.ts
pnpm test:run
pnpm typecheck
```

Expected:

- `no-as-any` rule tests pass.
- Full test suite passes.
- Typecheck passes.

- [ ] **Step 6: Commit rule**

Run:

```bash
git add src/rules/no-as-any.ts src/plugin.ts test/rules/no-as-any.test.ts
git commit -m "feat: add no-as-any rule"
```

## Task 5: Implement `jaemin/no-empty-catch-without-handling`

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-empty-catch-without-handling.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-empty-catch-without-handling.test.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`

- [ ] **Step 1: Write failing rule test**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-empty-catch-without-handling.test.ts`:

```ts
import { ruleTester } from '../rule-tester'
import { noEmptyCatchWithoutHandling } from '../../src/rules/no-empty-catch-without-handling'

ruleTester.run('no-empty-catch-without-handling', noEmptyCatchWithoutHandling, {
  valid: [
    'try { risky() } catch (error) { console.warn(error) }',
    'try { risky() } catch (error) { throw error }',
    'try { risky() } catch { fallback() }',
    'try { risky() } catch { /* intentional ignore: browser API may throw */ }',
    'try { risky() } catch { /* noop: best effort cleanup */ }',
  ],
  invalid: [
    {
      code: 'try { risky() } catch (error) {}',
      errors: [{ messageId: 'emptyCatch' }],
    },
    {
      code: 'try { risky() } catch {}',
      errors: [{ messageId: 'emptyCatch' }],
    },
  ],
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run test/rules/no-empty-catch-without-handling.test.ts
```

Expected: FAIL because `../../src/rules/no-empty-catch-without-handling` does not exist.

- [ ] **Step 3: Implement rule**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-empty-catch-without-handling.ts`:

```ts
import { createRule } from '../utils/create-rule'

const ALLOW_COMMENT_PATTERN = /\b(intentional ignore|ignore|noop|best effort|expected)\b/i

export const noEmptyCatchWithoutHandling = createRule({
  name: 'no-empty-catch-without-handling',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow empty catch blocks unless the ignore is explicit.',
    },
    messages: {
      emptyCatch: 'Do not leave catch blocks empty. Log, throw, recover, or add an explicit intentional ignore comment.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CatchClause(node) {
        if (node.body.body.length > 0) {
          return
        }

        const comments = context.sourceCode.getCommentsInside(node.body)
        const hasAllowComment = comments.some((comment) => ALLOW_COMMENT_PATTERN.test(comment.value))

        if (hasAllowComment) {
          return
        }

        context.report({
          node: node.body,
          messageId: 'emptyCatch',
        })
      },
    }
  },
})
```

- [ ] **Step 4: Register rule in plugin**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts` with:

```ts
import type { ESLint } from 'eslint'

import { noAsAny } from './rules/no-as-any'
import { noEmptyCatchWithoutHandling } from './rules/no-empty-catch-without-handling'
import { noTsIgnore } from './rules/no-ts-ignore'

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'no-as-any': noAsAny,
    'no-empty-catch-without-handling': noEmptyCatchWithoutHandling,
    'no-ts-ignore': noTsIgnore,
  },
}
```

- [ ] **Step 5: Run checks**

Run:

```bash
pnpm vitest run test/rules/no-empty-catch-without-handling.test.ts
pnpm test:run
pnpm typecheck
```

Expected:

- `no-empty-catch-without-handling` rule tests pass.
- Full test suite passes.
- Typecheck passes.

- [ ] **Step 6: Commit rule**

Run:

```bash
git add src/rules/no-empty-catch-without-handling.ts src/plugin.ts test/rules/no-empty-catch-without-handling.test.ts
git commit -m "feat: add no-empty-catch rule"
```

## Task 6: Implement `jaemin/no-focused-or-skipped-tests`

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-focused-or-skipped-tests.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-focused-or-skipped-tests.test.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/utils/ast.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`

- [ ] **Step 1: Write failing rule test**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/rules/no-focused-or-skipped-tests.test.ts`:

```ts
import { ruleTester } from '../rule-tester'
import { noFocusedOrSkippedTests } from '../../src/rules/no-focused-or-skipped-tests'

ruleTester.run('no-focused-or-skipped-tests', noFocusedOrSkippedTests, {
  valid: [
    'test("works", () => {})',
    'it("works", () => {})',
    'describe("suite", () => {})',
    'test.describe("suite", () => {})',
  ],
  invalid: [
    {
      code: 'test.only("works", () => {})',
      errors: [{ messageId: 'focusedTest' }],
    },
    {
      code: 'describe.only("suite", () => {})',
      errors: [{ messageId: 'focusedTest' }],
    },
    {
      code: 'it.skip("works", () => {})',
      errors: [{ messageId: 'skippedTest' }],
    },
    {
      code: 'test.describe.skip("suite", () => {})',
      errors: [{ messageId: 'skippedTest' }],
    },
  ],
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run test/rules/no-focused-or-skipped-tests.test.ts
```

Expected: FAIL because `../../src/rules/no-focused-or-skipped-tests` does not exist.

- [ ] **Step 3: Add callee-chain helper**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/utils/ast.ts`:

```ts
import type { TSESTree } from '@typescript-eslint/utils'

import { AST_NODE_TYPES } from '@typescript-eslint/utils'

export function getCalleeChain(node: TSESTree.CallExpression['callee']): string[] {
  if (node.type === AST_NODE_TYPES.Identifier) {
    return [node.name]
  }

  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return []
  }

  const objectChain = getCalleeChain(node.object as TSESTree.CallExpression['callee'])

  if (node.property.type === AST_NODE_TYPES.Identifier) {
    return [...objectChain, node.property.name]
  }

  if (node.property.type === AST_NODE_TYPES.Literal && typeof node.property.value === 'string') {
    return [...objectChain, node.property.value]
  }

  return objectChain
}
```

- [ ] **Step 4: Implement rule**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/rules/no-focused-or-skipped-tests.ts`:

```ts
import { createRule } from '../utils/create-rule'
import { getCalleeChain } from '../utils/ast'

const TEST_ROOTS = new Set(['test', 'it', 'describe'])

export const noFocusedOrSkippedTests = createRule({
  name: 'no-focused-or-skipped-tests',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow focused or skipped tests from being committed.',
    },
    messages: {
      focusedTest: 'Do not commit focused tests. Remove .only before committing.',
      skippedTest: 'Do not commit skipped tests. Fix the test or document the skip outside the test call.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const chain = getCalleeChain(node.callee)
        const root = chain[0]

        if (!root || !TEST_ROOTS.has(root)) {
          return
        }

        if (chain.includes('only')) {
          context.report({
            node,
            messageId: 'focusedTest',
          })
          return
        }

        if (chain.includes('skip')) {
          context.report({
            node,
            messageId: 'skippedTest',
          })
        }
      },
    }
  },
})
```

- [ ] **Step 5: Register rule in plugin**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts` with:

```ts
import type { ESLint } from 'eslint'

import { noAsAny } from './rules/no-as-any'
import { noEmptyCatchWithoutHandling } from './rules/no-empty-catch-without-handling'
import { noFocusedOrSkippedTests } from './rules/no-focused-or-skipped-tests'
import { noTsIgnore } from './rules/no-ts-ignore'

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'no-as-any': noAsAny,
    'no-empty-catch-without-handling': noEmptyCatchWithoutHandling,
    'no-focused-or-skipped-tests': noFocusedOrSkippedTests,
    'no-ts-ignore': noTsIgnore,
  },
}
```

- [ ] **Step 6: Run checks**

Run:

```bash
pnpm vitest run test/rules/no-focused-or-skipped-tests.test.ts
pnpm test:run
pnpm typecheck
```

Expected:

- `no-focused-or-skipped-tests` rule tests pass.
- Full test suite passes.
- Typecheck passes.

- [ ] **Step 7: Commit rule**

Run:

```bash
git add src/rules/no-focused-or-skipped-tests.ts src/utils/ast.ts src/plugin.ts test/rules/no-focused-or-skipped-tests.test.ts
git commit -m "feat: add focused test guardrail"
```

## Task 7: Implement `jaemin/naming-convention`

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/rules/naming-convention.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/utils/case.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/utils/path-matches.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/test/rules/naming-convention.test.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts`

- [ ] **Step 1: Write failing rule test**

Create `/Users/jaemin/programming/projects/active/eslint-config/test/rules/naming-convention.test.ts`:

```ts
import { ruleTester } from '../rule-tester'
import { namingConvention } from '../../src/rules/naming-convention'

ruleTester.run('naming-convention', namingConvention, {
  valid: [
    {
      filename: 'src/components/user-card.tsx',
      code: 'export function UserCard() { return <div /> }',
    },
    {
      filename: 'src/hooks/use-scroll-sync.ts',
      code: 'export function useScrollSync() { return null }',
    },
    {
      filename: 'src/stores/sync-state-store.ts',
      code: 'export const syncStateStore = {}',
    },
    {
      filename: 'src/__tests__/scroll-sync.test.ts',
      code: 'test("works", () => {})',
    },
    {
      filename: 'src/generated/APIClient.ts',
      code: 'export const APIClient = {}',
      options: [{ ignore: ['src/generated/**'] }],
    },
  ],
  invalid: [
    {
      filename: 'src/components/UserCard.tsx',
      code: 'export function UserCard() { return <div /> }',
      errors: [{ messageId: 'fileName' }],
    },
    {
      filename: 'src/BadFolder/user-card.tsx',
      code: 'export function UserCard() { return <div /> }',
      errors: [{ messageId: 'directoryName' }],
    },
    {
      filename: 'src/hooks/use-scroll-sync.ts',
      code: 'export function usescrollsync() { return null }',
      errors: [{ messageId: 'hookName' }],
    },
    {
      filename: 'src/components/user-card.tsx',
      code: 'export function userCard() { return <div /> }',
      errors: [{ messageId: 'componentName' }],
    },
    {
      filename: 'src/stores/sync-state.ts',
      code: 'export const syncStateStore = {}',
      errors: [{ messageId: 'storeFileName' }],
    },
  ],
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run test/rules/naming-convention.test.ts
```

Expected: FAIL because `../../src/rules/naming-convention` does not exist.

- [ ] **Step 3: Add case helpers**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/utils/case.ts`:

```ts
export function isKebabCase(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function isPascalCase(value: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(value)
}

export function isUseCamelCase(value: string): boolean {
  return /^use[A-Z][A-Za-z0-9]*$/.test(value)
}

export function stripKnownExtensions(fileName: string): string {
  return fileName.replace(/\.(test|spec)?\.?(d\.)?(m|c)?(ts|tsx|js|jsx)$/u, '')
}
```

- [ ] **Step 4: Add path ignore helper**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/utils/path-matches.ts`:

```ts
import path from 'node:path'

import picomatch from 'picomatch'

export function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join('/')
}

export function pathMatchesAny(filePath: string, patterns: string[]): boolean {
  const normalized = normalizePath(filePath)

  return patterns.some((pattern) => picomatch(pattern)(normalized))
}
```

- [ ] **Step 5: Implement rule**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/rules/naming-convention.ts`:

```ts
import path from 'node:path'

import type { TSESTree } from '@typescript-eslint/utils'

import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { isKebabCase, isPascalCase, isUseCamelCase, stripKnownExtensions } from '../utils/case'
import { normalizePath, pathMatchesAny } from '../utils/path-matches'
import { createRule } from '../utils/create-rule'

type NamingConventionOptions = [
  {
    ignore?: string[]
    storeFileSuffix?: string
    testFilePattern?: RegExp | string
  },
]

const DEFAULT_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/coverage/**',
  '**/.*/**',
  '**/_locales/**',
]

function getIdentifierName(node: TSESTree.Node | null | undefined): string | null {
  if (!node || node.type !== AST_NODE_TYPES.Identifier) {
    return null
  }

  return node.name
}

function returnsJsx(node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression): boolean {
  const source = node.body

  if (source.type === AST_NODE_TYPES.JSXElement || source.type === AST_NODE_TYPES.JSXFragment) {
    return true
  }

  if (source.type !== AST_NODE_TYPES.BlockStatement) {
    return false
  }

  return source.body.some((statement) => {
    if (statement.type !== AST_NODE_TYPES.ReturnStatement) {
      return false
    }

    return statement.argument?.type === AST_NODE_TYPES.JSXElement || statement.argument?.type === AST_NODE_TYPES.JSXFragment
  })
}

export const namingConvention = createRule<NamingConventionOptions, 'fileName' | 'directoryName' | 'componentName' | 'hookName' | 'storeFileName'>({
  name: 'naming-convention',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce mechanical file, directory, component, hook, and store naming rules.',
    },
    messages: {
      fileName: 'Use kebab-case for file names.',
      directoryName: 'Use kebab-case for directory names.',
      componentName: 'Use PascalCase for React component identifiers.',
      hookName: 'Use useCamelCase for hook identifiers.',
      storeFileName: 'Use the configured store file suffix for store files.',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'string' },
          },
          storeFileSuffix: {
            type: 'string',
          },
          testFilePattern: {
            type: 'string',
          },
        },
      },
    ],
  },
  defaultOptions: [
    {
      ignore: [],
      storeFileSuffix: '-store',
      testFilePattern: '\\.(test|spec)\\.[cm]?[tj]sx?$',
    },
  ],
  create(context, [options]) {
    const fileName = context.filename
    const normalizedFileName = normalizePath(path.relative(process.cwd(), fileName))
    const ignore = [...DEFAULT_IGNORES, ...(options.ignore ?? [])]
    const storeFileSuffix = options.storeFileSuffix ?? '-store'
    const testFilePattern = new RegExp(options.testFilePattern ?? '\\.(test|spec)\\.[cm]?[tj]sx?$')

    if (pathMatchesAny(normalizedFileName, ignore)) {
      return {}
    }

    function checkFilePath(): void {
      const baseName = path.basename(fileName)
      const fileStem = stripKnownExtensions(baseName)

      if (!testFilePattern.test(baseName) && !isKebabCase(fileStem)) {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'fileName',
        })
      }

      const directories = normalizedFileName.split('/').slice(0, -1)

      for (const directory of directories) {
        if (!directory || directory === 'src' || directory.startsWith('__')) {
          continue
        }

        if (!isKebabCase(directory)) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'directoryName',
          })
          break
        }
      }

      if (baseName.includes('store') && !fileStem.endsWith(storeFileSuffix)) {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'storeFileName',
        })
      }
    }

    function checkNamedFunction(name: string, node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression): void {
      if (name.startsWith('use') && !isUseCamelCase(name)) {
        context.report({
          node,
          messageId: 'hookName',
        })
      }

      if (returnsJsx(node) && !isPascalCase(name)) {
        context.report({
          node,
          messageId: 'componentName',
        })
      }
    }

    return {
      Program() {
        checkFilePath()
      },
      FunctionDeclaration(node) {
        const name = getIdentifierName(node.id)

        if (name) {
          checkNamedFunction(name, node)
        }
      },
      VariableDeclarator(node) {
        const name = getIdentifierName(node.id)

        if (!name) {
          return
        }

        const init = node.init

        if (
          init?.type === AST_NODE_TYPES.ArrowFunctionExpression ||
          init?.type === AST_NODE_TYPES.FunctionExpression
        ) {
          checkNamedFunction(name, init)
        }
      },
    }
  },
})
```

- [ ] **Step 6: Register rule in plugin**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/plugin.ts` with:

```ts
import type { ESLint } from 'eslint'

import { namingConvention } from './rules/naming-convention'
import { noAsAny } from './rules/no-as-any'
import { noEmptyCatchWithoutHandling } from './rules/no-empty-catch-without-handling'
import { noFocusedOrSkippedTests } from './rules/no-focused-or-skipped-tests'
import { noTsIgnore } from './rules/no-ts-ignore'

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'naming-convention': namingConvention,
    'no-as-any': noAsAny,
    'no-empty-catch-without-handling': noEmptyCatchWithoutHandling,
    'no-focused-or-skipped-tests': noFocusedOrSkippedTests,
    'no-ts-ignore': noTsIgnore,
  },
}
```

- [ ] **Step 7: Run checks**

Run:

```bash
pnpm vitest run test/rules/naming-convention.test.ts
pnpm test:run
pnpm typecheck
```

Expected:

- `naming-convention` rule tests pass.
- Full test suite passes.
- Typecheck passes.

- [ ] **Step 8: Commit naming rule**

Run:

```bash
git add src/rules/naming-convention.ts src/utils/case.ts src/utils/path-matches.ts src/plugin.ts test/rules/naming-convention.test.ts
git commit -m "feat: add mechanical naming rule"
```

## Task 8: Compose Presets And External Configs

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/base.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/typescript.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/react.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/tanstack.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/test.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/agent.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/naming.ts`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/src/configs/strict.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/src/index.ts`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/test/configs/config.test.ts`

- [ ] **Step 1: Add base config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/base.ts`:

```ts
import js from '@eslint/js'
import globals from 'globals'

import type { FlatConfigItem } from '../types'

export function baseConfig(ignores: string[] = []): FlatConfigItem[] {
  return [
    js.configs.recommended,
    {
      name: 'jaemin/base',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.next/**',
        '**/build/**',
        ...ignores,
      ],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2022,
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
    },
  ]
}
```

- [ ] **Step 2: Add TypeScript config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/typescript.ts`:

```ts
import tseslint from 'typescript-eslint'

import type { FlatConfigItem } from '../types'

export function typescriptConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    ...tseslint.configs.recommended,
    {
      name: 'jaemin/typescript',
      files: ['**/*.{ts,tsx,mts,cts}'],
      rules: {
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ]
}
```

- [ ] **Step 3: Add React config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/react.ts`:

```ts
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

import type { FlatConfigItem } from '../types'

export function reactConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    {
      name: 'jaemin/react',
      files: ['**/*.{jsx,tsx}'],
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...reactPlugin.configs.flat.recommended.rules,
        ...reactPlugin.configs.flat['jsx-runtime'].rules,
        ...reactHooksPlugin.configs.recommended.rules,
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      },
    },
  ]
}
```

- [ ] **Step 4: Add TanStack config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/tanstack.ts`:

```ts
import type { FlatConfigItem } from '../types'

export function tanstackConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    {
      name: 'jaemin/tanstack',
      files: ['**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'warn',
          {
            paths: [
              {
                name: '@tanstack/react-query',
                importNames: ['useQuery'],
                message: 'Prefer project query hooks around TanStack Query when a domain hook already exists.',
              },
            ],
          },
        ],
      },
    },
  ]
}
```

- [ ] **Step 5: Add test config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/test.ts`:

```ts
import vitestPlugin from 'eslint-plugin-vitest'

import type { FlatConfigItem } from '../types'

export function testConfig(): FlatConfigItem[] {
  return [
    {
      name: 'jaemin/test',
      files: ['**/*.{test,spec}.{ts,tsx,js,jsx,mts,cts}'],
      plugins: {
        vitest: vitestPlugin,
      },
      rules: {
        ...vitestPlugin.configs.recommended.rules,
      },
    },
  ]
}
```

- [ ] **Step 6: Add agent rule family config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/agent.ts`:

```ts
import type { FlatConfigItem, SeveritySwitch } from '../types'

export function agentConfig(severity: SeveritySwitch): FlatConfigItem[] {
  if (severity === 'off') {
    return []
  }

  return [
    {
      name: 'jaemin/agent',
      files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
      rules: {
        'jaemin/no-as-any': severity,
        'jaemin/no-empty-catch-without-handling': severity,
        'jaemin/no-focused-or-skipped-tests': severity,
        'jaemin/no-ts-ignore': severity,
      },
    },
  ]
}
```

- [ ] **Step 7: Add naming rule family config**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/naming.ts`:

```ts
import type { FlatConfigItem, SeveritySwitch } from '../types'

export function namingConfig(severity: SeveritySwitch): FlatConfigItem[] {
  if (severity === 'off') {
    return []
  }

  return [
    {
      name: 'jaemin/naming',
      files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
      rules: {
        'jaemin/naming-convention': [
          severity,
          {
            ignore: [
              '**/extension/_locales/**',
              '**/src/shared/i18n/_locales/**',
              '**/generated/**',
            ],
          },
        ],
      },
    },
  ]
}
```

- [ ] **Step 8: Add strict profile override**

Create `/Users/jaemin/programming/projects/active/eslint-config/src/configs/strict.ts`:

```ts
import type { FlatConfigItem } from '../types'

export function strictConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    {
      name: 'jaemin/strict',
      rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },
  ]
}
```

- [ ] **Step 9: Compose public factory**

Replace `/Users/jaemin/programming/projects/active/eslint-config/src/index.ts` with:

```ts
import type { FlatConfigItem, JaeminConfigOptions, SeveritySwitch } from './types'

import { agentConfig } from './configs/agent'
import { baseConfig } from './configs/base'
import { namingConfig } from './configs/naming'
import { reactConfig } from './configs/react'
import { strictConfig } from './configs/strict'
import { tanstackConfig } from './configs/tanstack'
import { testConfig } from './configs/test'
import { typescriptConfig } from './configs/typescript'
import { jaeminPlugin } from './plugin'
import { DEFAULT_PROFILE } from './types'

export type { JaeminConfigOptions, JaeminProfile, SeveritySwitch } from './types'
export { jaeminPlugin }

function defaultAgentSeverity(profile: string): SeveritySwitch {
  if (profile === 'strict' || profile === 'agent') {
    return 'error'
  }

  if (profile === 'migration') {
    return 'warn'
  }

  return 'warn'
}

function defaultNamingSeverity(profile: string): SeveritySwitch {
  if (profile === 'strict') {
    return 'error'
  }

  if (profile === 'migration') {
    return 'warn'
  }

  return 'warn'
}

export default function jaemin(options: JaeminConfigOptions = {}): FlatConfigItem[] {
  const profile = options.profile ?? DEFAULT_PROFILE
  const typescript = options.typescript ?? true
  const react = options.react ?? false
  const tanstack = options.tanstack ?? false
  const agent = options.agent ?? defaultAgentSeverity(profile)
  const naming = options.naming ?? defaultNamingSeverity(profile)

  return [
    {
      name: 'jaemin/plugin',
      plugins: {
        jaemin: jaeminPlugin,
      },
      settings: {
        jaemin: {
          profile,
        },
      },
    },
    ...baseConfig(options.ignores),
    ...typescriptConfig(typescript),
    ...reactConfig(react),
    ...tanstackConfig(tanstack),
    ...testConfig(),
    ...agentConfig(agent),
    ...namingConfig(naming),
    ...strictConfig(profile === 'strict'),
    {
      name: 'jaemin/user-overrides',
      rules: options.rules,
    },
  ]
}
```

- [ ] **Step 10: Extend config tests**

Replace `/Users/jaemin/programming/projects/active/eslint-config/test/configs/config.test.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import jaemin, { jaeminPlugin } from '../../src/index'

describe('jaemin config factory', () => {
  it('returns a flat config array', () => {
    const config = jaemin()

    expect(Array.isArray(config)).toBe(true)
    expect(config[0]?.name).toBe('jaemin/plugin')
  })

  it('records the selected profile', () => {
    const config = jaemin({ profile: 'migration' })

    expect(config[0]?.settings).toEqual({
      jaemin: {
        profile: 'migration',
      },
    })
  })

  it('embeds the jaemin plugin object', () => {
    const config = jaemin()

    expect(config[0]?.plugins?.jaemin).toBe(jaeminPlugin)
    expect(jaeminPlugin.meta?.name).toBe('@jaemin/eslint-config')
  })

  it('enables agent and naming rules in migration profile', () => {
    const config = jaemin({ profile: 'migration' })
    const allRules = Object.assign({}, ...config.map((item) => item.rules ?? {}))

    expect(allRules['jaemin/no-ts-ignore']).toBe('warn')
    expect(allRules['jaemin/naming-convention']).toEqual([
      'warn',
      {
        ignore: [
          '**/extension/_locales/**',
          '**/src/shared/i18n/_locales/**',
          '**/generated/**',
        ],
      },
    ])
  })

  it('allows user rule overrides at the end', () => {
    const config = jaemin({
      rules: {
        'jaemin/no-ts-ignore': 'off',
      },
    })

    expect(config.at(-1)?.rules).toEqual({
      'jaemin/no-ts-ignore': 'off',
    })
  })
})
```

- [ ] **Step 11: Run checks**

Run:

```bash
pnpm test:run
pnpm typecheck
pnpm build
```

Expected:

- All rule and config tests pass.
- Typecheck passes.
- Build succeeds.

- [ ] **Step 12: Commit config composition**

Run:

```bash
git add src/configs src/index.ts test/configs/config.test.ts
git commit -m "feat: compose jaemin eslint presets"
```

## Task 9: Self-Lint The Package

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/eslint.config.ts`
- Modify: files flagged by self-lint only when the warning is a true positive.

- [ ] **Step 1: Add local self-lint config**

Create `/Users/jaemin/programming/projects/active/eslint-config/eslint.config.ts`:

```ts
import jaemin from './src/index'

export default jaemin({
  profile: 'migration',
  react: false,
  typescript: true,
  agent: 'warn',
  naming: 'warn',
  ignores: ['dist/**'],
})
```

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected: ESLint runs against the package without config-load errors. Warnings from `jaemin/naming-convention` are acceptable only if they reflect a deliberate exception that should be encoded as an ignore.

- [ ] **Step 3: Fix true positives**

If lint reports a true positive in the package source, make the smallest code change that keeps tests passing. For an intentional naming exception, add the exact path to `ignores` in `/Users/jaemin/programming/projects/active/eslint-config/eslint.config.ts`.

- [ ] **Step 4: Run full check**

Run:

```bash
pnpm check
```

Expected: typecheck, lint, test, and build all exit 0.

- [ ] **Step 5: Commit self-lint config**

Run:

```bash
git add eslint.config.ts src test
git commit -m "chore: dogfood local eslint config"
```

## Task 10: Documentation And Rule Backlog

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-ts-ignore.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-as-any.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-empty-catch-without-handling.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-focused-or-skipped-tests.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/naming-convention.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/rule-backlog.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/presets.md`
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/adoption.md`
- Modify: `/Users/jaemin/programming/projects/active/eslint-config/README.md`

- [ ] **Step 1: Add rule docs directory**

Run:

```bash
mkdir -p docs/rules
```

Expected: `docs/rules` exists.

- [ ] **Step 2: Add `no-ts-ignore` docs**

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-ts-ignore.md`:

```md
# jaemin/no-ts-ignore

Disallows `@ts-ignore`.

Use an explained `@ts-expect-error` when a TypeScript suppression is justified.

Bad:

```ts
// @ts-ignore
broken()
```

Good:

```ts
// @ts-expect-error explained: upstream package exposes the wrong type
broken()
```
```

- [ ] **Step 3: Add remaining rule docs**

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-as-any.md`:

```md
# jaemin/no-as-any

Disallows obvious `any` escape hatches such as `as any`, `<any>value`, `Array<any>`, and `any[]`.

Use `unknown`, a real domain type, or a typed boundary instead.
```

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-empty-catch-without-handling.md`:

```md
# jaemin/no-empty-catch-without-handling

Disallows empty catch blocks unless the ignore is explicit.

Allowed intentional comments include phrases such as `intentional ignore`, `noop`, `best effort`, and `expected`.
```

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/no-focused-or-skipped-tests.md`:

```md
# jaemin/no-focused-or-skipped-tests

Disallows committed `test.only`, `describe.only`, `it.only`, `test.skip`, `describe.skip`, and equivalent test chains.

Focused tests are local debugging tools. Skipped tests should be fixed or tracked outside the committed test call.
```

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/rules/naming-convention.md`:

```md
# jaemin/naming-convention

Enforces mechanical naming checks:

- File names use `kebab-case`.
- Directory names use `kebab-case`.
- React components that return JSX use `PascalCase`.
- Hooks use `useCamelCase`.
- Store files use the configured `-store` suffix.

This rule does not judge semantic name quality.
```

- [ ] **Step 4: Add backlog**

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/rule-backlog.md`:

```md
# Rule Backlog

## P0 Implemented For v0.1

- `jaemin/no-ts-ignore`
- `jaemin/no-as-any`
- `jaemin/no-empty-catch-without-handling`
- `jaemin/no-focused-or-skipped-tests`
- `jaemin/naming-convention`

## P1 Candidates

### jaemin/no-unsafe-eslint-disable

Status: candidate
Signal: `eslint-disable` without an explanation.
Default: agent=warn
False positive risk: medium

### jaemin/require-ime-composition-guard

Status: candidate
Signal: keyboard handlers in text inputs that do not check CJK IME composition state.
Default: agent=warn
False positive risk: medium

### jaemin/no-async-scroll-handler

Status: candidate
Signal: scroll handlers containing `await`.
Default: agent=warn
False positive risk: medium

### jaemin/require-passive-scroll-listener

Status: candidate
Signal: scroll or touch event listeners without passive options.
Default: agent=warn
False positive risk: medium

### jaemin/no-relative-parent-imports

Status: candidate
Signal: parent-directory imports in projects that prefer aliases.
Default: naming=warn
False positive risk: high

### jaemin/require-barrel-export

Status: candidate
Signal: public directory imports that bypass an `index.ts` barrel.
Default: naming=warn
False positive risk: high
```

- [ ] **Step 5: Add preset docs**

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/presets.md`:

```md
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
```

- [ ] **Step 6: Add adoption docs**

Create `/Users/jaemin/programming/projects/active/eslint-config/docs/adoption.md`:

```md
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
```

- [ ] **Step 7: Update README**

Replace `/Users/jaemin/programming/projects/active/eslint-config/README.md` with:

```md
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
```

- [ ] **Step 8: Run docs-adjacent checks**

Run:

```bash
pnpm check
```

Expected: all checks exit 0.

- [ ] **Step 9: Commit docs**

Run:

```bash
git add README.md docs
git commit -m "docs: document v0.1 rules and adoption"
```

## Task 11: Dogfood Against `synchronize-tab-scrolling`

**Files:**
- Create: `/Users/jaemin/programming/projects/active/eslint-config/docs/dogfood/synchronize-tab-scrolling-2026-06-19.md`
- Modify temporarily during dogfood: `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling/eslint.config.ts`
- Revert temporary dogfood edit unless the user explicitly approves adopting the package in that repository.

- [ ] **Step 1: Pack the local package**

Run in `/Users/jaemin/programming/projects/active/eslint-config`:

```bash
pnpm pack
```

Expected: a package tarball such as `jaemin-eslint-config-0.0.0.tgz` is created.

- [ ] **Step 2: Install tarball in dogfood target**

Run in `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling`:

```bash
pnpm add -D /Users/jaemin/programming/projects/active/eslint-config/jaemin-eslint-config-0.0.0.tgz
```

Expected: the dogfood target installs the local package.

- [ ] **Step 3: Add dogfood config entry**

Modify `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling/eslint.config.ts` by importing the package and appending it to the existing config. The import should be:

```ts
import jaemin from '@jaemin/eslint-config'
```

Append this config block after the existing project configs:

```ts
...jaemin({
  profile: 'migration',
  react: true,
  typescript: true,
  tanstack: false,
  agent: 'warn',
  naming: 'warn',
  ignores: [
    'extension/_locales/**',
    'src/shared/i18n/_locales/**',
  ],
})
```

- [ ] **Step 4: Run dogfood lint**

Run in `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling`:

```bash
set +e
pnpm lint > /tmp/jaemin-eslint-config-dogfood.log 2>&1
printf "%s\n" "$?" > /tmp/jaemin-eslint-config-dogfood.exit
cat /tmp/jaemin-eslint-config-dogfood.log
```

Expected: lint runs with the local package loaded. Warnings are acceptable in this dogfood stage. Config-load errors are package bugs and must be fixed in `/Users/jaemin/programming/projects/active/eslint-config`.

- [ ] **Step 5: Record dogfood report**

Run in `/Users/jaemin/programming/projects/active/eslint-config`:

```bash
mkdir -p docs/dogfood
{
  printf "%s\n" "# synchronize-tab-scrolling Dogfood Report"
  printf "%s\n" ""
  printf "%s\n" "Date: 2026-06-19"
  printf "%s\n" 'Target: `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling`'
  printf "%s\n" 'Mode: `profile: migration`, `agent: warn`, `naming: warn`'
  printf "%s\n" "Exit code: $(cat /tmp/jaemin-eslint-config-dogfood.exit)"
  printf "%s\n" ""
  printf "%s\n" "## Command"
  printf "%s\n" ""
  printf "%s\n" '```bash'
  printf "%s\n" "pnpm lint"
  printf "%s\n" '```'
  printf "%s\n" ""
  printf "%s\n" "## Raw Output"
  printf "%s\n" ""
  printf "%s\n" '```txt'
  cat /tmp/jaemin-eslint-config-dogfood.log
  printf "%s\n" '```'
  printf "%s\n" ""
  printf "%s\n" "## Follow-Up Decisions"
  printf "%s\n" ""
  printf "%s\n" "- Keep low-noise rules in migration mode."
  printf "%s\n" "- Move noisy naming checks behind narrower options."
  printf "%s\n" "- Promote only verified low-noise rules to starter."
} > docs/dogfood/synchronize-tab-scrolling-2026-06-19.md
```

Expected: the report contains the exact raw lint output from Step 4 and no invented counts.

- [ ] **Step 6: Revert dogfood target edit unless adoption is approved**

Run in `/Users/jaemin/programming/projects/active/synchronize-tab-scrolling`:

```bash
git diff -- eslint.config.ts package.json pnpm-lock.yaml
```

If the user has not approved adopting the local package in that repo, verify the diff contains only dogfood edits and then run:

```bash
git restore -- eslint.config.ts package.json pnpm-lock.yaml
```

- [ ] **Step 7: Commit dogfood report**

Run in `/Users/jaemin/programming/projects/active/eslint-config`:

```bash
git add docs/dogfood/synchronize-tab-scrolling-2026-06-19.md
git commit -m "docs: add first dogfood report"
```

## Task 12: Final Verification

**Files:**
- Modify: only files required by failed verification.

- [ ] **Step 1: Run full package check**

Run in `/Users/jaemin/programming/projects/active/eslint-config`:

```bash
pnpm check
```

Expected: typecheck, lint, tests, and build all exit 0.

- [ ] **Step 2: Inspect package exports**

Run:

```bash
node -e "import('./dist/index.js').then((m) => console.log(typeof m.default))"
```

Expected:

```txt
function
```

- [ ] **Step 3: Review git history**

Run:

```bash
git log --oneline --max-count=12
git status --short
```

Expected:

- Recent commits show one focused commit per completed task.
- `git status --short` is empty.

- [ ] **Step 4: Stop before publishing**

Do not publish to npm in v0.1 implementation unless the user explicitly asks for publishing. The first complete milestone is a local, dogfooded, buildable package.

## Self-Review

Spec coverage:

- Single-package repository: Task 1.
- ESLint 9 flat config factory: Tasks 1 and 8.
- Embedded custom plugin: Task 2.
- Agent guardrail rules: Tasks 3, 4, 5, 6, and 8.
- Mechanical naming rule: Task 7.
- Warning-first dogfood mode: Tasks 8 and 11.
- Rule backlog and docs: Task 10.
- Testing strategy: Tasks 1 through 8 and Task 12.
- Dogfood target `synchronize-tab-scrolling`: Task 11.

Scope boundaries:

- No legacy `.eslintrc` support.
- No separate CLI.
- No separate plugin package.
- No AGENTS.md parser.
- No npm publish step.

Risk notes:

- `jaemin/naming-convention` is the highest-friction rule. Keep it warning-only until the dogfood report shows low noise.
- `tanstackConfig` starts with a weak warning because TanStack-specific conventions are project-shaped. Promote only after real repeated violations appear.
- GitHub remote creation is outside this implementation plan until the `jaemin` owner permission question is resolved.
