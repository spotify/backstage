---
---
# FeatureFlagsApi

The FeatureFlagsApi type is defined at
[packages/core-api/src/apis/definitions/FeatureFlagsApi.ts:60](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L60).

The following Utility API implements this type:
[featureFlagsApiRef](./README.md#featureflags)

## Members

### registerFlag()

Registers a new feature flag. Once a feature flag has been registered it can be
toggled by users, and read back to enable or disable features.

<pre>
registerFlag(flag: <a href="#featureflag">FeatureFlag</a>): void
</pre>

### getRegisteredFlags()

Get a list of all registered flags.

<pre>
getRegisteredFlags(): <a href="#featureflag">FeatureFlag</a>[]
</pre>

### isActive()

Whether the feature flag with the given name is currently activated for the
user.

<pre>
isActive(name: string): boolean
</pre>

### save()

Save the user's choice of feature flag states.

<pre>
save(options: <a href="#featureflagssaveoptions">FeatureFlagsSaveOptions</a>): void
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### FeatureFlag

The feature flags API is used to toggle functionality to users across plugins
and Backstage.

Plugins can use this API to register feature flags that they have available for
users to enable/disable, and this API will centralize the current user's state
of which feature flags they would like to enable.

This is ideal for Backstage plugins, as well as your own App, to trial
incomplete or unstable upcoming features. Although there will be a common
interface for users to enable and disable feature flags, this API acts as
another way to enable/disable.

```ts
export type FeatureFlag = {
  name: string;
  pluginId: string;
}
```

Defined at
[packages/core-api/src/apis/definitions/FeatureFlagsApi.ts:31](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L31).

Referenced by: [registerFlag](#registerflag),
[getRegisteredFlags](#getregisteredflags).

### FeatureFlagState

```ts
export enum FeatureFlagState {
  None = 0,
  Active = 1,
}
```

Defined at
[packages/core-api/src/apis/definitions/FeatureFlagsApi.ts:36](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L36).

Referenced by: [FeatureFlagsSaveOptions](#featureflagssaveoptions).

### FeatureFlagsSaveOptions

Options to use when saving feature flags.

```tsx
export type FeatureFlagsSaveOptions = {
  /**
   * The new feature flag states to save.
   */
  states: Record&lt;string, <a href="#featureflagstate">FeatureFlagState</a>&gt;;

  /**
   * Whether the saves states should be merged into the existing ones, or replace them.
   *
   * Defaults to false.
   */
  merge?: boolean;
}
```

Defined at
[packages/core-api/src/apis/definitions/FeatureFlagsApi.ts:44](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/FeatureFlagsApi.ts#L44).

Referenced by: [save](#save).
