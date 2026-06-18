import type { FlatConfigItem, JaeminConfigOptions, SeveritySwitch } from './types'

import { agentConfig } from './configs/agent'
import { baseConfig } from './configs/base'
import { namingConfig } from './configs/naming'
import { reactConfig } from './configs/react'
import { strictConfig } from './configs/strict'
import { tanstackConfig } from './configs/tanstack'
import { testConfig } from './configs/test'
import { typescriptConfig } from './configs/typescript'
import { jaeminPlugin } from './plugin'
import { DEFAULT_PROFILE } from './types'

export type { JaeminConfigOptions, JaeminProfile, SeveritySwitch } from './types'
export { jaeminPlugin }

function defaultAgentSeverity(profile: string): SeveritySwitch {
  if (profile === 'strict' || profile === 'agent') {
    return 'error'
  }

  if (profile === 'migration') {
    return 'warn'
  }

  return 'warn'
}

function defaultNamingSeverity(profile: string): SeveritySwitch {
  if (profile === 'strict') {
    return 'error'
  }

  if (profile === 'migration') {
    return 'warn'
  }

  return 'warn'
}

export default function jaemin(options: JaeminConfigOptions = {}): FlatConfigItem[] {
  const profile = options.profile ?? DEFAULT_PROFILE
  const typescript = options.typescript ?? true
  const react = options.react ?? false
  const tanstack = options.tanstack ?? false
  const agent = options.agent ?? defaultAgentSeverity(profile)
  const naming = options.naming ?? defaultNamingSeverity(profile)
  const userOverrides: FlatConfigItem = {
    name: 'jaemin/user-overrides',
  }

  if (options.rules) {
    userOverrides.rules = options.rules
  }

  return [
    {
      name: 'jaemin/plugin',
      plugins: {
        jaemin: jaeminPlugin,
      },
      settings: {
        jaemin: {
          profile,
        },
      },
    },
    ...baseConfig(options.ignores),
    ...typescriptConfig(typescript),
    ...reactConfig(react),
    ...tanstackConfig(tanstack),
    ...testConfig(),
    ...agentConfig(agent),
    ...namingConfig(naming),
    ...strictConfig(profile === 'strict'),
    userOverrides,
  ]
}
