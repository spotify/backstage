---
id: adrs-adr006
title: "ADR006: Avoid React.FC and React.SFC"
description: Architecture Decision Record (ADR) log on Avoid React.FC and React.SFC
---
## Context

Facebook has removed `React.FC` from their base template for a TypeScript
project. The reason for this was that it was found to be an unnecessary feature
with next to no benefits in combination with a few downsides.

The main reasons were:

-   **children props** were implicitly added
-   **Generic Type** was not supported on children

Read more about the removal in
[this PR](https://github.com/facebook/create-react-app/pull/8177).

## Decision

To keep our codebase up to date, we have decided that `React.FC` and `React.SFC`
should be avoided in our codebase when adding new code.

Here is an example:

```typescript

/* Avoid this: */
type BadProps = { text: string };
const BadComponent: FC<BadProps> = ({ text, children }) => (
  <div>
    <div>{text}</div>
    {children}
  </div>
);

/* Do this instead: */
type GoodProps = { text: string; children?: React.ReactNode };
const GoodComponent = ({ text, children }: GoodProps) => (
  <div>
    <div>{text}</div>
    {children}
  </div>
);

/* Or as a shorthand, if no specifc child type is required */
type GoodProps = PropsWithChildren<{ text: string }>;
const GoodComponent = ({ text, children }: GoodProps) => (
  <div>
    <div>{text}</div>
    {children}
  </div>
);

```

## Consequences

We will gradually remove the current usage of `React.FC` and `React.SFC` from
our codebase.
