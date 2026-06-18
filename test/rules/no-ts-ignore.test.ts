import { noTsIgnore } from '../../src/rules/no-ts-ignore'
import { ruleTester } from '../rule-tester'

ruleTester.run('no-ts-ignore', noTsIgnore, {
  valid: [
    'const value: string = "ok"',
    '// @ts-expect-error explained: third-party type is wrong\nconst value = broken()',
    '/* @ts-expect-error explained: generated type mismatch */\nconst value = broken()',
  ],
  invalid: [
    {
      code: '// @ts-ignore\nconst value = broken()',
      errors: [{ messageId: 'noTsIgnore' }],
    },
    {
      code: '/* @ts-ignore */\nconst value = broken()',
      errors: [{ messageId: 'noTsIgnore' }],
    },
  ],
})
