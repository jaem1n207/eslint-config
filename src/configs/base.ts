import js from '@eslint/js'
import globals from 'globals'

import type { FlatConfigItem } from '../types'

export function baseConfig(ignores: string[] = []): FlatConfigItem[] {
  return [
    {
      name: 'jaemin/ignores',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.next/**',
        '**/build/**',
        ...ignores,
      ],
    },
    js.configs.recommended,
    {
      name: 'jaemin/base',
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2022,
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
    },
  ]
}
