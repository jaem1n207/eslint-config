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
