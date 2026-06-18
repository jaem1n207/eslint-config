import { describe, expect, it } from 'vitest'

import jaemin, { jaeminPlugin } from '../../src/index'

describe('jaemin config factory', () => {
  it('returns a flat config array', () => {
    const config = jaemin()

    expect(Array.isArray(config)).toBe(true)
    expect(config[0]?.name).toBe('jaemin/plugin')
  })

  it('records the selected profile', () => {
    const config = jaemin({ profile: 'migration' })

    expect(config[0]?.settings).toEqual({
      jaemin: {
        profile: 'migration',
      },
    })
  })

  it('embeds the jaemin plugin object', () => {
    const config = jaemin()

    expect(config[0]?.plugins?.jaemin).toBe(jaeminPlugin)
    expect(jaeminPlugin.meta?.name).toBe('@jaemin/eslint-config')
  })

  it('enables agent and naming rules in migration profile', () => {
    const config = jaemin({ profile: 'migration' })
    const allRules = Object.assign({}, ...config.map((item) => item.rules ?? {}))

    expect(allRules['jaemin/no-ts-ignore']).toBe('warn')
    expect(allRules['jaemin/naming-convention']).toEqual([
      'warn',
      {
        ignore: [
          '**/extension/_locales/**',
          '**/src/shared/i18n/_locales/**',
          '**/generated/**',
        ],
      },
    ])
  })

  it('allows user rule overrides at the end', () => {
    const config = jaemin({
      rules: {
        'jaemin/no-ts-ignore': 'off',
      },
    })

    expect(config.at(-1)?.rules).toEqual({
      'jaemin/no-ts-ignore': 'off',
    })
  })
})
