---
id: call-existing-api
title: Call Existing API
# prettier-ignore: ""
description: Describes the various options that Backstage frontend plugins have, in communicating with service APIs that already exist
---

This article describes the various options that Backstage frontend plugins have,
in communicating with service APIs that already exist. Each section below
describes a possible choice, and the circumstances under which it fits.

In these examples, we will be ultimately requesting data from the fictional
FrobsCo API.

## Issuing Requests Directly

The most basic choice available is to issue requests directly from the plugin
frontend code to the FrobsCo API, using for example `fetch` or a support library
such as `axios`.

Example:

```ts
// Inside your component
fetch('https://api.frobsco.com/v1/list')
  .then(response => response.json())
  .then(payload => setFrobs(payload as Frob[]));
```

Internally at Spotify, this has not been a very common choice. Third party APIs
are sometimes accessed like this. Just a handful of internal APIs also went
through the trouble of exposing themselves in a way that is useful directly from
a browser, but even then, often not from the public internet but only supporting
users that are already on the company VPN.

This can be used when:

- The API already does/exposes exactly what you need.
- The request/response patterns of the API match real world usage needs in
  Backstage frontend plugins. For example, if the end use case is to show a
  small summary in Backstage, but the only available API endpoint gives a 30
  megabyte blob with large amounts of redundant information, it would hurt the
  end user experience. Particularly on mobile. The same goes for cases where you
  want to show many individual pieces of information: if a common use case is to
  show large tables where one API request per cell is necessary, the browser
  will quickly become swamped and you may want to consider performing
  aggregation elsewhere instead.
- The API can maintain interactive request/response times at your required peak
  request rates. The end user experience will be degraded if they spend a lot of
  time waiting for the data to arrive.
- The API endpoint is highly available. The browser does not have builtin
  facilities for load balancing, service discovery, retries, health checks,
  circuit breaking and similar. If the endpoint is occasionally down even for
  short periods of time (e.g. during deploys), end users will quickly notice.
- The API is exposed over HTTPS (not just HTTP), and properly handles
  [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). These are
  requirements that the user's browser will impose for security reasons, and the
  requests will be rejected otherwise.
- The API endpoint is easily reachable, in terms of network conditions, by end
  users. This may be particularly relevant if your end users are outside of your
  perimeter.
- The requests do not require secrets to be passed. This limitation does not
  apply to OAuth tokens, which the frontend can negotiate and make proper use
  of.

## Using The Backstage Proxy

Backstage has an optional proxy plugin for the backend, that can be used to
easily add proxy routes to downstream APIs.

Example:

```yaml
# In app-config.yaml
proxy:
  '/frobs': http://api.frobsco.com/v1
```

```ts
// Inside your component
const backendUrl = config.getString('backend.baseUrl');
fetch(`${backendUrl}/proxy/frobs/list`)
  .then(response => response.json())
  .then(payload => setFrobs(payload as Frob[]));
```

The proxy is powered by the `http-proxy-middleware` package. See
[Proxying](proxying.md) for a full description of its configuration options.

Internally at Spotify, the proxy option has been the overwhelmingly most popular
choice for plugin makers. Since we have DNS-based service discovery in place and
a microservices framework that made it trivial to expose plain HTTP, it has been
a matter of just adding a few lines of Backstage config to get the benefit of
being easily and robustly reachable from users' web browsers as well.

This may be used instead of direct requests, when:

- You need to perform HTTPS termination and/or CORS handling, because the API
  itself is not supplying those.
- You need to inject a simple static secret into the requests, e.g. an
  Authorization header that gets added to the request headers.
- You want to make use of other proxy facilities, such as retries, failover,
  health checks, routing, request logging, rewrites, etc.
- You already have the Backstage backend itself exposed through your perimeter
  and find it practical to have only one entry point to deal with, governing
  ingress with just the Backstage config.

## Creating a Backstage Backend Plugin

Much like the Backstage frontend, the Backstage backend also has a plugin
system. The above mentioned proxy is actually one such plugin. If you were in
need of a more involved integration than just direct access to the FrobsCo API,
or if you needed to hold state, you may want to make such a plugin.

Example:

```ts
// Inside your component
const backendUrl = config.getString('backend.baseUrl');
fetch(`${backendUrl}/frobs-aggregator/summary`)
  .then(response => response.json())
  .then(payload => setSummary(payload as FrobSummary));
```

```ts
// Inside a new frobs-aggregator backend plugin
router.use('/summary', async (req, res) => {
  const agg = await Promise.all([
    fetch('https://api.frobsco.com/v1/list'),
    fetch('http://flerps.partnercompany.com:8080/flerp-batch'),
    database.currentThunk(),
  ]).then(async ([frobs, flerps, thunk]) => {
    return computeAggregate(await frobs.json(), await flerps.json(), thunk);
  });
  res.status(200).send(agg);
});
```

For a more detailed example, see
[the lighthouse plugin](https://github.com/backstage/backstage/tree/master/plugins/lighthouse)
that stores some state in a database and adds new capabilities to the underlying
API.

Internally at Spotify, this has been a fairly popular choice for different
reasons. Commonly, the backend has been used as a caching and data massaging
layer for slow APIs or APIs whose request/response shapes or speeds were not
acceptable for direct use by frontends. For example, this has made it possible
to issue efficient batch queries from the frontend, e.g. in big lists or tables
that want to resolve a lot of sparse data from the larger list that an
underlying service supplies.

This may be used instead of the above, when:

- You need to perform complex model conversion, or protocol translation beyond
  what the proxy handles.
- You want to perform aggregations or summaries on the backend instead of on the
  frontend.
- You want to enable batching or caching of slower or more unreliable APIs.
- You need to maintain state for your plugin, perhaps using the builtin database
  support in the backend.
- You need to inject secrets or in other ways negotiate with other parts of the
  API or other services in order to perform your work.
- You want to enforce end user authentication / authorization for operations on
  behalf of the API, have session handling, or similar.

There is a balance to strike regarding when to make an entirely separate backend
for a purpose, and when to make a Backstage backend plugin that adapts something
that already exists. General advice is not easy to give, but contact us on
Discord if you have any questions, and we may be able to offer guidance.

## Extending the GraphQL Model

The extensible GraphQL backend layer is not built yet. This section will be
expanded when that happens. Stay tuned!
