# @backstage/backend-test-utils

## 1.11.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.9.0-next.0
  - @backstage/backend-defaults@0.18.2-next.0

## 1.11.8

### Patch Changes

- f6054ac: Test backends now provide the default experimental connections service for plugins and modules that declare connection dependencies.
- 7728fcd: Improved test database cleanup reliability by shutting down independent database engines and removing their logical databases concurrently.
- e956084: Updated the root instance metadata service mock to provide an instance ID.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/backend-defaults@0.18.1
  - @backstage/backend-app-api@1.8.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/plugin-auth-node@0.7.7
  - @backstage/plugin-events-node@0.4.27
  - @backstage/plugin-permission-common@0.9.12

## 1.11.8-next.2

### Patch Changes

- f6054ac: Test backends now provide the default experimental connections service for plugins and modules that declare connection dependencies.
- Updated dependencies
  - @backstage/backend-defaults@0.18.1-next.3
  - @backstage/backend-plugin-api@1.11.0-next.2
  - @backstage/backend-app-api@1.8.0-next.2

## 1.11.8-next.1

### Patch Changes

- e956084: Updated the root instance metadata service mock to provide an instance ID.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-defaults@0.18.1-next.1
  - @backstage/backend-app-api@1.8.0-next.1
  - @backstage/plugin-auth-node@0.7.7-next.1
  - @backstage/plugin-events-node@0.4.27-next.1

## 1.11.8-next.0

### Patch Changes

- 7728fcd: Improved test database cleanup reliability by shutting down independent database engines and removing their logical databases concurrently.
- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-defaults@0.18.1-next.0
  - @backstage/backend-app-api@1.7.5-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0
  - @backstage/plugin-permission-common@0.9.12-next.0
  - @backstage/plugin-events-node@0.4.27-next.0

## 1.11.7

### Patch Changes

- 05d03ee: Increased the test database cleanup timeout to 60 seconds to reduce timeout failures when using Docker.
- Updated dependencies
  - @backstage/backend-defaults@0.18.0
  - @backstage/plugin-auth-node@0.7.6
  - @backstage/config@1.3.9
  - @backstage/backend-app-api@1.7.4
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-events-node@0.4.26
  - @backstage/plugin-permission-common@0.9.11

## 1.11.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/backend-defaults@0.17.9-next.1
  - @backstage/backend-app-api@1.7.4-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/plugin-auth-node@0.7.5-next.1
  - @backstage/plugin-permission-common@0.9.11-next.0

## 1.11.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.9-next.0
  - @backstage/backend-app-api@1.7.4-next.0
  - @backstage/plugin-auth-node@0.7.5-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-events-node@0.4.26-next.0

## 1.11.6

### Patch Changes

- b1b6c80: Aligned mocked action attributes so read-only actions default to non-destructive.
- 5ae46fc: Added `mockServices.rootSystemMetadata` mock implementation to support the new stable `coreServices.rootSystemMetadata` service in tests.
- Updated dependencies
  - @backstage/backend-defaults@0.17.7
  - @backstage/backend-app-api@1.7.3
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-auth-node@0.7.4
  - @backstage/plugin-permission-common@0.9.10
  - @backstage/plugin-events-node@0.4.25

## 1.11.6-next.1

### Patch Changes

- b1b6c80: Aligned mocked action attributes so read-only actions default to non-destructive.
- Updated dependencies
  - @backstage/backend-defaults@0.17.7-next.2
  - @backstage/backend-plugin-api@1.10.0-next.1

## 1.11.6-next.0

### Patch Changes

- 5ae46fc: Added `mockServices.rootSystemMetadata` mock implementation to support the new stable `coreServices.rootSystemMetadata` service in tests.
- Updated dependencies
  - @backstage/backend-defaults@0.17.6-next.0
  - @backstage/backend-app-api@1.7.3-next.0
  - @backstage/plugin-auth-node@0.7.4-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-events-node@0.4.25-next.0

## 1.11.5

### Patch Changes

- 41c56b3: Fixed MySQL test database failures by pinning the Docker image from the floating `mysql:8` tag to `mysql:8.4` and replacing a startup flag that was removed in MySQL 8.4. Connection pool reduced from 50 to 5 per test database, idle connections are now reaped after 5 seconds, and container connection limits raised to 1000 for both MySQL and Postgres to handle parallel Jest workers on high-core machines.
- Updated dependencies
  - @backstage/backend-defaults@0.17.5
  - @backstage/plugin-auth-node@0.7.3
  - @backstage/backend-app-api@1.7.2
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-events-node@0.4.24

## 1.11.5-next.0

### Patch Changes

- 41c56b3: Fixed MySQL test database failures by pinning the Docker image from the floating `mysql:8` tag to `mysql:8.4` and replacing a startup flag that was removed in MySQL 8.4. Connection pool reduced from 50 to 5 per test database, idle connections are now reaped after 5 seconds, and container connection limits raised to 1000 for both MySQL and Postgres to handle parallel Jest workers on high-core machines.
- Updated dependencies
  - @backstage/backend-defaults@0.17.4-next.0
  - @backstage/plugin-auth-node@0.7.3-next.0
  - @backstage/backend-app-api@1.7.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-events-node@0.4.24-next.0

## 1.11.4

### Patch Changes

- 2e895ea: Internal refactor.
- 2d181c0: Increased MySQL connection and pool timeouts to reduce flaky `connect ETIMEDOUT` failures in CI. The test MySQL container now also uses `mysql_native_password` for cheaper connection handshakes and disables binary logging.
- 06a2035: Updated `MockActionsRegistry` to support the new secrets schema. The mock now validates secrets against the declared schema, rejects missing secrets for actions that require them, and forwards secrets to the action handler.
- Updated dependencies
  - @backstage/backend-defaults@0.17.3
  - @backstage/backend-app-api@1.7.1
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-auth-node@0.7.2
  - @backstage/plugin-events-node@0.4.23

## 1.11.4-next.1

### Patch Changes

- 2d181c0: Increased MySQL connection and pool timeouts to reduce flaky `connect ETIMEDOUT` failures in CI. The test MySQL container now also uses `mysql_native_password` for cheaper connection handshakes and disables binary logging.
- 06a2035: Updated `MockActionsRegistry` to support the new secrets schema. The mock now validates secrets against the declared schema, rejects missing secrets for actions that require them, and forwards secrets to the action handler.
- Updated dependencies
  - @backstage/backend-defaults@0.17.3-next.1
  - @backstage/backend-plugin-api@1.9.2-next.1

## 1.11.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.17.2-next.0
  - @backstage/plugin-auth-node@0.7.2-next.0
  - @backstage/backend-app-api@1.7.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-events-node@0.4.23-next.0

## 1.11.3

### Patch Changes

