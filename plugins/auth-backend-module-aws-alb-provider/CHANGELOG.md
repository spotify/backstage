# @backstage/plugin-auth-backend-module-aws-alb-provider

## 0.4.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.30.3-next.0

## 0.4.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/errors@1.3.2
  - @backstage/plugin-auth-node@0.7.7
  - @backstage/plugin-auth-backend@0.30.2

## 0.4.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-auth-backend@0.30.2-next.1
  - @backstage/plugin-auth-node@0.7.7-next.1

## 0.4.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-auth-backend@0.30.2-next.0
  - @backstage/plugin-auth-node@0.7.7-next.0

## 0.4.20

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.30.1
  - @backstage/plugin-auth-node@0.7.6
  - @backstage/backend-plugin-api@1.10.1

## 0.4.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.30.1-next.1
  - @backstage/plugin-auth-node@0.7.5-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0

## 0.4.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.30.1-next.0

## 0.4.19

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.30.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-auth-node@0.7.4

## 0.4.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.7.4-next.0
  - @backstage/plugin-auth-backend@0.30.0-next.0
  - @backstage/backend-plugin-api@1.10.0-next.0

## 0.4.18

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.29.2
  - @backstage/plugin-auth-node@0.7.3
  - @backstage/backend-plugin-api@1.9.3

## 0.4.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.7.3-next.0
  - @backstage/plugin-auth-backend@0.29.2-next.0
  - @backstage/backend-plugin-api@1.9.3-next.0

## 0.4.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-auth-backend@0.29.1
  - @backstage/plugin-auth-node@0.7.2

## 0.4.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.7.2-next.0
  - @backstage/plugin-auth-backend@0.29.1-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.4.16

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-auth-backend@0.29.0
  - @backstage/plugin-auth-node@0.7.1

## 0.4.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/plugin-auth-node@0.7.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/plugin-auth-backend@0.28.1-next.0

## 0.4.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-auth-node@0.7.0
  - @backstage/plugin-auth-backend@0.28.0

## 0.4.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-auth-node@0.7.0-next.2
  - @backstage/plugin-auth-backend@0.28.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2

## 0.4.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-auth-node@0.7.0-next.1
  - @backstage/plugin-auth-backend@0.28.0-next.1

## 0.4.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.28.0-next.0
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-auth-node@0.6.15-next.0
  - @backstage/errors@1.2.7

## 0.4.14

### Patch Changes

- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- 634eded: Fixed a foreign key constraint violation when issuing refresh tokens for CIMD clients, and
  prevented a failed refresh token issuance from failing the entire token exchange.
  Fixed AWS ALB auth provider incorrectly returning HTTP 500 instead of 401 for JWT validation failures,
  which caused retry loops and memory pressure under load.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/plugin-auth-backend@0.27.2
  - @backstage/plugin-auth-node@0.6.14

## 0.4.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/plugin-auth-backend@0.27.1-next.2
  - @backstage/plugin-auth-node@0.6.14-next.2

## 0.4.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.27.1-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.6.14-next.0

## 0.4.13

### Patch Changes

- 7455dae: Use node prefix on native imports
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-auth-backend@0.27.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-auth-node@0.6.13

## 0.4.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.27.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-auth-node@0.6.13-next.1

## 0.4.12-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-auth-backend@0.26.1-next.0
  - @backstage/plugin-auth-node@0.6.12-next.0
  - @backstage/errors@1.2.7

## 0.4.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.6.1
  - @backstage/plugin-auth-backend@0.26.0
  - @backstage/plugin-auth-node@0.6.11

## 0.4.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.26.0-next.0
  - @backstage/plugin-auth-node@0.6.10

## 0.4.10

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10
  - @backstage/plugin-auth-backend@0.25.7
  - @backstage/backend-plugin-api@1.6.0

## 0.4.10-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.7-next.1
  - @backstage/plugin-auth-node@0.6.10-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/errors@1.2.7

## 0.4.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.10-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-auth-backend@0.25.7-next.0
  - @backstage/errors@1.2.7

## 0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-backend@0.25.6
  - @backstage/plugin-auth-node@0.6.9

## 0.4.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-auth-backend@0.25.6-next.1
  - @backstage/plugin-auth-node@0.6.9-next.1

## 0.4.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.6-next.0
  - @backstage/plugin-auth-node@0.6.9-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7

## 0.4.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-auth-backend@0.25.5
  - @backstage/plugin-auth-node@0.6.8

