import { namingConvention } from '../../src/rules/naming-convention'
import { ruleTester } from '../rule-tester'

ruleTester.run('naming-convention', namingConvention, {
  valid: [
    {
      filename: 'src/components/user-card.tsx',
      code: 'export function UserCard() { return <div /> }',
    },
    {
      filename: 'src/hooks/use-scroll-sync.ts',
      code: 'export function useScrollSync() { return null }',
    },
    {
      filename: 'src/stores/sync-state-store.ts',
      code: 'export const syncStateStore = {}',
    },
    {
      filename: 'src/__tests__/scroll-sync.test.ts',
      code: 'test("works", () => {})',
    },
    {
      filename: 'src/generated/APIClient.ts',
      code: 'export const APIClient = {}',
      options: [{ ignore: ['src/generated/**'] }],
    },
  ],
  invalid: [
    {
      filename: 'src/components/UserCard.tsx',
      code: 'export function UserCard() { return <div /> }',
      errors: [{ messageId: 'fileName' }],
    },
    {
      filename: 'src/BadFolder/user-card.tsx',
      code: 'export function UserCard() { return <div /> }',
      errors: [{ messageId: 'directoryName' }],
    },
    {
      filename: 'src/hooks/use-scroll-sync.ts',
      code: 'export function usescrollsync() { return null }',
      errors: [{ messageId: 'hookName' }],
    },
    {
      filename: 'src/components/user-card.tsx',
      code: 'export function userCard() { return <div /> }',
      errors: [{ messageId: 'componentName' }],
    },
    {
      filename: 'src/stores/sync-state.ts',
      code: 'export const syncStateStore = {}',
      errors: [{ messageId: 'storeFileName' }],
    },
  ],
})