- 7fb12b8: Added a new tracing service mock to be leveraged in tests
- ada7df7: Fixed `mockCredentials` to include the internal `version: 'v1'` field on all credential objects (`none()`, `user()`, `limitedUser()`, `service()`), and fixed `user()` to encode the user entity ref into the token (matching `user.token(ref)` behavior). This makes mock credentials compatible with `toInternalBackstageCredentials()`, which validates the version field, and ensures that credentials for different users produce different tokens.
- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- 6209065: Added `context` and `propagation` to the alpha `TracingService`. Plugins can bridge OpenTelemetry context across async boundaries via `tracing.propagation.extract(tracing.context.active(), carrier)` followed by `tracing.context.with(ctx, fn)`, and read propagated baggage via `tracing.propagation.getActiveBaggage()` or `tracing.propagation.getBaggage(ctx)`.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/backend-defaults@0.17.1
  - @backstage/backend-app-api@1.7.0
  - @backstage/plugin-auth-node@0.7.1
  - @backstage/plugin-permission-common@0.9.9
  - @backstage/config@1.3.8
  - @backstage/plugin-events-node@0.4.22

## 1.11.3-next.2

### Patch Changes

- 7fb12b8: Added a new tracing service mock to be leveraged in tests
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.1-next.1
  - @backstage/backend-defaults@0.17.1-next.2

## 1.11.3-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/backend-defaults@0.17.1-next.1
  - @backstage/plugin-auth-node@0.7.1-next.1
  - @backstage/plugin-permission-common@0.9.9-next.1

## 1.11.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-app-api@1.7.0-next.0
  - @backstage/backend-defaults@0.17.1-next.0
  - @backstage/plugin-auth-node@0.7.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-events-node@0.4.22-next.0
  - @backstage/plugin-permission-common@0.9.9-next.0
  - @backstage/types@1.2.2

## 1.11.2

### Patch Changes

- 4559806: Added support for typed `examples` on actions registered via the actions registry. Action authors can now provide examples with compile-time-checked `input` and `output` values that match their schema definitions.
- f44c6bd: Deduplicated internal readiness-polling helpers used by the database and cache test infrastructure.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/backend-defaults@0.17.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-auth-node@0.7.0
  - @backstage/backend-app-api@1.6.1
  - @backstage/config@1.3.7
  - @backstage/plugin-events-node@0.4.21
  - @backstage/plugin-permission-common@0.9.8

## 1.11.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-auth-node@0.7.0-next.2
  - @backstage/backend-app-api@1.6.1-next.2
  - @backstage/backend-defaults@0.16.1-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-events-node@0.4.21-next.2
  - @backstage/plugin-permission-common@0.9.8-next.0

## 1.11.2-next.1

### Patch Changes

- 4559806: Added support for typed `examples` on actions registered via the actions registry. Action authors can now provide examples with compile-time-checked `input` and `output` values that match their schema definitions.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/backend-defaults@0.16.1-next.1
  - @backstage/plugin-auth-node@0.7.0-next.1
  - @backstage/backend-app-api@1.6.1-next.1
  - @backstage/plugin-events-node@0.4.21-next.1

## 1.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.16.1-next.0
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/backend-app-api@1.6.1-next.0
  - @backstage/plugin-auth-node@0.6.15-next.0
  - @backstage/plugin-events-node@0.4.21-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.7

## 1.11.1

### Patch Changes

- dee4283: Added `pluginId` field to `ActionsServiceAction` type, populated from the registering plugin's metadata.
- 164711a: Added `cancelTask` to `MockSchedulerService` and mock scheduler service factory.
- 62f0a53: Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- 1ee5b28: Adds a new metrics service mock to be leveraged in tests
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/backend-defaults@0.16.0
  - @backstage/plugin-permission-common@0.9.7
  - @backstage/plugin-auth-node@0.6.14
  - @backstage/backend-app-api@1.6.0
  - @backstage/plugin-events-node@0.4.20

## 1.11.1-next.2

### Patch Changes

- 164711a: Added `cancelTask` to `MockSchedulerService` and mock scheduler service factory.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/backend-defaults@0.16.0-next.2
  - @backstage/backend-app-api@1.6.0-next.1
  - @backstage/plugin-auth-node@0.6.14-next.2
  - @backstage/plugin-events-node@0.4.20-next.1

## 1.11.1-next.1

### Patch Changes

- 62f0a53: Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.
- Updated dependencies
  - @backstage/backend-defaults@0.16.0-next.1
  - @backstage/plugin-auth-node@0.6.14-next.1
  - @backstage/backend-app-api@1.5.1-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6

## 1.11.1-next.0

### Patch Changes

- 1ee5b28: Adds a new metrics service mock to be leveraged in tests
- Updated dependencies
  - @backstage/backend-defaults@0.15.3-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/backend-app-api@1.5.1-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-auth-node@0.6.14-next.0
  - @backstage/plugin-events-node@0.4.20-next.0
  - @backstage/plugin-permission-common@0.9.6

## 1.11.0

### Minor Changes

- 42abfb1: Added `createServiceMock`, a public utility for creating `ServiceMock` instances for custom service refs. This allows plugin authors to define mock creators for their own services following the same pattern as the built-in `mockServices` mocks.

### Patch Changes

- f1d29b4: Updated `startTestBackend` to support factory-based extension points (v1.1 format) in addition to the existing direct implementation format.
- 7455dae: Use node prefix on native imports
- 68eb322: Added `@types/jest` as an optional peer dependency, since jest types are exposed in the public API surface.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/backend-app-api@1.5.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/backend-defaults@0.15.2
  - @backstage/plugin-auth-node@0.6.13
  - @backstage/plugin-permission-common@0.9.6
  - @backstage/plugin-events-node@0.4.19

## 1.11.0-next.1

### Minor Changes

- 42abfb1: Added `createServiceMock`, a public utility for creating `ServiceMock` instances for custom service refs. This allows plugin authors to define mock creators for their own services following the same pattern as the built-in `mockServices` mocks.

### Patch Changes

- 68eb322: Added `@types/jest` as an optional peer dependency, since jest types are exposed in the public API surface.
- Updated dependencies
  - @backstage/backend-app-api@1.5.0-next.1
  - @backstage/backend-defaults@0.15.2-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-auth-node@0.6.13-next.1
  - @backstage/plugin-events-node@0.4.19-next.0

## 1.10.4-next.0

### Patch Changes

- f1d29b4: Updated `startTestBackend` to support factory-based extension points (v1.1 format) in addition to the existing direct implementation format.
- 7455dae: Use node prefix on native imports
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/plugin-auth-node@0.6.12-next.0
  - @backstage/backend-app-api@1.5.0-next.0
  - @backstage/plugin-permission-common@0.9.5-next.0
  - @backstage/plugin-events-node@0.4.19-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 1.10.3

### Patch Changes

- 872eb91: Upgrade `zod-to-json-schema` to latest version
- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/backend-app-api@1.4.1
  - @backstage/plugin-auth-node@0.6.11
  - @backstage/plugin-permission-common@0.9.4

