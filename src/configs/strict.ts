import type { FlatConfigItem } from '../types'

export function strictConfig(enabled: boolean): FlatConfigItem[] {
  if (!enabled) {
    return []
  }

  return [
    {
      name: 'jaemin/strict',
      rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },
  ]
}
