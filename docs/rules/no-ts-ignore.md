# jaemin/no-ts-ignore

Disallows `@ts-ignore`.

Use an explained `@ts-expect-error` when a TypeScript suppression is justified.

Bad:

```ts
// @ts-ignore
broken()
```

Good:

```ts
// @ts-expect-error explained: upstream package exposes the wrong type
broken()
```
