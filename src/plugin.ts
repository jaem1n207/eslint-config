import type { ESLint, Rule } from 'eslint'

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
    'no-ts-ignore': toEslintRule(noTsIgnore),
  },
}
