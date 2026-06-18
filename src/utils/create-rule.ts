import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/jaem1n207/eslint-config/blob/main/docs/rules/${ruleName}.md`,
)
