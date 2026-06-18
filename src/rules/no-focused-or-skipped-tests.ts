import { getCalleeChain } from '../utils/ast'
import { createRule } from '../utils/create-rule'

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
