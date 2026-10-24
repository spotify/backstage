# @backstage/backend-defaults

## 0.18.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0
  - @backstage/backend-app-api@1.9.0-next.0

## 0.18.1

### Patch Changes

- c478470: Added a service-authenticated action registry status endpoint that reports whether a plugin provides actions without exposing action metadata.
- f6054ac: Backends created with `createBackend` now provide the experimental connections service by default. Custom backends can install `connectionsServiceFactory` from `@backstage/backend-defaults/alpha`.
- e956084: Added an `instanceId` option to `createBackend`, allowing deployments to use an externally provided backend instance identifier. Each backend instance uses a random UUID by default.
- 1939ded: Added bounded retries for transient failures while initializing Cloud SQL database connections.
- a6bc5e4: Stopped issuing periodic per-plugin database keepalive queries by default and changed the default minimum PostgreSQL and MySQL connection pool size to zero. Idle connections can now be retired after the configured timeout, while explicitly configured pool minimums are preserved. Set `backend.database.keepalive: true` to continue issuing the periodic queries.
- bd1ff39: Fixed AWS RDS IAM authentication tokens being reused after their signing credentials expire, which could cause database connection failures when using temporary AWS credentials.
- 6887ecc: Updated dependency `infinispan` to `^0.16.0`.
- 495ef24: Added support for `backend.logger.redactAllowlist` configuration option, which allows specific secret values to pass through log redaction when they are known to be safe to log.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/integration@2.1.3
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/backend-app-api@1.8.0
  - @backstage/config-loader@1.11.4
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/connections@0.4.1
  - @backstage/plugin-auth-node@0.7.7
  - @backstage/integration-aws-node@0.2.3
  - @backstage/plugin-events-node@0.4.27
  - @backstage/plugin-permission-common@0.9.12
  - @backstage/plugin-permission-node@0.11.5

## 0.18.1-next.3

### Patch Changes

- f6054ac: Backends created with `createBackend` now provide the experimental connections service by default. Custom backends can install `connectionsServiceFactory` from `@backstage/backend-defaults/alpha`.
- bd1ff39: Fixed AWS RDS IAM authentication tokens being reused after their signing credentials expire, which could cause database connection failures when using temporary AWS credentials.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.2
  - @backstage/backend-app-api@1.8.0-next.2

## 0.18.1-next.2

### Patch Changes

- a6bc5e4: Stopped issuing periodic per-plugin database keepalive queries by default and changed the default minimum PostgreSQL and MySQL connection pool size to zero. Idle connections can now be retired after the configured timeout, while explicitly configured pool minimums are preserved. Set `backend.database.keepalive: true` to continue issuing the periodic queries.
- Updated dependencies
  - @backstage/cli-node@0.3.5-next.1
  - @backstage/integration@2.1.3-next.1

## 0.18.1-next.1

### Patch Changes