## 1.10.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2
  - @backstage/backend-app-api@1.4.0
  - @backstage/plugin-auth-node@0.6.10

## 1.10.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-app-api@1.4.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-events-node@0.4.18
  - @backstage/plugin-permission-common@0.9.3

## 1.10.2

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 8be23a4: Switched `textextensions` dependency for `text-extensions`.
- 5a737e1: Fix PostgreSQL 18 `TestDatabases` by pinning the data directory
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/backend-defaults@0.14.0
  - @backstage/plugin-events-node@0.4.18
  - @backstage/backend-app-api@1.4.0
  - @backstage/backend-plugin-api@1.6.0

## 1.10.2-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 8be23a4: Switched `textextensions` dependency for `text-extensions`.
- 5a737e1: Fix PostgreSQL 18 `TestDatabases` by pinning the data directory
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/plugin-auth-node@0.6.10-next.1
  - @backstage/plugin-events-node@0.4.18-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/backend-app-api@1.4.0-next.1
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.3

## 1.10.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10-next.0
  - @backstage/backend-app-api@1.4.0-next.0
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-events-node@0.4.18-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.3

## 1.10.0

### Minor Changes

- d57b13b: Added support for Postgres 18 to the available `TestDatabases`.

  Note that the set of _default_ databases to test against for users of the `TestDatabases` class was also updated to include Postgres 14 and 18, instead of 13 and 17. If you need to override this, you can pass in an explicit `ids` argument, for example `ids: ['POSTGRES_17', 'POSTGRES_13', 'SQLITE_3']`.

### Patch Changes

- f3001fd: Tweak some of the mock services to have more precise types
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/backend-app-api@1.3.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## 1.10.0-next.2

### Patch Changes

- f3001fd: Tweak some of the mock services to have more precise types
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.2

## 1.10.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/backend-app-api@1.3.0-next.1
  - @backstage/plugin-permission-common@0.9.3-next.1
  - @backstage/plugin-auth-node@0.6.9-next.1
  - @backstage/plugin-events-node@0.4.17-next.1

## 1.10.0-next.0

### Minor Changes

- d57b13b: Added support for Postgres 18 to the available `TestDatabases`.

  Note that the set of _default_ databases to test against for users of the `TestDatabases` class was also updated to include Postgres 14 and 18, instead of 13 and 17. If you need to override this, you can pass in an explicit `ids` argument, for example `ids: ['POSTGRES_17', 'POSTGRES_13', 'SQLITE_3']`.

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/plugin-events-node@0.4.17-next.0
  - @backstage/plugin-auth-node@0.6.9-next.0
  - @backstage/backend-app-api@1.2.9-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-permission-common@0.9.3-next.0

## 1.9.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/backend-app-api@1.2.8
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-auth-node@0.6.8
  - @backstage/plugin-events-node@0.4.16
  - @backstage/plugin-permission-common@0.9.2

## 1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/backend-app-api@1.2.8-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-auth-node@0.6.8-next.0
  - @backstage/plugin-permission-common@0.9.2-next.0
  - @backstage/plugin-events-node@0.4.16-next.0

## 1.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/backend-app-api@1.2.7
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-events-node@0.4.15
  - @backstage/plugin-permission-common@0.9.1

## 1.9.0

### Minor Changes

- 4e2c237: The `mockServices.rootConfig()` instance now has an `update` method that can be used to test configuration subscriptions and updates.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-events-node@0.4.15
  - @backstage/types@1.2.2
  - @backstage/backend-app-api@1.2.7
  - @backstage/backend-plugin-api@1.4.3

## 1.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.7-next.0
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/backend-app-api@1.2.7-next.0
  - @backstage/plugin-events-node@0.4.15-next.0

## 1.9.0-next.0

### Minor Changes

- 4e2c237: The `mockServices.rootConfig()` instance now has an `update` method that can be used to test configuration subscriptions and updates.

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.2.6
  - @backstage/backend-defaults@0.12.0
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-events-node@0.4.14
  - @backstage/plugin-permission-common@0.9.1

## 1.8.0

### Minor Changes

- dffaf70: Switched out `mockServices.scheduler` to use a mocked implementation instead of the default scheduler implementation. This implementation runs any scheduled tasks immediately on startup, as long as they don't have an initial delay or a manual trigger. After the initial run, the tasks are never run again unless manually triggered.

### Patch Changes

- 279e1f7: Updated the type definition of `mockErrorHandler` to ensure that it is used correctly.

  ```ts
  // This is wrong and will now result in a type error
  app.use(mockErrorHandler);

  // This is the correct usage
  app.use(mockErrorHandler());
  ```

- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/backend-app-api@1.2.6
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14

## 1.7.1-next.0

### Patch Changes

- 3a7dad9: Updated `better-sqlite3` to v12
- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/backend-app-api@1.2.6-next.0
  - @backstage/plugin-auth-node@0.6.6-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.9.1

## 1.7.0

### Minor Changes

- ead925a: Add a standard `toString` on credentials objects

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/plugin-permission-common@0.9.1
  - @backstage/backend-defaults@0.11.1
  - @backstage/backend-app-api@1.2.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-auth-node@0.6.5
  - @backstage/plugin-events-node@0.4.13

## 1.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/plugin-permission-common@0.9.1-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/backend-app-api@1.2.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-auth-node@0.6.5-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 1.7.0-next.0

### Minor Changes

- ead925a: Add a standard `toString` on credentials objects

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/backend-app-api@1.2.4
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-events-node@0.4.12
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-common@0.9.0

## 1.6.0

### Minor Changes

- 6dfb7be: Added `mockServices.permissions()` that can return actual results.
- c999c25: Added an `actionsRegistryServiceMock` and `actionsServiceMock` to `/alpha` export for the experimental services.

  This allows you to write tests for your actions by doing something similar to the following:

  ```ts
  import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

  const mockActionsRegistry = actionsRegistryServiceMock();
  const mockCatalog = catalogServiceMock({
    entities: [
     ...
    ],
  });

  createGetCatalogEntityAction({
    catalog: mockCatalog,
    actionsRegistry: mockActionsRegistry,
  });

  await expect(
    mockActionsRegistry.invoke({
      id: 'test:get-catalog-entity',
      input: { name: 'test' },
    }),
  ).resolves.toEqual(...)
  ```

### Patch Changes

- 12c1fd4: Make the `user` credentials mock behave more like production
- Updated dependencies
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-app-api@1.2.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-permission-common@0.9.0

## 1.6.0-next.2

### Patch Changes

- 12c1fd4: Make the `user` credentials mock behave more like production
- Updated dependencies
  - @backstage/backend-defaults@0.11.0-next.2
  - @backstage/backend-app-api@1.2.4-next.2
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-events-node@0.4.12-next.1

## 1.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/backend-app-api@1.2.4-next.1
  - @backstage/backend-defaults@0.10.1-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12-next.1

