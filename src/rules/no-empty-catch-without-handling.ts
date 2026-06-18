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
