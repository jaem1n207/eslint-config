import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

import type { FlatConfigItem } from '../types'

export function reactConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    {
      name: 'jaemin/react',
      files: ['**/*.{jsx,tsx}'],
      plugins: {
        react: reactPlugin,
        'react-hooks': reactHooksPlugin,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...reactPlugin.configs.flat.recommended.rules,
        ...reactPlugin.configs.flat['jsx-runtime'].rules,
        ...reactHooksPlugin.configs.recommended.rules,
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      },
    },
  ]
}
