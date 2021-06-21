---
id: adrs-adr003
title: "ADR003: Avoid Default Exports and Prefer Named Exports"
description: Architecture Decision Record (ADR) log on Avoid Default Exports and Prefer Named Exports
---
## Context

When CommonJS was the primary authoring format, the best practice was to export
only one thing from a module using the `module.exports = ...` format. This
aligned with the
[UNIX philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) of "Do one
thing well". The module would be consumed
(`const localName = require('the-module');`) without having to know the internal
structure.

Now, ESModules are the primary authoring format. They have numerous benefits,
such as compile-time verification of exports, and standards-defined semantics.
They have a similar mechanism known as "default exports", which allows for a
consumer to `import localName from 'the-module';`. This is implicitly the same
as `import { default as localName } from 'the-module';`.

However, there are numerous reasons to avoid default exports, as documented by
others before:

-   https:

A summary:

-   They add indirection by encouraging a developer to create local names for
    modules, increasing cognitive load and slowing down code comprehension:
    ``.
-   They thwart tools, such as IDEs, that can automatically rename and refactor
    code.
-   They promote typos and mistakes, as the imported member is completely up to
    the consuming developer to define.
-   They are ugly in CommonJS interop, as the default property must be manually
    specified by the consumer. This is often hidden by Babel's module interop.
-   They break re-exports due to name conflicts, forcing the developer to manually
    name each.

Using named exports helps prevent needing to rename symbols, which has myriad
benefits. A few are:

-   IDE tools like "Find All References" and "Go To Definition" function
-   Manual codebase searching ("grep", etc) is easier with a unique symbol

## Decision

We will stop using default exports except when absolutely necessary (such as
[``](https://reactjs.org/docs/code-splitting.html#reactlazy) modules).
A workaround exists for those that would prefer to never use ``:

```ts



```

## Consequences

We will actively work to remove them from our codebases, being as explicit as
possible. Have a connected component?
``.

We will add tools, such as lint rules, to help migrate away from default
exports.
