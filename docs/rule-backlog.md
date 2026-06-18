# Rule Backlog

## P0 Implemented For v0.1

- `jaemin/no-ts-ignore`
- `jaemin/no-as-any`
- `jaemin/no-empty-catch-without-handling`
- `jaemin/no-focused-or-skipped-tests`
- `jaemin/naming-convention`

## P1 Candidates

### jaemin/no-unsafe-eslint-disable

Status: candidate
Signal: `eslint-disable` without an explanation.
Default: agent=warn
False positive risk: medium

### jaemin/require-ime-composition-guard

Status: candidate
Signal: keyboard handlers in text inputs that do not check CJK IME composition state.
Default: agent=warn
False positive risk: medium

### jaemin/no-async-scroll-handler

Status: candidate
Signal: scroll handlers containing `await`.
Default: agent=warn
False positive risk: medium

### jaemin/require-passive-scroll-listener

Status: candidate
Signal: scroll or touch event listeners without passive options.
Default: agent=warn
False positive risk: medium

### jaemin/no-relative-parent-imports

Status: candidate
Signal: parent-directory imports in projects that prefer aliases.
Default: naming=warn
False positive risk: high

### jaemin/require-barrel-export

Status: candidate
Signal: public directory imports that bypass an `index.ts` barrel.
Default: naming=warn
False positive risk: high
