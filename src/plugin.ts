
import { namingConvention } from './rules/naming-convention'
import { noAsAny } from './rules/no-as-any'
import { noEmptyCatchWithoutHandling } from './rules/no-empty-catch-without-handling'
import { noFocusedOrSkippedTests } from './rules/no-focused-or-skipped-tests'
import { noTsIgnore } from './rules/no-ts-ignore'

import type { ESLint, Rule } from 'eslint'

function toEslintRule(rule: unknown): Rule.RuleModule {
  return rule as Rule.RuleModule
}

export const jaeminPlugin: ESLint.Plugin = {
  meta: {
    name: '@jaemin/eslint-config',
    version: '0.0.0',
  },
  rules: {
    'naming-convention': toEslintRule(namingConvention),
    'no-as-any': toEslintRule(noAsAny),
    'no-empty-catch-without-handling': toEslintRule(noEmptyCatchWithoutHandling),
    'no-focused-or-skipped-tests': toEslintRule(noFocusedOrSkippedTests),
    'no-ts-ignore': toEslintRule(noTsIgnore),
  },
}