## 0.4.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-auth-backend@0.25.5-next.0
  - @backstage/plugin-auth-node@0.6.8-next.0

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.4
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/backend-plugin-api@1.4.3

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.7-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-auth-backend@0.25.4-next.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.3
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/backend-plugin-api@1.4.2

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.3-next.0
  - @backstage/plugin-auth-node@0.6.6-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/errors@1.2.7

## 0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-auth-node@0.6.5

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-auth-backend@0.25.2-next.0
  - @backstage/plugin-auth-node@0.6.5-next.0

## 0.4.4

### Patch Changes

- c83cd8b: Fixed some circular or otherwise unclear imports
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.25.1

## 0.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.25.1-next.1

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-auth-backend@0.25.1-next.0
  - @backstage/plugin-auth-node@0.6.4-next.0

## 0.4.3

### Patch Changes

- 5cc1f7f: Introduce `dangerouslyAllowSignInWithoutUserInCatalog` auth resolver config.
- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0
  - @backstage/plugin-auth-node@0.6.3
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/errors@1.2.7

## 0.4.3-next.2

### Patch Changes

- 5cc1f7f: Introduce `dangerouslyAllowSignInWithoutUserInCatalog` auth resolver config.
- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0-next.2
  - @backstage/plugin-auth-node@0.6.3-next.2
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/errors@1.2.7

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-auth-node@0.6.3-next.0
  - @backstage/errors@1.2.7

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.5
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/plugin-auth-node@0.6.2
  - @backstage/errors@1.2.7

## 0.4.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.5-next.2
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.6.1

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.5-next.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/errors@1.2.7

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.5-next.0
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/errors@1.2.7

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-auth-backend@0.24.4
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/errors@1.2.7

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.24.4-next.2
  - @backstage/plugin-auth-node@0.6.1-next.1

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/plugin-auth-backend@0.24.4-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/errors@1.2.7

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.4-next.0
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0

## 0.4.0

### Minor Changes

- 61f464e: Added `auth.providers.<providerId>.sessionDuration` config for auth providers to allow the lifespan of user sessions to be configured.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.24.3

## 0.4.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-auth-backend@0.24.3-next.3
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/errors@1.2.7

## 0.4.0-next.2

### Minor Changes

- 61f464e: Added `auth.providers.<providerId>.sessionDuration` config for auth providers to allow the lifespan of user sessions to be configured.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.24.3-next.2

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.24.3-next.1
  - @backstage/plugin-auth-node@0.5.7-next.0

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-backend@0.24.3-next.0
  - @backstage/plugin-auth-node@0.5.7-next.0

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/plugin-auth-backend@0.24.2
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/errors@1.2.7

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-backend@0.24.2-next.1
  - @backstage/plugin-auth-node@0.5.6-next.1

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/plugin-auth-backend@0.24.2-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/errors@1.2.6

## 0.3.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.1
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/errors@1.2.6

## 0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-backend@0.24.1-next.2
  - @backstage/plugin-auth-node@0.5.5-next.2

## 0.3.1-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.1-next.1
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/errors@1.2.5

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-auth-backend@0.24.1-next.0

## 0.3.0

### Minor Changes

- 75168e3: **BREAKING**: The AWS ALB `fullProfile` will no longer have the its username or email converted to lowercase. This is to ensure unique handling of the users. You may need to update and configure a custom sign-in resolver or profile transform as a result.

### Patch Changes

- 5d74716: Remove unused backend-common dependency
- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.0
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/errors@1.2.5

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.0-next.2
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/errors@1.2.4

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.24.0-next.1
  - @backstage/plugin-auth-node@0.5.4-next.1

## 0.3.0-next.0

### Minor Changes

- 75168e3: **BREAKING**: The AWS ALB `fullProfile` will no longer have the its username or email converted to lowercase. This is to ensure unique handling of the users. You may need to update and configure a custom sign-in resolver or profile transform as a result.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.24.0-next.0
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/errors@1.2.4

## 0.2.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-auth-backend@0.23.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/errors@1.2.4

## 0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.23.1-next.1

## 0.2.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-auth-backend@0.23.1-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/errors@1.2.4

## 0.2.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- ecbc47e: Fix a bug where the signer was checked from the payload instead of the header
- 8d1fb8d: Throw correct error when email is missing from the claims
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/plugin-auth-backend@0.23.0
  - @backstage/errors@1.2.4

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/plugin-auth-backend@0.23.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/errors@1.2.4

## 0.2.0-next.1

### Patch Changes

- 8d1fb8d: Throw correct error when email is missing from the claims
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.23.0-next.1

## 0.2.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- ecbc47e: Fix a bug where the signer was checked from the payload instead of the header
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-auth-backend@0.23.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/errors@1.2.4