## 1.6.0-next.0

### Minor Changes

- c999c25: Added mock implementations for `ActionsService` and `ActionsRegistryService`

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/backend-defaults@0.10.1-next.0
  - @backstage/backend-app-api@1.2.4-next.0
  - @backstage/plugin-auth-node@0.6.4-next.0
  - @backstage/plugin-events-node@0.4.12-next.0

## 1.5.0

### Minor Changes

- b3832d1: Add a functional `mockServices.events()`
- c6bc67d: Added Valkey support alongside Redis in backend-defaults cache clients, using the new Keyv Valkey package. Also extended backend-test-utils to support Valkey in tests.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0
  - @backstage/backend-app-api@1.2.3
  - @backstage/plugin-auth-node@0.6.3
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11

## 1.5.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.3
  - @backstage/plugin-auth-node@0.6.3-next.2
  - @backstage/backend-app-api@1.2.3-next.2
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.2

## 1.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.2
  - @backstage/config@1.3.2
  - @backstage/backend-app-api@1.2.3-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 1.5.0-next.1

### Minor Changes

- c6bc67d: Added Valkey support alongside Redis in backend-defaults cache clients, using the new Keyv Valkey package. Also extended backend-test-utils to support Valkey in tests.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/backend-app-api@1.2.3-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## 1.5.0-next.0

### Minor Changes

- b3832d1: Add a functional `mockServices.events()`

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.1-next.0
  - @backstage/backend-app-api@1.2.3-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-auth-node@0.6.3-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 1.4.0

### Minor Changes

- cf4eb13: Added `actor` property to `BackstageUserPrincipal` containing the subject of the last service (if any) who performed authentication on behalf of the user.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/backend-app-api@1.2.2
  - @backstage/plugin-auth-node@0.6.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.10

## 1.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.2
  - @backstage/backend-app-api@1.2.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-events-node@0.4.9

## 1.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.1
  - @backstage/backend-app-api@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9

## 1.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.9.0-next.0
  - @backstage/backend-app-api@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9

## 1.3.1

### Patch Changes

- c3a91d5: Added support for PostgreSQL version 17
- 37c6510: Moved `@types/jest` to `devDependencies`.
- Updated dependencies
  - @backstage/backend-defaults@0.8.2
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-app-api@1.2.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 1.3.1-next.2

### Patch Changes

- 37c6510: Moved `@types/jest` to `devDependencies`.
- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.2
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-app-api@1.2.1-next.2
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1-next.1

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-app-api@1.2.1-next.1
  - @backstage/backend-defaults@0.8.2-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.9-next.1

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.8.2-next.0
  - @backstage/backend-app-api@1.2.1-next.0
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-events-node@0.4.9-next.0

## 1.3.0

### Minor Changes

- dd05a97: Added mocks for the new `PermissionsRegistryService`.
- a4aa244: This change introduces mocks for the `auditor` service.

### Patch Changes

- f866b86: Internal refactor to use explicit `require` for lazy-loading dependency.
- fb051f2: Sync feature installation compatibility logic with `@backstage/backend-app-api`.
- 72cddf2: Added the new `getPermissionRuleset` method to `mockServices.permissionsRegistry`.
- Updated dependencies
  - @backstage/backend-defaults@0.8.0
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/backend-app-api@1.2.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8

## 1.3.0-next.3

### Patch Changes

- 72cddf2: Added the new `getPermissionRuleset` method to `mockServices.permissionsRegistry`.
- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/backend-app-api@1.2.0-next.3
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 1.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/backend-defaults@0.8.0-next.2
  - @backstage/backend-app-api@1.2.0-next.2
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.8-next.1

## 1.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.1.2-next.1
  - @backstage/backend-defaults@0.8.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-events-node@0.4.8-next.0

## 1.3.0-next.0

### Minor Changes

- dd05a97: Added mocks for the new `PermissionsRegistryService`.
- a4aa244: This change introduces mocks for the `auditor` service.

### Patch Changes