- c478470: Added a service-authenticated action registry status endpoint that reports whether a plugin provides actions without exposing action metadata.
- e956084: Added an `instanceId` option to `createBackend`, allowing deployments to use an externally provided backend instance identifier. Each backend instance uses a random UUID by default.
- 1939ded: Added bounded retries for transient failures while initializing Cloud SQL database connections.
- 6887ecc: Updated dependency `infinispan` to `^0.16.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-app-api@1.8.0-next.1
  - @backstage/plugin-auth-node@0.7.7-next.1
  - @backstage/plugin-events-node@0.4.27-next.1
  - @backstage/plugin-permission-node@0.11.5-next.1

## 0.18.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/integration@2.1.3-next.0
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-app-api@1.7.5-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/config-loader@1.11.4-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-permission-node@0.11.5-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## 0.18.0

### Minor Changes

- 2e07985: Add schemaPrefix configuration for pluginDivisionMode: schema. Allows prefixing PostgreSQL schema names to avoid conflicts with existing schemas.

### Patch Changes

- fe6ace6: Fixed `AwsS3UrlReader` and `AwsCodeCommitUrlReader` to resolve account-specific AWS credentials when an assume role ARN is configured, enabling support for `webIdentityTokenFile` and `accountDefaults` in environments without default AWS credentials.
- 45d760b: Improve action handling consistency.
- 8d71644: Reduced PostgreSQL connection churn during backend startup when many plugins initialize databases or schemas.
- 416be1b: Updated Harness URL reading to validate cross-origin redirect destinations
  against `backend.reading.allow`.
- c59472e: Plugin route registration now rejects paths that differ only by letter casing,
  and HTTP credentials are resolved independently for each plugin service instance.
- 5aac521: Improved service credential handling during plugin-to-plugin delegation.
- 61449ae: Reduced PostgreSQL startup connections when multiple plugins share a database by reusing the database existence check.
- 55f30b8: Reduced scheduler database polling overhead by batching readiness checks for global tasks registered by each plugin into one query per poll cycle on each backend instance.
- 8b3c83e: Improved input validation and path handling for cloud storage URL readers.
- 61d97c0: Improved input validation for cloud storage URL readers.
- e895def: Fixed handling of GitLab URLs for instances configured with a relative base path.
- f6f339e: Fixed redundant signing-key requests when concurrently authenticating the first incoming requests from a plugin. Concurrent requests now share the same key cache, including when retrying after an initial fetch failure.
- e13e278: Updated URL reader allow list matching so configured paths match either the exact path or paths below it at a segment boundary.
- e3b587c: Improve authentication reliability during signing key rotation by performing budgeted JWKS reloads when a newly published key is requested during the remote key set cooldown.
- Updated dependencies
  - @backstage/integration@2.1.2
  - @backstage/plugin-auth-node@0.7.6
  - @backstage/config@1.3.9
  - @backstage/backend-app-api@1.7.4
  - @backstage/plugin-permission-node@0.11.4
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/config-loader@1.11.3
  - @backstage/integration-aws-node@0.2.2
  - @backstage/plugin-events-node@0.4.26
  - @backstage/plugin-permission-common@0.9.11

## 0.17.9-next.1

### Patch Changes

- 55f30b8: Reduced scheduler database polling overhead by batching readiness checks for global tasks registered by each plugin into one query per poll cycle on each backend instance.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/backend-app-api@1.7.4-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/config-loader@1.11.3-next.0
  - @backstage/integration@2.1.2-next.1
  - @backstage/integration-aws-node@0.2.2-next.0
  - @backstage/plugin-auth-node@0.7.5-next.1
  - @backstage/plugin-permission-common@0.9.11-next.0
  - @backstage/plugin-permission-node@0.11.4-next.1

## 0.17.9-next.0

### Patch Changes

- 45d760b: Improve action handling consistency.
- 8d71644: Reduced PostgreSQL connection churn during backend startup when many plugins initialize databases or schemas.
- 416be1b: Updated Harness URL reading to validate cross-origin redirect destinations
  against `backend.reading.allow`.
- 5aac521: Improved service credential handling during plugin-to-plugin delegation.
- 61449ae: Reduced PostgreSQL startup connections when multiple plugins share a database by reusing the database existence check.
- 8b3c83e: Improved input validation and path handling for cloud storage URL readers.
- 61d97c0: Improved input validation for cloud storage URL readers.
- e895def: Fixed handling of GitLab URLs for instances configured with a relative base path.
- e13e278: Updated URL reader allow list matching so configured paths match either the exact path or paths below it at a segment boundary.
- e3b587c: Improve authentication reliability during signing key rotation by performing budgeted JWKS reloads when a newly published key is requested during the remote key set cooldown.
- Updated dependencies
  - @backstage/integration@2.1.2-next.0
  - @backstage/backend-app-api@1.7.4-next.0
  - @backstage/plugin-auth-node@0.7.5-next.0
  - @backstage/plugin-permission-node@0.11.4-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 0.17.7

### Patch Changes

- 79c1d58: Fixed a bug in the Azure DevOps URL reader where the abort signal was not forwarded to the commits API fetch, causing the fetch to hang indefinitely when a build timeout or cancellation was triggered.
- b1b6c80: Read-only actions now default to non-destructive when the destructive attribute is omitted.
- 78bf918: chore(deps): bump `tar` from 7.5.15 to 7.5.21
- bb98419: TypeScript configuration schema warnings discovered while setting up secret redaction are now reported through the Backstage logger.
- 74d8cbf: Added a new public `@backstage/backend-defaults/rootSystemMetadata` entrypoint, exporting `rootSystemMetadataServiceFactory` and `DefaultRootSystemMetadataService`. The system metadata service is now registered automatically as a default service, so backends no longer need to add it manually.
- e56d23c: Throw an error when `payload.uip` is missing in `createLimitedUserToken` instead of constructing an invalid limited token with an undefined signature.
- Updated dependencies
  - @backstage/backend-app-api@1.7.3
  - @backstage/config-loader@1.11.2
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-auth-node@0.7.4
  - @backstage/integration@2.1.0
  - @backstage/integration-aws-node@0.2.1
  - @backstage/plugin-permission-common@0.9.10
  - @backstage/plugin-permission-node@0.11.3
  - @backstage/plugin-events-node@0.4.25

## 0.17.7-next.2

### Patch Changes

- b1b6c80: Read-only actions now default to non-destructive when the destructive attribute is omitted.
- 78bf918: chore(deps): bump `tar` from 7.5.15 to 7.5.21
- bb98419: TypeScript configuration schema warnings discovered while setting up secret redaction are now reported through the Backstage logger.
- Updated dependencies
  - @backstage/config-loader@1.11.2-next.0
  - @backstage/backend-plugin-api@1.10.0-next.1

## 0.17.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@2.1.0-next.0

## 0.17.6-next.0

### Patch Changes

- 79c1d58: Fixed a bug in the Azure DevOps URL reader where the abort signal was not forwarded to the commits API fetch, causing the fetch to hang indefinitely when a build timeout or cancellation was triggered.
- 74d8cbf: Added a new public `@backstage/backend-defaults/rootSystemMetadata` entrypoint, exporting `rootSystemMetadataServiceFactory` and `DefaultRootSystemMetadataService`. The system metadata service is now registered automatically as a default service, so backends no longer need to add it manually.
- Updated dependencies
  - @backstage/backend-app-api@1.7.3-next.0
  - @backstage/plugin-auth-node@0.7.4-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-permission-node@0.11.3-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 0.17.5

### Patch Changes

- aaa7d65: Improved readability of the AWS S3 URL parser by splitting the single monolithic regex into two separate patterns (standard S3 and VPC PrivateLink) with named capture groups. Also made the VPC endpoint region mandatory in the regex, fixing a potential mis-parse when the region segment was absent.
- d62c384: Fixed a bug where scheduled tasks that were initially registered with a manual trigger and later re-registered with a duration or cron cadence would never be scheduled to run.
- 8419f51: Added support for AWS PrivateLink for Amazon S3.
- a624fa3: The `connection` config option for the Redis cache store now accepts either a string URL or an object with additional connection options that are passed directly to the underlying client. The object form is only supported when `backend.cache.store` is `redis`; other stores require a plain string. This allows configuring options like `pingInterval` without needing dedicated config fields. For clustered Redis, the connection object properties are merged into cluster defaults. Fixes https://github.com/backstage/backstage/issues/31813, https://github.com/backstage/backstage/issues/31742.
- Updated dependencies
  - @backstage/config-loader@1.11.0
  - @backstage/plugin-auth-node@0.7.3
  - @backstage/backend-app-api@1.7.2
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/cli-node@0.3.4
  - @backstage/plugin-events-node@0.4.24
  - @backstage/plugin-permission-node@0.11.2

## 0.17.5-next.2

### Patch Changes

- a624fa3: The `connection` config option for the Redis cache store now accepts either a string URL or an object with additional connection options that are passed directly to the underlying client. The object form is only supported when `backend.cache.store` is `redis`; other stores require a plain string. This allows configuring options like `pingInterval` without needing dedicated config fields. For clustered Redis, the connection object properties are merged into cluster defaults. Fixes https://github.com/backstage/backstage/issues/31813, https://github.com/backstage/backstage/issues/31742.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.1
  - @backstage/cli-node@0.3.4-next.0
  - @backstage/config-loader@1.11.0-next.2

## 0.17.5-next.1

### Patch Changes

- d62c384: Fixed a bug where scheduled tasks that were initially registered with a manual trigger and later re-registered with a duration or cron cadence would never be scheduled to run.
- Updated dependencies
  - @backstage/config-loader@1.11.0-next.1

## 0.17.4-next.0

### Patch Changes

- aaa7d65: Improved readability of the AWS S3 URL parser by splitting the single monolithic regex into two separate patterns (standard S3 and VPC PrivateLink) with named capture groups. Also made the VPC endpoint region mandatory in the regex, fixing a potential mis-parse when the region segment was absent.
- 8419f51: Added support for AWS PrivateLink for Amazon S3.
- Updated dependencies
  - @backstage/config-loader@1.11.0-next.0
  - @backstage/plugin-auth-node@0.7.3-next.0
  - @backstage/backend-app-api@1.7.2-next.0
  - @backstage/plugin-permission-node@0.11.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 0.17.3

### Patch Changes

- 4f4bcf5: Upgraded `infinispan` from `^0.12.0` to `^0.13.0` to address known vulnerabilities.
- a07e6a3: Updated `AzureBlobStorageUrlReader` to reference the correctly-named `AzureBlobStorageIntegration` type from `@backstage/integration`. The previously-used `AzureBlobStorageIntergation` is now an alias for the new type and remains a valid argument to the constructor.
- b75158b: Adapted Azure-related tests for the Azure SDK upgrade to ESM-style exports. The `AzureBlobStorageUrlReader` now accepts an optional `createContainerClient` dependency for testability without needing to mock the `@azure/storage-blob` module.
- 89a95ca: Fixed the task worker retry loop to respect the abort signal. Previously, when a task worker encountered an unexpected error, the retry loop would continue indefinitely even after the worker was signaled to stop. The retry loop now checks the abort signal before retrying and passes it to the retry delay, allowing the worker to shut down gracefully.
- def82d4: Fixed the built-in rate limiter throwing a validation error and refusing to start when `backend.rateLimit` is enabled. Requests are now keyed using the address normalization helper from `express-rate-limit`, which is required by newer versions of that library and ensures IPv6 clients are grouped by their address block rather than by individual address.
- 0211390: Added a new `v2` invoke endpoint (`/.backstage/actions/v2/actions/:id/invoke`) that accepts a wrapped body format `{ input, secrets }` with secrets validation. The existing `v1` invoke endpoint remains unchanged for backward compatibility. Updated `DefaultActionsService` to use the `v2` endpoint. Updated `DefaultActionsRegistryService` to expose secrets schema in the actions list response and validate secrets on invocation.
- 34f21c3: Fix gitlabUrlReader issue with retrieving the repository archive tree
- Updated dependencies
  - @backstage/cli-node@0.3.3
  - @backstage/backend-app-api@1.7.1
  - @backstage/integration@2.0.3
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/config-loader@1.10.12
  - @backstage/plugin-auth-node@0.7.2
  - @backstage/plugin-events-node@0.4.23
  - @backstage/plugin-permission-node@0.11.1

## 0.17.3-next.2

### Patch Changes

- 89a95ca: Fixed the task worker retry loop to respect the abort signal. Previously, when a task worker encountered an unexpected error, the retry loop would continue indefinitely even after the worker was signaled to stop. The retry loop now checks the abort signal before retrying and passes it to the retry delay, allowing the worker to shut down gracefully.

## 0.17.3-next.1

### Patch Changes

- b75158b: Adapted Azure-related tests for the Azure SDK upgrade to ESM-style exports. The `AzureBlobStorageUrlReader` now accepts an optional `createContainerClient` dependency for testability without needing to mock the `@azure/storage-blob` module.
- 0211390: Added a new `v2` invoke endpoint (`/.backstage/actions/v2/actions/:id/invoke`) that accepts a wrapped body format `{ input, secrets }` with secrets validation. The existing `v1` invoke endpoint remains unchanged for backward compatibility. Updated `DefaultActionsService` to use the `v2` endpoint. Updated `DefaultActionsRegistryService` to expose secrets schema in the actions list response and validate secrets on invocation.
- 34f21c3: Fix gitlabUrlReader issue with retrieving the repository archive tree
- Updated dependencies
  - @backstage/integration@2.0.3-next.1
  - @backstage/backend-plugin-api@1.9.2-next.1

## 0.17.2-next.0

### Patch Changes

- a07e6a3: Updated `AzureBlobStorageUrlReader` to reference the correctly-named `AzureBlobStorageIntegration` type from `@backstage/integration`. The previously-used `AzureBlobStorageIntergation` is now an alias for the new type and remains a valid argument to the constructor.
- def82d4: Fixed the built-in rate limiter throwing a validation error and refusing to start when `backend.rateLimit` is enabled. Requests are now keyed using the address normalization helper from `express-rate-limit`, which is required by newer versions of that library and ensures IPv6 clients are grouped by their address block rather than by individual address.
- Updated dependencies
  - @backstage/integration@2.0.3-next.0
  - @backstage/plugin-auth-node@0.7.2-next.0
  - @backstage/backend-app-api@1.7.1-next.0
  - @backstage/plugin-permission-node@0.11.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 0.17.1

### Patch Changes

- 90b572e: Adds an alpha `TracingService` to provide a unified interface for emitting trace spans across Backstage plugins.
- 97d3bd4: Fixed a race condition in `CachedUserInfoService` where a failed request could incorrectly evict a newer cache entry for the same token. The error handler now verifies the map entry is still the same promise before deleting it.
- 3595c97: Exported `defaultServiceFactories` to allow use with `createSpecializedBackend` for advanced configuration like `extensionPointFactoryMiddleware`.
- 89d3248: Fixed scheduler `sleep` firing immediately for durations longer than ~24.8 days, caused by Node.js `setTimeout` overflowing its 32-bit millisecond limit.
- d00a44b: Fixed Valkey cluster mode to use `iovalkey`'s `Cluster` class instead of
  `createCluster` from `@keyv/redis`. The previous implementation passed a
  `@redis/client` `RedisCluster` instance to `@keyv/valkey`, which expects an
  `iovalkey` `Cluster` instance. This caused the cluster client to not be
  recognized correctly, as the two libraries have incompatible object models.
- 2f0519c: Added a new `CachedUserInfoService` decorator that wraps `DefaultUserInfoService` with a 5-second TTL cache and in-flight request coalescing. The decorator is wired in via `userInfoServiceFactory` using a shared root-level cache. Repeated `getUserInfo()` calls for the same user token within the TTL window return the cached result without making an HTTP call to the auth backend. Note that custom `UserInfoService` implementations registered via their own factory will not benefit from this cache automatically.
- 744fa1f: Removed duplicated entries that appeared in both `dependencies` and `devDependencies`.
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- 6209065: Added `context` and `propagation` to the alpha `TracingService`. Plugins can bridge OpenTelemetry context across async boundaries via `tracing.propagation.extract(tracing.context.active(), carrier)` followed by `tracing.context.with(ctx, fn)`, and read propagated baggage via `tracing.propagation.getActiveBaggage()` or `tracing.propagation.getBaggage(ctx)`.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/integration-aws-node@0.2.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/backend-app-api@1.7.0
  - @backstage/cli-node@0.3.2
  - @backstage/integration@2.0.2
  - @backstage/plugin-permission-node@0.11.0
  - @backstage/plugin-auth-node@0.7.1
  - @backstage/plugin-permission-common@0.9.9
  - @backstage/config@1.3.8
  - @backstage/config-loader@1.10.11
  - @backstage/plugin-events-node@0.4.22

## 0.17.1-next.2

### Patch Changes

- 90b572e: Adds an alpha `TracingService` to provide a unified interface for emitting trace spans across Backstage plugins.
- Updated dependencies
  - @backstage/integration-aws-node@0.2.0-next.1
  - @backstage/backend-plugin-api@1.9.1-next.1

## 0.17.1-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/cli-node@0.3.2-next.1
  - @backstage/plugin-auth-node@0.7.1-next.1
  - @backstage/plugin-permission-common@0.9.9-next.1

## 0.17.1-next.0

### Patch Changes

- 3595c97: Exported `defaultServiceFactories` to allow use with `createSpecializedBackend` for advanced configuration like `extensionPointFactoryMiddleware`.
- 89d3248: Fixed scheduler `sleep` firing immediately for durations longer than ~24.8 days, caused by Node.js `setTimeout` overflowing its 32-bit millisecond limit.
- 744fa1f: Removed duplicated entries that appeared in both `dependencies` and `devDependencies`.
- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-app-api@1.7.0-next.0
  - @backstage/integration@2.0.2-next.0
  - @backstage/plugin-auth-node@0.7.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/cli-node@0.3.2-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/config-loader@1.10.11-next.0
  - @backstage/integration-aws-node@0.1.22-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/plugin-permission-node@0.10.13-next.0
  - @backstage/backend-dev-utils@0.1.7
  - @backstage/types@1.2.2

## 0.17.0

### Minor Changes

- c69e03c: Added support for AWS RDS IAM authentication for PostgreSQL connections. Set `connection.type: rds` along with `host`, `user`, and `region` to use short-lived IAM tokens instead of a static password. Requires the `@aws-sdk/rds-signer` package and an IAM role with `rds-db:connect` permission.

### Patch Changes

- 4559806: Added support for typed `examples` on actions registered via the actions registry. Action authors can now provide examples with compile-time-checked `input` and `output` values that match their schema definitions.
- 5cd814f: Refactored auditor severity log level mappings to use `zod/v4` with schema-driven defaults and type inference.
- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 6e2aaab: Fixed `AwsS3UrlReader` failing to read files from S3 buckets configured with custom endpoint hosts. When an integration was configured with a specific endpoint like `https://bucket-1.s3.eu-central-1.amazonaws.com`, the URL parser incorrectly fell through to the non-AWS code path, always defaulting the region to `us-east-1` instead of extracting it from the hostname.
- 308c672: `HostDiscovery` now logs a warning when `backend.baseUrl` is set to a localhost address while `NODE_ENV` is `production`, and when `backend.baseUrl` is not a valid URL.
- 85c5a46: DefaultActionsRegistryService: add json middleware to /.backstage/actions/ routes only
- 547258f: Refactored the database creation retry loop to avoid an unnecessary delay after the final failed attempt.
- 79453c0: Updated dependency `wait-for-expect` to `^4.0.0`.
- f14df56: Added experimental support for using `embedded-postgres` as the database for local development. Set `backend.database.client` to `embedded-postgres` in your app config to enable this. The `embedded-postgres` package must be installed as an explicit dependency in your project.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-auth-node@0.7.0
  - @backstage/backend-app-api@1.6.1
  - @backstage/cli-node@0.3.1
  - @backstage/config-loader@1.10.10
  - @backstage/integration@2.0.1
  - @backstage/plugin-permission-node@0.10.12
  - @backstage/config@1.3.7
  - @backstage/integration-aws-node@0.1.21
  - @backstage/plugin-events-node@0.4.21
  - @backstage/plugin-permission-common@0.9.8

## 0.16.1-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 308c672: `HostDiscovery` now logs a warning when `backend.baseUrl` is set to a localhost address while `NODE_ENV` is `production`, and when `backend.baseUrl` is not a valid URL.
- 85c5a46: DefaultActionsRegistryService: add json middleware to /.backstage/actions/ routes only
- f14df56: Added experimental support for using `embedded-postgres` as the database for local development. Set `backend.database.client` to `embedded-postgres` in your app config to enable this. The `embedded-postgres` package must be installed as an explicit dependency in your project.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-auth-node@0.7.0-next.2
  - @backstage/backend-app-api@1.6.1-next.2
  - @backstage/cli-node@0.3.1-next.1
  - @backstage/config-loader@1.10.10-next.1
  - @backstage/integration@2.0.1-next.0
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/config@1.3.7-next.0
  - @backstage/integration-aws-node@0.1.21-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-permission-common@0.9.8-next.0
  - @backstage/plugin-permission-node@0.10.12-next.2

## 0.16.1-next.1

### Patch Changes

