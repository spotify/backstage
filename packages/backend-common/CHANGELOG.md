# @backstage/backend-common

## 0.8.1

### Patch Changes

- c7dad9218: All cache-related connection errors are now handled and logged by the cache manager. App Integrators may provide an optional error handler when instantiating the cache manager if custom error handling is needed.

  ```typescript
  // Providing an error handler
  const cacheManager = CacheManager.fromConfig(config, {
    onError: e => {
      if (isSomehowUnrecoverable(e)) {
        gracefullyShutThingsDown();
        process.exit(1);
      }
    },
  });
  ```

- 65e6c4541: Remove circular dependencies
- 5001de908: Change GitlabUrlReader to SHA timestamp compare using only commits that modify given file path, if file path given
- Updated dependencies [65e6c4541]
- Updated dependencies [290405276]
  - @backstage/integration@0.5.3
  - @backstage/config-loader@0.6.2

## 0.8.0

### Minor Changes

- 22fd8ce2a: Introducing: a standard API for App Integrators to configure cache stores and Plugin Developers to interact with them.

  Two cache stores are currently supported.

  - `memory`, which is a very simple in-memory key/value store, intended for local development.
  - `memcache`, which can be used to connect to a memcache host.

  Configuring and working with cache stores is very similar to the process for database connections.

  ```yaml
  backend:
    cache:
      store: memcache
      connection: user:pass@cache.example.com:11211
  ```

  ```typescript
  import { CacheManager } from '@backstage/backend-common';

  // Instantiating a cache client for a plugin.
  const cacheManager = CacheManager.fromConfig(config);
  const somePluginCache = cacheManager.forPlugin('somePlugin');
  const cacheClient = somePluginCache.getClient();

  // Using the cache client:
  const cachedValue = await cacheClient.get('someKey');
  if (cachedValue) {
    return cachedValue;
  } else {
    const someValue = await someExpensiveProcess();
    await cacheClient.set('someKey', someValue);
  }
  await cacheClient.delete('someKey');
  ```

  Cache clients deal with TTLs in milliseconds. A TTL can be provided as a defaultTtl when getting a client, or may be passed when setting specific objects. If no TTL is provided, data will be persisted indefinitely.

  ```typescript
  // Getting a client with a default TTL
  const cacheClient = somePluginCache.getClient({
    defaultTtl: 3600000,
  });

  // Setting a TTL on a per-object basis.
  cacheClient.set('someKey', data, { ttl: 3600000 });
  ```

  Configuring a cache store is optional. Even when no cache store is configured, the cache manager will dutifully pass plugins a manager that resolves a cache client that does not actually write or read any data.

### Patch Changes

- f9fb4a205: Prep work for mysql support in backend-common

## 0.7.0

### Minor Changes

- e0bfd3d44: Refactor the `runDockerContainer(…)` function to an interface-based api.
  This gives the option to replace the docker runtime in the future.

  Packages and plugins that previously used the `dockerode` as argument should be migrated to use the new `ContainerRunner` interface instead.

  ```diff
    import {
  -   runDockerContainer,
  +   ContainerRunner,
      PluginEndpointDiscovery,
    } from '@backstage/backend-common';
  - import Docker from 'dockerode';

    type RouterOptions = {
      // ...
  -   dockerClient: Docker,
  +   containerRunner: ContainerRunner;
    };

    export async function createRouter({
      // ...
  -   dockerClient,
  +   containerRunner,
    }: RouterOptions): Promise<express.Router> {
      // ...

  +   await containerRunner.runContainer({
  -   await runDockerContainer({
        image: 'docker',
        // ...
  -     dockerClient,
      });

      // ...
    }
  ```

  To keep the `dockerode` based runtime, use the `DockerContainerRunner` implementation:

  ```diff
  + import {
  +   ContainerRunner,
  +   DockerContainerRunner
  + } from '@backstage/backend-common';
  - import { runDockerContainer } from '@backstage/backend-common';

  + const containerRunner: ContainerRunner = new DockerContainerRunner({dockerClient});
  + await containerRunner.runContainer({
  - await runDockerContainer({
      image: 'docker',
      // ...
  -   dockerClient,
    });
  ```

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/integration@0.5.2
  - @backstage/config-loader@0.6.1
  - @backstage/config@0.1.5

