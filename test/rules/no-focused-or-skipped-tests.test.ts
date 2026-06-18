import { noFocusedOrSkippedTests } from '../../src/rules/no-focused-or-skipped-tests'
import { ruleTester } from '../rule-tester'

ruleTester.run('no-focused-or-skipped-tests', noFocusedOrSkippedTests, {
  valid: [
    'test("works", () => {})',
    'it("works", () => {})',
    'describe("suite", () => {})',
    'test.describe("suite", () => {})',
  ],
  invalid: [
    {
      code: 'test.only("works", () => {})',
      errors: [{ messageId: 'focusedTest' }],
    },
    {
      code: 'describe.only("suite", () => {})',
      errors: [{ messageId: 'focusedTest' }],
    },
    {
      code: 'it.skip("works", () => {})',
      errors: [{ messageId: 'skippedTest' }],
    },
    {
      code: 'test.describe.skip("suite", () => {})',
      errors: [{ messageId: 'skippedTest' }],
    },
  ],
})