- f866b86: Internal refactor to use explicit `require` for lazy-loading dependency.
- fb051f2: Sync feature installation compatibility logic with `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-defaults@0.8.0-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/backend-app-api@1.1.2-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-events-node@0.4.8-next.0

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.7.0
  - @backstage/backend-app-api@1.1.1
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-events-node@0.4.7

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-app-api@1.1.1-next.1
  - @backstage/backend-defaults@0.7.0-next.1
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-events-node@0.4.7-next.1

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.7.0-next.0
  - @backstage/backend-app-api@1.1.1-next.0
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0
  - @backstage/plugin-events-node@0.4.7-next.0

## 1.2.0

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

### Patch Changes

- 0e9c9fa: Mock the new `RootLifecycleService.addBeforeShutdownHook` method.
- Updated dependencies
  - @backstage/backend-defaults@0.6.0
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/backend-app-api@1.1.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0

## 1.2.0-next.2

### Patch Changes

- 0e9c9fa: Mock the new `RootLifecycleService.addBeforeShutdownHook` method.
- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.2
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/backend-app-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0

## 1.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-defaults@0.6.0-next.1
  - @backstage/backend-app-api@1.1.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-events-node@0.4.6-next.1

## 1.2.0-next.0

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

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/backend-app-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0

## 1.1.0

### Minor Changes

- 5064827: Made it possible to construct `mockServices.database` with a given knex instance

### Patch Changes

- 7aae8e3: The `mockServices.discovery.factory()` factory now uses the mocked discovery service as its implementation, avoid the need for configuration.
- eb82994: Removed unused `msw` dependency.
- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/backend-defaults@0.5.3
  - @backstage/types@1.2.0
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/backend-app-api@1.0.2
  - @backstage/errors@1.2.5

## 1.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-defaults@0.5.3-next.3
  - @backstage/backend-app-api@1.0.2-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.2

## 1.1.0-next.2

### Minor Changes

- 5064827: Made it possible to construct `mockServices.database` with a given knex instance

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.2
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-app-api@1.0.2-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@1.0.2-next.1
  - @backstage/backend-defaults@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-events-node@0.4.4-next.1

## 1.0.3-next.0

### Patch Changes

- 7aae8e3: The `mockServices.discovery.factory()` factory now uses the mocked discovery service as its implementation, avoid the need for configuration.
- eb82994: Removed unused `msw` dependency.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-defaults@0.5.3-next.0
  - @backstage/backend-app-api@1.0.2-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.1

### Patch Changes

- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- a19ce00: The `createMockDirectory` cleanup strategy has been changed, no longer requiring it to be called outside individual tests.
- 9cc7dd6: Minor doc string changes
- Updated dependencies
  - @backstage/backend-defaults@0.5.1
  - @backstage/backend-app-api@1.0.1
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-events-node@0.4.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.1-next.2

### Patch Changes

- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- Updated dependencies
  - @backstage/backend-app-api@1.0.1-next.1
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.1
  - @backstage/backend-app-api@1.0.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/plugin-events-node@0.4.1-next.0

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.0
  - @backstage/backend-app-api@1.0.1-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.0

### Major Changes

- ec1b4be: Release 1.0 of the new backend system! :tada:

  The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

  This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).

### Minor Changes

- 19ff127: **BREAKING**: Removed service mocks for the identity and token manager services, which have been removed from `@backstage/backend-plugin-api`.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 710f621: Added missing service mock for `mockServices.rootConfig.mock`, and fixed the definition of `mockServices.rootHttpRouter.factory` to not have a duplicate callback.
- f421d2a: Make MySQL pool settings a bit more lax
- 0363bf1: There is a new `mockErrorHandler` utility to help in mocking the error middleware in tests.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-defaults@0.5.0
  - @backstage/backend-app-api@1.0.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.0.0-next.2

### Major Changes

- ec1b4be: Release 1.0 of the new backend system! :tada:

  The backend system is finally getting promoted to 1.0.0. This means that the API is now stable and breaking changes should not occur until version 2.0.0, see our [package versioning policy](https://backstage.io/docs/overview/versioning-policy/#package-versioning-policy) for more information what this means.

  This release also marks the end of the old backend system based on `createRouter` exports. Going forward backend plugins packages will start to deprecate and later this year remove exports supporting the old backend system. If you would like to help out with this transition, see https://github.com/backstage/backstage/issues/26353 or consult the [migration guide](https://backstage.io/docs/backend-system/building-plugins-and-modules/migrating/#remove-support-for-the-old-backend-system).

### Patch Changes

- f421d2a: Make MySQL pool settings a bit more lax
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-app-api@1.0.0-next.2
  - @backstage/backend-defaults@0.5.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.6.0-next.1

### Patch Changes

- 710f621: Added missing service mock for `mockServices.rootConfig.mock`, and fixed the definition of `mockServices.rootHttpRouter.factory` to not have a duplicate callback.
- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-app-api@0.10.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.6.0-next.0

### Minor Changes

- 19ff127: **BREAKING**: Removed service mocks for the identity and token manager services, which have been removed from `@backstage/backend-plugin-api`.
- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 0363bf1: There is a new `mockErrorHandler` utility to help in mocking the error middleware in tests.
- Updated dependencies
  - @backstage/backend-app-api@0.10.0-next.0
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-defaults@0.5.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.5.0

### Minor Changes

- 861f162: **BREAKING**: Removed these deprecated helpers:

  - `setupRequestMockHandlers` is removed; use `registerMswTestHooks` instead.
  - `MockDirectoryOptions` is removed; use `CreateMockDirectoryOptions` instead.

  Stopped exporting the deprecated and internal `isDockerDisabledForTests` helper.

  Removed `get` method from `ServiceFactoryTester` which is replaced by `getSubject`

### Patch Changes

- 8b13183: Internal updates to support latest version of `BackendFeauture`s from `@backstage/backend-plugin-api`.
- b63d378: Update internal imports
- 7c5f3b0: Update the `ServiceFactoryTester` to be able to test services that enables multi implementation installation.
- 4e79d19: The default services for `startTestBackend` and `ServiceFactoryTester` now includes the Root Health Service.
- Updated dependencies
  - @backstage/backend-defaults@0.4.2
  - @backstage/backend-app-api@0.9.0
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9

## 0.4.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-defaults@0.4.2-next.3
  - @backstage/backend-app-api@0.8.1-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.4.5-next.2

### Patch Changes

- 8b13183: Internal updates to support latest version of `BackendFeauture`s from `@backstage/backend-plugin-api`.
- 7c5f3b0: Update the `ServiceFactoryTester` to be able to test services that enables multi implementation installation.
- Updated dependencies
  - @backstage/backend-defaults@0.4.2-next.2
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-app-api@0.8.1-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-app-api@0.8.1-next.1
  - @backstage/backend-defaults@0.4.2-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.4.5-next.0

### Patch Changes

- 4e79d19: The default services for `startTestBackend` and `ServiceFactoryTester` now includes the Root Health Service.
- Updated dependencies
  - @backstage/backend-defaults@0.4.2-next.0
  - @backstage/backend-app-api@0.8.1-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.4.4

### Patch Changes

- 2f99178: The `ServiceFactoryTest.get` method was deprecated and the `ServiceFactoryTest.getSubject` should be used instead. The `getSubject` method has the same behavior, but has a better method name to indicate that the service instance returned is the subject currently being tested.
- edf5cc3: The function `isDockerDisabledForTests` is deprecated and will no longer be exported in the near future as it should only be used internally.
- b05e1e1: Service factories exported by this package have been updated to use the new service factory format that doesn't use a callback.
- fce7887: Added mock for the Root Health Service in `mockServices`.
- 906c817: Updated `startTestBackend` and `ServiceFactoryTester` to only accept plain service factory or backend feature objects, no longer supporting the callback form. This lines up with the changes to `@backstage/backend-plugin-api` and should not require any code changes.
- 95a3a0b: Rename frontend and backend `setupRequestMockHandlers` methods to `registerMswTestHooks`.
- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0
- 98ccf00: Internal refactor of `mockServices.httpAuth.factory` to allow it to still be constructed with options, but without declaring options via `createServiceFactory`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-defaults@0.4.0
  - @backstage/backend-app-api@0.8.0
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.4-next.1

### Patch Changes

- b9ed1bb: bumped better-sqlite3 from ^9.0.0 to ^11.0.0
- Updated dependencies
  - @backstage/backend-defaults@0.3.4-next.1
  - @backstage/backend-app-api@0.7.10-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.4.3-next.0

### Patch Changes

- fce7887: Added mock for the Root Health Service in `mockServices`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-defaults@0.3.3-next.0
  - @backstage/backend-app-api@0.7.9-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.0

### Minor Changes

- 805cbe7: Added `TestCaches` that functions just like `TestDatabases`

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- 9e63318: Made it possible to give access restrictions to `mockCredentials.service`
- 006b3e8: The type `MockDirectoryOptions` was renamed to `CreateMockDirectoryOptions` so that it's clear these options are exclusive to the mock directory factory.
- 0634fdc: Refactored `TestDatabases` to no longer depend on `backend-common`
- 6a576dc: Fix the logger service mock to prevent returning `undefined` from the `child` method.
- 6c11f6e: Use imports from backend-defaults instead of the deprecated ones from backend-app-api
- Updated dependencies
  - @backstage/backend-app-api@0.7.6
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/backend-defaults@0.3.0
  - @backstage/plugin-events-node@0.3.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.0-next.3

### Patch Changes

- 006b3e8: The type `MockDirectoryOptions` was renamed to `CreateMockDirectoryOptions` so that it's clear these options are exclusive to the mock directory factory.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-app-api@0.7.6-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.0-next.2

### Patch Changes

- 0634fdc: Refactored `TestDatabases` to no longer depend on `backend-common`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-app-api@0.7.6-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.4.0-next.1

### Minor Changes

- 805cbe7: Added `TestCaches` that functions just like `TestDatabases`

### Patch Changes

- 9e63318: Made it possible to give access restrictions to `mockCredentials.service`
- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.3.9-next.0

### Patch Changes

- 6a576dc: Fix the logger service mock to prevent returning `undefined` from the `child` method.
- Updated dependencies
  - @backstage/backend-app-api@0.7.6-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.8

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-app-api@0.7.3
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-events-node@0.3.4
  - @backstage/plugin-auth-node@0.4.13

## 0.3.8-next.2

### Patch Changes

- 7e5a50d: added `eventsServiceFactory` to `defaultServiceFactories` to resolve issue where different instances of the EventsServices could be used
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.3.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.2-next.1
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.7.1-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.7

### Patch Changes

- 3256f14: `startTestBackend` will now add placeholder plugins when a modules are provided without their parent plugin.
- 007e7ea: Added mock of the new `listPublicServiceKeys` method for `AuthService`.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-app-api@0.7.0
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.7-next.1

### Patch Changes

- 3256f14: `startTestBackend` will now add placeholder plugins when a modules are provided without their parent plugin.
- 007e7ea: Added mock of the new `listPublicServiceKeys` method for `AuthService`.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-app-api@0.7.0-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.3-next.0
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.2
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.1
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.3.4

### Patch Changes

- 4a3d434: Added support for the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/) and [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution). These services will be present by default in test apps, and you can access mocked versions of their features under `mockServices.auth` and `mockServices.httpAuth` if you want to inspect or replace their behaviors.

  There is also a new `mockCredentials` that you can use for acquiring mocks of the various types of credentials that are used in the new system.

- 9802004: Added `mockServices.userInfo`, which now also automatically is made available in test backends.
- fd61d39: Updated dependency `testcontainers` to `^10.0.0`.
- ff40ada: Updated dependency `mysql2` to `^3.0.0`.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/backend-app-api@0.6.0
  - @backstage/types@1.1.1

## 0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.0-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.3.3-next.0

### Patch Changes

- 4a3d434: Added support for the new [`auth`](https://backstage.io/docs/backend-system/core-services/auth/) and [`httpAuth`](https://backstage.io/docs/backend-system/core-services/http-auth) services that were created as part of [BEP-0003](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution). These services will be present by default in test apps, and you can access mocked versions of their features under `mockServices.auth` and `mockServices.httpAuth` if you want to inspect or replace their behaviors.

  There is also a new `mockCredentials` that you can use for acquiring mocks of the various types of credentials that are used in the new system.

- 9802004: Added `mockServices.userInfo`, which now also automatically is made available in test backends.
- fd61d39: Updated dependency `testcontainers` to `^10.0.0`.
- ff40ada: Updated dependency `mysql2` to `^3.0.0`.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/backend-app-api@0.6.0-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1

## 0.3.0

### Minor Changes

- e85aa98: drop databases after unit tests if the database instance is not running in docker

### Patch Changes

- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-app-api@0.5.11
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.3.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-app-api@0.5.11-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-app-api@0.5.11-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-app-api@0.5.11-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.3.0-next.0

### Minor Changes

- e85aa98: drop databases after unit tests if the database instance is not running in docker

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-app-api@0.5.11-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-app-api@0.5.10
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-app-api@0.5.10-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.10-next.1
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-app-api@0.5.10-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.2.9

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- b7de76a: Added support for PostgreSQL versions 15 and 16

  Also introduced a new `setDefaults(options: { ids?: TestDatabaseId[] })` static method that can be added to the `setupTests.ts` file to define the default database ids you want to use throughout your package. Usage would look like this: `TestDatabases.setDefaults({ ids: ['POSTGRES_12','POSTGRES_16'] })` and would result in PostgreSQL versions 12 and 16 being used for your tests.

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-app-api@0.5.9
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-app-api@0.5.9-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.2.9-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-app-api@0.5.9-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-app-api@0.5.9-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8

### Patch Changes

- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- bb688f7b3b: Ensure recursive deletion of temporary directories in tests
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-app-api@0.5.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1

## 0.2.8-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-app-api@0.5.8-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.2.8-next.1

### Patch Changes

- bb688f7b3b: Ensure recursive deletion of temporary directories in tests
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-app-api@0.5.8-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.8-next.0
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0

## 0.2.7

### Patch Changes

- a250ad775f: Added `createMockDirectory()` to help out with file system mocking in tests.
- 5ddc03813e: Remove third type parameter used for `MockInstance`, in order to be compatible with older versions of `@types/jest`.
- 74491c9602: Updated to import `HostDiscovery` from `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/errors@1.2.3
  - @backstage/backend-app-api@0.5.6
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.7-next.2

