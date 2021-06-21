---
---
# Backstage Core Utility APIs

The following is a list of all Utility APIs defined by `@backstage/core`. They
are available to use by plugins and components, and can be accessed using the
`useApi` hook, also provided by `@backstage/core`. For more information, see
https://github.com/backstage/backstage/blob/master/docs/api/utility-apis.md.

### alert

Used to report alerts and forward them to the app

Implemented type: [AlertApi](./AlertApi.md)

ApiRef:
[alertApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/AlertApi.ts#L41)

### appTheme

API Used to configure the app theme, and enumerate options

Implemented type: [AppThemeApi](./AppThemeApi.md)

ApiRef:
[appThemeApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/AppThemeApi.ts#L80)

### auth0Auth

Provides authentication towards Auth0 APIs

Implemented types: [OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[auth0AuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L275)

### config

Used to access runtime configuration

Implemented type: [Config](./Config.md)

ApiRef:
[configApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/ConfigApi.ts#L25)

### discovery

Provides service discovery of backend plugins

Implemented type: [DiscoveryApi](./DiscoveryApi.md)

ApiRef:
[discoveryApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/DiscoveryApi.ts#L44)

### error

Used to report errors and forward them to the app

Implemented type: [ErrorApi](./ErrorApi.md)

ApiRef:
[errorApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/ErrorApi.ts#L65)

### featureFlags

Used to toggle functionality in features across Backstage

Implemented type: [FeatureFlagsApi](./FeatureFlagsApi.md)

ApiRef:
[featureFlagsApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L83)

### githubAuth

Provides authentication towards GitHub APIs

Implemented types: [OAuthApi](./OAuthApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[githubAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L232)

### gitlabAuth

Provides authentication towards GitLab APIs

Implemented types: [OAuthApi](./OAuthApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[gitlabAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L262)

### googleAuth

Provides authentication towards Google APIs and identities

Implemented types: [OAuthApi](./OAuthApi.md),
[OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[googleAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L215)

### identity

Provides access to the identity of the signed in user

Implemented type: [IdentityApi](./IdentityApi.md)

ApiRef:
[identityApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/IdentityApi.ts#L53)

### microsoftAuth

Provides authentication towards Microsoft APIs and identities

Implemented types: [OAuthApi](./OAuthApi.md),
[OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[microsoftAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L289)

### oauth2

Example of how to use oauth2 custom provider

Implemented types: [OAuthApi](./OAuthApi.md),
[OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[oauth2ApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L303)

### oauthRequest

An API for implementing unified OAuth flows in Backstage

Implemented type: [OAuthRequestApi](./OAuthRequestApi.md)

ApiRef:
[oauthRequestApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/OAuthRequestApi.ts#L130)

### oidcAuth

Example of how to use oidc custom provider

Implemented types: [OAuthApi](./OAuthApi.md),
[OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[oidcAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L317)

### oktaAuth

Provides authentication towards Okta APIs

Implemented types: [OAuthApi](./OAuthApi.md),
[OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[oktaAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L245)

### oneloginAuth

Provides authentication towards OneLogin APIs and identities

Implemented types: [OAuthApi](./OAuthApi.md),
[OpenIdConnectApi](./OpenIdConnectApi.md),
[ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[oneloginAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L338)

### samlAuth

Example of how to use SAML custom provider

Implemented types: [ProfileInfoApi](./ProfileInfoApi.md),
[BackstageIdentityApi](./BackstageIdentityApi.md), [SessionApi](./SessionApi.md)

ApiRef:
[samlAuthApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/auth.ts#L331)

### storage

Provides the ability to store data which is unique to the user

Implemented type: [StorageApi](./StorageApi.md)

ApiRef:
[storageApiRef](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/StorageApi.ts#L68)
