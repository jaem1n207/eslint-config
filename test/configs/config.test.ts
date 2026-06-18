import { describe, expect, it } from 'vitest'

import jaemin from '../../src/index'

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
})
