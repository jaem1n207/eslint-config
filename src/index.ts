import type { FlatConfigItem, JaeminConfigOptions } from './types'

import { DEFAULT_PROFILE } from './types'

export type { JaeminConfigOptions, JaeminProfile, SeveritySwitch } from './types'

export default function jaemin(options: JaeminConfigOptions = {}): FlatConfigItem[] {
  const profile = options.profile ?? DEFAULT_PROFILE

  return [
    {
      name: 'jaemin/meta',
      settings: {
        jaemin: {
          profile,
        },
      },
    },
    {
      name: 'jaemin/user-overrides',
      ignores: options.ignores,
      rules: options.rules,
    },
  ]
}
