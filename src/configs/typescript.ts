import tseslint from 'typescript-eslint'

import type { FlatConfigItem } from '../types'

export function typescriptConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    ...tseslint.configs.recommended,
    {
      name: 'jaemin/typescript',
      files: ['**/*.{ts,tsx,mts,cts}'],
      rules: {
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ]
}