## 0.6.3

### Patch Changes

- d367f63b5: remove use of deprecated type HelmetOptions
- b42531cfe: Support configuration of file storage for SQLite databases. Every plugin has its
  own database file at the specified path.

## 0.6.2

### Patch Changes

- b779b5fee: Add UrlReader for Google Cloud Storage
- Updated dependencies [82c66b8cd]
  - @backstage/config-loader@0.6.0

## 0.6.1

### Patch Changes

- 37e3a69f5: Export `ReadTreeResponseFile` and `SearchResponseFile`.

## 0.6.0

### Minor Changes

- 8686eb38c: Encode thrown errors in the backend as a JSON payload. This is technically a breaking change, since the response format even of errors are part of the contract. If you relied on the response being text, you will now have some extra JSON "noise" in it. It should still be readable by end users though.

  Before:

  ```
  NotFoundError: No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'
      at eval (webpack-internal:///../../plugins/catalog-backend/src/service/router.ts:117:17)
  ```

  After:

  ```json
  {
    "error": {
      "name": "NotFoundError",
      "message": "No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'",
      "stack": "NotFoundError: No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'\n    at eval (webpack-internal:///../../plugins/catalog-backend/src/service/router.ts:117:17)"
    },
    "request": {
      "method": "GET",
      "url": "/entities/by-name/user/default/tara.macgovern2"
    },
    "response": {
      "statusCode": 404
    }
  }
  ```

- 8686eb38c: Removed the custom error types (e.g. `NotFoundError`). Those are now instead in the new `@backstage/errors` package. This is a breaking change, and you will have to update your imports if you were using these types.

  ```diff
  -import { NotFoundError } from '@backstage/backend-common';
  +import { NotFoundError } from '@backstage/errors';
  ```

### Patch Changes

- Updated dependencies [0434853a5]
  - @backstage/config@0.1.4

## 0.5.6

### Patch Changes

- d7245b733: Add a utility function runDockerContainer used to run a docker container (currently used by Scaffolder and TechDocs for their 'generate' processes)
- 761698831: Bump to the latest version of the Knex library.

  You will most likely want to bump your own `packages/backend/package.json` as well:

  ```diff
  -    "knex": "^0.21.18",
  +    "knex": "^0.95.1",
  ```

  Note that the recent versions of the Knex library have some changes that may affect your internal plugins' database migration files. Importantly, they now support `ALTER TABLE` on SQLite, and no longer accidentally remove indices when making some modifications. It now also exports the `Knex` typescript type as a named export.

  ```ts
  import { Knex } from 'knex';
  ```

- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [905cbfc96]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1

## 0.5.5

### Patch Changes

- 497859088: Add optional `logClientErrors` to errorHandler to log 4XX errors
- 8adb48df4: Change debug log format to print as color grey

## 0.5.4

### Patch Changes

- 16fb1d03a: pass registered logger to requestLoggingHandler
- 491f3a0ec: Implement `UrlReader.search` for the other providers (Azure, Bitbucket, GitLab) as well.

  The `UrlReader` subclasses now are implemented in terms of the respective `Integration` class.

- 434b4e81a: Support globs in `FileReaderProcessor`.
- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- Updated dependencies [491f3a0ec]
  - @backstage/integration@0.5.0

## 0.5.3

### Patch Changes

- ffffea8e6: Minor updates to reflect the changes in `@backstage/integration` that made the fields `apiBaseUrl` and `apiUrl` mandatory.
- 82b2c11b6: Set explicit content-type in error handler responses.
- 965e200c6: Slight refactoring in support of a future search implementation in `UrlReader`. Mostly moving code around.
- 5a5163519: Implement `UrlReader.search` which implements glob matching.
- Updated dependencies [ffffea8e6]
  - @backstage/integration@0.4.0

## 0.5.2

### Patch Changes

