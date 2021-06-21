---
id: adrs-adr010
title: "ADR010: Use the Luxon Date Library"
description: Architecture Decision Record (ADR) for Luxon Date Library
---
## Context

Date formatting (e.g. `a day ago`) and calculations are common within Backstage.
Some of these useful features are not supported by the standard JavaScript
`Date` object. The popular [Moment.js](https://momentjs.com/) library has been
commonly used to fill this gap but suffers from large bundle sizes and mutable
state issues. On top of this, `momentjs` is
[being sunset](https://momentjs.com/docs/#/-project-status/) and the project
recommends using one of the more modern alternative libraries.

See
[\[RFC\] Standardized Date & Time Library](https://github.com/backstage/backstage/issues/3401).

## Decision

We will use [Luxon](https://moment.github.io/luxon/index.html) as the standard
date library within Backstage.

`Luxon` provides a similar feature set and API to `Moment.js`, but improves on
its design through immutability and the usage of modern JavaScript APIs (e.g.
`Intl`). This results in smaller bundle sizes while providing a full feature set
and avoids the need for using additional libraries for common date & time tasks.

## Consequences

-   All core packages and plugins within Backstage should use `Luxon` for any date
    manipulation or formatting that cannot be easily accomplished with the native
    JavaScript `Date` object.
-   Using a single date library avoids having to learn multiple library APIs
-   Having a single date library will reduce bundle sizes
