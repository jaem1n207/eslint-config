import path from 'node:path'

import type { TSESTree } from '@typescript-eslint/utils'

import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { isKebabCase, isPascalCase, isUseCamelCase, stripKnownExtensions } from '../utils/case'
import { createRule } from '../utils/create-rule'
import { normalizePath, pathMatchesAny } from '../utils/path-matches'

type NamingConventionOptions = [
  {
    ignore?: string[]
    storeFileSuffix?: string
    testFilePattern?: string
  },
]

type MessageIds = 'fileName' | 'directoryName' | 'componentName' | 'hookName' | 'storeFileName'

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

function returnsJsx(
  node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
): boolean {
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

function relativeFileName(fileName: string): string {
  if (path.isAbsolute(fileName)) {
    return normalizePath(path.relative(process.cwd(), fileName))
  }

  return normalizePath(fileName)
}

function isHookContext(normalizedFileName: string, name: string): boolean {
  return normalizedFileName.includes('/hooks/') || path.basename(normalizedFileName).startsWith('use-') || /^use[A-Z0-9]/.test(name)
}

function isStoreFileContext(normalizedFileName: string, baseName: string): boolean {
  return normalizedFileName.includes('/stores/') || baseName.includes('store')
}

export const namingConvention = createRule<NamingConventionOptions, MessageIds>({
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
    const normalizedFileName = relativeFileName(fileName)
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

      if (isStoreFileContext(normalizedFileName, baseName) && !fileStem.endsWith(storeFileSuffix)) {
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'storeFileName',
        })
      }
    }

    function checkNamedFunction(
      name: string,
      node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
    ): void {
      if (isHookContext(normalizedFileName, name) && !isUseCamelCase(name)) {
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
