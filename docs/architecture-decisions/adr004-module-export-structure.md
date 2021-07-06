---
id: adrs-adr004
title: ADR004: Module Export Structure
description: Architecture Decision Record (ADR) log on Module Export Structure
---

## Context

With a growing number of exports of packages like `@backstage/core-components`,
it is becoming more and more difficult to answer questions such as

> Is the export in this module also exported by the package?

or

> What is exported from this directory?

We currently do not use any pattern for how to structure exports. There is a mix
of package-level re-exports deep into the directory tree, shallow re-exports for
each directory, exports using `*` and explicit lists of each symbol, etc. The
mix and lack of predictability make it difficult to reason about the boundaries
of a module, and for example knowing whether it is safe to export a symbol in a
given file.

## Decision

We will make each exported symbol traceable through index files all the way down
to the root of the package, `src/index.ts`. Each index file will only re-export
from its own immediate directory children, and only index files will have
re-exports. This gives a file tree similar to this:

```text
index.ts
components/index.ts
          /ComponentX/index.ts
                     /ComponentX.tsx
                     /SubComponentY.tsx
lib/index.ts
   /UtilityX/index.ts
            /UtilityX.ts
            /helper.ts
```

To check whether for example `SubComponentY` is exported from the package, it
should be possible to traverse the index files towards the root, starting at the
adjacent one. If there is any index file that doesn't export the previous one,
the symbol is not publicly exported. For example, if
`components/ComponentX/index.ts` exports `SubComponentY`, but
`components/index.ts` does not re-export `./ComponentX`, one should be certain
that `SubComponentY` is not exported outside the package. This rule would be
broken if for example the root `index.ts` re-exports `./components/ComponentX`

In addition, index files that are re-exporting other index files should always
use wildcard form, that is:

```ts
// in components/index.ts
export * from './ComponentX';
```

Index files that are re-exporting symbols from non-index files should always
enumerate all exports, that is:

```ts
// in components/ComponentX/index.ts
export { ComponentX } from './ComponentX';
export type { ComponentXProps } from './ComponentX';
```

Internal cross-directory imports are allowed from non-index modules to index
modules, for example:

```ts
// in components/ComponentX/ComponentX.tsx
import { UtilityX } from '../../lib/UtilityX';
```

Imports that bypass an index file are discouraged, but may sometimes be
necessary, for example:

```ts
// in components/ComponentX/ComponentX.tsx
import { helperFunc } from '../../lib/UtilityX/helper';
```

## Consequences

We will actively work to rework the export structure in our codebase,
prioritizing the library packages such as `@backstage/core-components` and
`@backstage/backend-common`.

If possible, we will add tools, such as lint rules, to help enforce the export
structure.
