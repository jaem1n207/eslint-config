import type { FlatConfigItem } from '../types'

export function tanstackConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    {
      name: 'jaemin/tanstack',
      files: ['**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'warn',
          {
            paths: [
              {
                name: '@tanstack/react-query',
                importNames: ['useQuery'],
                message: 'Prefer project query hooks around TanStack Query when a domain hook already exists.',
              },
            ],
          },
        ],
      },
    },
  ]
}
