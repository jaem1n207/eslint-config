import type { ESLint, Rule } from 'eslint'

import { noAsAny } from './rules/no-as-any'
import { noEmptyCatchWithoutHandling } from './rules/no-empty-catch-without-handling'
import { noTsIgnore } from './rules/no-ts-ignore'

function toEslintRule(rule: unknown): Rule.RuleModule {
  return rule as Rule.RuleModule
}

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'no-as-any': toEslintRule(noAsAny),
    'no-empty-catch-without-handling': toEslintRule(noEmptyCatchWithoutHandling),
    'no-ts-ignore': toEslintRule(noTsIgnore),
  },
}
