---
name: Bug report
about: Incorrect flattenArray result, error, or input mutation
title: ""
labels: bug
---

## What went wrong

Describe the `flattenArray` call: the input, the optional `depth` if you passed one, and the result or error you got.

## Expected behavior

Behavior to preserve is documented in [CONTRIBUTING.md](../../CONTRIBUTING.md): integers only at visited leaves, optional depth, a `TypeError` for circular references, and no mutation of the input.

## Reproduction

```js
const flattenArray = require("./src/flattenArray");

// your call
```

## Environment

- Node.js version (`node -v`)
- Commit or package version

## Checklist

- [ ] I read [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [ ] I ran `npm test` if I can reproduce this in the repo
