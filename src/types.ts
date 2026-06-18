import type { Linter } from 'eslint'

export type SeveritySwitch = 'off' | 'warn' | 'error'

export type JaeminProfile = 'migration' | 'starter' | 'agent' | 'strict'

export type FlatConfigItem = Linter.Config

export type JaeminConfigOptions = {
  profile?: JaeminProfile
  typescript?: boolean
  react?: boolean
  tanstack?: boolean
  agent?: SeveritySwitch
  naming?: SeveritySwitch
  ignores?: string[]
  rules?: Linter.RulesRecord
}

export const DEFAULT_PROFILE: JaeminProfile = 'starter'