- 2430ee7c2: Updated the `rootLogger` in `@backstage/backend-common` to support custom logging options. This is useful when you want to make some changes without re-implementing the entire logger and calling `setRootLogger` or `logger.configure`. For example you can add additional `defaultMeta` tags to each log entry. The following changes are included:

  - Added `createRootLogger` which accepts winston `LoggerOptions`. These options allow overriding the default keys.

  Example Usage:

  ```ts
  // Create the logger
  const logger = createRootLogger({
    defaultMeta: { appName: 'backstage', appEnv: 'prod' },
  });

  // Add a custom logger transport
  logger.add(new MyCustomTransport());

  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(), // already set to new logger instance
  });
  ```

- Updated dependencies [c4abcdb60]
- Updated dependencies [062df71db]
- Updated dependencies [064c513e1]
- Updated dependencies [e9aab60c7]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
  - @backstage/integration@0.3.2
  - @backstage/config-loader@0.5.1

## 0.5.1

### Patch Changes

- 26a3a6cf0: Honor the branch ref in the url when cloning.

  This fixes a bug in the scaffolder prepare stage where a non-default branch
  was specified in the scaffolder URL but the default branch was cloned.
  For example, even though the `other` branch is specified in this example, the
  `master` branch was actually cloned:

  ```yaml
  catalog:
    locations:
      - type: url
        target: https://github.com/backstage/backstage/blob/other/plugins/scaffolder-backend/sample-templates/docs-template/template.yaml
  ```

  This also fixes a 404 in the prepare stage for GitLab URLs.

- 664dd08c9: URL Reader's readTree: Fix bug with github.com URLs.
- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
- Updated dependencies [ef7957be4]
  - @backstage/integration@0.3.1
  - @backstage/config-loader@0.5.0

## 0.5.0

### Minor Changes

- 5345a1f98: Remove fallback option from `UrlReaders.create` and `UrlReaders.default`, as well as the default fallback reader.

  To be able to read data from endpoints outside of the configured integrations, you now need to explicitly allow it by
  adding an entry in the `backend.reading.allow` list. For example:

  ```yml
  backend:
    baseUrl: ...
    reading:
      allow:
        - host: example.com
        - host: '*.examples.org'
  ```

  Apart from adding the above configuration, most projects should not need to take any action to migrate existing code. If you do happen to have your own fallback reader configured, this needs to be replaced with a reader factory that selects a specific set of URLs to work with. If you where wrapping the existing fallback reader, the new one that handles the allow list is created using `FetchUrlReader.factory`.

- 09a370426: Remove support for HTTPS certificate generation parameters. Use `backend.https = true` instead.

### Patch Changes

- 0b135e7e0: Add support for GitHub Apps authentication for backend plugins.

  `GithubCredentialsProvider` requests and caches GitHub credentials based on a repository or organization url.

  The `GithubCredentialsProvider` class should be considered stateful since tokens will be cached internally.
  Consecutive calls to get credentials will return the same token, tokens older than 50 minutes will be considered expired and reissued.
  `GithubCredentialsProvider` will default to the configured access token if no GitHub Apps are configured.

  More information on how to create and configure a GitHub App to use with backstage can be found in the documentation.

  Usage:

  ```javascript
  const credentialsProvider = new GithubCredentialsProvider(config);
  const { token, headers } = await credentialsProvider.getCredentials({
    url: 'https://github.com/',
  });
  ```

  Updates `GithubUrlReader` to use the `GithubCredentialsProvider`.

- 294a70cab: 1. URL Reader's `readTree` method now returns an `etag` in the response along with the blob. The etag is an identifier of the blob and will only change if the blob is modified on the target. Usually it is set to the latest commit SHA on the target.

  `readTree` also takes an optional `etag` in its options and throws a `NotModifiedError` if the etag matches with the etag of the resource.

  So, the `etag` can be used in building a cache when working with URL Reader.

  An example -

  ```ts
  const response = await reader.readTree(
    'https://github.com/backstage/backstage',
  );

  const etag = response.etag;

  // Will throw a new NotModifiedError (exported from @backstage/backstage-common)
  await reader.readTree('https://github.com/backstage/backstage', {
    etag,
  });
  ```

  2. URL Reader's readTree method can now detect the default branch. So, `url:https://github.com/org/repo/tree/master` can be replaced with `url:https://github.com/org/repo` in places like `backstage.io/techdocs-ref`.

