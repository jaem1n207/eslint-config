import importX from 'eslint-plugin-import-x'

import type { FlatConfigItem } from '../types'

export function importsConfig(): FlatConfigItem[] {
  return [
    {
      name: 'jaemin/imports',
      files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
      plugins: {
        'import-x': importX,
      },
      rules: {
        'import-x/first': 'error',
        'import-x/no-duplicates': 'error',
        'import-x/no-mutable-exports': 'error',
        'import-x/newline-after-import': 'warn',
        'import-x/order': [
          'warn',
          {
            groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            warnOnUnassignedImports: true,
          },
        ],
      },
    },
  ]
}
