# explore

Welcome to the explore plugin!
This plugin helps to visualize the domains and tools in your ecosystem.

## Getting started

To install the plugin, add and bind the route in `App.tsx`:

```typescript
import { ExplorePage, explorePlugin } from '@backstage/plugin-explore';

...

bindRoutes({ bind }) {
  ...
  bind(explorePlugin.externalRoutes, {
    catalogEntity: catalogPlugin.routes.catalogEntity,
  });
},

...

<Route path="/explore" element={<ExplorePage />} />
```

And add a link to the sidebar in `Root.tsx`:

```typescript
import LayersIcon from '@material-ui/icons/Layers';

...

<SidebarItem icon={LayersIcon} to="explore" text="Explore" />
```

## Customization

Create a custom explore page in `packages/app/src/components/explore/ExplorePage.tsx`.

```tsx
import {
  DomainExplorerContent,
  ExploreLayout,
} from '@backstage/plugin-explore';
import React from 'react';
import { InnserSourceExplorerContent } from './InnserSourceExplorerContent';

export const ExplorePage = () => {
  return (
    <ExploreLayout
      title="Explore the ACME corp ecosystem"
      subtitle="Browse our ecosystem"
    >
      <ExploreLayout.Route path="domains" title="Domains">
        <DomainExplorerContent />
      </ExploreLayout.Route>
      <ExploreLayout.Route path="inner-source" title="InnerSource">
        <AcmeInnserSourceExplorerContent />
      </ExploreLayout.Route>
    </ExploreLayout>
  );
};

export const explorePage = <ExplorePage />;
```

Now register the new explore page in `packages/app/src/App.tsx`.

```diff
+ import { explorePage } from './components/explore/ExplorePage';

const routes = (
  <FlatRoutes>
-    <Route path="/explore" element={<ExplorePage />} />
+    <Route path="/explore" element={<ExplorePage />}>
+      {explorePage}
+    </Route>
  </FlatRoutes>
);
```