## 0.1.15

### Patch Changes

- c8f1cae: Add `signIn` to authentication provider configuration schema
- 4ea354f: Added a `signer` configuration option to validate against the token claims. We strongly recommend that you set this value (typically on the format `arn:aws:elasticloadbalancing:us-east-2:123456789012:loadbalancer/app/my-load-balancer/1234567890123456`) to ensure that the auth provider can safely check the authenticity of any incoming tokens.

  Example:

  ```diff
   auth:
     providers:
       awsalb:
         # this is the URL of the IdP you configured
         issuer: 'https://example.okta.com/oauth2/default'
         # this is the ARN of your ALB instance
  +      signer: 'arn:aws:elasticloadbalancing:us-east-2:123456789012:loadbalancer/app/my-load-balancer/1234567890123456'
         # this is the region where your ALB instance resides
         region: 'us-west-2'
         signIn:
           resolvers:
             # typically you would pick one of these
             - resolver: emailMatchingUserEntityProfileEmail
             - resolver: emailLocalPartMatchingUserEntityName
  ```

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-auth-backend@0.22.10
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/errors@1.2.4

## 0.1.15-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.22.10-next.3
  - @backstage/plugin-auth-node@0.5.0-next.3

## 0.1.15-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-auth-backend@0.22.10-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/errors@1.2.4

## 0.1.15-next.1

### Patch Changes

- c8f1cae: Add `signIn` to authentication provider configuration schema
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/plugin-auth-backend@0.22.10-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.1

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.22.10-next.0
  - @backstage/plugin-auth-node@0.4.18-next.0

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/plugin-auth-backend@0.22.9
  - @backstage/errors@1.2.4

## 0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.22.9-next.1
  - @backstage/plugin-auth-node@0.4.17-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-backend@0.22.8-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/errors@1.2.4

## 0.1.11

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-auth-backend@0.22.6
  - @backstage/errors@1.2.4

## 0.1.11-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-auth-backend@0.22.6-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/errors@1.2.4

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-auth-backend@0.22.6-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/errors@1.2.4

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-backend@0.22.6-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-auth-backend@0.22.6-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/errors@1.2.4

## 0.1.10

### Patch Changes

- 4a0577e: fix: Move config declarations to appropriate auth backend modules
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-backend@0.22.5
  - @backstage/plugin-auth-node@0.4.13

## 0.1.10-next.2

### Patch Changes

- 4a0577e: fix: Move config declarations to appropriate auth backend modules
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-auth-backend@0.22.5-next.2

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-backend@0.22.5-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.22.5-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/errors@1.2.4

## 0.1.9

### Patch Changes

- f286d59: Added support for AWS GovCloud (US) regions
- 30f5a51: Added `authModuleAwsAlbProvider` as a default export.

  It can now be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-aws-alb-provider'));`

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-auth-backend@0.22.4
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/errors@1.2.4

## 0.1.9-next.1

### Patch Changes

- 30f5a51: Added `authModuleAwsAlbProvider` as a default export.

  It can now be used like this in your backend: `backend.add(import('@backstage/plugin-auth-backend-module-aws-alb-provider'));`

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/plugin-auth-backend@0.22.4-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/errors@1.2.4

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.22.4-next.0
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.22.3
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/errors@1.2.4

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-backend@0.22.2
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/errors@1.2.4

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.22.1

## 0.1.5

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/plugin-auth-backend@0.22.0

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-backend@0.22.0-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/errors@1.2.4-next.0

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-backend@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.4-next.0

### Patch Changes

- 2af5354: Bump dependency `jose` to v5
- b1b012d: Fix issue with `providerInfo` not being set properly for some proxy providers, by making `providerInfo` an explicit optional return from `authenticate`
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-auth-backend@0.22.0-next.0

## 0.1.0

### Minor Changes

- 23a98f8: Migrated the AWS ALB auth provider to new `@backstage/plugin-auth-backend-module-aws-alb-provider` module package.

### Patch Changes

- d309cad: Refactored to use the `jose` library for JWT handling.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-backend@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/errors@1.2.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-auth-backend@0.21.0-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/errors@1.2.3

## 0.1.0-next.1

### Patch Changes

- d309cad: Refactored to use the `jose` library for JWT handling.
- Updated dependencies
  - @backstage/plugin-auth-backend@0.21.0-next.2
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 23a98f8: Migrated the AWS ALB auth provider to new `@backstage/plugin-auth-backend-module-aws-alb-provider` module package.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/plugin-auth-backend@0.20.4-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.4-next.1