- 4559806: Added support for typed `examples` on actions registered via the actions registry. Action authors can now provide examples with compile-time-checked `input` and `output` values that match their schema definitions.
- 5cd814f: Refactored auditor severity log level mappings to use `zod/v4` with schema-driven defaults and type inference.
- 6e2aaab: Fixed `AwsS3UrlReader` failing to read files from S3 buckets configured with custom endpoint hosts. When an integration was configured with a specific endpoint like `https://bucket-1.s3.eu-central-1.amazonaws.com`, the URL parser incorrectly fell through to the non-AWS code path, always defaulting the region to `us-east-1` instead of extracting it from the hostname.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-auth-node@0.7.0-next.1
  - @backstage/backend-app-api@1.6.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1
  - @backstage/plugin-permission-node@0.10.12-next.1

## 0.16.1-next.0

### Patch Changes

- 79453c0: Updated dependency `wait-for-expect` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/config-loader@1.10.10-next.0
  - @backstage/backend-app-api@1.6.1-next.0
  - @backstage/plugin-auth-node@0.6.15-next.0
  - @backstage/plugin-permission-node@0.10.12-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/backend-dev-utils@0.1.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration@2.0.0
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.7

## 0.16.0

### Minor Changes

- 42960f1: The actions registry invoke endpoint now accepts direct user credentials in addition to service principals, enabling CLI and other direct user clients to invoke actions.
- 0e7d8f9: The scheduler service now uses the metrics service to create metrics, providing plugin-scoped attribution.
- 527cf88: **BREAKING** Removed deprecated `BitbucketUrlReader`. Use the `BitbucketCloudUrlReader` or the `BitbucketServerUrlReader` instead.

### Patch Changes

- cc8348e: Added permissions integration to the actions registry. Actions registered with a `visibilityPermission` field are now checked against the permissions framework when listing and invoking. Denied actions are filtered from list results, and invoking a denied action returns a `404 Not Found` as if the action does not exist. Permissions are automatically registered with the `PermissionsRegistryService` so they appear in the permission policy system.
- dee4283: Added `pluginId` field to `ActionsServiceAction` type, populated from the registering plugin's metadata.
- 015668c: Added `cancelTask` method to the `SchedulerService` interface and implementation, allowing cancellation of currently running scheduled tasks. For global tasks, the database lock is released and a periodic liveness check aborts the running task function. For local tasks, the task's abort signal is triggered directly. A new `POST /.backstage/scheduler/v1/tasks/:id/cancel` endpoint is also available.
- 638e6c7: chore(deps): bump `yauzl` from 3.2.0 to 3.2.1
- 6738cf0: build(deps): bump `minimatch` from 9.0.5 to 10.2.1
- 62f0a53: Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.
- d933f62: Add configurable throttling and retry mechanism for GitLab integration.
- b99158a: Fixed `yarn backstage-cli config:check --strict --config app-config.yaml` config validation error by adding
  an optional `default` type discriminator to PostgreSQL connection configuration,
  allowing `config:check` to properly validate `default` connection configurations.
- 1ee5b28: Adds an alpha `MetricsService` to provide a unified interface for metrics instrumentation across Backstage plugins.
- 5fcbef2: Updated dependency `express-rate-limit` to `^8.0.0`.
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/cli-node@0.3.0
  - @backstage/integration@2.0.0
  - @backstage/config-loader@1.10.9
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-permission-node@0.10.11
  - @backstage/plugin-auth-node@0.6.14
  - @backstage/backend-app-api@1.6.0
  - @backstage/plugin-events-node@0.4.20

## 0.16.0-next.2

### Patch Changes