### Patch Changes

- a250ad775f: Added `createMockDirectory()` to help out with file system mocking in tests.
- 74491c9602: Updated to import `HostDiscovery` from `@backstage/backend-app-api`.
- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-app-api@0.5.6-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-app-api@0.5.5-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1

## 0.2.6-next.0

### Patch Changes

- 5ddc03813e: Remove third type parameter used for `MockInstance`, in order to be compatible with older versions of `@types/jest`.
- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-app-api@0.5.5-next.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/types@1.1.1

## 0.2.3

### Patch Changes

- 58cb5e5cea7b: Introduced a new utility for testing service factories, `ServiceFactoryTester`.
- 202e52c5e361: Add support for installing backend features via module imports, for example `startTestBackend({ features: [import('my-plugin')] })`.
- 9fb3b5373c45: Extended `mockService` to also include mocked variants, for example `mockServices.lifecycle.mock()`. The returned mocked implementation will have a `factory` property which is a service factory for itself. You can also pass a partial implementation of the service to the mock function to use a mock implementation of specific methods.
- eb1594da5812: Serialize test database shutdown, and add logging
- Updated dependencies
  - @backstage/backend-app-api@0.5.3
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3

## 0.2.3-next.3

### Patch Changes

- 202e52c5e361: Add support for installing backend features via module imports, for example `startTestBackend({ features: [import('my-plugin')] })`.
- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.3
  - @backstage/config@1.1.0-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.2.3-next.2

### Patch Changes

- 58cb5e5cea7b: Introduced a new utility for testing service factories, `ServiceFactoryTester`.
- Updated dependencies
  - @backstage/backend-app-api@0.5.3-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-app-api@0.5.3-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/types@1.1.0

## 0.2.2-next.0

### Patch Changes

- 9fb3b5373c45: Extended `mockService` to also include mocked variants, for example `mockServices.lifecycle.mock()`. The returned mocked implementation will have a `factory` property which is a service factory for itself. You can also pass a partial implementation of the service to the mock function to use a mock implementation of specific methods.
- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-app-api@0.5.2-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.0

### Minor Changes

