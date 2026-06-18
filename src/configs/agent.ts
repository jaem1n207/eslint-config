import type { FlatConfigItem, SeveritySwitch } from '../types'

export function agentConfig(severity: SeveritySwitch): FlatConfigItem[] {
  if (severity === 'off') {
    return []
  }

  return [
    {
      name: 'jaemin/agent',
      files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
      rules: {
        'jaemin/no-as-any': severity,
        'jaemin/no-empty-catch-without-handling': severity,
        'jaemin/no-focused-or-skipped-tests': severity,
        'jaemin/no-ts-ignore': severity,
      },
    },
  ]
}
