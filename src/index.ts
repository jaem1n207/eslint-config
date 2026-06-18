import type { FlatConfigItem, JaeminConfigOptions } from './types'

import { jaeminPlugin } from './plugin'
import { DEFAULT_PROFILE } from './types'

export type { JaeminConfigOptions, JaeminProfile, SeveritySwitch } from './types'
export { jaeminPlugin }

export default function jaemin(options: JaeminConfigOptions = {}): FlatConfigItem[] {
  const profile = options.profile ?? DEFAULT_PROFILE

  return [
    {
      name: 'jaemin/meta',
      plugins: {
        jaemin: jaeminPlugin,
      },
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