- b9c57a4f857e: **BREAKING**: Renamed `mockServices.config` to `mockServices.rootConfig`.
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

- ae9304818136: Add needed constants and constructs to support PostgreSQL version 14 as test database
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-app-api@0.5.0
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.0-next.2
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.2.0-next.1

### Minor Changes

- b9c57a4f857e: **BREAKING**: Renamed `mockServices.config` to `mockServices.rootConfig`.

### Patch Changes

- ae9304818136: Add needed constants and constructs to support PostgreSQL version 14 as test database
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-app-api@0.5.0-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.1.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.6-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0

## 0.1.39

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-app-api@0.4.5
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16

## 0.1.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-app-api@0.4.5-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0

## 0.1.38

### Patch Changes

- 68a21956ef52: Remove reference to deprecated import
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/backend-app-api@0.4.4
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/config@1.0.8

## 0.1.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-app-api@0.4.4-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2

## 0.1.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-app-api@0.4.4-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.4-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0

## 0.1.37

### Patch Changes

- 63af7f6d53f: Allow specifying custom Docker registry for database tests
- b1eb268bf9d: Added `POSTGRES_11` and `POSTGRES_12` as supported test database IDs.
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-app-api@0.4.3
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-app-api@0.4.3-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.1.37-next.0

### Patch Changes

- b1eb268bf9d: Added `POSTGRES_11` and `POSTGRES_12` as supported test database IDs.
- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-app-api@0.4.3-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.36

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-app-api@0.4.2
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.36-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.2
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2

## 0.1.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1

## 0.1.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.4.2-next.0
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0

## 0.1.35

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/backend-app-api@0.4.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.35-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-app-api@0.4.1-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.35-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-app-api@0.4.1-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 0.1.35-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-app-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0

## 0.1.34

### Patch Changes

- baf6e4c96a: Removed unnecessary `@backstage/cli` dependency.
- c51efce2a0: Update docs to always use `yarn add --cwd` for app & backend
- 1835311713: Added explicit return type signature for `mockServices.config()`.
- e716946103: Updated usage of the lifecycle service.
- 7e7557a2be: Updated the `mockServices.rootLogger` options to accept a single level option instead.
- 610d65e143: Updates to match new `BackendFeature` type.
- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- b86efa2d04: Updated usage of `ServiceFactory`.
- 17b573e4be: The new backend system testing utilities have now been marked as stable API.
- f1adb2e36b: Removed the `ref` from all `mockServices`.
- d0901c9ba4: All mock service factories and mock service implementations are now available via the new experimental `mockServices` export.
- 71a5ec0f06: Updated usages of `LogMeta`.
- Updated dependencies
  - @backstage/backend-app-api@0.4.0
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11

## 0.1.34-next.2

### Patch Changes

- baf6e4c96a: Removed unnecessary `@backstage/cli` dependency.
- 1835311713: Added explicit return type signature for `mockServices.config()`.
- e716946103: Updated usage of the lifecycle service.
- 7e7557a2be: Updated the `mockServices.rootLogger` options to accept a single level option instead.
- 610d65e143: Updates to match new `BackendFeature` type.
- e412d33025: Use the new `*ServiceFactory` exports from `@backstage/backend-app-api`
- f1adb2e36b: Removed the `ref` from all `mockServices`.
- 71a5ec0f06: Updated usages of `LogMeta`.
- Updated dependencies
  - @backstage/backend-app-api@0.4.0-next.2
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.2-next.0
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-app-api@0.3.2-next.1
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11-next.1

## 0.1.34-next.0

### Patch Changes

- d0901c9ba4: All mock service factories and mock service implementations are now available via the new experimental `mockServices` export.
- Updated dependencies
  - @backstage/backend-app-api@0.3.2-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0
  - @backstage/cli@0.22.1
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.32

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- a3ec2f32ea: The `startTestBackend` setup now includes default implementations for all core services.
- 483e907eaf: Internal updates of `createServiceFactory` from `@backstage/backend-plugin-api`.
- 51b7a7ed07: The backend started by `startTestBackend` now has default implementations of all core services. It now also returns a `TestBackend` instance, which provides access to the underlying `server` that can be used with testing libraries such as `supertest`.
- f23eef3aa2: Updated dependency `better-sqlite3` to `^8.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/cli@0.22.1
  - @backstage/backend-common@0.18.0
  - @backstage/backend-app-api@0.3.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9

## 0.1.32-next.2

### Patch Changes

- 015a6dced6: Updated to make sure that service implementations replace default service implementations.
- a3ec2f32ea: The `startTestBackend` setup now includes default implementations for all core services.
- f23eef3aa2: Updated dependency `better-sqlite3` to `^8.0.0`.
- Updated dependencies
  - @backstage/backend-app-api@0.3.0-next.1
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/cli@0.22.1-next.2
  - @backstage/config@1.0.6-next.0

## 0.1.32-next.1

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/cli@0.22.1-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## 0.1.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.1-next.0
  - @backstage/backend-app-api@0.2.4
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/config@1.0.5

## 0.1.31

### Patch Changes

- afa3bf5657: Backends started with `startTestBackend` are now automatically stopped after all tests have run.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-app-api@0.2.4
  - @backstage/cli@0.22.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/config@1.0.5

## 0.1.31-next.4

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.0-next.4
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-app-api@0.2.4-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.3

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.21.2-next.3
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.2.4-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/cli@0.21.2-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/cli@0.21.2-next.1
  - @backstage/backend-app-api@0.2.4-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/config@1.0.5-next.1

## 0.1.31-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/cli@0.21.2-next.0
  - @backstage/backend-app-api@0.2.4-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.30

### Patch Changes

- e13cd3feaf: Updated dependency `msw` to `^0.48.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/cli@0.21.0
  - @backstage/backend-app-api@0.2.3
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/config@1.0.4

## 0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/cli@0.21.0-next.1
  - @backstage/backend-app-api@0.2.3-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/config@1.0.4-next.0

## 0.1.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/cli@0.21.0-next.0
  - @backstage/backend-app-api@0.2.3-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/config@1.0.4-next.0

## 0.1.29

### Patch Changes

- 72549952d1: Fixed handling of root scoped services in `startTestBackend`.
- e91e8e9c55: Increased test database max connection pool size to reduce the risk of resource exhaustion.
- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/cli@0.20.0
  - @backstage/backend-app-api@0.2.2
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/config@1.0.3

## 0.1.29-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/cli@0.20.0-next.2
  - @backstage/backend-app-api@0.2.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/config@1.0.3-next.2

## 0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.20.0-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-app-api@0.2.2-next.1
  - @backstage/config@1.0.3-next.1

## 0.1.29-next.0

### Patch Changes

- 72549952d1: Fixed handling of root scoped services in `startTestBackend`.
- e91e8e9c55: Increased test database max connection pool size to reduce the risk of resource exhaustion.
- Updated dependencies
  - @backstage/backend-app-api@0.2.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/cli@0.20.0-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0