- 0ea032763: URL Reader: Use API response headers for archive filename in readTree. Fixes bug for users with hosted Bitbucket.
- Updated dependencies [0b135e7e0]
- Updated dependencies [fa8ba330a]
- Updated dependencies [ed6baab66]
  - @backstage/integration@0.3.0

## 0.4.3

### Patch Changes

- Updated dependencies [466354aaa]
  - @backstage/integration@0.2.0

## 0.4.2

### Patch Changes

- 5ecd50f8a: Fix HTTPS certificate generation and add new config switch, enabling it simply by setting `backend.https = true`. Also introduces caching of generated certificates in order to avoid having to add a browser override every time the backend is restarted.
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- 0829ff126: Tweaked development log formatter to include extra fields at the end of each log line
- 036a84373: Provide support for on-prem azure devops
- Updated dependencies [ad5c56fd9]
- Updated dependencies [036a84373]
  - @backstage/config-loader@0.4.1
  - @backstage/integration@0.1.5

## 0.4.1

### Patch Changes

- 1d1c2860f: Implement readTree on BitBucketUrlReader and getBitbucketDownloadUrl
- 4eafdec4a: Introduce readTree method for GitLab URL Reader
- Updated dependencies [1d1c2860f]
- Updated dependencies [4eafdec4a]
- Updated dependencies [178e09323]
  - @backstage/integration@0.1.4

## 0.4.0

### Minor Changes

- 12bbd748c: Removes the Prometheus integration from `backend-common`.

  Rational behind this change is to keep the metrics integration of Backstage
  generic. Instead of directly relying on Prometheus, Backstage will expose
  metrics in a generic way. Integrators can then export the metrics in their
  desired format. For example using Prometheus.

  To keep the existing behavior, you need to integrate Prometheus in your
  backend:

  First, add a dependency on `express-prom-bundle` and `prom-client` to your backend.

  ```diff
  // packages/backend/package.json
    "dependencies": {
  +   "express-prom-bundle": "^6.1.0",
  +   "prom-client": "^12.0.0",
  ```

  Then, add a handler for metrics and a simple instrumentation for the endpoints.

  ```typescript
  // packages/backend/src/metrics.ts
  import { useHotCleanup } from '@backstage/backend-common';
  import { RequestHandler } from 'express';
  import promBundle from 'express-prom-bundle';
  import prom from 'prom-client';
  import * as url from 'url';

  const rootRegEx = new RegExp('^/([^/]*)/.*');
  const apiRegEx = new RegExp('^/api/([^/]*)/.*');

  export function normalizePath(req: any): string {
    const path = url.parse(req.originalUrl || req.url).pathname || '/';

    // Capture /api/ and the plugin name
    if (apiRegEx.test(path)) {
      return path.replace(apiRegEx, '/api/$1');
    }

    // Only the first path segment at root level
    return path.replace(rootRegEx, '/$1');
  }

  /**
   * Adds a /metrics endpoint, register default runtime metrics and instrument the router.
   */
  export function metricsHandler(): RequestHandler {
    // We can only initialize the metrics once and have to clean them up between hot reloads
    useHotCleanup(module, () => prom.register.clear());

    return promBundle({
      includeMethod: true,
      includePath: true,
      // Using includePath alone is problematic, as it will include path labels with high
      // cardinality (e.g. path params). Instead we would have to template them. However, this
      // is difficult, as every backend plugin might use different routes. Instead we only take
      // the first directory of the path, to have at least an idea how each plugin performs:
      normalizePath,
      promClient: { collectDefaultMetrics: {} },
    });
  }
  ```

  Last, extend your router configuration with the `metricsHandler`:

  ```diff
  +import { metricsHandler } from './metrics';

  ...

    const service = createServiceBuilder(module)
      .loadConfig(config)
      .addRouter('', await healthcheck(healthcheckEnv))
  +   .addRouter('', metricsHandler())
      .addRouter('/api', apiRouter);
  ```

  Your Prometheus metrics will be available at the `/metrics` endpoint.

