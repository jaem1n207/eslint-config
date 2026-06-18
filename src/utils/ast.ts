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