## 0.1.28

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/cli@0.19.0
  - @backstage/backend-app-api@0.2.1
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/config@1.0.2

## 0.1.28-next.3

### Patch Changes

- 854ba37357: Updated to support new `ServiceFactory` formats.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-app-api@0.2.1-next.2
  - @backstage/cli@0.19.0-next.3
  - @backstage/backend-common@0.15.1-next.3

## 0.1.28-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/cli@0.19.0-next.2
  - @backstage/backend-app-api@0.2.1-next.1
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/backend-common@0.15.1-next.2

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/cli@0.19.0-next.1

## 0.1.28-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- de3347ca74: Updated usages of `ServiceFactory`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/cli@0.18.2-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/backend-app-api@0.2.1-next.0

## 0.1.27

### Patch Changes

- 0599732ec0: Refactored experimental backend system with new type names.
- 56e1b4b89c: Added alpha test helpers for the new experimental backend system.
- Updated dependencies
  - @backstage/cli@0.18.1
  - @backstage/backend-common@0.15.0
  - @backstage/backend-app-api@0.2.0
  - @backstage/backend-plugin-api@0.1.1

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/cli@0.18.1-next.0

## 0.1.26

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/cli@0.18.0

## 0.1.26-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/cli@0.18.0-next.3

## 0.1.26-next.2

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/cli@0.18.0-next.2

## 0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.18.0-next.1
  - @backstage/backend-common@0.14.1-next.1

## 0.1.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/cli@0.17.3-next.0

## 0.1.25

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/cli@0.17.2
  - @backstage/backend-common@0.14.0

## 0.1.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.17.2-next.2
  - @backstage/backend-common@0.14.0-next.2

## 0.1.25-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/cli@0.17.2-next.1
  - @backstage/backend-common@0.13.6-next.1

## 0.1.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.17.2-next.0
  - @backstage/backend-common@0.13.6-next.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/cli@0.17.1
  - @backstage/config@1.0.1

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/cli@0.17.1-next.2

## 0.1.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/cli@0.17.1-next.0

## 0.1.23

### Patch Changes

- 0654c87cf2: `TestDatabases.create` will no longer set up an `afterAll` test handler if no databases are supported.
- Updated dependencies
  - @backstage/cli@0.17.0
  - @backstage/backend-common@0.13.2

## 0.1.23-next.1

### Patch Changes

- 0654c87cf2: `TestDatabases.create` will no longer set up an `afterAll` test handler if no databases are supported.
- Updated dependencies
  - @backstage/cli@0.17.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.16.1-next.0
  - @backstage/backend-common@0.13.2-next.0

## 0.1.22

### Patch Changes

- 89c7e47967: Minor README update
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- Updated dependencies
  - @backstage/cli@0.16.0
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.1.21

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 3c2bc73901: Add `setupRequestMockHandlers` which sets up a good `msw` server foundation, copied from `@backstage/test-utils` which is a frontend-only package and should not be used from backends.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/cli@0.15.2

## 0.1.21-next.0

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 3c2bc73901: Add `setupRequestMockHandlers` which sets up a good `msw` server foundation, copied from `@backstage/test-utils` which is a frontend-only package and should not be used from backends.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/cli@0.15.2-next.0

## 0.1.20

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/cli@0.15.0

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/cli@0.14.1

## 0.1.18

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/cli@0.14.0
  - @backstage/backend-common@0.10.8
  - @backstage/config@0.1.14

## 0.1.17

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/cli@0.13.2
  - @backstage/backend-common@0.10.7

## 0.1.17-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- Updated dependencies
  - @backstage/cli@0.13.2-next.0
  - @backstage/backend-common@0.10.7-next.0

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.1
  - @backstage/backend-common@0.10.6

## 0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.1-next.1
  - @backstage/backend-common@0.10.6-next.0

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.1-next.0

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.13.0
  - @backstage/backend-common@0.10.5

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.12.0
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.12.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.1.13

### Patch Changes

- b1bc55405e: Bump `testcontainers` dependency to version `8.1.2`
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/backend-common@0.10.3
  - @backstage/cli@0.11.0

## 0.1.12

### Patch Changes

- 130b7aadf2: Lazy-load `testcontainers` module in order to avoid side-effects.
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/cli@0.10.4

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/cli@0.10.3

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.12
  - @backstage/cli@0.10.0

## 0.1.9

### Patch Changes

- e21e3c6102: Bumping minimum requirements for `dockerode` and `testcontainers`
- Updated dependencies
  - @backstage/cli@0.9.0
  - @backstage/backend-common@0.9.10

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/cli@0.8.0

## 0.1.7

### Patch Changes

- d1da88a19: Properly export all used types.
- Updated dependencies
  - @backstage/config@0.1.9
  - @backstage/backend-common@0.9.2
  - @backstage/cli@0.7.11

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.1.5

### Patch Changes

- 524045758: Make sure that the unique databases names generated by `TestDatabases.create()`
  don't collide.
- Updated dependencies
  - @backstage/backend-common@0.8.9
  - @backstage/cli@0.7.8

## 0.1.4

### Patch Changes

- f7134c368: bump sqlite3 to 5.0.1
- Updated dependencies
  - @backstage/backend-common@0.8.5

## 0.1.3

### Patch Changes

- 772dbdb51: Deprecates `SingleConnectionDatabaseManager` and provides an API compatible database
  connection manager, `DatabaseManager`, which allows developers to configure database
  connections on a per plugin basis.

  The `backend.database` config path allows you to set `prefix` to use an
  alternate prefix for automatically generated database names, the default is
  `backstage_plugin_`. Use `backend.database.plugin.<pluginId>` to set plugin
  specific database connection configuration, e.g.

  ```yaml
  backend:
    database:
      client: 'pg',
      prefix: 'custom_prefix_'
      connection:
        host: 'localhost'
        user: 'foo'
        password: 'bar'
      plugin:
        catalog:
          connection:
            database: 'database_name_overriden'
        scaffolder:
          client: 'sqlite3'
          connection: ':memory:'
  ```

  Migrate existing backstage installations by swapping out the database manager in the
  `packages/backend/src/index.ts` file as shown below:

  ```diff
  import {
  -  SingleConnectionDatabaseManager,
  +  DatabaseManager,
  } from '@backstage/backend-common';

  // ...

  function makeCreateEnv(config: Config) {
    // ...
  -  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
  +  const databaseManager = DatabaseManager.fromConfig(config);
    // ...
  }
  ```

- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/cli@0.7.1

## 0.1.2

### Patch Changes

- 0711954a9: Skip running docker tests unless in CI
- Updated dependencies [9cd3c533c]
- Updated dependencies [92963779b]
- Updated dependencies [7f7443308]
- Updated dependencies [21e8ebef5]
- Updated dependencies [eda9dbd5f]
  - @backstage/cli@0.7.0
  - @backstage/backend-common@0.8.2
