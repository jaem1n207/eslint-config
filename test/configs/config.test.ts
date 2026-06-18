import { describe, expect, it } from 'vitest'

import jaemin, { jaeminPlugin } from '../../src/index'

describe('jaemin config factory', () => {
  it('returns a flat config array', () => {
    const config = jaemin()

    expect(Array.isArray(config)).toBe(true)
    expect(config[0]?.name).toBe('jaemin/meta')
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
})