### Patch Changes

- 38e24db00: Move the core url and auth logic to integration for the four major providers
- Updated dependencies [38e24db00]
- Updated dependencies [b8ecf6f48]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/integration@0.1.3
  - @backstage/config@0.1.2

## 0.3.3

### Patch Changes

- 612368274: Allow the `backend.listen.port` config to be both a number or a string.
- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
  - @backstage/config-loader@0.4.0

## 0.3.2

### Patch Changes

- 3aa7efb3f: Added support for passing false as a CSP field value, to drop it from the defaults in the backend
- b3d4e4e57: Move the frontend visibility declarations of integrations config from @backstage/backend-common to @backstage/integration
- Updated dependencies [b3d4e4e57]
  - @backstage/integration@0.1.2

## 0.3.1

### Patch Changes

- bff3305aa: Added readTree support to AzureUrlReader
- b47dce06f: Make integration host and url configurations visible in the frontend

## 0.3.0

### Minor Changes

- 1722cb53c: Added support for loading and validating configuration schemas, as well as declaring config visibility through schemas.

  The new `loadConfigSchema` function exported by `@backstage/config-loader` allows for the collection and merging of configuration schemas from all nearby dependencies of the project.

  A configuration schema is declared using the `https://backstage.io/schema/config-v1` JSON Schema meta schema, which is based on draft07. The only difference to the draft07 schema is the custom `visibility` keyword, which is used to indicate whether the given config value should be visible in the frontend or not. The possible values are `frontend`, `backend`, and `secret`, where `backend` is the default. A visibility of `secret` has the same scope at runtime, but it will be treated with more care in certain contexts, and defining both `frontend` and `secret` for the same value in two different schemas will result in an error during schema merging.

  Packages that wish to contribute configuration schema should declare it in a root `"configSchema"` field in `package.json`. The field can either contain an inlined JSON schema, or a relative path to a schema file. Schema files can be in either `.json` or `.d.ts` format.

  TypeScript configuration schema files should export a single `Config` type, for example:

  ```ts
  export interface Config {
    app: {
      /**
       * Frontend root URL
       * @visibility frontend
       */
      baseUrl: string;
    };
  }
  ```

- 8e2effb53: Refactored UrlReader.readTree to be required and accept (url, options)

### Patch Changes

- 1722cb53c: Added configuration schema
- 7b37e6834: Added the integration package
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
  - @backstage/config-loader@0.3.0
  - @backstage/integration@0.1.1
  - @backstage/test-utils@0.1.3

## 0.2.1

### Patch Changes

- 33b7300eb: Capture plugin name under the /api/ prefix for http metrics

## 0.2.0

### Minor Changes

- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 56e4eb589: Make CSP configurable to fix app-backend served app not being able to fetch

  See discussion [here on discord](https://discordapp.com/channels/687207715902193673/687235481154617364/758721460163575850)

- e37c0a005: Use localhost to fall back to IPv4 if IPv6 isn't available
- f00ca3cb8: Auto-create plugin databases

  Relates to #1598.

  This creates databases for plugins before handing off control to plugins.

  The list of plugins currently need to be hard-coded depending on the installed plugins. A later PR will properly refactor the code to provide a factory pattern where plugins specify what they need, and Knex instances will be provided based on the input.

- 6579769df: Add the ability to import components from Bitbucket Server to the service catalog
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 8afce088a: Use APP_ENV before NODE_ENV for determining what config to load
- 7bbeb049f: Change loadBackendConfig to return the config directly

### Patch Changes

- 440a17b39: Added new UrlReader interface for reading opaque data from URLs with different providers.

  This new URL reading system is intended as a replacement for the various integrations towards
  external systems in the catalog, scaffolder, and techdocs. It is configured via a new top-level
  config section called 'integrations'.

  Along with the UrlReader interface is a new UrlReaders class, which exposes static factory
  methods for instantiating readers that can read from many different integrations simultaneously.

- Updated dependencies [8c2b76e45]
- Updated dependencies [ce5512bc0]
  - @backstage/config-loader@0.2.0
  - @backstage/test-utils@0.1.2
