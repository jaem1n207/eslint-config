import { noEmptyCatchWithoutHandling } from '../../src/rules/no-empty-catch-without-handling'
import { ruleTester } from '../rule-tester'

ruleTester.run('no-empty-catch-without-handling', noEmptyCatchWithoutHandling, {
  valid: [
    'try { risky() } catch (error) { console.warn(error) }',
    'try { risky() } catch (error) { throw error }',
    'try { risky() } catch { fallback() }',
    'try { risky() } catch { /* intentional ignore: browser API may throw */ }',
    'try { risky() } catch { /* noop: best effort cleanup */ }',
    'try { risky() } catch { /* Gracefully handle unavailable sessionStorage */ }',
  ],
  invalid: [
    {
      code: 'try { risky() } catch (error) {}',
      errors: [{ messageId: 'emptyCatch' }],
    },
    {
      code: 'try { risky() } catch {}',
      errors: [{ messageId: 'emptyCatch' }],
    },
    {
      code: 'try { risky() } catch { ; }',
      errors: [{ messageId: 'emptyCatch' }],
    },
  ],
})
