import vitestPlugin from '@vitest/eslint-plugin'

import type { FlatConfigItem } from '../types'

export function testConfig(): FlatConfigItem[] {
  return [
    {
      name: 'jaemin/test',
      files: ['**/*.{test,spec}.{ts,tsx,js,jsx,mts,cts}'],
      plugins: {
        vitest: vitestPlugin,
      },
      rules: {
        ...vitestPlugin.configs.recommended.rules,
      },
    },
  ]
}