- 015668c: Added `cancelTask` method to the `SchedulerService` interface and implementation, allowing cancellation of currently running scheduled tasks. For global tasks, the database lock is released and a periodic liveness check aborts the running task function. For local tasks, the task's abort signal is triggered directly. A new `POST /.backstage/scheduler/v1/tasks/:id/cancel` endpoint is also available.
- 5fcbef2: Updated dependency `express-rate-limit` to `^8.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/integration@2.0.0-next.2
  - @backstage/backend-app-api@1.6.0-next.1
  - @backstage/plugin-auth-node@0.6.14-next.2
  - @backstage/plugin-events-node@0.4.20-next.1
  - @backstage/plugin-permission-node@0.10.11-next.1

## 0.16.0-next.1

### Minor Changes

- 0e7d8f9: The scheduler service now uses the metrics service to create metrics, providing plugin-scoped attribution.
- 527cf88: **BREAKING** Removed deprecated `BitbucketUrlReader`. Use the `BitbucketCloudUrlReader` or the `BitbucketServerUrlReader` instead.

### Patch Changes

- 62f0a53: Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.
- Updated dependencies
  - @backstage/cli-node@0.2.19-next.1
  - @backstage/integration@2.0.0-next.1
  - @backstage/plugin-auth-node@0.6.14-next.1
  - @backstage/backend-app-api@1.5.1-next.0
  - @backstage/backend-dev-utils@0.1.7
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/config-loader@1.10.9-next.0
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-node@0.10.11-next.0

## 0.15.3-next.0

### Patch Changes

- 6738cf0: build(deps): bump `minimatch` from 9.0.5 to 10.2.1
- d933f62: Add configurable throttling and retry mechanism for GitLab integration.
- b99158a: Fixed `yarn backstage-cli config:check --strict --config app-config.yaml` config validation error by adding
  an optional `default` type discriminator to PostgreSQL connection configuration,
  allowing `config:check` to properly validate `default` connection configurations.
- 1ee5b28: Adds an alpha `MetricsService` to provide a unified interface for metrics instrumentation across Backstage plugins.
- Updated dependencies
  - @backstage/cli-node@0.2.19-next.0
  - @backstage/integration@1.21.0-next.0
  - @backstage/config-loader@1.10.9-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/backend-app-api@1.5.1-next.0
  - @backstage/backend-dev-utils@0.1.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-auth-node@0.6.14-next.0
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-node@0.10.11-next.0

## 0.15.2

### Patch Changes

- 7455dae: Use node prefix on native imports
- 44f5d04: Minor internal restructure of the postgres config loading code
- 4fc7bf0: Bump to tar v7
- 5dd683f: `createRateLimitMiddleware` is now exported from `@backstage/backend-defaults/httpRouter`
- 8dd518a: Support `connection.type: azure` in database client to use Microsoft Entra authentication with Azure database for PostgreSQL
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/backend-app-api@1.5.0
  - @backstage/integration@1.20.0
  - @backstage/integration-aws-node@0.1.20
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/backend-dev-utils@0.1.7
  - @backstage/config-loader@1.10.8
  - @backstage/cli-node@0.2.18
  - @backstage/plugin-auth-node@0.6.13
  - @backstage/plugin-permission-node@0.10.10
  - @backstage/plugin-events-node@0.4.19

## 0.15.2-next.1

### Patch Changes

- 8dd518a: Support `connection.type: azure` in database client to use Microsoft Entra authentication with Azure database for PostgreSQL
- Updated dependencies
  - @backstage/integration@1.20.0-next.1
  - @backstage/cli-node@0.2.18-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.15.1-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- 44f5d04: Minor internal restructure of the postgres config loading code
- 4fc7bf0: Bump to tar v7
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/integration-aws-node@0.1.20-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-dev-utils@0.1.7-next.0
  - @backstage/config-loader@1.10.8-next.0
  - @backstage/integration@1.19.3-next.0
  - @backstage/cli-node@0.2.17-next.0
  - @backstage/plugin-auth-node@0.6.12-next.0
  - @backstage/backend-app-api@1.5.0-next.0
  - @backstage/plugin-permission-node@0.10.9-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.15.0

### Minor Changes

- 6fc00e6: Added action filtering support with glob patterns and attribute constraints.

  The `ActionsService` now supports filtering actions based on configuration. This allows controlling which actions are exposed to consumers like the MCP backend.

  Configuration example:

  ```yaml
  backend:
    actions:
      pluginSources:
        - catalog
        - scaffolder
      filter:
        include:
          - id: 'catalog:*'
            attributes:
              destructive: false
          - id: 'scaffolder:*'
        exclude:
          - id: '*:delete-*'
          - attributes:
              readOnly: false
  ```

  Filtering logic:

  - `include`: Rules for actions to include. Each rule can specify an `id` glob pattern and/or `attributes` constraints. An action must match at least one rule to be included. If no include rules are specified, all actions are included by default.
  - `exclude`: Rules for actions to exclude. Takes precedence over include rules.
  - Each rule combines `id` and `attributes` with AND logic (both must match if specified).

- 27f9061: **BREAKING**: The constructor for `FetchUrlReader` is now private. If you have to construct an instance of it, please use `FetchUrlReader.fromConfig` instead.
- 27f9061: **BREAKING**: `coreServices.urlReader` now validates that redirect chains are subject to the allow list in `reading.allow` of your app config. If you were relying on redirects that pointed to URLs that were not allowlisted, you will now have to add those to your config as well.

  Example:

  ```diff
   backend:
     reading:
       allow:
         - host: example.com
  +      - host: storage-api.example.com
  ```

### Patch Changes

- 3afeab4: Implementing `readTree` for `GoogleGcsReader`
- c641c14: Wrap some of the action logic with `resolveSafeChildPath` and improve symlink handling when fetching remote and local files
- 7126bf2: Fixed a spelling mistake in root health service shutdown response.
- 872eb91: Upgrade `zod-to-json-schema` to latest version
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/backend-app-api@1.4.1
  - @backstage/integration@1.19.2
  - @backstage/plugin-auth-node@0.6.11
  - @backstage/plugin-permission-node@0.10.8

## 0.15.0-next.2

### Minor Changes

- 6fc00e6: Added action filtering support with glob patterns and attribute constraints.

  The `ActionsService` now supports filtering actions based on configuration. This allows controlling which actions are exposed to consumers like the MCP backend.

  Configuration example:

  ```yaml
  backend:
    actions:
      pluginSources:
        - catalog
        - scaffolder
      filter:
        include:
          - id: 'catalog:*'
            attributes:
              destructive: false
          - id: 'scaffolder:*'
        exclude:
          - id: '*:delete-*'
          - attributes:
              readOnly: false
  ```

  Filtering logic:

  - `include`: Rules for actions to include. Each rule can specify an `id` glob pattern and/or `attributes` constraints. An action must match at least one rule to be included. If no include rules are specified, all actions are included by default.
  - `exclude`: Rules for actions to exclude. Takes precedence over include rules.
  - Each rule combines `id` and `attributes` with AND logic (both must match if specified).

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.4.0
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-permission-node@0.10.7

## 0.14.1-next.1

### Patch Changes

- 3afeab4: Implementing `readTree` for `GoogleGcsReader`
- Updated dependencies
  - @backstage/integration@1.19.2-next.0

## 0.14.1-next.0

### Patch Changes

- 7126bf2: Fixed a spelling mistake in root health service shutdown response.
- Updated dependencies
  - @backstage/backend-app-api@1.4.0
  - @backstage/backend-dev-utils@0.1.6
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/cli-node@0.2.16
  - @backstage/config@1.3.6
  - @backstage/config-loader@1.10.7
  - @backstage/errors@1.2.7
  - @backstage/integration@1.19.0
  - @backstage/integration-aws-node@0.1.19
  - @backstage/types@1.2.2
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-node@0.10.7

## 0.14.0

### Minor Changes

- fa43826: Move `better-sqlite3` from dependencies to peer dependencies
- 2bc4e02: **BREAKING** The correct configuration options for Valkey are now being used.

  These changes are **required** to `app-config.yaml`:

  ```diff
  backend:
    cache:
      store: valkey
      connection: ...
      client:
  -     namespace: 'my-app'
  -     keyPrefixSeparator: ':'
  +     keyPrefix: 'my-app:'
  -     clearBatchSize: 1000
  -     useUnlink: false
  ```

  In comparison to Redis, Valkey requires the full `keyPrefix` including the separator to be specified instead of separate `namespace` and `keyPrefixSeparator` options. Also, Valkey does not support the `clearBatchSize` and `useUnlink` options.

### Patch Changes

- 37fba1d: Added support for Bitbucket Cloud OAuth. This introduces an alternative authentication method using a workspace OAuth consumer, alongside App Passwords (deprecated) and API tokens. OAuth does not require a bot or service account and avoids token expiry issues.

  **BREAKING CHANGES**

  - **@backstage/integration** (`src/bitbucketCloud/core.ts`)

    - `getBitbucketCloudRequestOptions` now returns a `Promise` and **must** be awaited.

  - **@backstage/plugin-scaffolder-backend-module-bitbucket-cloud** (`src/actions/helpers.ts`)
    - `getBitbucketClient` now returns a `Promise` and **must** be awaited.
    - `getAuthorizationHeader` now returns a `Promise` and **must** be awaited.

  **OAuth usage example**

  ```yaml
  integrations:
    bitbucketCloud:
      - clientId: client-id
        clientSecret: client-secret
  ```

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- aa79251: build(deps): bump `node-forge` from 1.3.1 to 1.3.2
- f96edff: Allow configuration of the `referrerPolicy`
- fb029b6: Updated luxon types
- d9759a1: **BREAKING ALPHA**: The old `instanceMetadataService` has been removed from alpha. Please switch over to using the stable `coreServices.rootInstanceMetadata` and related types instead, available from `@backstage/backend-plugin-api`.
- 847a330: Fix for `jose` types
- 25b560e: Internal change to support new versions of the `logform` library
- 2a0c4b0: Adds a new experimental `RootSystemMetadataService` for tracking the collection of Backstage instances that may be deployed at any one time. It currently offers a single API, `getInstalledPlugins` that returns a list of installed plugins based on config you have set up in `discovery.endpoints` as well as the plugins installed on the instance you're calling the API with. It does not handle wildcard values or fallback values. The intention is for this plugin to provide plugin authors with a simple interface to fetch a trustworthy list of all installed plugins.
- 3016a79: Updated dependency `@types/archiver` to `^7.0.0`.
- 42db6a6: Don't warn when parsing `storeOptions` for `memory` cache
- Updated dependencies
  - @backstage/cli-node@0.2.16
  - @backstage/integration@1.19.0
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-node@0.10.7
  - @backstage/backend-app-api@1.4.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/config-loader@1.10.7
  - @backstage/backend-dev-utils@0.1.6

## 0.14.0-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- aa79251: build(deps): bump `node-forge` from 1.3.1 to 1.3.2
- f96edff: Allow configuration of the `referrerPolicy`
- fb029b6: Updated luxon types
- 847a330: Fix for `jose` types
- 25b560e: Internal change to support new versions of the `logform` library
- 2a0c4b0: Adds a new experimental `RootSystemMetadataService` for tracking the collection of Backstage instances that may be deployed at any one time. It currently offers a single API, `getInstalledPlugins` that returns a list of installed plugins based on config you have set up in `discovery.endpoints` as well as the plugins installed on the instance you're calling the API with. It does not handle wildcard values or fallback values. The intention is for this plugin to provide plugin authors with a simple interface to fetch a trustworthy list of all installed plugins.
- 3016a79: Updated dependency `@types/archiver` to `^7.0.0`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10-next.1
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/plugin-permission-node@0.10.7-next.1
  - @backstage/integration@1.18.3-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/config-loader@1.10.7-next.1
  - @backstage/backend-dev-utils@0.1.6-next.0
  - @backstage/backend-app-api@1.4.0-next.1
  - @backstage/cli-node@0.2.16-next.1
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.19
  - @backstage/types@1.2.2

## 0.14.0-next.0

### Minor Changes

- fa43826: Move `better-sqlite3` from dependencies to peer dependencies

### Patch Changes

- d9759a1: **BREAKING ALPHA**: The old `instanceMetadataService` has been removed from alpha. Please switch over to using the stable `coreServices.rootInstanceMetadata` and related types instead, available from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10-next.0
  - @backstage/backend-app-api@1.4.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/integration@1.18.3-next.0
  - @backstage/plugin-permission-node@0.10.7-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/cli-node@0.2.16-next.0
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/config-loader@1.10.7-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.13.1

### Patch Changes

- 9bcfa77: Adjusted the log line wording of task worker starting
- 91ab2eb: Fix a bug in the Gitlab URL reader where `search` did not handle multiple globs
- fa255f5: Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

  API token usage example:

  ```yaml
  integrations:
    bitbucketCloud:
      - username: user@domain.com
        token: my-token
  ```

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- b2f6a5a: Fix #31348 issue where BitbucketUrlReader ignored provided token and instead always used integration credentials
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/backend-app-api@1.3.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config-loader@1.10.6
  - @backstage/config@1.3.6
  - @backstage/cli-node@0.2.15
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-permission-node@0.10.6

## 0.13.1-next.1

### Patch Changes

- 91ab2eb: Fix a bug in the Gitlab URL reader where `search` did not handle multiple globs
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/backend-app-api@1.3.0-next.1
  - @backstage/plugin-auth-node@0.6.9-next.1
  - @backstage/plugin-events-node@0.4.17-next.1
  - @backstage/plugin-permission-node@0.10.6-next.1

## 0.13.1-next.0

### Patch Changes

- 9bcfa77: Adjusted the log line wording of task worker starting
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- b2f6a5a: Fix #31348 issue where BitbucketUrlReader ignored provided token and instead always used integration credentials
- Updated dependencies
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/plugin-auth-node@0.6.9-next.0
  - @backstage/backend-app-api@1.2.9-next.0
  - @backstage/config-loader@1.10.6-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/cli-node@0.2.15-next.0
  - @backstage/integration@1.18.2-next.0
  - @backstage/integration-aws-node@0.1.19-next.0
  - @backstage/plugin-permission-node@0.10.6-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.13.0

### Minor Changes

- 2d3e2b2: implement support for direct url for AzureBlobStorageUrlReader search function
- 8b91238: Adds support for configuring server-level HTTP options through the
  `app-config.yaml` file under the `backend.server` key. Supported options
  include `headersTimeout`, `keepAliveTimeout`, `requestTimeout`, `timeout`,
  `maxHeadersCount`, and `maxRequestsPerSocket`.

  These are passed directly to the underlying Node.js HTTP server.
  If omitted, Node.js defaults are used.

- 8495b18: Add a new `externalTokenHandlersServiceRef` to allow custom external token validations

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.2.8
  - @backstage/integration@1.18.1
  - @backstage/config-loader@1.10.5
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/integration-aws-node@0.1.18
  - @backstage/plugin-auth-node@0.6.8
  - @backstage/plugin-events-node@0.4.16
  - @backstage/plugin-permission-node@0.10.5

## 0.13.0-next.2

### Minor Changes

- 8495b18: Add a new `externalTokenHandlersServiceRef` to allow custom external token validations

## 0.13.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.10.4-next.0
  - @backstage/config@1.3.4-next.0
  - @backstage/integration@1.18.1-next.1
  - @backstage/integration-aws-node@0.1.18-next.0
  - @backstage/backend-app-api@1.2.8-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-auth-node@0.6.8-next.0
  - @backstage/plugin-permission-node@0.10.5-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/cli-node@0.2.14

## 0.13.0-next.0

### Minor Changes

- 2d3e2b2: implement support for direct url for AzureBlobStorageUrlReader search function
- 8b91238: Adds support for configuring server-level HTTP options through the
  `app-config.yaml` file under the `backend.server` key. Supported options
  include `headersTimeout`, `keepAliveTimeout`, `requestTimeout`, `timeout`,
  `maxHeadersCount`, and `maxRequestsPerSocket`.

  These are passed directly to the underlying Node.js HTTP server.
  If omitted, Node.js defaults are used.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.1-next.0
  - @backstage/backend-app-api@1.2.7
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-permission-node@0.10.4
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/cli-node@0.2.14
  - @backstage/config@1.3.3
  - @backstage/config-loader@1.10.3
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.17
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.15

## 0.12.1

### Patch Changes

- 33bd4d0: Deduplicate discovered features discovered with discoveryFeatureLoader
- 4eda590: Fixed cache namespace and key prefix separator configuration to properly use configured values instead of hardcoded plugin ID. The cache manager now correctly combines the configured namespace with plugin IDs using the configured separator for Redis and Valkey. Memcache and memory store continue to use plugin ID as namespace.
- f244e61: Add `backend.logger` config options to configure the `RootLoggerService`.

  Read more about the new configuration options in the
  [Root Logger Service](https://backstage.io/docs/backend-system/core-services/root-logger/)
  documentation.

- Updated dependencies
  - @backstage/config-loader@1.10.3
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-events-node@0.4.15
  - @backstage/integration@1.18.0
  - @backstage/types@1.2.2
  - @backstage/backend-app-api@1.2.7
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-permission-node@0.10.4

## 0.12.1-next.1

### Patch Changes

- 4eda590: Fixed cache namespace and key prefix separator configuration to properly use configured values instead of hardcoded plugin ID. The cache manager now correctly combines the configured namespace with plugin IDs using the configured separator for Redis and Valkey. Memcache and memory store continue to use plugin ID as namespace.
- Updated dependencies
  - @backstage/config-loader@1.10.3-next.0
  - @backstage/plugin-auth-node@0.6.7-next.1
  - @backstage/integration@1.18.0-next.0
  - @backstage/integration-aws-node@0.1.17

## 0.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.0-next.0
  - @backstage/plugin-auth-node@0.6.7-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-permission-node@0.10.4-next.0
  - @backstage/backend-app-api@1.2.7-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 0.12.0

### Minor Changes

- 133519b: feat: new cache manager `Infinispan Data Grid`

### Patch Changes

- caee2eb: Fixed WinstonLogger throwing when redactions were null or undefined
- ed74af5: Fixed bug in PackageDiscoveryService where packages with "exports" field caused ERR_PACKAGE_PATH_NOT_EXPORTED error during backend startup.
- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/cli-node@0.2.14
  - @backstage/backend-app-api@1.2.6
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-permission-node@0.10.3
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 0.11.2-next.0

### Patch Changes

- caee2eb: Fixed WinstonLogger throwing when redactions were null or undefined
- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/backend-app-api@1.2.6-next.0
  - @backstage/plugin-auth-node@0.6.6-next.0
  - @backstage/plugin-permission-node@0.10.3-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/cli-node@0.2.13
  - @backstage/config-loader@1.10.2
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/types@1.2.1

## 0.11.1

### Patch Changes

- ead925a: Add a standard `toString` on credentials objects
- e0189b8: UrlReader: Fix handling of access tokens for GitLab readURL requests
- d1e4a6d: Fixed bug where the GitLab user token and GitLab integration token were being merged together
- Updated dependencies
  - @backstage/config-loader@1.10.2
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-node@0.10.2
  - @backstage/integration@1.17.1
  - @backstage/backend-app-api@1.2.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-auth-node@0.6.5
  - @backstage/plugin-events-node@0.4.13

## 0.11.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.10.2-next.0
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-node@0.10.2-next.0
  - @backstage/integration@1.17.1-next.1
  - @backstage/integration-aws-node@0.1.17-next.0
  - @backstage/backend-app-api@1.2.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-auth-node@0.6.5-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.11.1-next.0

### Patch Changes

- ead925a: Add a standard `toString` on credentials objects
- e0189b8: UrlReader: Fix handling of access tokens for GitLab readURL requests
- d1e4a6d: Fixed bug where the GitLab user token and GitLab integration token were being merged together
- Updated dependencies
  - @backstage/integration@1.17.1-next.0
  - @backstage/backend-app-api@1.2.4
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/plugin-permission-node@0.10.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/cli-node@0.2.13
  - @backstage/config-loader@1.10.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1

## 0.11.0

### Minor Changes

- 3ccb7fc: Enhanced error handling in the auditor service factory to pass errors as objects. Aligned WinstonRootAuditorService with the default service factory's error handling.

### Patch Changes

- 1220cf8: Added new rate limit middleware to allow rate limiting requests to the backend

  If you are using the `configure` callback of the root HTTP router service and do NOT call `applyDefaults()` inside it, please see [the relevant changes](https://github.com/backstage/backstage/pull/28708/files#diff-86ad1b6a694dd250823aee39d410428dd837c9d9a04ca8c33bd1081fbe3f22af) that were made, to see if you want to apply them as well to your custom configuration.
  Rate limiting can be turned on by adding the following configuration to `app-config.yaml`:

  ```yaml
  backend:
    rateLimit:
      window: 6s
      incomingRequestLimit: 100
  ```

  Plugin specific rate limiting can be configured by adding the following configuration to `app-config.yaml`:

  ```yaml
  backend:
    rateLimit:
      global: false # This will disable the global rate limiting
      plugin:
        catalog:
          window: 6s
          incomingRequestLimit: 100
  ```

- c999c25: Added some default implementations for the experimental `ActionsService` and `ActionsRegistryService` under `/alpha` that allow registration of actions for a particular plugin.
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-app-api@1.2.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.1
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-permission-node@0.10.1

## 0.11.0-next.2

### Minor Changes

- 3ccb7fc: Enhanced error handling in the auditor service factory to pass errors as objects. Aligned WinstonRootAuditorService with the default service factory's error handling.

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.2.4-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.1
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-node@0.10.1-next.1

## 0.10.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/backend-app-api@1.2.4-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.1
  - @backstage/errors@1.2.7
  - @backstage/integration@1.17.0
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-permission-node@0.10.1-next.1

## 0.10.1-next.0

### Patch Changes

- c999c25: Added some default implementations for the `ActionsService` and `ActionsRegistryService` that allow registration of actions for a particular plugin.
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/backend-app-api@1.2.4-next.0
  - @backstage/cli-node@0.2.13
  - @backstage/config-loader@1.10.1
  - @backstage/plugin-auth-node@0.6.4-next.0
  - @backstage/plugin-events-node@0.4.12-next.0
  - @backstage/plugin-permission-node@0.10.1-next.0

## 0.10.0

### Minor Changes

- d385854: **BREAKING**: The `DefaultSchedulerService` constructor options now requires `RootLifecycleService`, `HttpRouterService`, and `PluginMetadataService` fields.

  The scheduler will register a REST API for listing and triggering tasks. Please see [the scheduler documentation](https://backstage.io/docs/backend-system/core-services/scheduler) for more details about this API.

### Patch Changes

- 1e06afd: `GithubUrlReader`'s search detects glob-patterns supported by `minimatch`, instead of just detecting
  `*` and `?` characters.

  For example, this allows to search for patterns like `{C,c}atalog-info.yaml`.

- acea1d4: update documentation
- 72d019d: Removed various typos
- c6bc67d: Added Valkey support alongside Redis in backend-defaults cache clients, using the new Keyv Valkey package. Also extended backend-test-utils to support Valkey in tests.
- 36f77e9: Bug fix: Pass user provided token through to gitlab url resolvers
- 0e7a640: The `GithubUrlReader` will now use the token from `options` when fetching repo details
- Updated dependencies
  - @backstage/integration@1.17.0
  - @backstage/backend-app-api@1.2.3
  - @backstage/plugin-auth-node@0.6.3
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/plugin-permission-node@0.10.0
  - @backstage/config-loader@1.10.1
  - @backstage/integration-aws-node@0.1.16
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11

## 0.10.0-next.3

### Patch Changes

- 1e06afd: `GithubUrlReader`'s search detects glob-patterns supported by `minimatch`, instead of just detecting
  `*` and `?` characters.

  For example, this allows to search for patterns like `{C,c}atalog-info.yaml`.

- Updated dependencies
  - @backstage/integration@1.17.0-next.3
  - @backstage/plugin-auth-node@0.6.3-next.2
  - @backstage/backend-app-api@1.2.3-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.2
  - @backstage/plugin-permission-node@0.10.0-next.2

## 0.10.0-next.2

### Patch Changes

- 0e7a640: The `GithubUrlReader` will now use the token from `options` when fetching repo details
- Updated dependencies
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/integration@1.17.0-next.2
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/backend-app-api@1.2.3-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.10.0-next.1

### Minor Changes

- d385854: **BREAKING**: The `DefaultSchedulerService` constructor options now requires `RootLifecycleService`, `HttpRouterService`, and `PluginMetadataService` fields.

  The scheduler will register a REST API for listing and triggering tasks. Please see [the scheduler documentation](https://backstage.io/docs/backend-system/core-services/scheduler) for more details about this API.

### Patch Changes

- acea1d4: update documentation
- 72d019d: Removed various typos
- c6bc67d: Added Valkey support alongside Redis in backend-defaults cache clients, using the new Keyv Valkey package. Also extended backend-test-utils to support Valkey in tests.
- 36f77e9: Bug fix: Pass user provided token through to gitlab url resolvers
- Updated dependencies
  - @backstage/backend-app-api@1.2.3-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 0.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.0
  - @backstage/backend-app-api@1.2.3-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/cli-node@0.2.13
  - @backstage/config-loader@1.10.0
  - @backstage/plugin-auth-node@0.6.3-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/plugin-permission-node@0.9.2-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1

## 0.9.0

### Minor Changes

- 1daedce: Remove Throttle of Bitbucket Server API calls
- 01edf6e: Allow pass through of redis client and cluster options to Cache core service
- cf4eb13: Added `actor` property to `BackstageUserPrincipal` containing the subject of the last service (if any) who performed authentication on behalf of the user.

### Patch Changes

- 7c6740e: Implemented SRV lookup support in the default `HostDiscovery`. You can now specify internal URLs on the form `http+srv://some-srv-name/api/{{pluginId}}` and they will be resolved in real time.
- 939116c: Added an optional `backend.trustProxy` app config value, which sets the
  corresponding [Express.js `trust proxy`](https://expressjs.com/en/guide/behind-proxies.html) setting. This lets
  you easily configure proxy trust without making a custom `configure` callback
  for the `rootHttpRouter` service.

  If you already are using a custom `configure` callback, and if that also _does not_ call `applyDefaults()`, you may want to add the following to it:

  ```ts
  const trustProxy = config.getOptional('backend.trustProxy');
  if (trustProxy !== undefined) {
    app.set('trust proxy', trustProxy);
  }
  ```

- 175528c: Adds `backend.auditor.severityLogLevelMappings` to map severity levels to log levels.
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/integration@1.16.3
  - @backstage/backend-app-api@1.2.2
  - @backstage/plugin-auth-node@0.6.2
  - @backstage/plugin-permission-node@0.9.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.0
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.10

## 0.9.0-next.2

### Patch Changes

- 175528c: Adds `backend.auditor.severityLogLevelMappings` to map severity levels to log levels.
- Updated dependencies
  - @backstage/backend-app-api@1.2.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.0
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.3-next.0
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-permission-node@0.9.0

## 0.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.3-next.0
  - @backstage/backend-app-api@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.0
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9

## 0.9.0-next.0

### Minor Changes

- 01edf6e: Allow pass through of redis client and cluster options to Cache core service

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.10.0
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9

## 0.8.2

### Patch Changes

- e293b66: The default auditor service implementation will now log low severity events with `debug` level instead of `info`.
- f422984: Remove unused dependencies
- ecb9bab: Explicitly stringify extra logger fields with `JSON.stringify` to prevent `[object Object]` errors.
- 12f8e01: The `discovery.endpoints` configuration no longer requires both `internal` and `external` target when using the object form, instead falling back to the default.
- 89db8b8: `GerritUrlReader` is now able to `search` files matching a given pattern URL (using `minimatch` glob patterns).

  This allows the Gerrit Discovery to find all Backstage manifests inside a repository using the `**/catalog-info.yaml` pattern.

- Updated dependencies
  - @backstage/config-loader@1.10.0
  - @backstage/integration@1.16.2
  - @backstage/plugin-permission-node@0.9.0
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-app-api@1.2.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.8.2-next.2

### Patch Changes

- 12f8e01: The `discovery.endpoints` configuration no longer requires both `internal` and `external` target when using the object form, instead falling back to the default.
- Updated dependencies
  - @backstage/config-loader@1.10.0-next.0
  - @backstage/integration@1.16.2-next.0
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-app-api@1.2.1-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/plugin-permission-node@0.8.9-next.1

## 0.8.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-app-api@1.2.1-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9-next.1
  - @backstage/plugin-permission-node@0.8.9-next.1

## 0.8.2-next.0

### Patch Changes

- e293b66: The default auditor service implementation will now log low severity events with `debug` level instead of `info`.
- ecb9bab: Explicitly stringify extra logger fields with `JSON.stringify` to prevent `[object Object]` errors.
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.9-next.0
  - @backstage/backend-app-api@1.2.1-next.0
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/cli-node@0.2.13
  - @backstage/config-loader@1.9.6
  - @backstage/plugin-events-node@0.4.9-next.0

## 0.8.0

### Minor Changes

- a4aa244: This change introduces the `auditor` service implementation details.

### Patch Changes

- f866b86: Internal refactor to use explicit `require` for lazy-loading dependency.
- 92a56f6: Internal refactor to stop importing the removed `FeatureDiscoveryService` from `@backstage/backend-plugin-api`.
- a19cb2b: Added default implementation for the new `PermissionsRegistryService`.
- 0d39029: Do not send `etag` or `If-Modified-Since` headers for gitlab artifact urls
- c7609de: Allow passing IP type to use with cloud-sql-connector
- 3740229: In the different `UrlReadersService`, the `search` method have been updated to use the `readUrl` if the given URL doesn't contain a pattern.
  For `UrlReaders` that didn't implement the `search` method, `readUrl` is now called internally and throws if the given URL doesn't contain a pattern.
- 72cddf2: Updated `PermissionsRegistryService` to use `PermissionResourceRef`s and added the `getPermissionRuleset` method.
- Updated dependencies
  - @backstage/cli-node@0.2.13
  - @backstage/plugin-permission-node@0.8.8
  - @backstage/config-loader@1.9.6
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/backend-app-api@1.2.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8

## 0.8.0-next.3

### Patch Changes

- 3740229: In the different `UrlReadersService`, the `search` method have been updated to use the `readUrl` if the given URL doesn't contain a pattern.
  For `UrlReaders` that didn't implement the `search` method, `readUrl` is now called internally and throws if the given URL doesn't contain a pattern.
- 72cddf2: Updated `PermissionsRegistryService` to use `PermissionResourceRef`s and added the `getPermissionRuleset` method.
- Updated dependencies
  - @backstage/plugin-permission-node@0.8.8-next.2
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/backend-app-api@1.2.0-next.3
  - @backstage/cli-node@0.2.13-next.1
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1

## 0.8.0-next.2

### Patch Changes

- 92a56f6: Internal refactor to stop importing the removed `FeatureDiscoveryService` from `@backstage/backend-plugin-api`.
- 0d39029: Do not send `etag` or `If-Modified-Since` headers for gitlab artifact urls
- c7609de: Allow passing IP type to use with cloud-sql-connector
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/cli-node@0.2.13-next.1
  - @backstage/backend-app-api@1.2.0-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8-next.1
  - @backstage/plugin-permission-node@0.8.8-next.1

## 0.8.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.1.2-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.13-next.0
  - @backstage/config@1.3.2
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-permission-node@0.8.8-next.0

## 0.8.0-next.0

### Minor Changes

- a4aa244: This change introduces the `auditor` service implementation details.

### Patch Changes

- f866b86: Internal refactor to use explicit `require` for lazy-loading dependency.
- a19cb2b: Added default implementation for the new `PermissionsRegistryService`.
- Updated dependencies
  - @backstage/cli-node@0.2.13-next.0
  - @backstage/plugin-permission-node@0.8.8-next.0
  - @backstage/config-loader@1.9.6-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/backend-app-api@1.1.2-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration@1.16.1
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-events-node@0.4.8-next.0

## 0.7.0

### Minor Changes

- ec547b8: Ensure that an error handler middleware exists at the end of each plugin `httpRouter` handler chain. This makes it so that exceptions thrown by plugin routes are caught and encoded in the standard error format.

  If you were using the standard `MiddlewareFactory` just to put an `error` middleware in you router, you can now remove that at your earliest convenience since it's redundant. If you have custom error handlers in your plugin router, those will continue to function as previously. If you were relying on thrown errors propagating all the way down to the root HTTP router, you will find that they no longer do that, and may want to hoist your error handling up to the plugin level instead.

### Patch Changes

- 575613f: Go back to using `node-fetch` for gitlab
- d2b16db: The `GerritUrlReader` can now read content from a commit and not only from the top of a branch. The
  Gitiles URL must contain the full commit `SHA` hash like: `https://gerrit.com/gitiles/repo/+/2846e8dc327ae2f60249983b1c3b96f42f205bae/catalog-info.yaml`.
- 8ecf8cb: Exclude `@backstage/backend-common` from schema collection if `@backstage/backend-defaults` is present
- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/backend-app-api@1.1.1
  - @backstage/types@1.2.1
  - @backstage/config-loader@1.9.5
  - @backstage/plugin-permission-node@0.8.7
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/integration@1.16.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.12
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-events-node@0.4.7

## 0.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-app-api@1.1.1-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/cli-node@0.2.12-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/config-loader@1.9.5-next.1
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/integration-aws-node@0.1.15-next.0
  - @backstage/plugin-permission-node@0.8.7-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/integration@1.16.1-next.0

## 0.7.0-next.0

### Minor Changes

- ec547b8: Ensure that an error handler middleware exists at the end of each plugin `httpRouter` handler chain. This makes it so that exceptions thrown by plugin routes are caught and encoded in the standard error format.

  If you were using the standard `MiddlewareFactory` just to put an `error` middleware in you router, you can now remove that at your earliest convenience since it's redundant. If you have custom error handlers in your plugin router, those will continue to function as previously. If you were relying on thrown errors propagating all the way down to the root HTTP router, you will find that they no longer do that, and may want to hoist your error handling up to the plugin level instead.

### Patch Changes

- 575613f: Go back to using `node-fetch` for gitlab
- 8ecf8cb: Exclude `@backstage/backend-common` from schema collection if `@backstage/backend-defaults` is present
- 8379bf4: Remove usages of `PluginDatabaseManager` and `PluginEndpointDiscovery` and replace with their equivalent service types
- Updated dependencies
  - @backstage/backend-app-api@1.1.1-next.0
  - @backstage/config-loader@1.9.5-next.0
  - @backstage/plugin-permission-node@0.8.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.11
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0
  - @backstage/integration-aws-node@0.1.14
  - @backstage/types@1.2.0
  - @backstage/plugin-events-node@0.4.7-next.0

## 0.6.0

### Minor Changes

- fd5d337: Added a new `backend.health.headers` configuration that can be used to set additional headers to include in health check responses.

  **BREAKING CONSUMERS**: As part of this change the `createHealthRouter` function exported from `@backstage/backend-defaults/rootHttpRouter` now requires the root config service to be passed through the `config` option.

- 3f34ea9: Throttles Bitbucket Server API calls
- de6f280: **BREAKING** Upgraded @keyv/redis and keyv packages to resolve a bug related to incorrect resolution of cache keys.

  This is a breaking change for clients using the `redis` store for cache with `useRedisSets` option set to false since cache keys will be calculated differently (without the sets:namespace: prefix). For clients with default configuration (or useRedisSets set to false) the cache keys will stay the same, but since @keyv/redis library no longer supports redis sets they won't be utilised anymore.

  If you were using `useRedisSets` option in configuration make sure to remove it from `app-config.yaml`:

  ```diff
  backend:
    cache:
      store: redis
      connection: redis://user:pass@cache.example.com:6379
  -   useRedisSets: false
  ```

- 29180ec: **BREAKING PRODUCERS**: The `LifecycleMiddlewareOptions.startupRequestPauseTimeout` has been removed. Use the `backend.lifecycle.startupRequestPauseTimeout` setting in your `app-config.yaml` file to customize how the `createLifecycleMiddleware` function should behave. Also the root config service is required as an option when calling the `createLifecycleMiddleware` function:

  ```diff
  - createLifecycleMiddleware({ lifecycle, startupRequestPauseTimeout })
  + createLifecycleMiddleware({ config,  lifecycle })
  ```

- 277092a: Implemented `AzureBlobStorageUrlReader` to read from the url of committed location from the entity provider
- 18a2c00: All middleware used by the default `coreServices.http` is now exported for use by custom implementations.

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- 5b1e68c: Immediately close all connections when shutting down in local development.
- 8863b38: Export `PluginTokenHandler` and `pluginTokenHandlerDecoratorServiceRef` to allow for custom decoration of the plugin token handler without having to re-implement the entire handler.
- 29180ec: Fix server response time by moving the lifecycle startup hooks back to the plugin lifecycle service.
- 57e0b11: The user and plugin token verification in the default `AuthService` implementation will no longer forward verification errors to the caller, and instead log them as warnings.
- 97c6837: Export `DefaultHttpAuthService` to allow for custom token extraction logic.
- e5255f1: Log request and response metadata so it can be used for filtering log messages.
  The format of the request date was also changed from `clf` to `utc`.
- 57e0b11: The default `authServiceFactory` now correctly depends on the plugin scoped `Logger` services rather than the root scoped one.
- fe87fbf: Add task metrics as two gauges that track the last start and end timestamps as epoch seconds.
- 1ac6b72: Support `connection.type: cloudsql` in database client for usage with `@google-cloud/cloud-sql-connector` and `iam` auth
- 0e9c9fa: Implements the `DefaultRootLifecycleService.addBeforeShutdownHook` method, and updates `DefaultRootHttpRouterService` and `DefaultRootHealthService` to listen to that event to stop accepting traffic and close service connections.
- d0cbd82: Remove use of the `stoppable` library on the `DefaultRootHttpRouterService` as Node's native http server [close](https://nodejs.org/api/http.html#serverclosecallback) method already drains requests.
- 5c9cc05: Use native fetch instead of node-fetch
- cf627c6: Fixed an issue in the WinstonLogger where Errors thrown and given to logger.error with field values that could not be cast to a string would throw a TypeError
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/backend-app-api@1.1.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/cli-node@0.2.11
  - @backstage/plugin-permission-node@0.8.6
  - @backstage/config-loader@1.9.3
  - @backstage/errors@1.2.6
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/integration-aws-node@0.1.14
  - @backstage/types@1.2.0

## 0.6.0-next.2

### Minor Changes

- fd5d337: Added a new `backend.health.headers` configuration that can be used to set additional headers to include in health check responses.

  **BREAKING CONSUMERS**: As part of this change the `createHealthRouter` function exported from `@backstage/backend-defaults/rootHttpRouter` now requires the root config service to be passed through the `config` option.

- 3f34ea9: Throttles Bitbucket Server API calls

### Patch Changes

- dfc8b41: Updated dependency `@opentelemetry/api` to `^1.9.0`.
- 57e0b11: The user and plugin token verification in the default `AuthService` implementation will no longer forward verification errors to the caller, and instead log them as warnings.
- 57e0b11: The default `authServiceFactory` now correctly depends on the plugin scoped `Logger` services rather than the root scoped one.
- 0e9c9fa: Implements the `DefaultRootLifecycleService.addBeforeShutdownHook` method, and updates `DefaultRootHttpRouterService` and `DefaultRootHealthService` to listen to that event to stop accepting traffic and close service connections.
- d0cbd82: Remove use of the `stoppable` library on the `DefaultRootHttpRouterService` as Node's native http server [close](https://nodejs.org/api/http.html#serverclosecallback) method already drains requests.
  Also, we pass a new `lifecycleMiddleware` to the `rootHttpRouterServiceFactory` configure function that must be called manually if you don't call `applyDefaults`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/backend-app-api@1.1.0-next.2
  - @backstage/plugin-permission-node@0.8.6-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/cli-node@0.2.11-next.1
  - @backstage/config-loader@1.9.3-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1
  - @backstage/integration-aws-node@0.1.14-next.0
  - @backstage/types@1.2.0

## 0.6.0-next.1

### Patch Changes

- fe87fbf: Add task metrics as two gauges that track the last start and end timestamps as epoch seconds.
- 1ac6b72: Support `connection.type: cloudsql` in database client for usage with `@google-cloud/cloud-sql-connector` and `iam` auth
- 5c9cc05: Use native fetch instead of node-fetch
- cf627c6: Fixed an issue in the WinstonLogger where Errors thrown and given to logger.error with field values that could not be cast to a string would throw a TypeError
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-app-api@1.1.0-next.1
  - @backstage/config-loader@1.9.3-next.0
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-permission-node@0.8.6-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.11-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/types@1.2.0
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.6.0-next.0

### Minor Changes

- de6f280: **BREAKING** Upgraded @keyv/redis and keyv packages to resolve a bug related to incorrect resolution of cache keys.

  This is a breaking change for clients using the `redis` store for cache with `useRedisSets` option set to false since cache keys will be calculated differently (without the sets:namespace: prefix). For clients with default configuration (or useRedisSets set to false) the cache keys will stay the same, but since @keyv/redis library no longer supports redis sets they won't be utilised anymore.

  If you were using `useRedisSets` option in configuration make sure to remove it from `app-config.yaml`:

  ```diff
  backend:
    cache:
      store: redis
      connection: redis://user:pass@cache.example.com:6379
  -   useRedisSets: false
  ```

- 277092a: Implemented `AzureBlobStorageUrlReader` to read from the url of committed location from the entity provider
- 18a2c00: All middleware used by the default `coreServices.http` is now exported for use by custom implementations.

### Patch Changes

- 8863b38: Export `PluginTokenHandler` and `pluginTokenHandlerDecoratorServiceRef` to allow for custom decoration of the plugin token handler without having to re-implement the entire handler.
- 97c6837: Export `DefaultHttpAuthService` to allow for custom token extraction logic.
- e5255f1: Log request and response metadata so it can be used for filtering log messages.
  The format of the request date was also changed from `clf` to `utc`.
- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/backend-app-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/cli-node@0.2.11-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/config-loader@1.9.2
  - @backstage/errors@1.2.5
  - @backstage/integration-aws-node@0.1.13
  - @backstage/types@1.2.0
  - @backstage/plugin-permission-node@0.8.6-next.0

## 0.5.3

### Patch Changes

- bf306cb: Removed dependency `@backstage/backend-common`.
- e30bb46: Disabling database migrations now correctly uses the `backend.default.skipMigrations` config value.
- d52d7f9: Support ISO and ms string forms of durations in config too
- f6eaec2: Link to proper package in `rootLoggerServiceFactory` doc string.
- ecf6b39: Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/types@1.2.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/config-loader@1.9.2
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/backend-app-api@1.0.2
  - @backstage/cli-common@0.1.15
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-node@0.2.10
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2
  - @backstage/plugin-permission-node@0.8.5

## 0.5.3-next.3

### Patch Changes

- ecf6b39: Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
- Updated dependencies
  - @backstage/integration-aws-node@0.1.13-next.0
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-app-api@1.0.2-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/cli-node@0.2.10-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-permission-node@0.8.5-next.2

## 0.5.3-next.2

### Patch Changes

- e30bb46: Disabling database migrations now correctly uses the `backend.default.skipMigrations` config value.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-app-api@1.0.2-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/cli-node@0.2.10-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.5-next.2

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/backend-app-api@1.0.2-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/cli-node@0.2.10-next.0
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.2-next.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-events-node@0.4.4-next.1
  - @backstage/plugin-permission-node@0.8.5-next.1

## 0.5.3-next.0

### Patch Changes

- f6eaec2: Link to proper package in `rootLoggerServiceFactory` doc string.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-app-api@1.0.2-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.9
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.5-next.0

## 0.5.1

### Patch Changes

- 4b60e0c: Small tweaks to API reports to make them valid
- 321a994: Sensitive internal fields on `BackstageCredentials` objects are now defined as read-only properties in order to minimize risk of leakage.
- ffd1f4a: Plugin lifecycle shutdown hooks are now performed before root lifecycle shutdown hooks.
- ffd1f4a: The database manager now attempts to close any database connections in a root lifecycle shutdown hook.
- e36d12f: The task scheduler now attempts to abort any tasks if it detects that Backstage is being shut down.
- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- 094eaa3: Remove references to in-repo backend-common
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- 920004b: Updating error message for getProjectId when fetching Gitlab project from its url to be more accurate
- d7b44f0: Fix for backend shutdown hanging during local development due to SQLite connection shutdown never resolving.
- 8fd7deb: The default root HTTP service implementation will now pretty-print JSON responses in development.

  If you are overriding the `rootHttpRouterServiceFactory` with a `configure` function that doesn't call `applyDefaults`, you can introduce this functionality by adding the following snippet inside `configure`:

  ```ts
  if (process.env.NODE_ENV === 'development') {
    app.set('json spaces', 2);
  }
  ```

- Updated dependencies
  - @backstage/cli-node@0.2.9
  - @backstage/backend-app-api@1.0.1
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-permission-node@0.8.4
  - @backstage/plugin-events-node@0.4.1
  - @backstage/integration@1.15.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.5.1-next.2

### Patch Changes

- ffd1f4a: Plugin lifecycle shutdown hooks are now performed before root lifecycle shutdown hooks.
- ffd1f4a: The database manager now attempts to close any database connections in a root lifecycle shutdown hook.
- e36d12f: The task scheduler now attempts to abort any tasks if it detects that Backstage is being shut down.
- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/cli-node@0.2.9-next.0
  - @backstage/backend-app-api@1.0.1-next.1
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## 0.5.1-next.1

### Patch Changes

- 920004b: Updating error message for getProjectId when fetching Gitlab project from its url to be more accurate
- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-app-api@1.0.1-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.8
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/plugin-permission-node@0.8.4-next.0

## 0.5.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/backend-app-api@1.0.1-next.0
  - @backstage/plugin-permission-node@0.8.4-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.8
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.5.0

### Minor Changes

- a4bac3c: **BREAKING**: You can no longer supply a `basePath` option to the host discovery implementation. In the new backend system, the ability to choose this path has been removed anyway at the plugin router level.
- 359fcd7: **BREAKING**: The backwards compatibility with plugins using legacy auth through the token manager service has been removed. This means that instead of falling back to using the old token manager, requests towards plugins that don't support the new auth system will simply fail. Please make sure that all plugins in your deployment are hosted within a backend instance from the new backend system.
- baeef13: **BREAKING** Removed `createLifecycleMiddleware` and `LifecycleMiddlewareOptions` to clean up API surface. These exports have no external usage and do not provide value in its current form. If you were using these exports, please reach out to the maintainers to discuss your use case.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

- 19ff127: **BREAKING**: The default backend instance no longer provides implementations for the identity and token manager services, which have been removed from `@backstage/backend-plugin-api`.

  If you rely on plugins that still require these services, you can add them to your own backend by re-creating the service reference and factory.

  The following can be used to implement the identity service:

  ```ts
  import {
    coreServices,
    createServiceFactory,
    createServiceRef,
  } from '@backstage/backend-plugin-api';
  import {
    DefaultIdentityClient,
    IdentityApi,
  } from '@backstage/plugin-auth-node';

  backend.add(
    createServiceFactory({
      service: createServiceRef<IdentityApi>({ id: 'core.identity' }),
      deps: {
        discovery: coreServices.discovery,
      },
      async factory({ discovery }) {
        return DefaultIdentityClient.create({ discovery });
      },
    }),
  );
  ```

  The following can be used to implement the token manager service:

  ```ts
  import { ServerTokenManager, TokenManager } from '@backstage/backend-common';
  import { createBackend } from '@backstage/backend-defaults';
  import {
    coreServices,
    createServiceFactory,
    createServiceRef,
  } from '@backstage/backend-plugin-api';

  backend.add(
    createServiceFactory({
      service: createServiceRef<TokenManager>({ id: 'core.tokenManager' }),
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.rootLogger,
      },
      createRootContext({ config, logger }) {
        return ServerTokenManager.fromConfig(config, {
          logger,
          allowDisabledTokenManager: true,
        });
      },
      async factory(_deps, tokenManager) {
        return tokenManager;
      },
    }),
  );
  ```

- 055b75b: **BREAKING**: Simplifications and cleanup as part of the Backend System 1.0 work.

  For the `/database` subpath exports:

  - The deprecated `dropDatabase` function has now been removed, without replacement.
  - The deprecated `LegacyRootDatabaseService` type has now been removed.
  - The return type from `DatabaseManager.forPlugin` is now directly a `DatabaseService`, as arguably expected.
  - `DatabaseManager.forPlugin` now requires the `deps` argument, with the logger and lifecycle services.

  For the `/cache` subpath exports:

  - The `PluginCacheManager` type has been removed. You can still import it from `@backstage/backend-common`, but it's deprecated there, and you should move off of that package by migrating fully to the new backend system.
  - Accordingly, `CacheManager.forPlugin` immediately returns a `CacheService` instead of a `PluginCacheManager`. The outcome of this is that you no longer need to make the extra `.getClient()` call. The old `CacheManager` with the old behavior still exists on `@backstage/backend-common`, but the above recommendations apply.

### Patch Changes

- 213664e: Fixed an issue where the `useRedisSets` configuration for the cache service would have no effect.
- 6ed9264: chore(deps): bump `path-to-regexp` from 6.2.2 to 8.0.0
- 622360e: Move down the discovery config to be in the root
- 7f779c7: `auth.externalAccess` should be optional in the config schema
- fe6fd8c: Accept `ConfigService` instead of `Config` in constructors/factories
- 82539fe: Updated dependency `archiver` to `^7.0.0`.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- 5705424: Wrap scheduled tasks from the scheduler core service now in OpenTelemetry spans
- 7a72ec8: Exports the `discoveryFeatureLoader` as a replacement for the deprecated `featureDiscoveryService`.
  The `discoveryFeatureLoader` is a new backend system [feature loader](https://backstage.io/docs/backend-system/architecture/feature-loaders/) that discovers backend features from the current `package.json` and its dependencies.
  Here is an example using the `discoveryFeatureLoader` loader in a new backend instance:

  ```ts
  import { createBackend } from '@backstage/backend-defaults';
  import { discoveryFeatureLoader } from '@backstage/backend-defaults';
  //...

  const backend = createBackend();
  //...
  backend.add(discoveryFeatureLoader);
  //...
  backend.start();
  ```

- b2a329d: Properly indent the config schema
- 66dbf0a: Allow the cache service to accept the human duration format for TTL
- 5a8fcb4: Added the option to skip database migrations by setting `skipMigrations: true` in config. This can be done globally in the database config or by plugin id.
- 0b2a402: Updates to the config schema to match reality
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-app-api@1.0.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/cli-node@0.2.8
  - @backstage/plugin-permission-node@0.8.3
  - @backstage/integration@1.15.0
  - @backstage/config-loader@1.9.1
  - @backstage/plugin-events-node@0.4.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.5.0-next.2

### Minor Changes

- baeef13: **BREAKING** Removed `createLifecycleMiddleware` and `LifecycleMiddlewareOptions` to clean up API surface. These exports have no external usage and do not provide value in its current form. If you were using these exports, please reach out to the maintainers to discuss your use case.

### Patch Changes

- 6ed9264: chore(deps): bump `path-to-regexp` from 6.2.2 to 8.0.0
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-app-api@1.0.0-next.2
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/cli-node@0.2.8-next.0
  - @backstage/integration@1.15.0-next.0
  - @backstage/config-loader@1.9.1-next.0
  - @backstage/plugin-permission-node@0.8.3-next.2
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.5.0-next.1

### Minor Changes

- a4bac3c: **BREAKING**: You can no longer supply a `basePath` option to the host discovery implementation. In the new backend system, the ability to choose this path has been removed anyway at the plugin router level.
- 055b75b: **BREAKING**: Simplifications and cleanup as part of the Backend System 1.0 work.

  For the `/database` subpath exports:

  - The deprecated `dropDatabase` function has now been removed, without replacement.
  - The deprecated `LegacyRootDatabaseService` type has now been removed.
  - The return type from `DatabaseManager.forPlugin` is now directly a `DatabaseService`, as arguably expected.
  - `DatabaseManager.forPlugin` now requires the `deps` argument, with the logger and lifecycle services.

  For the `/cache` subpath exports:

  - The `PluginCacheManager` type has been removed. You can still import it from `@backstage/backend-common`, but it's deprecated there, and you should move off of that package by migrating fully to the new backend system.
  - Accordingly, `CacheManager.forPlugin` immediately returns a `CacheService` instead of a `PluginCacheManager`. The outcome of this is that you no longer need to make the extra `.getClient()` call. The old `CacheManager` with the old behavior still exists on `@backstage/backend-common`, but the above recommendations apply.

### Patch Changes

- 622360e: Move down the discovery config to be in the root
- fe6fd8c: Accept `ConfigService` instead of `Config` in constructors/factories
- 5705424: Wrap scheduled tasks from the scheduler core service now in OpenTelemetry spans
- b2a329d: Properly indent the config schema
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-app-api@0.10.0-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.0-next.1
  - @backstage/plugin-permission-node@0.8.3-next.1

## 0.5.0-next.0

### Minor Changes

- 359fcd7: **BREAKING**: The backwards compatibility with plugins using legacy auth through the token manager service has been removed. This means that instead of falling back to using the old token manager, requests towards plugins that don't support the new auth system will simply fail. Please make sure that all plugins in your deployment are hosted within a backend instance from the new backend system.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

- 19ff127: **BREAKING**: The default backend instance no longer provides implementations for the identity and token manager services, which have been removed from `@backstage/backend-plugin-api`.

  If you rely on plugins that still require these services, you can add them to your own backend by re-creating the service reference and factory.

  The following can be used to implement the identity service:

  ```ts
  import {
    coreServices,
    createServiceFactory,
    createServiceRef,
  } from '@backstage/backend-plugin-api';
  import {
    DefaultIdentityClient,
    IdentityApi,
  } from '@backstage/plugin-auth-node';

  backend.add(
    createServiceFactory({
      service: createServiceRef<IdentityApi>({ id: 'core.identity' }),
      deps: {
        discovery: coreServices.discovery,
      },
      async factory({ discovery }) {
        return DefaultIdentityClient.create({ discovery });
      },
    }),
  );
  ```

  The following can be used to implement the token manager service:

  ```ts
  import { ServerTokenManager, TokenManager } from '@backstage/backend-common';
  import { createBackend } from '@backstage/backend-defaults';
  import {
    coreServices,
    createServiceFactory,
    createServiceRef,
  } from '@backstage/backend-plugin-api';

  backend.add(
    createServiceFactory({
      service: createServiceRef<TokenManager>({ id: 'core.tokenManager' }),
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.rootLogger,
      },
      createRootContext({ config, logger }) {
        return ServerTokenManager.fromConfig(config, {
          logger,
          allowDisabledTokenManager: true,
        });
      },
      async factory(_deps, tokenManager) {
        return tokenManager;
      },
    }),
  );
  ```

### Patch Changes

- 7f779c7: `auth.externalAccess` should be optional in the config schema
- 7a72ec8: Exports the `discoveryFeatureLoader` as a replacement for the deprecated `featureDiscoveryService`.
  The `discoveryFeatureLoader` is a new backend system [feature loader](https://backstage.io/docs/backend-system/architecture/feature-loaders/) that discovers backend features from the current `package.json` and its dependencies.
  Here is an example using the `discoveryFeatureLoader` loader in a new backend instance:

  ```ts
  import { createBackend } from '@backstage/backend-defaults';
  import { discoveryFeatureLoader } from '@backstage/backend-defaults';
  //...

  const backend = createBackend();
  //...
  backend.add(discoveryFeatureLoader);
  //...
  backend.start();
  ```

- 66dbf0a: Allow the cache service to accept the human duration format for TTL
- 5a8fcb4: Added the option to skip database migrations by setting `skipMigrations: true` in config. This can be done globally in the database config or by plugin id.
- 0b2a402: Updates to the config schema to match reality
- Updated dependencies
  - @backstage/backend-app-api@0.10.0-next.0
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-permission-node@0.8.3-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-common@0.1.14
  - @backstage/cli-node@0.2.7
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.4.2

### Patch Changes

- 0d16b52: Add access restrictions to the JWKS external access method config schema
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 3b429fb: Added deprecation warning to urge users to perform the auth service migration or implement their own token manager service.
  See https://backstage.io/docs/tutorials/auth-service-migration for more information.
- 7681b17: update the `morgan` middleware to use a custom format to prevent PII from being logged
- 4e79d19: The `createHealthRouter` utility that allows you to create a health check router is now exported via `@backstage/backend-defaults/rootHttpRouter`.
- ba9abf4: The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.
- 78c1329: Updated `GitlabUrlReader.readUrl` and `GitlabUrlReader.readTree` to accept a user-provided token, supporting both bearer and private tokens.
- 8e967da: Fixed the routing of the new health check service, the health endpoints should now properly be available at `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness`.
- 7c5f3b0: Update the `UrlReader` service to depends on multiple instances of `UrlReaderFactoryProvider` service.
- 81f930a: use formatted query to prevent chance of SQL-injection
- 1d5f298: Avoid excessive numbers of error listeners on cache clients
- Updated dependencies
  - @backstage/backend-app-api@0.9.0
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/config-loader@1.9.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/plugin-permission-node@0.8.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/integration@1.14.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9

## 0.4.2-next.3

### Patch Changes

- 81f930a: use formatted query to prevent chance of SQL-injection
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-app-api@0.8.1-next.3
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-events-node@0.3.9-next.3
  - @backstage/plugin-permission-node@0.8.1-next.3

## 0.4.2-next.2

### Patch Changes

- 0d16b52: Add access restrictions to the JWKS external access method config schema
- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- ba9abf4: The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.
- 7c5f3b0: Update the `UrlReader` service to depends on multiple instances of `UrlReaderFactoryProvider` service.
- 1d5f298: Avoid excessive numbers of error listeners on cache clients
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-app-api@0.8.1-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/config-loader@1.9.0-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-permission-node@0.8.1-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.9.0-next.1
  - @backstage/plugin-permission-node@0.8.1-next.1
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-app-api@0.8.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.4.2-next.0

### Patch Changes

- 4e79d19: The `createHealthRouter` utility that allows you to create a health check router is now exported via `@backstage/backend-defaults/rootHttpRouter`.
- 78c1329: Updated `GitlabUrlReader.readUrl` and `GitlabUrlReader.readTree` to accept a user-provided token, supporting both bearer and private tokens.
- 8e967da: Fixed the routing of the new health check service, the health endpoints should now properly be available at `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness`.
- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/config-loader@1.8.2-next.0
  - @backstage/backend-app-api@0.8.1-next.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-events-node@0.3.9-next.0
  - @backstage/plugin-permission-node@0.8.1-next.0

## 0.4.0

### Minor Changes

- 1cb84d7: **BREAKING**: Removed the depreacted `getPath` option from `httpRouterServiceFactory`, as well as the `HttpRouterFactoryOptions` type.

### Patch Changes

- 53ced70: Added a new Root Health Service which adds new endpoints for health checks.
- 2f99178: The `ServiceFactoryTest.get` method was deprecated and the `ServiceFactoryTest.getSubject` should be used instead. The `getSubject` method has the same behavior, but has a better method name to indicate that the service instance returned is the subject currently being tested.
- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- b05e1e1: Service factories exported by this package have been updated to use the new service factory format that doesn't use a callback.
- 419f387: Refactor of `rootHttpRouterServiceFactory` to allow it to be constructed with options, but without declaring options via `createServiceFactory`.
- cb14a05: Repack the package to fix issues with typescript with named exports
- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0
- e28af58: Refactor of `rootConfigServiceFactory` to allow it to be constructed with options, but without declaring options via `createServiceFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-app-api@0.8.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-permission-node@0.8.0
  - @backstage/integration@1.13.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/config-loader@1.8.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.4-next.1

### Patch Changes

- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0
- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-app-api@0.7.10-next.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-events-node@0.3.8-next.1
  - @backstage/plugin-permission-node@0.7.33-next.1

## 0.3.3-next.0

### Patch Changes

- 53ced70: Added a new Root Health Service which adds new endpoints for health checks.
- 083eaf9: Fix bug where ISO durations could no longer be used for schedules
- cb14a05: Repack the package to fix issues with typescript with named exports
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/backend-app-api@0.7.9-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/plugin-permission-node@0.7.32-next.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.8.1
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.0

### Minor Changes

- 662dce8: **BREAKING**: The `workdir` argument have been removed from The `GerritUrlReader` constructor.

  **BREAKING**: The Gerrit `readTree` implementation will now only use the Gitiles api. Support
  for using git to clone the repo has been removed.

- 02103be: Deprecated and moved over core services to `@backstage/backend-defaults`

### Patch Changes

- 1897169: Exposed `DefaultSchedulerService`
- b5bc997: Refactor cache manager inline types.
- e171620: Remove dependency with `@backstage/backend-commons` package.
- 6551b3d: Added core service factories and implementations from
  `@backstage/backend-app-api`. They are now available as subpath exports, e.g.
  `@backstage/backend-defaults/scheduler` is where the service factory and default
  implementation of `coreServices.scheduler` now lives. They have been marked as
  deprecated in their old locations.
- 8aab451: Internal minor refactors of the database connectors
- 0634fdc: Deprecated `dropDatabase`
- b2ee7f3: Moved over all URL reader functionality from `@backstage/backend-common` to `@backstage/backend-defaults/urlReader`. Please update your imports.
- 9539a0b: Added `@backstage/backend-defaults/auth`, `@backstage/backend-defaults/httpAuth`, and `@backstage/backend-defaults/userInfo` to house their respective backend service factories. You should now import these services from those new locations, instead of `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/integration@1.12.0
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-permission-node@0.7.30
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.8.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.0-next.3

### Patch Changes

- 1897169: Exposed `DefaultSchedulerService`
- 8aab451: Internal minor refactors of the database connectors
- b2ee7f3: Moved over all URL reader functionality from `@backstage/backend-common` to `@backstage/backend-defaults/urlReader`. Please update your imports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-permission-node@0.7.30-next.3
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/backend-app-api@0.7.6-next.3
  - @backstage/config-loader@1.8.1-next.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.3.0-next.2

### Patch Changes

- 0634fdc: Deprecated `dropDatabase`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-permission-node@0.7.30-next.2
  - @backstage/backend-app-api@0.7.6-next.2
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/config-loader@1.8.0
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.0-next.1

### Minor Changes

- 02103be: Deprecated and moved over core services to `@backstage/backend-defaults`

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-permission-node@0.7.30-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/config-loader@1.8.0
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.2.19-next.0

### Patch Changes

- 6551b3d: Added core service factories and implementations from
  `@backstage/backend-app-api`. They are now available as subpath exports, e.g.
  `@backstage/backend-defaults/scheduler` is where the service factory and default
  implementation of `coreServices.scheduler` now lives. They have been marked as
  deprecated in their old locations.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-permission-node@0.7.30-next.0
  - @backstage/config-loader@1.8.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.18

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-app-api@0.7.3
  - @backstage/backend-common@0.22.0
  - @backstage/plugin-events-node@0.3.4

## 0.2.18-next.2

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.2-next.1
  - @backstage/backend-common@0.22.0-next.1

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.1-next.0
  - @backstage/backend-common@0.21.8-next.0

## 0.2.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-app-api@0.7.0

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-app-api@0.7.0-next.1

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.3-next.0
  - @backstage/backend-common@0.21.7-next.0

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.2
  - @backstage/backend-common@0.21.6

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.1
  - @backstage/backend-common@0.21.5

## 0.2.14

### Patch Changes

- 7cbb760: Added support for the new auth services, which are now installed by default. See the [migration guide](https://backstage.io/docs/tutorials/auth-service-migration) for details.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/backend-app-api@0.6.0

## 0.2.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.0-next.2
  - @backstage/backend-common@0.21.4-next.2

## 0.2.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-common@0.21.4-next.1

## 0.2.13-next.0

### Patch Changes

- 7cbb760: Added support for the new auth services, which are now installed by default. See the [migration guide](https://backstage.io/docs/tutorials/auth-service-migration) for details.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-app-api@0.6.0-next.0

## 0.2.10

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-app-api@0.5.11

## 0.2.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-app-api@0.5.11-next.3

## 0.2.10-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-app-api@0.5.11-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-app-api@0.5.11-next.1

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-app-api@0.5.11-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0

## 0.2.9

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-app-api@0.5.10

## 0.2.9-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-app-api@0.5.10-next.2
  - @backstage/backend-common@0.20.1-next.2

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.10-next.1
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-app-api@0.5.10-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-app-api@0.5.9
  - @backstage/backend-plugin-api@0.6.8

## 0.2.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-app-api@0.5.9-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3

## 0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-app-api@0.5.9-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-app-api@0.5.9-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-app-api@0.5.8

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-app-api@0.5.8-next.2

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-app-api@0.5.8-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.8-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-app-api@0.5.6-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-app-api@0.5.5-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/backend-app-api@0.5.5-next.0
  - @backstage/backend-plugin-api@0.6.5-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3
  - @backstage/backend-common@0.19.5
  - @backstage/backend-plugin-api@0.6.3

## 0.2.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.3
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-app-api@0.5.2-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0

## 0.2.0

### Minor Changes

- d008aefef808: **BREAKING**: Removing shared environments concept from the new experimental backend system.
- a6d7983f349c: **BREAKING**: Removed the `services` option from `createBackend`. Service factories are now `BackendFeature`s and should be installed with `backend.add(...)` instead. The following should be migrated:

  ```ts
  const backend = createBackend({ services: [myCustomServiceFactory] });
  ```

  To instead pass the service factory via `backend.add(...)`:

  ```ts
  const backend = createBackend();
  backend.add(customRootLoggerServiceFactory);
  ```

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-app-api@0.5.0
  - @backstage/backend-plugin-api@0.6.0

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.2.0-next.1

### Minor Changes

- d008aefef808: **BREAKING**: Removing shared environments concept from the new experimental backend system.

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-app-api@0.5.0-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.6-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-app-api@0.4.5
  - @backstage/backend-plugin-api@0.5.4

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-app-api@0.4.5-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/backend-app-api@0.4.4
  - @backstage/backend-plugin-api@0.5.3

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-app-api@0.4.4-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-app-api@0.4.4-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.4-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/backend-plugin-api@0.5.3-next.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-app-api@0.4.3
  - @backstage/backend-plugin-api@0.5.2

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-app-api@0.4.3-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-app-api@0.4.2
  - @backstage/backend-plugin-api@0.5.1

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/backend-plugin-api@0.5.1-next.0

## 0.1.8

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 482dae5de1c: Updated link to docs.
- 5d0693edc09: Added a workaround for the cyclic dependency bug across `@backstage/backend-common` and `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/backend-app-api@0.4.1

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-app-api@0.4.1-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2

## 0.1.8-next.1

### Patch Changes

- 482dae5de1c: Updated link to docs.
- 5d0693edc09: Added a workaround for the cyclic dependency bug across `@backstage/backend-common` and `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-app-api@0.4.1-next.1

## 0.1.8-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-app-api@0.4.1-next.0

## 0.1.7

### Patch Changes

- 725383f69d: Tweaked messaging in the README.
- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- Updated dependencies
  - @backstage/backend-app-api@0.4.0
  - @backstage/backend-plugin-api@0.4.0

## 0.1.7-next.2

### Patch Changes

- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- Updated dependencies
  - @backstage/backend-app-api@0.4.0-next.2
  - @backstage/backend-plugin-api@0.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-app-api@0.3.2-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.3.2-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.5

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- 843a0a158c: Added factory for the new core identity service to the set of default service factories.
- 5b7bcd3c5e: Added support to supply a shared environment to `createBackend`, which can be created using `createSharedEnvironment` from `@backstage/backend-plugin-api`.
- 02b119ff93: The new root HTTP router service is now installed by default.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-app-api@0.3.0

## 0.1.5-next.1

### Patch Changes

- ecc6bfe4c9: Use new `ServiceFactoryOrFunction` type.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- 02b119ff93: The new root HTTP router service is now installed by default.
- Updated dependencies
  - @backstage/backend-app-api@0.3.0-next.1
  - @backstage/backend-plugin-api@0.3.0-next.1

## 0.1.5-next.0

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## 0.1.4

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` to default service factories.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4
  - @backstage/backend-plugin-api@0.2.0

## 0.1.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1

## 0.1.4-next.0

### Patch Changes

- d6dbf1792b: Added `lifecycleFactory` to default service factories.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3
  - @backstage/backend-plugin-api@0.1.4

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0

## 0.1.2

### Patch Changes

- 96d288a02d: Added root logger service to the set of default services.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2
  - @backstage/backend-plugin-api@0.1.3

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-app-api@0.2.2-next.1

## 0.1.2-next.0

### Patch Changes

- 96d288a02d: Added root logger service to the set of default services.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0

## 0.1.1

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-app-api@0.2.1
  - @backstage/backend-plugin-api@0.1.2

## 0.1.1-next.1

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/backend-app-api@0.2.1-next.2

## 0.1.1-next.0

### Patch Changes

- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/backend-app-api@0.2.1-next.0

## 0.1.0

### Minor Changes

- 5df230d48c: Introduced a new `backend-defaults` package carrying `createBackend` which was previously exported from `backend-app-api`.
  The `backend-app-api` package now exports the `createSpecializedBacked` that does not add any service factories by default.

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.0
  - @backstage/backend-plugin-api@0.1.1
