import js from '@eslint/js'
import globals from 'globals'

import type { FlatConfigItem } from '../types'

export function baseConfig(ignores: string[] = []): FlatConfigItem[] {
  return [
    js.configs.recommended,
    {
      name: 'jaemin/base',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.next/**',
        '**/build/**',
        ...ignores,
      ],
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
