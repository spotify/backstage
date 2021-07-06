---
id: createPlugin-feature-flags
title: createPlugin - feature flags
description: Documentation on createPlugin - feature flags
---

The `featureFlags` object passed to the `register` function makes it possible
for plugins to register Feature Flags in Backstage for users to opt into. You
can use this to split out logic in your code for manual A/B testing, etc.

Here's a code sample:

```typescript
import { createPlugin } from '@backstage/core-plugin-api';

export default createPlugin({
  id: 'plugin-name',
  register({ featureFlags }) {
    featureFlags.register('enable-example-feature');
  },
});
```

## Using with useApi

To inspect the state of a feature flag inside your plugin, you can use the
`FeatureFlagsApi`, accessed via the `featureFlagsApiRef`. For example:

```tsx
import React from 'react';
import { Button } from '@material-ui/core';
import { featureFlagsApiRef, useApi } from '@backstage/core-plugin-api';

const ExamplePage = () => {
  const featureFlags = useApi(featureFlagsApiRef);

  return (
    <div>
      <MyPluginWidget>
      { featureFlags.isActive('enable-example-feature') && <ExperimentalPluginWidget> }
    </div>
  );
};
```
