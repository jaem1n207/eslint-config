import { noAsAny } from '../../src/rules/no-as-any'
import { ruleTester } from '../rule-tester'

ruleTester.run('no-as-any', noAsAny, {
  valid: [
    'const value = input as unknown',
    'const list: Array<string> = []',
    'const list: string[] = []',
    'type Payload = unknown',
  ],
  invalid: [
    {
      code: 'const value = input as any',
      errors: [{ messageId: 'noAsAny' }],
    },
    {
      code: 'const value = <any>input',
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: false,
          },
        },
      },
      errors: [{ messageId: 'noAsAny' }],
    },
    {
      code: 'const values: Array<any> = []',
      errors: [{ messageId: 'noExplicitAnyContainer' }],
    },
    {
      code: 'const values: any[] = []',
      errors: [{ messageId: 'noExplicitAnyContainer' }],
    },
    {
      code: 'type Values = Array<any>',
      errors: [{ messageId: 'noExplicitAnyContainer' }],
    },
    {
      code: 'type Values = any[]',
      errors: [{ messageId: 'noExplicitAnyContainer' }],
    },
  ],
})
