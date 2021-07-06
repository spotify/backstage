---
id: createPlugin
title: createPlugin
description: Documentation on createPlugin
---

Takes a plugin config as an argument and returns a new plugin.

## Plugin Config

```typescript
function createPlugin(config: PluginConfig): BackstagePlugin;

type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

type PluginHooks = {
  featureFlags: FeatureFlagsHooks;
};
```

- [Read more about feature flags here](createPlugin-feature-flags.md)

## Example Uses

### Creating a basic plugin

Showcasing adding a feature flag.

```jsx
import { createPlugin } from '@backstage/core-plugin-api';

export default createPlugin({
  id: 'new-plugin',
  register({ router, featureFlags }) {
    featureFlags.register('enable-example-component');
  },
});
```
