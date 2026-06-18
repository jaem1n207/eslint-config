import type { FlatConfigItem, SeveritySwitch } from '../types'

export function namingConfig(severity: SeveritySwitch): FlatConfigItem[] {
  if (severity === 'off') {
    return []
  }

  return [
    {
      name: 'jaemin/naming',
      files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
      rules: {
        'jaemin/naming-convention': [
          severity,
          {
            ignore: [
              '*.config.*',
              '.*.config.*',
              'eslint.config.*',
              '**/extension/_locales/**',
              '**/src/shared/i18n/_locales/**',
              '**/generated/**',
            ],
          },
        ],
      },
    },
  ]
}
