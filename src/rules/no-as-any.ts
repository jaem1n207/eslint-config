
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { createRule } from '../utils/create-rule'

import type { TSESTree } from '@typescript-eslint/utils'

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
      TSArrayType(node) {
        if (isArrayOfAny(node)) {
          context.report({
            node,
            messageId: 'noExplicitAnyContainer',
          })
        }
      },
      TSTypeReference(node) {
        if (isArrayOfAny(node)) {
          context.report({
            node,
            messageId: 'noExplicitAnyContainer',
          })
        }
      },
    }
  },
})
